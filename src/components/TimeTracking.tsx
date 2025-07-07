
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Upload, Download, Filter, FileSpreadsheet, AlertTriangle, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimeTracking = ({ onBack, employees }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [lateArrivals, setLateArrivals] = useState([]);
  const [lunchViolations, setLunchViolations] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Función para procesar el archivo del huellero
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Detectar el separador (tab o punto y coma)
        const separator = lines[0].includes('\t') ? '\t' : ';';
        const headers = lines[0].split(separator);
        
        console.log("Headers encontrados:", headers);
        console.log("Separador detectado:", separator === '\t' ? 'TAB' : 'PUNTO Y COMA');
        
        const processedData = [];
        const lateEmployees = [];
        const lunchViolators = [];
        
        // Agrupar registros por empleado y fecha para detectar entrada y salida de almuerzo
        const employeeRecords = {};
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(separator);
          if (row.length >= 5) {
            const empleadoNombre = row[1]?.trim();
            const fecha = row[3]?.trim();
            const tiempo = row[4]?.trim();
            
            if (empleadoNombre && fecha && tiempo) {
              const timeOnly = tiempo.includes(' ') ? tiempo.split(' ')[1] : tiempo;
              const [hours, minutes] = timeOnly.split(':').map(Number);
              
              if (!isNaN(hours) && !isNaN(minutes)) {
                const timeInMinutes = hours * 60 + minutes;
                const employeeKey = `${empleadoNombre}-${fecha}`;
                
                if (!employeeRecords[employeeKey]) {
                  employeeRecords[employeeKey] = [];
                }
                
                employeeRecords[employeeKey].push({
                  nombre: empleadoNombre,
                  fecha: fecha,
                  tiempo: timeOnly,
                  timeInMinutes: timeInMinutes
                });
              }
            }
          }
        }
        
        // Procesar cada empleado por día
        Object.keys(employeeRecords).forEach(key => {
          const records = employeeRecords[key].sort((a, b) => a.timeInMinutes - b.timeInMinutes);
          const empleado = employees?.find(emp => 
            emp.nombre.toLowerCase().includes(records[0].nombre.toLowerCase()) ||
            records[0].nombre.toLowerCase().includes(emp.nombre.toLowerCase())
          );
          
          const salario = empleado?.salario || 1300000;
          const valorHora = salario / 230;
          
          records.forEach((record, index) => {
            const { nombre, fecha, tiempo, timeInMinutes } = record;
            
            // Verificar llegadas tardías (8:05 - 8:30 AM)
            const lateStartRange = 8 * 60 + 5; // 8:05 AM
            const lateEndRange = 8 * 60 + 30; // 8:30 AM
            const onTimeLimit = 8 * 60; // 8:00 AM
            
            let isLateArrival = false;
            let latenessMinutes = 0;
            let lateDiscount = 0;
            
            if (timeInMinutes >= lateStartRange && timeInMinutes <= lateEndRange) {
              isLateArrival = true;
              latenessMinutes = timeInMinutes - onTimeLimit;
              lateDiscount = (latenessMinutes / 60) * valorHora;
            }
            
            // Verificar almuerzo (salidas después de 12:00 PM)
            let isLunchViolation = false;
            let lunchExtraMinutes = 0;
            let lunchDiscount = 0;
            let lunchOutTime = '';
            let lunchReturnTime = '';
            
            if (timeInMinutes >= 12 * 60) { // Salida después de 12:00 PM
              // Buscar el siguiente registro (regreso del almuerzo)
              const nextRecord = records[index + 1];
              if (nextRecord && nextRecord.timeInMinutes > timeInMinutes) {
                const lunchDuration = nextRecord.timeInMinutes - timeInMinutes;
                const allowedLunchTime = 60; // 1 hora
                
                if (lunchDuration > allowedLunchTime) {
                  isLunchViolation = true;
                  lunchExtraMinutes = lunchDuration - allowedLunchTime;
                  lunchDiscount = (lunchExtraMinutes / 60) * valorHora;
                  lunchOutTime = tiempo;
                  lunchReturnTime = nextRecord.tiempo;
                }
              }
            }
            
            const totalDiscount = lateDiscount + lunchDiscount;
            
            const processedRecord = {
              id: Date.now() + Math.random(),
              nombre: nombre,
              fecha: fecha,
              tiempo: tiempo,
              valorHora: valorHora,
              tiempoTarde: latenessMinutes,
              descuentoTarde: lateDiscount,
              isLate: isLateArrival,
              // Datos de almuerzo
              lunchExtraMinutes: lunchExtraMinutes,
              lunchDiscount: lunchDiscount,
              isLunchViolation: isLunchViolation,
              lunchOutTime: lunchOutTime,
              lunchReturnTime: lunchReturnTime,
              totalDiscount: totalDiscount,
              type: isLateArrival ? 'late' : (isLunchViolation ? 'lunch' : 'normal')
            };
            
            processedData.push(processedRecord);
            
            if (isLateArrival) {
              lateEmployees.push(processedRecord);
            }
            
            if (isLunchViolation) {
              lunchViolators.push(processedRecord);
            }
          });
        });
        
        setAttendanceData(processedData);
        setFilteredData(processedData);
        setLateArrivals(lateEmployees);
        setLunchViolations(lunchViolators);
        
        toast({
          title: "Archivo procesado",
          description: `Se procesaron ${processedData.length} registros. ${lateEmployees.length} llegadas tardías y ${lunchViolators.length} excesos de almuerzo detectados.`,
        });
      } catch (error) {
        console.error("Error procesando archivo:", error);
        toast({
          title: "Error",
          description: "Error al procesar el archivo. Verifica el formato.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Filtrar por fechas
  const handleFilterByDate = () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      toast({
        title: "Error",
        description: "Selecciona ambas fechas para filtrar",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date(dateFilter.startDate);
    const endDate = new Date(dateFilter.endDate);
    
    const filtered = attendanceData.filter(record => {
      const [day, month, year] = record.fecha.split('/');
      const recordDate = new Date(year, month - 1, day);
      return recordDate >= startDate && recordDate <= endDate;
    });

    setFilteredData(filtered);
    
    const filteredLate = filtered.filter(record => record.isLate);
    const filteredLunch = filtered.filter(record => record.isLunchViolation);
    setLateArrivals(filteredLate);
    setLunchViolations(filteredLunch);
    
    toast({
      title: "Filtro aplicado",
      description: `Mostrando ${filtered.length} registros. ${filteredLate.length} llegadas tardías y ${filteredLunch.length} excesos de almuerzo.`,
    });
  };

  // Exportar a Excel con violaciones resaltadas
  const handleExportToExcel = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Nombre", "Fecha", "Hora", "Valor Hora", "Min. Tarde", "Descuento Tarde", "Min. Extra Almuerzo", "Descuento Almuerzo", "Descuento Total", "Tipo Violación"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        `"${row.nombre}"`,
        row.fecha,
        row.tiempo,
        row.valorHora.toFixed(0),
        row.tiempoTarde || 0,
        row.descuentoTarde?.toFixed(0) || 0,
        row.lunchExtraMinutes || 0,
        row.lunchDiscount?.toFixed(0) || 0,
        row.totalDiscount.toFixed(0),
        row.isLate ? "LLEGADA TARDÍA" : (row.isLunchViolation ? "EXCESO ALMUERZO" : "NORMAL")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_huellero_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportado",
      description: `Reporte descargado con ${lateArrivals.length} llegadas tardías y ${lunchViolations.length} excesos de almuerzo resaltados`,
    });
  };

  const totalDescuentos = filteredData.reduce((total, record) => total + record.totalDiscount, 0);
  const totalLateMinutes = lateArrivals.reduce((total, record) => total + record.tiempoTarde, 0);
  const totalLunchExtraMinutes = lunchViolations.reduce((total, record) => total + record.lunchExtraMinutes, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Control de Huellero</h1>
        </div>

        {/* Estadísticas del dashboard */}
        <div className="grid md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Registros</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{lateArrivals.length}</div>
              <div className="text-sm text-gray-600">Llegadas Tardías</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{lunchViolations.length}</div>
              <div className="text-sm text-gray-600">Excesos Almuerzo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalLateMinutes}</div>
              <div className="text-sm text-gray-600">Min. Tarde Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalLunchExtraMinutes}</div>
              <div className="text-sm text-gray-600">Min. Extra Almuerzo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalDescuentos.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Descuentos</div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de violaciones */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {lateArrivals.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">
                    {lateArrivals.length} llegadas tardías (8:05-8:30 AM) detectadas
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {lunchViolations.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Coffee className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-800">
                    {lunchViolations.length} excesos de tiempo de almuerzo detectados
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Carga de archivo y filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Procesar Datos del Huellero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Carga de archivo */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="excel-file">Cargar archivo del huellero (.txt/.csv/.tsv)</Label>
                  <Input
                    id="excel-file"
                    type="file"
                    accept=".txt,.csv,.tsv"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                  {isProcessing && (
                    <p className="text-sm text-blue-600 mt-2">Procesando archivo...</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: ID Empleado | Nombres | Departamento | Comprobar Fecha | Comprobar Tiempo...
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    • Llegadas tardías: 8:05-8:30 AM
                  </p>
                  <p className="text-xs text-gray-400">
                    • Control almuerzo: Salidas 12:00+ PM con retorno
                  </p>
                </div>
              </div>

              {/* Filtros por fecha */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Fecha Inicio</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={dateFilter.startDate}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Fecha Fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={dateFilter.endDate}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleFilterByDate} variant="outline" className="flex-1">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar Período
                  </Button>
                  <Button onClick={handleExportToExcel} disabled={filteredData.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de datos procesados */}
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Asistencia y Control de Almuerzo</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Carga un archivo del huellero para ver los datos</p>
                <p className="text-sm mt-2">Se analizarán llegadas tardías (8:05-8:30 AM) y excesos de almuerzo</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Valor Hora</TableHead>
                    <TableHead>Min. Tarde</TableHead>
                    <TableHead>Min. Extra Almuerzo</TableHead>
                    <TableHead>Descuento Total</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow 
                      key={record.id}
                      className={
                        record.isLate ? "bg-red-50 border-red-200" : 
                        record.isLunchViolation ? "bg-orange-50 border-orange-200" : ""
                      }
                    >
                      <TableCell className="font-medium">
                        {record.nombre}
                        {record.isLate && (
                          <AlertTriangle className="inline h-4 w-4 text-red-500 ml-2" />
                        )}
                        {record.isLunchViolation && (
                          <Coffee className="inline h-4 w-4 text-orange-500 ml-2" />
                        )}
                      </TableCell>
                      <TableCell>{record.fecha}</TableCell>
                      <TableCell className={
                        record.isLate ? "text-red-600 font-medium" : 
                        record.isLunchViolation ? "text-orange-600 font-medium" : ""
                      }>
                        {record.tiempo}
                        {record.lunchReturnTime && (
                          <div className="text-xs text-gray-500">
                            Retorno: {record.lunchReturnTime}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>${record.valorHora.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.tiempoTarde > 0 
                            ? "bg-red-100 text-red-800 font-medium" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {record.tiempoTarde || 0} min
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.lunchExtraMinutes > 0 
                            ? "bg-orange-100 text-orange-800 font-medium" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {record.lunchExtraMinutes || 0} min
                        </span>
                      </TableCell>
                      <TableCell className={`font-bold ${
                        record.totalDiscount > 0 ? "text-red-600" : "text-green-600"
                      }`}>
                        ${record.totalDiscount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {record.isLate && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Tarde
                          </span>
                        )}
                        {record.isLunchViolation && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            Almuerzo
                          </span>
                        )}
                        {!record.isLate && !record.isLunchViolation && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Normal
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeTracking;
