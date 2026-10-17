const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const searchForm = document.getElementById("searchForm");

async function searchWikipedia(query) {
    if (!query.trim()) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                اكتب كلمة أو سؤالًا للبحث.
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = `
        <div class="loading">
            🔎 جارٍ البحث...
        </div>
    `;

    try {
        const url =
            "https://ar.wikipedia.org/w/api.php" +
            "?action=query" +
            "&generator=search" +
            "&gsrsearch=" + encodeURIComponent(query) +
            "&gsrnamespace=0" +
            "&gsrlimit=10" +
            "&prop=extracts|info" +
            "&exintro=1" +
            "&explaintext=1" +
            "&inprop=url" +
            "&format=json" +
            "&origin=*";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("حدث خطأ في الاتصال");
        }

        const data = await response.json();

        if (!data.query || !data.query.pages) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    لم نجد نتائج لهذا البحث.
                </div>
            `;
            return;
        }

        const pages = Object.values(data.query.pages);

        resultsContainer.innerHTML = "";

        pages.forEach(page => {
            const article = document.createElement("article");
            article.className = "result-card";

            const title = document.createElement("h3");
            title.textContent = page.title;

            const description = document.createElement("p");
            description.textContent =
                page.extract || "لا يوجد وصف متاح لهذا الموضوع.";

            const link = document.createElement("a");
            link.href =
                page.fullurl ||
                `https://ar.wikipedia.org/wiki/${encodeURIComponent(
                    page.title
                )}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "قراءة المقال ←";

            article.appendChild(title);
            article.appendChild(description);
            article.appendChild(link);

            resultsContainer.appendChild(article);
        });

    } catch (error) {
        console.error(error);

        resultsContainer.innerHTML = `
            <div class="error-state">
                ❌ حدث خطأ أثناء البحث.
                <br>
                حاول مرة أخرى.
            </div>
        `;
    }
}

if (searchForm) {
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchWikipedia(searchInput.value);
    });
}

if (searchButton) {
    searchButton.addEventListener("click", function() {
        searchWikipedia(searchInput.value);
    });
}
