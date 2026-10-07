export const state = {
    files: [],
    settings : {
        type: 'image/webp',
        quality: 0.8,
        maxWidth: 1200,
        targetBytes: null,
    },
};

let nextId = 1;
const listeners = new Set();

export function subscribe(fn) { listeners.add(fn); }
export function notify() { listeners.forEach((fn) => fn()); }

export function addFiles(newFiles) {
    for (const file of newFiles) {
        state.files.push({
            id: nextId++,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            thumbnailUrl: URL.createObjectURL(file),
        });
    }
    notify();
}

export function removeFile(id) {
    const entry = state.files.find((f) => f.id === id);
    if (entry?.thumbnailUrl) URL.revokeObjectURL(entry.thumbnailUrl);
    state.files = state.files.filter((f) => f.id !== id);
    notify();
}

export function clearFiles() {
    for (const entry of state.files) {
        if (entry.thumbnailUrl) URL.revokeObjectURL(entry.thumbnailUrl);
    }
    state.files = [];
    notify();
}