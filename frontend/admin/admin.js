// ===== ASKR ADMIN PANEL JS =====

// Auth guard
if (!sessionStorage.getItem('askr_admin')) window.location.href = 'admin-login.html';

// ===== MOCK SEED ORDERS =====
const MOCK_ORDERS = [
  { id: '#ASK-1001', customer: 'Aarav Mehta',   itemCount: 3, amount: 3897, date: '2025-06-08', dateStr: '08 Jun 2025', status: 'delivered', payment: 'UPI',               delivery_method: '🚚 Standard Delivery', address: 'MG Road, Bengaluru, Karnataka – 560001', items: [] },
  { id: '#ASK-1002', customer: 'Priya Sharma',  itemCount: 1, amount: 1299, date: '2025-06-08', dateStr: '08 Jun 2025', status: 'shipped',   payment: 'Credit/Debit Card', delivery_method: '🚀 Express Delivery',  address: 'Bandra West, Mumbai – 400050',           items: [] },
  { id: '#ASK-1003', customer: 'Rohan Patel',   itemCount: 2, amount: 2598, date: '2025-06-07', dateStr: '07 Jun 2025', status: 'confirmed', payment: 'Net Banking',       delivery_method: '🚀 Express Delivery',  address: 'Anna Nagar, Chennai – 600040',           items: [] },
  { id: '#ASK-1004', customer: 'Ananya Nair',   itemCount: 4, amount: 5196, date: '2025-06-07', dateStr: '07 Jun 2025', status: 'placed',    payment: 'UPI',               delivery_method: '📅 Scheduled Delivery', address: 'Koramangala, Bengaluru – 560034',        items: [] },
  { id: '#ASK-1005', customer: 'Kiran Kumar',   itemCount: 1, amount: 899,  date: '2025-06-06', dateStr: '06 Jun 2025', status: 'cancelled', payment: 'Cash on Delivery',  delivery_method: '🚚 Standard Delivery', address: 'Sector 62, Noida – 201309',              items: [] },
  { id: '#ASK-1006', customer: 'Divya Reddy',   itemCount: 2, amount: 1798, date: '2025-06-06', dateStr: '06 Jun 2025', status: 'delivered', payment: 'UPI',               delivery_method: '🚀 Express Delivery',  address: 'Jubilee Hills, Hyderabad – 500033',      items: [] },
];

// ===== GET ALL ORDERS (real + mock) =====
function getAllOrders() {
  const real = JSON.parse(localStorage.getItem('askr_orders') || '[]').map(o => ({
    id:              o.id,
    customer:        o.customer || 'Guest',
    items:           o.items || [],
    itemCount:       o.itemCount || (o.items ? o.items.reduce((s, i) => s + (i.qty || 1), 0) : 1),
    amount:          o.total || 0,
    date:            o.date ? o.date.split('T')[0] : new Date().toISOString().split('T')[0],
    dateStr:         o.dateStr || new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    status:          o.status || 'placed',
    payment:         o.payment || 'UPI',
    delivery_method: o.delivery_method || 'Standard Delivery',
    address:         o.address || '',
    isReal:          true
  }));
  return [...real, ...MOCK_ORDERS];
}

// Persist status change for real orders
function persistOrderStatus(id, status) {
  const stored = JSON.parse(localStorage.getItem('askr_orders') || '[]');
  const o = stored.find(x => x.id === id);
  if (o) { o.status = status; localStorage.setItem('askr_orders', JSON.stringify(stored)); }
}

