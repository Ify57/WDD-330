import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ExternalServices from "./ExternalServices.mjs";

loadHeaderFooter();

// Create the services needed for checkout.
const dataSource = new ExternalServices();

const checkout = new CheckoutProcess(
  "so-cart",
  "#order-summary",
  dataSource,
);

// Calculate the subtotal when the page loads.
checkout.init();

// Handle order submission.
const checkoutForm = document.querySelector("#checkout-form");

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    // Calculate the final order amounts.
    checkout.calculateOrderTotal();

    // Submit the order to the backend.
    const response = await checkout.checkout(checkoutForm);

    console.log("Order successfully submitted:", response);

    alert("Your order was successfully placed!");

    // Clear the cart after successful submission.
    localStorage.removeItem("so-cart");

    // Reset the checkout form.
    checkoutForm.reset();

  } catch (error) {
    console.error("Checkout error:", error);

    alert(
      "We could not process your order. Please check your information and try again.",
    );
  }
});
