
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Calendar, BarChart3, Clock, Bell, Cake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [employees, setEmployees] = useState([]);
  const [alerts, setAlerts] = useState({
    birthdays: [],
    contracts: []
  });
  const { toast } = useToast();

  // Simulación de datos para las alertas
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const twoMonthsLater = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    
    // Simulación de cumpleaños del mes
    const birthdayAlerts = [
      { name: "Juan Pérez", date: "15 de este mes" },
      { name: "María García", date: "22 de este mes" }
    ];

    // Simulación de contratos por vencer
    const contractAlerts = [
      { name: "Carlos López", endDate: "2024-08-15", daysLeft: 45 },
      { name: "Ana Martínez", endDate: "2024-09-01", daysLeft: 62 }
    ];

    setAlerts({
      birthdays: birthdayAlerts,
      contracts: contractAlerts
    });

    // Mostrar toast de bienvenida
    toast({
      title: "¡Bienvenido al Sistema de Gestión Humana!",
      description: "Revisa las alertas importantes del mes",
    });
  }, [toast]);

  const MenuButton = ({ icon: Icon, title, section, description }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      onClick={() => setActiveSection(section)}
    >
      <CardHeader className="text-center pb-3">
        <Icon className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (activeSection === "empleados") {
    return <AddEmployee onBack={() => setActiveSection("inicio")} />;
  }

  if (activeSection === "indicadores") {
    return <Indicators onBack={() => setActiveSection("inicio")} />;
  }

  if (activeSection === "huellero") {
    return <TimeTracking onBack={() => setActiveSection("inicio")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Gestión Humana
          </h1>
          <p className="text-xl text-gray-600">
            Administra eficientemente tu equipo de trabajo
          </p>
        </div>

        {/* Alertas */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {alerts.birthdays.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <Cake className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Cumpleaños este mes:</strong>
                <ul className="mt-1">
                  {alerts.birthdays.map((person, index) => (
                    <li key={index}>• {person.name} - {person.date}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {alerts.contracts.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <Bell className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Contratos por vencer:</strong>
                <ul className="mt-1">
                  {alerts.contracts.map((person, index) => (
                    <li key={index}>• {person.name} - {person.daysLeft} días restantes</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Menu Principal */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MenuButton
            icon={Users}
            title="Agregar Empleados"
            section="empleados"
            description="Registra nuevos empleados con toda su información personal y contractual"
          />
          
          <MenuButton
            icon={BarChart3}
            title="Indicadores"
            section="indicadores"
            description="Visualiza estadísticas y métricas importantes del departamento"
          />
          
          <MenuButton
            icon={Clock}
            title="Control de Huellero"
            section="huellero"
            description="Gestiona el control de asistencia y llegadas tardías"
          />
          
          <MenuButton
            icon={Calendar}
            title="Reportes"
            section="reportes"
            description="Genera reportes detallados de empleados y asistencia"
          />
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">124</div>
              <div className="text-sm text-gray-600">Empleados Activos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Asistencia Promedio</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-600">Contratos por Vencer</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Cumpleaños del Mes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Componente para agregar empleados
const AddEmployee = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    lugarExpedicion: "",
    sexo: "",
    cargo: "",
    departamento: "",
    salario: "",
    bono: "",
    tipoContrato: "",
    duracionContrato: "",
    fechaInicioContrato: "",
    fechaFinalContrato: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    barrio: "",
    ciudad: "",
    tipoSangre: "",
    arl: "",
    eps: "",
    pension: "",
    caja: "",
    correo: "",
    estadoCivil: "",
    numeroHijos: "",
    nombresHijos: "",
    sexoHijos: "",
    fechaNacimientoHijos: "",
    telefonoEmergencia: "",
    observaciones: ""
  });

  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calcular fecha final de contrato automáticamente
    if (field === "fechaInicioContrato" || field === "duracionContrato") {
      const fechaInicio = field === "fechaInicioContrato" ? value : formData.fechaInicioContrato;
      const duracion = field === "duracionContrato" ? value : formData.duracionContrato;
      
      if (fechaInicio && duracion) {
        const fecha = new Date(fechaInicio);
        const meses = duracion === "6 meses" ? 6 : 12;
        fecha.setMonth(fecha.getMonth() + meses);
        
        setFormData(prev => ({
          ...prev,
          fechaFinalContrato: fecha.toISOString().split('T')[0]
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Empleado agregado exitosamente",
      description: `${formData.nombre} ha sido registrado en el sistema.`,
    });
    // Aquí se guardarían los datos en la base de datos
    console.log("Datos del empleado:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Agregar Nuevo Empleado</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Empleado *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cédula *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.cedula}
                      onChange={(e) => handleInputChange("cedula", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lugar de Expedición</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.lugarExpedicion}
                      onChange={(e) => handleInputChange("lugarExpedicion", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sexo</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.sexo}
                      onChange={(e) => handleInputChange("sexo", e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      value={formData.fechaNacimiento}
                      onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado Civil</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.estadoCivil}
                      onChange={(e) => handleInputChange("estadoCivil", e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Soltero">Soltero</option>
                      <option value="Casado">Casado</option>
                      <option value="Divorciado">Divorciado</option>
                      <option value="Viudo">Viudo</option>
                      <option value="Unión Libre">Unión Libre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Información Laboral</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cargo *</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded-md"
                      value={formData.cargo}
                      onChange={(e) => handleInputChange("cargo", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Departamento</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.departamento}
                      onChange={(e) => handleInputChange("departamento", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Salario</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={formData.salario}
                      onChange={(e) => handleInputChange("salario", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bono</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={formData.bono}
                      onChange={(e) => handleInputChange("bono", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Contrato</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.tipoContrato}
                      onChange={(e) => handleInputChange("tipoContrato", e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Indefinido">Indefinido</option>
                      <option value="Término Fijo">Término Fijo</option>
                      <option value="Prestación de Servicios">Prestación de Servicios</option>
                      <option value="Aprendizaje">Aprendizaje</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duración de Contrato</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.duracionContrato}
                      onChange={(e) => handleInputChange("duracionContrato", e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="6 meses">6 meses</option>
                      <option value="1 año">1 año</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha Inicio Contrato</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md"
                      value={formData.fechaInicioContrato}
                      onChange={(e) => handleInputChange("fechaInicioContrato", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha Final Contrato</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md bg-gray-100"
                      value={formData.fechaFinalContrato}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente</p>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-600">Información de Contacto</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Dirección</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Barrio</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.barrio}
                      onChange={(e) => handleInputChange("barrio", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ciudad</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.ciudad}
                      onChange={(e) => handleInputChange("ciudad", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-md"
                      value={formData.correo}
                      onChange={(e) => handleInputChange("correo", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono Emergencia</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      value={formData.telefonoEmergencia}
                      onChange={(e) => handleInputChange("telefonoEmergencia", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Información Médica y Seguridad Social */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">Información Médica y Seguridad Social</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Sangre</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.tipoSangre}
                      onChange={(e) => handleInputChange("tipoSangre", e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ARL</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.arl}
                      onChange={(e) => handleInputChange("arl", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">EPS</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.eps}
                      onChange={(e) => handleInputChange("eps", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pensión</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.pension}
                      onChange={(e) => handleInputChange("pension", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Caja de Compensación</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.caja}
                      onChange={(e) => handleInputChange("caja", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Información Familiar */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600">Información Familiar</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de Hijos</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2 border rounded-md"
                      value={formData.numeroHijos}
                      onChange={(e) => handleInputChange("numeroHijos", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombres de los Hijos</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.nombresHijos}
                      onChange={(e) => handleInputChange("nombresHijos", e.target.value)}
                      placeholder="Separar por comas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sexo de los Hijos</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.sexoHijos}
                      onChange={(e) => handleInputChange("sexoHijos", e.target.value)}
                      placeholder="M/F separados por comas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fechas de Nacimiento Hijos</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.fechaNacimientoHijos}
                      onChange={(e) => handleInputChange("fechaNacimientoHijos", e.target.value)}
                      placeholder="DD/MM/YYYY separadas por comas"
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-600">Observaciones</h3>
                <textarea
                  className="w-full p-3 border rounded-md h-24"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Información adicional relevante..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Guardar Empleado
                </Button>
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente de Indicadores
const Indicators = ({ onBack }) => {
  const indicators = {
    totalEmployees: 124,
    newHires: 8,
    contractsExpiring: 12,
    avgAttendance: 95,
    avgSalary: 2500000,
    departmentBreakdown: [
      { name: "Ventas", count: 35 },
      { name: "Administración", count: 28 },
      { name: "Producción", count: 45 },
      { name: "IT", count: 16 }
    ],
    genderBreakdown: [
      { name: "Masculino", count: 68 },
      { name: "Femenino", count: 56 }
    ]
  };

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
              <p className="text-sm text-green-600">+5% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Nuevas Contrataciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{indicators.newHires}</div>
              <p className="text-sm text-blue-600">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Contratos por Vencer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{indicators.contractsExpiring}</div>
              <p className="text-sm text-red-600">Próximos 2 meses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Asistencia Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{indicators.avgAttendance}%</div>
              <p className="text-sm text-green-600">+2% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
                          style={{ width: `${(dept.count / indicators.totalEmployees) * 100}%` }}
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
                          style={{ width: `${(gender.count / indicators.totalEmployees) * 100}%` }}
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información Salarial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${indicators.avgSalary.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Salario Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${(indicators.avgSalary * 0.8).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Salario Mínimo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${(indicators.avgSalary * 1.5).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Salario Máximo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente de Control de Huellero
const TimeTracking = ({ onBack }) => {
  const [lateArrivals, setLateArrivals] = useState([
    { id: 1, employee: "Juan Pérez", date: "2024-06-25", arrivalTime: "08:15", lateness: "15 min" },
    { id: 2, employee: "María García", date: "2024-06-25", arrivalTime: "08:30", lateness: "30 min" },
    { id: 3, employee: "Carlos López", date: "2024-06-24", arrivalTime: "08:45", lateness: "45 min" },
    { id: 4, employee: "Ana Martínez", date: "2024-06-24", arrivalTime: "08:20", lateness: "20 min" },
  ]);

  const [newRecord, setNewRecord] = useState({
    employee: "",
    date: "",
    arrivalTime: "",
    reason: ""
  });

  const { toast } = useToast();

  const handleAddRecord = (e) => {
    e.preventDefault();
    
    // Calcular retraso
    const scheduledTime = new Date(`2024-01-01 08:00:00`);
    const actualTime = new Date(`2024-01-01 ${newRecord.arrivalTime}:00`);
    const lateness = Math.max(0, Math.floor((actualTime - scheduledTime) / (1000 * 60)));
    
    if (lateness > 0) {
      const newLateRecord = {
        id: lateArrivals.length + 1,
        employee: newRecord.employee,
        date: newRecord.date,
        arrivalTime: newRecord.arrivalTime,
        lateness: `${lateness} min`,
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
