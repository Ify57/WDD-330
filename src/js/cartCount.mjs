export default function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("so-cart"));
  const badge = document.querySelector(".cart-count");
  let count = 0;

  if (cart) {
    count = cart.length;
  }

  badge.textContent = count;

  if (count === 0) {
    badge.hidden = true;
  } else {
    badge.hidden = false;
  }
}
