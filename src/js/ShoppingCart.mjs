import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
} from "./utils.mjs";

function cartItemTemplate(item) {
  const quantity = item.Quantity || 1;
  const lineTotal = (Number(item.FinalPrice) * quantity).toFixed(2);
  const image = item.Images?.PrimarySmall || item.Image;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
      <label class="cart-card__quantity">
        qty:
        <input
          type="number"
          class="cart-card__qty-input"
          min="1"
          value="${quantity}"
          data-id="${item.Id}"
          aria-label="Quantity for ${item.Name}"
        />
      </label>
      <p class="cart-card__price">$${lineTotal}</p>
    </li>
  `;
}

// Merge duplicate rows (from before quantities existed) into one row per product.
function combineDuplicates(cartItems) {
  const combined = [];
  cartItems.forEach((item) => {
    const existing = combined.find((entry) => entry.Id === item.Id);
    if (existing) {
      existing.Quantity += item.Quantity || 1;
    } else {
      combined.push({ ...item, Quantity: item.Quantity || 1 });
    }
  });
  return combined;
}

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
    this.cartItems = [];
  }

  init() {
    this.cartItems = combineDuplicates(getLocalStorage(this.key) || []);
    setLocalStorage(this.key, this.cartItems);

    // One listener on the list handles every quantity box (event delegation).
    this.listElement.addEventListener("change", (event) => {
      if (event.target.matches(".cart-card__qty-input")) {
        this.updateQuantity(event.target.dataset.id, event.target.value);
      }
    });

    this.render();
  }

  updateQuantity(id, value) {
    const quantity = Math.max(1, parseInt(value, 10) || 1);
    const item = this.cartItems.find((entry) => entry.Id === id);
    if (!item) return;

    item.Quantity = quantity;
    setLocalStorage(this.key, this.cartItems);
    this.render();
  }

  render() {
    if (this.cartItems.length === 0) {
      this.listElement.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
      return;
    }

    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      this.cartItems,
      "afterbegin",
      true,
    );
  }
}