// ===== PRODUCTS =====
const PRODUCTS = [
  { id: 'p001', name: 'Oxford Formal Shirt',     category: 'men',         price: 1199, original: 1799, stock: 45, rating: 4.9, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=80&q=60', badge: 'New'      },
  { id: 'p002', name: 'Graphic Oversize Tee',     category: 'men',         price: 799,  original: 1199, stock: 72, rating: 4.8, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=80&q=60', badge: 'Trending' },
  { id: 'p003', name: 'Slim Fit Dark Wash Jeans', category: 'men',         price: 1599, original: 2499, stock: 30, rating: 4.7, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&q=60', badge: ''         },
  { id: 'p004', name: 'Fleece Pullover Hoodie',   category: 'men',         price: 1499, original: 2199, stock: 18, rating: 4.9, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=60', badge: 'New'      },
  { id: 'p005', name: 'Leather Bomber Jacket',    category: 'men',         price: 3999, original: 6499, stock:  8, rating: 4.9, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&q=60', badge: 'Trending' },
  { id: 'p006', name: 'Floral Print Kurti',       category: 'women',       price: 849,  original: 1299, stock: 60, rating: 4.6, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80&q=60', badge: 'New'    },
  { id: 'p007', name: 'Flowy Summer Dress',       category: 'women',       price: 1199, original: 1899, stock: 42, rating: 4.8, image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=80&q=60', badge: 'Sale'   },
  { id: 'p008', name: 'Midi Floral Dress',         category: 'women',       price: 1499, original: 2299, stock:  5, rating: 4.9, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=80&q=60', badge: ''      },
  { id: 'p009', name: 'Kids Graphic T-Shirt',      category: 'kids',        price: 499,  original: 799,  stock: 90, rating: 4.8, image: 'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=80&q=60', badge: 'New'     },
  { id: 'p010', name: 'Premium Leather Wallet',    category: 'accessories', price: 899,  original: 1499, stock: 35, rating: 4.9, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&q=60', badge: ''        },
  { id: 'p011', name: 'Gold Pendant Necklace',     category: 'accessories', price: 1299, original: 2199, stock: 22, rating: 4.9, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=80&q=60', badge: 'New'   },
  { id: 'p012', name: 'Aviator Sunglasses',        category: 'accessories', price: 699,  original: 1199, stock:  0, rating: 4.8, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&q=60', badge: ''      },
];

const USERS = [
  { name: 'Aarav Mehta',  email: 'aarav@example.com',  phone: '+91 98765 43210', orders: 8,  spent: 12840, joined: '2024-01-15' },
  { name: 'Priya Sharma', email: 'priya@example.com',  phone: '+91 87654 32109', orders: 5,  spent: 7650,  joined: '2024-02-20' },
  { name: 'Rohan Patel',  email: 'rohan@example.com',  phone: '+91 76543 21098', orders: 12, spent: 19200, joined: '2023-11-10' },
  { name: 'Ananya Nair',  email: 'ananya@example.com', phone: '+91 65432 10987', orders: 3,  spent: 4599,  joined: '2024-04-05' },
  { name: 'Kiran Kumar',  email: 'kiran@example.com',  phone: '+91 54321 09876', orders: 1,  spent: 899,   joined: '2025-01-12' },
  { name: 'Divya Reddy',  email: 'divya@example.com',  phone: '+91 43210 98765', orders: 7,  spent: 9800,  joined: '2024-03-18' },
  { name: 'Arjun Singh',  email: 'arjun@example.com',  phone: '+91 32109 87654', orders: 15, spent: 24500, joined: '2023-09-22' },
  { name: 'Meera Iyer',   email: 'meera@example.com',  phone: '+91 21098 76543', orders: 4,  spent: 6200,  joined: '2024-06-01' },
];

const COUPONS = [
  { code: 'ASKR10',    discount: 10, type: 'Percentage', used: 234, max: 500,  expiry: '2025-12-31', active: true  },
  { code: 'ASKR20',    discount: 20, type: 'Percentage', used: 89,  max: 200,  expiry: '2025-09-30', active: true  },
  { code: 'WELCOME15', discount: 15, type: 'Percentage', used: 412, max: 1000, expiry: '2025-12-31', active: true  },
  { code: 'FIRST50',   discount: 50, type: 'Percentage', used: 67,  max: 100,  expiry: '2025-07-31', active: true  },
  { code: 'SUMMER25',  discount: 25, type: 'Percentage', used: 100, max: 100,  expiry: '2025-06-01', active: false },
];

const REVIEWS = [
  { customer: 'Aarav Mehta',  product: 'Urban Black Hoodie',    rating: 5, text: 'Absolutely love ASKR! The hoodie is incredibly soft and the fit is perfect.',  date: '2025-06-05' },
  { customer: 'Priya Sharma', product: 'Floral Print Kurti',    rating: 5, text: 'The kurti collection is stunning! Premium fabric, beautiful print.',            date: '2025-06-04' },
  { customer: 'Rohan Patel',  product: 'Leather Bomber Jacket', rating: 5, text: 'Best streetwear brand in India! The bomber jacket is fire.',                   date: '2025-06-03' },
  { customer: 'Ananya Nair',  product: 'Gold Pendant Necklace', rating: 4, text: 'Great quality jewellery for the price. Delivery was super fast.',               date: '2025-06-02' },
  { customer: 'Kiran Kumar',  product: 'Aviator Sunglasses',    rating: 3, text: 'Good sunglasses but the case was missing from my order.',                      date: '2025-06-01' },
];

let filteredOrders   = [];
let filteredProducts = [...PRODUCTS];
let filteredUsers    = [...USERS];
let editingProductId = null;
let ordersPage = 1, productsPage = 1;
const PAGE_SIZE = 6;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  refreshAdminOrders();
  renderTopProducts();
  renderProductsTable();
  renderUsersTable();
  renderInventoryTable();
  renderCouponsTable();
  renderReviewsTable();
  initCharts();
  initSidebarNav();
  setInterval(refreshAdminOrders, 30000);
});

function refreshAdminOrders() {
  filteredOrders = getAllOrders();
  renderRecentOrders();
  renderOrdersTable();
  updateDashboardStats();
}

function updateDashboardStats() {
  const all = getAllOrders();
  const pending = all.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
  const badge = document.getElementById('pendingBadge');
  if (badge) badge.textContent = pending;

  const totalRevenue = all.reduce((s, o) => s + (o.amount || 0), 0);
  const revenueEl = document.getElementById('statRevenue');
  if (revenueEl) revenueEl.textContent = '₹' + totalRevenue.toLocaleString('en-IN');
  const ordersEl = document.getElementById('statOrders');
  if (ordersEl) ordersEl.textContent = all.length.toLocaleString('en-IN');
}

// ===== SIDEBAR NAV =====
function initSidebarNav() {
  document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchPage(link.dataset.page);
    });
  });
}

function switchPage(page) {
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.sidebar-link[data-page="${page}"]`);
  if (link) link.classList.add('active');
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');
  if (window.innerWidth < 900) document.getElementById('adminSidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
}

// ===== CHARTS =====
let revenueChart, categoryChart;

function initCharts() {
  const rCtx = document.getElementById('revenueChart')?.getContext('2d');
  const cCtx = document.getElementById('categoryChart')?.getContext('2d');
  if (!rCtx || !cCtx) return;

  const labels = ['Jun 1','Jun 5','Jun 10','Jun 15','Jun 20','Jun 25','Jun 30'];
  revenueChart = new Chart(rCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Revenue', data: [18000,24000,21000,32000,28000,38000,42000], borderColor: '#FF6B00', backgroundColor: 'rgba(255,107,0,0.08)', tension: 0.4, fill: true, pointBackgroundColor: '#FF6B00', pointRadius: 4 },
        { label: 'Orders',  data: [12,18,15,22,20,28,30],                     borderColor: '#D4A017', backgroundColor: 'rgba(212,160,23,0.06)', tension: 0.4, fill: true, pointBackgroundColor: '#D4A017', pointRadius: 4, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1C1C1C', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#F5F1EA', bodyColor: '#888' } },
      scales: {
        x:  { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#888', font: { size: 11 } } },
        y:  { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#888', font: { size: 11 }, callback: v => '₹' + (v/1000).toFixed(0) + 'k' } },
        y1: { position: 'right', grid: { display: false }, ticks: { color: '#888', font: { size: 11 } } }
      }
    }
  });

  categoryChart = new Chart(cCtx, {
    type: 'doughnut',
    data: {
      labels: ['Men', 'Women', 'Kids', 'Accessories'],
      datasets: [{ data: [38, 32, 18, 12], backgroundColor: ['#FF6B00','#D4A017','#4FC3F7','#4CAF50'], borderWidth: 0, hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#888', padding: 16, font: { size: 12 }, usePointStyle: true } },
        tooltip: { backgroundColor: '#1C1C1C', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#F5F1EA', bodyColor: '#888' }
      },
      cutout: '65%'
    }
  });
}

function updateCharts() {
  const period = parseInt(document.getElementById('dashPeriod').value);
  const m = period === 7 ? 0.25 : period === 30 ? 1 : 3;
  const revenueEl = document.getElementById('statRevenue');
  const ordersEl  = document.getElementById('statOrders');
  const custEl    = document.getElementById('statCustomers');
  if (revenueEl) revenueEl.textContent = '₹' + Math.round(482390 * m).toLocaleString('en-IN');
  if (ordersEl)  ordersEl.textContent  = Math.round(1247 * m).toLocaleString('en-IN');
  if (custEl)    custEl.textContent    = Math.round(3841 * (period === 7 ? 0.15 : period === 30 ? 1 : 2.5)).toLocaleString('en-IN');
  showToastA('Dashboard updated for selected period', 'info');
}

// ===== RECENT ORDERS (Dashboard) =====
function renderRecentOrders() {
  const tbody = document.getElementById('recentOrdersTable');
  if (!tbody) return;
  const orders = getAllOrders();
  tbody.innerHTML = orders.slice(0, 6).map(o => `
    <tr>
      <td>
        <span style="color:var(--a-orange);font-weight:600;cursor:pointer" onclick="viewOrder('${o.id}')">${o.id}</span>
        ${o.isReal ? ' <span style="font-size:0.62rem;background:rgba(76,175,80,0.15);color:#4CAF50;padding:1px 6px;border-radius:4px;border:1px solid rgba(76,175,80,0.3)">NEW</span>' : ''}
      </td>
      <td>${o.customer}</td>
      <td style="color:var(--a-ivory);font-weight:600">₹${(o.amount||0).toLocaleString('en-IN')}</td>
      <td><span class="a-status a-status-${o.status}">${o.status}</span></td>
    </tr>`).join('');
}

// ===== TOP PRODUCTS (Dashboard) =====
function renderTopProducts() {
  const el = document.getElementById('topProductsList');
  if (!el) return;
  const top = [...PRODUCTS].sort((a, b) => (b.original - b.price) - (a.original - a.price)).slice(0, 5);
  el.innerHTML = top.map((p, i) => `
    <div class="top-product-item">
      <div class="top-product-rank">${i+1}</div>
      <img class="top-product-img" src="${p.image}" alt="${p.name}" onerror="this.style.display='none'" />
      <div>
        <div class="top-product-name">${p.name}</div>
        <div class="top-product-sales">${p.category} · ${p.stock} in stock</div>
      </div>
      <div class="top-product-revenue">₹${p.price.toLocaleString('en-IN')}</div>
    </div>`).join('');
}

// ===== ORDERS TABLE =====
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTable');
  if (!tbody) return;
  const start = (ordersPage - 1) * PAGE_SIZE;
  const slice = filteredOrders.slice(start, start + PAGE_SIZE);
  tbody.innerHTML = slice.map(o => `
    <tr>
      <td>
        <span style="color:var(--a-orange);font-weight:600;cursor:pointer" onclick="viewOrder('${o.id}')">${o.id}</span>
        ${o.isReal ? ' <span style="font-size:0.62rem;background:rgba(76,175,80,0.15);color:#4CAF50;padding:1px 6px;border-radius:4px">NEW</span>' : ''}
      </td>
      <td>${o.customer}</td>
      <td>${o.itemCount || o.items?.length || '—'}</td>
      <td style="color:var(--a-ivory);font-weight:600">₹${(o.amount||0).toLocaleString('en-IN')}</td>
      <td>${o.dateStr || o.date}</td>
      <td>
        <select class="a-select a-select-sm" onchange="updateOrderStatus('${o.id}', this.value)" style="padding:4px 8px">
          ${['placed','confirmed','shipped','delivered','cancelled'].map(s =>
            `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td style="display:flex;gap:6px">
        <button class="a-action-btn" onclick="viewOrder('${o.id}')">👁 View</button>
        <button class="a-action-btn danger" onclick="deleteOrder('${o.id}')">🗑</button>
      </td>
    </tr>`).join('');
  renderPagination('ordersPagination', filteredOrders.length, ordersPage, p => { ordersPage = p; renderOrdersTable(); });
}

function filterOrders(q) {
  q = q.toLowerCase();
  filteredOrders = getAllOrders().filter(o =>
    o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
  );
  ordersPage = 1;
  renderOrdersTable();
}

function filterOrdersByStatus(s) {
  filteredOrders = s ? getAllOrders().filter(o => o.status === s) : getAllOrders();
  ordersPage = 1;
  renderOrdersTable();
}

function updateOrderStatus(id, status) {
  // Update in localStorage (real orders)
  persistOrderStatus(id, status);
  // Also update in mock list if it exists there
  const mock = MOCK_ORDERS.find(o => o.id === id);
  if (mock) mock.status = status;
  showToastA(`Order ${id} → ${status}`, 'success');
  refreshAdminOrders();
}

function deleteOrder(id) {
  // Remove from localStorage
  const stored = JSON.parse(localStorage.getItem('askr_orders') || '[]');
  const newStored = stored.filter(o => o.id !== id);
  localStorage.setItem('askr_orders', JSON.stringify(newStored));
  // Remove from mock
  const mi = MOCK_ORDERS.findIndex(o => o.id === id);
  if (mi > -1) MOCK_ORDERS.splice(mi, 1);
  showToastA(`Order ${id} deleted`, 'info');
  refreshAdminOrders();
}

function viewOrder(id) {
  const all = getAllOrders();
  const o = all.find(x => x.id === id);
  if (!o) return;

  const itemsHTML = (o.items && o.items.length > 0)
    ? `<div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.08);padding-top:14px">
        <div class="a-label" style="margin-bottom:10px">Order Items</div>
        ${o.items.map(item => `
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
            <img src="${item.image || ''}" alt="${item.name}"
              style="width:44px;height:52px;object-fit:cover;border-radius:8px;flex-shrink:0;background:rgba(255,255,255,0.05)"
              onerror="this.style.display='none'" />
            <div style="flex:1">
              <div style="font-size:0.83rem;font-weight:600;color:var(--a-ivory)">${item.name}</div>
              <div style="font-size:0.72rem;color:var(--a-gray)">${item.size} · ${item.color} × ${item.qty}</div>
            </div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--a-orange)">₹${(item.price*item.qty).toLocaleString('en-IN')}</div>
          </div>`).join('')}
      </div>`
    : '';

  document.getElementById('orderModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div><div class="a-label">Order ID</div><div style="color:var(--a-orange);font-weight:700;font-size:1rem">${o.id}</div></div>
      <div><div class="a-label">Date</div><div>${o.dateStr || o.date}</div></div>
      <div><div class="a-label">Customer</div><div style="color:var(--a-ivory)">${o.customer}</div></div>
      <div><div class="a-label">Items</div><div>${o.itemCount || '—'}</div></div>
      <div><div class="a-label">Amount</div><div style="color:var(--a-orange);font-weight:700;font-size:1.1rem">₹${(o.amount||0).toLocaleString('en-IN')}</div></div>
      <div><div class="a-label">Payment</div><div>${o.payment || '—'}</div></div>
      <div style="grid-column:span 2"><div class="a-label">Delivery</div><div>${o.delivery_method || '—'}</div></div>
      <div style="grid-column:span 2"><div class="a-label">Address</div><div style="color:var(--a-gray-light)">${o.address || '—'}</div></div>
      <div><div class="a-label">Status</div><span class="a-status a-status-${o.status}">${o.status}</span></div>
    </div>
    ${itemsHTML}
    <div style="margin-top:18px">
      <div class="a-label">Update Status</div>
      <select class="a-input" id="modalStatusSelect" style="max-width:220px" onchange="updateOrderStatus('${o.id}',this.value);renderRecentOrders()">
        ${['placed','confirmed','shipped','delivered','cancelled'].map(s =>
          `<option value="${s}" ${o.status===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
      </select>
    </div>`;
  openModal('orderModal');
}

// ===== PRODUCTS TABLE =====
function renderProductsTable() {
  const tbody = document.getElementById('productsTable');
  if (!tbody) return;
  const start = (productsPage - 1) * PAGE_SIZE;
  const slice = filteredProducts.slice(start, start + PAGE_SIZE);
  tbody.innerHTML = slice.map(p => {
    const ss = p.stock === 0 ? 'outofstock' : p.stock < 15 ? 'lowstock' : 'instock';
    const sl = p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock';
    return `<tr>
      <td style="display:flex;align-items:center;gap:12px">
        <img class="product-thumb" src="${p.image}" alt="${p.name}" onerror="this.style.display='none'" />
        <div>
          <div style="color:var(--a-ivory);font-weight:600;font-size:0.83rem">${p.name}</div>
          ${p.badge ? `<span style="font-size:0.68rem;background:rgba(255,107,0,0.15);color:var(--a-orange);padding:2px 7px;border-radius:4px">${p.badge}</span>` : ''}
        </div>
      </td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td style="color:var(--a-ivory);font-weight:600">₹${p.price.toLocaleString('en-IN')}</td>
      <td>${p.stock}</td>
      <td>⭐ ${p.rating}</td>
      <td><span class="a-status a-status-${ss}">${sl}</span></td>
      <td style="display:flex;gap:6px">
        <button class="a-action-btn" onclick="editProduct('${p.id}')">✏️</button>
        <button class="a-action-btn danger" onclick="deleteProduct('${p.id}')">🗑</button>
      </td>
    </tr>`;
  }).join('');
  renderPagination('productsPagination', filteredProducts.length, productsPage, p => { productsPage = p; renderProductsTable(); });
}

function filterProducts(q) {
  q = q.toLowerCase();
  filteredProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
  productsPage = 1;
  renderProductsTable();
}

function filterProductsByCategory(c) {
  filteredProducts = c ? PRODUCTS.filter(p => p.category === c) : [...PRODUCTS];
  productsPage = 1;
  renderProductsTable();
}

function openProductModal(id = null) {
  editingProductId = id;
  document.getElementById('productModalTitle').textContent = id ? 'Edit Product' : 'Add New Product';
  if (id) {
    const p = PRODUCTS.find(x => x.id === id);
    document.getElementById('pName').value     = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value    = p.price;
    document.getElementById('pOriginal').value = p.original;
    document.getElementById('pStock').value    = p.stock;
    document.getElementById('pImage').value    = p.image;
    document.getElementById('pBadge').value    = p.badge;
    document.getElementById('pSizes').value    = 'XS, S, M, L, XL, XXL';
  } else {
    ['pName','pPrice','pOriginal','pStock','pImage','pSizes'].forEach(i => { const el = document.getElementById(i); if (el) el.value = ''; });
    document.getElementById('pCategory').value = 'men';
    document.getElementById('pBadge').value    = '';
  }
  openModal('productModal');
}

function editProduct(id) { openProductModal(id); }

function saveProduct() {
  const name  = document.getElementById('pName').value.trim();
  const price = parseFloat(document.getElementById('pPrice').value);
  if (!name || !price) { showToastA('Please fill in all required fields', 'error'); return; }
  if (editingProductId) {
    const p = PRODUCTS.find(x => x.id === editingProductId);
    if (p) {
      p.name = name; p.category = document.getElementById('pCategory').value;
      p.price = price; p.original = parseFloat(document.getElementById('pOriginal').value) || price;
      p.stock = parseInt(document.getElementById('pStock').value) || 0;
      p.image = document.getElementById('pImage').value; p.badge = document.getElementById('pBadge').value;
    }
    showToastA('Product updated!', 'success');
  } else {
    PRODUCTS.unshift({ id: 'p' + Date.now(), name, category: document.getElementById('pCategory').value, price, original: parseFloat(document.getElementById('pOriginal').value) || price, stock: parseInt(document.getElementById('pStock').value) || 0, image: document.getElementById('pImage').value, rating: 0, badge: document.getElementById('pBadge').value });
    showToastA('Product added!', 'success');
  }
  filteredProducts = [...PRODUCTS];
  renderProductsTable(); renderTopProducts(); renderInventoryTable();
  closeModal('productModal');
}

function deleteProduct(id) {
  const i = PRODUCTS.findIndex(p => p.id === id);
  if (i > -1) { PRODUCTS.splice(i, 1); filteredProducts = [...PRODUCTS]; renderProductsTable(); renderInventoryTable(); showToastA('Product deleted', 'info'); }
}

// ===== USERS TABLE =====
function renderUsersTable() {
  const tbody = document.getElementById('usersTable');
  if (!tbody) return;
  tbody.innerHTML = filteredUsers.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--a-orange),#CC5500);display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:0.85rem;flex-shrink:0">${u.name[0]}</div>
          <span style="color:var(--a-ivory);font-weight:600">${u.name}</span>
        </div>
      </td>
      <td>${u.email}</td><td>${u.phone}</td><td>${u.orders}</td>
      <td style="color:var(--a-orange);font-weight:600">₹${u.spent.toLocaleString('en-IN')}</td>
      <td>${u.joined}</td>
      <td style="display:flex;gap:6px">
        <button class="a-action-btn" onclick="showToastA('Viewing ${u.name}','info')">👁</button>
        <button class="a-action-btn danger" onclick="showToastA('${u.name} blocked','info')">🚫</button>
      </td>
    </tr>`).join('');
}

function filterUsers(q) {
  q = q.toLowerCase();
  filteredUsers = USERS.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  renderUsersTable();
}

// ===== INVENTORY TABLE =====
function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTable');
  if (!tbody) return;
  tbody.innerHTML = PRODUCTS.map(p => {
    const s = p.stock === 0 ? 'outofstock' : p.stock < 15 ? 'lowstock' : 'instock';
    const l = p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock';
    return `<tr>
      <td style="display:flex;align-items:center;gap:10px">
        <img class="product-thumb" src="${p.image}" alt="" onerror="this.style.display='none'" />
        <span style="color:var(--a-ivory)">${p.name}</span>
      </td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td style="color:var(--a-gray);font-family:monospace">SKU-${p.id.toUpperCase()}</td>
      <td style="color:var(--a-ivory);font-weight:600">${p.stock}</td>
      <td><span class="a-status a-status-${s}">${l}</span></td>
      <td><button class="a-action-btn" onclick="restockProduct('${p.id}')">+ Restock</button></td>
    </tr>`;
  }).join('');
}

function restockProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (p) { p.stock += 50; renderInventoryTable(); renderProductsTable(); showToastA(`${p.name} restocked (+50 units)`, 'success'); }
}

// ===== COUPONS TABLE =====
function renderCouponsTable() {
  const tbody = document.getElementById('couponsTable');
  if (!tbody) return;
  tbody.innerHTML = COUPONS.map(c => `
    <tr>
      <td><span style="font-family:monospace;color:var(--a-orange);font-weight:700;background:rgba(255,107,0,0.1);padding:3px 10px;border-radius:6px">${c.code}</span></td>
      <td style="color:var(--a-ivory);font-weight:600">${c.discount}%</td>
      <td>${c.type}</td><td>${c.used} / ${c.max}</td><td>${c.expiry}</td>
      <td><span class="a-status ${c.active ? 'a-status-active' : 'a-status-inactive'}">${c.active ? 'Active' : 'Expired'}</span></td>
      <td style="display:flex;gap:6px">
        <button class="a-action-btn" onclick="toggleCoupon('${c.code}')">${c.active ? '⏸ Disable' : '▶ Enable'}</button>
        <button class="a-action-btn danger" onclick="deleteCoupon('${c.code}')">🗑</button>
      </td>
    </tr>`).join('');
}

function toggleCoupon(code) {
  const c = COUPONS.find(x => x.code === code);
  if (c) { c.active = !c.active; renderCouponsTable(); showToastA(`Coupon ${code} ${c.active ? 'enabled' : 'disabled'}`, 'info'); }
}

function deleteCoupon(code) {
  const i = COUPONS.findIndex(c => c.code === code);
  if (i > -1) { COUPONS.splice(i, 1); renderCouponsTable(); showToastA(`Coupon ${code} deleted`, 'info'); }
}

function openCouponModal() { openModal('couponModal'); }

function saveCoupon() {
  const code = document.getElementById('cCode').value.trim().toUpperCase();
  const discount = parseInt(document.getElementById('cDiscount').value);
  if (!code || !discount) { showToastA('Please fill in required fields', 'error'); return; }
  COUPONS.unshift({ code, discount, type: 'Percentage', used: 0, max: parseInt(document.getElementById('cUsage').value) || 100, expiry: document.getElementById('cExpiry').value || '2025-12-31', active: true });
  renderCouponsTable(); closeModal('couponModal'); showToastA(`Coupon ${code} created!`, 'success');
}

// ===== REVIEWS TABLE =====
function renderReviewsTable() {
  const tbody = document.getElementById('reviewsTable');
  if (!tbody) return;
  tbody.innerHTML = REVIEWS.map(r => `
    <tr>
      <td style="color:var(--a-ivory)">${r.customer}</td>
      <td>${r.product}</td>
      <td><span style="color:#D4A017">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></td>
      <td style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.text}</td>
      <td>${r.date}</td>
      <td style="display:flex;gap:6px">
        <button class="a-action-btn" onclick="showToastA('Review approved','success')">✅</button>
        <button class="a-action-btn danger" onclick="showToastA('Review removed','info')">🗑</button>
      </td>
    </tr>`).join('');
}

// ===== PAGINATION =====
function renderPagination(containerId, total, current, onPage) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = `<span style="font-size:0.78rem;color:var(--a-gray);margin-right:8px">Showing ${Math.min((current-1)*PAGE_SIZE+1,total)}–${Math.min(current*PAGE_SIZE,total)} of ${total}</span>`;
  if (current > 1) html += `<button class="a-page-btn" onclick="(${onPage})(${current-1})">‹</button>`;
  for (let i = 1; i <= pages; i++) html += `<button class="a-page-btn ${i===current?'active':''}" onclick="(${onPage})(${i})">${i}</button>`;
  if (current < pages) html += `<button class="a-page-btn" onclick="(${onPage})(${current+1})">›</button>`;
  el.innerHTML = html;
}

// ===== MODALS =====
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }

// ===== TOAST =====
function showToastA(message, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `a-toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span style="flex:1">${message}</span><span style="cursor:pointer;color:var(--a-gray);margin-left:8px" onclick="this.parentElement.remove()">✕</span>`;
  document.getElementById('adminToastContainer')?.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function adminLogout() {
  sessionStorage.removeItem('askr_admin');
  window.location.href = 'admin-login.html';
}
