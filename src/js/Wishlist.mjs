import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  alertMessage,
} from "./utils.mjs";

function wishlistItemTemplate(item) {
  const image = item.Images?.PrimarySmall || item.Image;

  return `
    <li class="cart-card divider">
      <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
        <img src="${image}" alt="${item.Name}" />
      </a>
      <a href="/product_pages/?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
      <p class="cart-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>
      <div class="wishlist-actions">
        <button type="button" data-action="move" data-id="${item.Id}">
          Move to Cart
        </button>
        <button type="button" class="wishlist-remove" data-action="remove" data-id="${item.Id}">
          Remove
        </button>
      </div>
    </li>
  `;
}

export default class Wishlist {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
    this.items = [];
  }

  init() {
    this.items = getLocalStorage(this.key) || [];

    // One click listener handles every button in the list (event delegation).
    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;

      const { action, id } = button.dataset;
      if (action === "move") this.moveToCart(id);
      if (action === "remove") this.removeItem(id);
    });

    this.render();
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.Id !== id);
    setLocalStorage(this.key, this.items);
    this.render();
  }

  moveToCart(id) {
    const item = this.items.find((entry) => entry.Id === id);
    if (!item) return;

    const cart = getLocalStorage("so-cart") || [];
    const inCart = cart.find((entry) => entry.Id === id);

    if (inCart) {
      inCart.Quantity = (inCart.Quantity || 1) + 1;
    } else {
      cart.push({ ...item, Quantity: 1 });
    }

    setLocalStorage("so-cart", cart);
    this.removeItem(id);
    alertMessage(`${item.Name} was moved to your cart.`);
  }

  render() {
    if (this.items.length === 0) {
      this.listElement.innerHTML = `<li class="cart-empty">Your wishlist is empty.</li>`;
      return;
    }

    renderListWithTemplate(
      wishlistItemTemplate,
      this.listElement,
      this.items,
      "afterbegin",
      true,
    );
  }
}