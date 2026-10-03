/**
 * KFC Landing Page Application
 * Pure Vanilla JavaScript (ES6+)
 * Reads menu data dynamically from CSV at ./data/menu.csv
 * Integrated Shopping Cart Module (Pure Frontend, LocalStorage persistence)
 */

// Application State
const appState = {
  menuItems: [],
  filteredItems: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  currentModalItem: null,
  modalQuantity: 1,
  cart: [] // Shopping cart state: [{ id, name, price, image_url, quantity }]
};

// DOM Elements Cache
const elements = {
  menuGrid: document.getElementById('menu-grid'),
  featuredContainer: document.getElementById('featured-container'),
  categoryFilters: document.getElementById('category-filters'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  sortSelect: document.getElementById('sortSelect'),
  resultsCount: document.getElementById('resultsCount'),
  activeFilterBadge: document.getElementById('activeFilterBadge'),
  menuLoading: document.getElementById('menu-loading'),
  menuError: document.getElementById('menu-error'),
  menuEmpty: document.getElementById('menu-empty'),
  retryFetchBtn: document.getElementById('retryFetchBtn'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  
  // Product Detail Modal Elements
  productModalEl: document.getElementById('productModal'),
  modalProductImg: document.getElementById('modalProductImg'),
  modalProductTitle: document.getElementById('modalProductTitle'),
  modalProductPrice: document.getElementById('modalProductPrice'),
  modalCategoryBadge: document.getElementById('modalCategoryBadge'),
  modalAvailabilityBadge: document.getElementById('modalAvailabilityBadge'),
  modalProductDesc: document.getElementById('modalProductDesc'),
  modalQtyValue: document.getElementById('modalQtyValue'),
  modalQtyMinus: document.getElementById('modalQtyMinus'),
  modalQtyPlus: document.getElementById('modalQtyPlus'),
  modalAddToCartBtn: document.getElementById('modalAddToCartBtn'),
  
  // Cart Offcanvas Elements
  cartOpenBtn: document.getElementById('cartOpenBtn'),
  cartBadge: document.getElementById('cartBadge'),
  cartOffcanvasEl: document.getElementById('cartOffcanvas'),
  cartHeaderSubtitle: document.getElementById('cartHeaderSubtitle'),
  cartEmptyState: document.getElementById('cartEmptyState'),
  cartEmptyExploreBtn: document.getElementById('cartEmptyExploreBtn'),
  cartItemsList: document.getElementById('cartItemsList'),
  cartFooter: document.getElementById('cartFooter'),
  cartTotalQty: document.getElementById('cartTotalQty'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  cartCheckoutBtn: document.getElementById('cartCheckoutBtn'),
  cartClearBtn: document.getElementById('cartClearBtn'),

  // Clear Cart Confirm Modal
  clearCartConfirmModalEl: document.getElementById('clearCartConfirmModal'),
  confirmClearCartBtn: document.getElementById('confirmClearCartBtn'),

  // Checkout Modal Elements
  checkoutModalEl: document.getElementById('checkoutModal'),
  checkoutForm: document.getElementById('checkoutForm'),
  checkoutName: document.getElementById('checkoutName'),
  checkoutPhone: document.getElementById('checkoutPhone'),
  checkoutAddress: document.getElementById('checkoutAddress'),
  checkoutNote: document.getElementById('checkoutNote'),
  checkoutSummaryItems: document.getElementById('checkoutSummaryItems'),
  checkoutSummarySubtotal: document.getElementById('checkoutSummarySubtotal'),
  checkoutSummaryTotal: document.getElementById('checkoutSummaryTotal'),

  // Order Success Modal Elements
  orderSuccessModalEl: document.getElementById('orderSuccessModal'),
  successOrderId: document.getElementById('successOrderId'),
  successOrderCustomer: document.getElementById('successOrderCustomer'),
  successOrderPhone: document.getElementById('successOrderPhone'),
  successOrderAddress: document.getElementById('successOrderAddress'),
  successOrderTotal: document.getElementById('successOrderTotal'),
  successContinueBtn: document.getElementById('successContinueBtn'),
  successHomeBtn: document.getElementById('successHomeBtn'),

  // Toast
  actionToastEl: document.getElementById('actionToast'),
  toastMessage: document.getElementById('toastMessage')
};

// Bootstrap Component Instances
let productModalInstance = null;
let cartOffcanvasInstance = null;
let clearCartConfirmModalInstance = null;
let checkoutModalInstance = null;
let orderSuccessModalInstance = null;
let toastInstance = null;

/**
 * Initialize Bootstrap instances safely
 */
function initBootstrapComponents() {
  if (typeof bootstrap !== 'undefined') {
    if (elements.productModalEl) {
      productModalInstance = new bootstrap.Modal(elements.productModalEl);
    }
    if (elements.cartOffcanvasEl) {
      cartOffcanvasInstance = new bootstrap.Offcanvas(elements.cartOffcanvasEl);
    }
    if (elements.clearCartConfirmModalEl) {
      clearCartConfirmModalInstance = new bootstrap.Modal(elements.clearCartConfirmModalEl);
    }
    if (elements.checkoutModalEl) {
      checkoutModalInstance = new bootstrap.Modal(elements.checkoutModalEl);
    }
    if (elements.orderSuccessModalEl) {
      orderSuccessModalInstance = new bootstrap.Modal(elements.orderSuccessModalEl);
    }
    if (elements.actionToastEl) {
      toastInstance = new bootstrap.Toast(elements.actionToastEl, { delay: 3500 });
    }
  }
}

/**
 * Display a user feedback toast notification
 * @param {string} message 
 */
function showToast(message) {
  if (elements.toastMessage && toastInstance) {
    elements.toastMessage.textContent = message;
    toastInstance.show();
  }
}

/**
 * Helper to escape HTML characters for safety
 * @param {string} str 
 * @returns {string} escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format numeric price to Vietnamese Dong (e.g. 59000 -> "59.000 ₫")
 * @param {number} price 
 * @returns {string} formatted price
 */
function formatPrice(price) {
  const num = Number(price);
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}

/**
 * RFC-4180 compliant CSV parser
 * Handles commas, quoted values, double quotes, and newlines
 * @param {string} text 
 * @returns {Array<Object>} parsed records
 */
function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];

  const rows = [];
  let currentRow = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
      currentRow.push(currentToken.trim());
      currentToken = '';
      if (currentRow.some(val => val.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentToken += char;
    }
  }

  // Push last field & row if present
  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some(val => val.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().toLowerCase());
  const records = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index] !== undefined ? row[index] : '';
    });
    records.push(item);
  }

  return records;
}

