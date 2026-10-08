import { state, updateSettings, subscribe } from './state.js';

export function setupSettings() {
    const formatSel  = document.getElementById('setting-format');
    const qualityIn  = document.getElementById('setting-quality');
    const qualityVal = document.getElementById('quality-value');
    const widthIn    = document.getElementById('setting-width');
    const targetIn   = document.getElementById('setting-target-kb');
    const qualityRow = document.getElementById('quality-row');

    if (!formatSel) return;

    
    formatSel.addEventListener('change', () => {
        updateSettings({ type: formatSel.value });
    });

    qualityIn.addEventListener('input', () => {
        updateSettings({ quality: Number(qualityIn.value) / 100 });
    });

    widthIn.addEventListener('input', () => {
        const w = Math.max(0, Number(widthIn.value) || 0);
        updateSettings({ maxWidth: w });
    });

    targetIn.addEventListener('input', () => {
        const kb = Number(targetIn.value);
        updateSettings({ targetBytes: kb > 0 ? Math.round(kb * 1024) : null });
    });

    function syncUI() {
        formatSel.value = state.settings.type;
        qualityIn.value = Math.round(state.settings.quality * 100);
        qualityVal.textContent = qualityIn.value;
        widthIn.value = state.settings.maxWidth;
        targetIn.value = state.settings.targetBytes
            ? Math.round(state.settings.targetBytes / 1024)
            : '';

        const isPng = state.settings.type === 'image/png';
        const hasTarget = state.settings.targetBytes != null;

        qualityRow.hidden = isPng;
        qualityRow.classList.toggle('row-disabled', hasTarget);
    }

    subscribe(syncUI);
    syncUI();
}