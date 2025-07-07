
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface EmployeeRecord {
  id: number;
  nombre: string;
  fecha: string;
  tiempo: string;
  valorHora: number;
  tiempoTarde: number;
  descuentoTarde: number;
  isLate: boolean;
  lunchExtraMinutes: number;
  lunchDiscount: number;
  isLunchViolation: boolean;
  lunchOutTime: string;
  lunchReturnTime: string;
  totalDiscount: number;
  type: string;
}

export const useTimeTrackingData = (employees: any[]) => {
  const [attendanceData, setAttendanceData] = useState<EmployeeRecord[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeRecord[]>([]);
  const [lateArrivals, setLateArrivals] = useState<EmployeeRecord[]>([]);
  const [lunchViolations, setLunchViolations] = useState<EmployeeRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFile = (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        const separator = lines[0].includes('\t') ? '\t' : ';';
        const headers = lines[0].split(separator);
        
        console.log("Headers encontrados:", headers);
        console.log("Separador detectado:", separator === '\t' ? 'TAB' : 'PUNTO Y COMA');
        
        const processedData: EmployeeRecord[] = [];
        const lateEmployees: EmployeeRecord[] = [];
        const lunchViolators: EmployeeRecord[] = [];
        
        const employeeRecords: { [key: string]: any[] } = {};
        
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
        
        Object.keys(employeeRecords).forEach(key => {
          const records = employeeRecords[key].sort((a, b) => a.timeInMinutes - b.timeInMinutes);
          const empleado = employees?.find(emp => 
            emp.nombre.toLowerCase().includes(records[0].nombre.toLowerCase()) ||
            records[0].nombre.toLowerCase().includes(emp.nombre.toLowerCase())
          );
          
          const salario = empleado?.salario || 1300000;
          const valorHora = salario / 230;
          
          // Filtrar registros válidos (eliminar duplicados muy cercanos)
          const validRecords = [];
          for (let i = 0; i < records.length; i++) {
            const currentRecord = records[i];
            const nextRecord = records[i + 1];
            
            // Si es el último registro o si hay más de 5 minutos de diferencia con el siguiente
            if (!nextRecord || Math.abs(nextRecord.timeInMinutes - currentRecord.timeInMinutes) > 5) {
              validRecords.push(currentRecord);
            }
          }
          
          // Procesar cada registro válido
          validRecords.forEach((record, index) => {
            const { nombre, fecha, tiempo, timeInMinutes } = record;
            
            // Verificar llegada tardía (8:05 - 8:30)
            const lateStartRange = 8 * 60 + 5; // 8:05
            const lateEndRange = 8 * 60 + 30;   // 8:30
            const onTimeLimit = 8 * 60;         // 8:00
            
            let isLateArrival = false;
            let latenessMinutes = 0;
            let lateDiscount = 0;
            
            if (timeInMinutes >= lateStartRange && timeInMinutes <= lateEndRange) {
              isLateArrival = true;
              latenessMinutes = timeInMinutes - onTimeLimit;
              lateDiscount = (latenessMinutes / 60) * valorHora;
            }
            
            // Verificar violación de almuerzo
            let isLunchViolation = false;
            let lunchExtraMinutes = 0;
            let lunchDiscount = 0;
            let lunchOutTime = '';
            let lunchReturnTime = '';
            
            // Solo considerar salidas a almuerzo entre 12:00 PM y 13:00 PM
            if (timeInMinutes >= 12 * 60 && timeInMinutes <= 13 * 60) {
              const nextRecord = validRecords[index + 1];
              if (nextRecord) {
                const returnTime = nextRecord.timeInMinutes;
                
                // Ignorar retornos después de las 17:30 (probablemente marca de salida)
                if (returnTime < 17 * 60 + 30) {
                  const lunchDuration = returnTime - timeInMinutes;
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
            }
            
            const totalDiscount = lateDiscount + lunchDiscount;
            
            const processedRecord: EmployeeRecord = {
              id: Date.now() + Math.random(),
              nombre: nombre,
              fecha: fecha,
              tiempo: tiempo,
              valorHora: valorHora,
              tiempoTarde: latenessMinutes,
              descuentoTarde: lateDiscount,
              isLate: isLateArrival,
              lunchExtraMinutes: lunchExtraMinutes,
              lunchDiscount: lunchDiscount,
              isLunchViolation: isLunchViolation,
              lunchOutTime: lunchOutTime,
              lunchReturnTime: lunchReturnTime,
              totalDiscount: totalDiscount,
              type: isLateArrival ? 'late' : (isLunchViolation ? 'lunch' : 'normal')
            };
            
            // Solo agregar registros con violaciones o el primer registro del día
            if (isLateArrival || isLunchViolation || index === 0) {
              processedData.push(processedRecord);
              
              if (isLateArrival) {
                lateEmployees.push(processedRecord);
              }
              
              if (isLunchViolation) {
                lunchViolators.push(processedRecord);
              }
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

  const filterByDate = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Selecciona ambas fechas para filtrar",
        variant: "destructive"
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filtered = attendanceData.filter(record => {
      const [day, month, year] = record.fecha.split('/');
      const recordDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return recordDate >= start && recordDate <= end;
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

  return {
    attendanceData,
    filteredData,
    lateArrivals,
    lunchViolations,
    isProcessing,
    processFile,
    filterByDate
  };
};
