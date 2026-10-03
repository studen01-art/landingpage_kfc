/**
 * Module 09: Payment & QR-Code Checkout Module
 * Pure Vanilla JavaScript (Frontend Only Demo)
 * Integrates directly with KFC Landing Page & Shopping Cart
 */

// Central Payment Configuration (Section 3 & 25)
const PAYMENT_CONFIG = {
  bankName: 'MB',
  bankFullName: 'Ngân hàng TMCP Quân Đội (MBBank)',
  bankBin: '970422', // NAPAS BIN for MB Bank
  accountNumber: '0934019198',
  accountName: 'Lã Thành Quyết',
  qrProvider: 'vietqr'
};

const ORDER_STORAGE_KEY = 'kfc_demo_orders';

// Payment State
const paymentState = {
  currentOrder: null,
  activeMethod: 'qr' // 'qr' | 'momo' | 'atm' | 'visa' | 'mastercard'
};

/**
 * Format currency helper (Section 22)
 * @param {number} value 
 * @returns {string} e.g. "197.000 ₫"
 */
function formatCurrency(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}

/**
 * Generate unique Order ID matching KFC-YYYYMMDD-XXXX (Section 4 & 23)
 * @returns {string} e.g. "KFC-20261003-A7F2"
 */
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const chars = '0123456789ABCDEF';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const orderId = `KFC-${year}${month}${day}-${rand}`;
  
  // Ensure uniqueness in localStorage
  const existingOrders = loadOrders();
  if (existingOrders.some(o => o.orderId === orderId)) {
    return generateOrderId(); // Regenerate on rare collision
  }
  
  return orderId;
}

/**
 * Load all orders from localStorage safely (Section 19)
 * @returns {Array<Object>}
 */
function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[Payment] Failed to load orders from localStorage:', err);
    return [];
  }
}

/**
 * Save an order to localStorage (Section 19)
 * @param {Object} order 
 */
function saveOrder(order) {
  if (!order || !order.orderId) return;
  try {
    const orders = loadOrders();
    const index = orders.findIndex(o => o.orderId === order.orderId);
    if (index > -1) {
      orders[index] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('[Payment] Failed to save order to localStorage:', err);
  }
}

/**
 * Update payment status for an existing order (Section 18)
 * @param {string} orderId 
 * @param {string} newStatus 'pending_payment' | 'waiting_confirmation' | 'paid' | 'cancelled'
 */
function updateOrderStatus(orderId, newStatus) {
  const orders = loadOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.paymentStatus = newStatus;
    saveOrder(order);
  }
  if (paymentState.currentOrder && paymentState.currentOrder.orderId === orderId) {
    paymentState.currentOrder.paymentStatus = newStatus;
  }
}

/**
 * Create a new Order Object adhering to Section 16 schema
 * @param {Object} customerData { name, phone, address, note }
 * @param {Array<Object>} cartItems 
 * @param {number} subtotal 
 * @param {string} paymentMethod 
 * @returns {Object} order object
 */
function createOrder(customerData, cartItems, subtotal, paymentMethod = 'qr') {
  const orderId = generateOrderId();
  const order = {
    orderId: orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: customerData.name || '',
      phone: customerData.phone || '',
      address: customerData.address || '',
      note: customerData.note || ''
    },
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    subtotal: Number(subtotal) || 0,
    paymentMethod: paymentMethod, // 'qr', 'momo', 'atm', 'visa', 'mastercard'
    paymentStatus: 'pending_payment',
    transferContent: orderId
  };

  saveOrder(order);
  paymentState.currentOrder = order;
  return order;
}

/**
 * Build VietQR dynamic image URL for the specific order (Section 7 & 24)
 * @param {Object} order 
 * @returns {string} VietQR URL
 */
function buildPaymentQrData(order) {
  if (!order) return '';
  const bankBin = PAYMENT_CONFIG.bankBin;
  const accNum = PAYMENT_CONFIG.accountNumber;
  const accName = encodeURIComponent(PAYMENT_CONFIG.accountName);
  const amount = order.subtotal;
  const memo = encodeURIComponent(order.orderId);

  // Official VietQR NAPAS 247 image API
  return `https://img.vietqr.io/image/${bankBin}-${accNum}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accName}`;
}

/**
 * Copy text to clipboard with fallback and toast feedback (Section 8)
 * @param {string} text 
 * @param {string} successMessage 
 */
function copyToClipboard(text, successMessage = 'Đã sao chép!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (typeof showToast === 'function') {
          showToast(successMessage);
        }
      })
      .catch(() => {
        fallbackCopyText(text, successMessage);
      });
  } else {
    fallbackCopyText(text, successMessage);
  }
}

