// supabase.js
// ----------------------------------
// Supabase クライアント
// ----------------------------------
export const supabase = window.supabaseClient;

// ----------------------------------
// 動画読み込み
// ----------------------------------
export async function loadVideos() {
    const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Load error:", error);
        return [];
    }

    return data;
}

// ----------------------------------
// 動画新規保存
// ----------------------------------
export async function insertVideo(newData) {
    const { error } = await supabase
        .from("videos")
        .insert([newData]);

    if (error) {
        console.error("Insert error:", error);
        throw error;
    }
}

// ----------------------------------
// 動画更新
// ----------------------------------
export async function updateVideo(id, updateData) {
    const { error } = await supabase
        .from("videos")
        .update(updateData)
        .eq("id", id);

    if (error) {
        console.error("Update error:", error);
        throw error;
    }
}

// ----------------------------------
// 動画削除
// ----------------------------------
// DELETE（ID指定）
export async function deleteVideoById(id) {
    return await supabase
        .from("videos")
        .delete()
        .eq("id", id);
}
