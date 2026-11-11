//purpose of script is to generate a list of product cards in HTML from an array
import { renderListWithTemplate } from "./utils.mjs"

function productCardTemplate(product) {
    return `<li class="product-card">
            <a href="product_pages/?products=${product.Id}">
                <img src="${product.Image}" alt="Image of ${product.Name}">
                <h2 class="card__brand">${product.Brand.Name}</h2>
                <h3 class="card__name>${product.Name}</h3>
                <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
        </li>
        `;
}

export default class ProductList {
    //begin creating module by writing code for constructor
    //constructor should receive following parameters: category, dataSource, HTML element (listElement)
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init() {
        //dataSource will return Promise - use await to resolve
        const list = await this.dataSource.getData();
        console.log(list);
        this.renderList(list);
    }
    //call template functino once for each product in list; insert to DOM
    //method should take product list as argument
    //map is a good way to transform data objects into HTML strings

    renderList(list) {
        /*Moved to utils.mjs
         //for each
         const htmlStringObj = list.map(productCardTemplate);
         //insert to DOM
         this.listElement.insertAdjacentHTML("afterbegin", htmlStringObj.join(""));
        */
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }


}