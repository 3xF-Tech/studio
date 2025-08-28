
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
import { PlusCircle, Search, MoreHorizontal, Sparkles, LoaderCircle, Bot } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

function PatientTable({ patients }: { patients: Patient[] }) {
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Visit
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Next Appointment
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                  <TableCell className="hidden md:table-cell">
                    {patient.lastVisit}
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    {patient.nextAppointment || 'N/A'}
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
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
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
  const [isQualifying, setIsQualifying] = useState(false);
  
  // State for AI Lead Qualification
  const [procedure, setProcedure] = useState('');
  const [patientInfo, setPatientInfo] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('For Botox, patients should not be pregnant or have neurological diseases. Ideal candidates are seeking to reduce fine lines. Common side effects include temporary bruising.');
  
  // State for New Patient Form
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  
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

  const handleAddPatient = () => {
    if (!newPatientName || !newPatientEmail || !newPatientPhone) {
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
        lastVisit: new Date().toISOString().split('T')[0], // Today's date
        nextAppointment: null,
        status: 'Active',
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
  };


  return (
    <>
    <Tabs defaultValue="all">
      <div className="flex items-center py-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => setIsQualifyModalOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Qualify Lead
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddPatientModalOpen(true)}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Patient
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>
            View, search, and manage all your patient records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientTable patients={patients} />
        </CardContent>
      </Card>
    </Tabs>

    {/* AI Lead Qualification Modal */}
    <Dialog open={isQualifyModalOpen} onOpenChange={setIsQualifyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Bot />
                AI Lead Qualification
            </DialogTitle>
            <DialogDescription>
             Use the AI agent to pre-qualify leads for aesthetic procedures based on your knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="procedure">Procedure of Interest</Label>
              <Input
                id="procedure"
                placeholder="e.g., Botox, Preenchimento Labial"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-info">Patient Information</Label>
              <Textarea
                id="patient-info"
                placeholder="Describe patient's concerns, medical history, and desired outcomes."
                className="min-h-[100px]"
                value={patientInfo}
                onChange={(e) => setPatientInfo(e.target.value)}
              />
            </div>
             <Separator className="my-2" />
             <div className="space-y-2">
                <Label htmlFor="knowledge-base">Knowledge Base</Label>
                 <Textarea
                    id="knowledge-base"
                    className="min-h-[120px] text-xs"
                    value={knowledgeBase}
                    onChange={(e) => setKnowledgeBase(e.target.value)}
                 />
                 <p className="text-xs text-muted-foreground">
                    The AI uses this information (from your settings) to make its decision. You can edit it here for a one-time analysis.
                 </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleQualify} disabled={isQualifying}>
              {isQualifying ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Qualify Lead with AI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Patient Modal */}
      <Dialog open={isAddPatientModalOpen} onOpenChange={setIsAddPatientModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the details for the new patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-patient-name">Full Name</Label>
              <Input
                id="new-patient-name"
                placeholder="e.g., John Doe"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-patient-email">Email</Label>
              <Input
                id="new-patient-email"
                type="email"
                placeholder="e.g., john.doe@example.com"
                value={newPatientEmail}
                onChange={(e) => setNewPatientEmail(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-patient-phone">Phone</Label>
              <Input
                id="new-patient-phone"
                type="tel"
                placeholder="e.g., (123) 456-7890"
                value={newPatientPhone}
                onChange={(e) => setNewPatientPhone(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPatient}>
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    