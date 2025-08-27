"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, LoaderCircle, Sparkles, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { leadQualification, LeadQualificationInput } from '@/ai/flows/lead-qualification';
import { scheduleAppointment, ScheduleAppointmentInput } from '@/ai/flows/appointment-scheduling';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  text: string | React.ReactNode;
  isUser: boolean;
};

type FlowState = 
  | 'idle'
  | 'qualifying_interest'
  | 'qualifying_info'
  | 'scheduling_reason'
  | 'scheduling_availability';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [flowData, setFlowData] = useState<Partial<LeadQualificationInput & ScheduleAppointmentInput>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addMessage = (text: string | React.ReactNode, isUser: boolean) => {
    setMessages(prev => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, isUser },
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      startConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const startConversation = () => {
    setMessages([]);
    setFlowState('idle');
    setFlowData({});
    addMessage(
      <div>
        <p>Olá! Sou a assistente virtual de Fabiana Carvalhal.</p>
        <p>Como posso te ajudar hoje?</p>
        <div className="flex flex-col gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => startQualificationFlow()}>
            <Sparkles className="w-4 h-4 mr-2" />
            Saber mais sobre as abordagens
          </Button>
          <Button variant="outline" size="sm" onClick={() => startSchedulingFlow()}>
             Agendar uma consulta
          </Button>
        </div>
      </div>,
      false
    );
  };

  const startQualificationFlow = () => {
    addMessage("Saber mais sobre as abordagens", true);
    addMessage("Com certeza! Sobre qual área você gostaria de saber mais: Neuropsicologia, Psicodrama ou PNL Sistêmica?", false);
    setFlowState('qualifying_interest');
  };

  const startSchedulingFlow = () => {
    addMessage("Agendar uma consulta", true);
    addMessage("Posso ajudar com isso. Qual é o motivo da consulta?", false);
    setFlowState('scheduling_reason');
  };

  const handleUserInput = async () => {
    if (!input.trim()) return;

    addMessage(input, true);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      if (flowState === 'qualifying_interest') {
        setFlowData({ procedureOfInterest: userInput });
        setFlowState('qualifying_info');
        addMessage("Obrigada. Por favor, me diga um pouco mais sobre o seu interesse ou o que você gostaria de entender sobre essa abordagem.", false);
      } else if (flowState === 'qualifying_info') {
        const fullData: LeadQualificationInput = {
          procedureOfInterest: flowData.procedureOfInterest!,
          patientInformation: userInput,
          knowledgeBase: "Fabiana Carvalhal é psicóloga clínica e neuropsicóloga, com pós-graduação em Psicodrama e especialização em Neuropsicologia e Reabilitação Cognitiva. É também trainer em PNL Sistêmica. Atua em contextos clínicos, hospitalares, escolares e organizacionais.",
        };
        const result = await leadQualification(fullData);
        addMessage(
          <div className="space-y-2">
            <p><strong>Análise:</strong> {result.isQualified ? "É uma abordagem adequada!" : "Talvez outra abordagem seja melhor"}</p>
            <p><strong>Recomendação:</strong> {result.reason}</p>
            <p><strong>Próximos Passos:</strong> {result.nextSteps}</p>
            <p className="text-xs text-muted-foreground mt-2">Nota: Esta é uma pré-análise e não um diagnóstico. Uma consulta completa é necessária para um direcionamento adequado.</p>
          </div>,
          false
        );
        setFlowState('idle');
        addMessage(
            <Button variant="link" size="sm" onClick={startConversation} className="p-0 h-auto">Começar de Novo</Button>,
            false
        );
      } else if (flowState === 'scheduling_reason') {
         setFlowData({ patientName: 'Cliente', procedure: userInput });
         setFlowState('scheduling_availability');
         addMessage("Entendido. Qual é a sua disponibilidade geral? (ex: 'tardes durante a semana')", false);
      } else if (flowState === 'scheduling_availability') {
        const scheduleData: ScheduleAppointmentInput = {
            patientName: flowData.patientName!,
            procedure: flowData.procedure!,
            availability: userInput,
        };
        const result = await scheduleAppointment(scheduleData);
        addMessage(
            <div>
                <p>{result.confirmationMessage}</p>
                <p>Aqui estão alguns horários sugeridos:</p>
                <ul className="list-disc pl-5 mt-2">
                    {result.suggestedAppointmentTimes.map((time, i) => <li key={i}>{time}</li>)}
                </ul>
            </div>,
            false
        );
        setFlowState('idle');
        addMessage(
            <Button variant="link" size="sm" onClick={startConversation} className="p-0 h-auto">Começar de Novo</Button>,
            false
        );
      } else {
        addMessage("Não tenho certeza de como lidar com isso. Por favor, escolha uma opção para começar.", false);
        startConversation();
      }
    } catch (error) {
      console.error('AI Flow Error:', error);
      addMessage("Desculpe, ocorreu um erro. Por favor, tente novamente mais tarde.", false);
      toast({
        variant: "destructive",
        title: "Erro de IA",
        description: "Não foi possível processar a solicitação com o agente de IA.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg">
          <Bot className="w-8 h-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-headline">
            <BrainCircuit className="w-6 h-6 text-primary" />
            Assistente Virtual
          </SheetTitle>
           <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </SheetClose>
        </SheetHeader>
        <div className="flex-1 flex flex-col bg-muted/20">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="flex flex-col gap-4">
                    {messages.map(msg => (
                    <div key={msg.id} className={cn('flex items-start gap-3', { 'justify-end': msg.isUser })}>
                        {!msg.isUser && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback><Bot size={20} /></AvatarFallback>
                        </Avatar>
                        )}
                        <div className={cn('max-w-[80%] rounded-lg p-3 text-sm', msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                        {typeof msg.text === 'string' ? <p>{msg.text}</p> : msg.text}
                        </div>
                        {msg.isUser && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback><User size={20} /></AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback><Bot size={20} /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] rounded-lg p-3 text-sm bg-background">
                            <LoaderCircle className="animate-spin w-5 h-5" />
                        </div>
                    </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleUserInput();
                    }}
                    className="flex items-center gap-2"
                >
                    <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

    