// Comments and Video Controls JavaScript

let comments = [];
let currentSpeed = 1.0;
let isMuted = false;
let micActive = false;
let handRaised = false;

// Initialize comments and video controls
document.addEventListener('DOMContentLoaded', () => {
  loadComments();
  initializeVideoControls();
  
  // Character counter for comment input
  const commentInput = document.getElementById('commentInput');
  if (commentInput) {
    commentInput.addEventListener('input', () => {
      const charCount = document.getElementById('charCount');
      if (charCount) {
        charCount.textContent = commentInput.value.length;
      }
    });
  }
  
  // Load sample comments
  loadSampleComments();
});

// Load comments from localStorage
function loadComments() {
  const saved = localStorage.getItem('liveComments');
  if (saved) {
    comments = JSON.parse(saved);
    renderComments();
  }
}

// Save comments to localStorage
function saveComments() {
  localStorage.setItem('liveComments', JSON.stringify(comments));
}

// Post a comment
function postComment() {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('post comments')) {
    return;
  }
  
  const input = document.getElementById('commentInput');
  if (!input || !input.value.trim()) return;
  
  const comment = {
    id: Date.now(),
    author: 'You',
    avatar: 'https://ui-avatars.com/api/?name=You&background=30364F&color=fff&size=64',
    text: input.value.trim(),
    time: new Date(),
    likes: 0,
    liked: false
  };
  
  comments.unshift(comment);
  saveComments();
  renderComments();
  
  input.value = '';
  document.getElementById('charCount').textContent = '0';
  
  showToast('Comment posted! 💬');
}

// Load sample comments
function loadSampleComments() {
  if (comments.length > 0) return;
  
  const sampleComments = [
    {
      id: 1,
      author: 'Marie Uwase',
      avatar: 'https://ui-avatars.com/api/?name=Marie+Uwase&background=667eea&color=fff&size=64',
      text: 'Great deals! Just ordered 5 items 🛒',
      time: new Date(Date.now() - 5 * 60000),
      likes: 12,
      liked: false
    },
    {
      id: 2,
      author: 'Patrick Nkusi',
      avatar: 'https://ui-avatars.com/api/?name=Patrick+Nkusi&background=764ba2&color=fff&size=64',
      text: 'The quality of these products is amazing! Highly recommend 👍',
      time: new Date(Date.now() - 15 * 60000),
      likes: 8,
      liked: false
    },
    {
      id: 3,
      author: 'Grace Mutesi',
      avatar: 'https://ui-avatars.com/api/?name=Grace+Mutesi&background=f093fb&color=fff&size=64',
      text: 'Can you show more details about the cooking oil?',
      time: new Date(Date.now() - 25 * 60000),
      likes: 5,
      liked: false
    },
    {
      id: 4,
      author: 'Jean Claude',
      avatar: 'https://ui-avatars.com/api/?name=Jean+Claude&background=4facfe&color=fff&size=64',
      text: 'Fast delivery last time. Ordering again! 🚚',
      time: new Date(Date.now() - 35 * 60000),
      likes: 15,
      liked: false
    }
  ];
  
  comments = sampleComments;
  saveComments();
  renderComments();
}

