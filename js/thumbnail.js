export async function generateThumbnail(file,maxSize=128) {
    const bitmap = await createImageBitmap(file);

    let w = bitmap.width;
    let h = bitmap.height;
    if (w>h && w>maxSize) {
        h = Math.round(h*(maxSize/w));
        w = maxSize;
    } else if (h > maxSize) {
        w = Math.round(w*(maxSize/h));
        h = maxSize;
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap,0,0,w,h);
    bitmap.close?.();

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            0.85
        );
    });
}