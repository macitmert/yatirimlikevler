export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

function s(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function bool(v: string | undefined, def = false) {
  return (v ?? "").toLowerCase() === "true" ? true : def;
}

function createTransport() {
  // Test modu (JSON) – .env’de MAIL_USE_JSON="false" olduğundan devre dışı
  if (bool(process.env.MAIL_USE_JSON)) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  // Zorunlu env kontrolleri
  const host = process.env.MAIL_HOST || "mail.privateemail.com";
  const port = Number(process.env.MAIL_PORT || 465);
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    throw new Error("MAIL_USER / MAIL_PASS eksik. Env değişkenlerini kontrol et.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true, // 465 kullanıyorsun: her zaman true
    auth: { user, pass },
  });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const payload: Record<string, string> = {
      firstName: s(form.get("firstName")),
      lastName: s(form.get("lastName")),
      phone: s(form.get("phone")),
      phoneCountryCode: s(form.get("phoneCountryCode")), // "+90" gibi
      ilanNo: s(form.get("ilanNo")),
      ilanNoAccepted: s(form.get("ilanNoAccepted")) ? "✔️" : "❌",
      province: s(form.get("province")),
      district: s(form.get("district")),
      source: "sahibinden-ilan-no",
      ts: new Date().toISOString(),
    };

    // Validation
    const missing =
      !payload.firstName ||
      !payload.lastName ||
      !payload.phone ||
      !payload.ilanNo ||
      payload.ilanNoAccepted !== "✔️";

    if (missing) {
      return NextResponse.json(
        { ok: false, error: "Eksik alanlar veya onay yok." },
        { status: 400 }
      );
    }

    // İlan no = 10 hane
    if (!/^\d{10}$/.test(payload.ilanNo)) {
      return NextResponse.json(
        { ok: false, error: "İlan numarası 10 haneli olmalıdır." },
        { status: 400 }
      );
    }

    // Telefon (ülke kodu + numara) temel kontrol
    const fullPhone = `${payload.phoneCountryCode}${payload.phone}`.replace(/\s+/g, "");
    if (fullPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { ok: false, error: "Telefon numarası eksik." },
        { status: 400 }
      );
    }

    // Konum formatını düzenle
    let locationText = "Konum belirtilmemiş";
    if (payload.province && payload.district) {
      if (payload.province.startsWith('istanbul-')) {
        const side = payload.province === 'istanbul-avrupa' ? 'Avrupa' : 'Anadolu';
        const district = payload.district.charAt(0).toUpperCase() + payload.district.slice(1);
        locationText = `İstanbul (${side}) - ${district}`;
      } else {
        const province = payload.province.charAt(0).toUpperCase() + payload.province.slice(1);
        const district = payload.district.charAt(0).toUpperCase() + payload.district.slice(1);
        locationText = `${province} - ${district}`;
      }
    } else if (payload.province) {
      if (payload.province.startsWith('istanbul-')) {
        const side = payload.province === 'istanbul-avrupa' ? 'Avrupa' : 'Anadolu';
        locationText = `İstanbul (${side})`;
      } else {
        locationText = payload.province.charAt(0).toUpperCase() + payload.province.slice(1);
      }
    }
    
    const subject = `[${locationText}] Sahibinden İlan No: ${payload.ilanNo} – ${payload.firstName} ${payload.lastName}`;

    const html = `
      <h2>🏠 Sahibinden İlan No ile Hızlı Başvuru</h2>
      <ul>
        <li><b>Ad Soyad:</b> ${payload.firstName} ${payload.lastName}</li>
        <li><b>Telefon:</b> ${fullPhone}</li>
        <li><b>Konum:</b> ${locationText}</li>
        <li><b>Sahibinden İlan No:</b> <a href="https://www.sahibinden.com/ilan/${payload.ilanNo}" target="_blank">${payload.ilanNo}</a></li>
        <li><b>Onay:</b> ${payload.ilanNoAccepted}</li>
      </ul>
      <hr />
      <small>Kaynak: ${payload.source} • Zaman: ${payload.ts}</small>
    `;

    const transporter = createTransport();
    const to = process.env.LEADS_TO || "portfolio@yatirimlikevler.com";

    const info = await transporter.sendMail({
      from: `"Yatırımlık Evler" <${process.env.MAIL_USER}>`, // domaininle uyumlu (DKIM/SPF için iyi)
      to,
      subject,
      html,
      text: `Ad Soyad: ${payload.firstName} ${payload.lastName}
Telefon: ${fullPhone}
Sahibinden İlan No: ${payload.ilanNo}
Onay: ${payload.ilanNoAccepted}
Kaynak: ${payload.source}
Zaman: ${payload.ts}`,
    });

    console.log("Mail gönderildi. MessageID:", info.messageId);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Başvuru gönderim hatası:", error?.message || error);
    return NextResponse.json(
      { ok: false, error: "Başvuru gönderim hatası" },
      { status: 500 }
    );
  }
}
