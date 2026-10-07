const SUN = '☀';
const MOON = '☾';

export function setupTheme() {
    const btn = document.getElementById('theme-toggle')
    if(!btn) return;

    updateIcon(btn);

    btn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme;
        const next = current === 'dark' ? 'light' : 'dark';

        document.documentElement.dataset.theme = next;
        localStorage.setItem('theme', next);
        updateIcon(btn);
    });
}

function updateIcon(btn) {
    const theme = document.documentElement.dataset.theme;
    btn.textContent = theme === 'dark' ? MOON : SUN;
}