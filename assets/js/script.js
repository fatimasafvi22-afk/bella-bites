// ======================= BELLA BITES CART + CHECKOUT SCRIPT =======================
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const cartButton = document.getElementById('cartButton');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCart = document.getElementById('closeCart');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.querySelector('.cart-count');
  const checkoutModalEl = document.getElementById('checkoutModal');

  // --- Initialize Cart ---
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // ==============================================================================
  // --------------------------- CART CORE FUNCTIONS ------------------------------
  // ==============================================================================

  function updateCartUI() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-center text-muted my-3">Your cart is empty.</p>`;
      cartTotal.textContent = 'Rs. 0';
      cartCount.textContent = '0';
      localStorage.setItem('cart', JSON.stringify(cart));
      return;
    }

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img" width="60" height="60" loading="lazy">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">Rs. ${item.price.toFixed(2)}</small>
          </div>
        </div>
        <div class="quantity-control">
          <button aria-label="Decrease quantity" onclick="changeQty(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button aria-label="Increase quantity" onclick="changeQty(${index}, 1)">+</button>
          <i class="fa-solid fa-trash btn-remove" role="button" tabindex="0" aria-label="Remove item" onclick="removeItem(${index})"></i>
        </div>
      `;
      cartItemsContainer.appendChild(li);
    });

    cartTotal.textContent = `Rs. ${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Change quantity
  window.changeQty = function (index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
  };

  // Remove item
  window.removeItem = function (index) {
    cart.splice(index, 1);
    updateCartUI();
  };

  // Add to cart
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;

      const existing = cart.find(i => i.name === name);
      if (existing) existing.quantity++;
      else cart.push({ name, price, img, quantity: 1 });

      updateCartUI();
    });
  });

  // ==============================================================================
  // --------------------------- CART DRAWER CONTROL ------------------------------
  // ==============================================================================

  if (cartButton) {
    cartButton.addEventListener('click', () => {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('active');
    });
  }

  if (closeCart) {
    closeCart.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
    });
  }

  // ==============================================================================
  // --------------------------- CHECKOUT MODAL LOGIC -----------------------------
  // ==============================================================================

  let checkoutModal;
  if (checkoutModalEl) {
    checkoutModal = new bootstrap.Modal(checkoutModalEl, { backdrop: 'static' });
  }

  function safelyHideModal(modalEl) {
    if (!modalEl) return;
    if (modalEl.contains(document.activeElement)) document.activeElement.blur();
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance?.hide();
  }

  window.openCheckout = function () {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const summaryContainer = document.getElementById('checkoutSummary');
    const totalContainer = document.getElementById('checkoutTotal');
    if (!summaryContainer || !totalContainer) return;

    summaryContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      const row = document.createElement('div');
      row.classList.add('checkout-item', 'd-flex', 'justify-content-between', 'mb-2');
      row.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <span>Rs. ${(item.price * item.quantity).toFixed(2)}</span>
      `;
      summaryContainer.appendChild(row);
    });

    totalContainer.textContent = `Rs. ${total.toFixed(2)}`;
    checkoutModal?.show();
  };

  window.closeCheckout = function () {
    safelyHideModal(checkoutModalEl);
  };

  // Cross-tab cart sync
  window.addEventListener('storage', e => {
    if (e.key === 'cart') {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      updateCartUI();
    }
  });

  // Initialize cart on load
  updateCartUI();

  // ==============================================================================
  // --------------------------- CHECKOUT SUBMIT ----------------------------------
  // ==============================================================================
  window.submitCheckout = function () {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();

    if (!name || !email || !phone || !address) {
      alert('Please fill in all required fields before confirming your order.');
      return;
    }

    alert(`Thank you, ${name}! Your order has been placed successfully.`);

    // Clear cart after checkout
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    closeCheckout();

    // Close drawer safely if open
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
  };
});