// Render comments
function renderComments() {
  const container = document.getElementById('commentsList');
  const countEl = document.getElementById('commentCount');
  
  if (!container) return;
  
  if (countEl) {
    countEl.textContent = comments.length;
  }
  
  if (comments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-light);">
        <i class="fas fa-comment-slash" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No comments yet. Be the first to comment!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = comments.map(comment => `
    <div class="comment-item">
      <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          <span class="comment-time">${formatTimeAgo(comment.time)}</span>
        </div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
        <div class="comment-actions-bar">
          <button class="comment-action-btn ${comment.liked ? 'liked' : ''}" onclick="likeComment(${comment.id})">
            <i class="fas fa-heart"></i>
            <span>${comment.likes}</span>
          </button>
          <button class="comment-action-btn" onclick="replyToComment(${comment.id})">
            <i class="fas fa-reply"></i>
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Like a comment
function likeComment(commentId) {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('like comments')) {
    return;
  }
  
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return;
  
  if (comment.liked) {
    comment.likes--;
    comment.liked = false;
  } else {
    comment.likes++;
    comment.liked = true;
  }
  
  saveComments();
  renderComments();
}

// Reply to comment
function replyToComment(commentId) {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('reply to comments')) {
    return;
  }
  
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return;
  
  const input = document.getElementById('commentInput');
  if (input) {
    input.value = `@${comment.author} `;
    input.focus();
  }
}

// Sort comments
function sortComments() {
  const sortBy = document.getElementById('commentSort').value;
  
  if (sortBy === 'recent') {
    comments.sort((a, b) => new Date(b.time) - new Date(a.time));
  } else if (sortBy === 'popular') {
    comments.sort((a, b) => b.likes - a.likes);
  }
  
  renderComments();
}

// Format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== VIDEO CONTROLS ==========

function initializeVideoControls() {
  const video = document.getElementById('liveVideo');
  if (!video) return;
  
  // Update progress bar
  video.addEventListener('timeupdate', () => {
    const progress = (video.currentTime / video.duration) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
    
    // Update time display
    const timeEl = document.getElementById('videoTime');
    if (timeEl) {
      timeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  });
  
  // Update play/pause button
  video.addEventListener('play', () => {
    const btn = document.getElementById('playPauseBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
  });
  
  video.addEventListener('pause', () => {
    const btn = document.getElementById('playPauseBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
  });
}

// Toggle play/pause
function togglePlayPause() {
  const video = document.getElementById('liveVideo');
  if (!video) return;
  
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Change playback speed
function changeSpeed(delta) {
  const video = document.getElementById('liveVideo');
  if (!video) return;
  
  currentSpeed += delta;
  currentSpeed = Math.max(0.25, Math.min(2.0, currentSpeed));
  video.playbackRate = currentSpeed;
  
  const indicator = document.getElementById('speedIndicator');
  if (indicator) {
    indicator.textContent = currentSpeed.toFixed(2) + 'x';
  }
  
  showToast(`Speed: ${currentSpeed.toFixed(2)}x`);
}

// Toggle mute
function toggleMute() {
  const video = document.getElementById('liveVideo');
  const btn = document.getElementById('muteBtn');
  if (!video || !btn) return;
  
  isMuted = !isMuted;
  video.muted = isMuted;
  
  btn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
}

// Change volume
function changeVolume(value) {
  const video = document.getElementById('liveVideo');
  if (!video) return;
  
  video.volume = value / 100;
  
  const btn = document.getElementById('muteBtn');
  if (btn) {
    if (value == 0) {
      btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (value < 50) {
      btn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
      btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }
}

// Seek video
function seekVideo(event) {
  const video = document.getElementById('liveVideo');
  const container = event.currentTarget;
  if (!video || !container) return;
  
  const rect = container.getBoundingClientRect();
  const pos = (event.clientX - rect.left) / rect.width;
  video.currentTime = pos * video.duration;
}

// Toggle subtitles
function toggleSubtitles() {
  const video = document.getElementById('liveVideo');
  const btn = document.getElementById('subtitlesBtn');
  if (!video || !btn) return;
  
  const tracks = video.textTracks;
  if (tracks.length > 0) {
    const track = tracks[0];
    if (track.mode === 'showing') {
      track.mode = 'hidden';
      btn.style.opacity = '0.5';
      showToast('Subtitles off');
    } else {
      track.mode = 'showing';
      btn.style.opacity = '1';
      showToast('Subtitles on');
    }
  }
}

// Toggle fullscreen
function toggleFullscreen() {
  const player = document.querySelector('.video-player');
  if (!player) return;
  
  if (!document.fullscreenElement) {
    player.requestFullscreen().catch(err => {
      console.error('Fullscreen error:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

// Format time
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========== INTERACTION FEATURES ==========

// Toggle microphone
function toggleMic() {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('request microphone')) {
    return;
  }
  
  micActive = !micActive;
  const btn = document.getElementById('micBtn');
  
  if (micActive) {
    btn.classList.add('active');
    showToast('🎤 Mic request sent to host');
    
    // Simulate host response after 3 seconds
    setTimeout(() => {
      showToast('Host will respond to your request soon');
    }, 3000);
  } else {
    btn.classList.remove('active');
    showToast('Mic request cancelled');
  }
}

// Raise hand
function raiseHand() {
  // Check if user is logged in
  if (typeof requireLoginForAction === 'function' && !requireLoginForAction('raise hand')) {
    return;
  }
  
  handRaised = !handRaised;
  const btn = document.getElementById('handBtn');
  
  if (handRaised) {
    btn.classList.add('active');
    showToast('✋ Hand raised! Host has been notified');
    
    // Auto lower hand after 30 seconds
    setTimeout(() => {
      if (handRaised) {
        handRaised = false;
        btn.classList.remove('active');
        showToast('Hand lowered automatically');
      }
    }, 30000);
  } else {
    btn.classList.remove('active');
    showToast('Hand lowered');
  }
}

// Close advertisement
function closeAd() {
  const ad = document.getElementById('adBanner');
  if (ad) {
    ad.style.display = 'none';
    localStorage.setItem('adClosed', 'true');
  }
}

// Check if ad should be shown
document.addEventListener('DOMContentLoaded', () => {
  const adClosed = localStorage.getItem('adClosed');
  const ad = document.getElementById('adBanner');
  
  if (adClosed === 'true' && ad) {
    ad.style.display = 'none';
  }
});

// Make functions global
window.postComment = postComment;
window.likeComment = likeComment;
window.replyToComment = replyToComment;
window.sortComments = sortComments;
window.togglePlayPause = togglePlayPause;
window.changeSpeed = changeSpeed;
window.toggleMute = toggleMute;
window.changeVolume = changeVolume;
window.seekVideo = seekVideo;
window.toggleSubtitles = toggleSubtitles;
window.toggleFullscreen = toggleFullscreen;
window.toggleMic = toggleMic;
window.raiseHand = raiseHand;
window.closeAd = closeAd;
