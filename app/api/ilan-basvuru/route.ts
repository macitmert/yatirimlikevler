export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

function s(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function createTransport() {
  if (process.env.MAIL_USE_JSON === "true") {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    
    const payload: Record<string, string> = {
      firstName: s(form.get("firstName")),
      lastName: s(form.get("lastName")),
      phone: s(form.get("phone")),
      phoneCountryCode: s(form.get("phoneCountryCode")),
      ilanNo: s(form.get("ilanNo")),
      ilanNoAccepted: s(form.get("ilanNoAccepted")) ? "✔️" : "❌",
      source: "sahibinden-ilan-no",
      ts: new Date().toISOString(),
    };

    // Validation
    const missing = !payload.firstName || !payload.lastName || !payload.phone || 
                   !payload.ilanNo || payload.ilanNoAccepted !== "✔️";
    
    if (missing) {
      return NextResponse.json(
        { ok: false, error: "Eksik alanlar veya onay yok." },
        { status: 400 }
      );
    }

    // İlan numarası validation (10 haneli)
    if (payload.ilanNo.length !== 10 || !/^\d{10}$/.test(payload.ilanNo)) {
      return NextResponse.json(
        { ok: false, error: "İlan numarası 10 haneli olmalıdır." },
        { status: 400 }
      );
    }

    // Telefon numarası validation
    const fullPhone = payload.phoneCountryCode + payload.phone;
    if (fullPhone.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Telefon numarası eksik." },
        { status: 400 }
      );
    }

    const subject = `[Sahibinden İlan No: ${payload.ilanNo}] Yeni Hızlı Başvuru – ${payload.firstName} ${payload.lastName}`;
    
    const html = `
      <h2>🏠 Sahibinden İlan No ile Hızlı Başvuru</h2>
      <ul>
        <li><b>Ad Soyad:</b> ${payload.firstName} ${payload.lastName}</li>
        <li><b>Telefon:</b> ${fullPhone}</li>
        <li><b>Sahibinden İlan No:</b> ${payload.ilanNo}</li>
        <li><b>Onay:</b> ${payload.ilanNoAccepted}</li>
      </ul>
      
      <hr />
      <small>
        Kaynak: ${payload.source} • 
        Zaman: ${payload.ts}
      </small>
    `;

    console.log("=== SAHİBİNDEN İLAN NO BAŞVURU ===");
    console.log("Konu:", subject);
    console.log("HTML:", html);
    console.log("=================================");

    const transporter = createTransport();
    const to = process.env.LEADS_TO || process.env.GMAIL_USER!;

    await transporter.sendMail({
      from: `"Yatırımlık Evler" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Sahibinden ilan no başvuru maili başarıyla gönderildi!");
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Sahibinden ilan no başvuru hatası:", error);
    return NextResponse.json(
      { ok: false, error: "Başvuru gönderim hatası" },
      { status: 500 }
    );
  }
}
