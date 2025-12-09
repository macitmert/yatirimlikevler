"use client";
import { useState } from "react";

export default function Satici() {
  const [currentStep, setCurrentStep] = useState(1);
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Temel Bilgiler
    firstName: "",
    lastName: "",
    phoneCode: "+90",
    phone: "",
    email: "",
    isOwner: "",
    // Gayrimenkul Bilgileri
    city: "",
    district: "",
    neighborhood: "",
    address: "",
    isInSite: "",
    siteName: "",
    grossM2: "",
    netM2: "",
    roomCount: "",
    buildingAge: "",
    floor: "",
    totalFloors: "",
    heatingType: "",
    deedStatus: "",
    usageStatus: "",
    furnitureStatus: "",
    hasElevator: "",
    hasParking: "",
    hasBalcony: "",
    view: "",
    // Finansal Bilgiler
    salePrice: "",
    monthlyRent: "",
    tenantProfession: "",
    regularRent: "",
    rentPotential: "",
    // Açıklama
    description: "",
    // Onaylar
    dataProcessing: false,
    ownershipDeclaration: false,
    exclusiveRight: false,
    serviceFee: false,
    freeApplication: false
  });

  const totalSteps = 6;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validatePhone = (phone: string, code: string) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    if (code === "+90") {
      return cleanPhone.length === 10 && cleanPhone.startsWith('5');
    } else if (code === "+1") {
      return cleanPhone.length === 10;
    } else if (code === "+44") {
      return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    } else if (code === "+49") {
      return cleanPhone.length >= 10 && cleanPhone.length <= 12;
    } else if (code === "+33") {
      return cleanPhone.length === 9;
    } else {
      return cleanPhone.length >= 7 && cleanPhone.length <= 15;
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && validatePhone(formData.phone, formData.phoneCode) && formData.isOwner === "Evet";
      case 2:
        return formData.city && formData.district && formData.neighborhood && formData.grossM2 && formData.netM2 && formData.roomCount && formData.buildingAge && formData.deedStatus && formData.usageStatus && formData.furnitureStatus;
      case 3:
        return formData.salePrice && (formData.usageStatus === "Boş" ? formData.rentPotential : formData.monthlyRent && formData.regularRent);
      case 4:
        return true; // Görseller opsiyonel
      case 5:
        return formData.description && formData.description.length >= 200;
      case 6:
        return formData.dataProcessing && formData.ownershipDeclaration && formData.exclusiveRight && formData.serviceFee && formData.freeApplication;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setErr(null);
    
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        fd.append(key, value ? 'true' : 'false');
      } else {
        fd.append(key, value.toString());
      }
    });
    fd.append('formType', 'satici');
    fd.append('source', 'website');

    const res = await fetch("/api/lead", { method: "POST", body: fd });
    setSending(false);
    if (res.ok) setOk(true); else setErr("Gönderim sırasında bir sorun oluştu.");
  }

  if (ok) {
    return (
      <main className="max-w-md mx-auto p-5">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-xl font-semibold mb-2">Başvurunuz başarıyla alındı!</h1>
          <div className="text-sm text-zinc-700 space-y-2">
            <p>Eviniz 24–48 saat içinde yatırım ekibimiz tarafından incelenecek.</p>
            <p>Eğer kriterlerimize uygunsa, sizinle WhatsApp üzerinden iletişime geçeceğiz.</p>
            <p className="text-xs text-zinc-500">Kriterlere uygun olmayan başvurulara yoğunluk nedeniyle geri dönüş yapılamamaktadır.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-5 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">🏠 YATIRIMLIK EVLER</h1>
        <p className="text-sm text-zinc-600 mb-4">PORTFÖY BAŞVURU FORMU</p>
        <div className="flex justify-center space-x-2 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full ${
                i + 1 < currentStep ? 'bg-green-500' : 
                i + 1 === currentStep ? 'bg-[#C40001]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-zinc-500">
          Adım {currentStep} / {totalSteps}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Adım 1: Temel Bilgiler */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#C40001]">1️⃣ Temel Bilgiler</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                required
                placeholder="Ad (zorunlu)"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border rounded-lg p-3"
              />
              <input
                name="lastName"
                required
                placeholder="Soyad (zorunlu)"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border rounded-lg p-3"
              />
            </div>

            <p className="text-xs text-zinc-500 bg-zinc-50 p-3 rounded-lg border-l-4 border-orange-400">
              ⚠️ Başvuracak kişinin taşınmazın maliki (sahibi) olması zorunludur.
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  name="phoneCode"
                  value={formData.phoneCode}
                  onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                  className="border rounded-lg p-3 w-24"
                >
                  <option value="+90">🇹🇷 +90</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+43">🇦🇹 +43</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+358">🇫🇮 +358</option>
                  <option value="+7">🇷🇺 +7</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+974">🇶🇦 +974</option>
                  <option value="+965">🇰🇼 +965</option>
                  <option value="+973">🇧🇭 +973</option>
                  <option value="+968">🇴🇲 +968</option>
                  <option value="+20">🇪🇬 +20</option>
                  <option value="+212">🇲🇦 +212</option>
                  <option value="+216">🇹🇳 +216</option>
                  <option value="+213">🇩🇿 +213</option>
                  <option value="+218">🇱🇾 +218</option>
                  <option value="+220">🇬🇲 +220</option>
                  <option value="+221">🇸🇳 +221</option>
                  <option value="+222">🇲🇷 +222</option>
                  <option value="+223">🇲🇱 +223</option>
                  <option value="+224">🇬🇳 +224</option>
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+226">🇧🇫 +226</option>
                  <option value="+227">🇳🇪 +227</option>
                  <option value="+228">🇹🇬 +228</option>
                  <option value="+229">🇧🇯 +229</option>
                  <option value="+230">🇲🇺 +230</option>
                  <option value="+231">🇱🇷 +231</option>
                  <option value="+232">🇸🇱 +232</option>
                  <option value="+233">🇬🇭 +233</option>
                  <option value="+234">🇳🇬 +234</option>
                  <option value="+235">🇹🇩 +235</option>
                  <option value="+236">🇨🇫 +236</option>
                  <option value="+237">🇨🇲 +237</option>
                  <option value="+238">🇨🇻 +238</option>
                  <option value="+239">🇸🇹 +239</option>
                  <option value="+240">🇬🇶 +240</option>
                  <option value="+241">🇬🇦 +241</option>
                  <option value="+242">🇨🇬 +242</option>
                  <option value="+243">🇨🇩 +243</option>
                  <option value="+244">🇦🇴 +244</option>
                  <option value="+245">🇬🇼 +245</option>
                  <option value="+246">🇮🇴 +246</option>
                  <option value="+248">🇸🇨 +248</option>
                  <option value="+249">🇸🇩 +249</option>
                  <option value="+250">🇷🇼 +250</option>
                  <option value="+251">🇪🇹 +251</option>
                  <option value="+252">🇸🇴 +252</option>
                  <option value="+253">🇩🇯 +253</option>
                  <option value="+254">🇰🇪 +254</option>
                  <option value="+255">🇹🇿 +255</option>
                  <option value="+256">🇺🇬 +256</option>
                  <option value="+257">🇧🇮 +257</option>
                  <option value="+258">🇲🇿 +258</option>
                  <option value="+260">🇿🇲 +260</option>
                  <option value="+261">🇲🇬 +261</option>
                  <option value="+262">🇷🇪 +262</option>
                  <option value="+263">🇿🇼 +263</option>
                  <option value="+264">🇳🇦 +264</option>
                  <option value="+265">🇲🇼 +265</option>
                  <option value="+266">🇱🇸 +266</option>
                  <option value="+267">🇧🇼 +267</option>
                  <option value="+268">🇸🇿 +268</option>
                  <option value="+269">🇰🇲 +269</option>
                  <option value="+290">🇸🇭 +290</option>
                  <option value="+291">🇪🇷 +291</option>
                  <option value="+297">🇦🇼 +297</option>
                  <option value="+298">🇫🇴 +298</option>
                  <option value="+299">🇬🇱 +299</option>
                  <option value="+350">🇬🇮 +350</option>
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+352">🇱🇺 +352</option>
                  <option value="+353">🇮🇪 +353</option>
                  <option value="+354">🇮🇸 +354</option>
                  <option value="+355">🇦🇱 +355</option>
                  <option value="+356">🇲🇹 +356</option>
                  <option value="+357">🇨🇾 +357</option>
                  <option value="+358">🇫🇮 +358</option>
                  <option value="+359">🇧🇬 +359</option>
                  <option value="+370">🇱🇹 +370</option>
                  <option value="+371">🇱🇻 +371</option>
                  <option value="+372">🇪🇪 +372</option>
                  <option value="+373">🇲🇩 +373</option>
                  <option value="+374">🇦🇲 +374</option>
                  <option value="+375">🇧🇾 +375</option>
                  <option value="+376">🇦🇩 +376</option>
                  <option value="+377">🇲🇨 +377</option>
                  <option value="+378">🇸🇲 +378</option>
                  <option value="+380">🇺🇦 +380</option>
                  <option value="+381">🇷🇸 +381</option>
                  <option value="+382">🇲🇪 +382</option>
                  <option value="+383">🇽🇰 +383</option>
                  <option value="+385">🇭🇷 +385</option>
                  <option value="+386">🇸🇮 +386</option>
                  <option value="+387">🇧🇦 +387</option>
                  <option value="+389">🇲🇰 +389</option>
                  <option value="+420">🇨🇿 +420</option>
                  <option value="+421">🇸🇰 +421</option>
                  <option value="+423">🇱🇮 +423</option>
                  <option value="+500">🇫🇰 +500</option>
                  <option value="+501">🇧🇿 +501</option>
                  <option value="+502">🇬🇹 +502</option>
                  <option value="+503">🇸🇻 +503</option>
                  <option value="+504">🇭🇳 +504</option>
                  <option value="+505">🇳🇮 +505</option>
                  <option value="+506">🇨🇷 +506</option>
                  <option value="+507">🇵🇦 +507</option>
                  <option value="+508">🇵🇲 +508</option>
                  <option value="+509">🇭🇹 +509</option>
                  <option value="+590">🇬🇵 +590</option>
                  <option value="+591">🇧🇴 +591</option>
                  <option value="+592">🇬🇾 +592</option>
                  <option value="+593">🇪🇨 +593</option>
                  <option value="+594">🇬🇫 +594</option>
                  <option value="+595">🇵🇾 +595</option>
                  <option value="+596">🇲🇶 +596</option>
                  <option value="+597">🇸🇷 +597</option>
                  <option value="+598">🇺🇾 +598</option>
                  <option value="+599">🇧🇶 +599</option>
                  <option value="+670">🇹🇱 +670</option>
                  <option value="+672">🇦🇶 +672</option>
                  <option value="+673">🇧🇳 +673</option>
                  <option value="+674">🇳🇷 +674</option>
                  <option value="+675">🇵🇬 +675</option>
                  <option value="+676">🇹🇴 +676</option>
                  <option value="+677">🇸🇧 +677</option>
                  <option value="+678">🇻🇺 +678</option>
                  <option value="+679">🇫🇯 +679</option>
                  <option value="+680">🇵🇼 +680</option>
                  <option value="+681">🇼🇫 +681</option>
                  <option value="+682">🇨🇰 +682</option>
                  <option value="+683">🇳🇺 +683</option>
                  <option value="+684">🇦🇸 +684</option>
                  <option value="+685">🇼🇸 +685</option>
                  <option value="+686">🇰🇮 +686</option>
                  <option value="+687">🇳🇨 +687</option>
                  <option value="+688">🇹🇻 +688</option>
                  <option value="+689">🇵🇫 +689</option>
                  <option value="+690">🇹🇰 +690</option>
                  <option value="+691">🇫🇲 +691</option>
                  <option value="+692">🇲🇭 +692</option>
                  <option value="+850">🇰🇵 +850</option>
                  <option value="+852">🇭🇰 +852</option>
                  <option value="+853">🇲🇴 +853</option>
                  <option value="+855">🇰🇭 +855</option>
                  <option value="+856">🇱🇦 +856</option>
                  <option value="+880">🇧🇩 +880</option>
                  <option value="+886">🇹🇼 +886</option>
                  <option value="+960">🇲🇻 +960</option>
                  <option value="+961">🇱🇧 +961</option>
                  <option value="+962">🇯🇴 +962</option>
                  <option value="+963">🇸🇾 +963</option>
                  <option value="+964">🇮🇶 +964</option>
                  <option value="+965">🇰🇼 +965</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+967">🇾🇪 +967</option>
                  <option value="+968">🇴🇲 +968</option>
                  <option value="+970">🇵🇸 +970</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+972">🇮🇱 +972</option>
                  <option value="+973">🇧🇭 +973</option>
                  <option value="+974">🇶🇦 +974</option>
                  <option value="+975">🇧🇹 +975</option>
                  <option value="+976">🇲🇳 +976</option>
                  <option value="+977">🇳🇵 +977</option>
                  <option value="+992">🇹🇯 +992</option>
                  <option value="+993">🇹🇲 +993</option>
                  <option value="+994">🇦🇿 +994</option>
                  <option value="+995">🇬🇪 +995</option>
                  <option value="+996">🇰🇬 +996</option>
                  <option value="+998">🇺🇿 +998</option>
                </select>
                <input
                  name="phone"
                  required
                  placeholder="Telefon Numarası (zorunlu)"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange('phone', value);
                  }}
                  maxLength={15}
                  className="flex-1 border rounded-lg p-3"
                />
              </div>
              {formData.phone && !validatePhone(formData.phone, formData.phoneCode) && (
                <p className="text-xs text-red-600">
                  ⚠️ Geçersiz numara - {formData.phoneCode === "+90" ? "10 haneli, 5 ile başlayan" : "geçerli format"} numara giriniz
                </p>
              )}
            </div>

            <input
              type="email"
              name="email"
              placeholder="E-posta Adresi (opsiyonel)"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <div>
              <label className="block text-sm font-medium mb-2">Malik misiniz?</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isOwner"
                    value="Evet"
                    checked={formData.isOwner === "Evet"}
                    onChange={(e) => handleInputChange('isOwner', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Evet</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isOwner"
                    value="Hayır"
                    checked={formData.isOwner === "Hayır"}
                    onChange={(e) => handleInputChange('isOwner', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Hayır</span>
                </label>
              </div>
              {formData.isOwner === "Hayır" && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Yalnızca ev sahibi (malik) başvuru yapabilir.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Tapu Belgesi (zorunlu)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full border rounded-lg p-3 text-sm"
                />
                <p className="text-xs text-zinc-500 mt-1">PDF, JPG veya PNG formatında tapu fotokopisi veya e-devlet çıktısı</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kimlik Belgesi - Ön Yüz (zorunlu)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full border rounded-lg p-3 text-sm"
                />
                <p className="text-xs text-zinc-500 mt-1">PDF, JPG veya PNG formatında kimlik doğrulama için</p>
              </div>
            </div>
          </div>
        )}

        {/* Adım 2: Gayrimenkul Bilgileri */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#C40001]">2️⃣ Gayrimenkul Bilgileri</h2>
            
            <select
              name="city"
              required
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">İl Seçin</option>
              <option>İstanbul (Avrupa)</option><option>İstanbul (Anadolu)</option><option>Ankara</option><option>İzmir</option>
              <option>Antalya</option><option>Bursa</option><option>Konya</option><option>Muğla</option>
              <option>Mersin</option><option>Adana</option><option>Samsun</option><option>Trabzon</option>
              <option>Gaziantep</option><option>Diyarbakır</option><option>Erzurum</option><option>Van</option>
            </select>

            <input
              name="district"
              required
              placeholder="İlçe"
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <input
              name="neighborhood"
              required
              placeholder="Mahalle"
              value={formData.neighborhood}
              onChange={(e) => handleInputChange('neighborhood', e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="address"
              placeholder="Adres (kısa açıklama)"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full border rounded-lg p-3 h-20"
            />
            <p className="text-xs text-zinc-500">Sitede gösterilmez, konum teyidi için.</p>

            <div>
              <label className="block text-sm font-medium mb-2">Site içerisinde mi?</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isInSite"
                    value="Evet"
                    checked={formData.isInSite === "Evet"}
                    onChange={(e) => handleInputChange('isInSite', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Evet</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isInSite"
                    value="Hayır"
                    checked={formData.isInSite === "Hayır"}
                    onChange={(e) => handleInputChange('isInSite', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Hayır</span>
                </label>
              </div>
            </div>

            {formData.isInSite === "Evet" && (
              <input
                name="siteName"
                placeholder="Site adı"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <input
                name="grossM2"
                required
                type="number"
                placeholder="Brüt m²"
                value={formData.grossM2}
                onChange={(e) => handleInputChange('grossM2', e.target.value)}
                className="border rounded-lg p-3"
              />
              <input
                name="netM2"
                required
                type="number"
                placeholder="Net m²"
                value={formData.netM2}
                onChange={(e) => handleInputChange('netM2', e.target.value)}
                className="border rounded-lg p-3"
              />
            </div>

            <select
              name="roomCount"
              required
              value={formData.roomCount}
              onChange={(e) => handleInputChange('roomCount', e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Oda Sayısı</option>
              <option>1+0</option><option>1+1</option><option>2+0</option><option>2+1</option>
              <option>3+0</option><option>3+1</option><option>4+0</option><option>4+1</option>
              <option>5+0</option><option>5+1</option><option>6+</option>
            </select>

            <select
              name="buildingAge"
              required
              value={formData.buildingAge}
              onChange={(e) => handleInputChange('buildingAge', e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Bina yaşı</option>
              <option>0–1</option><option>1–5</option><option>5–10</option><option>10–20</option><option>20+</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="floor"
                type="number"
                placeholder="Bulunduğu Kat"
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
                className="border rounded-lg p-3"
              />
              <input
                name="totalFloors"
                type="number"
                placeholder="Kat Sayısı (bina)"
                value={formData.totalFloors}
                onChange={(e) => handleInputChange('totalFloors', e.target.value)}
                className="border rounded-lg p-3"
              />
            </div>

            <select
              name="heatingType"
              value={formData.heatingType}
              onChange={(e) => handleInputChange('heatingType', e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Isıtma tipi</option>
              <option>Doğalgaz</option><option>Merkezi</option><option>Klima</option><option>Soba</option><option>Yok</option>
            </select>

            <select
              name="deedStatus"
              required
              value={formData.deedStatus}
              onChange={(e) => handleInputChange('deedStatus', e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Tapu durumu</option>
              <option>Kat Mülkiyeti</option><option>Kat İrtifakı</option><option>Hisseli</option><option>Diğer</option>
            </select>

            <div>
              <label className="block text-sm font-medium mb-2">Kullanım durumu</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="usageStatus"
                    value="Boş"
                    checked={formData.usageStatus === "Boş"}
                    onChange={(e) => handleInputChange('usageStatus', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Boş</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="usageStatus"
                    value="Kiracılı"
                    checked={formData.usageStatus === "Kiracılı"}
                    onChange={(e) => handleInputChange('usageStatus', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Kiracılı</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="usageStatus"
                    value="Mal sahibi oturuyor"
                    checked={formData.usageStatus === "Mal sahibi oturuyor"}
                    onChange={(e) => handleInputChange('usageStatus', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Mal sahibi oturuyor</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Eşya durumu</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="furnitureStatus"
                    value="Eşyalı"
                    checked={formData.furnitureStatus === "Eşyalı"}
                    onChange={(e) => handleInputChange('furnitureStatus', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Eşyalı</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="furnitureStatus"
                    value="Eşyasız"
                    checked={formData.furnitureStatus === "Eşyasız"}
                    onChange={(e) => handleInputChange('furnitureStatus', e.target.value)}
                    className="text-[#C40001]"
                  />
                  <span className="text-sm">Eşyasız</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Asansör var mı?</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasElevator"
                      value="Evet"
                      checked={formData.hasElevator === "Evet"}
                      onChange={(e) => handleInputChange('hasElevator', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Evet</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasElevator"
                      value="Hayır"
                      checked={formData.hasElevator === "Hayır"}
                      onChange={(e) => handleInputChange('hasElevator', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Hayır</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Otopark var mı?</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasParking"
                      value="Evet"
                      checked={formData.hasParking === "Evet"}
                      onChange={(e) => handleInputChange('hasParking', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Evet</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasParking"
                      value="Hayır"
                      checked={formData.hasParking === "Hayır"}
                      onChange={(e) => handleInputChange('hasParking', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Hayır</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasParking"
                      value="Kapalı"
                      checked={formData.hasParking === "Kapalı"}
                      onChange={(e) => handleInputChange('hasParking', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Kapalı</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Balkon var mı?</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasBalcony"
                      value="Evet"
                      checked={formData.hasBalcony === "Evet"}
                      onChange={(e) => handleInputChange('hasBalcony', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Evet</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hasBalcony"
                      value="Hayır"
                      checked={formData.hasBalcony === "Hayır"}
                      onChange={(e) => handleInputChange('hasBalcony', e.target.value)}
                      className="text-[#C40001]"
                    />
                    <span className="text-xs">Hayır</span>
                  </label>
                </div>
              </div>
            </div>

            <input
              name="view"
              placeholder="Manzara / Cephe"
              value={formData.view}
              onChange={(e) => handleInputChange('view', e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}

        {/* Adım 3: Finansal Bilgiler */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#C40001]">3️⃣ Finansal Bilgiler</h2>
            
            <div>
              <input
                name="salePrice"
                required
                type="number"
                placeholder="Satış fiyatı (TL)"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                className="w-full border rounded-lg p-3"
              />
              <p className="text-xs text-zinc-500 mt-1">
                ⚠️ Lütfen pazarlıksız, net satış fiyatını giriniz. Pazarlık payı veya tahmini değer içeren ilanlar değerlendirmeye alınmaz.
              </p>
            </div>

            {formData.usageStatus === "Kiracılı" && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Kira Durumu</h3>
                
                <input
                  name="monthlyRent"
                  required
                  type="number"
                  placeholder="Aylık kira bedeli (TL)"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
                <p className="text-xs text-zinc-500">
                  Lütfen gerçekçi bir kira tutarı giriniz. Bu değer, emsal kiralarla karşılaştırılacaktır.
                </p>

                <input
                  name="tenantProfession"
                  placeholder="Kiracı mesleği"
                  value={formData.tenantProfession}
                  onChange={(e) => handleInputChange('tenantProfession', e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
                <p className="text-xs text-zinc-500">Örnek: öğretmen, doktor, kamu personeli vb.</p>

                <div>
                  <label className="block text-sm font-medium mb-2">Kira ödemeleri düzenli mi?</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="regularRent"
                        value="Evet"
                        checked={formData.regularRent === "Evet"}
                        onChange={(e) => handleInputChange('regularRent', e.target.value)}
                        className="text-[#C40001]"
                      />
                      <span className="text-sm">Evet</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="regularRent"
                        value="Hayır"
                        checked={formData.regularRent === "Hayır"}
                        onChange={(e) => handleInputChange('regularRent', e.target.value)}
                        className="text-[#C40001]"
                      />
                      <span className="text-sm">Hayır</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Son 6 aylık ödeme dekontları (varsa)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full border rounded-lg p-3 text-sm"
                  />
                  <p className="text-xs text-zinc-500">
                    Son 6 aylık banka dekontlarını yükleyen ilanlar "Teyit Edilmiş Kiracı" etiketi alır ve yatırım skorunu artırır.
                  </p>
                </div>
              </div>
            )}

            {formData.usageStatus === "Boş" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Kira Potansiyeli</h3>
                
                <input
                  name="rentPotential"
                  required
                  type="number"
                  placeholder="Kira potansiyeli (TL)"
                  value={formData.rentPotential}
                  onChange={(e) => handleInputChange('rentPotential', e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
                <p className="text-xs text-zinc-500">
                  Lütfen gerçekçi bir değer giriniz. Bu bilgi ekibimiz tarafından kontrol edilecektir.
                </p>
                <p className="text-xs text-orange-600">
                  ⚠️ Kira getirisi veya potansiyeli, bölgesel emsallerle uyuşmazsa başvurunuz onaylanmayabilir.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Adım 4: Görseller */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#C40001]">4️⃣ Görseller</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Fotoğraf yükleme (max 10 adet)</label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                className="w-full border rounded-lg p-3 text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">
                En az 5, en fazla 10 fotoğraf. JPG veya PNG formatı.
              </p>
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Fotoğrafların net ve güncel olması gerekmektedir. Görseller ilan onayı öncesi kontrol edilir.
              </p>
            </div>
          </div>
        )}

        {/* Adım 5: Açıklama ve Ek Bilgiler */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#C40001]">5️⃣ Açıklama ve Ek Bilgiler</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Açıklama (min 200 karakter)</label>
              <textarea
                name="description"
                required
                placeholder="Evinizi kendi cümlelerinizle anlatın..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full border rounded-lg p-3 h-32"
              />
              <p className="text-xs text-zinc-500 mt-1">
                {formData.description.length}/200 karakter (minimum 200 karakter gerekli)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ek dosya (isteğe bağlı)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full border rounded-lg p-3 text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Tapu, proje, mimari plan vb. belgeler.
              </p>
            </div>
          </div>
        )}

        {/* Adım 6: Onaylar ve Aydınlatmalar */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#C40001]">6️⃣ Onaylar ve Aydınlatmalar</h2>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.dataProcessing}
                  onChange={(e) => handleInputChange('dataProcessing', e.target.checked)}
                  className="mt-1 text-[#C40001]"
                />
                <span className="text-sm">
                  <strong>✅ Veri işleme onayı:</strong> Kişisel verilerimin Yatırımlık Evler tarafından yalnızca başvurumun değerlendirilmesi amacıyla işlenmesine onay veriyorum.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.ownershipDeclaration}
                  onChange={(e) => handleInputChange('ownershipDeclaration', e.target.checked)}
                  className="mt-1 text-[#C40001]"
                />
                <span className="text-sm">
                  <strong>✅ Mülkiyet beyanı:</strong> Bu başvuruyu taşınmazın maliki olarak yapıyorum ve beyan ettiğim bilgilerin doğruluğunu onaylıyorum.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.exclusiveRight}
                  onChange={(e) => handleInputChange('exclusiveRight', e.target.checked)}
                  className="mt-1 text-[#C40001]"
                />
                <span className="text-sm">
                  <strong>✅ Tek yetki şartı bilgilendirmesi:</strong> Başvurum kabul edilirse satış süresi boyunca başka bir platformda ilan yayımlamayacağımı kabul ederim.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.serviceFee}
                  onChange={(e) => handleInputChange('serviceFee', e.target.checked)}
                  className="mt-1 text-[#C40001]"
                />
                <span className="text-sm">
                  <strong>✅ Hizmet bedeli onayı:</strong> Satış gerçekleşmesi halinde %2 + KDV hizmet bedeli uygulanacağını kabul ediyorum.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.freeApplication}
                  onChange={(e) => handleInputChange('freeApplication', e.target.checked)}
                  className="mt-1 text-[#C40001]"
                />
                <span className="text-sm">
                  <strong>✅ Ücretsiz başvuru ve sözleşme bilgilendirmesi:</strong> Bu başvurunun ücretsiz olduğunu, değerlendirmemin olumlu sonuçlanması halinde tarafımla 1 ay süreli tam yetki sözleşmesi yapılacağını, evimin yalnızca satılması durumunda %2 + KDV'lik bir hizmet bedeli ödeyeceğimi, satış gerçekleşmediği takdirde herhangi bir ödeme yapmayacağımı kabul ederim.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigasyon Butonları */}
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Geri
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid(currentStep)
                  ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              İleri →
            </button>
          ) : (
            <button
              type="submit"
              disabled={sending || !isStepValid(currentStep)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid(currentStep) && !sending
                  ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {sending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          )}
        </div>

        {err && <p className="text-red-600 text-sm text-center">{err}</p>}
      </form>
    </main>
  );
}

