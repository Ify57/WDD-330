import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const categoryTitle = document.querySelector("#category-title");

if (category && listElement && categoryTitle) {
  const searchTerm = category.trim();

  if (searchTerm) {
    categoryTitle.textContent = `Search results for "${searchTerm}"`;

    const productList = new ProductList(
      searchTerm,
      dataSource,
      listElement,
    );

    productList.init().catch((error) => {
      console.error("Product loading error:", error);

      listElement.innerHTML =
        "<li>Unable to load products. Please try again.</li>";
    });
  } else {
    categoryTitle.textContent = "Please enter a search term.";
  }
} else if (categoryTitle) {
  categoryTitle.textContent = "Search for a product";
}