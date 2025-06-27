
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Indicators = ({ employees, incapacidades, onBack }) => {
  const calculateIndicators = () => {
    const totalEmployees = employees.length;
    const avgSalary = employees.length > 0 
      ? employees.reduce((sum, emp) => sum + (parseFloat(emp.salario) || 0), 0) / employees.length 
      : 0;
    
    const departmentBreakdown = employees.reduce((acc, emp) => {
      const dept = emp.departamento || 'Sin Departamento';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const genderBreakdown = employees.reduce((acc, emp) => {
      const gender = emp.sexo || 'No Especificado';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const incapacidadesActivas = incapacidades.filter(inc => {
      const fechaFin = new Date(inc.fechaFin);
      return fechaFin >= new Date();
    }).length;

    const tiposIncapacidad = incapacidades.reduce((acc, inc) => {
      const tipo = inc.tipoIncapacidad || 'No Especificado';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEmployees,
      avgSalary,
      departmentBreakdown: Object.entries(departmentBreakdown).map(([name, count]) => ({ name, count: count as number })),
      genderBreakdown: Object.entries(genderBreakdown).map(([name, count]) => ({ name, count: count as number })),
      incapacidadesActivas,
      tiposIncapacidad: Object.entries(tiposIncapacidad).map(([name, count]) => ({ name, count: count as number }))
    };
  };

  const indicators = calculateIndicators();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Indicadores de Gestión</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Empleados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{indicators.totalEmployees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Salario Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${Math.round(indicators.avgSalary).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Incapacidades Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{indicators.incapacidadesActivas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Incapacidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{incapacidades.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Empleados por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicators.departmentBreakdown.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${indicators.totalEmployees ? (dept.count / indicators.totalEmployees) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{dept.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Género</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicators.genderBreakdown.map((gender, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{gender.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-pink-600'}`}
                          style={{ width: `${indicators.totalEmployees ? (gender.count / indicators.totalEmployees) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{gender.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incapacidades por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {indicators.tiposIncapacidad.map((tipo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{tipo.name}</span>
                  <span className="text-lg font-bold text-orange-600">{tipo.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Indicators;
