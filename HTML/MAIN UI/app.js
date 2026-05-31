//  FreshTrack — app.js

// ── STATE ──────────────────────────────────────────────────
const state = {
  currentPage: 'categories',
  currentCategory: null,
  currentFoodId: null,
  consumed: 0,
  discarded: 0,
  totalAdded: 0,
  nextId: 17,
  profile: { name: 'Revana Alshea', email: 'revanaalshea@gmail.com' },
  foods: [
    { id:1,  name:'Apples',         emoji:'🍎', category:'Fruits & Vegetables', qty:5, expires:3 },
    { id:2,  name:'Bananas',        emoji:'🍌', category:'Fruits & Vegetables', qty:4, expires:3 },
    { id:3,  name:'Carrot',         emoji:'🥕', category:'Fruits & Vegetables', qty:6, expires:4 },
    { id:4,  name:'Tomato',         emoji:'🍅', category:'Fruits & Vegetables', qty:4, expires:4 },
    { id:5,  name:'Avocado Juice',  emoji:'🥑', category:'Drinks',              qty:4, expires:4 },
    { id:6,  name:'Lemonade',       emoji:'🍋', category:'Drinks',              qty:3, expires:3 },
    { id:7,  name:'Fresh Coffee',   emoji:'☕', category:'Drinks',              qty:6, expires:2 },
    { id:8,  name:'Milkshake',      emoji:'🥤', category:'Drinks',              qty:5, expires:4 },
    { id:9,  name:'Milk',           emoji:'🥛', category:'Dairy',               qty:4, expires:4 },
    { id:10, name:'Cheese',         emoji:'🧀', category:'Dairy',               qty:3, expires:3 },
    { id:11, name:'Yogurt',         emoji:'🫙', category:'Dairy',               qty:2, expires:1 },
    { id:12, name:'Ice Cream',      emoji:'🍦', category:'Dairy',               qty:5, expires:4 },
    { id:13, name:'Frozen Pizza',   emoji:'🍕', category:'Frozen',              qty:2, expires:4 },
    { id:14, name:'Frozen Nuggets', emoji:'🍱', category:'Frozen',              qty:3, expires:6 },
    { id:15, name:'Frozen Peas',    emoji:'🫛', category:'Frozen',              qty:5, expires:5 },
    { id:16, name:'Frozen Chicken', emoji:'🍗', category:'Frozen',              qty:2, expires:2 },
  ],
};
state.totalAdded = state.foods.reduce((s, f) => s + f.qty, 0);

// ── CATEGORIES CONFIG ───────────────────────────────────────
const CATEGORIES = [
  { name:'Fruits & Vegetables', emoji:'🍏', color:'#e8f8ee' },
  { name:'Drinks',              emoji:'🧃', color:'#e8f4fb' },
  { name:'Dairy',               emoji:'🥛', color:'#fef9ec' },
  { name:'Frozen',              emoji:'❄️',  color:'#eef4fb' },
];

