let cart = [];

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");

// Saves the current cart so it remains available after a page refresh.
function saveCart() {
    localStorage.setItem("bitebox-cart", JSON.stringify(cart));
}

// Loads the previous cart when the application starts.
function loadCart() {
    const savedCart = localStorage.getItem("bitebox-cart");

    if (!savedCart) {
        return;
    }

    try {
        cart = JSON.parse(savedCart);
    } catch (error) {
        cart = [];
    }
}

// Updates the number shown beside the cart icon.
function updateCartCount() {
    const itemCount = getCartItemCount();

    if (cartCount) {
        cartCount.textContent = itemCount;
    }
}

// Adds a food item to the cart or increases its quantity.
function addToCart(foodId) {
    const foodItem = menuItems.find((item) => {
        return item.id === foodId;
    });

    if (!foodItem) {
        return;
    }

    const existingItem = cart.find((item) => {
        return item.id === foodId;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...foodItem,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
}

// Increases the quantity of a cart item.
function increaseQuantity(foodId) {
    const item = cart.find((cartItem) => {
        return cartItem.id === foodId;
    });

    if (!item) {
        return;
    }

    item.quantity += 1;

    saveCart();
    updateCartCount();
    renderCart();
}

// Decreases the quantity of a cart item.
function decreaseQuantity(foodId) {
    const item = cart.find((cartItem) => {
        return cartItem.id === foodId;
    });

    if (!item) {
        return;
    }

    if (item.quantity === 1) {
        removeFromCart(foodId);
        return;
    }

    item.quantity -= 1;

    saveCart();
    updateCartCount();
    renderCart();
}

// Removes a food item completely from the cart.
function removeFromCart(foodId) {
    cart = cart.filter((item) => {
        return item.id !== foodId;
    });

    saveCart();
    updateCartCount();
    renderCart();
}

// Returns the total number of items currently in the cart.
function getCartItemCount() {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}

// Calculates the subtotal of all items in the cart.
function getCartSubtotal() {
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}

// Displays the current cart items in the cart panel.
function renderCart() {
    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        if (cartSubtotal) {
            cartSubtotal.textContent = "₹0";
        }

        return;
    }

    cartItems.innerHTML = "";

    cart.forEach((item) => {
        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <div class="cart-item-image">
                ${item.image}
            </div>

            <div class="cart-item-details">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price}
                </p>

                <div class="cart-item-actions">

                    <div class="quantity-controls">

                        <button
                            class="quantity-button decrease-button"
                            data-id="${item.id}"
                            aria-label="Decrease ${item.name} quantity"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button increase-button"
                            data-id="${item.id}"
                            aria-label="Increase ${item.name} quantity"
                        >
                            +
                        </button>

                    </div>

                    <button
                        class="remove-button"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    if (cartSubtotal) {
        cartSubtotal.textContent = `₹${getCartSubtotal()}`;
    }
}

// Opens the cart panel.
function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");
}

// Closes the cart panel.
function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
}

// Handles clicks on cart item buttons.
if (cartItems) {
    cartItems.addEventListener("click", (event) => {
        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const foodId = Number(button.dataset.id);

        if (button.classList.contains("increase-button")) {
            increaseQuantity(foodId);
        }

        if (button.classList.contains("decrease-button")) {
            decreaseQuantity(foodId);
        }

        if (button.classList.contains("remove-button")) {
            removeFromCart(foodId);
        }
    });
}

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (cartClose) {
    cartClose.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

loadCart();
updateCartCount();
renderCart();