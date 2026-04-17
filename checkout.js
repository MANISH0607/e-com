const checkoutItemsContainer = document.getElementById('checkout-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');
const checkoutForm = document.getElementById('checkout-form');
const successOverlay = document.getElementById('success-overlay');

// Load items from local storage
const storedCart = localStorage.getItem('cartItems');
let cartItems = [];

if (storedCart) {
    try {
        cartItems = JSON.parse(storedCart);
    } catch (e) {
        console.error("Failed to parse cart items", e);
    }
}

function renderCheckout() {
    if (cartItems.length === 0) {
        checkoutItemsContainer.innerHTML = '<p style="color: var(--grey); text-align:center;">Your cart is empty.</p>';
        summarySubtotal.textContent = '$0.00';
        summaryTotal.textContent = '$0.00';
        return;
    }

    let subtotal = 0;

    checkoutItemsContainer.innerHTML = cartItems.map(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
            <div class="checkout-item">
                <img src="${item.img}" alt="${item.title}" class="checkout-item__img">
                <div class="checkout-item__details">
                    <h4>${item.title}</h4>
                    <p style="color: var(--grey); font-size: 0.9rem;">Qty: ${item.qty}</p>
                </div>
                <div class="checkout-item__price">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');

    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryTotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Form Submission handling
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
    }

    // Show success overlay
    successOverlay.classList.remove('hidden');
    
    // Clear cart upon successful order
    localStorage.removeItem('cartItems');
});

// Initial Render
renderCheckout();
