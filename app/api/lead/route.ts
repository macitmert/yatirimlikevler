export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

function s(v: unknown) { return typeof v === "string" ? v.trim() : ""; }

function createTransport() {
  if (process.env.MAIL_USE_JSON === "true") {
    // Dev/test için SMTP gerekmeden terminale yaz
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });
}

// Lead skoru hesaplama
function calculateLeadScore(payload: any): number {
  let score = 0;
  
  // Bütçe (0-45)
  const budgetMax = parseInt(payload.budget_max) || 0;
  const budgetMin = parseInt(payload.budget_min) || 0;
  const avgBudget = budgetMin > 0 ? (budgetMin + budgetMax) / 2 : budgetMax;
  
  if (avgBudget < 1000000) score += 5;
  else if (avgBudget < 2000000) score += 10;
  else if (avgBudget < 3000000) score += 20;
  else if (avgBudget < 5000000) score += 25;
  else if (avgBudget < 8000000) score += 30;
  else if (avgBudget < 15000000) score += 35;
  else if (avgBudget < 20000000) score += 40;
  else score += 45;
  
  // Zamanlama (0-25)
  if (payload.timeline === "Hemen") score += 25;
  else if (payload.timeline === "1-3 Ay") score += 15;
  else if (payload.timeline === "3+ Ay") score += 5;
  
  // Ödeme (0-20)
  if (payload.payment === "Peşin") score += 20;
  else if (payload.payment === "Ağırlıklı Peşin") score += 15;
  else if (payload.payment === "Düşük Peşin Kalanı Kredi") score += 10;
  else if (payload.payment === "Tam Kredi") score += 5;
  
  // Bölge (0-15)
  if (payload.city === "İstanbul" && payload.istanbul_side) score += 15;
  else if (["Ankara", "İzmir", "Samsun", "Trabzon"].includes(payload.city)) score += 10;
  else if (payload.city) score += 5;
  
  // Sözleşme niyeti (0-10)
  if (payload.consent === "true" || payload.consent === true) score += 10;
  
  return score;
}

// Mail konusu oluşturma
function generateSubject(payload: any, score: number): string {
  const isSeller = payload.formType === "satici";
  const name = `${payload.ad || payload.firstName || ""} ${payload.soyad || payload.lastName || ""}`.trim();
  
  if (isSeller) {
    return `[S-${score}][${payload.city}] Yeni Satıcı – ${name}`;
  } else {
    // Alıcı için detaylı konu
    const city = payload.city || "";
    const side = payload.istanbul_side ? `/${payload.istanbul_side}` : "";
    const districts = payload.districts ? `/${payload.districts.slice(0, 2).join("+")}` : "";
    const budget = payload.budget_max ? `/${Math.round(parseInt(payload.budget_max) / 1000000)}M` : "";
    
    return `[A-${score}][${city}${side}${districts}][${budget}] Yeni Alıcı – ${name}`;
  }
}

