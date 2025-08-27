
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const articles = [
  {
    title: 'Do ‘SIM’ ao Divórcio: Onde o Amor se Perdeu?',
    description: 'Uma reflexão sobre as complexidades dos relacionamentos modernos e os caminhos que levam ao fim de uma união.',
    link: 'https://sinapsys.news/event-pro/do-sim-ao-divorcio-onde-o-amor-se-perdeu/',
    imageUrl: 'https://picsum.photos/400/250',
    aiHint: 'couple conflict',
  },
  {
    title: 'Amor e Perigo: A Escalada da Violência nos Relacionamentos',
    description: 'Analisando os sinais de alerta e a dinâmica da violência em relações afetivas, um tema urgente e necessário.',
    link: 'https://sinapsys.news/event-pro/amor-e-perigo-a-escalada-da-violencia-nos-relacionamentos/',
    imageUrl: 'https://picsum.photos/400/251',
    aiHint: 'sad woman',
  },
  {
    title: 'O Prazer Feminino e a Sociedade: Mitos, Verdades e Desafios',
    description: 'Explorando os mitos e verdades que cercam a sexualidade feminina e os desafios enfrentados na sociedade.',
    link: 'https://sinapsys.news/sem-categoria/o-prazer-feminino-e-a-sociedade-mitos-verdades-e-desafios/',
    imageUrl: 'https://picsum.photos/400/252',
    aiHint: 'woman portrait',
  },
   {
    title: 'Quando o Ciúme se Torna Patológico: Entenda a Síndrome de Otelo',
    description: 'Uma análise profunda sobre o ciúme patológico, suas causas, sintomas e os impactos devastadores nos relacionamentos.',
    link: 'https://sinapsys.news/event-pro/quando-o-ciume-se-torna-patologico-entenda-a-sindrome-de-otelo/',
    imageUrl: 'https://picsum.photos/400/253',
    aiHint: 'jealousy couple',
  },
];


export default function BlogPage() {
  return (
    <div className="py-4 space-y-4">
       <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold">Publicações Externas</h1>
            <p className="text-muted-foreground">Artigos da coluna "Casais no Divã" no portal Sinapsys News.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
               <div className="relative h-48 w-full mb-4">
                 <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="rounded-lg object-cover"
                    data-ai-hint={article.aiHint}
                 />
              </div>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">
                {article.description}
              </p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" className="w-full">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                        Leia mais no Sinapsys News <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
