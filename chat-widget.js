// Live Chat Widget - Include this on any page with <script src="chat-widget.js"></script>

(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .simba-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', sans-serif; }
    .simba-chat-button { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #30364F, #E1D9BC); color: white; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; transition: all 0.3s; position: relative; }
    .simba-chat-button:hover { transform: scale(1.1); }
    .simba-chat-badge { position: absolute; top: -5px; right: -5px; background: #ff4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
    .simba-chat-window { position: fixed; bottom: 90px; right: 20px; width: 380px; height: 550px; background: var(--card-bg, #fff); border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); display: none; flex-direction: column; overflow: hidden; border: 2px solid var(--border, #e0e0e0); }
    .simba-chat-window.open { display: flex; animation: slideUp 0.3s; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .simba-chat-header { background: linear-gradient(135deg, #30364F, #E1D9BC); color: white; padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
    .simba-chat-body { flex: 1; padding: 1rem; overflow-y: auto; background: var(--bg, #f5f5f5); }
    .simba-chat-message { margin-bottom: 1rem; display: flex; gap: 0.5rem; animation: fadeIn 0.3s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .simba-chat-message.bot { justify-content: flex-start; }
    .simba-chat-message.user { justify-content: flex-end; }
    .simba-message-bubble { max-width: 70%; padding: 0.75rem 1rem; border-radius: 12px; word-wrap: break-word; }
    .bot .simba-message-bubble { background: var(--surface, #fff); color: var(--text, #333); border-bottom-left-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .user .simba-message-bubble { background: #E1D9BC; color: #30364F; border-bottom-right-radius: 4px; }
    .simba-chat-footer { padding: 1rem; background: var(--card-bg, #fff); border-top: 2px solid var(--border, #e0e0e0); display: flex; gap: 0.5rem; }
    .simba-chat-input { flex: 1; padding: 0.75rem; border: 2px solid var(--border, #e0e0e0); border-radius: 25px; background: var(--bg, #f5f5f5); color: var(--text, #333); outline: none; }
    .simba-send-btn { width: 40px; height: 40px; border-radius: 50%; background: #E1D9BC; color: #30364F; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
    .simba-send-btn:hover { background: #30364F; color: white; }
    .simba-quick-replies { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
    .simba-quick-reply { padding: 0.5rem 1rem; background: var(--surface, #fff); border: 2px solid var(--border, #e0e0e0); border-radius: 20px; cursor: pointer; font-size: 0.85rem; color: var(--text, #333); transition: all 0.3s; }
    .simba-quick-reply:hover { background: #E1D9BC; color: #30364F; border-color: #E1D9BC; }
    .simba-typing-indicator { display: flex; gap: 4px; padding: 0.75rem 1rem; }
    .simba-typing-dot { width: 8px; height: 8px; background: #999; border-radius: 50%; animation: typing 1.4s infinite; }
    .simba-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .simba-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
    @media (max-width: 768px) {
      .simba-chat-window { width: calc(100vw - 40px); height: calc(100vh - 120px); }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const widget = document.createElement('div');
  widget.className = 'simba-chat-widget';
  widget.innerHTML = `
    <div class="simba-chat-window" id="simbaChatWindow">
      <div class="simba-chat-header">
        <div>
          <h3 style="margin: 0; font-size: 1.1rem;">Simba Support</h3>
          <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">Online now</p>
        </div>
        <button onclick="window.SimbaChat.close()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="simba-chat-body" id="simbaChatBody">
        <div class="simba-chat-message bot">
          <div class="simba-message-bubble">
            <strong>Simba Support</strong>
            <p style="margin: 0.5rem 0 0 0;">Hello! 👋 How can we help you today?</p>
            <div class="simba-quick-replies">
              <div class="simba-quick-reply" onclick="window.SimbaChat.sendQuick('Track my order')">📦 Track Order</div>
              <div class="simba-quick-reply" onclick="window.SimbaChat.sendQuick('Payment issue')">💳 Payment</div>
              <div class="simba-quick-reply" onclick="window.SimbaChat.sendQuick('Product question')">🛍️ Products</div>
              <div class="simba-quick-reply" onclick="window.SimbaChat.sendQuick('Delivery time')">🚚 Delivery</div>
            </div>
          </div>
        </div>
      </div>
      <div class="simba-chat-footer">
        <input type="text" class="simba-chat-input" id="simbaChatInput" placeholder="Type your message..." onkeypress="if(event.key==='Enter') window.SimbaChat.send()">
        <button class="simba-send-btn" onclick="window.SimbaChat.send()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
    <button class="simba-chat-button" onclick="window.SimbaChat.toggle()">
      <i class="fas fa-comments"></i>
      <span class="simba-chat-badge" id="simbaChatBadge" style="display: none;">1</span>
    </button>
  `;
  document.body.appendChild(widget);

  // Chat functionality
  window.SimbaChat = {
    responses: {
      'track': 'To track your order, please provide your order reference number (e.g., ORD-12345). You can find it in your order confirmation.',
      'payment': 'For payment issues: 1) Check your MoMo balance 2) Verify your PIN 3) Ensure your number is registered. Need more help?',
      'product': 'I can help with product info! Tell me which product you\'re interested in, or browse our catalog.',
      'delivery': 'Delivery times: Kigali 2-4 hours | Outside Kigali 1-2 days. Choose your time slot at checkout!',
      'return': 'Return products within 7 days. Items must be unused in original packaging. Contact us with your order number.',
      'points': 'Earn 1 point per 100 RWF spent! Refer friends for 500 bonus points. Visit Rewards page to redeem.',
      'default': 'Thanks for your message! A support agent will respond shortly. Urgent? Call +250 788 000 000.'
    },

    toggle() {
      const window = document.getElementById('simbaChatWindow');
      window.classList.toggle('open');
      if (window.classList.contains('open')) {
        document.getElementById('simbaChatBadge').style.display = 'none';
      }
    },

    close() {
      document.getElementById('simbaChatWindow').classList.remove('open');
    },

    send() {
      const input = document.getElementById('simbaChatInput');
      const message = input.value.trim();
      if (!message) return;
      
      this.addMessage(message, 'user');
      input.value = '';
      
      setTimeout(() => {
        this.showTyping();
        setTimeout(() => {
          this.hideTyping();
          const response = this.getResponse(message);
          this.addMessage(response, 'bot');
        }, 1500);
      }, 500);
    },

    sendQuick(message) {
      this.addMessage(message, 'user');
      setTimeout(() => {
        this.showTyping();
        setTimeout(() => {
          this.hideTyping();
          const response = this.getResponse(message);
          this.addMessage(response, 'bot');
        }, 1500);
      }, 500);
    },

    addMessage(text, sender) {
      const body = document.getElementById('simbaChatBody');
      const div = document.createElement('div');
      div.className = `simba-chat-message ${sender}`;
      
      const bubble = document.createElement('div');
      bubble.className = 'simba-message-bubble';
      bubble.innerHTML = sender === 'bot' ? `<strong>Simba Support</strong><p style="margin: 0.5rem 0 0 0;">${text}</p>` : text;
      
      div.appendChild(bubble);
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    },

    showTyping() {
      const body = document.getElementById('simbaChatBody');
      const div = document.createElement('div');
      div.className = 'simba-chat-message bot';
      div.id = 'simbaTyping';
      div.innerHTML = `
        <div class="simba-message-bubble">
          <div class="simba-typing-indicator">
            <div class="simba-typing-dot"></div>
            <div class="simba-typing-dot"></div>
            <div class="simba-typing-dot"></div>
          </div>
        </div>
      `;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    },

    hideTyping() {
      const typing = document.getElementById('simbaTyping');
      if (typing) typing.remove();
    },

    getResponse(message) {
      const msg = message.toLowerCase();
      if (msg.includes('track') || msg.includes('order')) return this.responses.track;
      if (msg.includes('payment') || msg.includes('momo')) return this.responses.payment;
      if (msg.includes('product') || msg.includes('item')) return this.responses.product;
      if (msg.includes('delivery') || msg.includes('shipping')) return this.responses.delivery;
      if (msg.includes('return') || msg.includes('refund')) return this.responses.return;
      if (msg.includes('point') || msg.includes('reward')) return this.responses.points;
      return this.responses.default;
    }
  };

  // Show badge after 5 seconds
  setTimeout(() => {
    document.getElementById('simbaChatBadge').style.display = 'flex';
  }, 5000);
})();
