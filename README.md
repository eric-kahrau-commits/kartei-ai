# KarteiAI

Eine moderne, KI-gestützte Karteikarten-App – kostenlos, geräteübergreifend und ohne Abo.

## Features

- **Karteikarten erstellen** – Frage & Antwort mit Rich Text (fett, kursiv, unterstrichen), Bilder pro Seite, Diktat-Eingabe per Mikrofon
- **3D-Lernmodus** – Karten umdrehen mit Flip-Animation, Richtig/Falsch markieren, falsche Karten wiederholen, Ergebnisscreen
- **KI-Lernübersicht** – Strukturierte Zusammenfassung deiner Karteninhalte (GPT-4o-mini), Länge wählbar (Kurz/Mittel/Lang)
- **Dashboard** – Alle Lernsets auf einen Blick, Fortschrittsbalken, Statistiken
- **Authentifizierung** – Firebase Email/Passwort, Daten geräteübergreifend synchronisiert
- **Bildupload** – Cloudinary-Integration mit automatischer Komprimierung

## Tech Stack

| Technologie | Zweck |
|---|---|
| Next.js 16 (App Router) + TypeScript | Framework |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animationen |
| Firebase (Auth + Firestore) | Authentifizierung & Datenbank |
| Cloudinary | Bildspeicherung |
| OpenAI GPT-4o-mini | KI-Übersichten |

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Umgebungsvariablen

Erstelle eine `.env.local` Datei mit folgenden Werten:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI (nur server-seitig)
OPENAI_API_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

## Deployment

Das Projekt ist für [Vercel](https://vercel.com) optimiert. Umgebungsvariablen im Vercel-Dashboard unter **Settings → Environment Variables** eintragen.
