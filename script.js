const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const message = document.getElementById("message");
const themeToggle = document.getElementById("themeToggle");

const searchUrls = {
  google: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  scholar: query => `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
  youtube: query => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  wikipedia: query => `https://www.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`
};

form.addEventListener("submit", event => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    message.textContent = "اكتب موضوعًا تريد البحث عنه أولًا.";
    input.focus();
    return;
  }
  message.textContent = "";
  const selected = document.querySelector('input[name="engine"]:checked');
  const engine = selected ? selected.value : "google";
  window.open(searchUrls[engine](query), "_blank", "noopener,noreferrer");
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.query || "";
    input.focus();
    form.requestSubmit();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.setAttribute("aria-label", isDark ? "تفعيل المظهر الفاتح" : "تفعيل المظهر الداكن");
  themeToggle.title = isDark ? "تفعيل المظهر الفاتح" : "تفعيل المظهر الداكن";
  try { localStorage.setItem("mystudy-theme", isDark ? "dark" : "light"); } catch (_) {}
});

try {
  if (localStorage.getItem("mystudy-theme") === "dark") document.body.classList.add("dark");
} catch (_) {}

document.getElementById("year").textContent = new Date().getFullYear();