/**
 * Validate and clean a parsed item
 * @param {Object} item 
 * @returns {boolean} valid status
 */
function validateItem(item) {
  if (!item || typeof item !== 'object') return false;
  if (!item.id || !item.name || !item.category) return false;
  return true;
}

/**
 * Normalize raw parsed CSV object into a strongly-typed model
 * @param {Object} raw 
 * @returns {Object} normalized menu item
 */
function normalizeItem(raw) {
  const rawPrice = String(raw.price || '').replace(/[^\d.-]/g, '');
  const numericPrice = parseFloat(rawPrice) || 0;
  
  const rawFeatured = String(raw.featured || '').trim().toLowerCase();
  const rawAvailable = String(raw.available || '').trim().toLowerCase();

  return {
    id: String(raw.id || '').trim(),
    name: String(raw.name || '').trim(),
    category: String(raw.category || '').trim(),
    description: String(raw.description || '').trim(),
    price: numericPrice,
    image_url: raw.image_url ? String(raw.image_url).trim() : 'assets/images/placeholder.svg',
    featured: rawFeatured === 'true' || rawFeatured === '1',
    available: rawAvailable !== 'false' && rawAvailable !== '0'
  };
}

/**
 * Extract unique categories from items array
 * @param {Array<Object>} items 
 * @returns {Array<string>} list of unique categories
 */
function getCategories(items) {
  const categorySet = new Set();
  items.forEach(item => {
    if (item.category) {
      categorySet.add(item.category);
    }
  });
  return Array.from(categorySet);
}

/**
 * Filter items by category
 * @param {Array<Object>} items 
 * @param {string} category 
 * @returns {Array<Object>}
 */
function filterByCategory(items, category) {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category.toLowerCase() === category.toLowerCase());
}

/**
 * Search items across name, category, and description
 * @param {Array<Object>} items 
 * @param {string} query 
 * @returns {Array<Object>}
 */
