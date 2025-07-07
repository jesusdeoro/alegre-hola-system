
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Download } from "lucide-react";

interface FileUploadAndFiltersProps {
  onFileUpload: (file: File) => void;
  onFilterByDate: (startDate: string, endDate: string) => void;
  onExportToExcel: () => void;
  isProcessing: boolean;
  hasData: boolean;
}

const FileUploadAndFilters = ({
  onFileUpload,
  onFilterByDate,
  onExportToExcel,
  isProcessing,
  hasData
}: FileUploadAndFiltersProps) => {
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: ""
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleFilterClick = () => {
    onFilterByDate(dateFilter.startDate, dateFilter.endDate);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Procesar Datos del Huellero</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="excel-file">Cargar archivo del huellero (.txt/.csv/.tsv)</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".txt,.csv,.tsv"
                onChange={handleFileChange}
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
              <Button onClick={handleFilterClick} variant="outline" className="flex-1">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar Período
              </Button>
              <Button onClick={onExportToExcel} disabled={!hasData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadAndFilters;
