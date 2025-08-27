import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BrainCircuit,
  ChevronRight,
  Quote,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import ChatWidget from '@/components/chat-widget';

export default function Home() {
  const assessmentObjectives = [
      "Estabelecer se há presença ou não de algum transtorno cognitivo ou alterações comportamentais;",
      "Avaliar o nível de funcionamento cognitivo atual;",
      "Auxiliar no diagnóstico diferencial a fim de evidenciar informações sobre o funcionamento cognitivo e comportamental;",
      "Acompanhar a evolução do quadro em relação a tratamentos cirúrgicos, medicamentos ou de reabilitação cognitiva;",
      "Colaborar com o planejamento do tratamento multidisciplinar.",
  ];

  const testimonials = [
    {
        quote: "A Dra. Fabiana foi fundamental no meu processo de autoconhecimento. Sua abordagem humana e técnica fez toda a diferença.",
        author: "J.S., Paciente de Terapia"
    },
    {
        quote: "A avaliação neuropsicológica do meu filho foi um divisor de águas. Finalmente entendemos suas dificuldades e como ajudá-lo.",
        author: "M.P., Mãe de Paciente"
    },
     {
        quote: "O profissionalismo e a empatia da Fabiana são admiráveis. Me senti acolhida e compreendida desde a primeira consulta.",
        author: "A.L., Paciente de Psicodrama"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-20 flex items-center bg-background/90 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
           <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="ml-3 text-xl font-headline font-bold">
            Fabiana Carvalhal
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-6 sm:gap-8 font-body">
          <Link
            href="#services"
            className="text-base font-medium hover:underline underline-offset-4 hidden sm:block"
            prefetch={false}
          >
            Serviços
          </Link>
          <Link
            href="#about"
            className="text-base font-medium hover:underline underline-offset-4 hidden sm:block"
            prefetch={false}
          >
            Sobre
          </Link>
           <Link
            href="/blog"
            className="text-base font-medium hover:underline underline-offset-4 hidden sm:block"
            prefetch={false}
          >
            Blog
          </Link>
          <Button asChild>
            <Link href="/login">Área do Cliente</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                 <div className="space-y-4">
                   <p className="text-primary font-semibold tracking-wide uppercase font-body">
                        Psicóloga Clínica | Neuropsicóloga USP
                   </p>
                  <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Cuidado e Expertise para sua Saúde Mental
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body">
                    Com 24 anos de experiência, integro neuropsicologia, psicodrama e PNL para oferecer um atendimento completo e humanizado.
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
                <div className="flex items-center justify-center">
                    <Image
                        src="https://storage.googleapis.com/pancake-static/p/22564-5ca4f5eb03e591154d8038c41a040159c9e6a11e88853344d32232a0e5b7e736.jpg?v=1737239873877530"
                        width={450}
                        height={550}
                        alt="Dra. Fabiana Carvalhal"
                        data-ai-hint="professional woman psychologist smiling"
                        className="rounded-lg object-cover w-full h-auto max-w-sm"
                    />
                </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm font-semibold text-primary font-body">Nossa Especialidade Principal</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">
                  Avaliação Neuropsicológica
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                  Um processo que investiga o funcionamento cognitivo, emocional e comportamental de crianças, adolescentes, adultos e idosos, orientando no diagnóstico e laudo de TDAH, TEA (Autismo), Dificuldades no Aprendizado, TOD, Demência Senil, Depressão, Transtornos de Ansiedade, Transtornos de Humor e Impulsividade (Bipolar e Borderline), entre tantos outros.
                </p>
              </div>
            </div>
             <div className="mx-auto grid max-w-5xl gap-8 mt-12">
                <Card className="bg-background/50 border-2">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Principais Objetivos da Avaliação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 font-body">
                        {assessmentObjectives.map((objective, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <p className="text-muted-foreground">{objective}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
          </div>
        </section>
        
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6 lg:gap-12">
            <div className="space-y-4">
               <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary font-body">Sobre Mim</div>
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                Fabiana Carvalhal
              </h2>
                 <p className="max-w-xl mx-auto text-muted-foreground font-body">Psicóloga Clínica | Neuropsicóloga USP | Psicodramatista PUC | Trainer PNL</p>
            </div>
            <div className="relative max-w-3xl mx-auto">
                <Quote className="absolute -top-6 -left-6 w-12 h-12 text-secondary/50 hidden md:block" />
                 <Card>
                    <CardContent className="p-8 text-lg text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                      Atuando como psicóloga clínica há 24 anos, sou formada em neuropsicologia pela Universidade de São Paulo (USP). Minha formação é complementada por especializações em Psicodrama e Programação Neurolinguística (PNL SISTÊMICA), que integro em meus atendimentos. Sou coautora do livro “PNL Humanizada” e minha paixão é integrar a excelência técnica com um profundo entendimento da individualidade de cada paciente.
                    </CardContent>
                </Card>
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

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">O que os Pacientes Dizem</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed font-body">Depoimentos de quem já trilhou essa jornada conosco.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col bg-background/50">
                            <CardContent className="pt-6 flex flex-col flex-grow font-body">
                                <Quote className="w-8 h-8 text-primary mb-4" />
                                <p className="text-muted-foreground mb-4 flex-grow">{testimonial.quote}</p>
                                <p className="font-semibold mt-auto">{testimonial.author}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl">
                Inicie a sua jornada
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                Pronto para explorar as possibilidades? Fale com minha assistente de IA para tirar dúvidas ou agende sua primeira consulta. Você também pode me contatar diretamente pelo WhatsApp.
              </p>
            </div>
             <div className="mx-auto w-full max-w-sm space-y-2">
                 <Button variant="outline" size="lg" className="w-full" asChild>
                    <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Conversar no WhatsApp
                    </a>
                 </Button>
               <p className="text-xs text-muted-foreground font-body">
                 Clique no ícone no canto da tela para falar com a assistente de IA 24/7.
               </p>
             </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-body">
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
