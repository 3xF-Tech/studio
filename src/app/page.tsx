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
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
           <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-headline font-bold">
            Fabiana Carvalhal
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
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
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
               <Image
                src="https://firebasestudio-hosting.web.app/images/i2.png"
                width="600"
                height="600"
                alt="Dra. Fabiana Carvalhal"
                data-ai-hint="professional woman psychologist smiling"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                   <p className="max-w-[600px] text-primary md:text-xl font-semibold">
                     Psicóloga Clínica & Neuropsicóloga
                  </p>
                  <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Cuidado e Desenvolvimento Humano
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
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                  Cuidado, sob medida para você
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                 Atuação diversificada em contextos clínicos, hospitalares, escolares e organizacionais, com foco na sua necessidade.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {services.map((service, index) => (
                <Card key={index} className="bg-background hover:shadow-lg transition-shadow border-0">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {service.icon}
                    <CardTitle className="font-headline">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6 lg:gap-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                Sobre Fabiana Carvalhal
              </h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
                <Quote className="absolute -top-4 -left-4 w-10 h-10 text-secondary" />
                <p className="text-lg text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Psicóloga e neuropsicóloga com sólida formação acadêmica (PUC-SP e USP), e coautora do livro “PNL Humanizada”. Minha paixão é integrar técnica e um profundo entendimento da individualidade de cada paciente.
                </p>
            </div>
            <div className="flex justify-center">
              <Button asChild variant="link">
                <a href="https://www.instagram.com/fabiana_carvalhal/" target="_blank" rel="noopener noreferrer">
                  Siga no Instagram <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t bg-secondary">
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
