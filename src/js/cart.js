import ShoppingCart from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".product-list");

const shoppingCart = new ShoppingCart("so-cart", listElement);

shoppingCart.init();
