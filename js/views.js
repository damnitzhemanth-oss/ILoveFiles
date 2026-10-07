const homeE1 = () => document.getElementById('view-home');
const appE1 = () => document.getElementById('view-app');

export function showHome() {
    appE1().hidden = true;
    homeE1().hidden = false;
}

export function showApp() {
    appE1().hidden = false;
    homeE1().hidden = true;
}

export function setupViews() {
    document.getElementById('start-btn').addEventListener('click', showApp);
    document.getElementById('back-btn').addEventListener('click', showHome);
}