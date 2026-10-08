export function downloadBlob(blob,filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyImageToClipboard(blob) {
    if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('clipboard images not supported in this browser');
    }

    let pngBlob = blob;
    if (blob.type !== 'image/png') {
        pngBlob = await convertBlobToPng(blob);
    }

    await navigator.clipboard.write([new ClipboardItem({'image/png': pngBlob}),]);
}

async function convertBlobToPng(blob) {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext('2d').drawImage(bitmap,0,0);
    bitmap.close?.();

    return new Promise((resolve,reject) => {
        canvas.toBlob(
            (b) => b ? resolve(b) : reject(new Error('PNG encode failed')),
            'image/png'
        );
    });
}