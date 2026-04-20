// Live Chat JavaScript
const chatMessages = {
  en: [
    { user: 'Sarah K.', text: 'This looks amazing!', delay: 2000 },
    { user: 'Patrick N.', text: 'Do you have more colors?', delay: 8000 },
    { user: 'David K.', text: 'Can I pay with MoMo?', delay: 12000 },
    { user: 'Emma W.', text: 'Great deals today!', delay: 18000 },
    { user: 'Peter K.', text: 'How much discount?', delay: 28000 }
  ],
  fr: [
    { user: 'Jean P.', text: 'Combien coûte le lait?', delay: 4000 },
    { user: 'Marie T.', text: 'J\'adore ce produit!', delay: 10000 },
    { user: 'Bob M.', text: 'Quand est la prochaine session?', delay: 16000 },
    { user: 'Sophie D.', text: 'C\'est combien la livraison?', delay: 22000 },
    { user: 'Claire B.', text: 'Je veux acheter maintenant', delay: 26000 }
  ],
  rw: [
    { user: 'Grace M.', text: 'Murakoze! Byiza cyane!', delay: 6000 },
    { user: 'Alice R.', text: 'Byashyizwe mu gitebo!', delay: 14000 },
    { user: 'Frank L.', text: 'Gutanga kuri Huye birahari?', delay: 20000 },
    { user: 'John M.', text: 'Ni byiza cyane!', delay: 24000 },
    { user: 'Diane U.', text: 'Murakoze cyane!', delay: 30000 }
  ]
};

let chatIndex = 0;
let chatInterval = null;

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
  startChatSimulation();
});

// Start chat simulation
function startChatSimulation() {
  // Get user's selected language
  const userLang = localStorage.getItem('language') || 'en';
  
  // Add initial host message in user's language
  const hostMessages = {
    en: 'Hey everyone! Welcome to the live!',
    fr: 'Salut tout le monde! Bienvenue en direct!',
    rw: 'Muraho mwese! Murakaza neza kuri live!'
  };
  
  setTimeout(() => {
    addChatMessage('Host', hostMessages[userLang], true, userLang);
  }, 1000);
  
  // Start random messages in user's language only
  chatInterval = setInterval(() => {
    if (Math.random() > 0.3) { // 70% chance to add message
      const langMessages = chatMessages[userLang] || chatMessages.en;
      const randomMsg = langMessages[Math.floor(Math.random() * langMessages.length)];
      addChatMessage(randomMsg.user, randomMsg.text, false, userLang);
    }
  }, 5000);
}

// Add chat message with language parameter
function addChatMessage(user, text, isHost = false, messageLang = 'en') {
  const chatContainer = document.getElementById('chatMessages');
  if (!chatContainer) return;
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message';
  
  const flag = window.getLanguageFlag ? window.getLanguageFlag(messageLang) : '';
  
  messageDiv.innerHTML = `
    <div class="chat-user" style="${isHost ? 'color: #ff4444;' : ''}">
      ${flag} ${user}${isHost ? ' 🎤' : ''}
    </div>
    <div class="chat-text">${text}</div>
    <div class="chat-time">${timeStr}</div>
  `;
  
  chatContainer.appendChild(messageDiv);
  
  // Auto-scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Keep only last 50 messages
  const messages = chatContainer.querySelectorAll('.chat-message');
  if (messages.length > 50) {
    messages[0].remove();
  }
}

// Send message
function sendMessage() {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('send chat messages')) {
    return;
  }
  
  const input = document.getElementById('chatInput');
  if (!input) return;
  
  const text = input.value.trim();
  if (!text) return;
  
  // Get user name from localStorage or use default
  const userName = localStorage.getItem('userName') || 'You';
  
  // Detect language of user's message
  const userLang = localStorage.getItem('language') || 'en';
  
  addChatMessage(userName, text, false, userLang);
  input.value = '';
  
  // Simulate host response sometimes
  if (Math.random() > 0.7) {
    setTimeout(() => {
      const responses = {
        en: [
          'Thanks for your question!',
          'Great choice!',
          'Yes, we have that in stock!',
          'I\'ll check that for you!',
          'Absolutely!'
        ],
        fr: [
          'Merci pour votre question!',
          'Excellent choix!',
          'Oui, nous avons cela en stock!',
          'Je vérifie pour vous!',
          'Absolument!'
        ],
        rw: [
          'Murakoze kubaza!',
          'Hitamo nziza!',
          'Yego, tubifite!',
          'Nzakureba!',
          'Yego rwose!'
        ]
      };
      const langResponses = responses[userLang] || responses.en;
      const randomResponse = langResponses[Math.floor(Math.random() * langResponses.length)];
      addChatMessage('Host', randomResponse, true, userLang);
    }, 2000);
  }
}

// Stop chat simulation (when leaving page)
window.addEventListener('beforeunload', () => {
  if (chatInterval) {
    clearInterval(chatInterval);
  }
});

// Reload chat when language changes
window.addEventListener('storage', (e) => {
  if (e.key === 'language') {
    // Clear existing messages
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
      chatContainer.innerHTML = '';
    }
    // Restart chat with new language
    if (chatInterval) {
      clearInterval(chatInterval);
    }
    startChatSimulation();
  }
});
