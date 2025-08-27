"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, LoaderCircle, Sparkles } from 'lucide-react';
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
  | 'qualifying_procedure'
  | 'qualifying_info'
  | 'scheduling_procedure'
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
      { id: Date.now().toString(), text, isUser },
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
        <p>Hello! I'm the virtual assistant for Carvalhal Aesthetics.</p>
        <p>How can I help you today?</p>
        <div className="flex flex-col gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => startQualificationFlow()}>
            <Sparkles className="w-4 h-4 mr-2" />
            Check if I qualify for a procedure
          </Button>
          <Button variant="outline" size="sm" onClick={() => startSchedulingFlow()}>
             Schedule an appointment
          </Button>
        </div>
      </div>,
      false
    );
  };

  const startQualificationFlow = () => {
    addMessage("Check if I qualify for a procedure", true);
    addMessage("Of course! What procedure are you interested in?", false);
    setFlowState('qualifying_procedure');
  };

  const startSchedulingFlow = () => {
    addMessage("Schedule an appointment", true);
    addMessage("I can help with that. What is the desired procedure?", false);
    setFlowState('scheduling_procedure');
  };

  const handleUserInput = async () => {
    if (!input.trim()) return;

    addMessage(input, true);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      if (flowState === 'qualifying_procedure') {
        setFlowData({ procedureOfInterest: userInput });
        setFlowState('qualifying_info');
        addMessage("Thank you. Please tell me a bit about your concerns, relevant medical history, and desired outcomes.", false);
      } else if (flowState === 'qualifying_info') {
        const fullData: LeadQualificationInput = {
          procedureOfInterest: flowData.procedureOfInterest!,
          patientInformation: userInput,
          knowledgeBase: "General knowledge base: patients should be over 18, not pregnant, and in good health. Specific contraindications apply per procedure.",
        };
        const result = await leadQualification(fullData);
        addMessage(
          <div className="space-y-2">
            <p><strong>Qualification Assessment:</strong> {result.isQualified ? "You are a potential candidate!" : "May not be suitable"}</p>
            <p><strong>Reason:</strong> {result.reason}</p>
            <p><strong>Next Steps:</strong> {result.nextSteps}</p>
            <p className="text-xs text-muted-foreground mt-2">Note: This is a pre-qualification and not a medical diagnosis. A full consultation is required.</p>
          </div>,
          false
        );
        setFlowState('idle');
        addMessage(
            <Button variant="link" size="sm" onClick={startConversation} className="p-0 h-auto">Start Over</Button>,
            false
        );
      } else if (flowState === 'scheduling_procedure') {
         setFlowData({ patientName: 'Patient', procedure: userInput });
         setFlowState('scheduling_availability');
         addMessage("Great. What is your general availability? (e.g., 'weekday afternoons')", false);
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
                <p>Here are some suggested times:</p>
                <ul className="list-disc pl-5 mt-2">
                    {result.suggestedAppointmentTimes.map((time, i) => <li key={i}>{time}</li>)}
                </ul>
            </div>,
            false
        );
        setFlowState('idle');
        addMessage(
            <Button variant="link" size="sm" onClick={startConversation} className="p-0 h-auto">Start Over</Button>,
            false
        );
      } else {
        addMessage("I'm not sure how to handle that. Please choose an option to start.", false);
        startConversation();
      }
    } catch (error) {
      console.error('AI Flow Error:', error);
      addMessage("I'm sorry, an error occurred. Please try again later.", false);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not process the request with the AI agent.",
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
            <Bot className="w-6 h-6 text-primary" />
            Virtual Assistant
          </SheetTitle>
           <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
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
                    placeholder="Type your message..."
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
