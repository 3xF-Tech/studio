
'use client';

import { useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { mockCampaigns, Recipient } from '@/lib/data';
import { ArrowLeft, Send, Mail, MessageSquare, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function CampaignDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const campaignId = params.campaignId as string;

  const campaign = mockCampaigns.find((c) => c.id === campaignId);
  const [deliveryChannel, setDeliveryChannel] = useState('whatsapp');

  if (!campaign) {
    notFound();
  }
  
  const handleSendCampaign = () => {
    toast({
        title: `Simulando Envio da Campanha`,
        description: `Em um app real, a campanha "${campaign.name}" seria enviada para ${campaign.recipients?.length || 0} contatos via ${deliveryChannel}.`,
    })
  }

  const getRecipientContact = (recipient: Recipient) => {
    if(deliveryChannel === 'email') return recipient.email;
    return recipient.phone || recipient.email;
  }
  
  const getStatusBadge = (status: Recipient['status']) => {
    switch (status) {
        case 'Sent': return <Badge variant="secondary">Enviado</Badge>;
        case 'Opened': return <Badge className="bg-blue-100 text-blue-800">Aberto</Badge>;
        case 'Clicked': return <Badge className="bg-green-100 text-green-800">Clicado</Badge>;
        case 'Bounced': return <Badge variant="destructive">Falhou</Badge>;
        default: return <Badge variant="outline">Pendente</Badge>;
    }
  }


  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" onClick={() => router.push('/campaigns')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-2xl font-headline font-bold">{campaign.name}</h1>
      </div>
      
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Pré-visualização da Mensagem</CardTitle>
                    <CardDescription>Esta é a mensagem que seus contatos receberão. A tag `{{nome}}` será substituída pelo nome do contato.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                        {campaign.messageTemplate || "Nenhum modelo de mensagem definido para esta campanha."}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Destinatários</CardTitle>
                    <CardDescription>A lista de contatos que receberá esta campanha.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Contato ({deliveryChannel === 'email' ? 'Email' : 'Telefone'})</TableHead>
                            <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaign.recipients && campaign.recipients.map((recipient) => (
                            <TableRow key={recipient.id}>
                                <TableCell className="font-medium">{recipient.name}</TableCell>
                                <TableCell>{getRecipientContact(recipient)}</TableCell>
                                <TableCell>{getStatusBadge(recipient.status)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {(!campaign.recipients || campaign.recipients.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Nenhum destinatário nesta campanha.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-5 lg:col-span-4">
             <Card>
                <CardHeader>
                    <CardTitle>Ações da Campanha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>Canal de Envio</Label>
                        <RadioGroup defaultValue="whatsapp" onValueChange={setDeliveryChannel}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="whatsapp" id="whatsapp" />
                                <Label htmlFor="whatsapp" className="flex items-center gap-2 font-normal">
                                    <MessageSquare className="w-4 h-4" />
                                    WhatsApp
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="email" />
                                <Label htmlFor="email" className="flex items-center gap-2 font-normal">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                            </div>
                        </RadioGroup>
                         <p className="text-xs text-muted-foreground">
                           O sistema escolherá o canal disponível se um contato não tiver a opção selecionada.
                        </p>
                    </div>

                    <Separator />
                    
                    <div className="space-y-2">
                         <Label>Status da Campanha</Label>
                         <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                    </div>

                     <Button className="w-full" onClick={handleSendCampaign} disabled={campaign.status !== 'Draft' && campaign.status !== 'Active'}>
                        <Send className="mr-2 h-4 w-4" />
                        {campaign.status === 'Active' ? 'Enviar para Pendentes' : 'Iniciar Envio da Campanha'}
                    </Button>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}
