
'use client';

import { useState, useRef } from 'react';
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
import { AlertTriangle, Send, CalendarIcon, LoaderCircle, Users, Upload, AlertCircle, FileText, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { rescheduleBroadcast } from '@/ai/flows/reschedule-broadcast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function ComunicadosPage() {
    const { toast } = useToast();
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [affectedPatients, setAffectedPatients] = useState<string[]>([]);
    
    const [massMessage, setMassMessage] = useState('');
    const [isSendingMass, setIsSendingMass] = useState(false);
    const [massContactFile, setMassContactFile] = useState<File | null>(null);
    const massFileInputRef = useRef<HTMLInputElement>(null);

    const handleClearSchedule = async () => {
        if (!startDate || !endDate || !startTime || !endTime) {
             toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha o período completo.',
            });
            return;
        }

        setIsLoading(true);
        setAffectedPatients([]);

        try {
             // We call the same flow, but only use the patient list.
             const result = await rescheduleBroadcast({
                startDate: format(startDate, 'yyyy-MM-dd'),
                startTime,
                endDate: format(endDate, 'yyyy-MM-dd'),
                endTime,
                baseMessage: "Check", // Base message isn't used here, but the flow requires it.
            });

            const patientNames = result.notifications.map(n => n.patientName);
            setAffectedPatients(patientNames);

            if (patientNames.length > 0) {
                 toast({
                    title: 'Pacientes Afetados Identificados',
                    description: `Foram encontrados ${patientNames.length} agendamentos no período selecionado.`,
                });
            } else {
                 toast({
                    title: 'Nenhum Agendamento Encontrado',
                    description: 'Não há pacientes para notificar no período selecionado.',
                });
            }

        } catch (error) {
             console.error('Clear schedule error:', error);
             toast({
                variant: 'destructive',
                title: 'Erro ao Verificar Agenda',
                description: 'Não foi possível verificar os agendamentos com a IA.',
            });
        } finally {
            setIsLoading(false);
        }
    }
    
     const handleSendMassMessage = () => {
        if (!massMessage) {
            toast({
                variant: 'destructive',
                title: 'Mensagem vazia',
                description: 'Por favor, escreva a mensagem que deseja enviar.',
            });
            return;
        }
        setIsSendingMass(true);
        
        // Simulate sending a message
        setTimeout(() => {
             toast({
                title: 'Simulação de Envio',
                description: `Em um app real, sua mensagem seria enviada para os contatos ${massContactFile ? `do arquivo ${massContactFile.name}` : 'da lista selecionada'}.`,
            });
            setIsSendingMass(false);
        }, 1500)
    };

    const handleMassFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "text/csv") {
            setMassContactFile(file);
        } else {
            toast({
                variant: 'destructive',
                title: 'Arquivo Inválido',
                description: 'Por favor, selecione um arquivo no formato .csv',
            })
            setMassContactFile(null);
        }
    };


  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Comunicados</h1>
       <Tabs defaultValue="liberar-agenda">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="liberar-agenda">Liberar Agenda</TabsTrigger>
          <TabsTrigger value="notificacao-massa">Notificação em Massa</TabsTrigger>
        </TabsList>
        <TabsContent value="liberar-agenda">
            <Card>
                <CardHeader>
                <CardTitle>Liberar Período na Agenda</CardTitle>
                <CardDescription>
                    Use esta função para limpar um período específico na sua agenda e identificar os pacientes que serão impactados.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Ação Irreversível</AlertTitle>
                    <AlertDescription>
                    Esta ação irá cancelar permanentemente todos os agendamentos no sistema para o período selecionado. Use com cuidado.
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
                
                 {affectedPatients.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="w-5 h-5"/>
                                Pacientes Afetados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                {affectedPatients.map((name, i) => <li key={i}>{name}</li>)}
                            </ul>
                            <p className="text-xs mt-4">
                                Agora você pode ir para a aba de "Notificação em Massa" para enviar uma mensagem a estes ou outros pacientes.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Button onClick={handleClearSchedule} variant="destructive" disabled={isLoading}>
                    {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Liberar Agenda e Ver Pacientes
                </Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="notificacao-massa">
            <Card>
                <CardHeader>
                    <CardTitle>Notificação em Massa</CardTitle>
                    <CardDescription>
                        Envie uma mensagem para uma lista de contatos. A IA pode ajudar a gerar e personalizar mensagens.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="mass-contact-upload">Lista de Contatos (CSV)</Label>
                        <Input 
                            type="file" 
                            id="mass-contact-upload" 
                            ref={massFileInputRef} 
                            className="hidden" 
                            onChange={handleMassFileChange}
                            accept=".csv"
                        />
                        {massContactFile ? (
                             <div className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md mt-2 bg-muted/50">
                                <FileText className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium truncate">{massContactFile.name}</span>
                                <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setMassContactFile(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div 
                                className="flex items-center gap-2 p-2 border-2 border-dashed rounded-md mt-2 cursor-pointer hover:border-primary/50"
                                onClick={() => massFileInputRef.current?.click()}
                            >
                                <Upload className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Faça upload de um arquivo</span>
                                <Button variant="outline" size="sm" className="ml-auto" onClick={(e) => { e.stopPropagation(); massFileInputRef.current?.click(); }}>Procurar</Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mass-message">Mensagem de Notificação</Label>
                        <Textarea
                        id="mass-message"
                        placeholder="Escreva a mensagem que será enviada..."
                        className="min-h-[150px]"
                        value={massMessage}
                        onChange={(e) => setMassMessage(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                        A IA pode personalizar esta mensagem para cada destinatário.
                        </p>
                    </div>

                    <Button onClick={handleSendMassMessage} disabled={isSendingMass}>
                        {isSendingMass ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Enviar Mensagens
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
       </Tabs>
    </div>
  );
}

export default ComunicadosPage;
