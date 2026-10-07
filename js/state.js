export const state = {
    files: [],
    settings : {
        type: 'image/webp',
        quality: 0.8,
        maxWidth: 1200,
        targetBytes: null,
    },
};

export function addFiles(newFiles) {
    state.files.push(...newFiles);
}

export function clearFiles() {
    state.files = [];
}