// ── EMOJI GROUPS ────────────────────────────────────────────
const EMOJI_GROUPS = [
  { label: '🍎 Fruits',           emojis: ['🍎','🍏','🍊','🍋','🍋‍🟩','🍌','🍍','🥭','🍑','🍒','🍓','🫐','🥝','🍇','🍉','🍈','🍐','🫒','🥥','🍅','🍆','🥑'] },
  { label: '🥦 Vegetables',        emojis: ['🥕','🥦','🥬','🥒','🌽','🫑','🫛','🧄','🧅','🥔','🍠','🌶️','🫘','🥜','🫚','🥗','🌿','🪴'] },
  { label: '🍖 Meat & Seafood',    emojis: ['🍗','🍖','🥩','🐟','🐠','🦐','🦞','🦀','🦑','🥚','🥓','🍔','🌭','🍳'] },
  { label: '🥛 Dairy',             emojis: ['🥛','🧀','🍦','🍧','🍨','🍰','🧁','🫙','🧈','🥞','🧇','🍮','🎂'] },
  { label: '🍞 Bread & Grains',    emojis: ['🍞','🥐','🥖','🫓','🥨','🥯','🧆','🌮','🌯','🫔','🍝','🍜','🍲','🫕','🍛','🥟','🍱','🍣','🍤','🍙','🍘','🍚','🥘'] },
  { label: '🍰 Sweets & Snacks',   emojis: ['🍫','🍬','🍭','🍯','🍩','🍪','🍿','🥧','🍡','🧁','🍮','🥮'] },
  { label: '☕ Drinks',            emojis: ['☕','🍵','🧋','🥤','🧃','🍶','🍺','🍻','🥂','🍷','🍹','🍸','🫗','🧉','🥛','🍼','💧','🫖','🧊'] },
  { label: '🧊 Frozen Foods',      emojis: ['❄️','🧊','🍕','🍗','🫛','🥕','🍦','🍧','🥐','🧆','🥟','🍔'] },
  { label: '🌿 Condiments & Misc', emojis: ['🧂','🫚','🫙','🍯','🥫','🧴','🌶️','🫘','🥜','🍋','🧅','🧄'] },
];

// ── NAVIGATION ──────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  state.currentPage = page;

  const inCatGroup = ['foodlist', 'fooddetail', 'addfood', 'editfood'].includes(page);
  ['dashboard', 'categories', 'statistics', 'account'].forEach(n => {
    const btn = document.getElementById('nav-' + n);
    if (btn) btn.classList.toggle('active', page === n || (inCatGroup && n === 'categories'));
  });

  if (page === 'categories') renderCategories();
  if (page === 'foodlist')   renderFoodList();
  if (page === 'dashboard')  renderDashboard();
  if (page === 'statistics') renderStats();
  if (page === 'account')    renderAccount();
}

function backToFoodList() { navigate('foodlist'); }

// ── CATEGORIES ──────────────────────────────────────────────
function renderCategories() {
  const el = document.getElementById('categories-list');
  el.innerHTML = CATEGORIES.map(cat => {
    const foods = state.foods.filter(f => f.category === cat.name);
    const total = foods.reduce((s, f) => s + f.qty, 0);
    return `
      <div class="card-item" onclick="openCategory('${cat.name}')" style="background:${cat.color};">
        <span class="card-emoji">${cat.emoji}</span>
        <div style="flex:1">
          <div class="card-label">${cat.name}</div>
          <div class="card-sub">${foods.length} items · ${total} units</div>
        </div>
        <span style="color:#aaa;font-size:18px;">›</span>
      </div>`;
  }).join('');
}

// ── FOOD LIST ───────────────────────────────────────────────
function openCategory(catName) {
  state.currentCategory = catName;
  navigate('foodlist');
}

function renderFoodList() {
  const cat     = state.currentCategory;
  const catInfo = CATEGORIES.find(c => c.name === cat);
  const foods   = state.foods.filter(f => f.category === cat && f.qty > 0);

  document.getElementById('foodlist-title').textContent = cat;

  const el = document.getElementById('foodlist-items');
  if (foods.length === 0) {
    el.innerHTML = `<div style="color:var(--text-light);font-size:14px;padding:20px 0;">No items yet. Add some food!</div>`;
    return;
  }
  const bg = catInfo ? catInfo.color : '#fff';
  el.innerHTML = foods.map(f => `
    <div class="card-item" onclick="openFoodDetail(${f.id})" style="background:${bg}">
      <span class="card-emoji">${f.emoji}</span>
      <div style="flex:1">
        <div class="card-label">${f.name}, count: ${f.qty} ${expiryBadge(f.expires)}</div>
        <div class="card-sub">Expires in ${f.expires} day${f.expires !== 1 ? 's' : ''}</div>
      </div>
      <span style="color:#bbb;font-size:18px;">›</span>
    </div>`
  ).join('');
}

