// FAQ toggle
document.querySelectorAll(".faq-item").forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

// Smooth scroll for service category links
document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.scroll).scrollIntoView({ behavior: "smooth" });
  });
});