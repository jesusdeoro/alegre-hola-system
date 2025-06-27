
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserX } from "lucide-react";

const FormerEmployees = ({ formerEmployees, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Ex-Empleados</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Empleados que ya no trabajan en la compañía ({formerEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {formerEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay ex-empleados registrados</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Fecha de Retiro</TableHead>
                    <TableHead>Motivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formerEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.nombre}</TableCell>
                      <TableCell>{employee.cedula}</TableCell>
                      <TableCell>{employee.cargo}</TableCell>
                      <TableCell>{employee.departamento}</TableCell>
                      <TableCell>{employee.fechaRetiro}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {employee.motivoRetiro}
                        </span>
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

export default FormerEmployees;