function expiryBadge(days) {
  if (days <= 1) return `<span class="expiry-badge expiry-urgent">${days}d</span>`;
  if (days <= 3) return `<span class="expiry-badge expiry-warn">${days}d</span>`;
  return `<span class="expiry-badge expiry-ok">${days}d</span>`;
}

// ── FOOD DETAIL ─────────────────────────────────────────────
function openFoodDetail(id) {
  state.currentFoodId = id;
  navigate('fooddetail');
  renderFoodDetail();
}

function renderFoodDetail() {
  const food = state.foods.find(f => f.id === state.currentFoodId);
  if (!food) return;
  document.getElementById('detail-emoji').textContent    = food.emoji;
  document.getElementById('detail-name').textContent     = food.name;
  document.getElementById('detail-category').textContent = 'Category: ' + food.category;
  document.getElementById('detail-qty').textContent      = food.qty;
  document.getElementById('detail-qty-input').value      = '';
  const d = new Date();
  d.setDate(d.getDate() + food.expires);
  document.getElementById('detail-expiry-input').value = d.toISOString().split('T')[0];
}

function consumeFood() {
  const food = state.foods.find(f => f.id === state.currentFoodId);
  const n = parseInt(document.getElementById('detail-qty-input').value);
  if (!n || n < 1)      { showToast('Enter a valid quantity first!'); return; }
  if (n > food.qty)     { showToast(`Only ${food.qty} available!`);   return; }
  food.qty -= n;
  state.consumed += n;
  showToast(`✓ Consumed ${n} × ${food.name}`);
  if (food.qty === 0)   { setTimeout(() => backToFoodList(), 1200); return; }
  renderFoodDetail();
}

function discardFood() {
  const food = state.foods.find(f => f.id === state.currentFoodId);
  const n = parseInt(document.getElementById('detail-qty-input').value);
  if (!n || n < 1)      { showToast('Enter a valid quantity first!'); return; }
  if (n > food.qty)     { showToast(`Only ${food.qty} available!`);   return; }
  food.qty -= n;
  state.discarded += n;
  showToast(`🗑 Discarded ${n} × ${food.name}`);
  if (food.qty === 0)   { setTimeout(() => backToFoodList(), 1200); return; }
  renderFoodDetail();
}

// ── EDIT FOOD ───────────────────────────────────────────────
function openEditFood() {
  const food = state.foods.find(f => f.id === state.currentFoodId);
  document.getElementById('edit-name').value                    = food.name;
  document.getElementById('edit-category').value                = food.category;
  document.getElementById('edit-category-display').textContent  = food.category;
  document.getElementById('edit-qty').value                     = food.qty;
  document.getElementById('edit-expires').value                 = food.expires;
  document.getElementById('edit-icon').value                    = food.emoji;
  document.getElementById('edit-icon-display').textContent      = food.emoji;
  navigate('editfood');
}

function saveEditFood() {
  const food = state.foods.find(f => f.id === state.currentFoodId);
  food.name    = document.getElementById('edit-name').value.trim()    || food.name;
  food.category= document.getElementById('edit-category').value;
  food.qty     = parseInt(document.getElementById('edit-qty').value)  || food.qty;
  food.expires = parseInt(document.getElementById('edit-expires').value) || food.expires;
  food.emoji   = document.getElementById('edit-icon').value;
  state.currentCategory = food.category;
  showToast('✓ Changes saved!');
  navigate('fooddetail');
  renderFoodDetail();
}

// ── ADD FOOD ────────────────────────────────────────────────
function openAddFood() {
  document.getElementById('add-name').value               = '';
  document.getElementById('add-category').value           = state.currentCategory || '';
  document.getElementById('add-qty').value                = '';
  document.getElementById('add-expires').value            = '';
  document.getElementById('add-icon').value               = '🍎';
  document.getElementById('add-icon-display').textContent = '🍎';
  navigate('addfood');
}

