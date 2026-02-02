const filterButtons = document.querySelectorAll(".shop-filters button");
const products = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Active state
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    products.forEach(product => {
      const category = product.dataset.category;

      if (filter === "all" || category === filter) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
});

function openNotify() {
  document.getElementById("notifyModal").classList.add("open");
}

function closeNotify() {
  document.getElementById("notifyModal").classList.remove("open");
}
