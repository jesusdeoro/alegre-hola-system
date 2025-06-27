
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmployeeMatrix = ({ employees, setEmployees, setFormerEmployees, onBack }) => {
  const { toast } = useToast();

  const handleEdit = (employee) => {
    toast({
      title: "Editar empleado",
      description: "Función de edición en desarrollo",
    });
  };

  const handleDelete = (employeeId) => {
    const employeeToRemove = employees.find(emp => emp.id === employeeId);
    
    if (employeeToRemove) {
      const formerEmployee = {
        ...employeeToRemove,
        fechaRetiro: new Date().toISOString().split('T')[0],
        motivoRetiro: "Desvinculación"
      };
      
      setFormerEmployees(prev => [...prev, formerEmployee]);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      toast({
        title: "Empleado desvinculado",
        description: `${employeeToRemove.nombre} ha sido movido a ex-empleados`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Matriz de Empleados</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Empleados Activos ({employees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay empleados registrados</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.nombre}</TableCell>
                      <TableCell>{employee.cedula}</TableCell>
                      <TableCell>{employee.cargo}</TableCell>
                      <TableCell>{employee.departamento}</TableCell>
                      <TableCell>{employee.telefono}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar Desvinculación</DialogTitle>
                              </DialogHeader>
                              <p>¿Estás seguro de que deseas desvincular a {employee.nombre}?</p>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  Confirmar
                                </Button>
                                <DialogTrigger asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogTrigger>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
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

export default EmployeeMatrix;