function saveNewFood() {
  const name    = document.getElementById('add-name').value.trim();
  const cat     = document.getElementById('add-category').value;
  const qty     = parseInt(document.getElementById('add-qty').value);
  const expires = parseInt(document.getElementById('add-expires').value);
  const emoji   = document.getElementById('add-icon').value;
  if (!name || !cat || !qty || !expires) { showToast('Please fill all fields!'); return; }
  state.foods.push({ id: state.nextId++, name, emoji, category: cat, qty, expires });
  state.totalAdded += qty;
  state.currentCategory = cat;
  showToast(`✓ ${name} added!`);
  navigate('foodlist');
}

// ── DASHBOARD ───────────────────────────────────────────────
function renderDashboard() {
  const totalQty = state.foods.filter(f => f.qty > 0).reduce((s, f) => s + f.qty, 0);
  const urgent   = state.foods.filter(f => f.expires <= 2 && f.qty > 0);
  const el = document.getElementById('dashboard-content');

  el.innerHTML = `
    <div class="stat-blocks" style="margin-bottom:16px">
      <div class="stat-block" style="background:linear-gradient(135deg,#2d7a3e,#52b86a)">
        <div class="ico">📦</div><div class="num">${totalQty}</div><div class="lbl">In Stock</div>
      </div>
      <div class="stat-block" style="background:linear-gradient(135deg,#4a7c3f,#85c66b)">
        <div class="ico">🍽️</div><div class="num">${state.consumed}</div><div class="lbl">Consumed</div>
      </div>
      <div class="stat-block" style="background:linear-gradient(135deg,#b03a2e,#e05c4e)">
        <div class="ico">🗑️</div><div class="num">${state.discarded}</div><div class="lbl">Discarded</div>
      </div>
      <div class="stat-block" style="background:linear-gradient(135deg,#1e6299,#3a9bd5)">
        <div class="ico">⏰</div><div class="num">${urgent.length}</div><div class="lbl">Expiring Soon</div>
      </div>
    </div>
    ${urgent.length > 0 ? `
      <div style="background:#fff8f8;border-radius:var(--radius);padding:16px 20px;max-width:680px;border:1.5px solid #f5c6c6;box-shadow:var(--card-shadow);margin-bottom:16px">
        <div style="font-size:14px;font-weight:700;color:#c0392b;margin-bottom:12px;">⚠️ Expiring in ≤ 2 days</div>
        <div class="card-list">
          ${urgent.map(f => `
            <div class="card-item" onclick="state.currentCategory='${f.category}';openFoodDetail(${f.id})" style="background:#fff;">
              <span class="card-emoji">${f.emoji}</span>
              <div style="flex:1">
                <div class="card-label">${f.name} <span style="font-weight:400;font-size:13px;color:#888">× ${f.qty}</span></div>
                <div class="card-sub" style="color:#c0392b">Expires in ${f.expires} day${f.expires !== 1 ? 's' : ''}</div>
              </div>
              <span style="color:#ccc;font-size:18px">›</span>
            </div>`
          ).join('')}
        </div>
      </div>`
    : `<div style="background:#f0fbf4;border-radius:var(--radius);padding:14px 18px;max-width:680px;border:1.5px solid #b7e4c7;font-size:14px;font-weight:600;color:var(--green-dark)">
         ✅ No items expiring soon — you're on top of it!
       </div>`}
  `;
}

