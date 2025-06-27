
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Nomina = ({ employees, onBack }) => {
  const [nominaData, setNominaData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [bonificacion, setBonificacion] = useState("");
  const [concepto, setConcepto] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Cargar datos de nómina desde localStorage
  useEffect(() => {
    const savedNomina = localStorage.getItem('nomina');
    if (savedNomina) {
      setNominaData(JSON.parse(savedNomina));
    }
  }, []);

  // Guardar datos de nómina en localStorage
  useEffect(() => {
    localStorage.setItem('nomina', JSON.stringify(nominaData));
  }, [nominaData]);

  const handleAddBonificacion = () => {
    if (!selectedEmployee || !bonificacion || !concepto) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) {
      toast({
        title: "Error",
        description: "Empleado no encontrado",
        variant: "destructive"
      });
      return;
    }

    const newBonificacion = {
      id: Date.now(),
      empleadoId: selectedEmployee,
      empleadoNombre: employee.nombre,
      empleadoCedula: employee.cedula,
      concepto: concepto,
      valor: parseFloat(bonificacion),
      fecha: new Date().toISOString().split('T')[0],
      estado: "Pendiente Siigo"
    };

    setNominaData(prev => [...prev, newBonificacion]);
    
    // Limpiar formulario
    setSelectedEmployee("");
    setBonificacion("");
    setConcepto("");
    setIsDialogOpen(false);

    toast({
      title: "Bonificación agregada",
      description: `Bonificación de $${bonificacion} agregada para ${employee.nombre}`,
    });
  };

  const handleSendToSiigo = (item) => {
    // Aquí iría la integración con Siigo
    toast({
      title: "Función en desarrollo",
      description: "La integración con Siigo estará disponible cuando configures el backend",
      variant: "destructive"
    });
  };

  const totalBonificaciones = nominaData.reduce((total, item) => total + item.valor, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Calculator className="mr-3 h-8 w-8" />
            Gestión de Nómina
          </h1>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                ${totalBonificaciones.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Bonificaciones</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{nominaData.length}</div>
              <div className="text-sm text-gray-600">Registros de Nómina</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {nominaData.filter(item => item.estado === "Pendiente Siigo").length}
              </div>
              <div className="text-sm text-gray-600">Pendientes Siigo</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de nómina */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Registros de Nómina</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Bonificación
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Bonificación</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="employee">Empleado</Label>
                    <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.nombre} - {employee.cedula}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="concepto">Concepto</Label>
                    <Input
                      id="concepto"
                      value={concepto}
                      onChange={(e) => setConcepto(e.target.value)}
                      placeholder="Ej: Bonificación por desempeño"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bonificacion">Valor ($)</Label>
                    <Input
                      id="bonificacion"
                      type="number"
                      value={bonificacion}
                      onChange={(e) => setBonificacion(e.target.value)}
                      placeholder="30000"
                    />
                  </div>
                  
                  <Button onClick={handleAddBonificacion} className="w-full">
                    Agregar Bonificación
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {nominaData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay registros de nómina</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nominaData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.empleadoNombre}</TableCell>
                      <TableCell>{item.empleadoCedula}</TableCell>
                      <TableCell>{item.concepto}</TableCell>
                      <TableCell>${item.valor.toLocaleString()}</TableCell>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.estado === "Pendiente Siigo" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSendToSiigo(item)}
                          disabled={item.estado === "Enviado a Siigo"}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Enviar a Siigo
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Ejemplo específico para Karilin */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ejemplo: Bonificación para KARILIN CALAO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Para probar:</strong> Agrega una bonificación de $30,000 para KARILIN CALAO
              </p>
              <p className="text-xs text-blue-600">
                Una vez que configures el backend con XAMPP y MySQL, podrás enviar esta información directamente a Siigo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nomina;
