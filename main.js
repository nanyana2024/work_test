import { loadVideos, saveVideo, deleteVideo, setEditIndex } from "./supabase.js";
import { initUI, openEditModal } from "./ui.js";
import { renderGallery } from "./gallery.js";

// アプリ全体の動画リスト
let videos = [];

// ------------------------------------
// 初期化
// ------------------------------------
async function init() {
    initUI();

    // Supabase からロード
    videos = await loadVideos();

    // タグパネルとギャラリー描画
    renderGallery(videos);

    console.log("Initialized");
}

init();

// ------------------------------------
// UI からのイベント受信
// ------------------------------------

// ギャラリー再描画要求
document.addEventListener("requestRenderGallery", () => {
    renderGallery(videos);
});

// 追加モード要求
document.addEventListener("requestAddMode", () => {
    setEditIndex(null);
});

// 編集モード要求
document.addEventListener("requestEditMode", (e) => {
    setEditIndex(e.detail.id);
});

// 保存要求
document.addEventListener("requestSave", async () => {
    const url  = document.getElementById("modalUrl").value;
    const title = document.getElementById("modalTitleInput").value;
    const desc = document.getElementById("modalDesc").value;
    const tags = document.getElementById("modalTags").value
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    await saveVideo({ url, title, description: desc, tags });

    videos = await loadVideos();
    renderGallery(videos);
});

// 削除要求（gallery.js から呼ぶ）
export async function handleDelete(id) {
    await deleteVideo(id);
    videos = await loadVideos();
    renderGallery(videos);
}

// 編集要求（gallery.js から呼ぶ）
export function handleEdit(index) {
    openEditModal(videos[index]);
}
