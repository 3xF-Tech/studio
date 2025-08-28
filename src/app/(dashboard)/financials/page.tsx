
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
import { DollarSign, TrendingUp, Calendar, Bot, AlertCircle } from 'lucide-react';
import { mockFinancials, mockAppointments, FinancialRecord, mockContracts } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { addMonths, isWithinInterval, startOfYear, endOfYear, startOfMonth, endOfMonth } from 'date-fns';

export default function FinancialsPage() {
    const { toast } = useToast();

    const today = new Date();
    // Faturamento realizado: soma de todos os registros marcados como 'Paid' no mês corrente
    const actualRevenueMonth = mockFinancials
        .filter(record => {
            const recordDate = new Date(record.date);
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
        const pendingCount = mockFinancials.filter(r => r.status === 'Pending').length;
        toast({
            title: 'Cobrança Automática Iniciada',
            description: `A IA está enviando lembretes de pagamento para os ${pendingCount} clientes com pendências.`,
        });
    }

  return (
    <div className="py-4 space-y-4">
       <div className="flex items-center">
            <h1 className="text-2xl font-headline font-bold">Financeiro</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button onClick={handleAutomaticBilling}>
                    <Bot className="mr-2 h-4 w-4" />
                    Cobrança Automática de Pendentes
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFinancials.map((record: FinancialRecord) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.patientName}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell>
                    <TableCell>R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={record.status === 'Paid' ? 'default' : record.status === 'Pending' ? 'secondary' : 'destructive'}
                        className={
                            record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }
                      >
                        {record.status === 'Paid' ? 'Pago' : record.status === 'Pending' ? 'Pendente' : 'Atrasado'}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
