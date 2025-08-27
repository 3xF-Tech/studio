
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/firebase/auth"; // Corrected import to the .ts file
import { LoaderCircle } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/lib/firebase/auth.tsx"; // Import useAuth to get the auth instance

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { auth } = useAuth(); // Get the initialized auth instance from the context
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Erro de Inicialização",
        description: "O serviço de autenticação ainda não está pronto. Tente novamente em alguns segundos.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await login(auth, email, password); // Pass the auth instance to the login function
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: error.message || "Ocorreu um erro. Verifique suas credenciais.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="grid gap-4">
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
       <Button type="submit" className="w-full mt-2" disabled={isLoading || !auth}>
            {isLoading && <LoaderCircle className="animate-spin mr-2" />}
            Acessar Painel
        </Button>
    </form>
  );
}
