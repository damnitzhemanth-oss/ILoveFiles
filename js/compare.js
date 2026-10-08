import {state} from './state.js'

let modalEl = null;
let activeId = null;

export function setupCompare () {
    modalEl = document.getElementById('compare-modal');
    if (!modalEl) return;

    modalEl.addEventListener('click',(e) => {
        if (e.target.matches('[data-close]')) close();
    });

    document.addEventListener('keydown',(e) => {
        if (e.key === 'Escape' &&!modalEl.hidden) close();
    });

    const slider = modalEl.querySelector('#compare-slider');
    slider.addEventListener('input', () => {
        modalEl.style.setProperty('--pos', slider.value + '%');
    });
}

export function openCompare(id) {
    const entry = state.files.find((f) => f.id === id);
    if (!entry || !entry.outputUrl) return;

    activeId = id;
    modalEl.querySelector('#compare-original').src = entry.thumbnailUrl;
    modalEl.querySelector('#compare-output').src = entry.outputUrl;
    modalEl.querySelector('#compare-name').textContent = entry.name;

    const slider = modalEl.querySelector('#compare-slider');
    slider.value = 50;
    modalEl.style.setProperty('--pos', '50%');

    modalEl.hidden = false;
}

function close() {
    modalEl.hidden = true;
    activeId = null;
}
