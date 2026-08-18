# Roccola

App condivisa per calendario, lista della spesa e to-do list, ad uso privato di due
persone. Next.js su Vercel, dati su Firebase (Auth + Firestore).

## Sviluppo locale

```bash
npm install
npm run dev
```

Le variabili d'ambiente Firebase sono in `.env.local` (non versionato). Riferimento in
`.env.example`.

## Primo accesso

Non c'è registrazione self-service. I due account si creano a mano nella
[Firebase Console](https://console.firebase.google.com/project/roccola-app/authentication/users) →
Authentication → Users → "Add user" (email + password).

## Deploy regole Firestore

```bash
firebase deploy --only firestore
```

## Deploy su Vercel

```bash
vercel        # preview
vercel --prod # produzione
```

Le stesse variabili di `.env.local` vanno impostate anche su Vercel
(Project Settings → Environment Variables), oppure con:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
```

## Aggiungere una nuova sezione (tab)

Vedi `AGENTS.md` — spiega come aggiungere una pagina e farla comparire nella barra di
navigazione in alto.
