import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

    // Reset form
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

export default AddEmployee;
