
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Coffee, FileSpreadsheet } from "lucide-react";

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

interface AttendanceTableProps {
  data: EmployeeRecord[];
}

const AttendanceTable = ({ data }: AttendanceTableProps) => {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Asistencia y Control de Almuerzo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Carga un archivo del huellero para ver los datos</p>
            <p className="text-sm mt-2">Se analizarán llegadas tardías (8:05-8:30 AM) y excesos de almuerzo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Asistencia y Control de Almuerzo</CardTitle>
      </CardHeader>
      <CardContent>
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
            {data.map((record) => (
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
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
