console.log("main.js loaded");

// main.js
import { loadVideos, saveVideo, deleteVideoById, videos, editIndex } from "./supabase.js";
import { initUI, openEditModal } from "./ui.js";
import { renderGallery } from "./gallery.js";

// ==============================
// 初期化
// ==============================
async function init() {
    initUI();

    await loadVideos(() => {
        renderGallery(videos);
        document.dispatchEvent(new CustomEvent("buildTagPanelRequest"));
    });

    console.log("Initialized");
}

init();


// ==============================
// リスナー
// ==============================

// ギャラリー再描画要求（検索・ソート・タグクリック）
document.addEventListener("requestRenderGallery", () => {
    renderGallery(videos);
});


// タグパネル再構築要求（loadVideos の後）
document.addEventListener("buildTagPanelRequest", () => {
    document.dispatchEvent(new CustomEvent("buildTagsExternally"));
});


// 追加モード要求
document.addEventListener("requestAddMode", () => {
    // editIndex は supabase.js で管理
    window.editIndex = null;
});


// 編集モード要求（ui.js → modal input 設定済）
document.addEventListener("requestEditMode", (e) => {
    // supabase.js 管理の editIndex に設定したいが、
    // id 直接指定のほうが安全
    window.editIndex = e.detail.id;
});


// =======================================
// 保存要求（ui.js → requestSave）
// =======================================
document.addEventListener("requestSave", async () => {

    const url = document.getElementById("modalUrl").value;
    const title = document.getElementById("modalTitleInput").value;
    const desc = document.getElementById("modalDesc").value;
    const tags = document.getElementById("modalTags").value
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    // Supabase SAVE
    await saveVideo({
        url,
        title,
        description: desc,
        tags
    });

    // 再読み込み
    await loadVideos(() => {
        renderGallery(videos);
        document.dispatchEvent(new CustomEvent("buildTagPanelRequest"));
    });
});


// =======================================
// gallery.js → 編集ボタン
// =======================================
document.addEventListener("requestEditById", (e) => {
    const id = e.detail;

    const v = videos.find(v => v.id == id);
    if (!v) return;

    openEditModal(v);
});


// =======================================
// gallery.js → 削除ボタン
// =======================================
document.addEventListener("requestDeleteById", async (e) => {
    const id = e.detail;

    const ok = confirm("この動画を削除しますか？");
    if (!ok) return;

    await deleteVideoById(id);

    await loadVideos(() => {
        renderGallery(videos);
        document.dispatchEvent(new CustomEvent("buildTagPanelRequest"));
    });
});

