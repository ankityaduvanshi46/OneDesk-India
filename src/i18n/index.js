import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      siteName: 'OneDesk India',
      tagline: 'Your one-stop guide to every Indian government service',
      disclaimer: 'This is an unofficial directory. We are not affiliated with the Government of India.',
      search: {
        placeholder: 'Search services in Hindi or English... (Ctrl+K)',
        placeholderShort: 'Search services...',
        noResults: 'No services found',
        noResultsHint: 'Try searching in Hindi or English. Example: "aadhaar", "voter id", "pan card"',
        trending: 'Trending searches',
        recent: 'Recent searches',
        suggestions: 'Suggestions',
        voiceSearch: 'Voice Search',
        listening: 'Listening...',
        results: 'results found'
      },
      nav: {
        home: 'Home',
        services: 'Services',
        wizard: 'Wizard',
        favourites: 'Favourites',
        scamCheck: 'Scam Check',
        quickLinks: 'Quick Links'
      },
      categories: {
        all: 'All Services',
        identity: 'Identity',
        transport: 'Transport',
        certificates: 'Certificates',
        'tax-finance': 'Tax & Finance',
        education: 'Education',
        health: 'Health',
        jobs: 'Jobs',
        'land-property': 'Land & Property',
        utilities: 'Utilities',
        grievance: 'Grievance'
      },
      serviceCard: {
        openWebsite: 'Open Official Website',
        verified: 'Verified Official',
        addFavourite: 'Add to favourites',
        removeFavourite: 'Remove from favourites',
        viewDetails: 'View Details',
        helpline: 'Helpline',
        fees: 'Fees',
        time: 'Time',
        share: 'Share'
      },
      detail: {
        whatIsIt: 'What is it?',
        documentsRequired: 'Documents Required',
        howToApply: 'How to Apply',
        fees: 'Fees & Time',
        helpline: 'Helpline',
        relatedServices: 'Related Services',
        shareService: 'Share this Service',
        copyLink: 'Copy Link',
        whatsapp: 'Share on WhatsApp',
        qrCode: 'Show QR Code',
        linkCopied: 'Link copied!'
      },
      wizard: {
        title: 'What Do I Need?',
        subtitle: 'Answer a few questions and we will find the right service for you',
        back: 'Back',
        next: 'Next',
        results: 'Recommended Services',
        restart: 'Start Over'
      },
      favourites: {
        title: 'My Favourites',
        empty: 'No favourites yet',
        emptyHint: 'Tap the heart icon on any service card to save it here'
      },
      quickLinks: {
        title: 'My Quick Links',
        empty: 'No quick links yet',
        emptyHint: 'Add services here for instant access',
        add: 'Add to Quick Links',
        remove: 'Remove',
        reorder: 'Drag to reorder'
      },
      scamCheck: {
        title: 'URL Safety Checker',
        subtitle: 'Paste any government website URL to verify it is official',
        placeholder: 'Paste URL here (e.g. https://uidai.gov.in)',
        check: 'Check URL',
        tips: 'How to spot fake government websites',
        tip1: 'Official sites use .gov.in, .nic.in, or .india.gov.in domains',
        tip2: 'Beware of sites that charge fees to "register" for free services',
        tip3: 'Government sites never ask for OTP over phone calls',
        tip4: 'Check for HTTPS padlock in browser address bar',
        tip5: 'Real government portals do not run WhatsApp ads asking for money',
        reportLink: 'Report a broken link'
      },
      settings: {
        theme: 'Theme',
        language: 'Language',
        fontSize: 'Font Size',
        state: 'My State',
        dark: 'Dark',
        light: 'Light',
        hindi: 'हिंदी',
        english: 'English'
      },
      footer: {
        disclaimer: 'Unofficial directory. Not affiliated with Govt. of India.',
        reportLink: 'Report a broken link',
        madeWith: 'Made with ❤️ for every Indian citizen'
      },
      hero: {
        title: 'One Desk for Every Indian Service',
        titleHi: 'हर सरकारी सेवा के लिए एक डेस्क',
        subtitle: 'Direct links to 80+ official government portals across India',
        servicesCount: 'official portals',
        categoriesCount: 'categories',
        statesCount: 'states & UTs',
        cta: 'Explore All Portals',
        wizardCta: 'Help me find what I need'
      },
      errors: {
        notFound: '404 – Page Not Found',
        notFoundHint: 'The page you are looking for does not exist.',
        goHome: 'Go to Home',
        errorBoundary: 'Something went wrong.',
        retry: 'Try Again'
      }
    }
  },
  hi: {
    translation: {
      siteName: 'वनडेस्क इंडिया',
      tagline: 'हर भारतीय सरकारी सेवा के लिए एक पड़ाव',
      disclaimer: 'यह एक अनौपचारिक डायरेक्टरी है। हम भारत सरकार से संबद्ध नहीं हैं।',
      search: {
        placeholder: 'हिंदी या अंग्रेज़ी में सेवाएं खोजें... (Ctrl+K)',
        placeholderShort: 'सेवाएं खोजें...',
        noResults: 'कोई सेवा नहीं मिली',
        noResultsHint: 'हिंदी या अंग्रेज़ी में खोजें। उदाहरण: "आधार", "voter id", "pan card"',
        trending: 'ट्रेंडिंग खोजें',
        recent: 'हाल की खोजें',
        suggestions: 'सुझाव',
        voiceSearch: 'वॉयस सर्च',
        listening: 'सुन रहा है...',
        results: 'परिणाम मिले'
      },
      nav: {
        home: 'होम',
        services: 'सेवाएं',
        wizard: 'विज़ार्ड',
        favourites: 'पसंदीदा',
        scamCheck: 'स्कैम जांच',
        quickLinks: 'त्वरित लिंक'
      },
      categories: {
        all: 'सभी सेवाएं',
        identity: 'पहचान',
        transport: 'परिवहन',
        certificates: 'प्रमाण पत्र',
        'tax-finance': 'कर और वित्त',
        education: 'शिक्षा',
        health: 'स्वास्थ्य',
        jobs: 'नौकरी',
        'land-property': 'जमीन और संपत्ति',
        utilities: 'सुविधाएं',
        grievance: 'शिकायत'
      },
      serviceCard: {
        openWebsite: 'आधिकारिक वेबसाइट खोलें',
        verified: 'सत्यापित आधिकारिक',
        addFavourite: 'पसंदीदा में जोड़ें',
        removeFavourite: 'पसंदीदा से हटाएं',
        viewDetails: 'विवरण देखें',
        helpline: 'हेल्पलाइन',
        fees: 'शुल्क',
        time: 'समय',
        share: 'साझा करें'
      },
      detail: {
        whatIsIt: 'यह क्या है?',
        documentsRequired: 'आवश्यक दस्तावेज़',
        howToApply: 'आवेदन कैसे करें',
        fees: 'शुल्क और समय',
        helpline: 'हेल्पलाइन',
        relatedServices: 'संबंधित सेवाएं',
        shareService: 'सेवा साझा करें',
        copyLink: 'लिंक कॉपी करें',
        whatsapp: 'WhatsApp पर साझा करें',
        qrCode: 'QR कोड दिखाएं',
        linkCopied: 'लिंक कॉपी हो गया!'
      },
      wizard: {
        title: 'मुझे क्या चाहिए?',
        subtitle: 'कुछ सवालों के जवाब दें और हम आपके लिए सही सेवा खोजेंगे',
        back: 'वापस',
        next: 'अगला',
        results: 'अनुशंसित सेवाएं',
        restart: 'फिर से शुरू करें'
      },
      favourites: {
        title: 'मेरे पसंदीदा',
        empty: 'अभी कोई पसंदीदा नहीं',
        emptyHint: 'किसी भी सेवा कार्ड पर दिल का आइकन टैप करके यहां सहेजें'
      },
      quickLinks: {
        title: 'मेरे त्वरित लिंक',
        empty: 'अभी कोई त्वरित लिंक नहीं',
        emptyHint: 'तुरंत पहुंच के लिए यहां सेवाएं जोड़ें',
        add: 'त्वरित लिंक में जोड़ें',
        remove: 'हटाएं',
        reorder: 'पुनः क्रमबद्ध करने के लिए खींचें'
      },
      scamCheck: {
        title: 'URL सुरक्षा जांचकर्ता',
        subtitle: 'किसी भी सरकारी वेबसाइट URL को पेस्ट करके सत्यापित करें',
        placeholder: 'URL यहां पेस्ट करें (जैसे https://uidai.gov.in)',
        check: 'URL जांचें',
        tips: 'नकली सरकारी वेबसाइटें कैसे पहचानें',
        tip1: 'आधिकारिक साइटें .gov.in, .nic.in, या .india.gov.in डोमेन का उपयोग करती हैं',
        tip2: 'उन साइटों से सावधान रहें जो मुफ़्त सेवाओं के लिए शुल्क लेती हैं',
        tip3: 'सरकारी साइटें कभी भी फोन कॉल पर OTP नहीं मांगतीं',
        tip4: 'ब्राउज़र एड्रेस बार में HTTPS पैडलॉक जांचें',
        tip5: 'असली सरकारी पोर्टल पैसे मांगने वाले WhatsApp विज्ञापन नहीं चलाते',
        reportLink: 'टूटा हुआ लिंक रिपोर्ट करें'
      },
      settings: {
        theme: 'थीम',
        language: 'भाषा',
        fontSize: 'फ़ॉन्ट आकार',
        state: 'मेरा राज्य',
        dark: 'डार्क',
        light: 'लाइट',
        hindi: 'हिंदी',
        english: 'English'
      },
      footer: {
        disclaimer: 'अनौपचारिक डायरेक्टरी। भारत सरकार से संबद्ध नहीं।',
        reportLink: 'टूटा हुआ लिंक रिपोर्ट करें',
        madeWith: 'हर भारतीय नागरिक के लिए ❤️ से बनाया गया'
      },
      hero: {
        title: 'हर सरकारी सेवा के लिए एक डेस्क',
        titleHi: 'हर सरकारी सेवा के लिए एक डेस्क',
        subtitle: 'पूरे भारत में 80+ आधिकारिक सरकारी पोर्टल के सीधे लिंक',
        servicesCount: 'आधिकारिक पोर्टल',
        categoriesCount: 'श्रेणियां',
        statesCount: 'राज्य व केंद्र शासित',
        cta: 'सभी पोर्टल देखें',
        wizardCta: 'मुझे सही सेवा खोजने में मदद करें'
      },
      errors: {
        notFound: '404 – पृष्ठ नहीं मिला',
        notFoundHint: 'आप जो पृष्ठ खोज रहे हैं वह मौजूद नहीं है।',
        goHome: 'होम पर जाएं',
        errorBoundary: 'कुछ गलत हो गया।',
        retry: 'फिर कोशिश करें'
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
