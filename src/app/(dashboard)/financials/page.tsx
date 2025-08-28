
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
import { DollarSign, TrendingUp, CreditCard, Bot, AlertCircle } from 'lucide-react';
import { mockFinancials, mockAppointments, FinancialRecord } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function FinancialsPage() {
    const { toast } = useToast();

    // Faturamento executado: soma de todos os registros marcados como 'Paid'
    const actualRevenue = mockFinancials
        .filter(record => record.status === 'Paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Faturamento previsto: soma dos preços de todos os agendamentos futuros confirmados
    const projectedRevenue = mockAppointments
        .filter(apt => apt.startTime > new Date() && apt.status === 'Confirmed')
        .reduce((acc, curr) => acc + (curr.price || 0), 0);

    const handleAutomaticBilling = () => {
        // Em uma aplicação real, isso iteraria sobre os pagamentos pendentes e enviaria lembretes
        // via WhatsApp/SMS/Email.
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
            <CardTitle className="text-sm font-medium">Faturamento Realizado (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {actualRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total já recebido dos pacientes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Previsto (Próximos 30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                R$ {projectedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
             <p className="text-xs text-muted-foreground">Valor de agendamentos futuros confirmados.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {mockFinancials.filter(r => r.status === 'Pending').length}
            </div>
             <p className="text-xs text-muted-foreground">Registros aguardando pagamento.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                R$ {(actualRevenue / mockFinancials.filter(r => r.status === 'Paid').length || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
             <p className="text-xs text-muted-foreground">Valor médio por transação paga.</p>
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
