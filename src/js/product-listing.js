import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const category = getParam("category");
const categoryName = category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
document.querySelector(".title").textContent = `${categoryName}`;
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const myList = new ProductList(category, dataSource, listElement);

myList.init();
/*
if (listElement) {
    const productList = new ProductList(
        "tents",
        dataSource,
        listElement,
    );

    productList.init();
}*/