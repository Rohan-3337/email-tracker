'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Mail, Eye, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsData {
  totalEmails: number;
  openRate: string;
  activeContacts: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/email/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderCard = (title: string, icon: React.JSX.Element, value?: string | number) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-6 w-20" /> : <div className="text-2xl font-bold">{value}</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderCard('Total Emails Sent', <Mail className="w-4 h-4 text-muted-foreground" />, stats?.totalEmails.toLocaleString())}
      {renderCard('Open Rate', <Eye className="w-4 h-4 text-muted-foreground" />, `${stats?.openRate}%`)}
      {renderCard('Active Contacts', <Users className="w-4 h-4 text-muted-foreground" />, stats?.activeContacts)}
    </div>
  );
}
