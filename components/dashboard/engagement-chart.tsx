'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { name: 'Jan', opens: 4000, clicks: 2400, bounces: 400 },
  { name: 'Feb', opens: 3000, clicks: 1398, bounces: 210 },
  { name: 'Mar', opens: 2000, clicks: 9800, bounces: 290 },
  { name: 'Apr', opens: 2780, clicks: 3908, bounces: 200 },
  { name: 'May', opens: 1890, clicks: 4800, bounces: 181 },
  { name: 'Jun', opens: 2390, clicks: 3800, bounces: 250 },
  { name: 'Jul', opens: 3490, clicks: 4300, bounces: 210 },
];

export function EngagementChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Email Engagement Overview</CardTitle>
        <CardDescription>
          Track your email performance metrics over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="opens"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Opens"
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#10b981"
              strokeWidth={2}
              name="Clicks"
            />
            <Line
              type="monotone"
              dataKey="bounces"
              stroke="#ef4444"
              strokeWidth={2}
              name="Bounces"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}