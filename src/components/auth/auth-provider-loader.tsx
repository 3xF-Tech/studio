
"use client";

import dynamic from 'next/dynamic';

// Carrega o AuthProvider dinamicamente apenas no lado do cliente.
// A opção { ssr: false } é a chave para garantir que o código do Firebase
// nunca seja executado no servidor, evitando o erro de variáveis de ambiente.
const AuthProvider = dynamic(
  () => import('@/context/AuthContext').then((mod) => mod.AuthProvider),
  {
    ssr: false,
    loading: () => <p>Carregando...</p>, // Placeholder para evitar piscar de UI e erros de hidratação.
  }
);

export default function AuthProviderLoader({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
