const TOKEN_KEY = 'wassitna_api_token';

export function getToken() {
    try {
        return sessionStorage.getItem(TOKEN_KEY) || '';
    } catch {
        return '';
    }
}

export function setToken(token) {
    try {
        if (token) {
            sessionStorage.setItem(TOKEN_KEY, token);
        } else {
            sessionStorage.removeItem(TOKEN_KEY);
        }
    } catch {
        // sessionStorage may be unavailable
    }
}

export function clearToken() {
    setToken('');
}

export async function api(path, options = {}) {
    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
    };

    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(path, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(payload.message || 'Request failed');
        error.status = response.status;
        error.errors = payload.errors || {};
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function flattenErrors(errors) {
    return Object.entries(errors || {}).flatMap(([field, messages]) => {
        const list = Array.isArray(messages) ? messages : [messages];
        return list.filter(Boolean).map((message) => ({
            field,
            message: String(message),
        }));
    });
}

export function firstError(errors, fallback = 'Please check the form and try again.') {
    const list = flattenErrors(errors);
    return list[0]?.message || fallback;
}

export function fieldError(errors, field) {
    const value = errors?.[field];
    if (!value) return '';
    return Array.isArray(value) ? value[0] : String(value);
}
