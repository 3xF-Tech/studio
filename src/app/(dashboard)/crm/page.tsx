
'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, MoreHorizontal, Sparkles, LoaderCircle, Bot, CalendarDays, Clock } from 'lucide-react';
import { mockPatients, Patient } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { leadQualification } from '@/ai/flows/lead-qualification';
import { scheduleAppointment } from '@/ai/flows/appointment-scheduling';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function PatientTable({ patients, onSchedulePackage }: { patients: Patient[], onSchedulePackage: (patient: Patient) => void }) {
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden lg:table-cell">Duração</TableHead>
                <TableHead className="hidden lg:table-cell">Pacote de Sessões</TableHead>
                 <TableHead className="hidden lg:table-cell">Valor do Pacote</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                        {patient.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={patient.status === 'Active' ? 'outline' : 'secondary'}
                      className={patient.status === 'Active' ? 'text-green-600 border-green-600' : ''}
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.phone}
                  </TableCell>
                   <TableCell className="hidden lg:table-cell">
                        {patient.sessionDuration ? `${patient.sessionDuration} min` : <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {patient.package ? (
                       <Button variant="ghost" size="sm" onClick={() => onSchedulePackage(patient)} className="h-auto p-0 flex flex-col items-start font-normal">
                            <div>{patient.package.sessions} sessões</div>
                            <div className="text-xs text-muted-foreground">{patient.package.days} - {patient.package.time}</div>
                       </Button>
                    ) : <span className="text-muted-foreground">N/A</span>}
                   </TableCell>
                   <TableCell className="hidden lg:table-cell">
                     {patient.package ? 
                        <Button variant="ghost" size="sm" onClick={() => onSchedulePackage(patient)} className="h-auto p-0 font-normal">
                         {`R$ ${patient.package.totalValue.toLocaleString('pt-BR')}`}
                        </Button>
                     : <span className="text-muted-foreground">N/A</span>}
                   </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    )
}


