import { updateSettings } from './state.js'

export const PRESETS = {
    github: {
        label: 'GitHub README',
        settings: {type: 'image/webp', quality: 0.75, maxWidth: 1200, targetBytes: 500*1024},
     },

    avatar: {
        label: 'Avatar',
        settings: {type: 'image/webp', quality:0.8, maxWidth:512, targetBytes: 100*1024}
    },

    thumb: {
        label: 'Thumbnail',
        settings: {type:'image/webp',quality:0.7,maxWidth:400,targetBytes:50*1024},
    },

    reset: {
        label: 'Reset',
        settings: {type: 'image/webp', quality:0.8, maxWidth: 1200, targetBytes: null},
    },
};

export function setupPresets() {
    const container = document.getElementById('presets');
    if (!container) return;

    for (const [key,preset] of Object.entries(PRESETS)) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'preset-btn';
        btn.dataset.preset = key;
        btn.textContent = preset.label;
        btn.addEventListener('click', () => {
            updateSettings(preset.settings);
            Highlight(key);
        });
        container.appendChild(btn);
    }
}

function highlight(activeKey) {
    document.querySelectorAll('preset-btn').forEach((b) => {b.classList.toggle('active',b.dataset.preset === activeKey);

    });
}