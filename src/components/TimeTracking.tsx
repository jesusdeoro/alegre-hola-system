
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimeTracking = ({ onBack }) => {
  const [lateArrivals, setLateArrivals] = useState(() => {
    const saved = localStorage.getItem('lateArrivals');
    return saved ? JSON.parse(saved) : [];
  });

  const [newRecord, setNewRecord] = useState({
    employee: "",
    date: "",
    arrivalTime: "",
    reason: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('lateArrivals', JSON.stringify(lateArrivals));
  }, [lateArrivals]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    
    const scheduledTime = new Date(`2024-01-01 08:00:00`);
    const actualTime = new Date(`2024-01-01 ${newRecord.arrivalTime}:00`);
    const latenessMinutes = Math.max(0, Math.floor((actualTime.getTime() - scheduledTime.getTime()) / (1000 * 60)));
    
    if (latenessMinutes > 0) {
      const newLateRecord = {
        id: Date.now(),
        employee: newRecord.employee,
        date: newRecord.date,
        arrivalTime: newRecord.arrivalTime,
        lateness: `${latenessMinutes} min`,
        reason: newRecord.reason
      };

      setLateArrivals(prev => [newLateRecord, ...prev]);
      
      toast({
        title: "Registro agregado",
        description: `Llegada tardía registrada para ${newRecord.employee}`,
      });
    } else {
      toast({
        title: "Llegada puntual",
        description: `${newRecord.employee} llegó a tiempo`,
      });
    }

    setNewRecord({ employee: "", date: "", arrivalTime: "", reason: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Control de Huellero</h1>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{lateArrivals.length}</div>
              <div className="text-sm text-gray-600">Llegadas Tardías</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Puntualidad</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">118</div>
              <div className="text-sm text-gray-600">Asistencias Hoy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-gray-600">Promedio Retraso (min)</div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario para agregar llegada tardía */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registrar Llegada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecord} className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Empleado</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newRecord.employee}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, employee: e.target.value }))}
                  placeholder="Nombre del empleado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hora de Llegada</label>
                <input
                  type="time"
                  required
                  className="w-full p-2 border rounded-md"
                  value={newRecord.arrivalTime}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, arrivalTime: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  Registrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabla de llegadas tardías */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Llegadas Tardías</CardTitle>
          </CardHeader>
          <CardContent>
            {lateArrivals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay llegadas tardías registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Empleado</th>
                      <th className="text-left p-2 font-medium">Fecha</th>
                      <th className="text-left p-2 font-medium">Hora Llegada</th>
                      <th className="text-left p-2 font-medium">Retraso</th>
                      <th className="text-left p-2 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lateArrivals.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{record.employee}</td>
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{record.arrivalTime}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            {record.lateness}
                          </span>
                        </td>
                        <td className="p-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeTracking;
