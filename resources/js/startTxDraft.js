const STORAGE_KEY = 'wassitna_start_tx_draft';

export function saveStartTxDraft(draft) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft || {}));
    } catch {
        // sessionStorage may be unavailable
    }
}

export function readStartTxDraft() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

export function clearStartTxDraft() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}
