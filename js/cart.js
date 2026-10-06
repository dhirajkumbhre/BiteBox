let cart = [];

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
}

// Removes a food item completely from the cart.
function removeFromCart(foodId) {
    cart = cart.filter((item) => {
        return item.id !== foodId;
    });

    saveCart();
}

// Returns the total number of items currently in the cart.
function getCartItemCount() {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}

loadCart();