// Live Advertisement Display JavaScript

let currentAd = null;
let adTimer = null;
let adTimeRemaining = 0;

// Initialize ad display
document.addEventListener('DOMContentLoaded', () => {
  // Load sample ads if none exist
  loadSampleAdsIfNeeded();
  
  // Start showing ads after 10 seconds
  setTimeout(() => {
    showNextAd();
  }, 10000);
  
  // Show ads every 2 minutes
  setInterval(() => {
    showNextAd();
  }, 120000); // 2 minutes
});

// Load sample ads if none exist
function loadSampleAdsIfNeeded() {
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  
  // If no ads exist, load sample ads
  if (adRequests.length === 0) {
    const sampleAds = [
      {
        id: 1,
        company: 'MTN Rwanda',
        contactPerson: 'John Doe',
        email: 'john@mtn.rw',
        phone: '+250788123456',
        adTitle: 'MTN Mobile Money',
        adContent: 'Get 5% cashback on all MoMo transactions this week! Send and receive money instantly.',
        description: 'Promote MTN Mobile Money services',
        duration: 20,
        price: 50000,
        position: 'middle',
        status: 'active',
        submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        budget: 200000,
        targetAudience: 'All viewers'
      },
      {
        id: 2,
        company: 'Airtel Rwanda',
        contactPerson: 'Jane Smith',
        email: 'jane@airtel.rw',
        phone: '+250788654321',
        adTitle: 'Airtel Money - Fast & Secure',
        adContent: 'Transfer money instantly with Airtel Money. Zero fees on all transactions today!',
        description: 'Showcase Airtel Money payment solutions',
        duration: 15,
        price: 35000,
        position: 'top',
        status: 'active',
        submittedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        budget: 150000,
        targetAudience: 'Mobile users'
      },
      {
        id: 3,
        company: 'Bank of Kigali',
        contactPerson: 'Peter Mugisha',
        email: 'peter@bk.rw',
        phone: '+250788999888',
        adTitle: 'BK Mobile Banking',
        adContent: 'Open your BK account in 5 minutes. Download the app now and get free transactions!',
        description: 'Promote BK mobile banking app',
        duration: 25,
        price: 75000,
        position: 'sidebar',
        status: 'active',
        submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        budget: 300000,
        targetAudience: 'Banking customers'
      }
    ];
    
    localStorage.setItem('adRequests', JSON.stringify(sampleAds));
    console.log('Sample ads loaded:', sampleAds.length);
  }
}

// Show next active ad
function showNextAd() {
  // Get active ads from localStorage
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  const activeAds = adRequests.filter(ad => ad.status === 'active');
  
  if (activeAds.length === 0) {
    console.log('No active ads to display');
    return;
  }
  
  // Get random active ad
  const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
  displayAd(randomAd);
}

// Display advertisement
function displayAd(ad) {
  if (!ad) return;
  
  currentAd = ad;
  const container = document.getElementById('liveAdContainer');
  const title = document.getElementById('liveAdTitle');
  const content = document.getElementById('liveAdContent');
  const company = document.getElementById('liveAdCompany');
  const timer = document.getElementById('liveAdTimer');
  
  if (!container || !title || !content || !company || !timer) return;
  
  // Set ad content
  title.textContent = ad.adTitle;
  content.textContent = ad.adContent;
  company.textContent = ad.company;
  
  // Set duration
  adTimeRemaining = ad.duration || 15;
  timer.textContent = adTimeRemaining + 's';
  
  // Show container
  container.style.display = 'block';
  
  // Start countdown
  startAdTimer();
  
  // Log impression
  logAdImpression(ad.id);
}

// Start ad countdown timer
function startAdTimer() {
  const timer = document.getElementById('liveAdTimer');
  const progress = document.getElementById('liveAdProgress');
  
  if (!timer || !progress) return;
  
  const totalDuration = adTimeRemaining;
  
  // Clear existing timer
  if (adTimer) {
    clearInterval(adTimer);
  }
  
  // Start new timer
  adTimer = setInterval(() => {
    adTimeRemaining--;
    
    // Update timer display
    timer.textContent = adTimeRemaining + 's';
    
    // Update progress bar
    const progressPercent = ((totalDuration - adTimeRemaining) / totalDuration) * 100;
    progress.style.width = progressPercent + '%';
    
    // Check if time is up
    if (adTimeRemaining <= 0) {
      clearInterval(adTimer);
      closeCurrentAd();
    }
  }, 1000);
}

// Close current ad
function closeCurrentAd() {
  const container = document.getElementById('liveAdContainer');
  
  if (container) {
    container.style.display = 'none';
  }
  
  // Clear timer
  if (adTimer) {
    clearInterval(adTimer);
    adTimer = null;
  }
  
  currentAd = null;
  adTimeRemaining = 0;
}

// Log ad impression
function logAdImpression(adId) {
  // Get impressions from localStorage
  let impressions = JSON.parse(localStorage.getItem('adImpressions') || '{}');
  
  // Increment impression count
  if (!impressions[adId]) {
    impressions[adId] = {
      count: 0,
      lastShown: null
    };
  }
  
  impressions[adId].count++;
  impressions[adId].lastShown = new Date().toISOString();
  
  // Save back to localStorage
  localStorage.setItem('adImpressions', JSON.stringify(impressions));
  
  console.log(`Ad ${adId} impression logged. Total: ${impressions[adId].count}`);
}

// Get ad statistics
function getAdStatistics() {
  const impressions = JSON.parse(localStorage.getItem('adImpressions') || '{}');
  const adRequests = JSON.parse(localStorage.getItem('adRequests') || '[]');
  
  const stats = adRequests.map(ad => {
    const adImpressions = impressions[ad.id] || { count: 0, lastShown: null };
    return {
      id: ad.id,
      company: ad.company,
      title: ad.adTitle,
      impressions: adImpressions.count,
      lastShown: adImpressions.lastShown,
      status: ad.status
    };
  });
  
  return stats;
}

// Make functions global
window.closeCurrentAd = closeCurrentAd;
window.showNextAd = showNextAd;
window.getAdStatistics = getAdStatistics;


// Manual test function - call this in console to test ads immediately
function testShowAd() {
  console.log('Testing ad display...');
  showNextAd();
}

// Make test function global
window.testShowAd = testShowAd;
