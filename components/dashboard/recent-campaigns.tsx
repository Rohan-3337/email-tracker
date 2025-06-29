'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EmailDetailsDialog from '../ui/EmailDetailsDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Campaign {
  id: string;
  name: string;
  status: 'Sent' | 'Draft';
  opened: number;
  totalSent: number;
  sentDate: string;
}

export function RecentCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/email/recent')
      .then((res) => res.json())
      .then(setCampaigns)
      .catch((err) => console.error('Error fetching recent campaigns:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>
            Your latest email templates and their engagement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : campaigns.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-6">
                No campaigns found yet.
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between space-x-3 mb-1">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <Badge variant={'default'} className="mb-8">
                        {"Sent"}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <Badge className={campaign?.opened ? "bg-green-400" : "bg-yellow-200 text-muted-foreground"}>
                          {campaign?.opened ? 'Opened' : 'Not Opened'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <Badge variant="secondary">{campaign.totalSent} sent</Badge>
                      </div>
                      <div className="text-xs ml-4">{campaign.sentDate}</div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedId(campaign.id);
                          setOpenDialog(true);
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                     
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <EmailDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        emailId={selectedId}
      />
    </>
  );
}

