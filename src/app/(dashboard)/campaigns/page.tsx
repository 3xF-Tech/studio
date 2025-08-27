import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Send, PlusCircle } from 'lucide-react';
import { mockCampaigns } from '@/lib/data';

export default function CampaignsPage() {
  return (
    <div className="py-4 grid gap-8 md:grid-cols-12">
      <div className="md:col-span-5 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>New Campaign</CardTitle>
            <CardDescription>
              Create a new targeted outreach campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input id="campaign-name" placeholder="e.g., Spring Rejuvenation" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-upload">Contact List</Label>
                <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload a .csv file</span>
                    <Button variant="outline" size="sm" className="ml-auto">Browse</Button>
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="promo-content">Promotional Content</Label>
              <Textarea
                id="promo-content"
                placeholder="Describe the service or promotion. Our AI will use this to create personalized messages."
                className="min-h-[120px]"
              />
            </div>
            <Button className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Generate Messages & Launch
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-7 lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>
              Monitor and manage your ongoing campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Conversion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                        <div>{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.service}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                    </TableCell>
                    <TableCell>{campaign.sent}</TableCell>
                    <TableCell>{(campaign.conversionRate * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
