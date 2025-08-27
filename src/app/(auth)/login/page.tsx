import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
          &larr; Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
            <Icons.Logo className="h-10 w-10 text-primary mb-4" />
            <h1 className="text-3xl font-headline font-bold">Admin Access</h1>
            <p className="text-muted-foreground">Log in to manage your aesthetics clinic.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
