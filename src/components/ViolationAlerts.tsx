
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Coffee } from "lucide-react";

interface ViolationAlertsProps {
  lateArrivalsCount: number;
  lunchViolationsCount: number;
}

const ViolationAlerts = ({ lateArrivalsCount, lunchViolationsCount }: ViolationAlertsProps) => {
  if (lateArrivalsCount === 0 && lunchViolationsCount === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {lateArrivalsCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">
                {lateArrivalsCount} llegadas tardías (8:05-8:30 AM) detectadas
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {lunchViolationsCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                {lunchViolationsCount} excesos de tiempo de almuerzo detectados
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViolationAlerts;
