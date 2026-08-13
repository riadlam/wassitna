export function dismissIosKeyboard() {
    if (typeof document === 'undefined') return;

    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
        active.blur();
    }

    // iOS Safari sometimes keeps the keyboard open after blur; bounce focus through a temp field.
    try {
        const temp = document.createElement('input');
        temp.setAttribute('readonly', 'readonly');
        temp.setAttribute('aria-hidden', 'true');
        temp.tabIndex = -1;
        temp.style.cssText =
            'position:fixed;top:0;left:0;opacity:0;height:0;width:0;font-size:16px;border:0;padding:0;margin:0;';
        document.body.appendChild(temp);
        temp.focus({ preventScroll: true });
        temp.blur();
        document.body.removeChild(temp);
    } catch {
        // ignore
    }

    if (typeof window !== 'undefined') {
        window.scrollTo(window.scrollX, window.scrollY);
    }
}

export function isTextEntryElement(element) {
    if (!element || element === document.body) return false;
    const tag = String(element.tagName || '').toUpperCase();
    if (tag === 'TEXTAREA') return true;
    if (tag !== 'INPUT') return false;
    const type = String(element.type || 'text').toLowerCase();
    return !['button', 'checkbox', 'radio', 'file', 'submit', 'reset', 'hidden', 'image'].includes(type);
}
