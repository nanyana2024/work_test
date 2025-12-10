let videos = [];
let editIndex = null;

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
            <iframe src="${v.url}" allowfullscreen></iframe>

            <h3>${v.title}</h3>
            <p>${v.description}</p>
            <div class="tags">
                ${v.tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>

            <button class="editBtn" onclick="openEditModal(${i})">編集</button>
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

// モーダル
document.getElementById("openAddModal").onclick = () => openAddModal();
document.getElementById("cancelModal").onclick = () => closeModal();

function openAddModal() {
    editIndex = null;
    document.getElementById("modalTitle").textContent = "動画を追加";
    document.getElementById("modalUrl").value = "";
    document.getElementById("modalTitleInput").value = "";
    document.getElementById("modalDesc").value = "";
    document.getElementById("modalTags").value = "";
    document.getElementById("modal").classList.remove("hidden");
}

function openEditModal(i) {
    const v = videos[i];
    editIndex = i;

    document.getElementById("modalTitle").textContent = "動画を編集";
    document.getElementById("modalUrl").value = v.url;
    document.getElementById("modalTitleInput").value = v.title;
    document.getElementById("modalDesc").value = v.description;
    document.getElementById("modalTags").value = v.tags.join(",");
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

// 保存（まだデータ保存は行わない。UIのみ更新）
document.getElementById("saveModal").onclick = () => {
    const url = document.getElementById("modalUrl").value;
    const title = document.getElementById("modalTitleInput").value;
    const desc = document.getElementById("modalDesc").value;
    const tags = document.getElementById("modalTags").value.split(",").map(t => t.trim());

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
    closeModal();
};

// タグパネル開閉
document.getElementById("tagPanelBtn").onclick = () => {
    document.getElementById("tagPanel").classList.add("visible");
};
document.getElementById("closeTagPanel").onclick = () => {
    document.getElementById("tagPanel").classList.remove("visible");
};

// 検索/ソート反映
document.getElementById("searchInput").oninput = renderGallery;
document.getElementById("sortSelect").onchange = renderGallery;

// モーダル開閉
function showModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function hideModal() {
    document.getElementById("modal").classList.add("hidden");
}

document.getElementById("closeModal").onclick = hideModal;

// 追加モード
document.getElementById("openAddModal").onclick = () => {
    editIndex = null;
    document.getElementById("modalHeader").textContent = "動画を追加";
    document.getElementById("modalUrl").value = "";
    document.getElementById("modalTitleInput").value = "";
    document.getElementById("modalDesc").value = "";
    document.getElementById("modalTags").value = "";
    showModal();
};

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
