import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      document.getElementById("product").textContent = "Product not found.";
      return;
    }

    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

   addProductToCart() {
    const cart = getLocalStorage("so-cart") || [];
    const existing = cart.find((item) => item.Id === this.product.Id);

    if (existing) {
      existing.Quantity = (existing.Quantity || 1) + 1;
    } else {
      cart.push({ ...this.product, Quantity: 1 });
    }

    setLocalStorage("so-cart", cart);

    alert("Product successfully added to cart!");
  }

  renderProductDetails() {
    const productElement = document.getElementById("product");

    const color = this.product.Colors?.[0]?.ColorName || "";

    productElement.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>

      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.Name}"
      />

      <p class="product-card__price">
        $${Number(this.product.FinalPrice).toFixed(2)}
      </p>

      <p class="product__color">${color}</p>

      <p class="product__description">
        ${this.product.DescriptionHtmlSimple}
      </p>

      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">
          Add to Cart
        </button>
      </div>
    `;
  }
}
