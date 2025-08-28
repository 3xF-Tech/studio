
'use client';

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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AlertCircle, FileKey } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SettingsPage() {
    const { toast } = useToast();
    const [knowledgeBase, setKnowledgeBase] = useState('Para Botox, pacientes não devem estar grávidas ou ter doenças neurológicas. Candidatos ideais buscam reduzir linhas de expressão. Efeitos colaterais comuns incluem hematomas temporários.');
    const [googleCalendarId, setGoogleCalendarId] = useState('');
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [googleServiceAccount, setGoogleServiceAccount] = useState('');

    const handleSaveChanges = (section: string) => {
        // In a real app, this would save to a database.
        // For now, we just show a confirmation toast.
        console.log("Saved settings for:", section);
        toast({
            title: 'Configurações Salvas',
            description: `As configurações de "${section}" foram atualizadas com sucesso.`,
        });
    }

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Agente de IA</CardTitle>
          <CardDescription>
            Gerencie a base de conhecimento e o comportamento do seu assistente virtual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="knowledge-base">Base de Conhecimento</Label>
            <Textarea
              id="knowledge-base"
              placeholder="Adicione informações sobre procedimentos, contraindicações e perfis de pacientes aqui. A IA usará isso para qualificar leads."
              className="min-h-[250px]"
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
            />
             <p className="text-sm text-muted-foreground">
              Esta informação é usada pelo agente de qualificação de leads.
            </p>
          </div>
          <Button onClick={() => handleSaveChanges('Base de Conhecimento')}>Salvar Alterações</Button>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integração com Google Calendar</CardTitle>
          <CardDescription>
            Conecte sua agenda do Google para sincronizar os horários disponíveis e agendamentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
                <Label htmlFor="google-calendar-id">ID do Calendário</Label>
                <Input 
                    id="google-calendar-id" 
                    placeholder="ex: abcdef12345@group.calendar.google.com" 
                    value={googleCalendarId}
                    onChange={(e) => setGoogleCalendarId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                    O ID da agenda do Google que será usada para verificar a disponibilidade.
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="google-api-key">Chave de API do Google Cloud</Label>
                <Input 
                    id="google-api-key" 
                    type="password"
                    placeholder="Cole sua chave de API aqui" 
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                />
                 <p className="text-sm text-muted-foreground">
                    Usada para autenticar os pedidos à API do Google Calendar.
                </p>
            </div>
             <div className="space-y-2">
                <Label htmlFor="google-service-account">JSON da Conta de Serviço</Label>
                <Textarea
                    id="google-service-account"
                    className="min-h-[150px] font-mono text-xs"
                    placeholder='Cole o conteúdo do seu arquivo JSON de credenciais aqui'
                    value={googleServiceAccount}
                    onChange={(e) => setGoogleServiceAccount(e.target.value)}
                />
                 <p className="text-sm text-muted-foreground">
                    Credenciais para permitir que a aplicação acesse sua agenda de forma segura.
                 </p>
            </div>
             <Alert variant="destructive">
                <FileKey className="h-4 w-4" />
                <AlertTitle>Manuseio de Credenciais</AlertTitle>
                <AlertDescription>
                    Em uma aplicação real, estas credenciais devem ser armazenadas de forma segura em variáveis de ambiente no servidor e nunca expostas no cliente.
                </AlertDescription>
            </Alert>
             <div className="flex gap-2">
                <Button onClick={() => handleSaveChanges('Integração do Google Calendar')}>Salvar Configuração da Agenda</Button>
                <Button variant="outline" disabled>Testar Conexão</Button>
             </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Políticas e Automações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">Confirmar agendamentos 72 horas antes</p>
                    <p className="text-sm text-muted-foreground">Enviar lembretes automáticos por WhatsApp.</p>
                </div>
                <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="font-medium">Aplicar política de cancelamento de 48 horas</p>
                    <p className="text-sm text-muted-foreground">Notificar clientes sobre cobranças por cancelamentos tardios.</p>
                </div>
                <Switch defaultChecked />
            </div>
          </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
