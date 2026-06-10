import { NextResponse } from "next/server";

/**
 * "Write to Us" letter intake. A validated POST that fans the letter out to every
 * configured channel — Discord webhook, email (Resend), and WhatsApp Cloud API —
 * in parallel, never failing the whole request if one channel is down. All
 * channels are env-gated, so the form works the moment ANY of them is configured.
 *
 * Anti-abuse: length caps, email shape check, a honeypot field, and a best-effort
 * per-instance rate limit. Nothing sensitive is logged.
 */
export const runtime = "nodejs";

const MAX = { name: 80, email: 140, subject: 160, message: 4000 } as const;

function clean(s: unknown, max: number): string {
  return String(s ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** HTML-escape untrusted text before putting it in the email body. */
function esc(s: unknown): string {
  return String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}

// Best-effort in-memory limit (per serverless instance). A determined abuser can
// still get through across instances — fine for a contact form; the honeypot +
// validation do the heavy lifting.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return arr.length > 3; // 3 letters / minute / ip
}

interface Letter {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Discord — a clean embed in the configured channel. Returns true if delivered. */
async function toDiscord(l: Letter): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "Fethron Letters",
      embeds: [
        {
          author: { name: `New letter from ${l.name}` },
          title: l.subject,
          // Message in the description reads far better than a cramped field.
          description: l.message.slice(0, 4000),
          color: 0xef0606,
          fields: [
            { name: "From", value: l.name, inline: true },
            { name: "Email", value: l.email, inline: true },
          ],
          footer: { text: "Fethron Letters · reply via email above" },
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });
  return res.ok;
}

/** Email via Resend's REST API (no SDK dependency). Returns true if delivered. */
async function toEmail(l: Letter): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const to = process.env.LETTER_TO_EMAIL || "fethronai@gmail.com";
  const from = process.env.LETTER_FROM_EMAIL || "Fethron Letters <onboarding@resend.dev>";
  const replyHref = `mailto:${l.email}?subject=${encodeURIComponent(`Re: ${l.subject}`)}`;
  const html = `<div style="margin:0;padding:28px 16px;background:#f3eee3;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2a2320">
  <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e6ddcb;border-radius:16px;overflow:hidden">
    <div style="background:#c5302a;padding:18px 26px;color:#fff;font-size:15px;font-weight:700;letter-spacing:.04em">New letter to Fethron</div>
    <div style="padding:26px">
      <div style="font:600 11px/1 'Segoe UI',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#9b8f7c;margin-bottom:6px">Subject</div>
      <div style="font-size:19px;font-weight:600;margin-bottom:20px;color:#2a2320">${esc(l.subject)}</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:5px 0;color:#9b8f7c;font-size:13px;width:78px">From</td><td style="padding:5px 0;font-size:14px;font-weight:600">${esc(l.name)}</td></tr>
        <tr><td style="padding:5px 0;color:#9b8f7c;font-size:13px">Email</td><td style="padding:5px 0;font-size:14px"><a href="mailto:${esc(l.email)}" style="color:#c5302a;text-decoration:none">${esc(l.email)}</a></td></tr>
      </table>
      <div style="font:600 11px/1 'Segoe UI',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#9b8f7c;margin-bottom:8px">Message</div>
      <div style="font-size:15px;line-height:1.65;white-space:pre-wrap;background:#f7f2e7;border-left:3px solid #c5302a;border-radius:9px;padding:15px 17px;color:#2a2320">${esc(l.message)}</div>
      <a href="${esc(replyHref)}" style="display:inline-block;margin-top:22px;background:#c5302a;color:#fff;text-decoration:none;padding:11px 24px;border-radius:9px;font-weight:600;font-size:14px">Reply to ${esc(l.name)}</a>
    </div>
    <div style="padding:14px 26px;border-top:1px solid #efe7d6;font-size:11px;color:#b3a892;letter-spacing:.06em">FETHRON · fethron.com</div>
  </div>
</div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: l.email,
      subject: `New letter — ${l.subject}`,
      html,
      text: `From: ${l.name} <${l.email}>\n\n${l.message}`,
    }),
  });
  return res.ok;
}

/** WhatsApp Cloud API — a text notification to the owner number. Returns true if
 *  delivered. (Needs the business number reachable / a 24h session or template.) */
async function toWhatsApp(l: Letter): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const toNumber = process.env.WHATSAPP_TO;
  if (!token || !phoneId || !toNumber) return false;
  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toNumber,
      type: "text",
      text: { body: `📨 New Fethron letter\n\nFrom: ${l.name} (${l.email})\nRe: ${l.subject}\n\n${l.message.slice(0, 900)}` },
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "You're sending letters a bit fast — give it a minute." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields. Pretend success, deliver nothing.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  const letter: Letter = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    subject: clean(body.subject, MAX.subject) || "A letter to Fethron",
    message: clean(body.message, MAX.message),
  };

  if (!letter.name || !letter.email || !letter.message) {
    return NextResponse.json({ error: "Please fill in your name, email and message." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(letter.email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const results = await Promise.allSettled([toDiscord(letter), toEmail(letter), toWhatsApp(letter)]);
  const delivered = results.filter((r) => r.status === "fulfilled" && r.value === true).length;
  const configured = !!(process.env.DISCORD_WEBHOOK_URL || process.env.RESEND_API_KEY || process.env.WHATSAPP_TOKEN);

  // If channels ARE configured but every one failed, surface a soft error so the
  // user can retry. If NOTHING is configured (e.g. local dev), accept gracefully.
  if (configured && delivered === 0) {
    return NextResponse.json({ error: "We couldn't deliver your letter just now. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
