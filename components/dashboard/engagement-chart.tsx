'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface EngagementData {
  name: string;
  opens: number;
}

export function EngagementChart() {
  const [data, setData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/email/engagement')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Error loading engagement data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Email Engagement Overview</CardTitle>
        <CardDescription>
          Track how many emails were opened each month.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[350px] w-full rounded-md" />
          </div>
        ) : (
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
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

