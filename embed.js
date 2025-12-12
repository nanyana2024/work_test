export function convertToEmbedUrl(url) {
    if (url.includes("youtube.com/watch")) {
        return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
        return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
}

export function detectService(url) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("tiktok.com")) return "tiktok";
    if (url.includes("twitter.com") || url.includes("x.com")) return "x";
    return "other";
}

// buildEmbedHTML はそのまま移動
export function buildEmbedHTML(url) {
    const service = detectService(url);

    if (service === "youtube") {
        return `<iframe src="${convertToEmbedUrl(url)}" allowfullscreen></iframe>`;
    }

    if (service === "tiktok") {
        return `<blockquote class="tiktok-embed" cite="${url}"><section>Loading...</section></blockquote>`;
    }

    if (service === "x") {
        return `
            <blockquote class="twitter-tweet">
                <a href="${url}"></a>
            </blockquote>
        `;
    }

    return `<p>このURLは埋め込みに対応していません</p>`;
}
