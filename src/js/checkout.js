import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices();

const checkout = new CheckoutProcess("so-cart", "#order-summary", dataSource);

checkout.init();

const checkoutForm = document.querySelector("#checkout-form");

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    checkout.calculateOrderTotal();

    await checkout.checkout(checkoutForm);

    localStorage.removeItem("so-cart");

    window.location.href = "/checkout/success.html";
  } catch (error) {
    const serverDetails = error.details;

    let message =
      serverDetails?.message ||
      serverDetails?.Message ||
      serverDetails?.title ||
      error.message ||
      "We could not process your order. Please check your information and try again.";

    if (serverDetails?.errors && typeof serverDetails.errors === "object") {
      const validationMessages = Object.values(serverDetails.errors).flat();

      if (validationMessages.length > 0) {
        message = validationMessages.join(" ");
      }
    }

    alertMessage(message);
  }
});
