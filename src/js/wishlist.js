import Wishlist from "./Wishlist.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".product-list");
const wishlist = new Wishlist("so-wishlist", listElement);

wishlist.init();
