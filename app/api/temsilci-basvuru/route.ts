import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function bool(value: string | undefined): boolean {
  return value === 'true';
}

function createTransport() {
  // Test modu (JSON) – .env'de MAIL_USE_JSON="false" olduğundan devre dışı
  if (bool(process.env.MAIL_USE_JSON)) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  // İlçe Temsilcisi için özel email ayarları
  const host = process.env.TEMSILCI_MAIL_HOST || process.env.MAIL_HOST || "mail.privateemail.com";
  const port = Number(process.env.TEMSILCI_MAIL_PORT || process.env.MAIL_PORT || 465);
  const user = process.env.TEMSILCI_MAIL_USER;
  const pass = process.env.TEMSILCI_MAIL_PASS;

  if (!user || !pass) {
    throw new Error("TEMSILCI_MAIL_USER / TEMSILCI_MAIL_PASS eksik. Env değişkenlerini kontrol et.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true, // 465 kullanıyorsun: her zaman true
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Referans numarası oluştur
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const ilCode = payload.il.toUpperCase().replace(/[^A-Z]/g, '');
    const ilceCode = payload.ilce.toUpperCase().replace(/[^A-Z]/g, '');
    const referansNo = `YEV-${ilCode}-${ilceCode}-${dateStr}-${randomNum}`;

    const transporter = createTransport();
    
    // Konum formatını düzenle
    let locationText = "Konum belirtilmemiş";
    if (payload.il && payload.ilce) {
      if (payload.il.startsWith('istanbul-')) {
        const side = payload.il === 'istanbul-avrupa' ? 'Avrupa' : 'Anadolu';
        const district = payload.ilce.charAt(0).toUpperCase() + payload.ilce.slice(1);
        locationText = `İstanbul (${side}) - ${district}`;
      } else {
        const province = payload.il.charAt(0).toUpperCase() + payload.il.slice(1);
        const district = payload.ilce.charAt(0).toUpperCase() + payload.ilce.slice(1);
        locationText = `${province} - ${district}`;
      }
    } else if (payload.il) {
      if (payload.il.startsWith('istanbul-')) {
        const side = payload.il === 'istanbul-avrupa' ? 'Avrupa' : 'Anadolu';
        locationText = `İstanbul (${side})`;
      } else {
        locationText = payload.il.charAt(0).toUpperCase() + payload.il.slice(1);
      }
    }
    
    const subject = `[${locationText}] İlçe Temsilcisi Ön Başvurusu – ${payload.adSoyad} (${referansNo})`;

    const html = `
      <h2>🤝 İlçe Temsilcisi Ön Başvurusu</h2>
      <ul>
        <li><b>Referans No:</b> ${referansNo}</li>
        <li><b>Ad Soyad:</b> ${payload.adSoyad}</li>
        <li><b>Firma/Ofis:</b> ${payload.firma || 'Belirtilmemiş'}</li>
        <li><b>Telefon:</b> ${payload.telefon}</li>
        <li><b>E-posta:</b> ${payload.email}</li>
        <li><b>Konum:</b> ${locationText}</li>
        <li><b>Taşınmaz Ticareti Yetki Belgesi No:</b> ${payload.belgeNo}</li>
        <li><b>Not/Mesaj:</b> ${payload.not || 'Belirtilmemiş'}</li>
        <li><b>KVKK Onayı:</b> ${payload.kvkk ? 'Evet' : 'Hayır'}</li>
        <li><b>Pazarlama İzni:</b> ${payload.pazarlama ? 'Evet' : 'Hayır'}</li>
      </ul>
      <hr />
      <small>Kaynak: İlçe Temsilcisi Başvuru Formu • Zaman: ${payload.timestamp}</small>
    `;

    const text = `
İlçe Temsilcisi Ön Başvurusu

Referans No: ${referansNo}
Ad Soyad: ${payload.adSoyad}
Firma/Ofis: ${payload.firma || 'Belirtilmemiş'}
Telefon: ${payload.telefon}
E-posta: ${payload.email}
Konum: ${locationText}
Taşınmaz Ticareti Yetki Belgesi No: ${payload.belgeNo}
Not/Mesaj: ${payload.not || 'Belirtilmemiş'}
KVKK Onayı: ${payload.kvkk ? 'Evet' : 'Hayır'}
Pazarlama İzni: ${payload.pazarlama ? 'Evet' : 'Hayır'}

Kaynak: İlçe Temsilcisi Başvuru Formu
Zaman: ${payload.timestamp}
    `;

    const info = await transporter.sendMail({
      from: process.env.TEMSILCI_MAIL_USER,
      to: process.env.LEADS_TO || 'apply@yatirimlikevler.com',
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      message: 'Başvuru başarıyla gönderildi',
      referansNo: referansNo
    });

  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Başvuru gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
