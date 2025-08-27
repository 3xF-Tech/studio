
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Publicações</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Livro: PNL Humanizada</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Participei como coautora do livro "PNL Humanizada", uma obra que explora a Programação Neurolinguística com foco no desenvolvimento humano e empatia.
            </p>
            <Button asChild variant="outline">
                <a href="https://www.amazon.com.br/Pnl-Humanizada-Programa%C3%A7%C3%A3o-Neurolingu%C3%ADstica-Desenvolvimento/dp/8565785089" target="_blank" rel="noopener noreferrer">
                    Ver na Amazon <ArrowRight className="w-4 h-4 ml-2" />
                </a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Instagram className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Conteúdo no Instagram</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground mb-4">
               Compartilho insights, dicas e reflexões sobre psicologia, neuropsicologia e bem-estar em meu perfil profissional no Instagram. Acompanhe para conteúdo diário.
            </p>
            <Button asChild variant="outline">
                <a href="https://www.instagram.com/fabiana_carvalhal/" target="_blank" rel="noopener noreferrer">
                    Seguir no Instagram <ArrowRight className="w-4 h-4 ml-2" />
                </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
