
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Upload, Download, Filter, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimeTracking = ({ onBack, employees }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [lateArrivals, setLateArrivals] = useState([]);
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
        const lines = text.split('\n');
        const headers = lines[0].split('\t');
        
        console.log("Headers encontrados:", headers);
        
        const processedData = [];
        const lateEmployees = [];
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split('\t');
          if (row.length >= 5) {
            const empleadoNombre = row[1]?.trim(); // Nombres
            const fecha = row[3]?.trim(); // Comprobar Fecha
            const tiempo = row[4]?.trim(); // Comprobar Tiempo
            
            if (empleadoNombre && fecha && tiempo) {
              // Extraer solo la parte de la hora (HH:MM:SS)
              const timeOnly = tiempo.includes(' ') ? tiempo.split(' ')[1] : tiempo;
              const [hours, minutes] = timeOnly.split(':').map(Number);
              
              if (!isNaN(hours) && !isNaN(minutes)) {
                const timeInMinutes = hours * 60 + minutes;
                const startRange = 7 * 60 + 45; // 7:45
                const endRange = 10 * 60; // 10:00
                const onTimeLimit = 8 * 60; // 8:00 - hora de entrada
                
                // Solo procesar registros entre 7:45 y 10:00
                if (timeInMinutes >= startRange && timeInMinutes <= endRange) {
                  // Calcular llegada tardía (después de 8:00)
                  const latenessMinutes = Math.max(0, timeInMinutes - onTimeLimit);
                  
                  // Buscar datos del empleado
                  const empleado = employees?.find(emp => 
                    emp.nombre.toLowerCase().includes(empleadoNombre.toLowerCase()) ||
                    empleadoNombre.toLowerCase().includes(emp.nombre.toLowerCase())
                  );
                  
                  const salario = empleado?.salario || 1300000; // Salario por defecto
                  const valorHora = salario / 230;
                  const descuento = (latenessMinutes / 60) * valorHora;
                  
                  const record = {
                    id: Date.now() + i,
                    nombre: empleadoNombre,
                    fecha: fecha,
                    tiempo: timeOnly,
                    valorHora: valorHora,
                    tiempoTarde: latenessMinutes,
                    descuento: descuento,
                    isLate: latenessMinutes > 0
                  };
                  
                  processedData.push(record);
                  
                  // Si llegó tarde, agregarlo a la lista de tardanzas
                  if (latenessMinutes > 0) {
                    lateEmployees.push(record);
                  }
                }
              }
            }
          }
        }
        
        setAttendanceData(processedData);
        setFilteredData(processedData);
        setLateArrivals(lateEmployees);
        
        toast({
          title: "Archivo procesado",
          description: `Se procesaron ${processedData.length} registros. ${lateEmployees.length} llegadas tardías detectadas.`,
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
      const recordDate = new Date(record.fecha);
      return recordDate >= startDate && recordDate <= endDate;
    });

    setFilteredData(filtered);
    
    // Actualizar también las llegadas tardías filtradas
    const filteredLate = filtered.filter(record => record.isLate);
    setLateArrivals(filteredLate);
    
    toast({
      title: "Filtro aplicado",
      description: `Mostrando ${filtered.length} registros del período seleccionado. ${filteredLate.length} llegadas tardías.`,
    });
  };

  // Exportar a Excel resaltando las llegadas tardías
  const handleExportToExcel = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive"
      });
      return;
    }

    // Crear CSV con indicador de llegadas tardías
    const headers = ["Nombre", "Fecha", "Hora", "Valor Hora", "Min. Tarde", "Descuento", "Llegada Tardia"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        row.nombre,
        row.fecha,
        row.tiempo,
        row.valorHora.toFixed(0),
        row.tiempoTarde,
        row.descuento.toFixed(0),
        row.isLate ? "SÍ" : "NO"
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
      description: `Reporte descargado con ${lateArrivals.length} llegadas tardías resaltadas`,
    });
  };

  const totalDescuentos = filteredData.reduce((total, record) => total + record.descuento, 0);
  const totalLateMinutes = lateArrivals.reduce((total, record) => total + record.tiempoTarde, 0);

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
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Registros Procesados</div>
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
              <div className="text-2xl font-bold text-yellow-600">{totalLateMinutes}</div>
              <div className="text-sm text-gray-600">Min. Acumulados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.length > 0 ? Math.round(((filteredData.length - lateArrivals.length) / filteredData.length) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Puntualidad</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${totalDescuentos.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Descuentos</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de llegadas tardías */}
        {lateArrivals.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">
                  {lateArrivals.length} empleados con llegadas tardías detectadas en el período seleccionado
                </span>
              </div>
            </CardContent>
          </Card>
        )}

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
                    Formato esperado: ID Empleado | Nombres | Departamento | Fecha | Tiempo...
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
                    Exportar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de datos procesados */}
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Asistencia (7:45 AM - 10:00 AM)</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Carga un archivo del huellero para ver los datos</p>
                <p className="text-sm mt-2">Campos requeridos: Nombres, Comprobar Fecha, Comprobar Tiempo</p>
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
                    <TableHead>Descuento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record) => (
                    <TableRow 
                      key={record.id}
                      className={record.isLate ? "bg-red-50 border-red-200" : ""}
                    >
                      <TableCell className="font-medium">
                        {record.nombre}
                        {record.isLate && (
                          <AlertTriangle className="inline h-4 w-4 text-red-500 ml-2" />
                        )}
                      </TableCell>
                      <TableCell>{record.fecha}</TableCell>
                      <TableCell className={record.isLate ? "text-red-600 font-medium" : ""}>
                        {record.tiempo}
                      </TableCell>
                      <TableCell>${record.valorHora.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.tiempoTarde > 0 
                            ? "bg-red-100 text-red-800 font-medium" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {record.tiempoTarde} min
                        </span>
                      </TableCell>
                      <TableCell className={`font-bold ${record.isLate ? "text-red-600" : "text-green-600"}`}>
                        ${record.descuento.toLocaleString()}
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
