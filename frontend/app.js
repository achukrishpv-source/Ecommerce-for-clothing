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
      const id = btn.dataset.id;
      const existing = ASKR.cart.find(i => i.id === id && i.size === (btn.dataset.size || 'M'));
      ASKR.addToCart({
        id,
        name: btn.dataset.name || 'Product',
        price: parseFloat(btn.dataset.price || 0),
        image: btn.dataset.image || '',
        size: btn.dataset.size || 'M',
        color: btn.dataset.color || 'Default'
      });
      if (existing) {
        btn.textContent = `In Cart (${existing.qty + 1})`;
      } else {
        btn.textContent = 'In Cart (1)';
      }
      btn.style.background = 'var(--gold)';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
      }, 1500);
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
      // sync to ASKR cart if on cart page
      const cartItem = btn.closest('.cart-item');
      if (cartItem) {
        const id = cartItem.dataset.id;
        const size = cartItem.dataset.size;
        const item = ASKR.cart.find(i => i.id === id && i.size === size);
        if (item) {
          item.qty = val;
          ASKR.saveCart();
          ASKR.updateCartBadge();
          updateCartSummary();
          const priceEl = cartItem.querySelector('.cart-item-price');
          if (priceEl) priceEl.textContent = '₹' + (item.price * val).toLocaleString('en-IN');
        }
      }
    });
  });
}

