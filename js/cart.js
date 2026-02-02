let cart = JSON.parse(localStorage.getItem("vyxxel-cart")) || [];

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cart.length;
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const list = document.getElementById("cartItems");

  list.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <span>${item.name}</span>
      <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
    `;

    list.appendChild(li);
  });

  drawer.classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
}

function addToCart(item) {
  if (item.type === "service") {
    const exists = cart.some(i => i.id === item.id);
    if (exists) {
      showToast("You can only add this service once");
      openCart();
      return;
    }
  }

  cart.push(item);
  localStorage.setItem("vyxxel-cart", JSON.stringify(cart));
  updateCartCount();
  showToast(item.name + " added to request");
  openCart();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("vyxxel-cart", JSON.stringify(cart));
  updateCartCount();
  openCart();
}

function goToBooking() {
  localStorage.setItem("bookingItems", JSON.stringify(cart));
  window.location.href = "contact.html";
}

document.addEventListener("DOMContentLoaded", updateCartCount);