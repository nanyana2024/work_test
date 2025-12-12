// ============================
// UI（モーダル / イベント登録 / タグパネル）管理
// ============================

// ---------------------------
// タグパネル
// ---------------------------
export function buildTagPanel(videos) {
    const tagList = document.getElementById("tagList");
    const tags = new Set();

    videos.forEach(v => v.tags.forEach(t => tags.add(t)));

    tagList.innerHTML = [...tags].map(t => `
        <button onclick="filterByTag('${t}')">${t}</button>
    `).join("");
}

export function filterByTag(tag) {
    document.getElementById("searchInput").value = tag;

    // renderGallery は script.js 側で持つ
    document.dispatchEvent(
        new CustomEvent("requestRenderGallery")
    );
}


// ---------------------------
// モーダル制御
// ---------------------------
const modal = document.getElementById("modal");
const openAddBtn = document.getElementById("openAddModal");
const closeBtn = document.getElementById("closeModal");
const closeXBtn = document.getElementById("modalCloseX");

export function showModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
}

export function hideModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
}


// ---------------------------
// 追加モード
// ---------------------------
export function openAddModal() {
    document.getElementById("modalHeader").textContent = "動画を追加";
    document.getElementById("modalUrl").value = "";
    document.getElementById("modalTitleInput").value = "";
    document.getElementById("modalDesc").value = "";
    document.getElementById("modalTags").value = "";

    // script.js 側で editIndex を管理するため通知
    document.dispatchEvent(new Event("requestAddMode"));

    showModal();
}


// ---------------------------
// 編集モード
// ---------------------------
export function openEditModal(video) {
    document.getElementById("modalHeader").textContent = "動画を編集";
    document.getElementById("modalUrl").value = video.url;
    document.getElementById("modalTitleInput").value = video.title;
    document.getElementById("modalDesc").value = video.description;
    document.getElementById("modalTags").value = video.tags.join(",");

    // script.js に現在の video を渡す
    document.dispatchEvent(
        new CustomEvent("requestEditMode", { detail: video })
    );

    showModal();
}


// ---------------------------
// イベント登録
// ---------------------------
export function initUI() {

    // モーダル開閉
    openAddBtn.onclick = openAddModal;
    close
