import { videos } from "./supabase.js";
import { buildEmbedHTML } from "./embed.js";

export function renderGallery() {
    const gallery = document.getElementById("gallery");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let result = [...videos];

    // 検索条件そのまま移植
    result = result.filter(v =>
        v.title.toLowerCase().includes(search) ||
        v.description.toLowerCase().includes(search) ||
        v.tags.join(" ").toLowerCase().includes(search)
    );

    // ソート処理そのまま移植
    if (sortType === "newest") result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortType === "oldest") result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortType === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === "tag") result.sort((a, b) => (a.tags[0] || "").localeCompare(b.tags[0] || ""));

    // HTML描画
    gallery.innerHTML = result.map((v, i) => `
        <div class="card">
            ${buildEmbedHTML(v.url)}
            <h3>${v.title}</h3>
            <p>${v.description}</p>
            <div class="tags">
                ${v.tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>
            <button class="editBtn" onclick="openEditModal(${i})">編集</button>
            <button class="deleteBtn" onclick="deleteVideo(${i})">削除</button>
        </div>
    `).join("");

    // TikTok/X の script 再読み込みもそのまま移植
    const oldTikTok = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    if (oldTikTok) oldTikTok.remove();
    const tikTokScript = document.createElement("script");
    tikTokScript.src = "https://www.tiktok.com/embed.js";
    tikTokScript.async = true;
    document.body.appendChild(tikTokScript);

    const oldTw = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
    if (oldTw) oldTw.remove();
    const twScript = document.createElement("script");
    twScript.src = "https://platform.twitter.com/widgets.js";
    twScript.async = true;
    document.body.appendChild(twScript);
}
