function productCardTemplate(product){
    return `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="price">$${product.price.toFixed(2)}</span>
        </div>
    `;
}

export default class ProductList{
    constructor(category, dataSource,listElement){
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init(){
        const list = await this.dataSource.getData();
    }
}