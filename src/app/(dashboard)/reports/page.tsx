import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MessageSquare,
  CalendarCheck,
  CalendarX,
  Bot,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';

const agentActionsData = [
    { action: "Conversations", total: 1250 },
    { action: "Bookings", total: 320 },
    { action: "Cancellations", total: 45 },
    { action: "Qualifications", total: 800 },
];
const agentChartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

const channelData = [
  { name: 'Jan', WhatsApp: 400, VoiceCall: 240 },
  { name: 'Feb', WhatsApp: 300, VoiceCall: 139 },
  { name: 'Mar', WhatsApp: 200, VoiceCall: 980 },
  { name: 'Apr', WhatsApp: 278, VoiceCall: 390 },
  { name: 'May', WhatsApp: 189, VoiceCall: 480 },
];
const channelChartConfig = {
    WhatsApp: { label: "WhatsApp", color: "hsl(var(--chart-1))" },
    VoiceCall: { label: "Voice Call", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export default function ReportsPage() {
  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Reports</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+150 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">320</div>
            <p className="text-xs text-muted-foreground">+30 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cancellations</CardTitle>
            <CalendarX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Engagement</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Successful interactions</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agent Actions</CardTitle>
            <CardDescription>Overview of all actions performed by the AI agent.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={agentChartConfig} className="h-[300px] w-full">
              <BarChart data={agentActionsData} layout="vertical" accessibilityLayer>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="total" hide/>
                <YAxis dataKey="action" type="category" tickLine={false} axisLine={false} tickMargin={10} width={100}/>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Communication Channels</CardTitle>
            <CardDescription>Comparison of interactions via WhatsApp and Voice Call.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={channelChartConfig} className="h-[300px] w-full">
                <LineChart data={channelData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8}/>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Line type="monotone" dataKey="WhatsApp" stroke="var(--color-WhatsApp)" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="VoiceCall" stroke="var(--color-VoiceCall)" strokeWidth={2} dot={false}/>
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
