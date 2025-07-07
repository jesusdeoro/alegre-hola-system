
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalRecords: number;
  lateArrivals: number;
  lunchViolations: number;
  totalLateMinutes: number;
  totalLunchExtraMinutes: number;
  totalDiscounts: number;
}

const DashboardStats = ({
  totalRecords,
  lateArrivals,
  lunchViolations,
  totalLateMinutes,
  totalLunchExtraMinutes,
  totalDiscounts
}: DashboardStatsProps) => {
  return (
    <div className="grid md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalRecords}</div>
          <div className="text-sm text-gray-600">Registros</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{lateArrivals}</div>
          <div className="text-sm text-gray-600">Llegadas Tardías</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{lunchViolations}</div>
          <div className="text-sm text-gray-600">Excesos Almuerzo</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{totalLateMinutes}</div>
          <div className="text-sm text-gray-600">Min. Tarde Total</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalLunchExtraMinutes}</div>
          <div className="text-sm text-gray-600">Min. Extra Almuerzo</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            ${totalDiscounts.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Descuentos</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
