
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FileKey, MessageSquare, BookUser, Calendar, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


function SettingsPage() {
    const { toast } = useToast();
    const [knowledgeBase, setKnowledgeBase] = useState('Para Botox, pacientes não devem estar grávidas ou ter doenças neurológicas. Candidatos ideais buscam reduzir linhas de expressão. Efeitos colaterais comuns incluem hematomas temporários.');
    const [googleCalendarId, setGoogleCalendarId] = useState('');
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [googleServiceAccount, setGoogleServiceAccount] = useState('');
    const [whatsappToken, setWhatsappToken] = useState('');
    const [whatsappNumberId, setWhatsappNumberId] = useState('');
    const [notionKey, setNotionKey] = useState('');
    const [notionDbId, setNotionDbId] = useState('');

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
            <div className="flex items-center gap-3">
             <div className="bg-blue-500/10 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                 <CardTitle>Integração com Google Calendar</CardTitle>
                <CardDescription>
                    Conecte sua agenda do Google para sincronizar os horários disponíveis e agendamentos.
                </CardDescription>
            </div>
          </div>
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
             <div className="flex items-center gap-4 mt-6">
                <Button onClick={() => handleSaveChanges('Integração do Google Calendar')}>Salvar Configuração da Agenda</Button>
                <Button variant="outline" disabled>Testar Conexão</Button>
             </div>
             <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Ver Guia de Configuração
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-4">
                  <p>Siga estes passos para obter as credenciais do Google Calendar:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Cloud Console</a>.</li>
                    <li>Crie um novo projeto ou selecione um existente.</li>
                    <li>No menu de navegação, vá para "APIs e Serviços" > "Credenciais".</li>
                    <li>Clique em "Criar Credenciais" e selecione "Conta de Serviço".</li>
                    <li>Preencha o nome da conta de serviço, conceda a ela o papel de "Editor" e conclua.</li>
                    <li>Na tela de Contas de Serviço, clique na conta recém-criada. Vá para a aba "CHAVES".</li>
                    <li>Clique em "ADICIONAR CHAVE" > "Criar nova chave". Escolha "JSON" como tipo e clique em "CRIAR". O arquivo será baixado.</li>
                    <li>Copie o conteúdo do arquivo JSON baixado e cole no campo "JSON da Conta de Serviço".</li>
                    <li>Volte para a página principal da API e habilite a "API do Google Calendar".</li>
                    <li>Vá para o <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Calendar</a>. Nas configurações da agenda que deseja usar, vá para "Compartilhar com pessoas específicas".</li>
                    <li>Adicione o endereço de e-mail da conta de serviço que você criou (ex: nome-da-conta@seu-projeto.iam.gserviceaccount.com) e dê a ela permissão de "Fazer alterações nos eventos".</li>
                    <li>O "ID do Calendário" é encontrado nas configurações da agenda, na seção "Integrar agenda".</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="bg-green-500/10 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Integração com WhatsApp</CardTitle>
              <CardDescription>
                Conecte-se à API da Meta para enviar notificações e mensagens via WhatsApp.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
                <Label htmlFor="whatsapp-token">Token de Acesso Permanente</Label>
                <Input 
                    id="whatsapp-token" 
                    type="password"
                    placeholder="Cole seu token de acesso permanente da Meta aqui" 
                    value={whatsappToken}
                    onChange={(e) => setWhatsappToken(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="whatsapp-number-id">ID do Número de Telefone</Label>
                <Input 
                    id="whatsapp-number-id" 
                    placeholder="Cole o ID do seu número de telefone da plataforma Meta" 
                    value={whatsappNumberId}
                    onChange={(e) => setWhatsappNumberId(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4 mt-6">
                <Button onClick={() => handleSaveChanges('Integração do WhatsApp')}>Salvar Configuração do WhatsApp</Button>
            </div>
             <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="item-1">
                 <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Ver Guia de Configuração
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-4">
                  <p>Para obter as credenciais do WhatsApp Business API:</p>
                   <ol className="list-decimal list-inside space-y-2">
                      <li>Acesse o painel da <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Meta for Developers</a>.</li>
                      <li>Crie um novo aplicativo do tipo "Business".</li>
                      <li>No painel do seu aplicativo, encontre o produto "WhatsApp" e clique em "Configurar".</li>
                      <li>Na seção "API Setup", você encontrará o "ID do Número de Telefone".</li>
                      <li>Para o token, o token temporário é fornecido. Para produção, você precisará gerar um "Token de Acesso Permanente" na seção "Usuários do sistema" das Configurações do seu Gerenciador de Negócios.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="bg-gray-500/10 p-3 rounded-full">
                <BookUser className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <CardTitle>Integração com Notion</CardTitle>
              <CardDescription>
                Sincronize pacientes e agendamentos com seu banco de dados do Notion.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
                <Label htmlFor="notion-key">Chave da Integração (Internal Integration Token)</Label>
                <Input 
                    id="notion-key" 
                    type="password"
                    placeholder="Cole sua chave de API 'Internal Integration Token' aqui" 
                    value={notionKey}
                    onChange={(e) => setNotionKey(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="notion-db-id">ID do Banco de Dados</Label>
                <Input 
                    id="notion-db-id" 
                    placeholder="Cole o ID do seu banco de dados do Notion" 
                    value={notionDbId}
                    onChange={(e) => setNotionDbId(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4 mt-6">
                <Button onClick={() => handleSaveChanges('Integração do Notion')}>Salvar Configuração do Notion</Button>
            </div>
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="item-1">
                 <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Ver Guia de Configuração
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-4">
                  <p>Para obter as credenciais do Notion:</p>
                   <ol className="list-decimal list-inside space-y-2">
                      <li>Acesse <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-primary underline">suas integrações no Notion</a>.</li>
                      <li>Clique em "New integration". Dê um nome e selecione o Workspace associado.</li>
                      <li>Clique em "Submit". Na próxima tela, copie o "Internal Integration Token" e cole no campo acima.</li>
                      <li>Crie a página com o Banco de Dados que você quer usar no Notion.</li>
                      <li>Clique no ícone de três pontos no canto superior direito do seu banco de dados e clique em "Add connections".</li>
                      <li>Procure pelo nome da integração que você acabou de criar e a selecione.</li>
                      <li>Para obter o ID do Banco de Dados, abra a página do banco de dados no Notion. A URL terá o formato: `notion.so/workspace-name/DATABASE_ID?v=...`. O `DATABASE_ID` é o valor que você precisa.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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

    