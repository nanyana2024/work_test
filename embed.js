// embed.js
// -----------------------------
// URL → 埋め込みURL変換（YouTube）
// -----------------------------
export function convertToEmbedUrl(url) {
    // https://www.youtube.com/watch?v=XXXX
    if (url.includes("youtube.com/watch")) {
        return url.replace("watch?v=", "embed/");
    }

    // https://youtu.be/XXXX
    if (url.includes("youtu.be/")) {
        return url.replace("youtu.be/", "youtube.com/embed/");
    }

    return url;
}

// -----------------------------
// サービス判別
// -----------------------------
export function detectService(url) {
    if (!url) return "other";

    const u = url.toLowerCase();

    if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
    if (u.includes("tiktok.com")) return "tiktok";
    if (u.includes("twitter.com") || u.includes("x.com")) return "x";

    return "other";
}

// -----------------------------
// 埋め込みHTML生成
// -----------------------------
export function buildEmbedHTML(url) {
    const service = detectService(url);

    // ---- YouTube ----
    if (service === "youtube") {
        return `
            <iframe
                src="${convertToEmbedUrl(url)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        `;
    }

    // ---- TikTok ----
    if (service === "tiktok") {
        return `
            <blockquote class="tiktok-embed" cite="${url}">
                <section>Loading...</section>
            </blockquote>
        `;
    }

    // ---- X（Twitter） ----
    if (service === "x") {
        return `
            <blockquote class="twitter-tweet">
                <a href="${url}"></a>
            </blockquote>
        `;
    }

    // ---- それ以外 ----
    return `<p>このURLは埋め込みに対応していません</p>`;
}
