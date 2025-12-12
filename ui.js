// ui.js
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
        <button class="tag-btn" data-tag="${t}">${t}</button>
    `).join("");

    // デリゲーションでクリックイベントを管理
    tagList.onclick = (e) => {
        const tag = e.target.dataset.tag;
        if (!tag) return;
        filterByTag(tag);
    };
}

export function filterByTag(tag) {
    document.getElementById("searchInput").value = tag;

    // renderGallery() は main.js が受けて処理
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

    // main.js 側で editIndex を管理するため通知
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

    // main.js に現在のデータを渡す
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

    // モーダル外クリックで閉じる
    window.addEventListener("click", (e) => {
        if (e.target === modal) hideModal();
    });

    // 保存ボタン
    document.getElementById("modalSave").onclick = () => {
        document.dispatchEvent(new Event("requestSaveVideo"));
    };

    // 削除ボタン
    document.getElementById("modalDelete").onclick = () => {
        document.dispatchEvent(new Event("requestDeleteVideo"));
    };

    // 検索バー
    const searchInput = document.getElementById("searchInput");
    searchInput.oninput = () => {
        document.dispatchEvent(new CustomEvent("requestRenderGallery"));
    };
}
