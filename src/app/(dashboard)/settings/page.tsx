
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

function SettingsPage() {
    const { toast } = useToast();
    const [knowledgeBase, setKnowledgeBase] = useState('Para Botox, pacientes não devem estar grávidas ou ter doenças neurológicas. Candidatos ideais buscam reduzir linhas de expressão. Efeitos colaterais comuns incluem hematomas temporários.');

    const handleSaveChanges = () => {
        // In a real app, this would save to a database.
        // For now, we just show a confirmation toast.
        console.log("Saved Knowledge Base:", knowledgeBase);
        toast({
            title: 'Configurações Salvas',
            description: 'A base de conhecimento da IA foi atualizada com sucesso.',
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
          <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
          <Separator />
           <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificações</h3>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