// ===== RENDER CART PAGE =====
function renderCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (ASKR.cart.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--gray-600)">
      <div style="font-size:4rem;margin-bottom:16px">🛒</div>
      <h3 style="color:var(--ivory)">Your cart is empty</h3>
      <a href="home.html" class="btn btn-primary" style="margin-top:20px">Continue Shopping</a>
    </div>`;
    updateCartSummary();
    return;
  }

  container.innerHTML = ASKR.cart.map(item => `
    <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
      <div class="cart-item-img"><img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}"/></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">Size: ${item.size} &nbsp;|&nbsp; Color: ${item.color}</div>
        <div class="qty-control">
          <button class="qty-btn" data-action="dec">−</button>
          <input type="number" class="qty-input" value="${item.qty}" min="1" max="10" readonly />
          <button class="qty-btn" data-action="inc">+</button>
        </div>
      </div>
      <div style="text-align:right;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end">
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <div class="cart-item-remove" onclick="removeCartItem('${item.id}','${item.size}')">🗑️ Remove</div>
      </div>
    </div>
  `).join('');

  document.getElementById('cart-count-label').textContent = `(${ASKR.cart.length} item${ASKR.cart.length > 1 ? 's' : ''})`;
  updateCartSummary();
  initQtyControls();
}

function removeCartItem(id, size) {
  ASKR.removeFromCart(id, size);
  renderCart();
  showToast('Item removed', 'info');
}

function updateCartSummary() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const taxEl = document.getElementById('cart-tax');
  const itemCountEl = document.getElementById('cart-item-count');
  if (!subtotalEl) return;
  const subtotal = ASKR.getCartTotal();
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
  if (taxEl) taxEl.textContent = '₹' + tax.toLocaleString('en-IN');
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  if (itemCountEl) itemCountEl.textContent = `${ASKR.cart.length} item${ASKR.cart.length > 1 ? 's' : ''}`;
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

// ===== FILTER LOGIC =====
function applyFilters() {
  // Collect checked categories
  const checkedCategories = [];
  document.querySelectorAll('.filter-group').forEach(group => {
    const title = group.querySelector('.filter-group-title')?.textContent?.trim().toLowerCase();
    if (title === 'category' || title === 'age group') {
      group.querySelectorAll('.filter-option input:checked').forEach(cb => {
        const label = cb.closest('.filter-option')?.querySelector('label')?.textContent?.trim().toLowerCase();
        if (label) checkedCategories.push(label);
      });
    }
  });

  // Collect max price
  const priceRange = document.querySelector('.filter-sidebar input[type="range"]');
  const maxPrice = priceRange ? parseFloat(priceRange.value) : Infinity;

  // Collect selected sizes
  const selectedSizes = [];
  document.querySelectorAll('.size-option.active').forEach(s => selectedSizes.push(s.textContent.trim().toLowerCase()));

  // Collect checked ratings
  const checkedRatings = [];
  document.querySelectorAll('.filter-group').forEach(group => {
    const title = group.querySelector('.filter-group-title')?.textContent?.trim().toLowerCase();
    if (title === 'rating') {
      group.querySelectorAll('.filter-option input:checked').forEach(cb => {
        const label = cb.closest('.filter-option')?.querySelector('label')?.textContent || '';
        const match = label.match(/(\d+)\+?\s*stars?/i);
        if (match) checkedRatings.push(parseInt(match[1]));
      });
    }
  });

  // Collect checked occasions
  const checkedOccasions = [];
  document.querySelectorAll('.filter-group').forEach(group => {
    const title = group.querySelector('.filter-group-title')?.textContent?.trim().toLowerCase();
    if (title === 'occasion') {
      group.querySelectorAll('.filter-option input:checked').forEach(cb => {
        const label = cb.closest('.filter-option')?.querySelector('label')?.textContent?.trim().toLowerCase();
        if (label) checkedOccasions.push(label);
      });
    }
  });

  // Collect checked materials
  const checkedMaterials = [];
  document.querySelectorAll('.filter-group').forEach(group => {
    const title = group.querySelector('.filter-group-title')?.textContent?.trim().toLowerCase();
    if (title === 'material') {
      group.querySelectorAll('.filter-option input:checked').forEach(cb => {
        const label = cb.closest('.filter-option')?.querySelector('label')?.textContent?.trim().toLowerCase();
        if (label) checkedMaterials.push(label);
      });
    }
  });

  // Collect checked discounts
  const checkedDiscounts = [];
  document.querySelectorAll('.filter-group').forEach(group => {
    const title = group.querySelector('.filter-group-title')?.textContent?.trim().toLowerCase();
    if (title === 'discount') {
      group.querySelectorAll('.filter-option input:checked').forEach(cb => {
        const label = cb.closest('.filter-option')?.querySelector('label')?.textContent || '';
        const match = label.match(/(\d+)%/);
        if (match) checkedDiscounts.push(parseInt(match[1]));
      });
    }
  });

  let visibleCount = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    const cardCategory = (card.dataset.category || card.querySelector('.product-category')?.textContent || '').toLowerCase();
    const cardPrice = parseFloat(card.dataset.price || card.querySelector('.price-current')?.textContent?.replace(/[₹,]/g, '') || 0);
    const cardRatingEl = card.querySelector('.stars');
    const cardRating = cardRatingEl ? (cardRatingEl.textContent.match(/★/g) || []).length : 5;
    const cardOccasion = (card.dataset.occasion || card.dataset.name || '').toLowerCase();
    const cardMaterial = (card.dataset.material || card.dataset.name || '').toLowerCase();
    const cardDiscountEl = card.querySelector('.price-discount');
    const cardDiscount = cardDiscountEl ? parseInt(cardDiscountEl.textContent) : 0;

    let show = true;

    // Category filter — skip if none checked or only "all" checked
    if (checkedCategories.length > 0) {
      const hasAll = checkedCategories.some(c => c.includes('all'));
      if (!hasAll) {
        const matchesCat = checkedCategories.some(c => cardCategory.includes(c) || (card.dataset.name || '').toLowerCase().includes(c));
        if (!matchesCat) show = false;
      }
    }

    // Price filter
    if (cardPrice > maxPrice) show = false;

    // Rating filter
    if (checkedRatings.length > 0) {
      const minRating = Math.min(...checkedRatings);
      if (cardRating < minRating) show = false;
    }

    // Occasion filter
    if (checkedOccasions.length > 0) {
      const matchesOcc = checkedOccasions.some(o => cardOccasion.includes(o));
      if (!matchesOcc) show = false;
    }

    // Material filter
    if (checkedMaterials.length > 0) {
      const matchesMat = checkedMaterials.some(m => cardMaterial.includes(m));
      if (!matchesMat) show = false;
    }

    // Discount filter
    if (checkedDiscounts.length > 0) {
      const minDiscount = Math.min(...checkedDiscounts);
      if (cardDiscount < minDiscount) show = false;
    }

    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  // Update count display
  const countEl = document.querySelector('.collection-count strong');
  if (countEl) countEl.textContent = visibleCount;
}

function initFilters() {
  // Clear all
  const filterClear = document.querySelector('.filter-clear');
  if (filterClear) {
    filterClear.addEventListener('click', () => {
      document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
      document.querySelectorAll('.size-option').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      const priceRange = document.querySelector('.filter-sidebar input[type="range"]');
      if (priceRange) {
        priceRange.value = priceRange.max;
        const labels = priceRange.closest('.filter-group')?.querySelectorAll('.price-range-labels span');
        if (labels && labels[1]) labels[1].textContent = '₹' + parseInt(priceRange.max).toLocaleString('en-IN');
      }
      document.querySelectorAll('.product-card').forEach(c => c.style.display = '');
      const countEl = document.querySelector('.collection-count strong');
      if (countEl) countEl.textContent = document.querySelectorAll('.product-card').length;
    });
  }

  // Apply button
  const applyBtn = document.querySelector('.filter-sidebar .btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyFilters();
      showToast('Filters applied', 'success');
    });
  }

  // Live price range update
  const priceRange = document.querySelector('.filter-sidebar input[type="range"]');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      const labels = priceRange.closest('.filter-group')?.querySelectorAll('.price-range-labels span');
      if (labels && labels[1]) labels[1].textContent = '₹' + parseInt(priceRange.value).toLocaleString('en-IN');
    });
  }

  // Category checkbox: uncheck "All" when specific is checked and vice versa
  document.querySelectorAll('.filter-group').forEach(group => {
    const title = group.querySelector('.filter-group-title')?.textContent?.trim().toLowerCase();
    if (title === 'category' || title === 'age group') {
      const checkboxes = group.querySelectorAll('.filter-option input');
      checkboxes.forEach((cb, idx) => {
        cb.addEventListener('change', () => {
          if (idx === 0 && cb.checked) {
            // "All" checked — uncheck others
            checkboxes.forEach((c, i) => { if (i !== 0) c.checked = false; });
          } else if (idx !== 0 && cb.checked) {
            // Specific checked — uncheck "All"
            checkboxes[0].checked = false;
          }
        });
      });
    }
  });
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
  renderCart();
});
