import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}
//prepares order items list for use by returning them in simplified form 
function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: 1,
    }));
};

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        const storedItems = getLocalStorage(this.key);
        this.list = Array.isArray(storedItems) ? storedItems : [storedItems];
        this.calculateItemSummary();
    }
    //method to calculate and display the item subtotal (called when page loads)
    calculateItemSummary() {
        const subtotal = this.list.reduce(
            (sum, item) => sum + Number(item.FinalPrice || 0),
            0,
        );
        this.itemTotal = subtotal.toFixed(2);
        document.querySelector(`${this.outputSelector} #num-items`).textContent = this.list.length;
        document.querySelector(`${this.outputSelector} #cartTotal`).textContent = `$${this.itemTotal}`;
    }
    //method to calculate and display shipping and order total (called after user fills in zip code)
    calculateOrderTotal() {
        this.tax = (Number(this.itemTotal) * 0.06).toFixed(2);
        this.shipping = this.list.length ? 10 + (this.list.length - 1) * 2 : 0;
        this.orderTotal = (Number(this.itemTotal) + this.shipping + Number(this.tax)).toFixed(2);

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        document.querySelector(`${this.outputSelector} #shipping`).textContent = `$${this.shipping.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #tax`).textContent = `$${this.tax}`;
        document.querySelector(`${this.outputSelector} #orderTotal`).textContent = `$${this.orderTotal}`;
    }

    async checkout() {
        const formElement = document.forms.checkout;
        const order = formDataToJSON(formElement);
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = packageItems(this.list);
        //Error handling here because user needs to know what they did wrong, therefore makes sense to have it with other form code
        try {
            await services.checkout(order);
            setLocalStorage(this.key, []);
            window.location.assign("/checkout/success.html");
        } catch (error) {
            removeAllAlerts();
            const messages = error.message && typeof error.message === "object"
                ? Object.values(error.message)
                : [error.message || "Unable to place your order."];
            messages.forEach((message) => alertMessage(message));
        }
    }
}