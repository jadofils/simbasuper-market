// AI Language Translator for Live Selling
// Supports: English, French, Kinyarwanda

const translations = {
  // Common phrases
  common: {
    en: {
      welcome: "Welcome to the live!",
      thanks: "Thank you!",
      hello: "Hello",
      goodbye: "Goodbye",
      yes: "Yes",
      no: "No",
      please: "Please",
      sorry: "Sorry",
      help: "Help"
    },
    fr: {
      welcome: "Bienvenue en direct!",
      thanks: "Merci!",
      hello: "Bonjour",
      goodbye: "Au revoir",
      yes: "Oui",
      no: "Non",
      please: "S'il vous plaît",
      sorry: "Désolé",
      help: "Aide"
    },
    rw: {
      welcome: "Murakaza neza kuri live!",
      thanks: "Murakoze!",
      hello: "Muraho",
      goodbye: "Murabeho",
      yes: "Yego",
      no: "Oya",
      please: "Nyamuneka",
      sorry: "Mbabarira",
      help: "Ubufasha"
    }
  },
  
  // Shopping phrases
  shopping: {
    en: {
      "add to cart": "add to cart",
      "buy now": "buy now",
      "how much": "how much",
      "price": "price",
      "discount": "discount",
      "delivery": "delivery",
      "payment": "payment",
      "order": "order",
      "available": "available",
      "out of stock": "out of stock"
    },
    fr: {
      "add to cart": "ajouter au panier",
      "buy now": "acheter maintenant",
      "how much": "combien",
      "price": "prix",
      "discount": "réduction",
      "delivery": "livraison",
      "payment": "paiement",
      "order": "commande",
      "available": "disponible",
      "out of stock": "rupture de stock"
    },
    rw: {
      "add to cart": "shyira mu gitebo",
      "buy now": "gura ubu",
      "how much": "ni angahe",
      "price": "igiciro",
      "discount": "igabanuka",
      "delivery": "gutanga",
      "payment": "kwishyura",
      "order": "gutumiza",
      "available": "birahari",
      "out of stock": "byarangiye"
    }
  }
};

// Translation dictionary (expanded)
const dictionary = {
  // English to French
  en_fr: {
    "hello": "bonjour",
    "hi": "salut",
    "thank you": "merci",
    "thanks": "merci",
    "good": "bon",
    "great": "super",
    "amazing": "incroyable",
    "beautiful": "beau",
    "love": "amour",
    "like": "aimer",
    "want": "vouloir",
    "need": "besoin",
    "buy": "acheter",
    "price": "prix",
    "how much": "combien",
    "cheap": "pas cher",
    "expensive": "cher",
    "discount": "réduction",
    "sale": "vente",
    "delivery": "livraison",
    "fast": "rapide",
    "quality": "qualité",
    "product": "produit",
    "available": "disponible",
    "yes": "oui",
    "no": "non",
    "please": "s'il vous plaît",
    "sorry": "désolé",
    "welcome": "bienvenue"
  },
  
  // English to Kinyarwanda
  en_rw: {
    "hello": "muraho",
    "hi": "muraho",
    "thank you": "murakoze",
    "thanks": "murakoze",
    "good": "byiza",
    "great": "byiza cyane",
    "amazing": "bitangaje",
    "beautiful": "nziza",
    "love": "gukunda",
    "like": "gukunda",
    "want": "gushaka",
    "need": "gukeneye",
    "buy": "kugura",
    "price": "igiciro",
    "how much": "ni angahe",
    "cheap": "bihendutse",
    "expensive": "bihenze",
    "discount": "igabanuka",
    "sale": "kugurisha",
    "delivery": "gutanga",
    "fast": "byihuse",
    "quality": "ireme",
    "product": "ibicuruzwa",
    "available": "birahari",
    "yes": "yego",
    "no": "oya",
    "please": "nyamuneka",
    "sorry": "mbabarira",
    "welcome": "murakaza neza"
  },
  
  // French to English
  fr_en: {
    "bonjour": "hello",
    "salut": "hi",
    "merci": "thank you",
    "bon": "good",
    "super": "great",
    "incroyable": "amazing",
    "beau": "beautiful",
    "amour": "love",
    "aimer": "like",
    "vouloir": "want",
    "besoin": "need",
    "acheter": "buy",
    "prix": "price",
    "combien": "how much",
    "pas cher": "cheap",
    "cher": "expensive",
    "réduction": "discount",
    "vente": "sale",
    "livraison": "delivery",
    "rapide": "fast",
    "qualité": "quality",
    "produit": "product",
    "disponible": "available",
    "oui": "yes",
    "non": "no",
    "s'il vous plaît": "please",
    "désolé": "sorry",
    "bienvenue": "welcome"
  },
  
  // Kinyarwanda to English
  rw_en: {
    "muraho": "hello",
    "murakoze": "thank you",
    "byiza": "good",
    "byiza cyane": "great",
    "bitangaje": "amazing",
    "nziza": "beautiful",
    "gukunda": "love",
    "gushaka": "want",
    "gukeneye": "need",
    "kugura": "buy",
    "igiciro": "price",
    "ni angahe": "how much",
    "bihendutse": "cheap",
    "bihenze": "expensive",
    "igabanuka": "discount",
    "kugurisha": "sale",
    "gutanga": "delivery",
    "byihuse": "fast",
    "ireme": "quality",
    "ibicuruzwa": "product",
    "birahari": "available",
    "yego": "yes",
    "oya": "no",
    "nyamuneka": "please",
    "mbabarira": "sorry",
    "murakaza neza": "welcome"
  }
};

