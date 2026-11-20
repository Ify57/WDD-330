import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();
order.calculateOrderTotal();

document.querySelector("#zip").addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkoutSubmit").addEventListener("click", (event) => {
    event.preventDefault();
    order.checkout();
});
/*
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
    e.preventDefault();
    order.checkout();
})*/
