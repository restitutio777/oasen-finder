/**
 * Mitkommen-Formular — Server-Endpoint
 *
 * Nimmt POST-Requests vom Astro-Formular (/mitkommen/) entgegen, validiert
 * Pflichtfelder und Mail-Format, filtert Bots via Honeypot, und sendet die
 * Anfrage per klassischem SMTP (Nodemailer) an Katharinas Postfach.
 *
 * Kein Drittanbieter-API (kein Resend o.ae.) — es wird ueber ein ganz normales
 * E-Mail-Postfach versendet (Standard: Infomaniak, Domain reise-zueinander.de).
 * Reply-To wird auf den Absender des Formulars gesetzt, sodass Katharina
 * direkt antworten kann.
 *
 * Solange die SMTP-Zugangsdaten nicht in der Vercel-Env gesetzt sind, laeuft die
 * Function im "Log-Modus": die Anfrage wird nur in die Function-Logs geschrieben
 * und dem User trotzdem Erfolg gemeldet. So bleibt das Formular sichtbar
 * funktionsfaehig, bevor SMTP live ist. ACHTUNG: im Log-Modus kommt KEINE Mail an.
 *
 * Erwartete Env-Variablen (Vercel → Project Settings → Environment Variables):
 *   SMTP_HOST   — SMTP-Server, Standard "mail.infomaniak.com"
 *   SMTP_PORT   — Port, Standard "465" (SSL). Alternativ "587" (STARTTLS).
 *   SMTP_USER   — Login / Absende-Postfach, z.B. "kontakt@reise-zueinander.de"
 *   SMTP_PASS   — Passwort des Postfachs  (NUR als Vercel-Secret setzen!)
 *   MITKOMMEN_TO   — Empfaenger (Katharina), Standard "katharina.offenborn@googlemail.com"
 *   MITKOMMEN_FROM — Absende-Adresse im From-Header. Muss identisch zu SMTP_USER
 *                    sein (Mailserver erlauben keinen Fremd-Absender). Standard: SMTP_USER.
 */

import nodemailer from 'nodemailer';

interface MitkommenBody {
  name?: string;
  email?: string;
  anliegen?: string | string[];
  message?: string;
  _hp?: string; // Honeypot — versteckt fuer Menschen, Bots fuellen es
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
  // Methode
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  const body = (req.body || {}) as MitkommenBody;
  const { name, email, anliegen, message, _hp } = body;

  // Honeypot — wenn ausgefuellt, ist's wahrscheinlich ein Bot.
  // Wir tun so, als waere alles gut, damit der Bot keinen Hinweis bekommt.
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

  const cleanName = name.trim();
  const cleanEmail = email.trim();

  const subject = `Mitkommen: Anfrage von ${cleanName}`;
  const text = [
    'Eine neue Anfrage über das Mitkommen-Formular auf werkstatt-gemeinschaft:',
    '',
    `Von:  ${cleanName} <${cleanEmail}>`,
    '',
    'Anliegen:',
    anliegenLines,
    '',
    'Nachricht:',
    message.trim(),
    '',
    '— Automatisch versendet von der WERKstatt-Gemeinschaft-Seite.',
    '   Einfach auf diese Mail antworten — die Antwort geht direkt an den Absender.',
  ].join('\n');

  const SMTP_HOST = process.env.SMTP_HOST || 'mail.infomaniak.com';
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const TO_EMAIL = process.env.MITKOMMEN_TO || 'katharina.offenborn@googlemail.com';
  const FROM_EMAIL = process.env.MITKOMMEN_FROM || SMTP_USER || '';

  // Log-Modus: keine SMTP-Zugangsdaten gesetzt → loggen und Erfolg melden.
  // In diesem Modus wird KEINE Mail zugestellt.
  if (!SMTP_USER || !SMTP_PASS) {
    console.log('[Mitkommen] SMTP nicht konfiguriert — Log-Modus, es wird KEINE Mail versendet.');
    console.log('[Mitkommen] To:', TO_EMAIL);
    console.log('[Mitkommen] Subject:', subject);
    console.log('[Mitkommen] Body:\n' + text);
    return res.status(200).json({ ok: true, mode: 'log-only' });
  }

  // Echter Versand via SMTP (Nodemailer)
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = implizites TLS, 587 = STARTTLS
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WERKstatt Gemeinschaft" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: `"${cleanName}" <${cleanEmail}>`,
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Mitkommen] SMTP-Versand fehlgeschlagen:', err);
    return res.status(502).json({ error: 'Mail konnte nicht versendet werden. Bitte später nochmal versuchen.' });
  }
}
