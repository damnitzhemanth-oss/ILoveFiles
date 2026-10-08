export function formatBytes(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return ( bytes/ (1024*1024)).toFixed(2) + 'MB'
}

export function makeThumbUrl(file) {
    return URL.createObjectURL(file);
}

export function isImage(file) {
    return file.type.startsWith('image/');
}