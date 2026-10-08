let cached = null;

export async function detectFormats() {
    if (cached) return cached;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    cached = {
        webp: await canEncode(canvas, 'image/webp'),
        avif: await canEncode(canvas, 'image/avif'),
        jpeg: true,
        png: true,
    };
    return cached;
}

function canEncode(canvas, type) {
    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => resolve(!!blob && blob.type === type),
            type,
            0.8
        );
    });
}