// ===== ASKR CLOTHING - GLOBAL JAVASCRIPT =====

// ===== CART & WISHLIST STATE =====
const ASKR = {
  cart: JSON.parse(localStorage.getItem('askr_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('askr_wishlist') || '[]'),
  user: JSON.parse(localStorage.getItem('askr_user') || 'null'),

  saveCart() { localStorage.setItem('askr_cart', JSON.stringify(this.cart)); },
  saveWishlist() { localStorage.setItem('askr_wishlist', JSON.stringify(this.wishlist)); },

  addToCart(product) {
    const existing = this.cart.find(i => i.id === product.id && i.size === product.size);
    if (existing) { existing.qty += product.qty || 1; }
    else { this.cart.push({ ...product, qty: product.qty || 1 }); }
    this.saveCart();
    this.updateCartBadge();
    showToast(`${product.name} added to cart!`, 'success');
  },

  removeFromCart(id, size) {
    this.cart = this.cart.filter(i => !(i.id === id && i.size === size));
    this.saveCart();
    this.updateCartBadge();
  },

  toggleWishlist(product) {
    const idx = this.wishlist.findIndex(i => i.id === product.id);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      this.saveWishlist();
      this.updateWishlistBadge();
      showToast(`${product.name} removed from wishlist`, 'info');
      return false;
    } else {
      this.wishlist.push(product);
      this.saveWishlist();
      this.updateWishlistBadge();
      showToast(`${product.name} added to wishlist!`, 'success');
      return true;
    }
  },

  isInWishlist(id) { return this.wishlist.some(i => i.id === id); },

  updateCartBadge() {
    const total = this.cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = total;
      b.style.display = total > 0 ? 'flex' : 'none';
    });
  },

  updateWishlistBadge() {
    const total = this.wishlist.length;
    document.querySelectorAll('.wishlist-badge').forEach(b => {
      b.textContent = total;
      b.style.display = total > 0 ? 'flex' : 'none';
    });
  },

  getCartTotal() {
    return this.cart.reduce((s, i) => s + (i.price * i.qty), 0);
  }
};

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span><span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const path = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.includes(href.replace('.html', ''))) link.classList.add('active');
  });
}

// ===== SCROLL REVEAL =====
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const parent = tabGroup.closest('.tabs-wrapper') || tabGroup.parentElement;
        parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const tc = parent.querySelector(`#${target}`);
        if (tc) tc.classList.add('active');
      });
    });
  });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ===== PAYMENT METHOD SELECTION =====
function initPaymentMethods() {
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
      const radio = method.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      // Show/hide sub-forms
      document.querySelectorAll('.payment-detail-form').forEach(f => f.style.display = 'none');
      const formId = method.dataset.form;
      if (formId) {
        const form = document.getElementById(formId);
        if (form) form.style.display = 'block';
      }
    });
  });
}

// ===== WISHLIST BUTTONS =====
function initWishlistButtons() {
  document.querySelectorAll('.product-action-btn[data-wishlist]').forEach(btn => {
    const productId = btn.dataset.wishlist;
    if (ASKR.isInWishlist(productId)) btn.classList.add('active');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = {
        id: productId,
        name: btn.dataset.name || 'Product',
        price: parseFloat(btn.dataset.price || 0),
        image: btn.dataset.image || '',
        category: btn.dataset.category || ''
      };
      const added = ASKR.toggleWishlist(product);
      btn.classList.toggle('active', added);
    });
  });
}

// ===== ADD TO CART BUTTONS =====
function initCartButtons() {
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ASKR.addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name || 'Product',
        price: parseFloat(btn.dataset.price || 0),
        image: btn.dataset.image || '',
        size: btn.dataset.size || 'M',
        color: btn.dataset.color || 'Default'
      });
    });
  });
}

// ===== QTY CONTROLS =====
function initQtyControls() {
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (!input) return;
      let val = parseInt(input.value) || 1;
      if (btn.dataset.action === 'inc') val = Math.min(val + 1, 10);
      if (btn.dataset.action === 'dec') val = Math.max(val - 1, 1);
      input.value = val;
      input.dispatchEvent(new Event('change'));
    });
  });
}

// ===== GALLERY (Product Detail) =====
function initGallery() {
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const main = thumb.closest('.product-gallery')?.querySelector('.gallery-main img');
      if (main) {
        main.style.opacity = '0';
        setTimeout(() => {
          main.src = thumb.querySelector('img')?.src || main.src;
          main.style.opacity = '1';
        }, 200);
        main.style.transition = 'opacity 0.2s ease';
      }
      thumb.closest('.gallery-thumbs')?.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// ===== SIZE SELECTOR =====
function initSizeSelector() {
  document.querySelectorAll('.size-option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.size-options')?.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

// ===== COLOR SWATCH SELECTOR =====
function initColorSwatches() {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatch.closest('.color-swatches')?.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });
}

// ===== PASSWORD TOGGLE =====
function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      toggle.innerHTML = isText ? '👁️' : '🙈';
    });
  });
}

// ===== SEARCH BAR =====
function initSearch() {
  const searchInputs = document.querySelectorAll('.search-filter-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const cards = document.querySelectorAll('.product-card[data-name]');
      cards.forEach(card => {
        const name = card.dataset.name?.toLowerCase() || '';
        card.style.display = name.includes(query) ? '' : 'none';
      });
    });
  });
}

// ===== FILTER CHECKBOXES =====
function initFilters() {
  const filterClear = document.querySelector('.filter-clear');
  if (filterClear) {
    filterClear.addEventListener('click', () => {
      document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
      document.querySelectorAll('.product-card').forEach(c => c.style.display = '');
    });
  }
}

// ===== COUPON CODE =====
function initCoupon() {
  const applyBtn = document.querySelector('.apply-coupon');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const input = document.querySelector('.coupon-code-input');
      const code = input?.value?.toUpperCase();
      const discounts = { 'ASKR10': 10, 'ASKR20': 20, 'WELCOME15': 15, 'FIRST50': 50 };
      if (discounts[code]) {
        showToast(`Coupon applied! ${discounts[code]}% discount`, 'success');
        const discRow = document.querySelector('.summary-discount');
        if (discRow) discRow.style.display = 'flex';
      } else {
        showToast('Invalid coupon code', 'error');
      }
    });
  }
}

// ===== SMOOTH FORM SUBMIT =====
function initForms() {
  document.querySelectorAll('form[data-ajax]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn?.innerHTML;
      if (btn) { btn.innerHTML = '<span style="animation:spin 1s linear infinite;display:inline-block">⏳</span> Processing...'; btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        const redirect = form.dataset.redirect;
        if (redirect) window.location.href = redirect;
      }, 1500);
    });
  });
}

// ===== DELIVERY METHOD =====
function initDeliveryOptions() {
  document.querySelectorAll('.delivery-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  ASKR.updateCartBadge();
  ASKR.updateWishlistBadge();
  initNavbar();
  initReveal();
  initBackToTop();
  initTabs();
  initFAQ();
  initPaymentMethods();
  initWishlistButtons();
  initCartButtons();
  initQtyControls();
  initGallery();
  initSizeSelector();
  initColorSwatches();
  initPasswordToggle();
  initSearch();
  initFilters();
  initCoupon();
  initForms();
  initDeliveryOptions();
});
