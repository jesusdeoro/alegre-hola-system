
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WorkCertificates = ({ employees, onBack }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const { toast } = useToast();

  // Imágenes predefinidas (usando placeholders, puedes reemplazar con imágenes reales)
  const companyLogo = "https://via.placeholder.com/200x80/2563eb/ffffff?text=EMPRESA+LOGO";
  const signatureImage = "https://via.placeholder.com/200x60/000000/ffffff?text=Firma+Coordinadora";

  const generateCertificate = () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Debe seleccionar un empleado",
        variant: "destructive"
      });
      return;
    }

    const employee = employees.find(emp => emp.id === parseInt(selectedEmployee));
    if (!employee) return;

    const certificateContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
        <img src="${companyLogo}" alt="Logo Empresa" style="height: 80px; margin-bottom: 30px;">
        
        <h1 style="text-align: center; color: #2563eb; margin-bottom: 30px;">CERTIFICADO LABORAL</h1>
        
        <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
          La empresa <strong>[NOMBRE DE LA EMPRESA]</strong>, identificada con NIT <strong>[NIT]</strong>, 
          certifica que <strong>${employee.nombre}</strong>, identificado(a) con cédula de ciudadanía número 
          <strong>${employee.cedula}</strong>, labora en nuestra organización desde el 
          <strong>${employee.fechaInicioContrato}</strong> hasta la fecha.
        </p>
        
        <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
          El(la) señor(a) <strong>${employee.nombre}</strong> se desempeña en el cargo de 
          <strong>${employee.cargo}</strong> en el departamento de <strong>${employee.departamento}</strong>, 
          con un salario de <strong>$${parseInt(employee.salario || "0").toLocaleString()}</strong> pesos colombianos.
        </p>
        
        <p style="text-align: justify; line-height: 1.6; margin-bottom: 40px;">
          Su contrato es de tipo <strong>${employee.tipoContrato}</strong> con una duración de 
          <strong>${employee.duracionContrato}</strong>.
        </p>
        
        <p style="text-align: justify; line-height: 1.6; margin-bottom: 80px;">
          Esta certificación se expide a solicitud del interesado(a) para los fines que considere convenientes.
        </p>
        
        <p style="margin-bottom: 80px;">
          <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}
        </p>
        
        <img src="${signatureImage}" alt="Firma" style="height: 60px; margin-bottom: 10px;">
        <div style="border-top: 2px solid #000; width: 300px; margin-bottom: 10px;"></div>
        <p style="margin: 0;"><strong>Coordinadora de Talento Humano</strong></p>
        <p style="margin: 0; font-size: 14px;">[NOMBRE DE LA EMPRESA]</p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificado Laboral - ${employee.nombre}</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${certificateContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Certificado generado",
      description: `Certificado laboral para ${employee.nombre} listo para descargar`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Certificados Laborales</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generar Certificado Laboral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Seleccionar Empleado</label>
              <select
                className="w-full p-3 border rounded-md"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nombre} - {emp.cedula}</option>
                ))}
              </select>
            </div>

            <Button onClick={generateCertificate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generar y Descargar Certificado
            </Button>
          </CardContent>
        </Card>

        {selectedEmployee && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Vista Previa del Certificado</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const employee = employees.find(emp => emp.id === parseInt(selectedEmployee));
                if (!employee) return null;
                
                return (
                  <div className="bg-white p-8 border-2 border-gray-200 rounded-lg">
                    <img src={companyLogo} alt="Logo" className="h-20 mb-6" />
                    <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">CERTIFICADO LABORAL</h2>
                    <div className="space-y-4 text-sm">
                      <p><strong>Empleado:</strong> {employee.nombre}</p>
                      <p><strong>Cédula:</strong> {employee.cedula}</p>
                      <p><strong>Cargo:</strong> {employee.cargo}</p>
                      <p><strong>Departamento:</strong> {employee.departamento}</p>
                      <p><strong>Salario:</strong> ${parseInt(employee.salario || "0").toLocaleString()}</p>
                      <p><strong>Fecha de Ingreso:</strong> {employee.fechaInicioContrato}</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkCertificates;
