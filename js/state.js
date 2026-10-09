import { generateThumbnail } from "./thumbnail.js";

export const state = {
    files: [],
    settings: {
        type: 'image/webp',
        quality: 0.8,
        maxWidth: 1200,
        targetBytes: null,
        rotation: 0,
        flipH: false,
        flipV: false,
    },
};

let nextId = 1;
const listeners =new Set();

export function subscribe(fn) {listeners.add(fn);}
export function notify() {listeners.forEach((fn) => fn());}

export async function addFiles(newFiles) {
    for (const file of newFiles) {
        const id = nextId++;
        
        state.files.push({
            id,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            thumbnailUrl: null,

            status: 'idle',
            outputBlob: null,
            outputUrl: null,
            outputName: null,
            outputSize: null,
            outputWidth: null,
            outputHeight: null,
            error: null,
        });

        
        generateThumbnail(file).then((thumbBlob) => {
            if (!thumbBlob) return;
            const entry = state.files.find((f) => f.id === id);
            if (!entry) return;
            entry.thumbnailUrl = URL.createObjectURL(thumbBlob);
            notify();
        }).catch(() => {
            
            const entry = state.files.find((f) => f.id === id);
            if (entry && !entry.thumbnailUrl) {
                entry.thumbnailUrl = URL.createObjectURL(file);
                notify();
            }
        });
    }
    notify();
}

export function updateFile(id,patch) {
    const entry = state.files.find((f) => f.id === id);
    if (!entry) return;

    if (patch.outputUrl && entry.outputUrl && patch.outputUrl !== entry.outputUrl) {
        URL.revokeObjectURL(entry.outputUrl);
    } 

    Object.assign(entry,patch);
    notify();
}

export function removeFile(id) {
    const entry = state.files.find((f) => f.id === id);
    if (!entry) return;

    if (entry.thumbnailUrl) URL.revokeObjectURL(entry.thumbnailUrl);
    if (entry.outputUrl) URL.revokeObjectURL(entry.outputUrl);

    state.files = state.files.filter((f) => f.id !== id);
    notify();
}

export function clearFiles() {
    for (const entry of state.files) {
        if (entry.thumbnailUrl) URL.revokeObjectURL(entry.thumbnailUrl);
        if (entry.outputUrl) URL.revokeObjectURL(entry.outputUrl);
    }
    state.files = [];
    notify();
}

export function updateSettings(patch) {
    Object.assign(state.settings, patch);
    notify();
}