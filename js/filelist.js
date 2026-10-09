import { state, subscribe, removeFile } from './state.js';
import { formatBytes } from './loader.js';
import { convertOne } from './action.js';
import { downloadBlob, copyImageToClipboard } from './downloader.js';
import { openCompare } from './compare.js';

const listEl  = () => document.getElementById('file-list');
const emptyEl = () => document.getElementById('empty-hint');
const appEl   = () => document.getElementById('view-app');

const itemEls = new Map();

export function renderFileList() {
    const list = listEl();
    const empty = emptyEl();
    const app = appEl();
    if (!list || !empty || !app) return;

    const hasFiles = state.files.length > 0;
    app.classList.toggle('has-files', hasFiles);
    empty.hidden = hasFiles;

    if (!hasFiles) {
        list.innerHTML = '';
        itemEls.clear();
        return;
    }

    const seen = new Set();
    const currentIds = state.files.map((f) => f.id);

   
    let lastNode = null;
    for (const entry of state.files) {
        seen.add(entry.id);
        let li = itemEls.get(entry.id);

        if (!li) {
            li = buildItem(entry);
            itemEls.set(entry.id, li);
        } else {
            updateItem(li, entry);
        }

        
        const expectedNext = lastNode ? lastNode.nextSibling : list.firstChild;
        if (expectedNext !== li) {
            list.insertBefore(li, expectedNext || null);
        }
        lastNode = li;
    }

   
    for (const [id, li] of itemEls) {
        if (!seen.has(id)) {
            li.remove();
            itemEls.delete(id);
        }
    }
}

function updateItem(li, entry) {
    li.dataset.status = entry.status || 'idle';
    const thumb = li.querySelector('.file-thumb');
    if (thumb && !thumb.src && entry.thumbnailUrl) {
        thumb.src = entry.thumbnailUrl;
    }
    const meta = li.querySelector('.file-meta');
    if (meta) meta.textContent = buildMetaText(entry);

    const actions = li.querySelector('.file-actions');
    if (actions) {
        actions.innerHTML = '';
        actions.append(...buildActions(entry));
    }

   
    li.onkeydown = makeKeyHandler(li, entry);
}

function makeKeyHandler(li, entry) {
    return (e) => {
        if (e.target !== li) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = li.nextElementSibling;
            if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = li.previousElementSibling;
            if (prev) prev.focus();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            removeFile(entry.id);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const convertBtn = li.querySelector('.file-btn-primary');
            if (convertBtn) convertBtn.click();
        }
    };
}
function buildItem(entry) {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.dataset.id = entry.id;
    li.dataset.status = entry.status || 'idle';

    li.tabIndex = 0;
    li.setAttribute('role', 'listitem');
    li.tabIndex = 0;
    li.setAttribute('role', 'listitem');
    li.onkeydown = makeKeyHandler(li, entry);

    const thumb = document.createElement('img');
    thumb.className = 'file-thumb';
    thumb.alt = '';
    thumb.loading = 'lazy';
    if (entry.thumbnailUrl) thumb.src = entry.thumbnailUrl;

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
        return `${orig} → ${out} (${label})${dims} · metadata stripped`;
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

        const cmp = document.createElement('button');
        cmp.type = 'button';
        cmp.className = 'file-btn';
        cmp.textContent = 'Compare';
        cmp.addEventListener('click', () => openCompare(entry.id));
        buttons.push(cmp);

        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'file-btn';
        copy.textContent = 'Copy';
        copy.addEventListener('click', async () => {
        const original = copy.textContent;
        copy.disabled = true;
        copy.textContent = 'Copying…';
        try {
            await copyImageToClipboard(entry.outputBlob);
            copy.textContent = 'Copied!';
            setTimeout(() => { copy.textContent = original; copy.disabled = false; }, 1200);
        } catch (err) {
            console.error(err);
            copy.textContent = 'Failed';
            setTimeout(() => { copy.textContent = original; copy.disabled = false; }, 1200);
        }
        });
        buttons.push(copy);
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