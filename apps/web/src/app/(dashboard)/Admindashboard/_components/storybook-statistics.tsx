import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { BookOpen, TrendingUp, CheckCircle, Clock } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
      <CardTitle className="text-xs font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </CardContent>
  </Card>
);

const StorybookStatistics = () => {
  const stats = {
    total: {
      value: "1,258",
      trend: "+20.1% from last month",
    },
    completed: {
      value: "982",
      trend: "+18.2% from last month",
    },
    draft: {
      value: "201",
      trend: "-5.0% from last month",
    },
    processing: {
      value: "75",
      trend: "+12.5% from last month",
    },
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        title="Total Storybooks"
        value={stats.total.value}
        trend={stats.total.trend}
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
      />
      <StatisticCard
        title="Completed"
        value={stats.completed.value}
        trend={stats.completed.trend}
        icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
      />
      <StatisticCard
        title="Draft"
        value={stats.draft.value}
        trend={stats.draft.trend}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
      <StatisticCard
        title="Processing"
        value={stats.processing.value}
        trend={stats.processing.trend}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
};

export default StorybookStatistics;