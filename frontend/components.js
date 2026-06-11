// ===== ASKR CLOTHING - SHARED COMPONENTS =====

function getNavbarHTML(activePage = '') {
  return `
  <nav class="navbar" id="navbar">
    <div class="navbar-container">
      <a href="home.html" class="navbar-logo">
        <img src="askr-logo.png" alt="ASKR" onerror="this.style.display='none'" />
        <span>ASK<span>R</span></span>
      </a>
      <ul class="navbar-nav">
        <li><a href="home.html" class="nav-link ${activePage==='home'?'active':''}">Home</a></li>
        <li><a href="men.html" class="nav-link ${activePage==='men'?'active':''}">Men</a></li>
        <li><a href="women.html" class="nav-link ${activePage==='women'?'active':''}">Women</a></li>
        <li><a href="kids.html" class="nav-link ${activePage==='kids'?'active':''}">Kids</a></li>
        <li><a href="features.html" class="nav-link ${activePage==='features'?'active':''}">Features</a></li>
        <li><a href="about.html" class="nav-link ${activePage==='about'?'active':''}">About</a></li>
        <li><a href="contact.html" class="nav-link ${activePage==='contact'?'active':''}">Contact</a></li>
      </ul>
      <div class="navbar-actions">
        <button class="navbar-icon-btn" onclick="window.location.href='home.html'" title="Search">🔍</button>
        <a href="wishlist.html" class="navbar-icon-btn" title="Wishlist">
          🤍<span class="badge wishlist-badge" style="display:none">0</span>
        </a>
        <a href="cart.html" class="navbar-icon-btn" title="Cart">
          🛒<span class="badge cart-badge" style="display:none">0</span>
        </a>
        <a href="profile.html" class="navbar-icon-btn" title="Profile">👤</a>
        <button class="hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
    <ul class="mobile-nav">
      <li><a href="home.html" class="mobile-nav-link">🏠 Home</a></li>
      <li><a href="men.html" class="mobile-nav-link">👔 Men</a></li>
      <li><a href="women.html" class="mobile-nav-link">👗 Women</a></li>
      <li><a href="kids.html" class="mobile-nav-link">🧒 Kids</a></li>
      <li><a href="features.html" class="mobile-nav-link">⭐ Features</a></li>
      <li><a href="about.html" class="mobile-nav-link">ℹ️ About</a></li>
      <li><a href="contact.html" class="mobile-nav-link">📞 Contact</a></li>
      <li><a href="wishlist.html" class="mobile-nav-link">🤍 Wishlist</a></li>
      <li><a href="cart.html" class="mobile-nav-link">🛒 Cart</a></li>
      <li><a href="profile.html" class="mobile-nav-link">👤 My Profile</a></li>
    </ul>
  </div>`;
}

function getFooterHTML() {
  return `
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-logo">
            <img src="askr-logo.png" alt="ASKR" onerror="this.style.display='none'" />
            <span class="footer-brand-name">ASK<span>R</span></span>
          </div>
          <p class="footer-desc">Elevate your style with ASKR Clothing — where premium fashion meets modern streetwear. Built for those who wear confidence.</p>
          <div class="footer-social">
            <a href="#" class="social-icon" title="Instagram">📸</a>
            <a href="#" class="social-icon" title="Facebook">📘</a>
            <a href="#" class="social-icon" title="Twitter">🐦</a>
            <a href="#" class="social-icon" title="YouTube">▶️</a>
            <a href="#" class="social-icon" title="Pinterest">📌</a>
          </div>
        </div>
        <div>
          <h4 class="footer-heading">Shop</h4>
          <ul class="footer-links">
            <li><a href="men.html">› Men's Collection</a></li>
            <li><a href="women.html">› Women's Collection</a></li>
            <li><a href="kids.html">› Kids Collection</a></li>
            <li><a href="home.html#new-arrivals">› New Arrivals</a></li>
            <li><a href="home.html#trending">› Trending</a></li>
            <li><a href="home.html#best-sellers">› Best Sellers</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Help</h4>
          <ul class="footer-links">
            <li><a href="faq.html">› FAQ</a></li>
            <li><a href="tracking.html">› Track Order</a></li>
            <li><a href="features.html">› Why ASKR?</a></li>
            <li><a href="privacy.html">› Privacy Policy</a></li>
            <li><a href="terms.html">› Terms &amp; Conditions</a></li>
            <li><a href="contact.html">› Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Contact</h4>
          <div class="footer-contact-item"><i>📍</i><span>Ganapathy, Coimbatore, Tamil Nadu 641006</span></div>
          <div class="footer-contact-item"><i>📞</i><span>+91 98765 43210</span></div>
          <div class="footer-contact-item"><i>📧</i><span>support@askrclothing.com</span></div>
          <div class="footer-contact-item"><i>🕐</i><span>Mon–Sat: 9AM – 8PM IST</span></div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 <a href="home.html">ASKR Clothing</a>. All rights reserved. Made with 🧡 in India.</p>
        <div class="footer-payment-icons">
          <span class="payment-icon">UPI</span>
          <span class="payment-icon">VISA</span>
          <span class="payment-icon">MC</span>
          <span class="payment-icon">AMEX</span>
          <span class="payment-icon">COD</span>
        </div>
      </div>
    </div>
  </footer>
  <button class="back-to-top" title="Back to top">↑</button>`;
}

// Auto-inject if containers exist
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('navbar-container');
  if (navContainer) {
    const page = navContainer.dataset.page || '';
    navContainer.innerHTML = getNavbarHTML(page);
  }
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) footerContainer.innerHTML = getFooterHTML();
});
