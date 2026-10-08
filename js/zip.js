import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';
import {state} from './state.js';
import {downloadBlob} from './downloader.js';

export async function downloadAllAsZip() {
    const done = state.files.filter((f) => f.status === 'done' && f.outputBlob);
    if (done.length === 0) return;

    const zip = new JSZip();
    const used = new Set();

    for (const entry of done) {
        let name = entry.outputName  || entry.name;
        if (used.has(name)) {
            const dot = name.lastIndexOf('.');
            const base = dot > 0 ? name.slice(0,dot):name;
            const ext = dot > 0 ? name.slice(dot) : '';
            let i = 2;
            while (used.has(`${base}-${i}${ext}`)) i++;
            name = `${base}-${i}${ext}`;
        }
        used.add(name);
        zip.file(name,entry.outputBlob);
    }

    const blob = await zip.generateAsync({type:'blob'});
    const stamp = new Date().toISOString().slice(0,10);
    downloadBlob(blob, `ilovefiles-${stamp}.zip`);
}

export function setupZipButton() {
    const btn = document.getElementById('download-zip-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const label = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Zipping…';
        try {
            await downloadAllAsZip();
        } catch (err) {
            console.error('ZIP failed:', err);
            alert('ZIP creation failed: ' + err.message);
        } finally {
            btn.disabled = false;
            btn.textContent = label;
        }
    });
}