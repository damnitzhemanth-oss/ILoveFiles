export async function convertFile(entry,settings) {
    const bitmap = await createImageBitmap(entry.file);
    try{
        const {canvas,width,height} = drawResized(
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