// ── STATISTICS ──────────────────────────────────────────────
function renderStats() {
  const foods      = state.foods.filter(f => f.qty > 0);
  const totalQty   = foods.reduce((s, f) => s + f.qty, 0);
  const totalAll   = totalQty + state.consumed + state.discarded;
  const wasteRate  = totalAll > 0 ? Math.round((state.discarded / totalAll) * 100) : 0;
  const catColors  = ['#3cb371', '#5bb8c4', '#f0a64e', '#7b7dd1'];
  const catData    = CATEGORIES.map((cat, i) => {
    const qty = foods.filter(f => f.category === cat.name).reduce((s, f) => s + f.qty, 0);
    return { name: cat.name, emoji: cat.emoji, qty, color: catColors[i] };
  });
  const maxQty = Math.max(...catData.map(c => c.qty), 1);
  const el = document.getElementById('statistics-content');

  el.innerHTML = `
    <div class="stats-grid">
      <div class="stats-mini-card">
        <div class="sm-ico">📦</div>
        <div class="sm-val" style="color:var(--green-dark)">${totalQty}</div>
        <div class="sm-lbl">Current Stock</div>
      </div>
      <div class="stats-mini-card">
        <div class="sm-ico">🍽️</div>
        <div class="sm-val" style="color:#3cb371">${state.consumed}</div>
        <div class="sm-lbl">Total Consumed</div>
      </div>
      <div class="stats-mini-card">
        <div class="sm-ico">🗑️</div>
        <div class="sm-val" style="color:#e05c4e">${state.discarded}</div>
        <div class="sm-lbl">Total Discarded</div>
      </div>
      <div class="stats-mini-card">
        <div class="sm-ico">♻️</div>
        <div class="sm-val" style="color:${wasteRate > 20 ? '#c0392b' : '#3cb371'}">${wasteRate}%</div>
        <div class="sm-lbl">Waste Rate</div>
      </div>
    </div>

    <div class="chart-wrap">
      <div class="chart-title">📊 Stock by Category</div>
      <div class="bar-chart-row">
        ${catData.map(c => `
          <div class="bar-col">
            <div class="bar-val">${c.qty}</div>
            <div class="bar-fill" style="background:${c.color};height:${Math.round((c.qty / maxQty) * 90)}px"></div>
            <div class="bar-label">${c.emoji}<br>${c.name.split(' ')[0]}</div>
          </div>`
        ).join('')}
      </div>
    </div>

    <div class="chart-wrap">
      <div class="chart-title">🥧 Usage Breakdown</div>
      <div class="donut-row">
        <svg width="130" height="130" viewBox="0 0 42 42" style="flex-shrink:0">
          ${donutSegments(totalQty, state.consumed, state.discarded)}
        </svg>
        <div class="donut-legend">
          <div class="legend-item"><div class="legend-dot" style="background:#3cb371"></div><span>In Stock <strong>${totalQty}</strong></span></div>
          <div class="legend-item"><div class="legend-dot" style="background:#5bb8c4"></div><span>Consumed <strong>${state.consumed}</strong></span></div>
          <div class="legend-item"><div class="legend-dot" style="background:#e05c4e"></div><span>Discarded <strong>${state.discarded}</strong></span></div>
        </div>
      </div>
    </div>

    <div class="chart-wrap">
      <div class="chart-title">⏳ Expiry Risk</div>
      ${[
        { label:'Expires today / tomorrow', days:1, color:'#e05c4e' },
        { label:'Expires in 2–3 days',      days:3, color:'#f0a64e' },
        { label:'Expires in 4+ days',       days:99, color:'#3cb371' },
      ].map(r => {
        const cat_n = r.days === 1  ? foods.filter(f => f.expires <= 1).reduce((s,f) => s+f.qty, 0)
                    : r.days === 3  ? foods.filter(f => f.expires >= 2 && f.expires <= 3).reduce((s,f) => s+f.qty, 0)
                                    : foods.filter(f => f.expires >= 4).reduce((s,f) => s+f.qty, 0);
        const pct = totalQty > 0 ? Math.round((cat_n / totalQty) * 100) : 0;
        return `
          <div class="stat-bar-wrap">
            <div class="stat-bar-label">
              <span style="color:${r.color};font-weight:600">${r.label}</span>
              <span>${cat_n} units (${pct}%)</span>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width:${pct}%;background:${r.color}"></div>
            </div>
          </div>`;
      }).join('')}
    </div>
  `;
}

