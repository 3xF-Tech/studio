
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
import { AlertTriangle, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function BroadcastPage() {
    const { toast } = useToast();
    const [message, setMessage] = useState('Olá! Devido a um imprevisto, precisei liberar minha agenda para a próxima semana. Em breve, a assistente virtual entrará em contato para reagendar sua consulta. Agradeço a compreensão.');

    const handleSendBroadcast = () => {
        // In a real app, this would trigger a backend process to:
        // 1. Clear all appointments in the Google Calendar for the specified period.
        // 2. Fetch all affected patients from the CRM.
        // 3. Send the personalized message via WhatsApp/SMS to each patient.
        console.log("Broadcast message:", message);
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
            Use esta função para limpar sua agenda futura e notificar automaticamente todos os clientes impactados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ação Irreversível</AlertTitle>
            <AlertDescription>
              Ao clicar no botão de envio, todos os agendamentos futuros serão cancelados no sistema. Esta ação não pode ser desfeita. Use com cuidado.
            </AlertDescription>
          </Alert>

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
