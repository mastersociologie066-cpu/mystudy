const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const searchForm = document.getElementById("searchForm");

async function searchWikipedia(query) {

    query = query.trim();

    if (!query) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                ⚠️ اكتب كلمة أو موضوعًا للبحث.
            </div>
        `;
        return;
    }

    resultsContainer.innerHTML = `
        <div class="loading">
            🔎 جارٍ البحث عن: <strong>${query}</strong>...
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
            throw new Error("فشل الاتصال");
        }

        const data = await response.json();

        resultsContainer.innerHTML = "";

        if (!data.query || !data.query.pages) {

            resultsContainer.innerHTML = `
                <div class="empty-state">
                    😕 لم نجد نتائج لهذا البحث.
                </div>
            `;

            return;
        }

        const pages = Object.values(data.query.pages);

        pages.forEach(page => {

            const card = document.createElement("div");
            card.className = "result-card";

            const title = document.createElement("h3");
            title.textContent = page.title;

            const description = document.createElement("p");

            description.textContent =
                page.extract ||
                "لا يوجد وصف متاح لهذا الموضوع.";

            const link = document.createElement("a");

            link.href =
                page.fullurl ||
                `https://ar.wikipedia.org/wiki/${encodeURIComponent(page.title)}`;

            link.target = "_blank";
            link.rel = "noopener noreferrer";

            link.textContent = "📖 قراءة المزيد";

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(link);

            resultsContainer.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        resultsContainer.innerHTML = `
            <div class="error-state">
                ❌ حدث خطأ أثناء البحث.
                <br>
                حاول مرة أخرى بعد قليل.
            </div>
        `;
    }
}


searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    searchWikipedia(searchInput.value);

});


searchButton.addEventListener("click", function(event) {

    event.preventDefault();

    searchWikipedia(searchInput.value);

});
