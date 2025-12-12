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

    tagList.innerHTML = [...tags]
        .map(t => `<button class="tag-btn" data-tag="${t}">${t}</button>`)
        .join("");

    // クリックイベント（グローバル関数削除）
    document.querySelectorAll(".tag-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("searchInput").value = btn.dataset.tag;
            document.dispatchEvent(new CustomEvent("requestRenderGallery"));
        });
    });
}



// ---------------------------
// モーダル制御
// ---------------------------
const modal = document.getElementById("modal");
const openAddBtn = document.getElementById("openAddModal");
const closeBtn   = document.getElementById("closeModal");
const closeXBtn  = document.getElementById("modalCloseX");
const overlay    = document.querySelector("#modal .modal-overlay");

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

    // main.js に通知
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

    // main.js に video を渡す
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
    closeBtn.onclick = hideModal;
    closeXBtn.onclick = hideModal;

    // 保存
    document.getElementById("saveModal").onclick = () => {
        document.dispatchEvent(new Event("requestSave"));
        hideModal();
    };

    // タグパネル
    document.getElementById("tagPanelBtn").onclick = () => {
        document.getElementById("tagPanel").classList.remove("hidden");
    };
    document.getElementById("closeTagPanel").onclick = () => {
        document.getElementById("tagPanel").classList.add("hidden");
    };
}
