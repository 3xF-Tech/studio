
// Carrega apenas no cliente; evita SSR tocar em window.
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getFirebase() {
  if (typeof window === "undefined") {
    // Em SSR nunca inicialize Firebase
    return { app: null, auth: null, db: null };
  }

  if (!app) {
    const config = {
      apiKey: requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
      authDomain: requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
      projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
      storageBucket: requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
      appId: requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    };

    // Log para depuração em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log("Firebase Config Loaded:", {
        apiKey: config.apiKey?.slice(0,6)+"…",
        authDomain: config.authDomain,
        projectId: config.projectId,
      });
    }

    app = getApps().length ? getApp() : initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);

    // Persistência padrão no navegador
    setPersistence(auth, browserLocalPersistence).catch(() => {
      /* ignora, ex.: contextos sem Storage */
    });
  }

  return { app, auth, db };
}
