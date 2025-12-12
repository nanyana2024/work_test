import { loadVideos } from "./supabase.js";
import { renderGallery } from "./gallery.js";

// 最初の読み込み
loadVideos(renderGallery);