function fallbackCopyText(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (typeof showToast === 'function') {
      showToast(successMessage);
    }
  } catch (err) {
    console.error('[Payment] Clipboard copy failed:', err);
  }
  document.body.removeChild(textArea);
}

/**
 * Render dynamic QR Code and setup fallback (Section 7, 8, 30)
 * @param {Object} order 
 */
function renderPaymentQr(order) {
  const qrImg = document.getElementById('vietQrImage');
  const qrLoading = document.getElementById('qrLoadingSpinner');
  const qrFallback = document.getElementById('qrFallbackContainer');
  const qrCanvas = document.getElementById('qrCanvas');

  if (!qrImg) return;

  const qrUrl = buildPaymentQrData(order);
  qrImg.alt = `Mã QR thanh toán cho đơn hàng ${order.orderId}`;

  if (qrLoading) qrLoading.classList.remove('d-none');
  qrImg.classList.add('d-none');
  if (qrFallback) qrFallback.classList.add('d-none');

  qrImg.onload = function() {
    if (qrLoading) qrLoading.classList.add('d-none');
    qrImg.classList.remove('d-none');
  };

  qrImg.onerror = function() {
    // If online VietQR fails or offline, fallback to local QR generation
    console.warn('[Payment] VietQR image failed to load, triggering local QR fallback.');
    if (qrLoading) qrLoading.classList.add('d-none');
    qrImg.classList.add('d-none');

    if (qrFallback && qrCanvas) {
      qrFallback.classList.remove('d-none');
      qrCanvas.innerHTML = '';

      if (typeof QRCode !== 'undefined') {
        new QRCode(qrCanvas, {
          text: `2|99|${PAYMENT_CONFIG.accountNumber}|${PAYMENT_CONFIG.accountName}|${order.subtotal}|${order.orderId}`,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        // SVG representation fallback
        qrCanvas.innerHTML = `
          <div class="p-3 bg-light rounded text-center border">
            <i class="bi bi-qr-code fs-1 text-danger"></i>
            <div class="small fw-bold mt-2">Vui lòng quét bằng App Ngân hàng</div>
            <div class="small text-muted">STK: ${PAYMENT_CONFIG.accountNumber} &bull; Số tiền: ${formatCurrency(order.subtotal)}</div>
          </div>
        `;
      }
    }
  };

  qrImg.src = qrUrl;
}

/**
 * Show the Payment Modal with Order details (Section 6, 20, 26)
 * @param {Object} order 
 * @param {string} initialMethod 'qr' | 'momo' | 'atm' | 'visa' | 'mastercard'
 */
function showPaymentModal(order, initialMethod = 'qr') {
  if (!order) return;
  paymentState.currentOrder = order;
  paymentState.activeMethod = initialMethod;

  // Populate Header & Amounts
  const payModalOrderId = document.getElementById('payModalOrderId');
  const payModalAmount = document.getElementById('payModalAmount');
  const payTransferAmount = document.getElementById('payTransferAmount');
  const payTransferContent = document.getElementById('payTransferContent');
  const payBankAccNum = document.getElementById('payBankAccNum');
  const payBankAccName = document.getElementById('payBankAccName');

  if (payModalOrderId) payModalOrderId.textContent = order.orderId;
  if (payModalAmount) payModalAmount.textContent = formatCurrency(order.subtotal);
  if (payTransferAmount) payTransferAmount.textContent = formatCurrency(order.subtotal);
  if (payTransferContent) payTransferContent.textContent = order.orderId;
  if (payBankAccNum) payBankAccNum.textContent = PAYMENT_CONFIG.accountNumber;
  if (payBankAccName) payBankAccName.textContent = PAYMENT_CONFIG.accountName;

  // Populate other tabs amounts & IDs
  const momoAmount = document.getElementById('momoAmount');
  const momoOrderId = document.getElementById('momoOrderId');
  const atmAmount = document.getElementById('atmAmount');
  const atmOrderId = document.getElementById('atmOrderId');
  const visaAmount = document.getElementById('visaAmount');
  const mastercardAmount = document.getElementById('mastercardAmount');

  if (momoAmount) momoAmount.textContent = formatCurrency(order.subtotal);
  if (momoOrderId) momoOrderId.textContent = order.orderId;
  if (atmAmount) atmAmount.textContent = formatCurrency(order.subtotal);
  if (atmOrderId) atmOrderId.textContent = order.orderId;
  if (visaAmount) visaAmount.textContent = formatCurrency(order.subtotal);
  if (mastercardAmount) mastercardAmount.textContent = formatCurrency(order.subtotal);

  // Render QR
  renderPaymentQr(order);

  // Activate Tab
  const targetTabBtn = document.getElementById(`tab-${initialMethod}-btn`);
  if (targetTabBtn && typeof bootstrap !== 'undefined') {
    const tabTrigger = new bootstrap.Tab(targetTabBtn);
    tabTrigger.show();
  }

  // Show Modal
  const paymentModalEl = document.getElementById('paymentModal');
  if (paymentModalEl && typeof bootstrap !== 'undefined') {
    const modalInstance = bootstrap.Modal.getInstance(paymentModalEl) || new bootstrap.Modal(paymentModalEl);
    modalInstance.show();
  }
}

/**
 * Handle confirmation of payment ("Tôi đã thanh toán") (Section 9 & 18)
 * Updates status to 'waiting_confirmation' and opens Order Success Modal
 * @param {string} orderId 
 * @param {string} method 
 */
function confirmPayment(orderId, method = 'qr') {
  const targetId = orderId || (paymentState.currentOrder ? paymentState.currentOrder.orderId : '');
  if (!targetId) return;

  // Transition status: pending_payment -> waiting_confirmation (Section 9 & 18)
  updateOrderStatus(targetId, 'waiting_confirmation');

  // Close payment modal
  const paymentModalEl = document.getElementById('paymentModal');
  if (paymentModalEl && typeof bootstrap !== 'undefined') {
    const modalInstance = bootstrap.Modal.getInstance(paymentModalEl);
    if (modalInstance) modalInstance.hide();
  }

  // Show disclaimer alert / toast
  if (typeof showToast === 'function') {
    showToast('✓ Đã ghi nhận! Đơn hàng đang ở trạng thái: Chờ xác nhận thanh toán.');
  }

  // Open Order Success Modal populated with order details (Section 20)
  openOrderSuccessModal(paymentState.currentOrder || { orderId: targetId });
}

/**
 * Open Order Success Modal populated with complete order details (Section 20)
 * @param {Object} order 
 */
function openOrderSuccessModal(order) {
  const orderSuccessModalEl = document.getElementById('orderSuccessModal');
  if (!orderSuccessModalEl) return;

  const successOrderId = document.getElementById('successOrderId');
  const successPaymentStatus = document.getElementById('successPaymentStatus');
  const successPaymentMethod = document.getElementById('successPaymentMethod');
  const successOrderCustomer = document.getElementById('successOrderCustomer');
  const successOrderPhone = document.getElementById('successOrderPhone');
  const successOrderAddress = document.getElementById('successOrderAddress');
  const successOrderTotal = document.getElementById('successOrderTotal');
  const successQrReminder = document.getElementById('successQrReminder');
  const successTransferMemo = document.getElementById('successTransferMemo');

  if (successOrderId) successOrderId.textContent = order.orderId;
  if (successOrderCustomer) successOrderCustomer.textContent = order.customer ? order.customer.name : 'Khách hàng';
  if (successOrderPhone) successOrderPhone.textContent = order.customer ? order.customer.phone : '';
  if (successOrderAddress) successOrderAddress.textContent = order.customer ? order.customer.address : '';
  if (successOrderTotal) successOrderTotal.textContent = formatCurrency(order.subtotal);

  // Status Badge
  if (successPaymentStatus) {
    successPaymentStatus.className = 'badge bg-warning text-dark fw-bold px-3 py-1';
    successPaymentStatus.textContent = 'Chờ xác nhận thanh toán';
  }

  // Payment Method Name
  const methodNames = {
    qr: 'QR Code / Chuyển khoản (MB)',
    momo: 'Ví MoMo (Demo)',
    atm: 'Thẻ ATM nội địa (Demo)',
    visa: 'Thẻ quốc tế VISA (Demo)',
    mastercard: 'Thẻ quốc tế Mastercard (Demo)'
  };
  const methodName = methodNames[order.paymentMethod] || 'QR Code';
  if (successPaymentMethod) successPaymentMethod.textContent = methodName;

  // Show transfer memo reminder if QR was used
  if (successQrReminder) {
    if (order.paymentMethod === 'qr') {
      successQrReminder.classList.remove('d-none');
      if (successTransferMemo) successTransferMemo.textContent = order.orderId;
    } else {
      successQrReminder.classList.add('d-none');
    }
  }

  if (typeof bootstrap !== 'undefined') {
    const successModal = bootstrap.Modal.getInstance(orderSuccessModalEl) || new bootstrap.Modal(orderSuccessModalEl);
    successModal.show();
  }
}

/**
 * Bind Payment Module Event Listeners
 */
function bindPaymentEvents() {
  // Copy Account Number button
  const btnCopyAccNum = document.getElementById('btnCopyAccNum');
  const btnCopyAccNumFull = document.getElementById('btnCopyAccNumFull');
  const copyAccAction = () => {
    copyToClipboard(PAYMENT_CONFIG.accountNumber, `Đã sao chép số tài khoản: ${PAYMENT_CONFIG.accountNumber}!`);
  };
  if (btnCopyAccNum) btnCopyAccNum.addEventListener('click', copyAccAction);
  if (btnCopyAccNumFull) btnCopyAccNumFull.addEventListener('click', copyAccAction);

  // Copy Transfer Content (Order ID)
  const btnCopyTransferContent = document.getElementById('btnCopyTransferContent');
  const btnCopyContentFull = document.getElementById('btnCopyContentFull');
  const copyContentAction = () => {
    const content = paymentState.currentOrder ? paymentState.currentOrder.orderId : '';
    if (content) {
      copyToClipboard(content, `Đã sao chép nội dung chuyển khoản: ${content}!`);
    }
  };
  if (btnCopyTransferContent) btnCopyTransferContent.addEventListener('click', copyContentAction);
  if (btnCopyContentFull) btnCopyContentFull.addEventListener('click', copyContentAction);

  // Copy Order ID in Success Modal
  const successCopyOrderBtn = document.getElementById('successCopyOrderBtn');
  if (successCopyOrderBtn) {
    successCopyOrderBtn.addEventListener('click', () => {
      const orderId = paymentState.currentOrder ? paymentState.currentOrder.orderId : '';
      if (orderId) {
        copyToClipboard(orderId, `Đã sao chép mã đơn hàng: ${orderId}!`);
      }
    });
  }

  // Button: "Tôi đã thanh toán" (QR Tab)
  const btnConfirmPaidQR = document.getElementById('btnConfirmPaidQR');
  if (btnConfirmPaidQR) {
    btnConfirmPaidQR.addEventListener('click', () => {
      confirmPayment(paymentState.currentOrder ? paymentState.currentOrder.orderId : '', 'qr');
    });
  }

  // MoMo Actions
  const btnMomoDemoAction = document.getElementById('btnMomoDemoAction');
  if (btnMomoDemoAction) {
    btnMomoDemoAction.addEventListener('click', () => {
      if (typeof showToast === 'function') {
        showToast('Chức năng thanh toán MoMo thật chưa được kết nối trong phiên bản frontend demo.');
      }
    });
  }

  const btnMomoConfirmPaid = document.getElementById('btnMomoConfirmPaid');
  if (btnMomoConfirmPaid) {
    btnMomoConfirmPaid.addEventListener('click', () => {
      confirmPayment(paymentState.currentOrder ? paymentState.currentOrder.orderId : '', 'momo');
    });
  }

  // ATM Confirm
  const btnAtmConfirmPaid = document.getElementById('btnAtmConfirmPaid');
  if (btnAtmConfirmPaid) {
    btnAtmConfirmPaid.addEventListener('click', () => {
      confirmPayment(paymentState.currentOrder ? paymentState.currentOrder.orderId : '', 'atm');
    });
  }

  // Mock bank selector buttons
  const mockBankBtns = document.querySelectorAll('.bank-mock-btn');
  mockBankBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      mockBankBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // VISA Confirm
  const btnVisaConfirmPaid = document.getElementById('btnVisaConfirmPaid');
  if (btnVisaConfirmPaid) {
    btnVisaConfirmPaid.addEventListener('click', () => {
      confirmPayment(paymentState.currentOrder ? paymentState.currentOrder.orderId : '', 'visa');
    });
  }

  // Mastercard Confirm
  const btnMastercardConfirmPaid = document.getElementById('btnMastercardConfirmPaid');
  if (btnMastercardConfirmPaid) {
    btnMastercardConfirmPaid.addEventListener('click', () => {
      confirmPayment(paymentState.currentOrder ? paymentState.currentOrder.orderId : '', 'mastercard');
    });
  }

  // Tab switching updates activeMethod
  const methodTabs = document.querySelectorAll('#paymentMethodTabs button[data-bs-toggle="pill"]');
  methodTabs.forEach(tab => {
    tab.addEventListener('shown.bs.tab', (e) => {
      const method = e.target.getAttribute('data-method') || 'qr';
      paymentState.activeMethod = method;
      if (paymentState.currentOrder) {
        paymentState.currentOrder.paymentMethod = method;
        saveOrder(paymentState.currentOrder);
      }
    });
  });
}

// Export module to global window
window.PaymentModule = {
  PAYMENT_CONFIG,
  ORDER_STORAGE_KEY,
  generateOrderId,
  createOrder,
  saveOrder,
  loadOrders,
  updateOrderStatus,
  buildPaymentQrData,
  copyToClipboard,
  showPaymentModal,
  confirmPayment,
  openOrderSuccessModal,
  formatCurrency
};

// Initialize listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  bindPaymentEvents();
});
