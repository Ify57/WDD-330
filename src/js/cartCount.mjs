export default function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("so-cart"));
  const badge = document.querySelector(".cart-count");
  let count = 0;

  if (Array.isArray(cart)) {
    count = cart.length;
  } else if (cart) {
    count = 1;
  }

  badge.textContent = count;

  if (count === 0) {
    badge.hidden = true;
  } else {
    badge.hidden = false;
  }
}