function donutSegments(stock, consumed, discarded) {
  const total = stock + consumed + discarded;
  if (total === 0) return `<circle cx="21" cy="21" r="15.9" fill="none" stroke="#eee" stroke-width="6"/>`;
  const colors = ['#3cb371', '#5bb8c4', '#e05c4e'];
  const values = [stock, consumed, discarded];
  const r = 15.9, circ = 2 * Math.PI * r;
  let offset = 0;
  const segs = values.map((v, i) => {
    const dash = circ * (v / total);
    const seg  = `<circle cx="21" cy="21" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="6"
      stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${-offset}"
      transform="rotate(-90 21 21)" stroke-linecap="butt"/>`;
    offset += dash;
    return seg;
  });
  return segs.join('') +
    `<text x="21" y="24" text-anchor="middle" font-size="7"
      font-family="DM Sans,sans-serif" fill="#333" font-weight="700">${total}</text>`;
}

// ── ACCOUNT ─────────────────────────────────────────────────
function renderAccount() {
  document.getElementById('acc-name').textContent  = state.profile.name;
  document.getElementById('acc-email').textContent = state.profile.email;
  const base = state.totalAdded || 1;
  document.getElementById('acc-summary').innerHTML = `
    <div class="stat-bar-wrap" style="margin-bottom:10px">
      <div class="stat-bar-label"><span>Total Items Added</span><span><strong>${state.totalAdded}</strong></span></div>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:100%;background:#3cb371"></div></div>
    </div>
    <div class="stat-bar-wrap" style="margin-bottom:10px">
      <div class="stat-bar-label"><span>Items Consumed</span><span><strong>${state.consumed}</strong></span></div>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${Math.round(state.consumed/base*100)}%;background:#5bb8c4"></div></div>
    </div>
    <div class="stat-bar-wrap">
      <div class="stat-bar-label"><span>Items Discarded</span><span><strong>${state.discarded}</strong></span></div>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${Math.round(state.discarded/base*100)}%;background:#e05c4e"></div></div>
    </div>
  `;
}

function saveProfile() {
  state.profile.name  = document.getElementById('ep-name').value.trim()  || state.profile.name;
  state.profile.email = document.getElementById('ep-email').value.trim() || state.profile.email;
  showToast('✓ Profile updated!');
  navigate('account');
}

// ── SEARCH ──────────────────────────────────────────────────
function handleSearch(q) {
  const val = q.trim();
  if (!val) return;
  const food = state.foods.find(f => f.name.toLowerCase().includes(val.toLowerCase()) && f.qty > 0);
  if (!food) { showToast('No items found.'); return; }
  state.currentCategory = food.category;
  openFoodDetail(food.id);
  document.getElementById('searchInput').value = '';
}

// ── TOAST ───────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── EMOJI PICKER ────────────────────────────────────────────
function buildEmojiDropdown(pickerId) {
  const dropdown = document.getElementById(pickerId + '-icon-dropdown');
  if (dropdown.dataset.built) return;
  dropdown.dataset.built = '1';
  dropdown.innerHTML = EMOJI_GROUPS.map(g => `
    <div class="emoji-group-label">${g.label}</div>
    <div class="emoji-grid">
      ${g.emojis.map(e => `<button type="button" class="emoji-btn" onclick="selectEmoji('${pickerId}','${e}')">${e}</button>`).join('')}
    </div>`
  ).join('');
}

function togglePicker(pickerId) {
  buildEmojiDropdown(pickerId);
  const dd     = document.getElementById(pickerId + '-icon-dropdown');
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.emoji-dropdown').forEach(d => d.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

function selectEmoji(pickerId, emoji) {
  document.getElementById(pickerId + '-icon').value               = emoji;
  document.getElementById(pickerId + '-icon-display').textContent = emoji;
  document.getElementById(pickerId + '-icon-dropdown').classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.emoji-picker-wrap')) {
    document.querySelectorAll('.emoji-dropdown').forEach(d => d.classList.remove('open'));
  }
});

// ── INIT ────────────────────────────────────────────────────
renderCategories();
