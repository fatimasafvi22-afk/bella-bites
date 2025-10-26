// ====== Checkout Page Logic ======
const checkoutItems = document.getElementById('checkoutItems');
const checkoutTotal = document.getElementById('checkoutTotal');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Render Cart Summary ---
function renderCheckout() {
  checkoutItems.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    checkoutItems.innerHTML = `<p class="text-muted text-center">Your cart is empty.</p>`;
    checkoutTotal.textContent = '$0.00';
    return;
  }

  cart.forEach(item => {
    total += item.price * item.quantity;
    checkoutItems.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.img}" alt="${item.name}" width="60" height="60" class="rounded shadow-sm">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">$${item.price.toFixed(2)} × ${item.quantity}</small>
          </div>
        </div>
        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
      </div>
    `;
  });
  checkoutTotal.textContent = `$${total.toFixed(2)}`;
}
renderCheckout();

// --- Handle Form Submission ---
document.getElementById('checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items before checkout.');
    return;
  }

  // Basic Validation (HTML required handles most)
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const payment = document.getElementById('payment').value;

  if (!name || !email || !address || !payment) {
    alert('Please fill in all required fields.');
    return;
  }

  // Simulate successful order
  const modal = new bootstrap.Modal(document.getElementById('orderSuccess'));
  modal.show();

  // Clear cart
  localStorage.removeItem('cart');
  cart = [];
});
