# 🎥 Live Selling Feature - Simba Supermarket

## Overview
The Live Selling feature allows sales agents to broadcast live video sessions where they showcase products, interact with customers in real-time, and drive instant purchases.

## 📁 File Structure

```
live-selling/
├── index.html              # Customer viewing page
├── studio.html             # Sales agent broadcast studio
├── schedule.html           # Live session schedule
├── css/
│   ├── live-selling.css    # Customer view styles
│   ├── studio.css          # Studio styles
│   └── schedule.css        # Schedule page styles
├── js/
│   ├── live-viewer.js      # Customer viewing logic
│   ├── live-studio.js      # Broadcasting logic
│   ├── live-chat.js        # Real-time chat
│   └── live-products.js    # Product showcase
└── README.md               # This file
```

## 🎯 Features

### For Customers (Viewers)
- ✅ Watch live video streams
- ✅ Real-time chat with host and other viewers
- ✅ Send reactions (hearts, fire, clap, etc.)
- ✅ View featured products during stream
- ✅ Quick "Add to Cart" buttons
- ✅ See live viewer count
- ✅ Browse all products in sidebar
- ✅ Mobile responsive

### For Sales Agents (Broadcasters)
- ✅ Start/stop live streams
- ✅ Camera and microphone controls
- ✅ Screen sharing option
- ✅ Feature products during stream
- ✅ Pin products to show on screen
- ✅ Monitor live chat
- ✅ Real-time analytics (viewers, orders, revenue)
- ✅ Product search and management

### Schedule Page
- ✅ View live sessions currently streaming
- ✅ See upcoming scheduled sessions
- ✅ Browse past recordings
- ✅ Set reminders for upcoming sessions
- ✅ Follow favorite hosts

## 🚀 Getting Started

### Access the Pages

1. **Customer View (Watch Live)**
   ```
   http://localhost/simbaonlineshopping/live-selling/index.html
   ```

2. **Sales Agent Studio**
   ```
   http://localhost/simbaonlineshopping/live-selling/studio.html
   ```

3. **Schedule Page**
   ```
   http://localhost/simbaonlineshopping/live-selling/schedule.html
   ```

### Quick Start Guide

#### For Customers:
1. Open `index.html`
2. Watch the live stream
3. Chat with other viewers
4. Click products to add to cart
5. Send reactions to interact

#### For Sales Agents:
1. Open `studio.html`
2. Click "Start Live Stream"
3. Add products to feature
4. Pin products to show on stream
5. Monitor chat and analytics
6. Click "End Stream" when done

## 🎨 Current Implementation

### Demo Mode (Current)
- Uses sample video for demonstration
- Simulated chat messages
- Mock analytics data
- Works without any API keys
- Perfect for testing UI/UX

### What's Working:
✅ Complete UI/UX
✅ Responsive design
✅ Chat simulation
✅ Product showcase
✅ Reactions system
✅ Analytics dashboard
✅ Theme support (light/dark)
✅ Integration with main Simba system

## 🔧 Upgrading to Real Streaming

### Option 1: Agora.io (Recommended)

**Why Agora?**
- Professional quality
- Low latency (< 400ms)
- Works well in Africa/Rwanda
- Free tier: 10,000 minutes/month
- Easy integration

**Setup Steps:**

1. **Create Agora Account**
   - Go to https://www.agora.io
   - Sign up for free account
   - Create a new project
   - Get your App ID

2. **Install Agora SDK**
   ```html
   <!-- Add to index.html and studio.html -->
   <script src="https://download.agora.io/sdk/release/AgoraRTC_N-4.19.0.js"></script>
   ```

3. **Create Configuration File**
   ```javascript
   // js/agora-config.js
   const agoraConfig = {
     appId: 'YOUR_AGORA_APP_ID',
     channel: 'simba-live-channel',
     token: null // Use token for production
   };
   ```

4. **Update live-studio.js**
   ```javascript
   // Replace toggleCamera() function
   async function toggleCamera() {
     if (!isCameraOn) {
       // Initialize Agora
       const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
       await client.join(agoraConfig.appId, agoraConfig.channel, null, null);
       
       // Create local tracks
       const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
       await client.publish(localTracks);
       
       // Play local video
       localTracks[1].play("previewVideo");
       isCameraOn = true;
     }
   }
   ```

5. **Update live-viewer.js**
   ```javascript
   // Add to DOMContentLoaded
   const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
   client.setClientRole("audience");
   await client.join(agoraConfig.appId, agoraConfig.channel, null, null);
   
   client.on("user-published", async (user, mediaType) => {
     await client.subscribe(user, mediaType);
     if (mediaType === "video") {
       user.videoTrack.play("liveVideo");
     }
   });
   ```

