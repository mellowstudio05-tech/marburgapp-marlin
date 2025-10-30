# AI Backend (Vercel + Next.js)

Minimaler Next.js API-Endpoint `/api/aiChat` mit OpenAI und Firestore (Firebase Admin).

## Setup mit Vercel

1. Repo zu Git pushen (GitHub/GitLab/Bitbucket).
2. In Vercel: New Project → Repo auswählen → Deploy.
3. In Project Settings → Environment Variables:
   - `OPENAI_API_KEY` = OpenAI API Key
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = Service Account JSON als eine Zeile
4. Endpoint: `https://<dein-projekt>.vercel.app/api/aiChat`.
5. In iOS `AIService.functionURLString` auf diese URL setzen.

## Lokal entwickeln

- Node 18+
- `npm install`
- `npm run dev`
- `.env.local` verwenden (nicht committen):
```
OPENAI_API_KEY=sk-...
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account", ...}
```

## Dateien

- `src/app/api/aiChat/route.ts` – API-Route (OpenAI-Aufruf + Firestore-Kontext)
- `src/lib/firebaseAdmin.ts` – Firebase Admin Initialisierung

Passe die Collections/Schema in `route.ts` an (z. B. `events`, `gastro`, `shopping`).
