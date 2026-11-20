import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const categoryName = category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
document.querySelector(".title").textContent = `${categoryName}`;
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();