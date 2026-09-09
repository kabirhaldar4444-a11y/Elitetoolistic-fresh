// PayAlma Configuration is handled securely on the backend (server.js / checkout.php / api/checkout.js)
const CHECKOUT_API_URL = '/api/checkout';

let cart = JSON.parse(localStorage.getItem('elite_cart')) || [];

function saveCart() {
    localStorage.setItem('elite_cart', JSON.stringify(cart));
    updateCartUI();
}

function parsePrice(price) {
    if (typeof price === 'number') {
        return Math.max(1, Math.round(price));
    }
    const clean = String(price || '').replace(/[^0-9.]/g, '');
    const num = Math.round(parseFloat(clean));
    return isNaN(num) || num <= 0 ? 1 : num;
}

function addToCart(course) {
    const existingIndex = cart.findIndex(item => item.id === course.id);
    if (existingIndex === -1) {
        cart.push(course);
        saveCart();
        openCart();
    } else {
        // Update existing item with the newly entered price
        cart[existingIndex].price = course.price;
        if (course.originalPrice) {
            cart[existingIndex].originalPrice = course.originalPrice;
        }
        saveCart();
        openCart();
    }
}

function removeFromCart(courseId) {
    cart = cart.filter(item => item.id !== courseId);
    saveCart();
}

function getCartTotal() {
    return cart.reduce((total, item) => total + parsePrice(item.price), 0);
}

function updateCartUI() {
    const countEl = document.querySelector('.cart-count');
    if (countEl) countEl.innerText = cart.length;

    const itemsContainer = document.querySelector('.cart-items');
    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    } else {
        cart.forEach(item => {
            const numericPrice = parsePrice(item.price);
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.setAttribute('data-cart-item-id', item.id);
            itemEl.innerHTML = `
                <div class="cart-item-top">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remove course">Remove</button>
                </div>
                <div class="cart-item-price-row">
                    <span class="cart-item-price-label">Fee Amount:</span>
                    <div class="cart-item-price-box">
                        <span>₹</span>
                        <input type="number" 
                               class="cart-item-price-input" 
                               value="${numericPrice}" 
                               min="1" 
                               step="100" 
                               title="Click to manually edit fee amount"
                               oninput="onCartItemPriceInput('${item.id}', this)"
                               onblur="onCartItemPriceBlur('${item.id}', this)" />
                    </div>
                </div>
            `;
            itemsContainer.appendChild(itemEl);
        });
    }

    const totalEl = document.querySelector('.cart-total-amount');
    if (totalEl) totalEl.innerText = `₹${getCartTotal().toLocaleString('en-IN')}`;
}

function onCartItemPriceInput(courseId, inputEl) {
    const num = parsePrice(inputEl.value);
    const item = cart.find(i => i.id === courseId);
    if (item) {
        item.price = String(num);
        localStorage.setItem('elite_cart', JSON.stringify(cart));
        const totalEl = document.querySelector('.cart-total-amount');
        if (totalEl) totalEl.innerText = `₹${getCartTotal().toLocaleString('en-IN')}`;
    }
}

function onCartItemPriceBlur(courseId, inputEl) {
    const num = parsePrice(inputEl.value);
    inputEl.value = num;
    const item = cart.find(i => i.id === courseId);
    if (item) {
        item.price = String(num);
        saveCart();
    }
}

function openCart() {
    const overlay = document.querySelector('.cart-modal-overlay');
    const modal = document.querySelector('.cart-modal');
    if (overlay) overlay.classList.add('open');
    if (modal) modal.classList.add('open');
}

function closeCart() {
    const overlay = document.querySelector('.cart-modal-overlay');
    const modal = document.querySelector('.cart-modal');
    if (overlay) overlay.classList.remove('open');
    if (modal) modal.classList.remove('open');
}

