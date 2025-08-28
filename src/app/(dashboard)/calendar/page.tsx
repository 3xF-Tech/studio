
'use client';

import { useState, useEffect } from 'react';
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
import { mockAppointments, Appointment } from '@/lib/data';
import { PlusCircle, TowerControl, LoaderCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { scheduleAppointment } from '@/ai/flows/appointment-scheduling';
import { format, isSameDay, isWithinInterval, startOfDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [procedure, setProcedure] = useState('');
  const [availability, setAvailability] = useState('');
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isClient, setIsClient] = useState(false);

  // Set the initial date on the client to avoid hydration mismatch
  useEffect(() => {
    if (!selectedDate) {
        setSelectedDate(new Date());
    }
    setIsClient(true);
  }, []);

  const handleSchedule = async () => {
    if (!patientName || !procedure || !availability) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
      });
      return;
    }

    setIsScheduling(true);
    try {
      const result = await scheduleAppointment({
        patientName,
        procedure,
        availability,
      });
      toast({
        title: 'Agendamento Sugerido pela IA',
        description: (
          <div className="text-sm">
            <p className="mb-2">{result.confirmationMessage}</p>
            <ul className="list-disc pl-5">
              {result.suggestedAppointmentTimes.map((time) => (
                <li key={time}>{time}</li>
              ))}
            </ul>
          </div>
        ),
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Scheduling error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Agendar',
        description: 'Não foi possível obter sugestões de agendamento da IA.',
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const getFilteredAppointments = (filter: 'day' | 'week' | 'selected', date?: Date) => {
    const today = startOfDay(new Date());
    if (filter === 'day') {
      return mockAppointments.filter(apt => isSameDay(apt.startTime, today));
    }
    if (filter === 'week') {
       const nextSevenDays = addDays(today, 7);
       return mockAppointments.filter(apt => isWithinInterval(apt.startTime, { start: today, end: nextSevenDays }));
    }
    if (filter === 'selected' && date) {
        return mockAppointments.filter(apt => isSameDay(apt.startTime, date));
    }
    return mockAppointments;
  }
  
  const appointmentsForSelectedDate = selectedDate ? getFilteredAppointments('selected', selectedDate) : [];
  const appointmentsForDayTab = getFilteredAppointments('day');
  const appointmentsForWeekTab = getFilteredAppointments('week');


  const AppointmentList = ({ appointments, emptyMessage }: { appointments: Appointment[], emptyMessage: string }) => (
     <div className="space-y-4">
        {appointments.length > 0 ? (
            appointments.map(apt => (
                <div key={apt.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-20 text-right">
                        <p className="font-bold text-sm">
                          {format(apt.startTime, 'HH:mm')}
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
                          {apt.status === 'Confirmed' ? 'Confirmado' : apt.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                          </Badge>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-sm text-muted-foreground text-center">{emptyMessage}</p>
        )}
      </div>
  );


  return (
    <>
    <div className="py-4">
    <Tabs defaultValue="month" className="w-full">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-headline font-bold">Agenda</h1>
        <div className="ml-auto flex items-center gap-2">
           <TabsList>
            <TabsTrigger value="day">Dia</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>
          <Button asChild size="sm" variant="outline" className="h-8 gap-1">
            <Link href="/broadcast">
                <TowerControl className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Liberar Agenda
                </span>
            </Link>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Novo Agendamento
            </span>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8 lg:col-span-9">
            <TabsContent value="month">
                <Card>
                    <CardContent className="p-0">
                         {isClient && <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="p-3 w-full"
                            locale={ptBR}
                            classNames={{
                                head_cell: 'w-full',
                                cell: 'w-full',
                                day: 'w-full h-24 items-start p-2',
                            }}
                         />}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="day">
                <Card>
                    <CardHeader>
                        <CardTitle>Agenda de Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <AppointmentList appointments={appointmentsForDayTab} emptyMessage="Nenhum agendamento para hoje." />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="week">
                <Card>
                    <CardHeader>
                        <CardTitle>Agenda da Semana (Próximos 7 dias)</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <AppointmentList appointments={appointmentsForWeekTab} emptyMessage="Nenhum agendamento para os próximos 7 dias." />
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
        <div className="md:col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>
                {selectedDate 
                  ? `Compromissos para ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}`
                  : 'Nenhum dia selecionado.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
                <AppointmentList 
                    appointments={appointmentsForSelectedDate} 
                    emptyMessage={selectedDate ? "Nenhum agendamento para esta data." : "Selecione um dia no calendário."}
                />
            </CardContent>
          </Card>
        </div>
      </div>
    </Tabs>
    </div>
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Agendamento com IA</DialogTitle>
            <DialogDescription>
              Forneça os detalhes do paciente e deixe a IA sugerir os melhores horários.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-name" className="text-right">
                Nome do Paciente
              </Label>
              <Input
                id="patient-name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="procedure" className="text-right">
                Procedimento
              </Label>
              <Input
                id="procedure"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availability" className="text-right">
                Disponibilidade
              </Label>
              <Textarea
                id="availability"
                placeholder="ex: 'Terças após as 15h', 'Qualquer manhã de dia de semana'"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSchedule} disabled={isScheduling}>
              {isScheduling ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Obter Sugestões da IA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
