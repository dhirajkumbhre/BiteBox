const foodGrid = document.getElementById("foodGrid");


function renderMenu(items) {

    if (!foodGrid) {
        return;
    }

    foodGrid.innerHTML = "";

    items.forEach((item) => {

        const foodCard = document.createElement("article");

        foodCard.className = "food-card";

        foodCard.innerHTML = `
            <div class="food-image">
                ${item.emoji}
            </div>

            <div class="food-info">

                <h3>${item.name}</h3>

                <p class="food-category">
                    ${item.category}
                </p>

                <p>
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


renderMenu(menuItems);