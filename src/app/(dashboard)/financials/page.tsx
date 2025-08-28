
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
import { DollarSign, TrendingUp, Calendar, Bot, Send, Copy, Save } from 'lucide-react';
import { mockFinancials, FinancialRecord, mockContracts } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { addMonths, isWithinInterval, startOfYear, endOfYear, startOfMonth, endOfMonth } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function FinancialsPage() {
    const { toast } = useToast();
    const [financials, setFinancials] = useState<FinancialRecord[]>(mockFinancials);
    const [isPixModalOpen, setIsPixModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
    const [pixCode, setPixCode] = useState('');

    const today = new Date();
    // Faturamento realizado: soma de todos os registros marcados como 'Paid' no mês corrente
    const actualRevenueMonth = financials
        .filter(record => {
            const recordDate = new Date(record.issueDate);
            return record.status === 'Paid' && isWithinInterval(recordDate, { start: startOfMonth(today), end: endOfMonth(today) });
        })
        .reduce((acc, curr) => acc + curr.amount, 0);
        
    // Faturamento a receber (total)
    const totalToReceive = (range: 'year' | 'month' | 'next3months') => {
        const start = range === 'year' ? startOfYear(today) : startOfMonth(today);
        const end = range === 'year' ? endOfYear(today) : range === 'month' ? endOfMonth(today) : addMonths(today, 3);
        
        return mockContracts
            .flatMap(contract => contract.paymentDates.map(pd => ({ ...pd, patientName: contract.patientName })))
            .filter(payment => isWithinInterval(payment.date, { start, end }) && payment.status === 'Pending')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }
    
    const toReceiveThisYear = totalToReceive('year');
    const toReceiveThisMonth = totalToReceive('month');
    const toReceiveNext3Months = totalToReceive('next3months');

    const handleAutomaticBilling = () => {
        const pendingCount = financials.filter(r => r.status === 'Pending').length;
        toast({
            title: 'Cobrança Automática Iniciada',
            description: `A IA está enviando lembretes de pagamento para os ${pendingCount} clientes com pendências.`,
        });
    }

    const handleOpenPixModal = (record: FinancialRecord) => {
        setSelectedRecord(record);
        setPixCode(record.pixCode || '');
        setIsPixModalOpen(true);
    };

    const handleSavePixCode = () => {
        if (!selectedRecord) return;
        const updatedFinancials = financials.map(r => 
            r.id === selectedRecord.id ? { ...r, pixCode: pixCode } : r
        );
        setFinancials(updatedFinancials);
        toast({
            title: 'Código PIX Salvo',
            description: `O código PIX para ${selectedRecord.patientName} foi salvo.`,
        });
        setIsPixModalOpen(false);
    }

    const handleCopyPixCode = () => {
        navigator.clipboard.writeText(pixCode);
        toast({
            title: 'Código PIX Copiado!',
            description: 'O código foi copiado para a área de transferência.',
        });
    }

    const handleSendPixLink = () => {
        if (!selectedRecord || !pixCode) return;
        toast({
            title: 'Link de Pagamento Enviado',
            description: (
                <div>
                    <p>O link de pagamento PIX para {selectedRecord.patientName} foi enviado.</p>
                    <p className="font-mono text-xs mt-2 p-2 bg-muted rounded">Código: {pixCode}</p>
                </div>
            ),
        });
        setIsPixModalOpen(false);
    }


  return (
    <>
    <div className="py-4 space-y-4">
       <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-2xl font-headline font-bold">Financeiro</h1>
            <div className="sm:ml-auto flex items-center gap-2">
                <Button onClick={handleAutomaticBilling}>
                    <Bot className="mr-2 h-4 w-4" />
                    Cobrança Automática
                </Button>
            </div>
       </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizado (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {actualRevenueMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total recebido este mês.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber (Mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                R$ {toReceiveThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
             <p className="text-xs text-muted-foreground">Pendente no mês corrente.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber (Próx. 3 meses)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                R$ {toReceiveNext3Months.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
             <p className="text-xs text-muted-foreground">Total pendente no trimestre.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Receber (Ano)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                R$ {toReceiveThisYear.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
             <p className="text-xs text-muted-foreground">Total pendente em {today.getFullYear()}.</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Acompanhe todos os registros financeiros, pagos e pendentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Data Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.map((record: FinancialRecord) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium whitespace-nowrap">{record.patientName}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(record.issueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                     <TableCell className="whitespace-nowrap">{new Date(record.paymentDueDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                    <TableCell className="whitespace-nowrap">R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={record.status === 'Paid' ? 'default' : record.status === 'Pending' ? 'secondary' : 'destructive'}
                        className={
                            `whitespace-nowrap ${record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`
                        }
                      >
                        {record.status === 'Paid' ? 'Pago' : record.status === 'Pending' ? 'Pendente' : 'Atrasado'}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.paymentMethod}</TableCell>
                    <TableCell>
                      {(record.status === 'Pending' || record.status === 'Overdue') && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenPixModal(record)}>
                          <Send className="mr-2 h-3 w-3" />
                          Gerenciar PIX
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </ScrollArea>
        </CardContent>
      </Card>
    </div>

    <Dialog open={isPixModalOpen} onOpenChange={setIsPixModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerenciar Código PIX</DialogTitle>
            <DialogDescription>
              Para a cobrança de R$ {selectedRecord?.amount.toLocaleString('pt-BR')} de {selectedRecord?.patientName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label htmlFor="pix-code">Código PIX (Copia e Cola)</Label>
                <Input 
                    id="pix-code" 
                    value={pixCode}
                    onChange={(e) => setPixCode(e.target.value)}
                    placeholder="Cole o código PIX aqui"
                />
            </div>
            <div className="flex justify-end gap-2">
                 <Button variant="secondary" onClick={handleCopyPixCode} disabled={!pixCode}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                </Button>
                <Button onClick={handleSavePixCode}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                </Button>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
             <Button onClick={handleSendPixLink} disabled={!pixCode} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Simular Envio de Link para Paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
