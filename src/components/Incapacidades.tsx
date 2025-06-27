
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Incapacidades = ({ incapacidades, setIncapacidades, employees, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    empleadoId: "",
    fechaInicio: "",
    fechaFin: "",
    tipoIncapacidad: "",
    diagnostico: "",
    eps: "",
    observaciones: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const empleado = employees.find(emp => emp.id === parseInt(formData.empleadoId));
    
    if (!empleado) {
      toast({
        title: "Error",
        description: "Empleado no encontrado",
        variant: "destructive"
      });
      return;
    }

    const nuevaIncapacidad = {
      id: Date.now(),
      empleadoNombre: empleado.nombre,
      empleadoCedula: empleado.cedula,
      ...formData,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    setIncapacidades(prev => [...prev, nuevaIncapacidad]);
    setFormData({
      empleadoId: "",
      fechaInicio: "",
      fechaFin: "",
      tipoIncapacidad: "",
      diagnostico: "",
      eps: "",
      observaciones: ""
    });
    setShowForm(false);

    toast({
      title: "Incapacidad registrada",
      description: `Incapacidad registrada para ${empleado.nombre}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={onBack} className="mr-4">
              ← Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Incapacidades</h1>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Incapacidad
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Registrar Nueva Incapacidad</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Empleado</label>
                  <select
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.empleadoId}
                    onChange={(e) => setFormData(prev => ({ ...prev, empleadoId: e.target.value }))}
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.nombre} - {emp.cedula}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Incapacidad</label>
                  <select
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.tipoIncapacidad}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoIncapacidad: e.target.value }))}
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Enfermedad General">Enfermedad General</option>
                    <option value="Accidente de Trabajo">Accidente de Trabajo</option>
                    <option value="Enfermedad Laboral">Enfermedad Laboral</option>
                    <option value="Maternidad">Maternidad</option>
                    <option value="Paternidad">Paternidad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.fechaFin}
                    onChange={(e) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnóstico</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-md"
                    value={formData.diagnostico}
                    onChange={(e) => setFormData(prev => ({ ...prev, diagnostico: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EPS</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.eps}
                    onChange={(e) => setFormData(prev => ({ ...prev, eps: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Observaciones</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={formData.observaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit">Registrar Incapacidad</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Registro de Incapacidades ({incapacidades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {incapacidades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay incapacidades registradas</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incapacidades.map((incapacidad) => {
                    const hoy = new Date();
                    const fechaFin = new Date(incapacidad.fechaFin);
                    const estaActiva = fechaFin >= hoy;
                    
                    return (
                      <TableRow key={incapacidad.id}>
                        <TableCell className="font-medium">{incapacidad.empleadoNombre}</TableCell>
                        <TableCell>{incapacidad.tipoIncapacidad}</TableCell>
                        <TableCell>{incapacidad.fechaInicio}</TableCell>
                        <TableCell>{incapacidad.fechaFin}</TableCell>
                        <TableCell>{incapacidad.diagnostico}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            estaActiva 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {estaActiva ? 'Activa' : 'Finalizada'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Incapacidades;
