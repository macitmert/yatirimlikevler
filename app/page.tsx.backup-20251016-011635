"use client";

import { useState } from "react";

export default function Home() {
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [ilanNo, setIlanNo] = useState("");
  const [ilanNoAccepted, setIlanNoAccepted] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+90");
  const [phoneNumber, setPhoneNumber] = useState("");

  const countryCodes = [
    { code: "+90", country: "Türkiye", maxLength: 10 },
    { code: "+1", country: "ABD/Kanada", maxLength: 10 },
    { code: "+44", country: "İngiltere", maxLength: 10 },
    { code: "+49", country: "Almanya", maxLength: 11 },
    { code: "+33", country: "Fransa", maxLength: 9 },
    { code: "+39", country: "İtalya", maxLength: 10 },
    { code: "+34", country: "İspanya", maxLength: 9 },
    { code: "+31", country: "Hollanda", maxLength: 9 },
    { code: "+41", country: "İsviçre", maxLength: 9 },
    { code: "+43", country: "Avusturya", maxLength: 10 },
    { code: "+45", country: "Danimarka", maxLength: 8 },
    { code: "+46", country: "İsveç", maxLength: 9 },
    { code: "+47", country: "Norveç", maxLength: 8 },
    { code: "+358", country: "Finlandiya", maxLength: 9 },
    { code: "+7", country: "Rusya", maxLength: 10 },
    { code: "+86", country: "Çin", maxLength: 11 },
    { code: "+81", country: "Japonya", maxLength: 10 },
    { code: "+82", country: "Güney Kore", maxLength: 10 },
    { code: "+91", country: "Hindistan", maxLength: 10 },
    { code: "+971", country: "BAE", maxLength: 9 },
    { code: "+966", country: "Suudi Arabistan", maxLength: 9 },
    { code: "+20", country: "Mısır", maxLength: 10 },
    { code: "+27", country: "Güney Afrika", maxLength: 9 },
    { code: "+55", country: "Brezilya", maxLength: 11 },
    { code: "+54", country: "Arjantin", maxLength: 10 },
    { code: "+52", country: "Meksika", maxLength: 10 },
    { code: "+61", country: "Avustralya", maxLength: 9 },
    { code: "+64", country: "Yeni Zelanda", maxLength: 9 }
  ];

  const toggleDetail = (id: string) => {
    setOpenDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleIlanNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Sadece rakam
    setIlanNo(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Tüm tireleri, boşlukları ve özel karakterleri kaldır
    value = value.replace(/[^\d]/g, '');
    
    // 90 ile başlıyorsa kaldır (Türkiye için)
    if (value.startsWith('90')) {
      value = value.substring(2);
    }
    
    // Maksimum uzunluğu kontrol et
    const maxLength = getCurrentCountryMaxLength();
    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    
    setPhoneNumber(value);
  };

  const getCurrentCountryMaxLength = () => {
    const country = countryCodes.find(c => c.code === phoneCountryCode);
    return country ? country.maxLength : 10;
  };

  const isIlanNoValid = ilanNo.length === 10;
  const isPhoneValid = phoneNumber.length === getCurrentCountryMaxLength();

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-zinc-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#C40001]/10 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-[#C40001] rounded-full flex items-center justify-center animate-fade-in overflow-hidden">
                <img src="/logo.png" alt="Yatırımlık Evler" className="w-8 h-8 object-contain" />
              </div>
              <h1 className="text-xl font-bold text-[#C40001] uppercase">YATIRIMLIK EVLER</h1>
            </div>
        </div>
      </header>

      {/* All Cards */}
      <section className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-4">
           {/* Evini Bizimle Hızlı Sat */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('satici')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.satici ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <span className="text-lg">Evini Bizimle Hızlı Sat</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.satici ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
             {openDetails.satici && (
               <div className="px-6 pb-6">
                 <div className="border-t border-[#C40001]/10 pt-4">
                   <p className="text-sm text-zinc-600 mb-4 text-justify">
                     Evinizin yatırım değerinin yüksek olduğuna inanıyorsanız başvurun. Eviniz kriterlerimize uygunsa şanslısınız çünkü geniş yatırımcı portföyümüz ve güçlü sosyal medya kanallarımız aracılığıyla evinizi hızlıca satıyoruz.
                   </p>
                   
                   {/* İki Seçenek */}
                   <div className="space-y-3">
                     {/* Sahibinden İlan No ile Başvuru */}
                     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                       <div className="flex items-center gap-3 mb-3">
                         <span className="text-lg">🔗</span>
                         <div>
                           <h4 className="font-medium text-sm text-zinc-800">Sahibinden İlan No ile Hızlı Başvuru</h4>
                           <p className="text-xs text-zinc-600">İlanınız zaten sahibinden.com'da varsa</p>
                         </div>
                       </div>
                       <div className="space-y-3">
                         <div className="grid grid-cols-2 gap-2">
                           <input
                             type="text"
                             name="firstName"
                             placeholder="Ad (zorunlu)"
                             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001]"
                           />
                           <input
                             type="text"
                             name="lastName"
                             placeholder="Soyad (zorunlu)"
                             className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001]"
                           />
                         </div>
                         <div className="flex gap-2">
                           <select
                             value={phoneCountryCode}
                             onChange={(e) => {
                               setPhoneCountryCode(e.target.value);
                               setPhoneNumber(''); // Alan kodu değişince telefon numarasını sıfırla
                             }}
                             className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white w-20"
                           >
                             {countryCodes.map((country) => (
                               <option key={country.code} value={country.code}>
                                 {country.code}
                               </option>
                             ))}
                           </select>
                           <input
                             type="text"
                             name="phone"
                             value={phoneNumber}
                             onChange={handlePhoneChange}
                             maxLength={getCurrentCountryMaxLength()}
                             placeholder="Telefon numarası"
                             className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                           />
                         </div>
                         {phoneNumber && !isPhoneValid && (
                           <p className="text-xs text-red-600">
                             ⚠️ {getCurrentCountryMaxLength()} haneli olmalıdır
                           </p>
                         )}
                         <div className="flex gap-2">
                           <input
                             type="text"
                             name="ilanNo"
                             placeholder="İlan no giriniz"
                             value={ilanNo}
                             onChange={handleIlanNoChange}
                             maxLength={10}
                             className="w-4/5 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001]"
                           />
                           <button 
                             disabled={!isIlanNoValid || !ilanNoAccepted}
                             className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                               isIlanNoValid && ilanNoAccepted 
                                 ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                             }`}
                           >
                             Başvur
                           </button>
                         </div>
                         <label className="text-xs text-zinc-600 inline-flex items-start gap-2 cursor-pointer">
                           <input 
                             type="checkbox" 
                             required 
                             className="mt-0.5" 
                             checked={ilanNoAccepted}
                             onChange={(e) => setIlanNoAccepted(e.target.checked)}
                           />
                           <span>Evimin satışı konusunda Yatırımlık Evler'e 3 ay süreyle tam yetki vermeyi ve bu süreçte evimin satılması durumunda %2+KDV'lik bir satış bedeli ödemeyi kabul ediyorum.</span>
                         </label>
                         {ilanNo && !isIlanNoValid && (
                           <p className="text-xs text-red-600">
                             ⚠️ İlan numarası 10 haneli olmalıdır
                           </p>
                         )}
                         {isIlanNoValid && !ilanNoAccepted && (
                           <p className="text-xs text-red-600">
                             ⚠️ Lütfen şartları kabul etmek için kutucuğu işaretleyin
                           </p>
                         )}
                       </div>
                     </div>

                     {/* WhatsApp ile Başvuru */}
                     <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                       <div className="flex items-center gap-3 mb-3">
                         <span className="text-lg">📝</span>
                         <div>
                           <h4 className="font-medium text-sm text-zinc-800">Henüz ilanınız yok mu?</h4>
                           <p className="text-xs text-zinc-600">Evinizin görsellerini ve detaylarını bize WhatsApp'tan iletin, 48 saat içinde inceleyelim.</p>
                         </div>
                       </div>
                       <a 
                         href="https://wa.me/905407208080?text=Merhaba,+evimin+detaylarını+paylaşmak+istiyorum"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block w-full bg-[#C40001] text-white rounded-xl p-3 text-center font-medium hover:bg-[#C40001]/90 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                       >
                         <span>📱</span>
                         WhatsApp'tan Gönder
                       </a>
                     </div>
                   </div>
                 </div>
               </div>
             )}
          </div>

          {/* Yatırımcı Gruplarına Katıl */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('groups')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.groups ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <span className="text-lg">Yatırımcı Gruplarına Katıl</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.groups ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.groups && (
              <div className="px-6 pb-6">
                <div className="border-t border-[#C40001]/10 pt-4">
                  <p className="text-sm text-zinc-600 mb-4 text-justify">
                    Telegram gruplarımıza tamamen ücretsiz katıl, yatırımlık ev fırsatlarını kaçırma! Şehrini seç ve hemen başla.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="#"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      İstanbul
        </a>
        <a
                      href="#"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
        >
                      Ankara
        </a>
        <a
                      href="#"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
        >
                      İzmir
        </a>
        <a
                      href="#"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Antalya
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Hakkımızda */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('hakkimizda')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.hakkimizda ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">ℹ️</span>
                <span className="text-lg">Hakkımızda</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.hakkimizda ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.hakkimizda && (
              <div className="px-6 pb-6">
                 <div className="border-t border-[#C40001]/10 pt-4">
                   <div className="text-sm text-zinc-600 mb-4 space-y-3">
                     <p>
                       Yatırımlık Evler, Türkiye'nin ilk premium konut platformudur.
                     </p>
                     <p>
                       Bizlere gelen binlerce başvuru arasından yalnızca yatırım değeri yüksek konutlar platformumuza kabul edilir.
                     </p>
                     <p>
                       Bu sayede yatırımcılarımıza her zaman en iyi yatırımlık ev fırsatları sunulmuş olur.
                     </p>
                   </div>
                 </div>
              </div>
            )}
          </div>

          {/* İletişim */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('iletisim')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.iletisim ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <span className="text-lg">İletişim</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.iletisim ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.iletisim && (
              <div className="px-6 pb-6">
                 <div className="border-t border-[#C40001]/10 pt-4">
                   <div className="space-y-3">
                     <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <span className="text-[#C40001]">📱</span>
                         <span className="text-sm text-zinc-600">Yatırımlık Evler Merkez: 0540 720 80 80</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-[#C40001]">📱</span>
                         <span className="text-sm text-zinc-600">Yatırımlık Evler İstanbul: 0540 720 80 34</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-[#C40001]">📱</span>
                         <span className="text-sm text-zinc-600">Yatırımlık Evler Ankara: 0540 720 80 06</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-[#C40001]">📱</span>
                         <span className="text-sm text-zinc-600">Yatırımlık Evler Denizli: 0540 720 80 20</span>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="text-[#C40001]">📧</span>
                       <span className="text-sm text-zinc-600">info@yatirimlikevler.com</span>
                     </div>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#C40001]/10 px-6 py-6">
        <div className="max-w-md mx-auto text-center">
          <p className="text-zinc-500 text-xs leading-relaxed">
            Yatırımlık Evler © 2025 — Türkiye'nin İlk Premium Konut Platformu
          </p>
      </div>
      </footer>
    </main>
  );
}
