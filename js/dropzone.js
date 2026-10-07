import {addFiles} from './state.js';
import {isImage} from './loader.js';

export function setupDropzone() {
    const zone  = document.getElementById('dropzone');
    const input = document.getElementById('file-input');
    if (!zone || !input) return;

    // Click to browse
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
        acceptFiles(input.files);
        input.value = ''; // reset so the same file can be picked again
    });

    // Drag highlight
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        acceptFiles(e.dataTransfer.files);
    });

    // Stop the browser from opening files dropped anywhere else
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop',     (e) => e.preventDefault());
}

function acceptFiles(fileList) {
    const images = Array.from(fileList).filter(isImage);
    if (images.length === 0) return;
    addFiles(images);
}