export default function CrmPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isQualifyModalOpen, setIsQualifyModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isSchedulePackageModalOpen, setIsSchedulePackageModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [isQualifying, setIsQualifying] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // State for AI Lead Qualification
  const [procedure, setProcedure] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('Para Botox, pacientes não devem estar grávidas ou ter doenças neurológicas. Candidatos ideais buscam reduzir linhas de expressão. Efeitos colaterais comuns incluem hematomas temporários.');
  
  // State for New Patient Form
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientDuration, setNewPatientDuration] = useState('50');

  // State for Package Scheduling
  const [scheduleProcedure, setScheduleProcedure] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const { toast } = useToast();

  const handleQualify = async () => {
    if (!procedure || !patientInfo) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o procedimento e as informações do paciente.',
      });
      return;
    }
    setIsQualifying(true);
    try {
      const result = await leadQualification({
        procedureOfInterest: procedure,
        patientInformation: patientInfo,
        knowledgeBase: knowledgeBase,
      });

      toast({
        duration: 10000,
        title: 'Análise de Qualificação de Lead pela IA',
        description: (
          <div className="text-sm space-y-2 mt-2">
             <div className={`flex items-center p-2 rounded-md ${result.isQualified ? 'bg-green-100' : 'bg-red-100'}`}>
                <p>
                  <strong>Qualificado:</strong>{' '}
                  <span className={`font-bold ${result.isQualified ? 'text-green-800' : 'text-red-800'}`}>
                    {result.isQualified ? 'Sim' : 'Não'}
                  </span>
                </p>
             </div>
            <div>
                <p className="font-semibold">Motivo:</p>
                <p className="text-muted-foreground">{result.reason}</p>
            </div>
            <div>
                <p className="font-semibold">Próximos Passos Sugeridos:</p>
                <p className="text-muted-foreground">{result.nextSteps}</p>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
              Nota: Esta é uma pré-análise e não substitui uma consulta profissional.
            </p>
          </div>
        ),
      });
      setIsQualifyModalOpen(false);
    } catch (error) {
      console.error('Lead qualification error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na Qualificação',
        description: 'Não foi possível qualificar o lead com a IA.',
      });
    } finally {
      setIsQualifying(false);
    }
  };
  
    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})(\d{0,4})$/);
        if (!match) return cleaned;
        
        const [_, p1, p2, p3, p4] = match;
        
        let result = '';
        if (p1) result += p1;
        if (p2) result += ` ${p2}`;
        if (p3) result += ` ${p3}`;
        if (p4) result += ` ${p4}`;
        
        return result.trim();
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setNewPatientPhone(formatted);
    };

  const handleAddPatient = () => {
    if (!newPatientName || !newPatientEmail || !newPatientPhone || !newPatientDuration) {
        toast({
            variant: 'destructive',
            title: 'Campos obrigatórios',
            description: 'Por favor, preencha todos os campos do novo paciente.',
        });
        return;
    }
    
    const newPatient: Patient = {
        id: (patients.length + 1).toString(),
        name: newPatientName,
        email: newPatientEmail,
        phone: newPatientPhone,
        status: 'Active',
        package: null,
        sessionDuration: parseInt(newPatientDuration, 10)
    };
    
    setPatients(prevPatients => [...prevPatients, newPatient]);
    
    toast({
        title: 'Paciente Adicionado',
        description: `${newPatientName} foi adicionado com sucesso.`,
    });

    setIsAddPatientModalOpen(false);
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewPatientDuration('50');
  };

  const handleOpenSchedulePackageModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setScheduleProcedure(patient.package ? `${patient.package.sessions} sessões` : '');
    setSelectedDays([]);
    setAvailableTimes([]);
    setIsSchedulePackageModalOpen(true);
  };

  const handleSchedulePackage = async () => {
    if (!scheduleProcedure || !selectedPatient) {
         toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Paciente ou procedimento não selecionado.',
        });
        return;
    }
    if (selectedDays.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Campos obrigatórios',
            description: 'Por favor, selecione ao menos um dia da semana.',
        });
        return;
    }

    setIsScheduling(true);
    setAvailableTimes([]);

     try {
      const result = await scheduleAppointment({
        patientName: selectedPatient.name,
        procedure: scheduleProcedure,
        selectedDays: selectedDays,
      });

      setAvailableTimes(result.suggestedAppointmentTimes);
      toast({
        title: 'Horários Disponíveis Encontrados',
        description: `A IA encontrou os seguintes horários para ${selectedPatient.name}.`,
      });

    } catch (error) {
       console.error('Scheduling error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Buscar Horários',
        description: 'Não foi possível obter sugestões da IA.',
      });
    } finally {
        setIsScheduling(false);
    }
  }
  
  const handleDaySelection = (day: string) => {
    setSelectedDays(prev => 
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }

  return (
    <>
    <Tabs defaultValue="all">
      <div className="flex items-center py-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setIsQualifyModalOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Qualificar Lead
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddPatientModalOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Paciente
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pacientes</CardTitle>
          <CardDescription>
            Veja, busque e gerencie todos os registros de seus pacientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientTable patients={patients} onSchedulePackage={handleOpenSchedulePackageModal} />
        </CardContent>
      </Card>
    </Tabs>

    {/* AI Lead Qualification Modal */}
    <Dialog open={isQualifyModalOpen} onOpenChange={setIsQualifyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Bot />
                Qualificação de Lead com IA
            </DialogTitle>
            <DialogDescription>
             Use o agente de IA para pré-qualificar leads para procedimentos com base em sua base de conhecimento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="procedure">Procedimento de Interesse</Label>
              <Input
                id="procedure"
                placeholder="ex: Botox, Preenchimento Labial"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-info">Informações do Paciente</Label>
              <Textarea
                id="patient-info"
                placeholder="Descreva as preocupações do paciente, histórico médico e resultados desejados."
                className="min-h-[100px]"
                value={patientInfo}
                onChange={(e) => setPatientInfo(e.target.value)}
              />
            </div>
             <Separator className="my-2" />
             <div className="space-y-2">
                <Label htmlFor="knowledge-base">Base de Conhecimento</Label>
                 <Textarea
                    id="knowledge-base"
                    className="min-h-[120px] text-xs"
                    value={knowledgeBase}
                    onChange={(e) => setKnowledgeBase(e.target.value)}
                 />
                 <p className="text-xs text-muted-foreground">
                    A IA usa esta informação (de suas configurações) para tomar sua decisão. Você pode editá-la aqui para uma análise única.
                 </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleQualify} disabled={isQualifying}>
              {isQualifying ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Qualificar Lead com IA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Patient Modal */}
      <Dialog open={isAddPatientModalOpen} onOpenChange={setIsAddPatientModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            <DialogDescription>
              Insira os detalhes para o novo paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-patient-name">Nome Completo</Label>
              <Input
                id="new-patient-name"
                placeholder="ex: João da Silva"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-patient-email">Email</Label>
              <Input
                id="new-patient-email"
                type="email"
                placeholder="ex: joao.silva@example.com"
                value={newPatientEmail}
                onChange={(e) => setNewPatientEmail(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-patient-phone">Telefone</Label>
              <Input
                id="new-patient-phone"
                type="tel"
                placeholder="ex: 55 11 9999 9999"
                value={newPatientPhone}
                onChange={handlePhoneChange}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-patient-duration">Duração da Consulta (minutos)</Label>
              <Input
                id="new-patient-duration"
                type="number"
                placeholder="ex: 50"
                value={newPatientDuration}
                onChange={(e) => setNewPatientDuration(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddPatient}>
              Adicionar Paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Package Modal */}
      <Dialog open={isSchedulePackageModalOpen} onOpenChange={setIsSchedulePackageModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <CalendarDays />
                Agendar Pacote para {selectedPatient?.name}
            </DialogTitle>
            <DialogDescription>
              Selecione os dias da semana desejados e clique em buscar para ver os horários disponíveis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-procedure">Pacote de Sessões</Label>
              <Input
                id="schedule-procedure"
                value={scheduleProcedure}
                onChange={(e) => setScheduleProcedure(e.target.value)}
              />
            </div>
             <div className="space-y-2">
                <Label>Dias da Semana Preferenciais</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {weekdays.map(day => (
                        <div key={day} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`day-${day}`} 
                                onCheckedChange={() => handleDaySelection(day)}
                                checked={selectedDays.includes(day)}
                            />
                            <Label htmlFor={`day-${day}`} className="font-normal">{day}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {isScheduling && <div className="flex justify-center items-center gap-2 text-muted-foreground"><LoaderCircle className="w-4 h-4 animate-spin" /> Buscando horários...</div>}
            
            {availableTimes.length > 0 && (
                 <div className="space-y-2 pt-2">
                    <Label className="font-bold">Horários Disponíveis</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time) => (
                            <Button key={time} variant="outline">
                                <Clock className="mr-2 h-4 w-4" />
                                {time}
                            </Button>
                        ))}
                    </div>
                     <p className="text-xs text-muted-foreground">Clique em um horário para confirmar com o paciente.</p>
                 </div>
            )}
           
          </div>
          <DialogFooter>
            <Button onClick={handleSchedulePackage} disabled={isScheduling || selectedDays.length === 0}>
              {isScheduling ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              Buscar Horários Disponíveis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
