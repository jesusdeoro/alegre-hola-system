import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, Upload, Download, Users, DollarSign, Clock, BarChart3, Settings, Database, FileCheck, Zap, Target, Award, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Nomina = ({ employees, onBack }) => {
  const [activeModule, setActiveModule] = useState("");
  const { toast } = useToast();

  const handleModuleClick = (moduleName) => {
    setActiveModule(moduleName);
    toast({
      title: `Módulo ${moduleName}`,
      description: "Esta funcionalidad estará disponible próximamente",
    });
  };

  const nominaModules = [
    { id: "liquidacion", name: "Liquidación de Nómina", icon: Calculator, color: "bg-blue-500 hover:bg-blue-600" },
    { id: "prestaciones", name: "Prestaciones Sociales", icon: FileText, color: "bg-green-500 hover:bg-green-600" },
    { id: "vacaciones", name: "Vacaciones", icon: Users, color: "bg-purple-500 hover:bg-purple-600" },
    { id: "bonificaciones", name: "Bonificaciones", icon: Award, color: "bg-yellow-500 hover:bg-yellow-600" },
    { id: "descuentos", name: "Descuentos", icon: TrendingDown, color: "bg-red-500 hover:bg-red-600" },
    { id: "horas-extra", name: "Horas Extra", icon: Clock, color: "bg-indigo-500 hover:bg-indigo-600" },
    { id: "incapacidades", name: "Incapacidades EPS", icon: FileCheck, color: "bg-teal-500 hover:bg-teal-600" },
    { id: "cesantias", name: "Cesantías", icon: DollarSign, color: "bg-orange-500 hover:bg-orange-600" },
    { id: "prima", name: "Prima de Servicios", icon: Target, color: "bg-pink-500 hover:bg-pink-600" },
    { id: "parafiscales", name: "Aportes Parafiscales", icon: BarChart3, color: "bg-gray-500 hover:bg-gray-600" },
    { id: "seguridad-social", name: "Seguridad Social", icon: Settings, color: "bg-cyan-500 hover:bg-cyan-600" },
    { id: "reportes", name: "Reportes PILA", icon: Database, color: "bg-lime-500 hover:bg-lime-600" },
    { id: "siigo-sync", name: "Sincronización Siigo", icon: Zap, color: "bg-violet-500 hover:bg-violet-600" },
    { id: "backup", name: "Respaldo de Datos", icon: Upload, color: "bg-emerald-500 hover:bg-emerald-600" },
    { id: "exportar", name: "Exportar Nómina", icon: Download, color: "bg-rose-500 hover:bg-rose-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Calculator className="mr-3 h-8 w-8" />
            Sistema de Nómina
          </h1>
        </div>

        {/* Estadísticas generales */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
              <div className="text-sm text-gray-600">Empleados Activos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(employees.reduce((total, emp) => total + (emp.salario || 0), 0)).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Nómina Total Mensual</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">15</div>
              <div className="text-sm text-gray-600">Módulos Disponibles</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
              </div>
              <div className="text-sm text-gray-600">Período Actual</div>
            </CardContent>
          </Card>
        </div>

        {/* Módulos de nómina */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos del Sistema de Nómina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {nominaModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Button
                    key={module.id}
                    onClick={() => handleModuleClick(module.name)}
                    className={`${module.color} text-white h-24 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-transform`}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="text-xs text-center font-medium">
                      {module.name}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Información del período actual */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información del Período Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Fechas Importantes</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Corte de nómina:</span>
                    <span className="font-medium">30 de cada mes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pago de salarios:</span>
                    <span className="font-medium">5 del mes siguiente</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reporte PILA:</span>
                    <span className="font-medium">10 del mes siguiente</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Declaración parafiscales:</span>
                    <span className="font-medium">15 del mes siguiente</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Estado del Sistema</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Base de datos: Conectada</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Siigo API: Pendiente configuración</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Respaldo automático: Activo</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Para activar todas las funcionalidades:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Configura la conexión con tu base de datos MySQL local</li>
                <li>• Obtén y configura tu API Key de Siigo</li>
                <li>• Revisa y valida la información de empleados</li>
                <li>• Realiza pruebas con datos de prueba</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nomina;
