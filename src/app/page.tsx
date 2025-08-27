import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BrainCircuit,
  Users,
  NotebookText,
  ChevronRight,
  Quote,
} from 'lucide-react';
import ChatWidget from '@/components/chat-widget';
import ChatTriggerButton from '@/components/chat-trigger-button';

export default function Home() {
  const services = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      title: 'Neuropsicologia',
      description:
        'Avaliação e reabilitação cognitiva em contextos clínicos, hospitalares e forenses.',
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Psicodrama',
      description:
        'Abordagem terapêutica em grupo ou individual para explorar e resolver conflitos.',
    },
    {
      icon: <NotebookText className="w-8 h-8 text-primary" />,
      title: 'PNL Sistêmica',
      description:
        'Trainer em Programação Neurolinguística para desenvolvimento pessoal e profissional.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
           <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-headline font-bold">
            Fabiana Carvalhal
          </span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
          <Link
            href="#services"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Serviços
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Sobre
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contato
          </Link>
        </nav>
         <div className="ml-auto md:hidden">
            <Button asChild variant="outline">
                <Link href="/login">Área do Cliente</Link>
            </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                   <p className="text-primary md:text-xl font-semibold">
                     Psicóloga Clínica & Neuropsicóloga
                  </p>
                  <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Cuidado, Desenvolvimento e Saúde Mental
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Com uma abordagem que integra Psicodrama e PNL Sistêmica, ofereço suporte para seu bem-estar e crescimento.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <a href="#contact">
                      Agende uma Conversa
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                     <Link href="/login">Área do Cliente</Link>
                  </Button>
                </div>
              </div>
                <div className="relative w-full max-w-md mx-auto lg:mx-0">
                    <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-secondary/30 blur-3xl absolute -inset-4"></div>
                    <Image
                        src="https://storage.googleapis.com/pancake-static/p/22564-5ca4f5eb03e591154d8038c41a040159c9e6a11e88853344d32232a0e5b7e736.jpg?v=1737239873877530"
                        width={600}
                        height={600}
                        alt="Dra. Fabiana Carvalhal"
                        data-ai-hint="professional woman psychologist smiling"
                        className="relative mx-auto aspect-square overflow-hidden rounded-full object-cover object-top"
                    />
                </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Nossas Especialidades</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                  Cuidado sob medida para você
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                 Atuação diversificada em contextos clínicos, hospitalares, escolares e organizacionais, com foco na sua necessidade.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {services.map((service, index) => (
                <Card key={index} className="bg-background hover:shadow-lg transition-shadow border-0 hover:-translate-y-2 duration-300">
                  <CardHeader className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-secondary rounded-full">
                        {service.icon}
                    </div>
                    <CardTitle className="font-headline">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6 lg:gap-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                Sobre Fabiana Carvalhal
              </h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
                <Quote className="absolute -top-4 -left-4 w-12 h-12 text-secondary" />
                <p className="text-lg text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Psicóloga e neuropsicóloga com sólida formação acadêmica (PUC-SP e USP), e coautora do livro “PNL Humanizada”. Minha paixão é integrar a excelência técnica com um profundo entendimento da individualidade de cada paciente.
                </p>
            </div>
            <div className="flex justify-center">
              <Button asChild variant="link" size="lg">
                <a href="https://www.instagram.com/fabiana_carvalhal/" target="_blank" rel="noopener noreferrer">
                  Siga no Instagram <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl">
                Inicie a sua jornada
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Pronto para explorar as possibilidades? Fale com minha assistente de IA para tirar dúvidas ou agendar sua primeira consulta.
              </p>
            </div>
             <div className="mx-auto w-full max-w-sm space-y-2">
                <ChatTriggerButton />
               <p className="text-xs text-muted-foreground">
                 Minha IA está disponível 24/7 para te ajudar.
               </p>
             </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Fabiana Carvalhal. Todos os direitos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Termos de Serviço
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacidade
          </Link>
        </nav>
      </footer>
      <ChatWidget />
    </div>
  );
}
