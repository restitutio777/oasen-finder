/**
 * Mitkommen-Formular — Server-Endpoint
 *
 * Nimmt POST-Requests vom Astro-Formular (/mitkommen/) entgegen, validiert
 * Pflichtfelder und Mail-Format, filtert Bots via Honeypot, und sendet die
 * Anfrage als Mail via Resend an Katharina.
 *
 * Solange RESEND_API_KEY nicht in der Vercel-Env gesetzt ist, läuft die
 * Function im "Log-Modus": Anfrage wird nur in die Function-Logs geschrieben,
 * dem User wird trotzdem ein Erfolg gemeldet. So kann das Formular sichtbar
 * funktionieren, bevor Resend live ist.
 *
 * Erwartete Env-Variablen (in Vercel-Project-Settings → Environment Variables):
 *   RESEND_API_KEY    — der Resend-API-Key, z.B. "re_xxx..."
 *   MITKOMMEN_TO      — Empfänger-Mail (Katharina), z.B. "kontakt@werkstatt-gemeinschaft.de"
 *   MITKOMMEN_FROM    — verifizierter Absender, z.B. "mitkommen@werkstatt-gemeinschaft.de"
 *                       Fallback: "onboarding@resend.dev" (Resend-Sandbox, geht ohne Domain-Verify)
 */

interface MitkommenBody {
  name?: string;
  email?: string;
  anliegen?: string | string[];
  message?: string;
  _hp?: string; // Honeypot — versteckt für Menschen, Bots füllen es
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

interface VercelRequest {
  method?: string;
  body?: MitkommenBody;
  headers: Record<string, string | string[] | undefined>;
}

const ANLIEGEN_LABELS: Record<string, string> = {
  werkstatt: 'Werkstatt-Teilnahme',
  einladung: 'Einladung in unsere Gemeinschaft',
  vortrag: 'Vortrag oder Impuls',
  beratung: 'Beratung beim Aufbau einer Gemeinschaft',
  gespraech: 'Persönliches Gespräch',
  vernetzung: 'Bei der Vernetzung helfen',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS / Methode
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  const body = (req.body || {}) as MitkommenBody;
  const { name, email, anliegen, message, _hp } = body;

  // Honeypot — wenn ausgefüllt, ist's wahrscheinlich ein Bot.
  // Wir tun so, als wäre alles gut, damit der Bot keinen Hinweis bekommt.
  if (_hp && _hp.trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Bitte deinen Namen angeben.' });
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Die Mail-Adresse sieht seltsam aus.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ error: 'Bitte eine kurze Nachricht hinterlassen.' });
  }
  if (name.length > 200 || message.length > 8000) {
    return res.status(400).json({ error: 'Eingabe zu lang.' });
  }

  const anliegenList = Array.isArray(anliegen)
    ? anliegen
    : typeof anliegen === 'string' && anliegen.length > 0
    ? [anliegen]
    : [];

  const anliegenLines = anliegenList.length
    ? anliegenList.map((a) => `  • ${ANLIEGEN_LABELS[a] || a}`).join('\n')
    : '  (keine Auswahl)';

  const subject = `Mitkommen: Anfrage von ${name.trim()}`;
  const text = [
    'Eine neue Anfrage über das Mitkommen-Formular auf werkstatt-gemeinschaft:',
    '',
    `Von:  ${name.trim()} <${email.trim()}>`,
    '',
    'Anliegen:',
    anliegenLines,
    '',
    'Nachricht:',
    message.trim(),
    '',
    '— Automatisch versendet von der WERKstatt-Gemeinschaft-Seite.',
    '   Antworten direkt an den Absender (Reply-To ist gesetzt).',
  ].join('\n');

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TO_EMAIL = process.env.MITKOMMEN_TO || 'kontakt@werkstatt-gemeinschaft.example';
  const FROM_EMAIL = process.env.MITKOMMEN_FROM || 'onboarding@resend.dev';

  // Log-Modus: kein API-Key gesetzt → loggen und Erfolg melden
  if (!RESEND_API_KEY) {
    console.log('[Mitkommen] RESEND_API_KEY nicht gesetzt — Log-Modus.');
    console.log('[Mitkommen] To:', TO_EMAIL);
    console.log('[Mitkommen] From:', FROM_EMAIL);
    console.log('[Mitkommen] Subject:', subject);
    console.log('[Mitkommen] Body:\n' + text);
    return res.status(200).json({
      ok: true,
      mode: 'log-only',
    });
  }

  // Echter Versand via Resend
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email.trim(),
        subject,
        text,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[Resend] Fehler:', resp.status, errText);
      return res.status(502).json({ error: 'Mail konnte nicht versendet werden.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Mitkommen] Send failed:', err);
    return res.status(500).json({ error: 'Server-Fehler — bitte später nochmal versuchen.' });
  }
}
