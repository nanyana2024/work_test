// ---------------------------
// Supabase を window から取得
// ---------------------------
const supabase = window.supabaseClient;

// ---------------------------
// 変数
// ---------------------------
let videos = [];
let editIndex = null;

// ---------------------------
// URL サービス判定 & YouTube embed 変換
// ---------------------------
function detectService(url) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("tiktok.com")) return "tiktok";
    if (url.includes("twitter.com") || url.includes("x.com")) return "x";
    return "other";
}

function convertToEmbedUrl(url) {
    if (url.includes("youtube.com/watch")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
}

// ---------------------------
// Supabase から読み込み
// ---------------------------
async function loadVideos() {
    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Load error:", error);
        return;
    }

    videos = data;
    renderGallery();
    buildTagPanel();
}

// ページ読み込み時に起動
loadVideos();

// ---------------------------
// ギャラリー描画
// ---------------------------
function renderGallery() {
    const gallery = document.getElementById("gallery");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const sortType = document.getElementById("sortSelect").value;

    let result = [...videos];

    // 検索
    result = result.filter(v =>
        v.title.toLowerCase().includes(search) ||
        v.description.toLowerCase().includes(search) ||
        v.tags.join(" ").toLowerCase().includes(search)
    );

    // ソート
    if (sortType === "newest") result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortType === "oldest") result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortType === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === "tag") result.sort((a, b) => (a.tags[0] || "").localeCompare(b.tags[0] || ""));

    // ギャラリー描画
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

    // X（Twitter）埋め込み初期化
    if (window.twttr && twttr.widgets) {
        twttr.widgets.load();
    }

    // TikTok script 再読み込み
    reloadTikTokScripts();
}

// ---------------------------
// 埋め込み HTML 生成
// ---------------------------
function buildEmbedHTML(url) {
    const service = detectService(url);

    if (service === "youtube") {
        return `<iframe src="${convertToEmbedUrl(url)}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                </iframe>`;
    }

    if (service === "tiktok") {
        return `<blockquote class="tiktok-embed" cite="${url}" style="max-width: 305px;min-width: 325px;">
                    <section>Loading...</section>
                </blockquote>`;
    }

    if (service === "x") {
        return `<blockquote class="twitter-tweet">
                    <a href="${url}"></a>
                </blockquote>`;
    }

    return `<p>このURLは埋め込みに対応していません</p>`;
}

// ---------------------------
// TikTok script 再読み込み
// ---------------------------
function reloadTikTokScripts() {
    const old = document.querySelectorAll('script[src="https://www.tiktok.com/embed.js"]');
    old.forEach(s => s.remove());
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
}

// ---------------------------
// タグパネル
// ---------------------------
function buildTagPanel() {
    const tagList = document.getElementById("tagList");
    const tags = new Set();
    videos.forEach(v => v.tags.forEach(t => tags.add(t)));
    tagList.innerHTML = [...tags].map(t => `<button onclick="filterByTag('${t}')">${t}</button>`).join("");
}

function filterByTag(tag) {
    document.getElementById("searchInput").value = tag;
    renderGallery();
}

// ---------------------------
// モーダル操作
// ---------------------------
const modal = document.getElementById("modal");
const openAddBtn = document.getElementById("openAddModal");
const closeBtn = document.getElementById("closeModal");
const closeXBtn = document.getElementById("modalCloseX");

function showModal() { modal.classList.remove("hidden"); modal.setAttribute("aria-hidden","false"); }
function hideModal() { modal.classList.add("hidden"); modal.setAttribute("aria-hidden","true"); }

function openAddModal() {
    editIndex = null;
    document.getElementById("modalHeader").textContent = "動画を追加";
    document.getElementById("modalUrl").value = "";
    document.getElementById("modalTitleInput").value = "";
    document.getElementById("modalDesc").value = "";
    document.getElementById("modalTags").value = "";
    showModal();
}

function openEditModal(i) {
    editIndex = i;
    const v = videos[i];
    document.getElementById("modalHeader").textContent = "動画を編集";
    document.getElementById("modalUrl").value = v.url;
    document.getElementById("modalTitleInput").value = v.title;
    document.getElementById("modalDesc").value = v.description;
    document.getElementById("modalTags").value = v.tags.join(",");
    showModal();
}

// イベント登録
openAddBtn.onclick = openAddModal;
closeBtn.onclick = hideModal;
if (closeXBtn) closeXBtn.onclick = hideModal;
modal.querySelector(".modal-overlay").onclick = hideModal;

// ---------------------------
// 保存（INSERT / UPDATE）
// ---------------------------
document.getElementById("saveModal").onclick = async () => {
    const url = document.getElementById("modalUrl").value;
    const title = document.getElementById("modalTitleInput").value;
    const desc = document.getElementById("modalDesc").value;
    const tags = document.getElementById("modalTags").value.split(",").map(t=>t.trim()).filter(t=>t.length>0);
    const newData = { url, title, description: desc, tags };

    if (editIndex === null) {
        const { error } = await supabase.from("videos").insert([newData]);
        if (error) return console.error("Insert error:", error);
    } else {
        const { error } = await supabase.from("videos").update(newData).eq("id", videos[editIndex].id);
        if (error) return console.error("Update error:", error);
    }

    hideModal();
    loadVideos();
};

// ---------------------------
// 削除処理
// ---------------------------
async function deleteVideo(index) {
    if (!confirm("この動画を削除しますか？")) return;
    const { error } = await supabase.from("videos").delete().eq("id", videos[index].id);
    if (error) return console.error("Delete error:", error);
    loadVideos();
}
