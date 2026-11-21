import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector, dataSource) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.dataSource = dataSource;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];

    this.calculateItemSubTotal();

    const zipInput = document.querySelector("#zip");

    if (zipInput) {
      zipInput.addEventListener("input", () => {
        if (zipInput.value.trim() !== "") {
          this.calculateOrderTotal();
        }
      });
    }
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice),
      0,
    );

    const subtotalElement = document.querySelector("#subtotal");
    const itemCountElement = document.querySelector("#item-count");

    if (subtotalElement) {
      subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    if (itemCountElement) {
      itemCountElement.textContent = this.list.length;
    }
  }

  calculateOrderTotal() {
    const itemCount = this.list.length;

    this.tax = this.itemTotal * 0.06;

    this.shipping =
      itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector("#tax").textContent =
      `$${this.tax.toFixed(2)}`;

    document.querySelector("#shipping").textContent =
      `$${this.shipping.toFixed(2)}`;

    document.querySelector("#order-total").textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: 1,
    }));
  }

  async checkout(form) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const order = {
      orderDate: new Date().toISOString(),
      ...formObject,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      return await this.dataSource.checkout(order);
    } catch (error) {
      console.error("CheckoutProcess error:", error);
      throw error;
    }
  }
}