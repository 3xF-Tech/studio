import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Fabiana Carvalhal - Psicologia & Neuropsicologia',
  description: 'Psicóloga Clínica e Neuropsicóloga. Especialista em Psicodrama e PNL Sistêmica.',
};

const fontHeadline = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={cn("font-body antialiased min-h-screen", fontHeadline.variable, fontBody.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
