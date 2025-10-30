import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }
    const { query, contextIds = [], uid } = await request.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const db = getDb();
    const contexts: string[] = [];

    // Example: try to read documents by id from multiple collections
    // Adjust to your real data model
    const collections = ['events', 'gastro', 'shopping'];
    for (const id of (contextIds as string[]).slice(0, 15)) {
      for (const col of collections) {
        const doc = await db.collection(col).doc(id).get();
        if (doc.exists) {
          const d = doc.data() as any;
          const title = d?.title || d?.name || '';
          const description = d?.description || d?.Beschreibung || '';
          contexts.push(`${title} — ${description}`.trim());
          break;
        }
      }
    }

    const system = 'Du bist ein hilfreicher Assistent für die Marburg App.';
    const user = `Frage: ${query}\nKontext (ggf. leer):\n${contexts.join('\n')}`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    const answer = resp.choices?.[0]?.message?.content?.trim() || 'Keine Antwort.';
    return NextResponse.json({ answer, usedContext: contexts.length, uid: uid || null });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Fehler' }, { status: 500 });
  }
}


