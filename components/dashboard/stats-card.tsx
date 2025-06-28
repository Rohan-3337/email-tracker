'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Mail, Users, MousePointer, Eye } from 'lucide-react';

const stats = [
  {
    title: 'Total Emails Sent',
    value: '12,345',
    change: '+12%',
    changeType: 'increase',
    icon: Mail,
  },
  {
    title: 'Open Rate',
    value: '68.5%',
    change: '+5.2%',
    changeType: 'increase',
    icon: Eye,
  },
  {
    title: 'Click Rate',
    value: '24.8%',
    change: '-2.1%',
    changeType: 'decrease',
    icon: MousePointer,
  },
  {
    title: 'Active Contacts',
    value: '8,432',
    change: '+18%',
    changeType: 'increase',
    icon: Users,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.changeType === 'increase' ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              <span
                className={
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }
              >
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}