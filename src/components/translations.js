// Available languages configuration
export const languages = [
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'JP', name: '日本語', flag: '🇯🇵' },
  { code: 'KR', name: '한국어', flag: '🇰🇷' },
  { code: 'CN', name: '中文', flag: '🇨🇳' }
];

// Translations for all text content
export const translations = {
  EN: {
    nav: {
      about: "ABOUT"
    },
    hero: {
      title: "Step Into The\nStories Of The\nNation's Greatest",
      description: "ExhibitGo Offers You The Virtual Tour Of All The Nations Greatest With The Comfort Of Your Home Or Any Of Your Spaces.",
      explore: "Explore"
    },
    carousel: {
      gallery1: "Gallery Exhibition",
      gallery2: "Museum Statue"
    }
  },
  ES: {
    nav: {
      about: "ACERCA DE"
    },
    hero: {
      title: "Adéntrate En Las\nHistorias De Los Más\nGrandes De La Nación",
      description: "ExhibitGo Te Ofrece El Tour Virtual De Todos Los Más Grandes De La Nación Con La Comodidad De Tu Hogar O Cualquiera De Tus Espacios.",
      explore: "Explorar"
    },
    carousel: {
      gallery1: "Exposición de Galería",
      gallery2: "Estatua del Museo"
    }
  },
  FR: {
    nav: {
      about: "À PROPOS"
    },
    hero: {
      title: "Plongez Dans Les\nHistoires Des Plus\nGrands De La Nation",
      description: "ExhibitGo Vous Offre La Visite Virtuelle De Tous Les Plus Grands De La Nation Avec Le Confort De Votre Foyer.",
      explore: "Explorer"
    },
    carousel: {
      gallery1: "Exposition de Galerie",
      gallery2: "Statue du Musée"
    }
  },
  DE: {
    nav: {
      about: "ÜBER UNS"
    },
    hero: {
      title: "Tauchen Sie Ein In Die\nGeschichten Der Größten\nDer Nation",
      description: "ExhibitGo Bietet Ihnen Die Virtuelle Tour Aller Größten Der Nation Mit Dem Komfort Ihres Zuhauses.",
      explore: "Entdecken"
    },
    carousel: {
      gallery1: "Galerie-Ausstellung",
      gallery2: "Museums-Statue"
    }
  },
  IT: {
    nav: {
      about: "CHI SIAMO"
    },
    hero: {
      title: "Immergiti Nelle\nStorie Dei Più\nGrandi Della Nazione",
      description: "ExhibitGo Ti Offre Il Tour Virtuale Di Tutti I Più Grandi Della Nazione Con Il Comfort Di Casa Tua.",
      explore: "Esplora"
    },
    carousel: {
      gallery1: "Mostra della Galleria",
      gallery2: "Statua del Museo"
    }
  },
  JP: {
    nav: {
      about: "概要"
    },
    hero: {
      title: "国家最高の\n物語に\n足を踏み入れよう",
      description: "ExhibitGoは、ご自宅や任意の場所で、国家最高のバーチャルツアーを提供します。",
      explore: "探索する"
    },
    carousel: {
      gallery1: "ギャラリー展示",
      gallery2: "博物館の彫像"
    }
  },
  KR: {
    nav: {
      about: "소개"
    },
    hero: {
      title: "국가 최고의\n이야기 속으로\n들어가세요",
      description: "ExhibitGo는 집이나 어느 공간에서든 편안하게 국가 최고의 가상 투어를 제공합니다.",
      explore: "탐험하기"
    },
    carousel: {
      gallery1: "갤러리 전시",
      gallery2: "박물관 조각상"
    }
  },
  CN: {
    nav: {
      about: "关于"
    },
    hero: {
      title: "踏入国家\n最伟大的\n故事",
      description: "ExhibitGo为您提供国家最伟大展品的虚拟游览，让您在家中或任何空间都能舒适体验。",
      explore: "探索"
    },
    carousel: {
      gallery1: "画廊展览",
      gallery2: "博物馆雕像"
    }
  }
};

// Helper function to get translation with fallback
export const getTranslation = (languageCode, path) => {
  const keys = path.split('.');
  let translation = translations[languageCode];
  
  for (const key of keys) {
    if (translation && translation[key] !== undefined) {
      translation = translation[key];
    } else {
      // Fallback to English if translation not found
      translation = translations['EN'];
      for (const fallbackKey of keys) {
        if (translation && translation[fallbackKey] !== undefined) {
          translation = translation[fallbackKey];
        }
      }
      break;
    }
  }
  
  return translation || path;
};