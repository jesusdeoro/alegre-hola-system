import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Calendar, BarChart3, Clock, Bell, Cake, UserX, FileText, Download, FileImage, Trophy, Calculator } from "lucide-react";

// Import refactored components
import EmployeeMatrix from "@/components/EmployeeMatrix";
import FormerEmployees from "@/components/FormerEmployees";
import Incapacidades from "@/components/Incapacidades";
import AddEmployee from "@/components/AddEmployee";
import Indicators from "@/components/Indicators";
import TimeTracking from "@/components/TimeTracking";
import WorkCertificates from "@/components/WorkCertificates";
import SiigoIntegration from "@/components/SiigoIntegration";
import MenuButton from "@/components/MenuButton";
import Nomina from "@/components/Nomina";

const Index = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [employees, setEmployees] = useState([]);
  const [formerEmployees, setFormerEmployees] = useState([]);
  const [incapacidades, setIncapacidades] = useState([]);
  const [alerts, setAlerts] = useState({
    birthdays: [],
    contracts: []
  });

  // Load data from localStorage on start
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

  // Save employees to localStorage when they change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
    
    // Calculate alerts based on real data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    // Birthday alerts for current month
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

    // Contract alerts for contracts expiring in next 2 months
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
      const daysLeft = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
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

  // Save former employees to localStorage when they change
  useEffect(() => {
    localStorage.setItem('formerEmployees', JSON.stringify(formerEmployees));
  }, [formerEmployees]);

  // Save incapacidades to localStorage when they change
  useEffect(() => {
    localStorage.setItem('incapacidades', JSON.stringify(incapacidades));
  }, [incapacidades]);

  // Function to get profession day
  const getProfessionDay = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const professionDays = {
      "1-25": "Día del Trabajador Social",
      "2-14": "Día del Ingeniero",
      "3-8": "Día Internacional de la Mujer",
      "4-15": "Día del Médico",
      "5-1": "Día Internacional del Trabajador",
      "6-5": "Día Mundial del Medio Ambiente",
      "7-19": "Día del Arquitecto",
      "8-27": "Día del Psicólogo",
      "9-13": "Día del Programador",
      "10-5": "Día Mundial del Docente",
      "11-10": "Día del Abogado",
      "12-3": "Día del Contador"
    };

    const dateKey = `${month}-${day}`;
    return professionDays[dateKey] || null;
  };

  const todaysProfessionDay = getProfessionDay();

  // Route to different sections
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
    return <TimeTracking 
      employees={employees}
      onBack={() => setActiveSection("inicio")} 
    />;
  }

  if (activeSection === "certificados") {
    return <WorkCertificates 
      employees={employees}
      onBack={() => setActiveSection("inicio")} 
    />;
  }

  if (activeSection === "siigo") {
    return <SiigoIntegration onBack={() => setActiveSection("inicio")} />;
  }

  if (activeSection === "nomina") {
    return <Nomina 
      employees={employees}
      onBack={() => setActiveSection("inicio")} 
    />;
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

        {/* Profession Day */}
        {todaysProfessionDay && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Trophy className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 {todaysProfessionDay}</strong> - ¡Felicitaciones a todos los profesionales!
            </AlertDescription>
          </Alert>
        )}

        {/* Alerts */}
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

        {/* Main Menu */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuButton
            icon={Users}
            title="Agregar Empleados"
            section="empleados"
            description="Registra nuevos empleados con toda su información personal y contractual"
            onClick={setActiveSection}
          />
          
          <MenuButton
            icon={Users}
            title="Matriz de Empleados"
            section="matriz"
            description="Gestiona, edita y administra todos los empleados activos"
            onClick={setActiveSection}
          />

          <MenuButton
            icon={UserX}
            title="Ex-Empleados"
            section="ex-empleados"
            description="Consulta empleados que ya no trabajan en la compañía"
            onClick={setActiveSection}
          />

          <MenuButton
            icon={FileText}
            title="Incapacidades"
            section="incapacidades"
            description="Gestiona y registra las incapacidades de los empleados"
            onClick={setActiveSection}
          />
          
          <MenuButton
            icon={BarChart3}
            title="Indicadores"
            section="indicadores"
            description="Visualiza estadísticas y métricas importantes del departamento"
            onClick={setActiveSection}
          />
          
          <MenuButton
            icon={Clock}
            title="Control de Huellero"
            section="huellero"
            description="Gestiona el control de asistencia y llegadas tardías"
            onClick={setActiveSection}
          />

          <MenuButton
            icon={Download}
            title="Certificados Laborales"
            section="certificados"
            description="Genera y descarga certificados laborales en PDF"
            onClick={setActiveSection}
          />

          <MenuButton
            icon={FileImage}
            title="Integración Siigo"
            section="siigo"
            description="Conecta con la API de Siigo para futuras funcionalidades"
            onClick={setActiveSection}
          />

          <MenuButton
            icon={Calculator}
            title="Nómina"
            section="nomina"
            description="Gestiona bonificaciones y prepara datos para envío a Siigo"
            onClick={setActiveSection}
          />
        </div>

        {/* Quick Statistics */}
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

export default Index;
