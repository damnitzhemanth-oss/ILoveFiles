import { state, updateFile} from './state.js';
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
    for (const entry of [...state.files]) {
        if (entry.status !== 'done') {
            await convertOne(entry.id);
        }
    }
}

export function setupActions() {
    const btn = document.getElementById('convert-all-btn');
    if (!btn) return;
    btn.addEventListener('click', () => convertAll()) }



