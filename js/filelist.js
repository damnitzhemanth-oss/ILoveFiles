import {state,subscribe,removeFile} from './state.js';
import { formatBytes } from './loader.js';

const listE1 = () => document.getElementById('file-list');
const emptyE1 = () => document.getElementById('empty-hint');

export function renderFileList() {
    const list = listE1();
    const empty = emptyE1();
    if (!list || !empty) return;

    list.innerHTML ='';

    if (state.files.length === 0 ) {
        empty.hidden = false;
        return;
    }

    empty.hidden = true;

    for (const entry of state.files) {
        list.appendChild(buildItem(entry));
    }

}

function buildItem(entry) {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.dataset.id = entry.id;

    const thumb = document.createElement('img');
    thumb.className = 'file-thumb';
    thumb.src = entry.thumbnailUrl;
    thumb.alt = '';

    const info = document.createElement('div');
    info.className = 'file-info';

    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = entry.name;

    const size = document.createElement('span');
    size.className = 'file-size';
    size.textContent = formatBytes(entry.size);

    info.append(name, size);

    const remove = document.createElement('button');
    remove.className = 'file-remove';
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${entry.name}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => removeFile(entry.id));

    li.append(thumb, info, remove);
    return li;
}

export function setupFileList() {
    subscribe(renderFileList);
    renderFileList();
}