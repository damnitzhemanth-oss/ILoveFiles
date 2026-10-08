import { state, updateSettings } from './state.js';

export function setupSettings() {
    const formatSel  = document.getElementById('setting-format');
    const qualityIn  = document.getElementById('setting-quality');
    const qualityVal = document.getElementById('quality-value');
    const widthIn    = document.getElementById('setting-width');
    const qualityRow = document.getElementById('quality-row');

    if (!formatSel) return;

    formatSel.value = state.settings.type;
    qualityIn.value = Math.round(state.settings.quality * 100);
    qualityVal.textContent = qualityIn.value;
    widthIn.value = state.settings.maxWidth;
    toggleQualityRow();

    formatSel.addEventListener('change', () => {
        updateSettings({ type: formatSel.value });
        toggleQualityRow();
    });

    qualityIn.addEventListener('input', () => {
        qualityVal.textContent = qualityIn.value;
        updateSettings({ quality: Number(qualityIn.value) / 100 });
    });

    widthIn.addEventListener('input', () => {
        const w = Math.max(0, Number(widthIn.value) || 0);
        updateSettings({ maxWidth: w });
    });

    function toggleQualityRow() {
        qualityRow.hidden = state.settings.type === 'image/png';
    }
}