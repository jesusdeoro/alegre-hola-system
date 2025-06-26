
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Calendar, BarChart3, Clock, Bell, Cake, UserX, Edit, Trash2, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [employees, setEmployees] = useState([]);
  const [formerEmployees, setFormerEmployees] = useState([]);
  const [incapacidades, setIncapacidades] = useState([]);
  const [alerts, setAlerts] = useState({
    birthdays: [],
    contracts: []
  });
  const { toast } = useToast();

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    const savedFormerEmployees = localStorage.getItem('formerEmployees');
    const savedIncapacidades = localStorage.getItem('incapacidades');
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
    if (savedFormerEmployees) {
      setFormerEmployees(JSON.parse(savedFormerEmployees));
    }
    if (savedIncapacidades) {
      setIncapacidades(JSON.parse(savedIncapacidades));
    }
  }, []);

  // Guardar empleados en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
    
    // Calcular alertas basadas en datos reales
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Alertas de cumpleaños del mes actual
    const birthdayAlerts = employees.filter(emp => {
      if (emp.fechaNacimiento) {
        const birthDate = new Date(emp.fechaNacimiento);
        return birthDate.getMonth() === currentMonth;
      }
      return false;
    }).map(emp => ({
      name: emp.nombre,
      date: new Date(emp.fechaNacimiento).getDate() + " de este mes"
    }));

    // Alertas de contratos por vencer en los próximos 2 meses
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(currentDate.getMonth() + 2);
    
    const contractAlerts = employees.filter(emp => {
      if (emp.fechaFinalContrato) {
        const endDate = new Date(emp.fechaFinalContrato);
        return endDate <= twoMonthsFromNow && endDate >= currentDate;
      }
      return false;
    }).map(emp => {
      const endDate = new Date(emp.fechaFinalContrato);
      const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
      return {
        name: emp.nombre,
        endDate: emp.fechaFinalContrato,
        daysLeft: daysLeft
      };
    });

    setAlerts({
      birthdays: birthdayAlerts,
      contracts: contractAlerts
    });
  }, [employees]);

  // Guardar ex-empleados en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('formerEmployees', JSON.stringify(formerEmployees));
  }, [formerEmployees]);

  // Guardar incapacidades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('incapacidades', JSON.stringify(incapacidades));
  }, [incapacidades]);

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
    return <AddEmployee 
      employees={employees}
      setEmployees={setEmployees}
      onBack={() => setActiveSection("inicio")} 
    />;
  }

  if (activeSection === "matriz") {
    return <EmployeeMatrix 
      employees={employees} 
      setEmployees={setEmployees}
      setFormerEmployees={setFormerEmployees}
      onBack={() => setActiveSection("inicio")} 
    />;
  }

  if (activeSection === "ex-empleados") {
    return <FormerEmployees 
      formerEmployees={formerEmployees}
      onBack={() => setActiveSection("inicio")} 
    />;
  }

  if (activeSection === "incapacidades") {
    return <Incapacidades 
      incapacidades={incapacidades}
      setIncapacidades={setIncapacidades}
      employees={employees}
      onBack={() => setActiveSection("inicio")} 
    />;
  }

  if (activeSection === "indicadores") {
    return <Indicators 
      employees={employees}
      incapacidades={incapacidades}
      onBack={() => setActiveSection("inicio")} 
    />;
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuButton
            icon={Users}
            title="Agregar Empleados"
            section="empleados"
            description="Registra nuevos empleados con toda su información personal y contractual"
          />
          
          <MenuButton
            icon={Users}
            title="Matriz de Empleados"
            section="matriz"
            description="Gestiona, edita y administra todos los empleados activos"
          />

          <MenuButton
            icon={UserX}
            title="Ex-Empleados"
            section="ex-empleados"
            description="Consulta empleados que ya no trabajan en la compañía"
          />

          <MenuButton
            icon={FileText}
            title="Incapacidades"
            section="incapacidades"
            description="Gestiona y registra las incapacidades de los empleados"
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
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
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
              <div className="text-2xl font-bold text-yellow-600">{alerts.contracts.length}</div>
              <div className="text-sm text-gray-600">Contratos por Vencer</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{incapacidades.length}</div>
              <div className="text-sm text-gray-600">Incapacidades Activas</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Componente para matriz de empleados
const EmployeeMatrix = ({ employees, setEmployees, setFormerEmployees, onBack }) => {
  const { toast } = useToast();

  const handleEdit = (employee) => {
    // Aquí puedes implementar la edición inline o abrir un modal
    toast({
      title: "Editar empleado",
      description: "Función de edición en desarrollo",
    });
  };

  const handleDelete = (employeeId) => {
    const employeeToRemove = employees.find(emp => emp.id === employeeId);
    
    if (employeeToRemove) {
      // Mover a ex-empleados
      const formerEmployee = {
        ...employeeToRemove,
        fechaRetiro: new Date().toISOString().split('T')[0],
        motivoRetiro: "Desvinculación"
      };
      
      setFormerEmployees(prev => [...prev, formerEmployee]);
      
      // Remover de empleados activos
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

// Componente para ex-empleados
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

// Componente para incapacidades
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
                    rows="3"
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

// Componente para agregar empleados
const AddEmployee = ({ employees, setEmployees, onBack }) => {
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
    
    const nuevoEmpleado = {
      id: Date.now(),
      ...formData,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    setEmployees(prev => [...prev, nuevoEmpleado]);
    
    toast({
      title: "Empleado agregado exitosamente",
      description: `${formData.nombre} ha sido registrado en el sistema.`,
    });

    // Limpiar formulario
    setFormData({
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
      departmentBreakdown: Object.entries(departmentBreakdown).map(([name, count]) => ({ name, count })),
      genderBreakdown: Object.entries(genderBreakdown).map(([name, count]) => ({ name, count })),
      incapacidadesActivas,
      tiposIncapacidad: Object.entries(tiposIncapacidad).map(([name, count]) => ({ name, count }))
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

// Componente de Control de Huellero
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
    
    // Calcular retraso
    const scheduledTime = new Date(`2024-01-01 08:00:00`);
    const actualTime = new Date(`2024-01-01 ${newRecord.arrivalTime}:00`);
    const latenessMinutes = Math.max(0, Math.floor((actualTime - scheduledTime) / (1000 * 60)));
    
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

export default Index;
