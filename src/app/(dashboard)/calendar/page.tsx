
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
import { PlusCircle, TowerControl, LoaderCircle, Clock, User, Stethoscope } from 'lucide-react';
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
import { format, isSameDay, isWithinInterval, startOfDay, addDays, endOfWeek, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [procedure, setProcedure] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isClient, setIsClient] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Set the initial date on the client to avoid hydration mismatch
  useEffect(() => {
    if (!selectedDate) {
        setSelectedDate(new Date());
    }
    setIsClient(true);
  }, []);
  
  const handleDaySelection = (day: string) => {
    setSelectedDays(prev => 
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  const handleSchedule = async () => {
    if (!patientName || !procedure || selectedDays.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o nome, procedimento e selecione ao menos um dia.',
      });
      return;
    }

    setIsScheduling(true);
    setAvailableTimes([]);
    try {
      const result = await scheduleAppointment({
        patientName,
        procedure,
        selectedDays,
      });
      setAvailableTimes(result.suggestedAppointmentTimes);
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
      const targetDate = date ? startOfDay(date) : today;
      return mockAppointments.filter(apt => isSameDay(apt.startTime, targetDate)).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
    }
    if (filter === 'week') {
       const start = startOfWeek(today, { locale: ptBR });
       const end = endOfWeek(today, { locale: ptBR });
       return mockAppointments.filter(apt => isWithinInterval(apt.startTime, { start, end })).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
    }
    if (filter === 'selected' && date) {
        return mockAppointments.filter(apt => isSameDay(apt.startTime, date)).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
    }
    return mockAppointments.sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
  }
  
  const appointmentsForSelectedDate = selectedDate ? getFilteredAppointments('selected', selectedDate) : [];
  const appointmentsForDayTab = getFilteredAppointments('day', new Date());
  const appointmentsForWeekTab = getFilteredAppointments('week');


  const AppointmentList = ({ appointments, emptyMessage }: { appointments: Appointment[], emptyMessage: string }) => (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        appointments.map((apt) => (
          <Card key={apt.id} className="w-full shadow-md border-l-4 border-primary">
            <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3 lg:col-span-2 text-center">
                <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md">
                   <p className="text-lg font-bold">{format(apt.startTime, 'HH:mm')}</p>
                   <p className="text-xs text-muted-foreground">às {format(apt.endTime, 'HH:mm')}</p>
                </div>
              </div>
              <div className="col-span-9 lg:col-span-10">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">{apt.procedure}</h3>
                    <Badge
                        variant={apt.status === 'Confirmed' ? 'default' : 'secondary'}
                        className={`text-xs ${
                        apt.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-200' 
                        : apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                        : 'bg-red-100 text-red-800 border-red-200'}`}
                    >
                       {apt.status === 'Confirmed' ? 'Confirmado' : apt.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                    </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{apt.patientName}</span>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-10">
            <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
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
                            className="p-3"
                            locale={ptBR}
                            classNames={{
                                day: 'h-24 items-start p-2',
                            }}
                         />}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="day">
                <Card>
                    <CardHeader>
                        <CardTitle>Agenda de Hoje - {format(new Date(), 'dd MMMM, yyyy', { locale: ptBR })}</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <AppointmentList appointments={appointmentsForDayTab} emptyMessage="Nenhum agendamento para hoje." />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="week">
                <Card>
                    <CardHeader>
                        <CardTitle>Agenda da Semana: {format(startOfWeek(new Date(), { locale: ptBR }), 'dd/MM')} - {format(endOfWeek(new Date(), { locale: ptBR }), 'dd/MM/yyyy')}</CardTitle>
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
                value={selectedDays.join(', ')}
                onChange={(e) => setSelectedDays(e.target.value.split(', '))}
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

    