document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("filter-container");
    const headerHeight = header.offsetHeight;

    // scroll-padding-topを動的に設定
    document.documentElement.style.scrollPaddingTop = `${headerHeight+1}px`;

    let scheduleData = [];

    // JSONデータを取得
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            scheduleData = data;
            renderSchedule("ALL");
            setupMonthButtons();
        })
        .catch(error => console.error("データの読み込みに失敗しました:", error));

    // スケジュールを表示する関数
    function renderSchedule(category) {
        const scheduleList = document.getElementById("schedule-list");
        scheduleList.innerHTML = "";

        const filteredData = category === "ALL"
            ? scheduleData
            : scheduleData.filter(event => event.category === category);

        let today = new Date().toISOString().split("T")[0].replace(/-/g, ".");
        let targetItem = null;

        filteredData.forEach((event, index) => {
            const item = document.createElement("a");
            item.classList.add("schedule-item");
            item.href = event.url;

            if (index === 0) {
                item.classList.add("first-item");
            }

            item.innerHTML = `
                <div class="date-category">
                    <span class="date">${event.date}</span>
                    <span class="category">${event.category}</span>
                </div>
                <span class="title">${event.title}</span>
            `;

            scheduleList.appendChild(item);

            // 今日の日付の要素を探す
            if (!targetItem && event.date >= today) {
                targetItem = item;
            }
        });

        // スクロール位置を今日または次のスケジュールに移動
        if (targetItem) {
            targetItem.scrollIntoView({ behavior: "instant", block: "start" });
        }
    }

    // フィルターボタンのイベントリスナー
    document.getElementById("filter-buttons").addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-btn")) {
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");

            const category = e.target.getAttribute("data-category");
            renderSchedule(category);
        }
    });

    // フッターの月選択ボタンの設定
    function setupMonthButtons() {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1月 = 1, 2月 = 2, ...
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextNextMonth = currentMonth === 11 ? 1 : currentMonth + 2;

        // ボタンのテキスト更新
        document.getElementById("prev-month").textContent = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(today.getFullYear(), prevMonth - 1, 1)) + ".";
        document.getElementById("current-month").textContent = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(today.getFullYear(), currentMonth - 1, 1)) + ".";
        document.getElementById("next-month").textContent = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(today.getFullYear(), nextMonth - 1, 1)) + ".";
        document.getElementById("next-next-month").textContent = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(today.getFullYear(), nextNextMonth - 1, 1)) + ".";

        function scrollToMonth(targetMonth) {
            const scheduleItems = document.querySelectorAll(".schedule-item");
            for (let item of scheduleItems) {
                const itemDate = item.querySelector(".date").textContent; // 例: "2025.02.23"
                const itemMonth = parseInt(itemDate.split(".")[1]); // 月だけ取得

                if (itemMonth === targetMonth) {
                    item.scrollIntoView({ behavior: "smooth", block: "start" });
                    break;
                }
            }
        }

        function scrollToToday() {
            const scheduleItems = document.querySelectorAll(".schedule-item");
            let targetItem = null;
            const todayStr = today.toISOString().split("T")[0].replace(/-/g, "."); // 例: "2025.02.23"

            for (let item of scheduleItems) {
                const itemDate = item.querySelector(".date").textContent;

                if (itemDate >= todayStr) {
                    targetItem = item;
                    break;
                }
            }

            if (targetItem) {
                targetItem.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }

        // 各ボタンのクリックイベント
        document.getElementById("prev-month").addEventListener("click", () => scrollToMonth(prevMonth));
        document.getElementById("current-month").addEventListener("click", () => scrollToMonth(currentMonth));
        document.getElementById("next-month").addEventListener("click", () => scrollToMonth(nextMonth));
        document.getElementById("next-next-month").addEventListener("click", () => scrollToMonth(nextNextMonth));
        document.getElementById("today").addEventListener("click", scrollToToday);
    }
});
