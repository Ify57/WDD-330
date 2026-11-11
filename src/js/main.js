import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ProductData("tents");

//select the html list element from index.html
const listElement = document.querySelector(".product-list");

//three parameters category, datasource, listelement 
const productList = new ProductList("tents", dataSource, listElement);

productList.init();