
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
import { PlusCircle, Search, MoreHorizontal, Sparkles, LoaderCircle, Bot, CalendarDays, Clock, Eye, Trash2, Edit, MessageSquare } from 'lucide-react';
import { mockPatients, Patient } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { leadQualification } from '@/ai/flows/lead-qualification';
import { scheduleAppointment } from '@/ai/flows/appointment-scheduling';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

function PatientTable({ 
    patients, 
    selectedPatients,
    onSelectAll,
    onSelectPatient,
    onViewDetails,
    onEdit,
    onDelete
}: { 
    patients: Patient[], 
    selectedPatients: string[],
    onSelectAll: (checked: boolean) => void,
    onSelectPatient: (patientId: string, checked: boolean) => void,
    onViewDetails: (patient: Patient) => void,
    onEdit: (patient: Patient) => void,
    onDelete: (patient: Patient) => void
}) {
    const allSelected = patients.length > 0 && selectedPatients.length === patients.length;
    const isIndeterminate = selectedPatients.length > 0 && selectedPatients.length < patients.length;

    return (
        <Table>
            <TableHeader>
              <TableRow>
                 <TableHead padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => onSelectAll(!!checked)}
                    aria-label="Selecionar todos"
                    ref={(el) => el && (el.indeterminate = isIndeterminate)}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden lg:table-cell">Próximo Vencimento</TableHead>
                <TableHead className="hidden lg:table-cell">Método Pag.</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} data-state={selectedPatients.includes(patient.id) && "selected"}>
                   <TableCell padding="checkbox">
                    <Checkbox
                        checked={selectedPatients.includes(patient.id)}
                        onCheckedChange={(checked) => onSelectPatient(patient.id, !!checked)}
                        aria-label={`Selecionar ${patient.name}`}
                    />
                  </TableCell>
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
                      {patient.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {patient.phone}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                        {patient.nextPaymentDue ? 
                            <div className={cn("flex items-center gap-2", isPast(patient.nextPaymentDue) && "text-destructive")}>
                                {format(patient.nextPaymentDue, 'dd/MM/yyyy')}
                            </div>
                         : <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                         {patient.preferredPaymentMethod || <span className="text-muted-foreground">N/A</span>}
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
                        <DropdownMenuItem onClick={() => onViewDetails(patient)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(patient)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(patient)}>
                            <Trash2 className="mr-2 h-4 w-4" />
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
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const [isQualifyModalOpen, setIsQualifyModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isSchedulePackageModalOpen, setIsSchedulePackageModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [isQualifying, setIsQualifying] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // State for AI Lead Qualification
  const [procedure, setProcedure] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState("A Dra. Fabiana Carvalhal é especialista em Neuropsicologia, Psicodrama e PNL Sistêmica. A Avaliação Neuropsicológica investiga o funcionamento cognitivo, emocional e comportamental para diagnosticar TDAH, TEA, Dificuldades de Aprendizado, Demências, entre outros, auxiliando na criação de planos de tratamento multidisciplinares.");
  
  // State for New/Edit Patient Form
  const [patientForm, setPatientForm] = useState({
      id: '',
      name: '',
      email: '',
      phone: '',
      duration: '50',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip: '',
      }
  });
  
  // State for Package Scheduling
  const [scheduleProcedure, setScheduleProcedure] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const { toast } = useToast();

    const filterPatients = (tab: string, searchTerm: string = '') => {
        let newFilteredPatients = patients;
        setSelectedPatients([]); // Clear selection on filter change

        if (tab !== 'all') {
            newFilteredPatients = newFilteredPatients.filter(
                (p) => p.status.toLowerCase() === tab
            );
        }

        if (searchTerm) {
            newFilteredPatients = newFilteredPatients.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPatients(newFilteredPatients);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        filterPatients(tab, searchInput?.value || '');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        filterPatients(activeTab, e.target.value);
    };


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
    if (!value) return value;
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    let match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})(\d{0,4})$/);
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
      setPatientForm(prev => ({...prev, phone: formatted}));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setPatientForm(prev => ({
          ...prev,
          address: {
              ...prev.address,
              [id]: value
          }
      }));
  }

  const resetForm = () => {
     setPatientForm({ 
         id: '', name: '', email: '', phone: '', duration: '50',
         address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' }
    });
  }

  const handleOpenAddModal = () => {
      resetForm();
      setIsAddPatientModalOpen(true);
  }
  
  const handleAddPatient = () => {
    if (!patientForm.name || !patientForm.email || !patientForm.phone || !patientForm.duration) {
        toast({
            variant: 'destructive',
            title: 'Campos obrigatórios',
            description: 'Por favor, preencha todos os campos do novo paciente.',
        });
        return;
    }
    
    const newPatient: Patient = {
        id: (patients.length + 1).toString(),
        name: patientForm.name,
        email: patientForm.email,
        phone: patientForm.phone,
        status: 'Active',
        package: null,
        sessionDuration: parseInt(patientForm.duration, 10),
        address: patientForm.address,
    };
    
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    
    toast({
        title: 'Paciente Adicionado',
        description: `${newPatient.name} foi adicionado com sucesso.`,
    });

    setIsAddPatientModalOpen(false);
    resetForm();
  };
  
  const handleOpenEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientForm({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        duration: patient.sessionDuration?.toString() || '50',
        address: patient.address || { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' }
    });
    setIsEditPatientModalOpen(true);
  }

  const handleEditPatient = () => {
    if (!patientForm.id) return;

    const updatedPatients = patients.map(p => 
        p.id === patientForm.id ? {
            ...p,
            name: patientForm.name,
            email: patientForm.email,
            phone: patientForm.phone,
            sessionDuration: parseInt(patientForm.duration, 10),
            address: patientForm.address,
        } : p
    );
    setPatients(updatedPatients);
    filterPatients(activeTab); // Refilter after edit

    toast({
        title: "Paciente Atualizado",
        description: "Os dados foram atualizados com sucesso."
    });
    setIsEditPatientModalOpen(false);
    resetForm();
  }

  const handleOpenDeleteAlert = (patient: Patient) => {
      setSelectedPatient(patient);
      setIsDeleteAlertOpen(true);
  }

  const handleDeletePatient = () => {
    if (!selectedPatient) return;
    const updatedPatients = patients.filter(p => p.id !== selectedPatient.id);
    setPatients(updatedPatients);
    filterPatients(activeTab); // Refilter after delete

    toast({
        variant: 'destructive',
        title: "Paciente Excluído",
        description: `${selectedPatient.name} foi removido com sucesso.`
    });
    setIsDeleteAlertOpen(false);
    setSelectedPatient(null);
  }
  
  const handleOpenDetailsModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  }

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
        selectedDays: selectedDays.map(day => {
            if (day.endsWith('-feira')) return day;
            return day.toLowerCase() + '-feira';
        }),
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

  const handleSelectPatient = (patientId: string, checked: boolean) => {
      setSelectedPatients(prev => 
          checked ? [...prev, patientId] : prev.filter(id => id !== patientId)
      )
  }

  const handleSelectAll = (checked: boolean) => {
      if (checked) {
          setSelectedPatients(filteredPatients.map(p => p.id));
      } else {
          setSelectedPatients([]);
      }
  }


  return (
    <>
    <Tabs defaultValue="all" onValueChange={handleTabChange}>
      <div className="flex flex-col sm:flex-row sm:items-center py-4 gap-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="inactive">Inativos</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
              onChange={handleSearch}
            />
          </div>
           {activeTab === 'inactive' && selectedPatients.length > 0 && (
             <Button asChild variant="outline" size="sm" className="h-9 gap-1">
                <Link href="/campaigns">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Criar Campanha ({selectedPatients.length})
                </Link>
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-9 gap-1" onClick={() => setIsQualifyModalOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Qualificar Lead
            </span>
          </Button>
          <Button size="sm" className="h-9 gap-1" onClick={handleOpenAddModal}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-rap">
              Adicionar Paciente
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Gerenciamento de Pacientes</CardTitle>
                <CardDescription>
                    Veja, busque e gerencie todos os registros de seus pacientes.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <PatientTable 
            patients={filteredPatients}
            selectedPatients={selectedPatients}
            onSelectAll={handleSelectAll}
            onSelectPatient={handleSelectPatient}
            onViewDetails={handleOpenDetailsModal}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteAlert}
          />
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
                placeholder="ex: Avaliação Neuropsicológica, Psicodrama"
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
      
      {/* Add/Edit Patient Modal */}
      <Dialog open={isAddPatientModalOpen || isEditPatientModalOpen} onOpenChange={isAddPatientModalOpen ? setIsAddPatientModalOpen : setIsEditPatientModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditPatientModalOpen ? 'Editar Paciente' : 'Adicionar Novo Paciente'}</DialogTitle>
            <DialogDescription>
              {isEditPatientModalOpen ? 'Atualize os detalhes do paciente.' : 'Insira os detalhes para o novo paciente.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <h4 className="font-semibold text-sm">Informações Pessoais</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="ex: João da Silva" value={patientForm.name} onChange={(e) => setPatientForm(prev => ({...prev, name: e.target.value}))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="ex: joao.silva@example.com" value={patientForm.email} onChange={(e) => setPatientForm(prev => ({...prev, email: e.target.value}))} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" placeholder="ex: 55 11 99999 9999" value={patientForm.phone} onChange={handlePhoneChange} maxLength={15} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duração da Consulta (minutos)</Label>
                    <Input id="duration" type="number" placeholder="ex: 50" value={patientForm.duration} onChange={(e) => setPatientForm(prev => ({...prev, duration: e.target.value}))} />
                </div>
            </div>
            
            <Separator className="my-4" />
            <h4 className="font-semibold text-sm">Endereço</h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="zip">CEP</Label>
                    <Input id="zip" placeholder="12345-678" value={patientForm.address.zip} onChange={handleAddressChange} />
                </div>
                <div className="space-y-2 md:col-span-4">
                    <Label htmlFor="street">Logradouro</Label>
                    <Input id="street" placeholder="Rua das Flores" value={patientForm.address.street} onChange={handleAddressChange} />
                </div>
                 <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" value={patientForm.address.number} onChange={handleAddressChange} />
                </div>
                 <div className="space-y-2 md:col-span-4">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" placeholder="Apto 101" value={patientForm.address.complement} onChange={handleAddressChange} />
                </div>
                <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" value={patientForm.address.neighborhood} onChange={handleAddressChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" value={patientForm.address.city} onChange={handleAddressChange} />
                </div>
                 <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" value={patientForm.address.state} onChange={handleAddressChange} />
                </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { isEditPatientModalOpen ? setIsEditPatientModalOpen(false) : setIsAddPatientModalOpen(false) }}>Cancelar</Button>
            <Button onClick={isEditPatientModalOpen ? handleEditPatient : handleAddPatient}>
              {isEditPatientModalOpen ? 'Salvar Alterações' : 'Adicionar Paciente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Patient Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de <span className="font-semibold">{selectedPatient?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Patient Details Modal */}
       <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes de {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid gap-4 py-4 text-sm max-h-[70vh] overflow-y-auto pr-6">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={selectedPatient.status === 'Active' ? 'default' : 'secondary'}>{selectedPatient.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{selectedPatient.email}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Telefone</span>
                    <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duração da Consulta</span>
                    <span>{selectedPatient.sessionDuration || 'N/A'} min</span>
                </div>
                 <Separator className="my-2" />
                 {selectedPatient.address && (selectedPatient.address.street || selectedPatient.address.zip) && (
                    <div className="space-y-2">
                        <h4 className="font-semibold">Endereço</h4>
                        <p>{selectedPatient.address.street}, {selectedPatient.address.number}{selectedPatient.address.complement ? `, ${selectedPatient.address.complement}` : ''}</p>
                        <p>{selectedPatient.address.neighborhood} - {selectedPatient.address.city}/{selectedPatient.address.state}</p>
                        <p>CEP: {selectedPatient.address.zip}</p>
                    </div>
                 )}
                <Separator className="my-2" />
                {selectedPatient.package ? (
                    <div className="space-y-2">
                        <h4 className="font-semibold">Pacote Ativo</h4>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Sessões</span>
                            <span>{selectedPatient.package.sessions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Dias</span>
                            <span>{selectedPatient.package.days}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Horário</span>
                            <span>{selectedPatient.package.time}</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Valor Total</span>
                            <span>R$ {selectedPatient.package.totalValue.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center">Nenhum pacote ativo.</p>
                )}
            </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
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
