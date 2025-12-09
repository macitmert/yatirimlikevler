"use client";
import { useState, useEffect } from "react";

export default function Alici() {
  const [step, setStep] = useState(1);
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Sayfa yenilendiğinde seçimler sıfırlansın
  // localStorage'dan veri yükleme kaldırıldı

  // localStorage'a veri kaydet
  const saveToStorage = (data: any) => {
    localStorage.setItem('alici-form', JSON.stringify({ ...data, step }));
  };

  // Step 2 seçimlerini sıfırla (Step 1'e dönmez)
  const resetStep2Selections = () => {
    setFormData((prev: any) => ({
      ...prev,
      city: '',
      istanbul_side: '',
      budget_min: '',
      budget_max: '',
      property_type: '',
      property_type_custom: '',
      room_type_custom: '',
      usage_purpose: '',
      priority: '',
      timeline: '',
      payment: '',
      note: '',
      consent: false
    }));
    setSelectedDistricts([]);
    setSelectedBudget("");
    setSelectedPropertyTypes([]);
    setSelectedRoomTypes([]);
    setFieldErrors({});
    setErr(null);
  };

  const istanbulDistricts = {
    Anadolu: ['Kadıköy', 'Üsküdar', 'Ataşehir', 'Ümraniye', 'Maltepe', 'Kartal', 'Pendik', 'Tuzla', 'Çekmeköy', 'Sancaktepe', 'Sultanbeyli', 'Beykoz', 'Şile', 'Adalar'],
    Avrupa: ['Beşiktaş', 'Şişli', 'Sarıyer', 'Kağıthane', 'Beyoğlu', 'Fatih', 'Eyüpsultan', 'Gaziosmanpaşa', 'Bayrampaşa', 'Zeytinburnu', 'Bakırköy', 'Bahçelievler', 'Bağcılar', 'Güngören', 'Esenler', 'Esenyurt', 'Avcılar', 'Beylikdüzü', 'Küçükçekmece', 'Başakşehir', 'Arnavutköy', 'Sultangazi', 'Çatalca', 'Silivri', 'Büyükçekmece']
  };

  const cityDistricts = {
    'Ankara': ['Çankaya (merkez)', 'Keçiören (merkez)', 'Mamak (merkez)', 'Yenimahalle (merkez)', 'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çubuk', 'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kalecik', 'Kazan', 'Kızılcahamam', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçhisar'],
    'İzmir': ['Konak (merkez)', 'Bornova (merkez)', 'Karşıyaka (merkez)', 'Buca (merkez)', 'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
    'Samsun': ['İlkadım (merkez)', 'Atakum (merkez)', 'Canik (merkez)', '19 Mayıs', 'Alaçam', 'Asarcık', 'Ayvacık', 'Bafra', 'Çarşamba', 'Havza', 'Kavak', 'Ladik', 'Ondokuzmayıs', 'Salıpazarı', 'Tekkeköy', 'Terme', 'Vezirköprü', 'Yakakent'],
    'Trabzon': ['Ortahisar (merkez)', 'Akçaabat', 'Araklı', 'Arsin', 'Beşikdüzü', 'Çarşıbaşı', 'Çaykara', 'Dernekpazarı', 'Düzköy', 'Hayrat', 'Köprübaşı', 'Maçka', 'Of', 'Sürmene', 'Şalpazarı', 'Tonya', 'Vakfıkebir', 'Yomra'],
    'Sinop': ['Merkez (merkez)', 'Ayancık', 'Boyabat', 'Dikmen', 'Durağan', 'Erfelek', 'Gerze', 'Saraydüzü', 'Türkeli'],
    'Diyarbakır': ['Sur (merkez)', 'Bağlar (merkez)', 'Kayapınar (merkez)', 'Yenişehir (merkez)', 'Bismil', 'Çermik', 'Çınar', 'Çüngüş', 'Dicle', 'Eğil', 'Ergani', 'Hani', 'Hazro', 'Kocaköy', 'Kulp', 'Lice', 'Silvan'],
    'Van': ['İpekyolu (merkez)', 'Tuşba (merkez)', 'Bahçesaray', 'Başkale', 'Çaldıran', 'Çatak', 'Edremit', 'Erciş', 'Gevaş', 'Gürpınar', 'Muradiye', 'Özalp', 'Saray'],
    'Erzurum': ['Yakutiye (merkez)', 'Palandöken (merkez)', 'Aziziye (merkez)', 'Aşkale', 'Çat', 'Hınıs', 'Horasan', 'İspir', 'Karaçoban', 'Karayazı', 'Köprüköy', 'Narman', 'Oltu', 'Olur', 'Pasinler', 'Pazaryolu', 'Şenkaya', 'Tekman', 'Tortum', 'Uzundere'],
    'Denizli': ['Pamukkale (merkez)', 'Merkezefendi (merkez)', 'Acıpayam', 'Babadağ', 'Baklan', 'Bekilli', 'Beyağaç', 'Bozkurt', 'Buldan', 'Çal', 'Çameli', 'Çardak', 'Çivril', 'Güney', 'Honaz', 'Kale', 'Sarayköy', 'Serinhisar', 'Tavas']
  };

  const budgetChips = ['1-2M', '2-3M', '3-5M', '5-8M', '8-15M', '15-20M', '20M+'];
  const propertyTypes = ['Daire', 'Rezidans', 'Müstakil Ev', 'Villa', 'Yazlık', 'Diğer'];
  const roomTypes = ['1+0', '1+1', '2+1', '3+1', '4+1', '5+1+', 'Diğer'];

  const handleInputChange = (name: string, value: any) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    saveToStorage(newData);
  };

  const handlePhoneChange = (value: string) => {
    // Sadece rakamları al
    const cleanValue = value.replace(/\D/g, '');
    
    // 10 haneden fazla girişi engelle
    const limitedValue = cleanValue.slice(0, 10);
    
    handleInputChange('telefon', limitedValue);
    
    // Validasyon
    if (limitedValue.length === 0) {
      setPhoneError("");
    } else if (limitedValue.length < 10) {
      setPhoneError(`${limitedValue.length}/10 karakter - ${10 - limitedValue.length} karakter daha gerekli`);
    } else if (limitedValue.length === 10) {
      if (limitedValue.startsWith('5')) {
        setPhoneError("✅ Geçerli telefon numarası");
      } else {
        setPhoneError("❌ Telefon numarası 5 ile başlamalıdır");
      }
    }
  };

  const handleDistrictToggle = (district: string) => {
    const newDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter(d => d !== district)
      : [...selectedDistricts, district];
    setSelectedDistricts(newDistricts);
    handleInputChange('districts', newDistricts);
  };

  const removeDistrict = (district: string) => {
    const newDistricts = selectedDistricts.filter(d => d !== district);
    setSelectedDistricts(newDistricts);
    handleInputChange('districts', newDistricts);
  };

  // Sayıyı noktalı formata çevir (1.000.000 TL)
  const formatNumber = (num: number | string) => {
    if (!num) return '';
    const numStr = num.toString().replace(/\D/g, '');
    const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formatted + ' TL';
  };

  // Noktalı sayıyı temiz sayıya çevir (1.000.000 TL -> 1000000)
  const parseNumber = (str: string) => {
    return str.replace(/[.\sTL]/g, '');
  };

  const handleBudgetChip = (budget: string) => {
    setSelectedBudget(budget);
    const ranges = {
      '1-2M': { min: 1000000, max: 2000000 },
      '2-3M': { min: 2000000, max: 3000000 },
      '3-5M': { min: 3000000, max: 5000000 },
      '5-8M': { min: 5000000, max: 8000000 },
      '8-15M': { min: 8000000, max: 15000000 },
      '15-20M': { min: 15000000, max: 20000000 },
      '20M+': { min: 20000000, max: null }
    };
    const range = ranges[budget as keyof typeof ranges];
    if (range) {
      // Doğrudan setFormData kullan ve localStorage'a kaydet
      const newData = {
        ...formData,
        budget_min: range.min.toString(),
        budget_max: range.max ? range.max.toString() : ''
      };
      setFormData(newData);
      saveToStorage(newData);
    }
  };

  const handleRoomTypeToggle = (roomType: string) => {
    const newRoomTypes = selectedRoomTypes.includes(roomType)
      ? selectedRoomTypes.filter(r => r !== roomType)
      : [...selectedRoomTypes, roomType];
    setSelectedRoomTypes(newRoomTypes);
    handleInputChange('room_types', newRoomTypes);
  };

  const removeRoomType = (roomType: string) => {
    const newRoomTypes = selectedRoomTypes.filter(r => r !== roomType);
    setSelectedRoomTypes(newRoomTypes);
    handleInputChange('room_types', newRoomTypes);
  };

  const handlePropertyTypeToggle = (propertyType: string) => {
    const newPropertyTypes = selectedPropertyTypes.includes(propertyType)
      ? selectedPropertyTypes.filter(p => p !== propertyType)
      : [...selectedPropertyTypes, propertyType];
    setSelectedPropertyTypes(newPropertyTypes);
    handleInputChange('property_types', newPropertyTypes);
  };

  const removePropertyType = (propertyType: string) => {
    const newPropertyTypes = selectedPropertyTypes.filter(p => p !== propertyType);
    setSelectedPropertyTypes(newPropertyTypes);
    handleInputChange('property_types', newPropertyTypes);
  };

  // Tüm ilçeleri seç
  const selectAllDistricts = () => {
    if (formData.city === 'İstanbul' && formData.istanbul_side) {
      const allDistricts = istanbulDistricts[formData.istanbul_side as keyof typeof istanbulDistricts] || [];
      setSelectedDistricts(allDistricts);
      handleInputChange('districts', allDistricts);
    } else if (formData.city && formData.city !== 'İstanbul') {
      const allDistricts = cityDistricts[formData.city as keyof typeof cityDistricts] || [];
      setSelectedDistricts(allDistricts);
      handleInputChange('districts', allDistricts);
    }
  };


  const nextStep = () => {
    if (step === 1) {
      const errors: {[key: string]: string} = {};
      
      if (!formData.ad) {
        errors.ad = 'Lütfen adınızı girin';
      }
      if (!formData.soyad) {
        errors.soyad = 'Lütfen soyadınızı girin';
      }
      if (!formData.telefon) {
        errors.telefon = 'Lütfen telefon numaranızı girin';
      } else if (formData.telefon.length !== 10) {
        errors.telefon = 'Telefon numarası 10 haneli olmalıdır';
      }
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setErr('Lütfen eksik alanları doldurunuz');
        return;
      }
      
      setFieldErrors({});
      setErr(null);
    }
    setStep(2);
    saveToStorage({ ...formData, step: 2 });
  };

  const isStep1Valid = () => {
    return formData.ad && formData.soyad && formData.telefon && formData.telefon.length === 10;
  };

  const isStep2Valid = () => {
    // 20M+ seçildiğinde budget_max boş olabilir
    const hasValidBudget = formData.budget_max || selectedBudget === '20M+';
    
    return formData.city && 
           hasValidBudget && 
           selectedPropertyTypes.length > 0 && 
           formData.usage_purpose &&
           formData.priority && 
           formData.timeline && 
           formData.payment && 
           formData.consent;
  };

  const prevStep = () => {
    setStep(1);
    saveToStorage({ ...formData, step: 1 });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Step 2 validation
    if (step === 2) {
      const errors: {[key: string]: string} = {};
      
      if (!formData.city) {
        errors.city = 'Lütfen şehir seçin';
      }
      if (!formData.budget_max && selectedBudget !== '20M+') {
        errors.budget_max = 'Lütfen maksimum bütçe girin';
      }
      if (selectedPropertyTypes.length === 0) {
        errors.property_type = 'Lütfen emlak tipi seçin';
      }
      if (!formData.usage_purpose) {
        errors.usage_purpose = 'Lütfen yatırım amacını seçin';
      }
      if (!formData.priority) {
        errors.priority = 'Lütfen yatırım beklentisi seçin';
      }
      if (!formData.timeline) {
        errors.timeline = 'Lütfen zamanlama seçin';
      }
      if (!formData.payment) {
        errors.payment = 'Lütfen ödeme şekli seçin';
      }
      if (!formData.consent) {
        errors.consent = 'Lütfen sözleşme şartlarını kabul edin';
      }
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setErr('Lütfen eksik alanları doldurunuz');
        return;
      }
      
      setFieldErrors({});
      setErr(null);
    }
    
    setSending(true); setErr(null);
    
    const payload = {
      formType: 'alici',
      ad: formData.ad,
      soyad: formData.soyad,
      telefon: `${formData.phone_code || '+90'}${formData.telefon}`,
      email: formData.email || '',
      city: formData.city,
      istanbul_side: formData.istanbul_side || '',
      districts: selectedDistricts,
      budget_min: formData.budget_min || '',
      budget_max: formData.budget_max || (selectedBudget === '20M+' ? '20M+' : ''),
      property_types: selectedPropertyTypes,
      property_type_custom: formData.property_type_custom || '',
      room_types: selectedRoomTypes,
      room_type_custom: formData.room_type_custom || '',
      usage_purpose: formData.usage_purpose || '',
      priority: formData.priority || '',
      timeline: formData.timeline || '',
      payment: formData.payment || '',
      note: formData.note || '',
      consent: formData.consent || false,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
      userAgent: navigator.userAgent
    };

    const fd = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, String(value));
      }
    });

    const res = await fetch("/api/lead", { method: "POST", body: fd });
    setSending(false);
    
    if (res.ok) {
      setOk(true);
      localStorage.removeItem('alici-form');
    } else {
      setErr("Gönderim sırasında bir sorun oluştu.");
    }
  }

  if (ok) {
    return (
      <main className="max-w-md mx-auto p-5 text-center">
        <h1 className="text-2xl font-semibold mb-4">✅ Talebiniz Alındı</h1>
        <p className="text-sm text-zinc-700 mb-4">Danışmanlarımız 24 saat içerisinde sizinle iletişime geçeceklerdir.</p>
        <p className="text-xs text-zinc-500">Yatırımlık Evler — Türkiye'nin ilk yatırım odaklı konut platformu.</p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-5 space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Yatırımlık Ev Arıyorum</h1>
            <p className="text-sm text-zinc-600">Temel bilgilerinizi girin</p>
            <p className="text-xs text-zinc-500 mt-1">* işaretli alanlar zorunludur</p>
          </div>

          <div className="space-y-4">
            <div>
              <input 
                name="ad" 
                required 
                placeholder="Ad *" 
                className={`w-full border rounded-lg p-3 ${fieldErrors.ad ? 'border-red-500' : ''}`}
                value={formData.ad || ''}
                onChange={(e) => {
                  handleInputChange('ad', e.target.value);
                  if (fieldErrors.ad) {
                    setFieldErrors(prev => ({ ...prev, ad: '' }));
                  }
                }}
              />
              {fieldErrors.ad && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.ad}</p>
              )}
            </div>
            <div>
              <input 
                name="soyad" 
                required 
                placeholder="Soyad *" 
                className={`w-full border rounded-lg p-3 ${fieldErrors.soyad ? 'border-red-500' : ''}`}
                value={formData.soyad || ''}
                onChange={(e) => {
                  handleInputChange('soyad', e.target.value);
                  if (fieldErrors.soyad) {
                    setFieldErrors(prev => ({ ...prev, soyad: '' }));
                  }
                }}
              />
              {fieldErrors.soyad && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.soyad}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Telefon *</label>
              <div className="flex gap-2">
                <select 
                  name="phone_code" 
                  required 
                  className="border rounded-lg p-3 w-20"
                  value={formData.phone_code || ''}
                  onChange={(e) => handleInputChange('phone_code', e.target.value)}
                >
                  <option value="">+90</option>
                  <option value="+90">+90</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+49">+49</option>
                  <option value="+33">+33</option>
                </select>
                <input 
                  name="telefon" 
                  required 
                  type="tel" 
                  pattern="^[0-9]{10}$"
                  placeholder="5XXXXXXXXX" 
                  className={`flex-1 border rounded-lg p-3 ${
                    fieldErrors.telefon ? 'border-red-500' : 
                    phoneError.includes('❌') ? 'border-red-500' : 
                    phoneError.includes('✅') ? 'border-green-500' : ''
                  }`}
                  value={formData.telefon || ''}
                  onChange={(e) => {
                    handlePhoneChange(e.target.value);
                    if (fieldErrors.telefon) {
                      setFieldErrors(prev => ({ ...prev, telefon: '' }));
                    }
                  }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">10 haneli telefon numaranızı girin</p>
              {fieldErrors.telefon && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.telefon}</p>
              )}
              {phoneError && !fieldErrors.telefon && (
                <p className={`text-xs mt-1 ${phoneError.includes('❌') ? 'text-red-500' : phoneError.includes('✅') ? 'text-green-500' : 'text-blue-500'}`}>
                  {phoneError}
                </p>
              )}
            </div>
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="E-posta (opsiyonel)" 
                className="w-full border rounded-lg p-3" 
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={nextStep}
            disabled={!isStep1Valid()}
            className={`w-full rounded-lg p-3 font-medium ${
              isStep1Valid() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Devam Et →
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Yatırım Detayları</h1>
            <p className="text-sm text-zinc-600">Tercihlerinizi belirtin</p>
            <p className="text-xs text-zinc-500 mt-1">* işaretli alanlar zorunludur</p>
            <button 
              type="button" 
              onClick={resetStep2Selections}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Bu Sayfadaki Seçimleri Sıfırla
            </button>
          </div>


          {/* Konum Seçimi */}
          <div className="space-y-4">
            <h3 className="font-medium">Konum Seçimi *</h3>
            <select 
              name="city" 
              required 
              className={`w-full border rounded-lg p-3 ${fieldErrors.city ? 'border-red-500' : ''}`}
              value={formData.city || ''}
              onChange={(e) => {
                handleInputChange('city', e.target.value);
                if (fieldErrors.city) {
                  setFieldErrors(prev => ({ ...prev, city: '' }));
                }
              }}
            >
              <option value="">Şehir seçin</option>
              <option>İstanbul (Avrupa)</option><option>İstanbul (Anadolu)</option><option>Ankara</option><option>İzmir</option>
              <option>Antalya</option><option>Bursa</option><option>Konya</option><option>Muğla</option>
              <option>Mersin</option><option>Adana</option><option>Samsun</option><option>Trabzon</option>
              <option>Gaziantep</option><option>Diyarbakır</option><option>Erzurum</option><option>Van</option>
            </select>
            {fieldErrors.city && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>
            )}

            {formData.city === 'İstanbul' && (
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="istanbul_side" 
                      value="Anadolu" 
                      className="mr-2"
                      checked={formData.istanbul_side === 'Anadolu'}
                      onChange={(e) => handleInputChange('istanbul_side', e.target.value)}
                    />
                    Anadolu
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="istanbul_side" 
                      value="Avrupa" 
                      className="mr-2"
                      checked={formData.istanbul_side === 'Avrupa'}
                      onChange={(e) => handleInputChange('istanbul_side', e.target.value)}
                    />
                    Avrupa
                  </label>
                </div>

                {formData.istanbul_side && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white">İlçe seçin (çoklu seçim):</p>
                      <button 
                        type="button" 
                        onClick={selectAllDistricts}
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Hepsini Seç
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {istanbulDistricts[formData.istanbul_side as keyof typeof istanbulDistricts]?.map((district) => (
                        <label key={district} className="flex items-center text-sm">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedDistricts.includes(district)}
                            onChange={() => handleDistrictToggle(district)}
                          />
                          {district}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {formData.city && formData.city !== 'İstanbul' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white">İlçe seçin (çoklu seçim):</p>
                  <button 
                    type="button" 
                    onClick={selectAllDistricts}
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Hepsini Seç
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {cityDistricts[formData.city as keyof typeof cityDistricts]?.map((district) => (
                    <label key={district} className="flex items-center text-sm">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={selectedDistricts.includes(district)}
                        onChange={() => handleDistrictToggle(district)}
                      />
                      {district}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {selectedDistricts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDistricts.map((district) => (
                  <span key={district} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                    {district}
                    <button 
                      type="button" 
                      onClick={() => removeDistrict(district)}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-lg font-bold w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bütçe */}
          <div className="space-y-4">
            <h3 className="font-medium">Bütçe *</h3>
            <div className="flex flex-wrap gap-2">
              {budgetChips.map((budget) => (
                <button 
                  key={budget} 
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm border ${selectedBudget === budget ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() => handleBudgetChip(budget)}
                >
                  {budget}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input 
                name="budget_min" 
                type="tel" 
                inputMode="numeric"
                placeholder="Min TL (opsiyonel)" 
                className="border rounded-lg p-3" 
                value={formatNumber(formData.budget_min || '')}
                onChange={(e) => {
                  const cleanValue = parseNumber(e.target.value);
                  handleInputChange('budget_min', cleanValue);
                }}
              />
              <input 
                name="budget_max" 
                required={selectedBudget !== '20M+'}
                type="tel" 
                inputMode="numeric"
                min="250000"
                placeholder={selectedBudget === '20M+' ? "Max TL (opsiyonel)" : "Max TL *"} 
                className={`border rounded-lg p-3 ${fieldErrors.budget_max ? 'border-red-500' : ''}`}
                value={formatNumber(formData.budget_max || '')}
                onChange={(e) => {
                  const cleanValue = parseNumber(e.target.value);
                  handleInputChange('budget_max', cleanValue);
                  if (fieldErrors.budget_max) {
                    setFieldErrors(prev => ({ ...prev, budget_max: '' }));
                  }
                }}
              />
            </div>
            {fieldErrors.budget_max && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.budget_max}</p>
            )}
          </div>

          {/* Emlak Tipi */}
          <div className="space-y-4">
            <h3 className="font-medium">Emlak Tipi * (çoklu seçim)</h3>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button 
                  key={type} 
                  type="button"
                  className={`px-3 py-1 rounded-full text-sm border ${selectedPropertyTypes.includes(type) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                  onClick={() => handlePropertyTypeToggle(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Seçilen emlak tipleri */}
            {selectedPropertyTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPropertyTypes.map((type) => (
                  <span key={type} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">
                    {type}
                    <button
                      type="button"
                      onClick={() => removePropertyType(type)}
                      className="text-blue-600 hover:text-blue-800 text-lg font-bold w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {selectedPropertyTypes.includes('Diğer') && (
              <input 
                name="property_type_custom" 
                placeholder="Diğer konut tipi" 
                className="w-full border rounded-lg p-3" 
                value={formData.property_type_custom || ''}
                onChange={(e) => handleInputChange('property_type_custom', e.target.value)}
              />
            )}
            {fieldErrors.property_type && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.property_type}</p>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Oda Sayısı (opsiyonel)</p>
              <div className="flex flex-wrap gap-2">
                {roomTypes.map((type) => (
                  <button 
                    key={type} 
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm border ${selectedRoomTypes.includes(type) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                    onClick={() => handleRoomTypeToggle(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {selectedRoomTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedRoomTypes.map((roomType) => (
                    <span key={roomType} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                      {roomType}
                      <button 
                        type="button" 
                        onClick={() => removeRoomType(roomType)}
                        className="ml-2 text-blue-600 hover:text-blue-800 text-lg font-bold w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {selectedRoomTypes.includes('Diğer') && (
              <input 
                name="room_type_custom" 
                placeholder="Diğer oda tipi" 
                className="w-full border rounded-lg p-3" 
                value={formData.room_type_custom || ''}
                onChange={(e) => handleInputChange('room_type_custom', e.target.value)}
              />
            )}
          </div>

          {/* Yatırım Tercihleri */}
          <div className="space-y-4">
            <h3 className="font-medium">Yatırım Tercihleri *</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white mb-2">Yatırım Amacı:</p>
                <div className="flex flex-wrap gap-4">
                  {['Yatırım', 'Oturmak'].map((usage) => (
                    <label key={usage} className="flex items-center">
                      <input 
                        type="radio" 
                        name="usage_purpose" 
                        value={usage} 
                        className="mr-2"
                        checked={formData.usage_purpose === usage}
                        onChange={(e) => {
                          handleInputChange('usage_purpose', e.target.value);
                          if (fieldErrors.usage_purpose) {
                            setFieldErrors(prev => ({ ...prev, usage_purpose: '' }));
                          }
                        }}
                      />
                      <span className="text-sm">{usage}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.usage_purpose && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.usage_purpose}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-white mb-2">Yatırım Beklentisi:</p>
                <div className="flex flex-wrap gap-4">
                  {['Kira Getirisi', 'Değer Artışı', 'Dengeli'].map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input 
                        type="radio" 
                        name="priority" 
                        value={priority} 
                        className="mr-2"
                        checked={formData.priority === priority}
                        onChange={(e) => {
                          handleInputChange('priority', e.target.value);
                          if (fieldErrors.priority) {
                            setFieldErrors(prev => ({ ...prev, priority: '' }));
                          }
                        }}
                      />
                      <span className="text-sm">{priority}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.priority && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.priority}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-white mb-2">Zamanlama:</p>
                <div className="flex flex-wrap gap-4">
                  {['Hemen', '1-3 Ay', '3+ Ay'].map((timeline) => (
                    <label key={timeline} className="flex items-center">
                      <input 
                        type="radio" 
                        name="timeline" 
                        value={timeline} 
                        className="mr-2"
                        checked={formData.timeline === timeline}
                        onChange={(e) => {
                          handleInputChange('timeline', e.target.value);
                          if (fieldErrors.timeline) {
                            setFieldErrors(prev => ({ ...prev, timeline: '' }));
                          }
                        }}
                      />
                      <span className="text-sm">{timeline}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.timeline && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.timeline}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-white mb-2">Ödeme:</p>
                <div className="flex flex-wrap gap-4">
                  {['Peşin', 'Ağırlıklı Peşin', 'Düşük Peşin Kalanı Kredi'].map((payment) => (
                    <label key={payment} className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        value={payment} 
                        className="mr-2"
                        checked={formData.payment === payment}
                        onChange={(e) => {
                          handleInputChange('payment', e.target.value);
                          if (fieldErrors.payment) {
                            setFieldErrors(prev => ({ ...prev, payment: '' }));
                          }
                        }}
                      />
                      <span className="text-sm">{payment}</span>
                    </label>
                  ))}
                </div>
                {fieldErrors.payment && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.payment}</p>
                )}
              </div>
            </div>

            <textarea 
              name="note" 
              placeholder="Notlar (opsiyonel)" 
              className="w-full border rounded-lg p-3 h-20" 
              value={formData.note || ''}
              onChange={(e) => handleInputChange('note', e.target.value)}
            />
          </div>

          {/* Onay */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-white inline-flex items-start gap-2">
              <input 
                type="checkbox" 
                name="consent" 
                required 
                className="mt-1"
                checked={formData.consent || false}
                onChange={(e) => {
                  handleInputChange('consent', e.target.checked);
                  if (fieldErrors.consent) {
                    setFieldErrors(prev => ({ ...prev, consent: '' }));
                  }
                }}
              />
              <span>Sözleşme esaslı çalıştığınızı ve önerdiğiniz/gösterdiğiniz evi almam halinde satış bedeli üzerinden <b>%2 + KDV</b> hizmet bedeli ödeyeceğimi kabul ediyorum.</span>
            </label>
            {fieldErrors.consent && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.consent}</p>
            )}
          </div>

          {/* Honeypot */}
          <input type="text" name="website" style={{display: 'none'}} tabIndex={-1} autoComplete="off" />

          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={prevStep}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg p-3 font-medium"
            >
              ← Geri
            </button>
            <button 
              type="submit" 
              disabled={sending || !isStep2Valid()} 
              className={`flex-1 rounded-lg p-3 font-medium ${
                isStep2Valid() 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } disabled:opacity-50`}
            >
              {sending ? "Gönderiliyor..." : "Gönder"}
            </button>
          </div>

          {err && <p className="text-red-600 text-sm text-center">{err}</p>}
        </form>

      )}
    </main>
  );
}

