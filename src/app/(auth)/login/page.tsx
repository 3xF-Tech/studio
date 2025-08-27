
import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-muted/50 p-10 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center text-lg font-semibold"
        >
          <Icons.Logo className="h-6 w-6 mr-2" />
          Fabiana Carvalhal
        </Link>
        <Image
          src="https://picsum.photos/800/1200"
          alt="Imagem de consultório de psicologia"
          data-ai-hint="psychology abstract"
          width={800}
          height={1200}
          className="rounded-lg object-cover w-full h-full max-h-[90vh]"
        />
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Área do Cliente</h1>
            <p className="text-balance text-muted-foreground">
              Acesse seu painel para gerenciar suas consultas.
            </p>
          </div>
          <LoginForm />
          <p className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="#" className="underline">
              Contate o suporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