async function checkoutWithPayAlma(directCourse = null) {
    let itemsToCheckout = directCourse ? [directCourse] : cart;

    if (itemsToCheckout.length === 0) {
        alert('No items to checkout.');
        return;
    }

    // Get email from drawer if entered or prompt/default
    const emailInput = document.getElementById('cart-student-email');
    let studentEmail = emailInput && emailInput.value.trim() ? emailInput.value.trim() : "student@example.com";

    // Prepare products array for PayAlma
    const products = itemsToCheckout.map(item => {
        const itemPrice = parsePrice(item.price);
        return {
            name: item.name,
            // PayAlma expects price usually in minor units (e.g. cents/paise). Multiply by 100.
            price: itemPrice * 100 
        };
    });

    const payload = {
        client: {
            email: studentEmail
        },
        purchase: {
            products: products,
            currency: "INR"
        },
        // brand_id is securely injected by the backend
        success_redirect: window.location.origin + "/success.html",
        failure_redirect: window.location.origin + "/failure.html"
    };

    try {
        const btn = directCourse 
            ? (document.querySelector('.checkout-payalma-btn') || document.querySelector('.cart-checkout-btn')) 
            : document.querySelector('.cart-checkout-btn');
        const originalText = btn ? btn.innerText : "Checkout";
        if (btn) {
            btn.innerText = "Processing...";
            btn.disabled = true;
        }

        let response;
        try {
            response = await fetch(CHECKOUT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (response.status === 404) {
                response = await fetch('/api/checkout.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }
        } catch (fetchErr) {
            response = await fetch('/api/checkout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        }

        const data = await response.json();

        if (response.ok && data.checkout_url) {
            window.location.href = data.checkout_url;
        } else {
            console.error('PayAlma Error:', data);
            alert('Failed to initiate checkout. Please check API keys and configuration.');
            if (btn) {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Network error occurred while contacting payment gateway.');
    }
}

// Inject Cart HTML into DOM
function injectCartHTML() {
    if (document.querySelector('.floating-cart-icon')) return;

    const cartHTML = `
        <div class="floating-cart-icon" onclick="openCart()" title="View Cart">
            <span>🛒 Cart</span>
            <span class="cart-count">0</span>
        </div>
        <div class="cart-modal-overlay" onclick="closeCart()"></div>
        <div class="cart-modal">
            <div class="cart-header">
                <h2>Shopping Cart</h2>
                <button class="close-cart" onclick="closeCart()" aria-label="Close cart">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div style="margin-bottom: 14px;">
                    <label for="cart-student-email" style="display:block; font-size:0.75rem; font-weight:600; color:#475569; margin-bottom: 4px;">Email Address (for Receipt & Course Access):</label>
                    <input type="email" id="cart-student-email" placeholder="name@example.com" style="width:100%; box-sizing:border-box; padding:8px 10px; border:1.5px solid var(--navy-brand, #062c63); border-radius:0; font-size:0.85rem;" />
                </div>
                <div class="cart-total">
                    <span>Total Amount:</span>
                    <span class="cart-total-amount">₹0</span>
                </div>
                <button class="cart-checkout-btn" onclick="checkoutWithPayAlma()">Proceed to Checkout</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    updateCartUI();
}

// Smart auto-injection of manual price inputs on course pages
function injectManualPriceInputs() {
    document.querySelectorAll('.cart-actions').forEach(actionsContainer => {
        if (actionsContainer.querySelector('.manual-price-box')) return;

        const addBtn = actionsContainer.querySelector('.add-to-cart-btn');
        if (!addBtn) return;

        const rawPrice = addBtn.getAttribute('data-course-price') || '0';
        const numericPrice = parsePrice(rawPrice);
        const formattedDefault = numericPrice.toLocaleString('en-IN');
        const courseId = addBtn.getAttribute('data-course-id') || 'default';

        const box = document.createElement('div');
        box.className = 'manual-price-box';
        box.innerHTML = `
            <div class="manual-price-header">
                <label class="manual-price-title" for="manual-input-${courseId}">
                    Course Fee / Payment Amount
                </label>
                <span class="manual-price-tag">Editable</span>
            </div>
            <div class="manual-price-input-wrapper">
                <span class="manual-price-currency">₹</span>
                <input type="number" 
                       id="manual-input-${courseId}" 
                       class="manual-price-input" 
                       value="${numericPrice}" 
                       min="1" 
                       step="100" 
                       data-original-price="${numericPrice}" 
                       placeholder="Enter payment amount" />
                <button type="button" class="manual-price-reset-btn" title="Reset to standard price">Reset</button>
            </div>
            <div class="manual-price-subtext">
                <span>Standard: ₹${formattedDefault}</span>
                <span class="subtext-separator">•</span>
                <span>Custom negotiated fee, installment, or sponsorship</span>
            </div>
        `;

        const resetBtn = box.querySelector('.manual-price-reset-btn');
        const inputEl = box.querySelector('.manual-price-input');
        resetBtn.addEventListener('click', () => {
            inputEl.value = inputEl.getAttribute('data-original-price');
        });

        // Insert at the top of .cart-actions
        actionsContainer.insertBefore(box, actionsContainer.firstChild);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectCartHTML();
    injectManualPriceInputs();

    // Attach event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const actionsContainer = btn.closest('.cart-actions') || btn.parentElement;
            const priceInput = actionsContainer ? actionsContainer.querySelector('.manual-price-input') : null;
            const activePrice = priceInput ? parsePrice(priceInput.value) : parsePrice(btn.getAttribute('data-course-price'));

            const course = {
                id: btn.getAttribute('data-course-id'),
                name: btn.getAttribute('data-course-name'),
                price: String(activePrice),
                originalPrice: btn.getAttribute('data-course-price')
            };
            addToCart(course);
        });
    });

    // Attach event listeners to direct checkout buttons
    document.querySelectorAll('.checkout-payalma-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const actionsContainer = btn.closest('.cart-actions') || btn.parentElement;
            const addBtn = actionsContainer ? actionsContainer.querySelector('.add-to-cart-btn') : null;
            const priceInput = actionsContainer ? actionsContainer.querySelector('.manual-price-input') : null;

            if (addBtn) {
                const activePrice = priceInput ? parsePrice(priceInput.value) : parsePrice(addBtn.getAttribute('data-course-price'));
                const course = {
                    id: addBtn.getAttribute('data-course-id'),
                    name: addBtn.getAttribute('data-course-name'),
                    price: String(activePrice),
                    originalPrice: addBtn.getAttribute('data-course-price')
                };
                checkoutWithPayAlma(course);
            }
        });
    });
});
