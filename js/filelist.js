import { state, subscribe, removeFile } from './state.js';
import { formatBytes } from './loader.js';
import { convertOne } from './action.js';
import { downloadBlob } from './downloader.js';

const listEl  = () => document.getElementById('file-list');
const emptyEl = () => document.getElementById('empty-hint');
const appEl   = () => document.getElementById('view-app');

export function renderFileList() {
    const list = listEl();
    const empty = emptyEl();
    const app = appEl();
    if (!list || !empty || !app) return;

    list.innerHTML = '';

    const hasFiles = state.files.length > 0;
    app.classList.toggle('has-files', hasFiles);
    empty.hidden = hasFiles;
    if (!hasFiles) return;

    for (const entry of state.files) {
        list.appendChild(buildItem(entry));
    }
}

function buildItem(entry) {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.dataset.id = entry.id;
    li.dataset.status = entry.status || 'idle';

    const thumb = document.createElement('img');
    thumb.className = 'file-thumb';
    thumb.src = entry.thumbnailUrl;
    thumb.alt = '';

    const info = document.createElement('div');
    info.className = 'file-info';

    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = entry.name;
    name.title = entry.name;

    const meta = document.createElement('span');
    meta.className = 'file-meta';
    meta.textContent = buildMetaText(entry);

    info.append(name, meta);

    const actions = document.createElement('div');
    actions.className = 'file-actions';
    actions.append(...buildActions(entry));

    li.append(thumb, info, actions);
    return li;
}

function buildMetaText(entry) {
    const orig = formatBytes(entry.size);

    if (entry.status === 'converting') return `${orig} → converting…`;
    if (entry.status === 'error') return `${orig} · ${entry.error || 'failed'}`;

    if (entry.status === 'done' && entry.outputBlob) {
        const out = formatBytes(entry.outputSize);
        const pct = Math.round((1 - entry.outputSize / entry.size) * 100);
        const label = pct >= 0 ? `${pct}% smaller` : `${Math.abs(pct)}% larger`;
        const dims = entry.outputWidth && entry.outputHeight
            ? ` · ${entry.outputWidth}×${entry.outputHeight}`
            : '';
        return `${orig} → ${out} (${label})${dims}`;
    }

    return orig;
}

function buildActions(entry) {
    const buttons = [];

    if (entry.status === 'converting') {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'file-btn';
        b.textContent = 'Converting…';
        b.disabled = true;
        buttons.push(b);
    } else if (entry.status === 'done') {
        const dl = document.createElement('button');
        dl.type = 'button';
        dl.className = 'file-btn file-btn-primary';
        dl.textContent = 'Download';
        dl.addEventListener('click', () => {
            downloadBlob(entry.outputBlob, entry.outputName);
        });
        buttons.push(dl);

        const redo = document.createElement('button');
        redo.type = 'button';
        redo.className = 'file-btn';
        redo.textContent = 'Re-convert';
        redo.addEventListener('click', () => convertOne(entry.id));
        buttons.push(redo);
    } else {
        const convert = document.createElement('button');
        convert.type = 'button';
        convert.className = 'file-btn file-btn-primary';
        convert.textContent = entry.status === 'error' ? 'Retry' : 'Convert';
        convert.addEventListener('click', () => convertOne(entry.id));
        buttons.push(convert);
    }

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-btn file-btn-danger';
    remove.setAttribute('aria-label', `Remove ${entry.name}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => removeFile(entry.id));
    buttons.push(remove);

    return buttons;
}

export function setupFileList() {
    subscribe(renderFileList);
    renderFileList();
}