export async function POST(req: NextRequest) {
  const form = await req.formData();

  // Honeypot kontrolü
  if (form.get("website")) {
    return NextResponse.json({ ok: false, error: "Spam detected" }, { status: 400 });
  }

  const payload: Record<string, any> = {
    formType: s(form.get("formType")) || "alici",
    ad: s(form.get("ad")),
    soyad: s(form.get("soyad")),
    firstName: s(form.get("firstName")), // Eski format uyumluluğu
    lastName: s(form.get("lastName")), // Eski format uyumluluğu
    telefon: s(form.get("telefon")),
    phone: s(form.get("phone")), // Eski format uyumluluğu
    email: s(form.get("email")),
    city: s(form.get("city")),
    istanbul_side: s(form.get("istanbul_side")),
    districts: form.get("districts") ? JSON.parse(s(form.get("districts"))) : [],
    budget_min: s(form.get("budget_min")),
    budget_max: s(form.get("budget_max")),
    property_type: s(form.get("property_type")),
    property_types: form.get("property_types") ? JSON.parse(s(form.get("property_types"))) : [],
    property_type_custom: s(form.get("property_type_custom")),
    room_types: form.get("room_types") ? JSON.parse(s(form.get("room_types"))) : [],
    room_type_custom: s(form.get("room_type_custom")),
    usage_purpose: s(form.get("usage_purpose")),
    priority: s(form.get("priority")),
    timeline: s(form.get("timeline")),
    payment: s(form.get("payment")),
    note: s(form.get("note")),
    consent: s(form.get("consent")),
    criteria: s(form.get("criteria")), // Eski format uyumluluğu
    district: s(form.get("district")), // Eski format uyumluluğu
    address: s(form.get("address")), // Eski format uyumluluğu
    size: s(form.get("size")), // Eski format uyumluluğu
    rooms: s(form.get("rooms")), // Eski format uyumluluğu
    asking: s(form.get("asking")), // Eski format uyumluluğu
    notes: s(form.get("notes")), // Eski format uyumluluğu
    contractOk: s(form.get("contractOk")), // Eski format uyumluluğu
    utm_source: s(form.get("utm_source")),
    utm_medium: s(form.get("utm_medium")),
    utm_campaign: s(form.get("utm_campaign")),
    userAgent: s(form.get("userAgent")),
    source: s(form.get("source")) || "website",
    ts: new Date().toISOString(),
  };

  // Zorunlu alan kontrolü
  const name = payload.ad || payload.firstName;
  const surname = payload.soyad || payload.lastName;
  const phone = payload.telefon || payload.phone;
  const consent = payload.consent === "true" || payload.consent === true || payload.contractOk === "✔️";
  
  const baseMissing = !name || !surname || !phone || !payload.city || !consent;
  if (baseMissing) {
    return NextResponse.json({ ok: false, error: "Eksik alanlar veya onay yok." }, { status: 400 });
  }

  // Lead skoru hesapla
  const leadScore = calculateLeadScore(payload);
  
  const isSeller = payload.formType === "satici";
  const subject = generateSubject(payload, leadScore);

  // HTML içerik oluşturma
  let html = "";
  
  if (isSeller) {
    html = `
      <h2>Yeni Talep (Satıcı) - Skor: ${leadScore}</h2>
      <ul>
        <li><b>Ad Soyad:</b> ${name} ${surname}</li>
        <li><b>Telefon:</b> ${phone}</li>
        <li><b>E-posta:</b> ${payload.email || "-"}</li>
        <li><b>Şehir/Semt:</b> ${payload.city}${payload.district ? " - " + payload.district : ""}</li>
        <li><b>Adres:</b> ${payload.address || "-"}</li>
        <li><b>m² / Oda:</b> ${payload.size || "-"} / ${payload.rooms || "-"}</li>
        <li><b>İstenen Bedel:</b> ${payload.asking || "-"}</li>
        <li><b>Notlar:</b> ${payload.notes || "-"}</li>
      </ul>
    `;
  } else {
    html = `
      <h2>Yeni Talep (Alıcı) - Skor: ${leadScore}</h2>
      <ul>
        <li><b>Ad Soyad:</b> ${name} ${surname}</li>
        <li><b>Telefon:</b> ${phone}</li>
        <li><b>E-posta:</b> ${payload.email || "-"}</li>
        <li><b>Şehir:</b> ${payload.city}</li>
        ${payload.istanbul_side ? `<li><b>İstanbul Yakası:</b> ${payload.istanbul_side}</li>` : ""}
        ${payload.districts && payload.districts.length > 0 ? `<li><b>İlçeler:</b> ${payload.districts.join(", ")}</li>` : ""}
        <li><b>Bütçe:</b> ${payload.budget_min ? payload.budget_min + " - " : ""}${payload.budget_max || "-"} TL</li>
           <li><b>Konut Tipi:</b> ${payload.property_types && payload.property_types.length > 0 ? payload.property_types.join(", ") : (payload.property_type || "-")}${payload.property_type_custom ? " (" + payload.property_type_custom + ")" : ""}</li>
        <li><b>Oda Tipleri:</b> ${payload.room_types && payload.room_types.length > 0 ? payload.room_types.join(", ") : "-"}${payload.room_type_custom ? " (" + payload.room_type_custom + ")" : ""}</li>
        <li><b>Yatırım Amacı:</b> ${payload.usage_purpose || "-"}</li>
        <li><b>Öncelik:</b> ${payload.priority || "-"}</li>
        <li><b>Zamanlama:</b> ${payload.timeline || "-"}</li>
        <li><b>Ödeme:</b> ${payload.payment || "-"}</li>
        <li><b>Notlar:</b> ${payload.note || "-"}</li>
        <li><b>Kriterler:</b> ${payload.criteria || "-"}</li>
      </ul>
    `;
  }

  html += `
    <hr />
    <small>
      Kaynak: ${payload.source} • 
      UTM: ${payload.utm_source || "-"}/${payload.utm_medium || "-"}/${payload.utm_campaign || "-"} • 
      Zaman: ${payload.ts}
    </small>
  `;

  try {
    console.log("Gmail ayarları:", {
      user: process.env.GMAIL_USER ? "Tanımlı" : "Tanımsız",
      pass: process.env.GMAIL_PASS ? "Tanımlı" : "Tanımsız",
      to: process.env.LEADS_TO || process.env.GMAIL_USER
    });
    
    // Geçici olarak console'a yazdır
    console.log("=== MAIL İÇERİĞİ ===");
    console.log("Konu:", subject);
    console.log("Alıcı:", process.env.LEADS_TO || process.env.GMAIL_USER);
    console.log("HTML:", html);
    console.log("==================");
    
    const transporter = createTransport();
    const to = process.env.LEADS_TO || process.env.GMAIL_USER!;
    
    console.log("Mail gönderiliyor:", { from: process.env.GMAIL_USER, to, subject });
    
    // SMTP bağlantısını test et
    await transporter.verify();
    console.log("SMTP bağlantısı başarılı!");
    
    const result = await transporter.sendMail({ 
      from: `"Yatırımlık Evler" <${process.env.GMAIL_USER}>`, 
      to, 
      subject, 
      html 
    });

    console.log("Mail gönderim sonucu:", result);
    console.log("Mail başarıyla gönderildi!");
    return NextResponse.json({ ok: true, score: leadScore });
  } catch (error) {
    console.error("Mail gönderim hatası:", error);
    console.error("Hata detayı:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ ok: false, error: "Mail gönderim hatası" }, { status: 500 });
  }
}