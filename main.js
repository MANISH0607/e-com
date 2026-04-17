// State Management
const state = {
    cartCount: 0,
    cartItems: []
};

// Load Cart from LocalStorage
const storedCart = localStorage.getItem('cartItems');
if (storedCart) {
    try {
        state.cartItems = JSON.parse(storedCart);
        state.cartCount = state.cartItems.reduce((acc, item) => acc + item.qty, 0);
    } catch (e) {
        console.error("Failed to load cart", e);
    }
}

// Data
const products = [
    { id: 1, brand: "Sneaker Edition", title: "Fall Limited Edition", price: 125, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
    { id: 2, brand: "Air Max", title: "Air Max Pro", price: 150, img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80" },
    { id: 3, brand: "Runner", title: "Runner's Choice", price: 95, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80" },
    { id: 4, brand: "Urban", title: "Urban Edge Sneaker", price: 110, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80" },
    { id: 5, brand: "Classic", title: "Classic Leather", price: 85, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80" },
    { id: 6, brand: "Cloud", title: "Cloud Walkers", price: 130, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80" },
    { id: 7, brand: "Trail", title: "Trail Blazer", price: 145, img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80" },
    { id: 8, brand: "Retro", title: "Retro Kicks", price: 90, img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80" },
    { id: 9, brand: "Gym", title: "Gym Master", price: 120, img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80" },
    { id: 10, brand: "Night", title: "Night Owl Special", price: 105, img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80" }
];

// Selectors
const productListContainer = document.getElementById('product-list');
const cartCountDisplay = document.getElementById('cart-count');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const productModal = document.getElementById('product-modal');
const modalDetails = document.getElementById('modal-details');
const closeModal = document.getElementById('close-modal');

// Initialize Products
function renderProducts() {
    if (!productListContainer) return;
    
    productListContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.title}" class="product-card__img" onclick="showProductDetails(${product.id})" style="cursor:pointer;">
            <h2 class="product-card__brand">${product.brand}</h2>
            <h3 class="product-card__title" onclick="showProductDetails(${product.id})" style="cursor:pointer;">${product.title}</h3>
            <div class="product-card__price-box">
                <span class="product-card__price">$${product.price.toFixed(2)}</span>
            </div>
            <button class="btn--add" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Toggle Cart Modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.toggle('hidden');
});

// Add to Cart Logic
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    
    // Check if item already in cart
    const existingItem = state.cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        state.cartItems.push({ ...product, qty: 1 });
    }
    
    state.cartCount += 1;
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    updateDOM();
    updateCartModal();
    alert(`${product.title} added to cart!`);
};

function updateDOM() {
    cartCountDisplay.textContent = state.cartCount;
}

function updateCartModal() {
    if (state.cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        return;
    }

    cartItemsContainer.innerHTML = state.cartItems.map(item => {
        const total = (item.price * item.qty).toFixed(2);
        return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}" class="cart-item__img">
                <div class="cart-item__details">
                    <p>${item.title}</p>
                    <p>$${item.price.toFixed(2)} x ${item.qty} <span class="cart-item__total">$${total}</span></p>
                </div>
                <button class="btn--delete" onclick="deleteItem(${item.id})" aria-label="Delete item">
                    &#128465;
                </button>
            </div>
        `;
    }).join('') + '<button class="btn--checkout" onclick="goToCheckout()">Checkout</button>';
}

window.deleteItem = function(productId) {
    const itemIndex = state.cartItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        state.cartCount -= state.cartItems[itemIndex].qty;
        state.cartItems.splice(itemIndex, 1);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        updateDOM();
        updateCartModal();
    }
};

// Modal Logic
window.showProductDetails = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!modalDetails) return;
    
    modalDetails.innerHTML = `
        <div class="modal-layout">
            <img src="${product.img}" alt="${product.title}" class="modal-img">
            <div class="modal-info">
                <h4 style="color: var(--primary); text-transform: uppercase; font-size:0.9rem; margin-bottom:5px;">${product.brand}</h4>
                <h2 style="font-size: 1.8rem; margin-bottom: 20px;">${product.title}</h2>
                <p style="color: var(--grey); line-height: 1.6; margin-bottom: 20px;">
                    Experience the ultimate comfort and style with the ${product.title}. Perfect for every occasion, ensuring you look your best while staying comfortable.
                </p>
                <div class="modal-price" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 20px;">
                    $${product.price.toFixed(2)}
                </div>
                <button class="btn--primary" style="width: 100%;" onclick="addToCart(${product.id}); hideProductDetails();">Add to Cart</button>
            </div>
        </div>
    `;
    
    productModal.classList.remove('hidden');
};

window.hideProductDetails = function() {
    if (productModal) {
        productModal.classList.add('hidden');
    }
};

if (closeModal) {
    closeModal.addEventListener('click', hideProductDetails);
    
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            hideProductDetails();
        }
    });
}

window.goToCheckout = function() {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    window.location.href = 'checkout.html';
};

// Initial Render
renderProducts();

// Update DOM initially if cart is pre-loaded
updateDOM();
updateCartModal();