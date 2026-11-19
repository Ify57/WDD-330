import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import {loadHeaderFooter } from './utils.mjs';

const dataSource = new ProductData('tents');
const listElement = document.querySelector('.product-detail');
const productlist = new ProductList('tents', dataSource, listElement);

productlist.init();
loadHeaderFooter();