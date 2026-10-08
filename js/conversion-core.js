export async function convertCore(file, settings, originalName) {
    const bitmap = await createImageBitmap(file);
    try {
        if (settings.targetBytes && settings.type !== 'image/png') {
            const result = await compressToTarget(bitmap, settings);
            return {
                blob: result.blob,
                name: renameFile(originalName, settings.type),
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
            name: renameFile(originalName, settings.type),
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
        const {canvas, width: w, height: h} = drawResized (
          bitmap,
          width,
          settings.type === 'image/jpeg'
        );

        let lo = 0.1, hi = 0.95, found = null;
        for (let i = 0 ; i<8; i++) {
            const q = (lo + hi)/ 2;
            const blob = await canvasToBlob(canvas, settings.type,q);
            if (blob.size <= target) {
                found = blob;
                lo = q;
            } else {
                hi = q;
            }
        }

        if (found) return {blob:found,width:w,height:h};

        const smallest = await canvasToBlob(canvas, settings.type, 0.1);
        if (!best || smallest.size < best.blob.size) {
            best = {blob:smallest,width:w,height:h};
        }

        const nextW = Math.round(width*0.75);
        if (nextW<50) break;
        width = nextW;
    }

    return best;
}

function drawResized(bitmap,maxWidth,fillWhite) {
    let w = bitmap.width;
    let h = bitmap.height;

    if (maxWidth && w > maxWidth) {
        h = Math.round(h*(maxWidth/w));
        w = maxWidth;
    }

    const canvas = createCanvas (w,h);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (fillWhite) {
        ctx.fillStyle ='#ffffff';
        ctx.fillRect(0,0,w,h);
    }

    ctx.drawImage(bitmap,0,0,w,h);
    return {canvas,width:w,height:h};
}

function createCanvas(w,h) {
    if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(w, h);
    }

    if (typeof document !== 'undefined') {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    }
    throw new Error('No canvas implementation available')
}

async function canvasToBlob(canvas, type, quality) {
    if (typeof canvas.convertToBlob === 'function') {
        return canvas.convertToBlob({type,quality});
    }
    return new Promise((resolve,reject) => { 
        canvas.toBlob(
            (blob) => blob ? resolve(blob) : reeject(new Error('Encoding Failed')),type,quality
        );
    });
}

function renameFile(name,mimeType) {
    const ext = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
    }[mimeType] || 'img';

    const base = name.replace(/\.[^.]+$/, '');
    return `${base}.${ext}`;
}