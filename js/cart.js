
let cart = [];

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");

const cartSubtotal = document.getElementById("cartSubtotal");
const deliveryFeeElement = document.getElementById("deliveryFee");
const grandTotalElement = document.getElementById("grandTotal");

const DELIVERY_FEE = 40;
const FREE_DELIVERY_MINIMUM = 499;


// Saves the cart so the items remain after a page refresh.
function saveCart() {
    localStorage.setItem("bitebox-cart", JSON.stringify(cart));
}


// Restores the saved cart when the page loads.
function loadCart() {
    const savedCart = localStorage.getItem("bitebox-cart");

    if (!savedCart) {
        cart = [];
        return;
    }

    try {
        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            cart = [];
            return;
        }

        // Use the latest food details from menu.js.
        cart = parsedCart
            .filter((item) => {
                return (
                    item &&
                    Number.isInteger(item.id) &&
                    Number.isInteger(item.quantity) &&
                    item.quantity > 0 &&
                    menuItems.some((food) => food.id === item.id)
                );
            })
            .map((item) => {
                const foodItem = menuItems.find((food) => {
                    return food.id === item.id;
                });

                return {
                    ...foodItem,
                    quantity: item.quantity
                };
            });

    } catch (error) {
        cart = [];
    }
}


// Adds a food item or increases its quantity if it is already in the cart.
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
    updateCartUI();
}


// Increases the quantity of an item already in the cart.
function increaseQuantity(foodId) {
    const item = cart.find((cartItem) => {
        return cartItem.id === foodId;
    });

    if (!item) {
        return;
    }

    item.quantity += 1;

    saveCart();
    updateCartUI();
}


// Decreases the quantity and removes the item if it reaches zero.
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
    updateCartUI();
}


// Removes an item completely from the cart.
function removeFromCart(foodId) {
    cart = cart.filter((item) => {
        return item.id !== foodId;
    });

    saveCart();
    updateCartUI();
}


// Counts individual units, not just different food types.
function getCartItemCount() {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}


// Adds up the price of every item multiplied by its quantity.
function getCartSubtotal() {
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}


// Orders below ₹499 have a ₹40 delivery fee.
function getDeliveryFee() {
    const subtotal = getCartSubtotal();

    if (subtotal === 0 || subtotal >= FREE_DELIVERY_MINIMUM) {
        return 0;
    }

    return DELIVERY_FEE;
}


// Calculates the final amount the customer would pay.
function getGrandTotal() {
    return getCartSubtotal() + getDeliveryFee();
}


// Updates the number beside the cart icon.
function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = getCartItemCount();
    }
}


// Updates the price summary shown at the bottom of the cart.
function updateCartTotals() {
    if (cartSubtotal) {
        cartSubtotal.textContent = `₹${getCartSubtotal()}`;
    }

    if (deliveryFeeElement) {
        deliveryFeeElement.textContent = `₹${getDeliveryFee()}`;
    }

    if (grandTotalElement) {
        grandTotalElement.textContent = `₹${getGrandTotal()}`;
    }
}


// Displays all current items and their quantity controls.
function renderCart() {
    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Your cart is empty.</p>
        `;

        updateCartTotals();
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
                <h3>${item.name}</h3>

                <p>₹${item.price} each</p>

                <div class="cart-item-actions">
                    <div class="quantity-controls">

                        <button
                            class="quantity-button decrease-button"
                            data-id="${item.id}"
                            aria-label="Decrease ${item.name} quantity"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

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

    updateCartTotals();
}


// Keeps the cart count and price summary in sync.
function updateCartUI() {
    updateCartCount();
    renderCart();
}


// Opens the cart drawer.
function openCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");

    cartPanel.setAttribute("aria-hidden", "false");
}


// Closes the cart drawer.
function closeCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");

    cartPanel.setAttribute("aria-hidden", "true");
}


// Handles quantity and remove buttons inside the cart.
if (cartItems) {
    cartItems.addEventListener("click", (event) => {
        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const foodId = Number(button.dataset.id);

        if (button.classList.contains("increase-button")) {
            increaseQuantity(foodId);
        } else if (button.classList.contains("decrease-button")) {
            decreaseQuantity(foodId);
        } else if (button.classList.contains("remove-button")) {
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


// Restore saved items and calculate their totals on page load.
loadCart();
updateCartUI();