// User's preferred language
let userLanguage = localStorage.getItem('language') || 'en';

// Detect language of text
function detectLanguage(text) {
  const lowerText = text.toLowerCase();
  
  // Check for Kinyarwanda keywords
  const rwKeywords = ['muraho', 'murakoze', 'byiza', 'yego', 'oya', 'nyamuneka', 'murakaza'];
  if (rwKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'rw';
  }
  
  // Check for French keywords
  const frKeywords = ['bonjour', 'merci', 'oui', 'non', 'bienvenue', 'salut'];
  if (frKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
}

// Translate text
function translateText(text, fromLang, toLang) {
  if (fromLang === toLang) {
    return text;
  }
  
  const dictKey = `${fromLang}_${toLang}`;
  const dict = dictionary[dictKey];
  
  if (!dict) {
    return text; // No translation available
  }
  
  let translated = text;
  const lowerText = text.toLowerCase();
  
  // Try to translate word by word
  Object.keys(dict).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translated = translated.replace(regex, dict[key]);
  });
  
  return translated;
}

// Translate with Web API (Google Translate API simulation)
async function translateWithAPI(text, fromLang, toLang) {
  // In production, use real API like:
  // - Google Cloud Translation API
  // - Microsoft Translator API
  // - DeepL API
  
  // For demo, use dictionary translation
  return translateText(text, fromLang, toLang);
}

// Auto-translate chat message
function autoTranslateChatMessage(message, originalLang) {
  const targetLang = userLanguage;
  
  if (originalLang === targetLang) {
    return {
      translated: message,
      showOriginal: false
    };
  }
  
  const translated = translateText(message, originalLang, targetLang);
  
  return {
    translated: translated,
    original: message,
    showOriginal: translated !== message,
    originalLang: originalLang,
    targetLang: targetLang
  };
}

// Get language name
function getLanguageName(code) {
  const names = {
    en: 'English',
    fr: 'Français',
    rw: 'Ikinyarwanda'
  };
  return names[code] || code;
}

// Get language flag
function getLanguageFlag(code) {
  const flags = {
    en: '🇬🇧',
    fr: '🇫🇷',
    rw: '🇷🇼'
  };
  return flags[code] || '🌐';
}

// Format translated message for display
function formatTranslatedMessage(user, messageData, time) {
  const flag = getLanguageFlag(messageData.originalLang || 'en');
  
  let html = `
    <div class="chat-message">
      <div class="chat-user">
        ${flag} ${user}
        ${messageData.showOriginal ? `<span class="translation-badge">Translated</span>` : ''}
      </div>
      <div class="chat-text">${messageData.translated}</div>
  `;
  
  if (messageData.showOriginal) {
    html += `
      <div class="original-text">
        <small>Original (${getLanguageName(messageData.originalLang)}): ${messageData.original}</small>
      </div>
    `;
  }
  
  html += `
      <div class="chat-time">${time}</div>
    </div>
  `;
  
  return html;
}

// Live captions/subtitles for host speech
let captionsEnabled = false;
let currentCaption = '';

// Speech recognition for live captions
let speechRecognition = null;

function initializeLiveCaptions() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.log('Speech recognition not supported');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = 'en-US'; // Host's language
  
  speechRecognition.onresult = function(event) {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    
    // Detect language and translate
    const detectedLang = detectLanguage(transcript);
    const translated = translateText(transcript, detectedLang, userLanguage);
    
    displayCaption(translated);
  };
  
  speechRecognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
  };
}

function toggleCaptions() {
  captionsEnabled = !captionsEnabled;
  
  if (captionsEnabled) {
    if (speechRecognition) {
      speechRecognition.start();
    }
    showToast('Live captions enabled');
  } else {
    if (speechRecognition) {
      speechRecognition.stop();
    }
    hideCaption();
    showToast('Live captions disabled');
  }
  
  return captionsEnabled;
}

function displayCaption(text) {
  let captionEl = document.getElementById('liveCaptions');
  
  if (!captionEl) {
    captionEl = document.createElement('div');
    captionEl.id = 'liveCaptions';
    captionEl.className = 'live-captions';
    document.querySelector('.video-player').appendChild(captionEl);
  }
  
  captionEl.textContent = text;
  captionEl.style.display = 'block';
  
  // Auto-hide after 5 seconds of no speech
  clearTimeout(window.captionTimeout);
  window.captionTimeout = setTimeout(() => {
    hideCaption();
  }, 5000);
}

function hideCaption() {
  const captionEl = document.getElementById('liveCaptions');
  if (captionEl) {
    captionEl.style.display = 'none';
  }
}

// Change user's preferred language
function changeUserLanguage(lang) {
  userLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Reload chat messages with new language
  reloadChatWithTranslation();
  
  showToast(`Language changed to ${getLanguageName(lang)} ${getLanguageFlag(lang)}`);
}

// Reload chat messages with translation
function reloadChatWithTranslation() {
  // This would re-render all chat messages with new translation
  console.log('Reloading chat with language:', userLanguage);
}

// Export functions
window.translateText = translateText;
window.autoTranslateChatMessage = autoTranslateChatMessage;
window.detectLanguage = detectLanguage;
window.formatTranslatedMessage = formatTranslatedMessage;
window.changeUserLanguage = changeUserLanguage;
window.toggleCaptions = toggleCaptions;
window.initializeLiveCaptions = initializeLiveCaptions;
window.getLanguageFlag = getLanguageFlag;
window.getLanguageName = getLanguageName;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  console.log('AI Language Translator initialized');
  console.log('User language:', userLanguage);
  
  // Initialize live captions
  initializeLiveCaptions();
});
