const searchInput = document.getElementById("searchInput");
const featuredSection = document.getElementById("featured-guides");
const articles = document.querySelectorAll("#article-list .article-card");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeFilter = "all";

function updateArticles() {
  const query = searchInput.value.toLowerCase().trim();
  let anyVisible = false;

  articles.forEach(article => {
    const title = article.dataset.title;
    const description = article.dataset.description;
    const category = article.dataset.category;

    const matchesSearch =
      title.includes(query) || description.includes(query);

    const matchesFilter =
      activeFilter === "all" || category === activeFilter;

    const show = matchesSearch && matchesFilter;

    article.style.display = show ? "flex" : "none";
    if (show) anyVisible = true;
  });

  // Hide featured guides while searching
  featuredSection.style.display = query.length > 0 ? "none" : "block";
}

searchInput.addEventListener("input", updateArticles);

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    updateArticles();
  });
});