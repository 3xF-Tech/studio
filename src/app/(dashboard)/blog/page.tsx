import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function BlogPage() {
  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Publicações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Serenamente PSC</CardTitle>
          <CardDescription>
            Artigos, vídeos e conteúdo sobre psicologia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg border">
            <iframe
              src="http://www.serenamentepsc.com.br/"
              className="h-full w-full rounded-lg"
              title="Publicações de Fabiana Carvalhal"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
