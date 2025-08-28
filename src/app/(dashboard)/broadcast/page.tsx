
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Send, CalendarIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

function BroadcastPage() {
    const { toast } = useToast();
    const [message, setMessage] = useState('Olá! Devido a um imprevisto, precisei liberar minha agenda para o período abaixo. Em breve, a assistente virtual entrará em contato para reagendar sua consulta. Agradeço a compreensão.');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSendBroadcast = () => {
        if (!startDate || !endDate || !startTime || !endTime || !message) {
             toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha o período completo e a mensagem.',
            });
            return;
        }
        // In a real app, this would trigger a backend process to:
        // 1. Clear all appointments in the Google Calendar for the specified period.
        // 2. Fetch all affected patients from the CRM.
        // 3. Send the personalized message via WhatsApp/SMS to each patient.
        console.log("Broadcast message:", message);
        console.log("Period to clear:", {
            startDate,
            startTime,
            endDate,
            endTime
        });
        toast({
            title: 'Transmissão Enviada',
            description: 'A notificação para liberação da agenda foi enviada a todos os pacientes relevantes.',
        });
    }

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Liberar Agenda e Notificar Pacientes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Enviar Notificação em Massa</CardTitle>
          <CardDescription>
            Use esta função para limpar um período específico na sua agenda e notificar automaticamente todos os clientes impactados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ação Irreversível</AlertTitle>
            <AlertDescription>
              Ao clicar no botão de envio, todos os agendamentos no período selecionado serão cancelados no sistema. Esta ação não pode ser desfeita. Use com cuidado.
            </AlertDescription>
          </Alert>

           <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start-date">Data de Início</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Escolha uma data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="start-time">Hora de Início</Label>
                    <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)}/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="end-date">Data de Término</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Escolha uma data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end-time">Hora de Término</Label>
                    <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
           </div>

          <div className="space-y-2">
            <Label htmlFor="broadcast-message">Mensagem de Notificação</Label>
            <Textarea
              id="broadcast-message"
              placeholder="Escreva a mensagem que será enviada aos pacientes..."
              className="min-h-[150px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
             <p className="text-sm text-muted-foreground">
              A IA personalizará esta mensagem para cada paciente, se aplicável.
            </p>
          </div>

          <Button onClick={handleSendBroadcast} variant="destructive">
            <Send className="mr-2 h-4 w-4" />
            Liberar Agenda e Enviar Notificações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default BroadcastPage;
