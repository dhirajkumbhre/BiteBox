const foodGrid = document.getElementById("foodGrid");


// Creates the food cards and adds them to the menu section.
function renderMenu(items) {
    if (!foodGrid) {
        return;
    }

    foodGrid.innerHTML = "";

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


// Show the complete menu when the page loads.
renderMenu(menuItems);