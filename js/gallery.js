// gallery.js
import { buildEmbedHTML } from "./embed.js";

// ============================
// ギャラリー描画
// ============================
export function renderGallery() {
    const gallery = document.getElementById("gallery");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let result = [...videos];

    // ---------------------------
    // 検索フィルタ
    // ---------------------------
    result = result.filter(v =>
        v.title.toLowerCase().includes(search) ||
        v.description.toLowerCase().includes(search) ||
        v.tags.join(" ").toLowerCase().includes(search)
    );

    // ---------------------------
    // ソート
    // ---------------------------
    if (sortType === "newest") {
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    if (sortType === "oldest") {
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    if (sortType === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortType === "tag") {
        result.sort((a, b) => (a.tags[0] || "").localeCompare(b.tags[0] || ""));
    }

    // ---------------------------
    // HTML描画
    // ---------------------------
    gallery.innerHTML = result
        .map((v) => {
            return `
                <div class="card">
                    ${buildEmbedHTML(v.url)}
                    <h3>${v.title}</h3>
                    <p>${v.description}</p>

                    <div class="tags">
                        ${v.tags.map(t => `<span class="tag">${t}</span>`).join("")}
                    </div>

                    <button class="editBtn" data-id="${v.id}">編集</button>
                    <button class="deleteBtn" data-id="${v.id}">削除</button>
                </div>
            `;
        })
        .join("");

    // ---------------------------
    // 編集ボタン → main.js へイベント通知
    // ---------------------------
    gallery.querySelectorAll(".editBtn").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            document.dispatchEvent(
                new CustomEvent("requestEditById", { detail: id })
            );
        };
    });

    // ---------------------------
    // 削除ボタン → main.js へイベント通知
    // ---------------------------
    gallery.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            document.dispatchEvent(
                new CustomEvent("requestDeleteById", { detail: id })
            );
        };
    });

    // ---------------------------
    // TikTok/X 再読み込み
    // ---------------------------
    reloadTikTokScript();
    reloadTwitterScript();
}



// ============================
// TikTok / Twitter script 再読み込み
// ============================
function reloadTikTokScript() {
    const old = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (old) old.remove();

    const s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
}

function reloadTwitterScript() {
    const old = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
    if (old) old.remove();

    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    document.body.appendChild(s);
}
