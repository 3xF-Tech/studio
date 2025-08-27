import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAppointments } from '@/lib/data';
import { PlusCircle, Blocks } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="py-4">
    <Tabs defaultValue="month" className="w-full">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-headline font-bold">Agenda</h1>
        <div className="ml-auto flex items-center gap-2">
           <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Blocks className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Clear Period
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New Appointment
            </span>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8 lg:col-span-9">
            <TabsContent value="month">
                <Card>
                    <CardContent className="p-0">
                         <Calendar
                            mode="single"
                            className="p-3 w-full"
                            classNames={{
                                head_cell: 'w-full',
                                cell: 'w-full',
                                day: 'w-full h-24 items-start p-2',
                            }}
                         />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="day">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Day view coming soon.</p>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="week">
                <Card>
                    <CardHeader>
                        <CardTitle>This Week's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Week view coming soon.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
        <div className="md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>Appointments for today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAppointments.map(apt => (
                  <div key={apt.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 text-right">
                          <p className="font-bold text-sm">
                            {apt.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </p>
                           <p className="text-xs text-muted-foreground">
                            {Math.abs(apt.endTime.getTime() - apt.startTime.getTime()) / 60000} min
                           </p>
                      </div>
                      <div className="flex-1 border-l-2 border-primary pl-3">
                          <p className="font-semibold">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground">{apt.procedure}</p>
                          <Badge
                            variant={
                                apt.status === 'Confirmed' ? 'default' : 'secondary'
                            }
                            className={`mt-1 text-xs ${apt.status === 'Confirmed' ? 'bg-green-500/20 text-green-700' : ''}`}
                            >
                            {apt.status}
                            </Badge>
                      </div>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Tabs>
    </div>
  );
}