### Option 2: WebRTC + Socket.io (Custom)

**Pros:**
- Free (no monthly costs)
- Full control
- No viewer limits

**Cons:**
- More complex setup
- Need Node.js server
- Bandwidth costs

**Setup Steps:**

1. **Install Dependencies**
   ```bash
   npm install socket.io express peer
   ```

2. **Create Server**
   ```javascript
   // server.js
   const express = require('express');
   const app = express();
   const server = require('http').createServer(app);
   const io = require('socket.io')(server);
   
   io.on('connection', (socket) => {
     socket.on('join-room', (roomId) => {
       socket.join(roomId);
       socket.to(roomId).emit('user-connected');
     });
     
     socket.on('offer', (data) => {
       socket.to(data.room).emit('offer', data.offer);
     });
     
     socket.on('answer', (data) => {
       socket.to(data.room).emit('answer', data.answer);
     });
   });
   
   server.listen(3000);
   ```

3. **Update Frontend**
   - Use PeerJS for WebRTC connections
   - Connect to Socket.io server
   - Handle offer/answer exchange

## 💡 Features to Add

### Phase 2 (Next Steps):
- [ ] Real video streaming (Agora.io)
- [ ] Backend API for chat persistence
- [ ] Recording and replay functionality
- [ ] Push notifications for live starts
- [ ] Payment during live (instant checkout)
- [ ] Host authentication
- [ ] Scheduled sessions management

### Phase 3 (Advanced):
- [ ] Multi-host support
- [ ] Co-hosting feature
- [ ] Live polls and quizzes
- [ ] Exclusive deals for live viewers
- [ ] Loyalty points for watching
- [ ] Share to social media
- [ ] Picture-in-picture mode
- [ ] Virtual gifts/tips for hosts

## 📊 Analytics Tracking

Current analytics tracked:
- Live viewer count
- Total viewers (peak)
- Orders during stream
- Revenue generated
- Reactions received
- Chat engagement

## 🎨 Customization

### Change Colors
Edit CSS variables in `css/live-selling.css`:
```css
.live-indicator {
  background: #ff4444; /* Change live badge color */
}
```

### Add More Reactions
Edit `live-viewer.js`:
```javascript
const icons = {
  heart: '❤️',
  fire: '🔥',
  clap: '👏',
  star: '⭐', // Add new reaction
};
```

### Customize Chat Messages
Edit `live-chat.js`:
```javascript
const chatMessages = [
  { user: 'Your Name', text: 'Your message', delay: 2000 },
  // Add more messages
];
```

## 🔒 Security Considerations

For production deployment:

1. **Use Agora Tokens**
   - Generate tokens server-side
   - Set expiration times
   - Validate user permissions

2. **Authenticate Hosts**
   - Only verified users can broadcast
   - Check permissions before streaming

3. **Moderate Chat**
   - Filter inappropriate content
   - Ban/mute users if needed
   - Rate limiting

4. **Secure API Endpoints**
   - Use HTTPS
   - Validate all inputs
   - Implement CORS properly

## 📱 Mobile Optimization

Already implemented:
- Responsive design
- Touch-friendly controls
- Mobile-optimized video player
- Swipe gestures support
- Reduced data usage

## 🌐 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## 💰 Cost Estimation

### Agora.io Pricing:
- Free: 10,000 minutes/month
- After: $0.99 per 1,000 minutes
- Example: 100 viewers × 1 hour = 100 minutes = $0.10

### Bandwidth (if self-hosting):
- 1 hour stream @ 720p = ~1GB upload
- 100 viewers = ~100GB download
- Cost varies by hosting provider

## 🆘 Troubleshooting

### Video not playing?
- Check browser permissions
- Ensure HTTPS (required for camera access)
- Try different browser

### Chat not working?
- Check console for errors
- Verify JavaScript is enabled
- Clear browser cache

### Products not loading?
- Ensure `simba_products.json` exists
- Check file path in JavaScript
- Verify localStorage has cached products

## 📞 Support

For questions or issues:
- Check console logs (F12)
- Review this documentation
- Test in different browsers

## 🎉 Success Tips

1. **Test before going live**
   - Check camera and mic
   - Test with friends first
   - Prepare product list

2. **Engage viewers**
   - Respond to chat messages
   - Show products clearly
   - Offer exclusive deals

3. **Promote sessions**
   - Announce on social media
   - Send notifications
   - Create excitement

4. **Track performance**
   - Monitor analytics
   - Note peak times
   - Improve based on data

## 📝 License

Part of Simba Supermarket e-commerce platform.
© 2025 Simba Supermarket. All rights reserved.

---

**Built with ❤️ for Rwanda's favorite online supermarket**