function searchItems(items, query) {
  if (!query || !query.trim()) return items;
  const q = query.trim().toLowerCase();
  return items.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(q);
    const catMatch = item.category.toLowerCase().includes(q);
    const descMatch = item.description.toLowerCase().includes(q);
    return nameMatch || catMatch || descMatch;
  });
}

/**
 * Sort items based on criteria
 * @param {Array<Object>} items 
 * @param {string} sortKey 
 * @returns {Array<Object>} sorted array
 */
function sortItems(items, sortKey) {
  const cloned = [...items];
  switch (sortKey) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    default:
      return cloned;
  }
}

/**
 * Apply all current filters, search and sorting to state
 */
function applyFiltersAndRender() {
  let result = [...appState.menuItems];

  // 1. Filter by category
  result = filterByCategory(result, appState.selectedCategory);

  // 2. Search
  result = searchItems(result, appState.searchQuery);

  // 3. Sort
  result = sortItems(result, appState.sortBy);

  appState.filteredItems = result;

  // Update Result Count Meta
  if (elements.resultsCount) {
    if (appState.searchQuery) {
      elements.resultsCount.textContent = `Tìm thấy ${result.length} món khớp với "${escapeHtml(appState.searchQuery)}"`;
    } else if (appState.selectedCategory !== 'all') {
      elements.resultsCount.textContent = `Hiển thị ${result.length} món trong danh mục "${escapeHtml(appState.selectedCategory)}"`;
    } else {
      elements.resultsCount.textContent = `Tổng cộng ${result.length} món ăn`;
    }
  }

  // Handle Empty State
  if (result.length === 0) {
    elements.menuGrid.innerHTML = '';
    elements.menuEmpty.classList.remove('d-none');
  } else {
    elements.menuEmpty.classList.add('d-none');
    renderMenu(result);
  }
}

/**
 * Generate product card HTML element with dedicated "Thêm vào giỏ" button
 * @param {Object} item 
 * @param {boolean} isFeaturedSection
 * @returns {HTMLElement} card column element
 */
function createProductCard(item, isFeaturedSection = false) {
  const col = document.createElement('div');
  col.className = isFeaturedSection 
    ? 'col-12 col-md-6 col-lg-3' 
    : 'col-12 col-sm-6 col-lg-4 col-xl-3';

  const card = document.createElement('div');
  card.className = `product-card ${!item.available ? 'unavailable' : ''}`;
  card.setAttribute('data-id', item.id);

  // Card Badges
  const badgeCategory = `<span class="badge badge-kfc card-badge-top-left">${escapeHtml(item.category)}</span>`;
  const badgeFeatured = item.featured ? `<span class="badge badge-deal card-badge-top-right"><i class="bi bi-fire me-1"></i>Hot</span>` : '';

  // Image Fallback Handling
  const imgSrc = item.image_url || 'assets/images/placeholder.svg';

  card.innerHTML = `
    <div class="card-img-container view-detail-trigger" style="cursor: pointer;" title="Nhấp để xem chi tiết ${escapeHtml(item.name)}">
      ${badgeCategory}
      ${badgeFeatured}
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.svg';">
    </div>
    <div class="card-body-content">
      <h3 class="product-title view-detail-trigger" style="cursor: pointer;">${escapeHtml(item.name)}</h3>
      <p class="product-desc" title="${escapeHtml(item.description)}">${escapeHtml(item.description || 'Hương vị thơm ngon đặc trưng chuẩn KFC.')}</p>
      <div class="product-bottom-row">
        <div class="product-price">${formatPrice(item.price)}</div>
        <div class="d-flex align-items-center gap-1">
          <button type="button" class="btn-card-action add-to-cart-btn" data-action="add" data-id="${escapeHtml(item.id)}" ${!item.available ? 'disabled' : ''} aria-label="Thêm ${escapeHtml(item.name)} vào giỏ hàng">
            <i class="bi bi-cart-plus-fill" aria-hidden="true"></i>
            <span>${item.available ? 'Thêm giỏ' : 'Hết hàng'}</span>
          </button>
          <button type="button" class="btn btn-outline-secondary btn-sm rounded-circle p-2 view-detail-btn" data-action="view" data-id="${escapeHtml(item.id)}" aria-label="Xem chi tiết ${escapeHtml(item.name)}" title="Xem chi tiết">
            <i class="bi bi-eye-fill"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach Add to Cart listener
  const addBtn = card.querySelector('.add-to-cart-btn');
  if (addBtn && item.available) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(item.id, 1);
    });
  }

  // Attach Detail Modal triggers
  const viewTriggers = card.querySelectorAll('.view-detail-trigger, .view-detail-btn');
  viewTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      showProductModal(item.id);
    });
  });

  col.appendChild(card);
  return col;
}

/**
 * Render menu items into the grid
 * @param {Array<Object>} items 
 */
function renderMenu(items) {
  elements.menuGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const cardEl = createProductCard(item, false);
    fragment.appendChild(cardEl);
  });

  elements.menuGrid.appendChild(fragment);
}

/**
 * Render featured combo items from CSV
 * @param {Array<Object>} items 
 */
function renderFeatured(items) {
  if (!elements.featuredContainer) return;

  const featured = items.filter(item => item.featured === true);
  elements.featuredContainer.innerHTML = '';

  if (featured.length === 0) {
    elements.featuredContainer.innerHTML = `
      <div class="col-12 text-center py-4 text-muted">
        <p>Hiện chưa có combo ưu đãi đặc biệt.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();
  featured.forEach(item => {
    const cardEl = createProductCard(item, true);
    fragment.appendChild(cardEl);
  });

  elements.featuredContainer.appendChild(fragment);
}

