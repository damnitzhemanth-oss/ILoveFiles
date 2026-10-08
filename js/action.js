import { state, updateFile, clearFiles } from './state.js';
import { convertFile} from './converter.js';

export async function convertOne(id) {
    const entry = state.files.find((f) => f.id === id);
    if (!entry) return;

    updateFile(id, { status: 'converting', error: null});

    try {
        const { blob,name,width,height} = await convertFile (entry,state.settings);
        const outputUrl = URL.createObjectURL(blob);

        updateFile(id, {
            status: 'done',
            outputBlob: blob,
            outputUrl,
            outputName: name,
            outputSize: blob.size,
            outputWidth: width,
            outputHeight: height,
        });
    } catch (err) {
        updateFile(id, {
            status: 'error',
            error: err?.message || 'Conversion failed',
        });
    }
}

export async function convertAll() {
    const btn = document.getElementById('convert-all-btn');
    const status = document.getElementById('convert-status');

    const pending = state.files.filter((f) => f.status !== 'done');
    if (pending.length === 0) return;

    if (btn) btn.disabled = true;
    let done = 0;

    try {
        for (const entry of [...state.files]) {
            if (entry.status === 'done') continue;
            done++;
            if (status) status.textContent = `Converting ${done} of ${pending.length}…`;
            await convertOne(entry.id);
        }
    } finally {
        if (status) status.textContent = '';
        if (btn) btn.disabled = false;
    }
}

export function setupActions() {
    const convertBtn = document.getElementById('convert-all-btn');
    const clearBtn = document.getElementById('clear-all-btn');

    if (convertBtn) convertBtn.addEventListener('click', () => convertAll());
    if (clearBtn) clearBtn.addEventListener('click', () => clearFiles());

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const app = document.getElementById('view-app');
            if (!app || app.hidden) return;
            e.preventDefault();
            convertAll();
        }
    });
}


