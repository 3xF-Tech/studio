
'use client';

import { useState, useRef } from 'react';
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
import { Upload, Send, LoaderCircle, AlertCircle, FileText, X } from 'lucide-react';
import { mockCampaigns } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { generateCampaignMessage } from '@/ai/flows/campaign-message-generation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default function CampaignsPage() {
    const [campaignName, setCampaignName] = useState('');
    const [promoContent, setPromoContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [contactFile, setContactFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "text/csv") {
            setContactFile(file);
        } else {
            toast({
                variant: 'destructive',
                title: 'Arquivo Inválido',
                description: 'Por favor, selecione um arquivo no formato .csv',
            })
            setContactFile(null);
        }
    };

    const handleGenerate = async () => {
        if (!campaignName || !promoContent) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha o nome da campanha e o conteúdo.',
            });
            return;
        }

        setIsGenerating(true);
        try {
             // In a real app, you would iterate through a list of patient profiles.
             // For this demo, we'll use a sample profile.
            const samplePatientProfile = "Maria, 45 anos, interessada em tratamentos de rejuvenescimento facial. Já realizou botox há 6 meses.";

            const result = await generateCampaignMessage({
                patientProfile: samplePatientProfile,
                promotionalContent: promoContent,
            });
            
            const descriptionBase = `Mensagem gerada pela IA para um paciente exemplo:`;
            const fileDescription = contactFile ? `A campanha seria enviada para os contatos em "${contactFile.name}".` : "Em um app real, a campanha seria enviada para a lista de contatos.";


            toast({
                duration: 10000,
                title: `Mensagem para ${campaignName}`,
                description: (
                <div className="text-sm space-y-2 mt-2">
                    <p className="font-semibold">{descriptionBase}</p>
                    <p className="p-2 border rounded-md bg-muted">{result.message}</p>
                    <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                        {fileDescription}
                    </p>
                </div>
                ),
            });
        } catch (error) {
            console.error('Campaign generation error:', error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Gerar Campanha',
                description: 'Não foi possível gerar a mensagem com a IA.',
            });
        } finally {
            setIsGenerating(false);
        }
    }


  return (
    <div className="py-4 grid gap-8 md:grid-cols-12">
      <div className="md:col-span-5 lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle>Nova Campanha com IA</CardTitle>
            <CardDescription>
              Crie uma nova campanha de divulgação direcionada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="campaign-name">Nome da Campanha</Label>
              <Input id="campaign-name" placeholder="ex: Rejuvenescimento de Primavera" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-upload">Lista de Contatos (CSV)</Label>
                <Input 
                    type="file" 
                    id="contact-upload" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".csv"
                />
                 {contactFile ? (
                    <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md mt-2 bg-muted/50">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium truncate">{contactFile.name}</span>
                        <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setContactFile(null)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                 ) : (
                    <div 
                        className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md mt-2 cursor-pointer hover:border-primary/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Faça upload de um arquivo</span>
                        <Button variant="outline" size="sm" className="ml-auto" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Procurar</Button>
                    </div>
                 )}
            </div>
             <div className="space-y-2">
              <Label htmlFor="promo-content">Conteúdo Promocional</Label>
              <Textarea
                id="promo-content"
                placeholder="Descreva o serviço ou promoção. Nossa IA usará isso para criar mensagens personalizadas."
                className="min-h-[120px]"
                value={promoContent}
                onChange={(e) => setPromoContent(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Gerar Mensagens
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-7 lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle>Campanhas Ativas</CardTitle>
            <CardDescription>
              Monitore e gerencie suas campanhas em andamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead>Conversão</TableHead>
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
