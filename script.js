// Supabase 初期化
const supabaseUrl = "https://cyntsmqckakzklrcnrcw.supabase.co";   // あなたの URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnRzbXFja2FremtscmNucmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTQzMzEsImV4cCI6MjA4MDk3MDMzMX0.yL2pmAFgaYA5OPcI7tD9F_JUm8JiOVcOp0GdQ1eb-Z4";               // anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);


let videos = [];
let editIndex = null;

// YouTube URL を iframe 用に変換
function convertToEmbedUrl(url) {
    if (url.includes("youtube.com/watch")) {
        return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
        return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
}


// 初期データ読み込み
fetch("data.json")
    .then(res => res.json())
    .then(data => {
        videos = data;
        renderGallery();
        buildTagPanel();
    });

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
    if (sortType === "newest") result.sort((a, b) => b.dateAdded - a.dateAdded);
    if (sortType === "oldest") result.sort((a, b) => a.dateAdded - b.dateAdded);
    if (sortType === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === "tag") result.sort((a, b) => (a.tags[0] || "").localeCompare(b.tags[0] || ""));

    gallery.innerHTML = result.map((v, i) => `
        <div class="card">
            <iframe src="${convertToEmbedUrl(v.url)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

            <h3>${v.title}</h3>
            <p>${v.description}</p>
            <div class="tags">
                ${v.tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>

            <button class="editBtn" onclick="openEditModal(${i})">編集</button>
            <button class="deleteBtn" onclick="deleteVideo(${i})">削除</button>
        </div>
    `).join("");
}

// タグ一覧パネル
function buildTagPanel() {
    const tagList = document.getElementById("tagList");
    const tags = new Set();

    videos.forEach(v => v.tags.forEach(t => tags.add(t)));

    tagList.innerHTML = [...tags].map(t => `
        <button onclick="filterByTag('${t}')">${t}</button>
    `).join("");
}

function filterByTag(tag) {
    document.getElementById("searchInput").value = tag;
    renderGallery();
}

// ===== Modal Control =====

const modal = document.getElementById("modal");
const openAddBtn = document.getElementById("openAddModal");
const closeBtn = document.getElementById("closeModal");
const closeXBtn = document.getElementById("modalCloseX");

function showModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
}

function hideModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
}

// 追加モード
function openAddModal() {
    editIndex = null;
    document.getElementById("modalHeader").textContent = "動画を追加";
    document.getElementById("modalUrl").value = "";
    document.getElementById("modalTitleInput").value = "";
    document.getElementById("modalDesc").value = "";
    document.getElementById("modalTags").value = "";
    showModal();
}

// 編集モード
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

// 背景クリックで閉じる
modal.querySelector(".modal-overlay").onclick = hideModal;

// 保存（UI更新のみ）
document.getElementById("saveModal").onclick = () => {
    const url = document.getElementById("modalUrl").value;
    const title = document.getElementById("modalTitleInput").value;
    const desc = document.getElementById("modalDesc").value;
    const tags = document.getElementById("modalTags").value
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    const newData = {
        url,
        title,
        description: desc,
        tags,
        dateAdded: Date.now()
    };

    if (editIndex === null) {
        videos.push(newData);
    } else {
        videos[editIndex] = newData;
    }

    renderGallery();
    buildTagPanel();
   hideModal();
}

// 削除ボタン

function deleteVideo(index) {
    const ok = confirm("この動画を削除しますか？");
    if (!ok) return;

    videos.splice(index, 1);
    renderGallery();
    buildTagPanel();
}
