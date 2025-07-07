
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
