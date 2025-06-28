'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, MousePointer, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const campaigns = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    status: 'Sent',
    sent: '2,456',
    opens: '1,678',
    clicks: '423',
    openRate: '68.3%',
    clickRate: '17.2%',
    sentDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Product Launch Newsletter',
    status: 'Sending',
    sent: '1,234',
    opens: '892',
    clicks: '156',
    openRate: '72.3%',
    clickRate: '12.6%',
    sentDate: '2024-01-14',
  },
  {
    id: 3,
    name: 'Weekly Newsletter #45',
    status: 'Draft',
    sent: '0',
    opens: '0',
    clicks: '0',
    openRate: '0%',
    clickRate: '0%',
    sentDate: '2024-01-13',
  },
];

export function RecentCampaigns() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
        <CardDescription>Your latest email campaigns and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <Badge
                    variant={
                      campaign.status === 'Sent'
                        ? 'default'
                        : campaign.status === 'Sending'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{campaign.openRate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MousePointer className="w-3 h-3" />
                    <span>{campaign.clickRate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{campaign.sent} sent</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}