/**
 * Dynamically render category filter buttons
 * @param {Array<string>} categories 
 */
function renderCategoryFilters(categories) {
  if (!elements.categoryFilters) return;

  elements.categoryFilters.innerHTML = '';

  // All button
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = `btn-filter-category ${appState.selectedCategory === 'all' ? 'active' : ''}`;
  allBtn.setAttribute('data-category', 'all');
  allBtn.textContent = 'Tất cả';
  allBtn.addEventListener('click', () => handleCategoryChange('all'));
  elements.categoryFilters.appendChild(allBtn);

  // Each unique category
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn-filter-category ${appState.selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`;
    btn.setAttribute('data-category', cat);
    btn.textContent = cat;
    btn.addEventListener('click', () => handleCategoryChange(cat));
    elements.categoryFilters.appendChild(btn);
  });
}

/**
 * Handle category change event
 * @param {string} category 
 */
function handleCategoryChange(category) {
  appState.selectedCategory = category;

  // Update active pill button state
  const buttons = elements.categoryFilters.querySelectorAll('.btn-filter-category');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyFiltersAndRender();
}

/**
 * Open Product Detail Modal with selected item data
 * @param {string} itemId 
 */
function showProductModal(itemId) {
  const item = appState.menuItems.find(i => i.id === itemId);
  if (!item) return;

  appState.currentModalItem = item;
  appState.modalQuantity = 1;

  if (elements.modalProductTitle) elements.modalProductTitle.textContent = item.name;
  if (elements.modalProductPrice) elements.modalProductPrice.textContent = formatPrice(item.price);
  if (elements.modalCategoryBadge) elements.modalCategoryBadge.textContent = item.category;
  if (elements.modalProductDesc) elements.modalProductDesc.textContent = item.description || 'Thơm ngon chuẩn vị truyền thống KFC.';
  if (elements.modalQtyValue) elements.modalQtyValue.textContent = '1';

  if (elements.modalProductImg) {
    elements.modalProductImg.src = item.image_url || 'assets/images/placeholder.svg';
    elements.modalProductImg.alt = item.name;
    elements.modalProductImg.onerror = function() {
      this.onerror = null;
      this.src = 'assets/images/placeholder.svg';
    };
  }

  if (elements.modalAvailabilityBadge) {
    if (item.available) {
      elements.modalAvailabilityBadge.className = 'badge bg-success';
      elements.modalAvailabilityBadge.textContent = 'Còn hàng';
      elements.modalAddToCartBtn.disabled = false;
      elements.modalAddToCartBtn.innerHTML = `<i class="bi bi-cart-plus-fill me-1" aria-hidden="true"></i><span>Thêm Vào Giỏ Hàng</span>`;
    } else {
      elements.modalAvailabilityBadge.className = 'badge bg-secondary';
      elements.modalAvailabilityBadge.textContent = 'Tạm hết';
      elements.modalAddToCartBtn.disabled = true;
      elements.modalAddToCartBtn.innerHTML = `<i class="bi bi-x-circle me-1" aria-hidden="true"></i><span>Sản Phẩm Tạm Hết</span>`;
    }
  }

  if (productModalInstance) {
    productModalInstance.show();
  }
}

/* ==========================================================================
   Shopping Cart Module Implementation (Frontend only, LocalStorage)
   ========================================================================== */

const CART_STORAGE_KEY = 'kfc_demo_cart';

/**
 * Load cart from localStorage with schema validation & safety
 */
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      appState.cart = [];
      return;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      appState.cart = [];
      return;
    }

    // Validate each item structure
    const validItems = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === 'object' &&
        item.id &&
        item.name &&
        typeof item.price === 'number' &&
        !isNaN(item.price) &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
      ) {
        validItems.push({
          id: String(item.id).trim(),
          name: String(item.name).trim(),
          price: Number(item.price),
          image_url: item.image_url ? String(item.image_url).trim() : 'assets/images/placeholder.svg',
          quantity: Math.floor(item.quantity)
        });
      }
    }
    appState.cart = validItems;
  } catch (err) {
    console.warn('[Cart] LocalStorage contains corrupted cart data. Resetting to empty.', err);
    appState.cart = [];
  }
}

/**
 * Persist cart to localStorage and refresh UI
 */
function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(appState.cart));
  } catch (err) {
    console.error('[Cart] Failed to save cart into localStorage:', err);
  }
  updateCartBadge();
  renderCart();
}

/**
 * Total count of items (sum of quantities)
 * @returns {number}
 */
function getCartCount() {
  return appState.cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Total subtotal of items in cart
 * @returns {number}
 */
function getCartSubtotal() {
  return appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Update Navbar Cart Badge and aria labels
 */
function updateCartBadge() {
  const totalCount = getCartCount();
  if (elements.cartBadge) {
    elements.cartBadge.textContent = String(totalCount);
  }
  if (elements.cartOpenBtn) {
    elements.cartOpenBtn.setAttribute('aria-label', `Xem giỏ hàng, hiện có ${totalCount} sản phẩm`);
  }
  if (elements.cartHeaderSubtitle) {
    elements.cartHeaderSubtitle.textContent = `${totalCount} phần món ăn`;
  }
}

/**
 * Add a product to the cart
 * @param {string} productId 
 * @param {number} quantity 
 */
function addToCart(productId, quantity = 1) {
  const product = appState.menuItems.find(p => p.id === productId);
  if (!product) return;

  if (!product.available) {
    showToast('Sản phẩm hiện đang tạm hết hàng!');
    return;
  }

  const addQty = Math.max(1, parseInt(quantity, 10) || 1);
  const existingItem = appState.cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += addQty;
  } else {
    appState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || 'assets/images/placeholder.svg',
      quantity: addQty
    });
  }

  saveCart();
  showToast(`✓ Đã thêm ${addQty > 1 ? addQty + 'x ' : ''}${product.name} vào giỏ hàng!`);
}

/**
 * Remove an item completely from cart
 * @param {string} productId 
 */
function removeFromCart(productId) {
  const item = appState.cart.find(i => i.id === productId);
  const itemName = item ? item.name : 'Món ăn';
  appState.cart = appState.cart.filter(i => i.id !== productId);
  saveCart();
  showToast(`Đã xóa "${itemName}" khỏi giỏ hàng.`);
}

/**
 * Increase quantity of an item by 1
 * @param {string} productId 
 */
function increaseQuantity(productId) {
  const item = appState.cart.find(i => i.id === productId);
  if (item) {
    item.quantity += 1;
    saveCart();
  }
}

/**
 * Decrease quantity of an item by 1. If reaches 0, remove item.
 * @param {string} productId 
 */
function decreaseQuantity(productId) {
  const item = appState.cart.find(i => i.id === productId);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
    saveCart();
  } else {
    removeFromCart(productId);
  }
}

/**
 * Clear all items in the cart
 * @param {boolean} showNotification 
 */
function clearCart(showNotification = true) {
  appState.cart = [];
  saveCart();
  if (showNotification) {
    showToast('Đã xóa toàn bộ giỏ hàng.');
  }
}

/**
 * Render Cart Items inside the Offcanvas Drawer
 */
function renderCart() {
  if (!elements.cartItemsList) return;

  const totalItems = getCartCount();
  const subtotal = getCartSubtotal();

  // Handle Empty State
  if (appState.cart.length === 0) {
    elements.cartItemsList.innerHTML = '';
    if (elements.cartEmptyState) elements.cartEmptyState.classList.remove('d-none');
    if (elements.cartFooter) elements.cartFooter.classList.add('d-none');
    return;
  }

  // Has items
  if (elements.cartEmptyState) elements.cartEmptyState.classList.add('d-none');
  if (elements.cartFooter) elements.cartFooter.classList.remove('d-none');

  if (elements.cartTotalQty) elements.cartTotalQty.textContent = `${totalItems} phần`;
  if (elements.cartSubtotal) elements.cartSubtotal.textContent = formatPrice(subtotal);

  elements.cartItemsList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  appState.cart.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item-card';
    itemCard.setAttribute('data-id', item.id);

    const lineTotal = item.price * item.quantity;
    const imgSrc = item.image_url || 'assets/images/placeholder.svg';

    itemCard.innerHTML = `
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(item.name)}" class="cart-item-img" onerror="this.onerror=null;this.src='assets/images/placeholder.svg';">
      <div class="cart-item-info">
        <div class="d-flex justify-content-between align-items-start">
          <h4 class="cart-item-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h4>
          <button type="button" class="cart-item-remove-btn" data-action="remove" data-id="${escapeHtml(item.id)}" aria-label="Xóa ${escapeHtml(item.name)} khỏi giỏ hàng">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-controls">
          <div class="cart-qty-stepper" role="group" aria-label="Điều chỉnh số lượng cho ${escapeHtml(item.name)}">
            <button type="button" class="cart-stepper-btn" data-action="decrease" data-id="${escapeHtml(item.id)}" aria-label="Giảm số lượng ${escapeHtml(item.name)}">-</button>
            <span class="cart-stepper-qty" aria-live="polite">${item.quantity}</span>
            <button type="button" class="cart-stepper-btn" data-action="increase" data-id="${escapeHtml(item.id)}" aria-label="Tăng số lượng ${escapeHtml(item.name)}">+</button>
          </div>
          <div class="cart-line-total">${formatPrice(lineTotal)}</div>
        </div>
      </div>
    `;

    fragment.appendChild(itemCard);
  });

  elements.cartItemsList.appendChild(fragment);
}

/**
 * Open the checkout modal and prepare order summary preview
 */
function openCheckoutModal() {
  if (appState.cart.length === 0) {
    showToast('Giỏ hàng đang trống, vui lòng chọn món trước!');
    return;
  }

  // Hide cart offcanvas first
  if (cartOffcanvasInstance) {
    cartOffcanvasInstance.hide();
  }

  // Populate Order Summary Preview
  if (elements.checkoutSummaryItems) {
    elements.checkoutSummaryItems.innerHTML = '';
    const frag = document.createDocumentFragment();

    appState.cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between align-items-center mb-2 small';
      row.innerHTML = `
        <div class="text-truncate me-2" style="max-width: 170px;">
          <span class="fw-bold">${item.quantity}x</span> ${escapeHtml(item.name)}
        </div>
        <div class="text-nowrap fw-semibold">${formatPrice(item.price * item.quantity)}</div>
      `;
      frag.appendChild(row);
    });

    elements.checkoutSummaryItems.appendChild(frag);
  }

  const subtotal = getCartSubtotal();
  if (elements.checkoutSummarySubtotal) elements.checkoutSummarySubtotal.textContent = formatPrice(subtotal);
  if (elements.checkoutSummaryTotal) elements.checkoutSummaryTotal.textContent = formatPrice(subtotal);

  // Reset form errors
  if (elements.checkoutForm) {
    elements.checkoutForm.classList.remove('was-validated');
    const inputs = elements.checkoutForm.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));
  }

  // Show checkout modal
  if (checkoutModalInstance) {
    checkoutModalInstance.show();
  }
}

/**
 * Handle checkout submission (Frontend demo, client-side validation only)
 * @param {Event} e 
 */
function handleCheckoutSubmit(e) {
  e.preventDefault();

  const nameInput = elements.checkoutName;
  const phoneInput = elements.checkoutPhone;
  const addressInput = elements.checkoutAddress;

  let isValid = true;

  // Validate Name
  const nameVal = nameInput ? nameInput.value.trim() : '';
  if (!nameVal || nameVal.length < 2) {
    if (nameInput) nameInput.classList.add('is-invalid');
    isValid = false;
  } else {
    if (nameInput) nameInput.classList.remove('is-invalid');
  }

  // Validate Phone (basic Vietnamese phone number format: 10 digits starting with 0 or +84)
  const phoneVal = phoneInput ? phoneInput.value.trim() : '';
  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!phoneVal || !phoneRegex.test(phoneVal.replace(/\s+/g, ''))) {
    if (phoneInput) phoneInput.classList.add('is-invalid');
    isValid = false;
  } else {
    if (phoneInput) phoneInput.classList.remove('is-invalid');
  }

  // Validate Address
  const addressVal = addressInput ? addressInput.value.trim() : '';
  if (!addressVal || addressVal.length < 5) {
    if (addressInput) addressInput.classList.add('is-invalid');
    isValid = false;
  } else {
    if (addressInput) addressInput.classList.remove('is-invalid');
  }

  if (!isValid) {
    // Focus first invalid input
    const firstInvalid = elements.checkoutForm.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Create Demo Order Result
  const orderId = 'KFC-DEMO-' + Math.floor(1000 + Math.random() * 9000);
  const totalAmount = formatPrice(getCartSubtotal());

  if (elements.successOrderId) elements.successOrderId.textContent = orderId;
  if (elements.successOrderCustomer) elements.successOrderCustomer.textContent = nameVal;
  if (elements.successOrderPhone) elements.successOrderPhone.textContent = phoneVal;
  if (elements.successOrderAddress) elements.successOrderAddress.textContent = addressVal;
  if (elements.successOrderTotal) elements.successOrderTotal.textContent = totalAmount;

  // Clear cart silently after successful demo order
  clearCart(false);

  // Close Checkout Modal
  if (checkoutModalInstance) {
    checkoutModalInstance.hide();
  }

  // Open Order Success Modal
  if (orderSuccessModalInstance) {
    orderSuccessModalInstance.show();
  }

  // Reset form
  if (elements.checkoutForm) {
    elements.checkoutForm.reset();
  }
}

/**
 * Bind all DOM event listeners
 */
function bindEvents() {
  // Search Input with instant input handling
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      if (elements.clearSearchBtn) {
        if (appState.searchQuery.length > 0) {
          elements.clearSearchBtn.classList.remove('d-none');
        } else {
          elements.clearSearchBtn.classList.add('d-none');
        }
      }
      applyFiltersAndRender();
    });
  }

  // Clear Search Button
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      if (elements.searchInput) {
        elements.searchInput.value = '';
        appState.searchQuery = '';
        elements.clearSearchBtn.classList.add('d-none');
        elements.searchInput.focus();
        applyFiltersAndRender();
      }
    });
  }

  // Sort Select Dropdown
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Retry Button on CSV Fetch Error
  if (elements.retryFetchBtn) {
    elements.retryFetchBtn.addEventListener('click', () => {
      loadMenu();
    });
  }

  // Reset Filters Button on Empty State
  if (elements.resetFiltersBtn) {
    elements.resetFiltersBtn.addEventListener('click', () => {
      appState.searchQuery = '';
      appState.selectedCategory = 'all';
      appState.sortBy = 'default';

      if (elements.searchInput) elements.searchInput.value = '';
      if (elements.clearSearchBtn) elements.clearSearchBtn.classList.add('d-none');
      if (elements.sortSelect) elements.sortSelect.value = 'default';

      // Update Category Buttons
      renderCategoryFilters(getCategories(appState.menuItems));
      applyFiltersAndRender();
    });
  }

  // Modal Quantity Minus
  if (elements.modalQtyMinus) {
    elements.modalQtyMinus.addEventListener('click', () => {
      if (appState.modalQuantity > 1) {
        appState.modalQuantity--;
        if (elements.modalQtyValue) elements.modalQtyValue.textContent = String(appState.modalQuantity);
      }
    });
  }

  // Modal Quantity Plus
  if (elements.modalQtyPlus) {
    elements.modalQtyPlus.addEventListener('click', () => {
      if (appState.modalQuantity < 99) {
        appState.modalQuantity++;
        if (elements.modalQtyValue) elements.modalQtyValue.textContent = String(appState.modalQuantity);
      }
    });
  }

  // Modal Add to Cart Button
  if (elements.modalAddToCartBtn) {
    elements.modalAddToCartBtn.addEventListener('click', () => {
      if (appState.currentModalItem) {
        addToCart(appState.currentModalItem.id, appState.modalQuantity);
        if (productModalInstance) {
          productModalInstance.hide();
        }
      }
    });
  }

  // Cart Offcanvas Item Controls Event Delegation (Increase, Decrease, Remove)
  if (elements.cartItemsList) {
    elements.cartItemsList.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('button[data-action]');
      if (!targetBtn) return;

      const action = targetBtn.getAttribute('data-action');
      const productId = targetBtn.getAttribute('data-id');
      if (!productId) return;

      if (action === 'increase') {
        increaseQuantity(productId);
      } else if (action === 'decrease') {
        decreaseQuantity(productId);
      } else if (action === 'remove') {
        removeFromCart(productId);
      }
    });
  }

  // Open Clear Cart Confirm Modal
  if (elements.cartClearBtn) {
    elements.cartClearBtn.addEventListener('click', () => {
      if (appState.cart.length === 0) return;
      if (clearCartConfirmModalInstance) {
        clearCartConfirmModalInstance.show();
      }
    });
  }

  // Confirm Clear Cart Button
  if (elements.confirmClearCartBtn) {
    elements.confirmClearCartBtn.addEventListener('click', () => {
      if (clearCartConfirmModalInstance) {
        clearCartConfirmModalInstance.hide();
      }
      clearCart(true);
    });
  }

  // Empty Cart CTA Button (scrolls to menu)
  if (elements.cartEmptyExploreBtn) {
    elements.cartEmptyExploreBtn.addEventListener('click', () => {
      if (cartOffcanvasInstance) {
        cartOffcanvasInstance.hide();
      }
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Open Checkout Button
  if (elements.cartCheckoutBtn) {
    elements.cartCheckoutBtn.addEventListener('click', () => {
      openCheckoutModal();
    });
  }

  // Checkout Form Submit
  if (elements.checkoutForm) {
    elements.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Order Success Continue / Home Buttons
  if (elements.successContinueBtn) {
    elements.successContinueBtn.addEventListener('click', () => {
      if (orderSuccessModalInstance) {
        orderSuccessModalInstance.hide();
      }
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (elements.successHomeBtn) {
    elements.successHomeBtn.addEventListener('click', () => {
      if (orderSuccessModalInstance) {
        orderSuccessModalInstance.hide();
      }
    });
  }

  // Smooth scroll active nav tracking
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Close mobile navbar collapse if open
      const navbarCollapse = document.getElementById('navbarContent');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/**
 * Fetch and process the menu CSV file from ./data/menu.csv
 */
async function loadMenu() {
  // Show loading state, hide error & empty
  if (elements.menuLoading) elements.menuLoading.classList.remove('d-none');
  if (elements.menuError) elements.menuError.classList.add('d-none');
  if (elements.menuEmpty) elements.menuEmpty.classList.add('d-none');
  if (elements.menuGrid) elements.menuGrid.innerHTML = '';

  try {
    const response = await fetch('./data/menu.csv');
    if (!response.ok) {
      throw new Error(`HTTP error while loading menu.csv! Status: ${response.status}`);
    }

    const csvText = await response.text();
    const rawRecords = parseCSV(csvText);

    // Validate & Normalize records
    const validItems = [];
    rawRecords.forEach(raw => {
      if (validateItem(raw)) {
        validItems.push(normalizeItem(raw));
      }
    });

    if (validItems.length === 0) {
      throw new Error('menu.csv has no valid food item records.');
    }

    // Save to global state
    appState.menuItems = validItems;

    // Render Components
    const categories = getCategories(validItems);
    renderCategoryFilters(categories);
    renderFeatured(validItems);
    applyFiltersAndRender();

    // Hide loading
    if (elements.menuLoading) elements.menuLoading.classList.add('d-none');

    console.log(`[KFC Landing Page] Loaded ${validItems.length} menu items successfully from CSV.`);
  } catch (err) {
    console.error('[KFC Landing Page] Failed to load menu.csv:', err);
    if (elements.menuLoading) elements.menuLoading.classList.add('d-none');
    if (elements.menuError) elements.menuError.classList.remove('d-none');
    if (elements.featuredContainer) {
      elements.featuredContainer.innerHTML = `
        <div class="col-12 text-center py-4">
          <p class="text-danger mb-0">Không thể tải combo nổi bật do lỗi đọc dữ liệu.</p>
        </div>
      `;
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initBootstrapComponents();
  bindEvents();
  loadCart();
  updateCartBadge();
  renderCart();
  loadMenu();
});
