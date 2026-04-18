import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { AiOverviewRequest } from '@/types/api';

const LENGTH_CONFIG = {
  kurz:   { maxTokens: 600,  instruction: 'Erstelle eine kurze Übersicht (ca. 150–250 Wörter).' },
  mittel: { maxTokens: 1200, instruction: 'Erstelle eine mittellange Übersicht (ca. 300–500 Wörter).' },
  lang:   { maxTokens: 2200, instruction: 'Erstelle eine ausführliche Übersicht (ca. 600–900 Wörter).' },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API Key nicht konfiguriert.' }, { status: 503 });
  }

  let body: AiOverviewRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { setTitle, cards, length = 'mittel' } = body;
  if (!cards?.length) {
    return NextResponse.json({ error: 'Keine Karten vorhanden.' }, { status: 400 });
  }

  const { maxTokens, instruction } = LENGTH_CONFIG[length] ?? LENGTH_CONFIG.mittel;

  const cardContent = cards
    .map((c, i) => `Karte ${i + 1}:\nFrage: ${c.front}\nAntwort: ${c.back}`)
    .join('\n\n');

  const prompt = `Du bist ein Lernassistent. Fasse AUSSCHLIESSLICH den Inhalt der folgenden Karteikarten zusammen.

WICHTIG: Füge KEINE zusätzlichen Informationen, Erklärungen, Beispiele oder Kontexte hinzu, die nicht explizit in den Karteikarten stehen. Verwende nur das, was in den Karten steht – nichts mehr.

Thema: "${setTitle}"

Karteikarten:
${cardContent}

${instruction}
Formatierung:
- Gliedere nach Themen (## für Hauptthemen, ### für Unterthemen)
- Schlüsselbegriffe **fett**
- Aufzählungspunkte für Fakten
- Schreibe auf Deutsch

Fasse NUR zusammen, was in den obigen Karteikarten steht.`;

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content ?? '';
    return NextResponse.json({ content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `KI-Fehler: ${msg}` }, { status: 500 });
  }
}
