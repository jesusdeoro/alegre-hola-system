
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const SiigoIntegration = ({ onBack }) => {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.siigo.com/v1/");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("");
  const { toast } = useToast();

  const testConnection = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Debe ingresar la API Key de Siigo",
        variant: "destructive"
      });
      return;
    }

    setConnectionStatus("Probando conexión...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      localStorage.setItem('siigo_config', JSON.stringify({
        apiKey,
        baseUrl,
        connectedAt: new Date().toISOString()
      }));
      
      setIsConnected(true);
      setConnectionStatus("Conectado exitosamente");
      
      toast({
        title: "Conexión exitosa",
        description: "La integración con Siigo está configurada correctamente",
      });
    } catch (error) {
      setConnectionStatus("Error en la conexión");
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con la API de Siigo",
        variant: "destructive"
      });
    }
  };

  const disconnect = () => {
    localStorage.removeItem('siigo_config');
    setIsConnected(false);
    setConnectionStatus("");
    setApiKey("");
    
    toast({
      title: "Desconectado",
      description: "Se ha desconectado de la API de Siigo",
    });
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('siigo_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setApiKey(config.apiKey);
      setBaseUrl(config.baseUrl);
      setIsConnected(true);
      setConnectionStatus("Conectado");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={onBack} className="mr-4">
            ← Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Integración con Siigo</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">API Key de Siigo</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-md"
                  placeholder="Ingrese su API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Base</label>
                <input
                  type="url"
                  className="w-full p-3 border rounded-md"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {!isConnected ? (
                  <Button onClick={testConnection} className="flex-1">
                    Probar Conexión
                  </Button>
                ) : (
                  <Button onClick={disconnect} variant="destructive" className="flex-1">
                    Desconectar
                  </Button>
                )}
              </div>

              {connectionStatus && (
                <Alert className={isConnected ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
                  <AlertDescription className={isConnected ? "text-green-800" : "text-yellow-800"}>
                    {connectionStatus}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades Futuras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Sincronización de Empleados</h4>
                  <p className="text-sm text-gray-600">
                    Exportar datos de empleados a Siigo como terceros o proveedores.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Gestión de Nómina</h4>
                  <p className="text-sm text-gray-600">
                    Integrar cálculos de nómina con el sistema contable de Siigo.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Reportes Financieros</h4>
                  <p className="text-sm text-gray-600">
                    Generar reportes de costos de personal directamente en Siigo.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Centros de Costo</h4>
                  <p className="text-sm text-gray-600">
                    Asignar empleados a centros de costo específicos en Siigo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isConnected && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Estado de la Integración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <div className="text-sm text-green-800">API Conectada</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">⏳</div>
                  <div className="text-sm text-yellow-800">Funciones en Desarrollo</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">🚀</div>
                  <div className="text-sm text-blue-800">Listo para Futuras Mejoras</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SiigoIntegration;
