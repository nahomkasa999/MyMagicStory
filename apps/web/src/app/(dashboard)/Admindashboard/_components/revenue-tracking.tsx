import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Users } from "lucide-react";

interface RevenueCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

const RevenueCard: React.FC<RevenueCardProps> = ({ title, value, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
      <CardTitle className="text-xs font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{value}</div>
      {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
    </CardContent>
  </Card>
);

const RevenueTracking = () => {
  const revenue = {
    total: {
      value: "$45,231.89",
      trend: "+20.1% from last month",
    },
    monthly: {
      value: "$5,782.34",
      trend: "+12.5% from last month",
    },
    avgPerUser: {
      value: "$25.50",
    },
    paymentMethods: {
      stripe: "60%",
      paypal: "30%",
      other: "10%",
    },
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <RevenueCard
        title="Total Revenue"
        value={revenue.total.value}
        trend={revenue.total.trend}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <RevenueCard
        title="Monthly Revenue"
        value={revenue.monthly.value}
        trend={revenue.monthly.trend}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
      <RevenueCard
        title="Avg. Revenue / User"
        value={revenue.avgPerUser.value}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-medium">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">Stripe</span>
            <span className="font-bold">{revenue.paymentMethods.stripe}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm">PayPal</span>
            <span className="font-bold">{revenue.paymentMethods.paypal}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm">Other</span>
            <span className="font-bold">{revenue.paymentMethods.other}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueTracking;