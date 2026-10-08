import { convertCore } from './conversion-core.js';

let pool = null;

function getPool() {
    if (pool !== null) return pool;

    const supported =
        typeof Worker !== 'undefined' &&
        typeof OffscreenCanvas !== 'undefined' &&
        typeof createImageBitmap !== 'undefined';

    pool = supported ? createPool(2) : false;
    return pool;
}

function createPool(size) {
    const workers = [];
    const queue = [];

    for (let i = 0; i < size; i++) {
        const w = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
        w._busy = false;
        w._pending = new Map();
        w._nextId = 1;

        w.addEventListener('message', (e) => {
            const { id, ok, result, error } = e.data;
            const job = w._pending.get(id);
            if (!job) return;
            w._pending.delete(id);
            w._busy = false;
            if (ok) job.resolve(result);
            else job.reject(new Error(error));
            drain();
        });

        w.addEventListener('error', (e) => {
            for (const job of w._pending.values()) {
                job.reject(e.error || new Error('Worker crashed'));
            }
            w._pending.clear();
            w._busy = false;
            drain();
        });

        workers.push(w);
    }

    function drain() {
        while (queue.length > 0) {
            const free = workers.find((w) => !w._busy);
            if (!free) return;
            const job = queue.shift();
            free._busy = true;
            const id = free._nextId++;
            free._pending.set(id, job);
            free.postMessage({
                id,
                file: job.file,
                settings: job.settings,
                name: job.name,
            });
        }
    }

    return {
        run(file, settings, name) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject, file, settings, name });
                drain();
            });
        },
    };
}

export async function convertFile(entry, settings) {
    const p = getPool();

    if (p) {
        try {
            return await p.run(entry.file, settings, entry.name);
        } catch (err) {
            console.warn('Worker conversion failed, falling back:', err);
        }
    }

    // Main-thread fallback
    return convertCore(entry.file, settings, entry.name);
}