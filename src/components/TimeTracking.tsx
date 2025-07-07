import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTimeTrackingData } from "@/hooks/useTimeTrackingData";
import DashboardStats from "./DashboardStats";
import ViolationAlerts from "./ViolationAlerts";
import FileUploadAndFilters from "./FileUploadAndFilters";
import AttendanceTable from "./AttendanceTable";

const TimeTracking = ({ onBack, employees }) => {
  const { toast } = useToast();
  const {
    filteredData,
    lateArrivals,
    lunchViolations,
    isProcessing,
    processFile,
    filterByDate
  } = useTimeTrackingData(employees);

  const handleExportToExcel = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive"
      });
      return;
    }

    // Crear CSV con formato mejorado
    const headers = ["Nombre", "Fecha", "Hora", "Min. Tarde", "Min. Extra Almuerzo", "Tipo"];
    
    // Preparar los datos ordenados por nombre y fecha
    const sortedData = [...filteredData].sort((a, b) => {
      if (a.nombre !== b.nombre) {
        return a.nombre.localeCompare(b.nombre);
      }
      // Ordenar por fecha si el nombre es igual
      const [dayA, monthA, yearA] = a.fecha.split('/').map(Number);
      const [dayB, monthB, yearB] = b.fecha.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime();
    });

    const csvRows = sortedData.map(row => {
      let tipo = "NORMAL";
      if (row.isLate && row.isLunchViolation) {
        tipo = "TARDE + EXCESO ALMUERZO";
      } else if (row.isLate) {
        tipo = "LLEGADA TARDÍA";
      } else if (row.isLunchViolation) {
        tipo = "EXCESO ALMUERZO";
      }

      return [
        `"${row.nombre}"`,
        row.fecha,
        row.lunchReturnTime ? `${row.tiempo} (Retorno: ${row.lunchReturnTime})` : row.tiempo,
        row.tiempoTarde || 0,
        row.lunchExtraMinutes || 0,
        tipo
      ].join(",");
    });

    const csvContent = [
      "# REPORTE DE CONTROL DE HUELLERO",
      `# Generado el: ${new Date().toLocaleString('es-CO')}`,
      `# Total registros: ${filteredData.length}`,
      `# Llegadas tardías: ${lateArrivals.length}`,
      `# Excesos de almuerzo: ${lunchViolations.length}`,
      "",
      headers.join(","),
      ...csvRows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `control_huellero_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportado exitosamente",
      description: `Archivo CSV descargado con formato mejorado. ${lateArrivals.length} llegadas tardías y ${lunchViolations.length} excesos de almuerzo incluidos.`,
    });
  };

  const totalDescuentos = filteredData.reduce((total, record) => total + (record.totalDiscount || 0), 0);
  const totalLateMinutes = lateArrivals.reduce((total, record) => total + (record.tiempoTarde || 0), 0);
  const totalLunchExtraMinutes = lunchViolations.reduce((total, record) => total + (record.lunchExtraMinutes || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Control de Huellero</h1>
        </div>

        <DashboardStats
          totalRecords={filteredData.length}
          lateArrivals={lateArrivals.length}
          lunchViolations={lunchViolations.length}
          totalLateMinutes={totalLateMinutes}
          totalLunchExtraMinutes={totalLunchExtraMinutes}
          totalDiscounts={totalDescuentos}
        />

        <ViolationAlerts
          lateArrivalsCount={lateArrivals.length}
          lunchViolationsCount={lunchViolations.length}
        />

        <FileUploadAndFilters
          onFileUpload={processFile}
          onFilterByDate={filterByDate}
          onExportToExcel={handleExportToExcel}
          isProcessing={isProcessing}
          hasData={filteredData.length > 0}
        />

        <AttendanceTable data={filteredData} />
      </div>
    </div>
  );
};

export default TimeTracking;
