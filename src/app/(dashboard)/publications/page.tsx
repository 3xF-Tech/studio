import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PublicationsPage() {
  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-headline font-bold">Publicações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Artigos no Portal Sinapsys</CardTitle>
          <CardDescription>
            Visualização da coluna "Casais no Divã" e outros artigos publicados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg border">
            <iframe
              src="https://sinapsys.news/categoria/colunas/casais-no-diva/"
              className="h-full w-full rounded-lg"
              title="Publicações de Fabiana Carvalhal"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
