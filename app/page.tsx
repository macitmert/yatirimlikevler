"use client";

import { useState } from "react";

export default function Home() {
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [ilanNo, setIlanNo] = useState("");
  const [ilanNoAccepted, setIlanNoAccepted] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+90");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [whatsappAccepted, setWhatsappAccepted] = useState(false);
  const [selectedInterestCity, setSelectedInterestCity] = useState("");
  const [interestAccepted, setInterestAccepted] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [kvkkOfisYoneticisi, setKvkkOfisYoneticisi] = useState(false);
  const [kvkkYoneticiYardimcisi, setKvkkYoneticiYardimcisi] = useState(false);
  const [kvkkGayrimenkulDanismani, setKvkkGayrimenkulDanismani] = useState(false);

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

  const getWhatsAppMessage = (city: string) => {
    const messages = {
      "istanbul-avrupa": "Merhaba, İstanbul Avrupa yakasındaki evimin detaylarını paylaşmak istiyorum",
      "istanbul-anadolu": "Merhaba, İstanbul Anadolu yakasındaki evimin detaylarını paylaşmak istiyorum",
      "ankara": "Merhaba, Ankara'daki evimin detaylarını paylaşmak istiyorum",
      "izmir": "Merhaba, İzmir'deki evimin detaylarını paylaşmak istiyorum",
      "antalya": "Merhaba, Antalya'daki evimin detaylarını paylaşmak istiyorum",
      "bursa": "Merhaba, Bursa'daki evimin detaylarını paylaşmak istiyorum",
      "konya": "Merhaba, Konya'daki evimin detaylarını paylaşmak istiyorum",
      "muğla": "Merhaba, Muğla'daki evimin detaylarını paylaşmak istiyorum",
      "denizli": "Merhaba, Denizli'deki evimin detaylarını paylaşmak istiyorum",
      "gaziantep": "Merhaba, Gaziantep'teki evimin detaylarını paylaşmak istiyorum",
      "kocaeli": "Merhaba, Kocaeli'deki evimin detaylarını paylaşmak istiyorum",
      "edirne": "Merhaba, Edirne'deki evimin detaylarını paylaşmak istiyorum",
      "adana": "Merhaba, Adana'daki evimin detaylarını paylaşmak istiyorum",
      "kayseri": "Merhaba, Kayseri'deki evimin detaylarını paylaşmak istiyorum",
      "eskişehir": "Merhaba, Eskişehir'deki evimin detaylarını paylaşmak istiyorum",
      "mersin": "Merhaba, Mersin'deki evimin detaylarını paylaşmak istiyorum",
      "çanakkale": "Merhaba, Çanakkale'deki evimin detaylarını paylaşmak istiyorum",
      "trabzon": "Merhaba, Trabzon'daki evimin detaylarını paylaşmak istiyorum",
      "kırıkkale": "Merhaba, Kırıkkale'deki evimin detaylarını paylaşmak istiyorum",
      "samsun": "Merhaba, Samsun'daki evimin detaylarını paylaşmak istiyorum",
      "erzurum": "Merhaba, Erzurum'daki evimin detaylarını paylaşmak istiyorum",
      "manisa": "Merhaba, Manisa'daki evimin detaylarını paylaşmak istiyorum",
      "tekirdağ": "Merhaba, Tekirdağ'daki evimin detaylarını paylaşmak istiyorum",
      "sakarya": "Merhaba, Sakarya'daki evimin detaylarını paylaşmak istiyorum",
      "aydın": "Merhaba, Aydın'daki evimin detaylarını paylaşmak istiyorum",
      "bolu": "Merhaba, Bolu'daki evimin detaylarını paylaşmak istiyorum",
      "balıkesir": "Merhaba, Balıkesir'deki evimin detaylarını paylaşmak istiyorum",
      "kütahya": "Merhaba, Kütahya'daki evimin detaylarını paylaşmak istiyorum",
      "isparta": "Merhaba, Isparta'daki evimin detaylarını paylaşmak istiyorum",
      "diyarbakır": "Merhaba, Diyarbakır'daki evimin detaylarını paylaşmak istiyorum"
    };
    return messages[city as keyof typeof messages] || "Merhaba, evimin detaylarını paylaşmak istiyorum";
  };

  const getInterestMessage = (city: string) => {
    const messages = {
      "istanbul-avrupa": "Merhaba, İstanbul Avrupa yakasındaki bir ilanınızla ilgileniyorum",
      "istanbul-anadolu": "Merhaba, İstanbul Anadolu yakasındaki bir ilanınızla ilgileniyorum",
      "ankara": "Merhaba, Ankara'daki bir ilanınızla ilgileniyorum",
      "izmir": "Merhaba, İzmir'deki bir ilanınızla ilgileniyorum",
      "antalya": "Merhaba, Antalya'daki bir ilanınızla ilgileniyorum",
      "bursa": "Merhaba, Bursa'daki bir ilanınızla ilgileniyorum",
      "konya": "Merhaba, Konya'daki bir ilanınızla ilgileniyorum",
      "muğla": "Merhaba, Muğla'daki bir ilanınızla ilgileniyorum",
      "denizli": "Merhaba, Denizli'deki bir ilanınızla ilgileniyorum",
      "gaziantep": "Merhaba, Gaziantep'teki bir ilanınızla ilgileniyorum",
      "kocaeli": "Merhaba, Kocaeli'deki bir ilanınızla ilgileniyorum",
      "edirne": "Merhaba, Edirne'deki bir ilanınızla ilgileniyorum",
      "adana": "Merhaba, Adana'daki bir ilanınızla ilgileniyorum",
      "kayseri": "Merhaba, Kayseri'deki bir ilanınızla ilgileniyorum",
      "eskişehir": "Merhaba, Eskişehir'deki bir ilanınızla ilgileniyorum",
      "mersin": "Merhaba, Mersin'deki bir ilanınızla ilgileniyorum",
      "çanakkale": "Merhaba, Çanakkale'deki bir ilanınızla ilgileniyorum",
      "trabzon": "Merhaba, Trabzon'daki bir ilanınızla ilgileniyorum",
      "kırıkkale": "Merhaba, Kırıkkale'deki bir ilanınızla ilgileniyorum",
      "samsun": "Merhaba, Samsun'daki bir ilanınızla ilgileniyorum",
      "erzurum": "Merhaba, Erzurum'daki bir ilanınızla ilgileniyorum",
      "manisa": "Merhaba, Manisa'daki bir ilanınızla ilgileniyorum",
      "tekirdağ": "Merhaba, Tekirdağ'daki bir ilanınızla ilgileniyorum",
      "sakarya": "Merhaba, Sakarya'daki bir ilanınızla ilgileniyorum",
      "aydın": "Merhaba, Aydın'daki bir ilanınızla ilgileniyorum",
      "bolu": "Merhaba, Bolu'daki bir ilanınızla ilgileniyorum",
      "balıkesir": "Merhaba, Balıkesir'deki bir ilanınızla ilgileniyorum",
      "kütahya": "Merhaba, Kütahya'daki bir ilanınızla ilgileniyorum",
      "isparta": "Merhaba, Isparta'daki bir ilanınızla ilgileniyorum",
      "diyarbakır": "Merhaba, Diyarbakır'daki bir ilanınızla ilgileniyorum"
    };
    return messages[city as keyof typeof messages] || "Merhaba, ilanlarınızdan biriyle ilgileniyorum";
  };

  const getCareerMessage = (position: string) => {
    const messages = {
      "ofis-yoneticisi": "Merhabalar, Ofis yöneticisi pozisyonuna başvurmak istiyorum. CV'im ektedir. Saygılarımla.",
      "ofis-yoneticisi-yardimcisi": "Merhabalar, Yönetici yardımcısı pozisyonuna başvurmak istiyorum. CV'im ektedir. Saygılarımla.",
      "gayrimenkul-danismani": "Merhabalar, Gayrimenkul danışmanı pozisyonuna başvurmak istiyorum. CV'im ektedir. Saygılarımla."
    };
    return messages[position as keyof typeof messages] || "";
  };

  const getDistricts = (province: string) => {
    const districts = {
      "istanbul-avrupa": [
        "Şişli", "Beşiktaş", "Bakırköy", "Başakşehir", "Beyoğlu", "Beylikdüzü", "Esenyurt",
        "Bahçelievler", "Zeytinburnu", "Bağcılar", "Bayrampaşa", "Kağıthane", "Küçükçekmece",
        "Güngören", "Büyükçekmece", "Eyüpsultan", "Avcılar", "Gaziosmanpaşa", "Esenler", "Silivri"
      ],
      "istanbul-anadolu": [
        "Kadıköy", "Ataşehir", "Ümraniye", "Sarıyer", "Tuzla", "Maltepe", "Pendik",
        "Kartal", "Adalar", "Çekmeköy", "Sancaktepe"
      ],
      "ankara": [
        "Çankaya", "Yenimahalle", "Altındağ", "Etimesgut", "Gölbaşı", "Kahramankazan", "Keçiören"
      ],
      "izmir": [
        "Konak", "Bornova", "Balçova", "Karşıyaka", "Çiğli", "Gaziemir", "Çeşme",
        "Güzelbahçe", "Narlıdere", "Urla", "Bayraklı", "Buca"
      ],
      "antalya": [
        "Muratpaşa", "Konyaaltı", "Alanya", "Marmaris", "Manavgat", "Kemer", "Kepez", "Döşemealtı"
      ],
      "bursa": [
        "Nilüfer", "Osmangazi"
      ],
      "konya": [
        "Selçuklu", "Karatay"
      ],
      "muğla": [
        "Bodrum", "Menteşe", "Fethiye"
      ],
      "denizli": [
        "Merkezefendi", "Pamukkale"
      ],
      "gaziantep": [
        "Şehitkamil"
      ],
      "kocaeli": [
        "Gebze", "İzmit", "Başiskele"
      ],
      "edirne": [
        "Merkez"
      ],
      "adana": [
        "Seyhan", "Çukurova"
      ],
      "kayseri": [
        "Melikgazi", "Kocasinan"
      ],
      "eskişehir": [
        "Odunpazarı", "Tepebaşı"
      ],
      "mersin": [
        "Yenişehir"
      ],
      "çanakkale": [
        "Merkez", "Bozcaada"
      ],
      "diyarbakır": [
        "Kayapınar"
      ],
      "trabzon": [
        "Ortahisar"
      ],
      "kırıkkale": [
        "Yahşihan"
      ],
      "samsun": [
        "Atakum", "İlkadım"
      ],
      "erzurum": [
        "Yakutiye"
      ],
      "manisa": [
        "Yunusemre"
      ],
      "tekirdağ": [
        "Çorlu", "Süleymanpaşa"
      ],
      "sakarya": [
        "Serdivan", "Adapazarı"
      ],
      "aydın": [
        "Efeler", "Kuşadası"
      ],
      "bolu": [
        "Merkez"
      ],
      "balıkesir": [
        "Altıeylül"
      ],
      "kütahya": [
        "Merkez"
      ],
      "isparta": [
        "Merkez"
      ]
    };
    return districts[province as keyof typeof districts] || [];
  };

  const handleIlanBasvuru = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("firstName", (e.target as any).firstName.value);
      formData.append("lastName", (e.target as any).lastName.value);
      formData.append("phone", phoneNumber);
      formData.append("phoneCountryCode", phoneCountryCode);
      formData.append("ilanNo", ilanNo);
      formData.append("ilanNoAccepted", ilanNoAccepted ? "true" : "false");
      formData.append("province", selectedProvince);
      formData.append("district", selectedDistrict);

      const response = await fetch("/api/ilan-basvuru", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        // Form'u temizle
        setIlanNo("");
        setIlanNoAccepted(false);
        setPhoneNumber("");
        setSelectedProvince("");
        setSelectedDistrict("");
        (e.target as any).firstName.value = "";
        (e.target as any).lastName.value = "";
      } else {
        const data = await response.json();
        setError(data.error || "Başvuru gönderim hatası");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-zinc-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#C40001]/10 sticky top-0 z-50">
        <div className="max-w-md md:max-w-2xl lg:max-w-2xl mx-auto px-6 py-4">
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
        <div className="max-w-md md:max-w-2xl lg:max-w-2xl mx-auto space-y-4">
           {/* Evini Bizimle Hızlı Sat */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('satici')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.satici ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <span className="text-lg">Evimi Satmak İstiyorum</span>
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
                       <form onSubmit={handleIlanBasvuru} className="space-y-3">
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
                         
                         {/* İl Seçimi */}
                         <div>
                         <label className="block text-xs font-medium text-zinc-700 mb-1">
                           Evinizin bulunduğu şehri seçiniz (zorunlu) <span className="text-red-500">*</span>
                         </label>
                         <p className="text-xs text-zinc-500 mb-2">
                           Maalesef listemizde yer almayan il ve ilçelerden başvuru kabul edemiyoruz. Anlayışınız için teşekkür ederiz.
                         </p>
                           <select
                             value={selectedProvince}
                             onChange={(e) => {
                               setSelectedProvince(e.target.value);
                               setSelectedDistrict(""); // İl değişince ilçeyi sıfırla
                             }}
                             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                             required
                           >
                             <option value="">Şehir seçiniz</option>
                             <option value="istanbul-avrupa">İstanbul (Avrupa)</option>
                             <option value="istanbul-anadolu">İstanbul (Anadolu)</option>
                             <option value="ankara">Ankara</option>
                             <option value="izmir">İzmir</option>
                             <option value="antalya">Antalya</option>
                             <option value="bursa">Bursa</option>
                             <option value="konya">Konya</option>
                             <option value="muğla">Muğla</option>
                             <option value="denizli">Denizli</option>
                             <option value="gaziantep">Gaziantep</option>
                             <option value="kocaeli">Kocaeli</option>
                             <option value="edirne">Edirne</option>
                             <option value="adana">Adana</option>
                             <option value="kayseri">Kayseri</option>
                             <option value="eskişehir">Eskişehir</option>
                             <option value="mersin">Mersin</option>
                             <option value="çanakkale">Çanakkale</option>
                             <option value="trabzon">Trabzon</option>
                             <option value="kırıkkale">Kırıkkale</option>
                             <option value="samsun">Samsun</option>
                             <option value="erzurum">Erzurum</option>
                             <option value="manisa">Manisa</option>
                             <option value="tekirdağ">Tekirdağ</option>
                             <option value="sakarya">Sakarya</option>
                             <option value="aydın">Aydın</option>
                             <option value="bolu">Bolu</option>
                             <option value="balıkesir">Balıkesir</option>
                             <option value="kütahya">Kütahya</option>
                             <option value="isparta">Isparta</option>
                             <option value="diyarbakır">Diyarbakır</option>
                           </select>
                         </div>
                         
                         {/* İlçe Seçimi */}
                         {selectedProvince && selectedProvince !== "diger" && (
                           <div>
                             <label className="block text-xs font-medium text-zinc-700 mb-1">
                               İlçe seçiniz (zorunlu) <span className="text-red-500">*</span>
                             </label>
                             <select
                               value={selectedDistrict}
                               onChange={(e) => setSelectedDistrict(e.target.value)}
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                               required
                             >
                               <option value="">İlçe seçiniz</option>
                               {getDistricts(selectedProvince).map((district) => (
                                 <option key={district} value={district}>
                                   {district}
                                 </option>
                               ))}
                             </select>
                           </div>
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
                             type="submit"
                             disabled={!isIlanNoValid || !ilanNoAccepted || sending}
                             className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                               isIlanNoValid && ilanNoAccepted && !sending
                                 ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                             }`}
                           >
                             {sending ? "Gönderiliyor..." : "Başvur"}
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
                         
                         {/* Success/Error Messages */}
                         {success && (
                           <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                             <p className="text-sm text-green-800">
                               ✅ Başvurunuz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                             </p>
                           </div>
                         )}
                         {error && (
                           <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                             <p className="text-sm text-red-800">
                               ❌ {error}
                             </p>
                           </div>
                         )}
                       </form>
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
                       
                       {/* Şehir Seçimi */}
                       <div className="mb-3">
                         <label className="block text-xs font-medium text-zinc-700 mb-2">
                           Evinizin bulunduğu şehri seçiniz (zorunlu) <span className="text-red-500">*</span>
                         </label>
                         <p className="text-xs text-zinc-500 mb-2">
                           Maalesef listemizde yer almayan il ve ilçelerden başvuru kabul edemiyoruz. Anlayışınız için teşekkür ederiz.
                         </p>
                         <select
                           value={selectedCity}
                           onChange={(e) => setSelectedCity(e.target.value)}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                           required
                         >
                           <option value="">Şehir seçiniz</option>
                           <option value="istanbul-avrupa">İstanbul (Avrupa)</option>
                           <option value="istanbul-anadolu">İstanbul (Anadolu)</option>
                           <option value="ankara">Ankara</option>
                           <option value="izmir">İzmir</option>
                           <option value="antalya">Antalya</option>
                           <option value="bursa">Bursa</option>
                           <option value="konya">Konya</option>
                           <option value="muğla">Muğla</option>
                           <option value="denizli">Denizli</option>
                           <option value="gaziantep">Gaziantep</option>
                           <option value="kocaeli">Kocaeli</option>
                           <option value="edirne">Edirne</option>
                           <option value="adana">Adana</option>
                           <option value="kayseri">Kayseri</option>
                           <option value="eskişehir">Eskişehir</option>
                           <option value="mersin">Mersin</option>
                           <option value="çanakkale">Çanakkale</option>
                           <option value="trabzon">Trabzon</option>
                           <option value="kırıkkale">Kırıkkale</option>
                           <option value="samsun">Samsun</option>
                           <option value="erzurum">Erzurum</option>
                           <option value="manisa">Manisa</option>
                           <option value="tekirdağ">Tekirdağ</option>
                           <option value="sakarya">Sakarya</option>
                           <option value="aydın">Aydın</option>
                           <option value="bolu">Bolu</option>
                           <option value="balıkesir">Balıkesir</option>
                           <option value="kütahya">Kütahya</option>
                           <option value="isparta">Isparta</option>
                           <option value="diyarbakır">Diyarbakır</option>
                         </select>
                       </div>
                       
                       {/* Onay Kutucuğu */}
                       <div className="mb-3">
                         <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                           <input
                             type="checkbox"
                             checked={whatsappAccepted}
                             onChange={(e) => setWhatsappAccepted(e.target.checked)}
                             className="mt-0.5"
                           />
                           <span>Evimin satışı konusunda Yatırımlık Evler'e 3 ay süreyle tam yetki vermeyi ve bu süreçte evimin satılması durumunda %2+KDV'lik bir satış bedeli ödemeyi kabul ediyorum.</span>
                         </label>
                       </div>
                       
                       <a 
                         href={selectedCity && whatsappAccepted ? `https://wa.me/905407208080?text=${encodeURIComponent(getWhatsAppMessage(selectedCity))}` : "#"}
                         target="_blank"
                         rel="noopener noreferrer"
                         className={`block w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                           selectedCity && whatsappAccepted
                             ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                             : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         }`}
                         onClick={!(selectedCity && whatsappAccepted) ? (e) => e.preventDefault() : undefined}
                       >
                         <span>📱</span>
                         WhatsApp'tan Gönder
                       </a>
                       
                       {!selectedCity && (
                         <p className="text-xs text-red-600 mt-2">
                           ⚠️ Lütfen önce şehir seçimi yapın
                         </p>
                       )}
                       {selectedCity && !whatsappAccepted && (
                         <p className="text-xs text-red-600 mt-2">
                           ⚠️ Lütfen şartları kabul etmek için kutucuğu işaretleyin
                         </p>
                       )}
                     </div>
                   </div>
                   
                   {/* Sık Sorulan Sorular */}
                   <div className="mt-6">
                     <h4 className="font-medium text-sm text-zinc-800 mb-4">Sık Sorulan Sorular</h4>
                     <div className="space-y-3">
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           1. Evimi neden Yatırımlık Evler'e göndermeliyim?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Yatırımlık Evler yalnızca yatırım değeri yüksek konutları kabul eder. Kabul edilen evler genellikle haftalar içinde satılır. Süreç tamamen ücretsizdir — sadece satış olursa %2 + KDV hizmet bedeli alınır.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           2. Her ev portföye kabul ediliyor mu?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Hayır. Sadece yatırım değeri yüksek konutlar kabul edilir. Bu sayede yatırımcılarımız yalnızca gerçek fırsatları görür.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           3. Süreç nasıl işliyor?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Evinizi bize buradan iletin. Ekibimiz 48 saat içinde yatırım analizini yapar. Uygunsa 3 ay süreli tam yetki sözleşmesi yapılır. Eviniz profesyonel içeriklerle pazarlanır. Satış gerçekleşirse %2 + KDV alınır.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           4. Neden tam yetkili satış yapıyorsunuz?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Tek elden yönetilen ilanlar daha hızlı ve güvenilir satılır. Farklı fiyatlarla birden fazla yerde olması güveni azaltır. Bu yüzden satış süresi boyunca ilan sadece bizde olur.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           5. Başka ilanlarım varsa ne olacak?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Bizimle çalışırsanız, diğer ilanlarınızı geçici olarak yayından kaldırmanız gerekir. Satılmazsa 3 ay sonunda yetki kendiliğinden biter, ücret ödemezsiniz.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           6. Süreç gerçekten ücretsiz mi?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Evet. Değerlendirme ve pazarlama tamamen ücretsizdir. Sadece satış olursa %2 + KDV alınır.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           7. Satış ne kadar sürüyor?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Kabul edilen evler genellikle 1–4 hafta içinde satılır. Bazı ilanlar aynı gün bile yatırımcı bulabilir.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           8. Evin yatırım değeri nasıl belirleniyor?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Yapay zekâ destekli analiz sistemiyle yatırım potansiyeli hesaplanır. Kira getirisi, amortisman ve bölgesel değer artışı gibi veriler değerlendirilir. Son karar alanında uzman ekibimiz tarafından verilir.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           9. Satış süreci güvenli mi?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Evet. Tüm işlemler alanında uzman hukuk ekibimiz tarafından yürütülür. Siz sadece tapu gününde hazır bulunursunuz.
                         </div>
                       </details>
                       
                       <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                         <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                           10. Yatırımlık Evler kimdir?
                         </summary>
                         <div className="px-3 pb-3 text-sm text-zinc-600">
                           Yatırımlık Evler, Türkiye'nin ilk premium konut platformudur. Alanında uzman hukukçular, mühendisler ve yatırım danışmanlarından oluşan bir ekiple çalışır. Amacımız, yatırım değeri yüksek evleri doğru alıcılarla buluşturmaktır.
                         </div>
                       </details>
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
                <span className="text-lg">Yatırımlık Ev Arıyorum</span>
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
                      href="https://t.me/istanbul_yatirimlikevler"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      📍 İstanbul
        </a>
        <a
                      href="https://t.me/ankara_yatirimlikevler"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
        >
                      📍 Ankara
        </a>
        <a
                      href="https://t.me/izmir_yatirimlikevler"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
        >
                      📍 İzmir
        </a>
        <a
                      href="https://t.me/antalya_yatirimlikevler"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-[#E7E9EC] text-zinc-700 rounded-xl p-4 text-center font-medium hover:bg-gray-50 hover:border-[#C40001] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      📍 Antalya
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bir İlanınızla İlgileniyorum */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('interest')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.interest ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <span className="text-lg">Bir İlanınızla İlgileniyorum</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.interest ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.interest && (
              <div className="px-6 pb-6">
                <div className="border-t border-[#C40001]/10 pt-4">
                  <p className="text-sm text-zinc-600 mb-4">
                    Lütfen ilgilendiğiniz ilanın hangi şehirde olduğunu seçiniz.
                  </p>
                  
                  {/* Şehir Seçimi */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-zinc-700 mb-2">
                      İlanın bulunduğu şehir (zorunlu) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-zinc-500 mb-2">
                      Maalesef listemizde yer almayan il ve ilçelerden başvuru kabul edemiyoruz. Anlayışınız için teşekkür ederiz.
                    </p>
                    <select
                      value={selectedInterestCity}
                      onChange={(e) => setSelectedInterestCity(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                      required
                    >
                      <option value="">Şehir seçiniz</option>
                      <option value="istanbul-avrupa">İstanbul (Avrupa)</option>
                      <option value="istanbul-anadolu">İstanbul (Anadolu)</option>
                      <option value="ankara">Ankara</option>
                      <option value="izmir">İzmir</option>
                      <option value="antalya">Antalya</option>
                      <option value="bursa">Bursa</option>
                      <option value="konya">Konya</option>
                      <option value="muğla">Muğla</option>
                      <option value="denizli">Denizli</option>
                      <option value="gaziantep">Gaziantep</option>
                      <option value="kocaeli">Kocaeli</option>
                      <option value="edirne">Edirne</option>
                      <option value="adana">Adana</option>
                      <option value="kayseri">Kayseri</option>
                      <option value="eskişehir">Eskişehir</option>
                      <option value="mersin">Mersin</option>
                      <option value="çanakkale">Çanakkale</option>
                      <option value="trabzon">Trabzon</option>
                      <option value="kırıkkale">Kırıkkale</option>
                      <option value="samsun">Samsun</option>
                      <option value="erzurum">Erzurum</option>
                      <option value="manisa">Manisa</option>
                      <option value="tekirdağ">Tekirdağ</option>
                      <option value="sakarya">Sakarya</option>
                      <option value="aydın">Aydın</option>
                      <option value="bolu">Bolu</option>
                      <option value="balıkesir">Balıkesir</option>
                      <option value="kütahya">Kütahya</option>
                      <option value="isparta">Isparta</option>
                      <option value="diyarbakır">Diyarbakır</option>
                    </select>
                  </div>
                  
                  {/* Onay Kutucuğu */}
                  <div className="mb-3">
                    <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interestAccepted}
                        onChange={(e) => setInterestAccepted(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span>İlandaki evi Yatırımlık Evler güvencesiyle satın almam halinde %2+KDV tutarındaki hizmet bedelini ödemeyi kabul ediyorum.</span>
                    </label>
                  </div>
                  
                  <a 
                    href={selectedInterestCity && interestAccepted ? `https://wa.me/905407208080?text=${encodeURIComponent(getInterestMessage(selectedInterestCity))}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                      selectedInterestCity && interestAccepted
                        ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={!(selectedInterestCity && interestAccepted) ? (e) => e.preventDefault() : undefined}
                  >
                    <span>📱</span>
                    İlanla İlgili Bilgi Al
                  </a>
                  
                  {!selectedInterestCity && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Lütfen önce şehir seçimi yapın
                    </p>
                  )}
                  {selectedInterestCity && !interestAccepted && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Lütfen şartları kabul etmek için kutucuğu işaretleyin
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Kariyer */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('kariyer')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.kariyer ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">💼</span>
                <span className="text-lg">Kariyer</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.kariyer ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.kariyer && (
              <div className="px-6 pb-6">
                <div className="border-t border-[#C40001]/10 pt-4">
                  <div className="text-sm text-zinc-600 mb-6 space-y-3">
                    <p>
                      Türkiye'nin ilk premium konut platformunda, gayrimenkul danışmanı veya ofis yöneticisi olarak yer almak ister misin?
                    </p>
                    <p>
                      Eğer neyi hedeflediğimizi anlıyor, vizyonumuzu paylaşıyor ve satış konusunda kendine güveniyorsan, özgeçmişini bizimle paylaş. Kazanırken büyüyen bir ailenin parçası ol.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Ofis Yöneticisi */}
                    <div className="bg-white border border-[#E7E9EC] rounded-xl p-4">
                      <div className="font-bold text-sm mb-1">1) Ofis yöneticisi pozisyonuna başvur</div>
                      <div className="text-xs text-zinc-500 mb-3">Yalnızca gayrimenkul sektöründe 15 yıl ve üzeri deneyime sahip kişiler değerlendirmeye alınacaktır.</div>
                      
                      {/* KVKK Onay Kutucuğu */}
                      <div className="mb-3">
                        <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={kvkkOfisYoneticisi}
                            onChange={(e) => setKvkkOfisYoneticisi(e.target.checked)}
                            className="mt-0.5"
                          />
                          <span>Kişisel verilerimin saklanmasına ilişkin KVKK ile uyumlu olarak işlenmesini kabul ediyorum.</span>
                        </label>
                        {!kvkkOfisYoneticisi && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Lütfen KVKK onayını verin
                          </p>
                        )}
                      </div>
                      
                      <a 
                        href={kvkkOfisYoneticisi ? `mailto:apply@yatirimlikevler.com?subject=Ofis Yöneticisi Başvurusu&body=${encodeURIComponent(getCareerMessage('ofis-yoneticisi'))}` : "#"}
                        onClick={!kvkkOfisYoneticisi ? (e) => e.preventDefault() : undefined}
                        className={`block w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                          kvkkOfisYoneticisi 
                            ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span>📧</span>
                        Başvur
                      </a>
                    </div>
                    
                    {/* Yönetici Yardımcısı */}
                    <div className="bg-white border border-[#E7E9EC] rounded-xl p-4">
                      <div className="font-bold text-sm mb-1">2) Yönetici yardımcısı pozisyonuna başvur</div>
                      <div className="text-xs text-zinc-500 mb-3">Yalnızca gayrimenkul sektöründe 7 yıl ve üzeri deneyime sahip kişiler değerlendirmeye alınacaktır.</div>
                      
                      {/* KVKK Onay Kutucuğu */}
                      <div className="mb-3">
                        <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={kvkkYoneticiYardimcisi}
                            onChange={(e) => setKvkkYoneticiYardimcisi(e.target.checked)}
                            className="mt-0.5"
                          />
                          <span>Kişisel verilerimin saklanmasına ilişkin KVKK ile uyumlu olarak işlenmesini kabul ediyorum.</span>
                        </label>
                        {!kvkkYoneticiYardimcisi && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Lütfen KVKK onayını verin
                          </p>
                        )}
                      </div>
                      
                      <a 
                        href={kvkkYoneticiYardimcisi ? `mailto:apply@yatirimlikevler.com?subject=Yönetici Yardımcısı Başvurusu&body=${encodeURIComponent(getCareerMessage('ofis-yoneticisi-yardimcisi'))}` : "#"}
                        onClick={!kvkkYoneticiYardimcisi ? (e) => e.preventDefault() : undefined}
                        className={`block w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                          kvkkYoneticiYardimcisi 
                            ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span>📧</span>
                        Başvur
                      </a>
                    </div>
                    
                    {/* Gayrimenkul Danışmanı */}
                    <div className="bg-white border border-[#E7E9EC] rounded-xl p-4">
                      <div className="font-bold text-sm mb-1">3) Gayrimenkul danışmanı pozisyonuna başvur</div>
                      <div className="text-xs text-zinc-500 mb-3">Yalnızca gayrimenkul sektöründe 2 yıl ve üzeri deneyime sahip kişiler değerlendirmeye alınacaktır.</div>
                      
                      {/* KVKK Onay Kutucuğu */}
                      <div className="mb-3">
                        <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={kvkkGayrimenkulDanismani}
                            onChange={(e) => setKvkkGayrimenkulDanismani(e.target.checked)}
                            className="mt-0.5"
                          />
                          <span>Kişisel verilerimin saklanmasına ilişkin KVKK ile uyumlu olarak işlenmesini kabul ediyorum.</span>
                        </label>
                        {!kvkkGayrimenkulDanismani && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Lütfen KVKK onayını verin
                          </p>
                        )}
                      </div>
                      
                      <a 
                        href={kvkkGayrimenkulDanismani ? `mailto:apply@yatirimlikevler.com?subject=Gayrimenkul Danışmanı Başvurusu&body=${encodeURIComponent(getCareerMessage('gayrimenkul-danismani'))}` : "#"}
                        onClick={!kvkkGayrimenkulDanismani ? (e) => e.preventDefault() : undefined}
                        className={`block w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                          kvkkGayrimenkulDanismani 
                            ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span>📧</span>
                        Başvur
                      </a>
                    </div>
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
                <span className="text-lg">Bize Ulaş</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.iletisim ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openDetails.iletisim && (
              <div className="px-6 pb-6">
                 <div className="border-t border-[#C40001]/10 pt-4">
                   <div className="space-y-4">
                     <p className="text-sm text-zinc-600">
                       Lütfen her türlü detaylı bilgi için bizlere WhatsApp hattımız üzerinden ulaşın:
                     </p>
                     
                     {/* WhatsApp Butonu */}
                     <a 
                       href="https://wa.me/905407208080?text=Merhaba,+detaylı+bilgi+almak+istiyorum"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="block w-full bg-[#C40001] text-white rounded-xl p-3 text-center font-medium hover:bg-[#C40001]/90 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                     >
                       <span>📱</span>
                       WhatsApp'tan Bize Ulaş
                     </a>
                     
                     <p className="text-sm text-zinc-600">
                       Kurumsal işbirlikleri için:
                     </p>
                     
                     {/* Email Butonu */}
                     <a 
                       href="mailto:info@yatirimlikevler.com?subject=Kurumsal İşbirliği&body=Merhaba, kurumsal işbirliği konusunda bilgi almak istiyorum."
                       className="block w-full bg-gray-100 text-zinc-700 rounded-xl p-3 text-center font-medium hover:bg-gray-200 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                     >
                       <span>📧</span>
                       Email Gönder
                     </a>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#C40001]/10 px-6 py-6">
        <div className="max-w-md md:max-w-2xl lg:max-w-2xl mx-auto text-center">
          <p className="text-zinc-500 text-xs leading-relaxed">
            Yatırımlık Evler © 2025 — Türkiye'nin İlk Premium Konut Platformu
          </p>
      </div>
      </footer>
    </main>
  );
}
