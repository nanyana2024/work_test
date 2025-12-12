// Supabase を window から取得
export const supabase = window.supabaseClient;

// データ保持
export let videos = [];
export let editIndex = null;

// Supabase データ読み込み
export async function loadVideos(callback) {
    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Load error:", error);
        return;
    }

    videos = data;

    if (callback) callback();
}

// INSERT / UPDATE
export async function saveVideo(newData) {
    if (editIndex === null) {
        return await supabase.from("videos").insert([newData]);
    } else {
        return await supabase
            .from("videos")
            .update(newData)
            .eq("id", videos[editIndex].id);
    }
}

// DELETE
export async function deleteVideoByIndex(index) {
    return await supabase
        .from("videos")
        .delete()
        .eq("id", videos[index].id);
}
