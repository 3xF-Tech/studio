"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle, BrainCircuit } from 'lucide-react';
import Image from "next/image";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const { login, loading, user, authReady } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  // Evita piscar UI antes de Auth estar pronto
  if (!authReady) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <LoaderCircle className="w-8 h-8 animate-spin" />
          </div>
      )
  };
  
  if (user) {
    router.replace("/dashboard");
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error?.code, error?.message);
      let friendlyMessage = "Falha no login. Verifique suas credenciais.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        friendlyMessage = "Email ou senha incorretos."
      } else if (error.code === 'auth/configuration-not-found') {
        friendlyMessage = "Erro de configuração. Verifique as configurações do Firebase."
      }
      setErr(friendlyMessage);
    }
  }
  
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
           <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                     <Link href="#" className="ml-auto inline-block text-sm underline">
                        Esqueceu sua senha?
                    </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
               <Button type="submit" className="w-full mt-2" disabled={loading}>
                    {loading && <LoaderCircle className="animate-spin mr-2" />}
                    Acessar Painel
                </Button>
                {err && <p className="text-sm text-center font-medium text-destructive mt-2">{err}</p>}
            </form>
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
