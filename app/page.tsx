"use client";

import { useState } from "react";

export default function Home() {
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [hasSahibindenListing, setHasSahibindenListing] = useState<boolean | null>(null);
  const [listingNumber, setListingNumber] = useState("");
  const [acceptedCommission, setAcceptedCommission] = useState(false);

  // İlçe Temsilcisi form state'leri
  const [temsilciAdSoyad, setTemsilciAdSoyad] = useState("");
  const [temsilciFirma, setTemsilciFirma] = useState("");
  const [temsilciTelefonKodu, setTemsilciTelefonKodu] = useState("+90");
  const [temsilciTelefon, setTemsilciTelefon] = useState("");
  const [temsilciEmail, setTemsilciEmail] = useState("");
  const [temsilciIl, setTemsilciIl] = useState("");
  const [temsilciIlce, setTemsilciIlce] = useState("");
  const [temsilciBelgeNo, setTemsilciBelgeNo] = useState("");
  const [temsilciNot, setTemsilciNot] = useState("");
  const [temsilciKvkk, setTemsilciKvkk] = useState(false);
  const [temsilciPazarlama, setTemsilciPazarlama] = useState(false);
  const [temsilciSending, setTemsilciSending] = useState(false);
  const [temsilciSuccess, setTemsilciSuccess] = useState(false);
  const [temsilciError, setTemsilciError] = useState<string | null>(null);

  // Tüm Türkiye şehirleri - özel sıralama
  const cities = [
    "İstanbul (Avrupa)", "İstanbul (Anadolu)", "Ankara", "İzmir", "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Isparta", "Mersin",
    "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş",
    "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak",
    "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
    "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ];

  const toggleDetail = (id: string) => {
    setOpenDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Form validasyonu
  const isFormValid = () => {
    return selectedCity && selectedDistrict && hasSahibindenListing !== null && acceptedCommission && 
           (hasSahibindenListing === false || (hasSahibindenListing === true && listingNumber.length === 10));
  };

  // İlçe Temsilcisi form validasyonları
  const isTemsilciAdSoyadValid = temsilciAdSoyad.trim().length >= 2;
  const isTemsilciFirmaValid = temsilciFirma.trim().length >= 2;
  const getTemsilciTelefonMaxLength = () => {
    return 10; // Türkiye için sabit
  };
  const isTemsilciTelefonValid = temsilciTelefon.length === getTemsilciTelefonMaxLength();
  const isTemsilciEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(temsilciEmail);
  const isTemsilciBelgeNoValid = /^[0-9]{7}$/.test(temsilciBelgeNo);
  const isTemsilciFormValid = isTemsilciAdSoyadValid && isTemsilciFirmaValid && isTemsilciTelefonValid && isTemsilciEmailValid && 
                             temsilciIl && temsilciIlce && isTemsilciBelgeNoValid && temsilciKvkk;

  const getWhatsAppMessage = () => {
    let message = `Merhaba, ${selectedCity} - ${selectedDistrict} bölgesindeki evimi satmak istiyorum.`;
    
    if (hasSahibindenListing === true && listingNumber) {
      message += ` Sahibinden ilan numaram: ${listingNumber}`;
    }
    
    return message;
  };



  // İlçeler - tüm Türkiye ilçeleri
  const getDistricts = (city: string) => {
    const districts: Record<string, string[]> = {
      "Adana": ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "İmamoğlu", "Aladağ", "Yumurtalık", "Tufanbeyli", "Saimbeyli", "Pozantı", "Kozan", "Karataş", "Karaisalı", "Feke", "Ceyhan"],
      "Adıyaman": ["Merkez", "Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Samsat", "Sincik", "Tut"],
      "Afyonkarahisar": ["Merkez", "Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"],
      "Ağrı": ["Merkez", "Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Patnos", "Taşlıçay", "Tutak"],
      "Amasya": ["Merkez", "Göynücek", "Gümüşhacıköy", "Hamamözü", "Merzifon", "Suluova", "Taşova"],
      "Ankara": ["Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
      "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
      "Artvin": ["Ardanuç", "Arhavi", "Borçka", "Hopa", "Merkez", "Murgul", "Şavşat", "Yusufeli"],
      "Aydın": ["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"],
      "Balıkesir": ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"],
      "Bilecik": ["Bozüyük", "Gölpazarı", "İnhisar", "Merkez", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
      "Bingöl": ["Adaklı", "Genç", "Karlıova", "Kiğı", "Merkez", "Solhan", "Yayladere", "Yedisu"],
      "Bitlis": ["Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Merkez", "Mutki", "Tatvan"],
      "Bolu": ["Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Merkez", "Mudurnu", "Seben", "Yeniçağa"],
      "Burdur": ["Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar", "Karamanlı", "Kemer", "Merkez", "Tefenni", "Yeşilova"],
      "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
      "Çanakkale": ["Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Merkez", "Yenice"],
      "Çankırı": ["Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Merkez", "Orta", "Şabanözü", "Yapraklı"],
      "Çorum": ["Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Merkez", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
      "Denizli": ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkez", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"],
      "Diyarbakır": ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Merkez", "Silvan", "Sur", "Yenişehir"],
      "Edirne": ["Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Merkez", "Meriç", "Süloğlu", "Uzunköprü"],
      "Elazığ": ["Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Merkez", "Palu", "Sivrice"],
      "Erzincan": ["Çayırlı", "İliç", "Kemah", "Kemaliye", "Merkez", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü"],
      "Erzurum": ["Aşkale", "Aziziye", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Palandöken", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere", "Yakutiye"],
      "Eskişehir": ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"],
      "Gaziantep": ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
      "Giresun": ["Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Merkez", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
      "Gümüşhane": ["Kelkit", "Köse", "Kürtün", "Merkez", "Şiran", "Torul"],
      "Hakkâri": ["Çukurca", "Merkez", "Şemdinli", "Yüksekova"],
      "Hatay": ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağı", "Yayladağı"],
      "Isparta": ["Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Merkez", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
      "Mersin": ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
      "İstanbul (Avrupa)": ["Adalar", "Arnavutköy", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Eminönü", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kağıthane", "Küçükçekmece", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Zeytinburnu"],
      "İstanbul (Anadolu)": ["Ataşehir", "Beykoz", "Kadıköy", "Kartal", "Maltepe", "Pendik", "Tuzla", "Ümraniye", "Üsküdar"],
      "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
      "Kars": ["Arpaçay", "Digor", "Kağızman", "Merkez", "Sarıkamış", "Selim", "Susuz", "Akyaka"],
      "Kastamonu": ["Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Merkez", "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya", "Yapraklı"],
      "Kayseri": ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"],
      "Kırklareli": ["Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Merkez", "Pehlivanköy", "Pınarhisar", "Vize"],
      "Kırşehir": ["Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Merkez", "Mucur"],
      "Kocaeli": ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
      "Konya": ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
      "Kütahya": ["Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet", "Gediz", "Hisarcık", "Merkez", "Pazarlar", "Simav", "Şaphane", "Tavşanlı"],
      "Malatya": ["Akçadağ", "Arapgir", "Arguvan", "Battalgazi", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Merkez", "Pütürge", "Yazıhan", "Yeşilyurt"],
      "Manisa": ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Merkez", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
      "Kahramanmaraş": ["Afşin", "Andırın", "Çağlayancerit", "Dulkadiroğlu", "Ekinözü", "Elbistan", "Göksun", "Merkez", "Nurhak", "Onikişubat", "Pazarcık", "Türkoğlu"],
      "Mardin": ["Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Merkez", "Midyat", "Nusaybin", "Ömerli", "Savur", "Yeşilli"],
      "Muğla": ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
      "Muş": ["Bulanık", "Hasköy", "Korkut", "Malazgirt", "Merkez", "Varto"],
      "Nevşehir": ["Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Merkez", "Ürgüp"],
      "Niğde": ["Altunhisar", "Bor", "Çamardı", "Çiftlik", "Merkez", "Ulukışla"],
      "Ordu": ["Akkuş", "Altınordu", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy", "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru", "Mesudiye", "Merkez", "Perşembe", "Piraziz", "Ulubey", "Ünye"],
      "Rize": ["Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Merkez", "Pazar"],
      "Sakarya": ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"],
      "Samsun": ["19 Mayıs", "Alaçam", "Asarcık", "Atakum", "Ayvacık", "Bafra", "Canik", "Çarşamba", "Havza", "İlkadım", "Kavak", "Ladik", "Salıpazarı", "Tekkeköy", "Terme", "Vezirköprü", "Yakakent"],
      "Siirt": ["Baykan", "Eruh", "Kurtalan", "Merkez", "Pervari", "Şirvan", "Tillo"],
      "Sinop": ["Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Merkez", "Saraydüzü", "Türkeli"],
      "Sivas": ["Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova", "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Merkez", "Suşehri", "Şarkışla", "Ulaş", "Yıldızeli", "Zara"],
      "Tekirdağ": ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Şarköy", "Süleymanpaşa"],
      "Tokat": ["Almus", "Artova", "Başçiftlik", "Erbaa", "Merkez", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
      "Trabzon": ["Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Ortahisar", "Şalpazarı", "Sürmene", "Tonya", "Vakfıkebir", "Yomra"],
      "Tunceli": ["Çemişgezek", "Hozat", "Mazgirt", "Merkez", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
      "Şanlıurfa": ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Merkez", "Siverek", "Suruç", "Viranşehir"],
      "Uşak": ["Banaz", "Eşme", "Karahallı", "Merkez", "Sivaslı", "Ulubey"],
      "Van": ["Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Edremit", "Erciş", "Gevaş", "Gürpınar", "İpekyolu", "Merkez", "Muradiye", "Özalp", "Saray", "Tuşba"],
      "Yozgat": ["Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Merkez", "Saraykent", "Sarıkaya", "Şefaatli", "Sorgun", "Yenifakılı", "Yerköy"],
      "Zonguldak": ["Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey", "Kilimli", "Kozlu", "Merkez"],
      "Aksaray": ["Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Merkez", "Ortaköy", "Sarıyahşi", "Sultanhanı"],
      "Bayburt": ["Aydıntepe", "Demirözü", "Merkez"],
      "Karaman": ["Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Merkez", "Sarıveliler"],
      "Kırıkkale": ["Bahşili", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Merkez", "Sulakyurt", "Yahşihan"],
      "Batman": ["Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Merkez", "Sason"],
      "Şırnak": ["Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Merkez", "Silopi", "Uludere"],
      "Bartın": ["Amasra", "Kurucaşile", "Merkez", "Ulus"],
      "Ardahan": ["Çıldır", "Damal", "Göle", "Hanak", "Merkez", "Posof"],
      "Iğdır": ["Aralık", "Karakoyunlu", "Merkez", "Tuzluca"],
      "Yalova": ["Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Merkez", "Termal"],
      "Karabük": ["Eflani", "Eskipazar", "Merkez", "Ovacık", "Safranbolu", "Yenice"],
      "Kilis": ["Elbeyli", "Merkez", "Musabeyli", "Polateli"],
      "Osmaniye": ["Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Merkez", "Sumbas", "Toprakkale"],
      "Düzce": ["Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Merkez", "Yığılca"]
    };
    return districts[city] || [];
  };

  const handleTemsilciBasvuru = async (e: React.FormEvent) => {
    e.preventDefault();
    setTemsilciSending(true);
    setTemsilciError(null);

    try {
      const response = await fetch('/api/temsilci-basvuru', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adSoyad: temsilciAdSoyad,
          firma: temsilciFirma,
          telefon: `${temsilciTelefonKodu}${temsilciTelefon}`,
          email: temsilciEmail,
          il: temsilciIl,
          ilce: temsilciIlce,
          belgeNo: temsilciBelgeNo,
          not: temsilciNot,
          kvkk: temsilciKvkk,
          pazarlama: temsilciPazarlama,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setTemsilciSuccess(true);
        // Form alanlarını sıfırla
        setTemsilciAdSoyad("");
        setTemsilciFirma("");
        setTemsilciTelefonKodu("+90");
        setTemsilciTelefon("");
        setTemsilciEmail("");
        setTemsilciIl("");
        setTemsilciIlce("");
        setTemsilciBelgeNo("");
        setTemsilciNot("");
        setTemsilciKvkk(false);
        setTemsilciPazarlama(false);
      } else {
        setTemsilciError('Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      setTemsilciError('Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setTemsilciSending(false);
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
           {/* Evini Hızlı ve Güvenli Sat */}
          <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
            <button
              onClick={() => toggleDetail('satici')}
              className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.satici ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <span className="text-lg">Evini Bizimle Sat</span>
              </span>
              <span className={`transform transition-transform duration-200 ${openDetails.satici ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
             {openDetails.satici && (
               <div className="px-6 pb-6">
                 <div className="border-t border-[#C40001]/10 pt-4">
                   <p className="text-sm text-zinc-600 mb-4 text-justify">
                  Evinizi hızlı ve güvenli bir şekilde satmak için WhatsApp üzerinden bizimle iletişime geçin.
                </p>

                <div className="space-y-4">
                  {/* Şehir Seçimi */}
                         <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-2">
                      Şehir Seçiniz (Zorunlu) <span className="text-red-500">*</span>
                         </label>
                           <select
                      value={selectedCity}
                             onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedDistrict("");
                        setHasSahibindenListing(null);
                        setListingNumber("");
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white text-gray-900 font-medium"
                             required
                           >
                             <option value="">Şehir seçiniz</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                           </select>
                         </div>
                         
                         {/* İlçe Seçimi */}
                  {selectedCity && (
                           <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-2">
                        İlçe Seçiniz (Zorunlu) <span className="text-red-500">*</span>
                             </label>
                             <select
                               value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setHasSahibindenListing(null);
                          setListingNumber("");
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white text-gray-900 font-medium"
                               required
                             >
                               <option value="">İlçe seçiniz</option>
                        {getDistricts(selectedCity).map((district) => (
                          <option key={district} value={district}>{district}</option>
                               ))}
                             </select>
                           </div>
                         )}
                         
                  {/* Sahibinden İlan Sorusu */}
                  {selectedDistrict && (
                         <div>
                         <label className="block text-xs font-medium text-zinc-700 mb-2">
                        Sahibinden.com'da ilanınız var mı? <span className="text-red-500">*</span>
                         </label>
                      <div className="flex gap-6">
                        <label className="flex items-center">
                           <input
                            type="radio"
                            name="hasListing"
                            value="yes"
                            checked={hasSahibindenListing === true}
                            onChange={() => {
                              setHasSahibindenListing(true);
                              setListingNumber("");
                            }}
                            className="mr-3 h-5 w-5 text-gray-900 focus:ring-gray-900 border-gray-900 bg-white"
                          />
                          <span className="text-sm text-gray-900">Evet</span>
                         </label>
                        <label className="flex items-center">
                           <input 
                            type="radio"
                            name="hasListing"
                            value="no"
                            checked={hasSahibindenListing === false}
                            onChange={() => {
                              setHasSahibindenListing(false);
                              setListingNumber("");
                            }}
                            className="mr-3 h-5 w-5 text-gray-900 focus:ring-gray-900 border-gray-900 bg-white"
                          />
                          <span className="text-sm text-gray-900">Hayır</span>
                         </label>
                      </div>
                         </div>
                         )}
                         
                  {/* Sahibinden İlan No Girişi */}
                  {hasSahibindenListing === true && (
                         <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-2">
                        Sahibinden İlan Numarası (Zorunlu) <span className="text-red-500">*</span>
                             </label>
                             <div className="relative">
                               <input
                                 type="text"
                                 value={listingNumber}
                                 onChange={(e) => setListingNumber(e.target.value.replace(/\D/g, ''))}
                                 maxLength={10}
                                 placeholder="10 haneli ilan numarası"
                                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                                 required
                               />
                               <div className="absolute right-3 top-2 text-xs">
                                 {listingNumber.length === 10 ? (
                                   <span className="text-green-600">✓ Geçerli ilan numarası</span>
                                 ) : listingNumber.length > 0 ? (
                                   <span className="text-red-600">Geçersiz ilan numarası</span>
                                 ) : (
                                   <span className="text-gray-400">{listingNumber.length}/10</span>
                                 )}
                               </div>
                             </div>
                         </div>
                         )}
                         
                  {/* Komisyon Kabul */}
                  {selectedDistrict && (
                         <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-2">
                        Hizmet Şartları <span className="text-red-500">*</span>
                             </label>
                             <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                               <input
                                 type="checkbox"
                                 checked={acceptedCommission}
                                 onChange={(e) => setAcceptedCommission(e.target.checked)}
                                 className="mt-0.5"
                                 required
                               />
                               <span>Lütfen hizmet şartlarımızı kabul etmek için kutucuğu işaretleyiniz.</span>
                             </label>
                         </div>
                         )}
                         
                  {/* WhatsApp Butonu */}
                  {isFormValid() && (
                         <a
                           href={`https://wa.me/905407208080?text=${encodeURIComponent(getWhatsAppMessage())}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-full bg-[#C40001] hover:bg-[#C40001]/90 text-white text-center py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                         >
                           <span>📱</span>
                           <span>WhatsApp'tan Başvurunu Tamamla</span>
                         </a>
                         )}
                </div>
                
                {/* Sık Sorulan Sorular */}
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-zinc-800 mb-4">Sık Sorulan Sorular</h4>
                  <div className="space-y-3">
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        1. Siz emlakçı mısınız?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Hayır. Biz bir dijital pazarlama ajansıyız. Evinizi emlakçı değil, iyi pazarlama satar — biz de bu konuda oldukça iyiyiz.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        2. Hizmet bedeliniz nedir?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Sadece satış olursa %4 + KDV hizmet bedeli alınır. (Siz net satış rakamını belirlersiniz, eviniz %4 eklenmiş brüt satış fiyatı üzerinden pazarlanır) Alıcıdan hiçbir bedel alınmaz; bu da satışı hızlandırır ve şeffaflık sağlar.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        3. Süreç nasıl başlıyor?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Evinizi bize iletin, ekibimiz 48 saat içinde evinizi değerlendirsin. Uygun görülürse 3 ay süreli dijital pazarlama sözleşmesi imzalanır ve süreç başlar.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        4. Ne hizmeti veriyorsunuz?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Biz yalnızca dijital pazarlama ve müşteri yönlendirme hizmeti sunarız. Satış aracılığı yapmayız; tapu işlemleri ev sahibine aittir.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        5. Diğer ilanlarımı yayında tutabilir miyim?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Evet, bu sizin tercihinizdir. Ancak 3 ay boyunca Yatırımlık Evler evinizin dijital pazarlaması konusunda tek yetkili olur.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        6. Kabul kriterleri nelerdir?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Yalnızca yatırım değeri yüksek evler kabul edilir.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        7. Süreç gerçekten ücretsiz mi?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Evet. Değerlendirme, içerik hazırlığı ve pazarlama tamamen ücretsizdir. Yalnızca satış gerçekleştiğinde hizmet bedeli doğar. Bu süreçte satış olmazsa herhangi bir ücret ödemek zorunda kalmazsınız.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        8. Satış ne kadar sürer?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Kabul edilen evler genellikle 4 hafta içinde yatırımcı bulur.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        9. Satış süreci güvenli mi?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Evet. Potansiyel alıcılar size yönlendirilmeden önce gerekli kontroller hukuk departmanımız tarafından yapılır.
                      </div>
                    </details>
                    
                    <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                        10. Neden Yatırımlık Evler'i seçmeliyim?
                      </summary>
                      <div className="px-3 pb-3 text-sm text-zinc-600">
                        Çünkü biz 200 bin takipçi ve aylık 5 milyondan fazla görüntülenme ile emlak alanında Türkiye'nin en güçlü dijital görünürlüğüne sahibiz.
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
                <span className="text-lg">Gruplarımıza Katıl</span>
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

       {/* İlçe Temsilcisi */}
       <div className="border border-[#E7E9EC] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 bg-white">
         <button
           onClick={() => toggleDetail('temsilci')}
           className={`w-full text-left p-6 font-medium transition-colors duration-200 flex items-center justify-between ${openDetails.temsilci ? 'text-[#C40001]' : 'text-zinc-700 hover:text-[#C40001]'}`}
         >
           <span className="flex items-center gap-3">
             <span className="text-2xl ml-1">🤝</span>
             <span className="text-lg">İlçe Temsilcimiz Ol</span>
           </span>
           <span className={`transform transition-transform duration-200 ${openDetails.temsilci ? 'rotate-180' : ''}`}>
             ▼
           </span>
         </button>
         {openDetails.temsilci && (
           <div className="px-6 pb-6">
             <div className="border-t border-[#C40001]/10 pt-4">
               {/* İlçe Temsilcisi Şartları */}
               <div className="bg-gradient-to-r from-[#C40001]/5 to-[#C40001]/10 border border-[#C40001]/20 rounded-xl p-4 mb-6">
                 <h3 className="text-sm font-bold text-zinc-800 mb-3 flex items-center gap-2">
                   <span className="text-lg">🏙️</span>
                   İlçe Temsilcimiz Olmak İçin Gerekli Şartlar
                 </h3>
                 <div className="text-xs text-zinc-700 space-y-1">
                   <p>• Geçerli Taşınmaz Ticareti Yetki Belgesi'ne sahip olmak.</p>
                   <p>• Aktif bir emlak ofisine sahip olmak (fiziksel adres, vergi kaydı).</p>
                   <p>• Aşağıdaki il seçimi alanında yer alan 15 ildeki 50 ilçeden birinde faaliyet gösteriyor olmak.</p>
                 </div>
               </div>

               {/* Neden İlçe Temsilcimiz Olmalısınız */}
               <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-6">
                 <h3 className="text-sm font-bold text-zinc-800 mb-3 flex items-center gap-2">
                   <span className="text-lg">💼</span>
                   Neden İlçe Temsilcimiz Olmalısınız?
                 </h3>
                 <div className="text-xs text-zinc-700 space-y-2">
                   <div>
                     <p className="font-medium text-zinc-800">Hazır portföy ve müşteri trafiği</p>
                     <p>Sosyal medya ve yatırım platformlarımızdan gelen talepler, doğrudan size yönlendirilir.</p>
                   </div>
                   <div>
                     <p className="font-medium text-zinc-800">Marka gücü ve güven avantajı</p>
                     <p>Türkiye'nin ilk premium konut platformunun temsilcisi olarak bölgenizde güvenle öne çıkarsınız.</p>
                   </div>
                   <div>
                     <p className="font-medium text-zinc-800">Şeffaf kazanç ve sürdürülebilir iş modeli</p>
                     <p>Net komisyon oranlarıyla sürekli portföy akışı ve uzun vadeli kazanç elde edersiniz.</p>
                   </div>
                 </div>
               </div>
               
               {temsilciSuccess ? (
                 <div className="text-center py-8">
                   <div className="text-green-600 text-4xl mb-4">✅</div>
                   <h3 className="text-lg font-medium text-green-600 mb-2">Teşekkürler! Ön başvurunuz alındı.</h3>
                   <p className="text-sm text-zinc-600">48 saat içinde uygunluk değerlendirmesi yapıp sizinle iletişime geçeceğiz.</p>
                 </div>
               ) : (
                 <form onSubmit={handleTemsilciBasvuru} className="space-y-4">
                   {/* Ad Soyad */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       Ad Soyad <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       value={temsilciAdSoyad}
                       onChange={(e) => setTemsilciAdSoyad(e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       placeholder="Ad Soyad"
                       required
                     />
                     {temsilciAdSoyad && !isTemsilciAdSoyadValid && (
                       <p className="text-xs text-red-600 mt-1">En az 2 karakter olmalıdır</p>
                     )}
                   </div>

                   {/* Firma/Ofis Adı */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       Firma/Ofis Adı <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       value={temsilciFirma}
                       onChange={(e) => setTemsilciFirma(e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       placeholder="Firma/Ofis Adı"
                       required
                     />
                     {temsilciFirma && !isTemsilciFirmaValid && (
                       <p className="text-xs text-red-600 mt-1">En az 2 karakter olmalıdır</p>
                     )}
                   </div>

                   {/* Telefon */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       Telefon (WhatsApp) <span className="text-red-500">*</span>
                     </label>
                     <div className="flex gap-2">
                       <select
                         value={temsilciTelefonKodu}
                         onChange={(e) => setTemsilciTelefonKodu(e.target.value)}
                         className="w-32 sm:w-36 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       >
                         <option value="+90">+90 Türkiye</option>
                       </select>
                       <input
                         type="tel"
                         value={temsilciTelefon}
                         onChange={(e) => setTemsilciTelefon(e.target.value.replace(/\D/g, ''))}
                         className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                         placeholder="5xx xxx xx xx"
                         maxLength={getTemsilciTelefonMaxLength()}
                         required
                       />
                     </div>
                     {temsilciTelefon && !isTemsilciTelefonValid && (
                       <p className="text-xs text-red-600 mt-1">{getTemsilciTelefonMaxLength()} haneli telefon numarası giriniz</p>
                     )}
                   </div>

                   {/* E-posta */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       E-posta <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="email"
                       value={temsilciEmail}
                       onChange={(e) => setTemsilciEmail(e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       placeholder="ornek@email.com"
                       required
                     />
                     {temsilciEmail && !isTemsilciEmailValid && (
                       <p className="text-xs text-red-600 mt-1">Geçerli bir e-posta adresi giriniz</p>
                     )}
                   </div>

                   {/* İl */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       İl <span className="text-red-500">*</span>
                     </label>
                     <p className="text-xs text-zinc-500 mb-2">
                       Yalnızca listedeki 15 il 50 ilçede faaliyet gösteriyorsanız başvuru yapabilirsiniz.
                     </p>
                     <select
                       value={temsilciIl}
                       onChange={(e) => {
                         setTemsilciIl(e.target.value);
                         setTemsilciIlce(""); // İl değişince ilçeyi sıfırla
                       }}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       required
                     >
                       <option value="">İl seçiniz</option>
                       <option value="istanbul-avrupa">İstanbul (Avrupa)</option>
                       <option value="istanbul-anadolu">İstanbul (Anadolu)</option>
                       <option value="ankara">Ankara</option>
                       <option value="izmir">İzmir</option>
                       <option value="antalya">Antalya</option>
                       <option value="bursa">Bursa</option>
                       <option value="konya">Konya</option>
                       <option value="muğla">Muğla</option>
                       <option value="mersin">Mersin</option>
                       <option value="adana">Adana</option>
                       <option value="samsun">Samsun</option>
                       <option value="trabzon">Trabzon</option>
                       <option value="gaziantep">Gaziantep</option>
                       <option value="diyarbakır">Diyarbakır</option>
                       <option value="erzurum">Erzurum</option>
                       <option value="van">Van</option>
                     </select>
                   </div>

                   {/* İlçe */}
                   {temsilciIl && (
                     <div>
                       <label className="block text-xs font-medium text-zinc-700 mb-1">
                         İlçe <span className="text-red-500">*</span>
                       </label>
                       <select
                         value={temsilciIlce}
                         onChange={(e) => setTemsilciIlce(e.target.value)}
                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                         required
                       >
                         <option value="">İlçe seçiniz</option>
                         {getDistricts(temsilciIl).map((district) => (
                           <option key={district} value={district}>
                             {district}
                           </option>
                         ))}
                       </select>
                     </div>
                   )}

                   {/* Taşınmaz Ticareti Yetki Belgesi No */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       Taşınmaz Ticareti Yetki Belgesi No <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       value={temsilciBelgeNo}
                       onChange={(e) => setTemsilciBelgeNo(e.target.value.replace(/\D/g, ''))}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       placeholder="1234567"
                       maxLength={7}
                       required
                     />
                     <p className="text-xs text-zinc-500 mt-1">
                       Örn: 1234567 — Ticaret Bakanlığı Taşınmaz Ticareti Yetki Belgesi numaranız.
                     </p>
                     {temsilciBelgeNo && !isTemsilciBelgeNoValid && (
                       <p className="text-xs text-red-600 mt-1">7 haneli belge numarası giriniz</p>
                     )}
                   </div>

                   {/* Not/Mesaj */}
                   <div>
                     <label className="block text-xs font-medium text-zinc-700 mb-1">
                       Not/Mesaj (opsiyonel, 500 karakter)
                     </label>
                     <textarea
                       value={temsilciNot}
                       onChange={(e) => setTemsilciNot(e.target.value)}
                       className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C40001] bg-white"
                       placeholder="Lütfen sektördeki deneyimlerinizi kısaca anlatınız."
                       rows={3}
                       maxLength={500}
                     />
                     <p className="text-xs text-zinc-500 mt-1">
                       {temsilciNot.length}/500 karakter
                     </p>
                   </div>

                   {/* Onay Kutuları */}
                   <div className="space-y-3">
                     <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={temsilciKvkk}
                         onChange={(e) => setTemsilciKvkk(e.target.checked)}
                         className="mt-0.5"
                         required
                       />
                       <span>KVKK ve Ön Başvuru Koşulları'nı okudum. <span className="text-red-500">*</span></span>
                     </label>

                     <label className="flex items-start gap-2 text-xs text-zinc-700 cursor-pointer">
                       <input
                         type="checkbox"
                         checked={temsilciPazarlama}
                         onChange={(e) => setTemsilciPazarlama(e.target.checked)}
                         className="mt-0.5"
                       />
                       <span>Pazarlama iletişimi izni (opsiyonel)</span>
                     </label>
                   </div>

                   {/* Hata Mesajı */}
                   {temsilciError && (
                     <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                       <p className="text-sm text-red-600">{temsilciError}</p>
                     </div>
                   )}

                   {/* Gönder Butonu */}
                   <button
                     type="submit"
                     disabled={!isTemsilciFormValid || temsilciSending}
                     className={`w-full rounded-xl p-3 text-center font-medium transition-all duration-300 text-sm ${
                       isTemsilciFormValid && !temsilciSending
                         ? 'bg-[#C40001] text-white hover:bg-[#C40001]/90'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                   >
                     {temsilciSending ? 'Gönderiliyor...' : 'Ön Başvuru Gönder'}
                   </button>
                 </form>
               )}

               {/* Sık Sorulan Sorular */}
               <div className="mt-6">
                 <h4 className="font-medium text-sm text-zinc-800 mb-4">❓ Sık Sorulan Sorular</h4>
                 <div className="space-y-3">
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       1. İlçe temsilcisi olmak için hangi belge gerekiyor?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Ticaret Bakanlığı onaylı Taşınmaz Ticareti Yetki Belgesi zorunludur.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       2. Kendi emlak ofisim yoksa başvurabilir miyim?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Hayır. Aktif bir emlak ofisine ve fiziksel ofis adresine sahip olmanız gerekir.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       3. Başvuru nasıl yapılır?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → "İlçe Temsilciniz Olmak İstiyorum" formunu doldurarak online ön başvuru yapabilirsiniz.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       4. Komisyon oranları nedir?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Platformumuzun komisyon oranı konutun yatırım skoruna göre toplam komisyon oranı üzerinden %25 ile %50 arasında değişmektedir.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       5. Aynı ilçede birden fazla temsilci olabilir mi?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Hayır. Her ilçede yalnızca bir resmi temsilcilik verilir.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       6. Atanan ilanları başka platformlarda paylaşabilir miyim?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Hayır. Atanan portföyler yalnızca Yatırımlık Evler mobil uygulamasında yayınlanabilir.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       7. Müşteri trafiğini kim sağlar?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Tüm yatırımcı trafiği doğrudan Yatırımlık Evler mobil uygulaması üzerinden size yönlendirilir.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       8. Ödemeler nasıl yapılır?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Satış tamamlandığında, ev sahibi sözleşme gereği hizmet bedelini Yatırımlık Evler'e öder. Yatırımlık Evler, kendi payını ayırdıktan sonra kalan tutarı ilgili Yerel Temsilcilik hesabına aktarır.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       9. Komisyon oranı dışında ek ücret ödenir mi?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Hayır. Başvuru veya temsilcilik ücreti yoktur; yalnızca gerçekleşen satışlar üzerinden pay alınır.
                     </div>
                   </details>
                   
                   <details className="group border border-gray-200 rounded-lg open:border-l-4 open:border-[#C40001]">
                     <summary className="p-3 cursor-pointer text-sm font-medium text-zinc-700 hover:text-[#C40001] transition-colors">
                       10. Sözleşme hangi durumda feshedilebilir?
                     </summary>
                     <div className="px-3 pb-3 text-sm text-zinc-600">
                       → Taraflardan herhangi biri, dilediği zaman tek taraflı olarak sözleşmeyi feshedebilir. Fesih bildirimi yazılı veya e-posta yoluyla yapılır ve derhal geçerlilik kazanır.
                     </div>
                   </details>
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
                       Yatırımlık Evler, Türkiye'nin ilk premium konut platformudur. Amacımız, yatırımcıları doğru yatırımlık evlerle buluşturmaktır.
                     </p>
                     <p>
                       Platformumuzda yalnızca yatırım değeri yüksek evler yer alır. Aradığınız evi bizimle bulacağınıza eminiz.
                     </p>
                     <p>
                       Ev sahibiyseniz, evinizi güvenli ve hızlı satmak için "Evimi Satmak İstiyorum" sekmesinde yer alan başvuru formunu doldurabilirsiniz.
                     </p>
                     <p>
                       Başvurunuz kabul edilirse şanslısınız demektir. Çünkü evi emlakçı değil, iyi pazarlama satar — biz ise bu konuda oldukça iyiyiz. 😎
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
