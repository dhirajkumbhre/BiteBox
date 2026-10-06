const foodGrid = document.getElementById("foodGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-card");

// Creates the food cards and adds them to the menu section.
function renderMenu(items) {
    if (!foodGrid) {
        return;
    }

    foodGrid.innerHTML = "";

    if (items.length === 0) {
        foodGrid.innerHTML = `
            <p class="empty-message">
                No food items found.
            </p>
        `;

        return;
    }

    items.forEach((item) => {
        const foodCard = document.createElement("article");

        foodCard.classList.add("food-card");

        foodCard.innerHTML = `
            <div class="food-image">
                ${item.image}
            </div>

            <div class="food-info">
                <h3>${item.name}</h3>

                <p class="food-category">
                    ${item.category}
                </p>

                <p class="food-description">
                    ${item.description}
                </p>

                <div class="food-bottom">
                    <span class="food-price">
                        ₹${item.price}
                    </span>

                    <button
                        class="add-button"
                        data-id="${item.id}"
                        aria-label="Add ${item.name} to cart"
                    >
                        +
                    </button>
                </div>
            </div>
        `;

        foodGrid.appendChild(foodCard);
    });
}

// Filters the menu when the user selects a category.
function filterByCategory(category) {
    if (category === "All") {
        renderMenu(menuItems);
        return;
    }

    const filteredItems = menuItems.filter((item) => {
        return item.category === category;
    });

    renderMenu(filteredItems);
}

//Searches the menu using the food name or category.
function searchMenu(searchTerm) {
    const term = searchTerm.trim().toLowerCase();

    const filteredItems = menuItems.filter((item) => {
        return (
            item.name.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term)
        );
    });

    renderMenu(filteredItems);
}

// Handles category selection and updates the active category.
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.category;

        categoryButtons.forEach((categoryButton) => {
            categoryButton.classList.remove("active");
        });

        button.classList.add("active");

        filterByCategory(selectedCategory);
    });
});

// Updates the menu whenever the user types in the search field.
if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        searchMenu(event.target.value);
    });
}

//Handles Add to Cart clicks for dynamically created food cards.
foodGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-button");

    if (!addButton) {
        return;
    }

    const foodId = Number(addButton.dataset.id);

    addToCart(foodId);
});

// Show the complete menu when the page loads.
renderMenu(menuItems);