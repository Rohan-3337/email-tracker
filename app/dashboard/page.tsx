
import { StatsCards } from '@/components/dashboard/stats-card';
import { EngagementChart } from '@/components/dashboard/engagement-chart';
import { RecentCampaigns } from '@/components/dashboard/recent-campaigns';


export default async function Dashboard() {
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your email campaigns.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <EngagementChart />
        {/* <RecentCampaigns /> */}
        <RecentCampaigns/>
      </div>
    </div>
  );
}
