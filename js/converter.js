export async function convertFile(entry, settings) {
    const bitmap = await createImageBitmap(entry.file);
    try {
        if (settings.targetBytes && settings.type !== 'image/png') {
            const result = await compressToTarget(bitmap, settings);
            return {
                blob: result.blob,
                name: renameFile(entry.name, settings.type),
                width: result.width,
                height: result.height,
            };
        }

        const { canvas, width, height } = drawResized(
            bitmap,
            settings.maxWidth,
            settings.type === 'image/jpeg'
        );

        const blob = await canvasToBlob(canvas, settings.type, settings.quality);
        return {
            blob,
            name: renameFile(entry.name, settings.type),
            width,
            height,
        };
    } finally {
        bitmap.close?.();
    }
}

async function compressToTarget(bitmap, settings) {
    const target = settings.targetBytes;
    const maxW = settings.maxWidth || bitmap.width;

    let width = Math.min(bitmap.width, maxW);
    let best = null;

    for (let round = 0; round < 4; round++) {
        const { canvas, width: w, height: h } = drawResized(
            bitmap,
            width,
            settings.type === 'image/jpeg'
        );

        // binary search over quality for this size
        let lo = 0.1, hi = 0.95, found = null;
        for (let i = 0; i < 8; i++) {
            const q = (lo + hi) / 2;
            const blob = await canvasToBlob(canvas, settings.type, q);
            if (blob.size <= target) {
                found = blob;
                lo = q;
            } else {
                hi = q;
            }
        }

        if (found) return { blob: found, width: w, height: h };

        // couldn't fit even at 0.1 — remember the smallest and downsize
        const smallest = await canvasToBlob(canvas, settings.type, 0.1);
        if (!best || smallest.size < best.blob.size) {
            best = { blob: smallest, width: w, height: h };
        }

        const nextW = Math.round(width * 0.75);
        if (nextW < 50) break;
        width = nextW;
    }

    return best;
}

function drawResized(bitmap, maxWidth, fillWhite) {
    let w = bitmap.width;
    let h = bitmap.height;

    if (maxWidth && w > maxWidth) {
        h = Math.round(h * (maxWidth / w));
        w = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (fillWhite) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
    }

    ctx.drawImage(bitmap, 0, 0, w, h);
    return { canvas, width: w, height: h };
}

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Encoding failed')),
            type,
            quality
        );
    });
}

function renameFile(name, mimeType) {
    const ext = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
    }[mimeType] || 'img';

    const base = name.replace(/\.[^.]+$/, '');
    return `${base}.${ext}`;
}