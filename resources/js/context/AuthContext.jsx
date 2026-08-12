import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, setToken } from '../api';

const AuthContext = createContext({
    user: null,
    ready: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    setUser: () => {},
    refreshUser: async () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!getToken()) {
            setReady(true);
            return;
        }

        api('/api/auth/user')
            .then((data) => setUser(data.user || null))
            .catch(() => {
                clearToken();
                setUser(null);
            })
            .finally(() => setReady(true));
    }, []);

    const value = useMemo(
        () => ({
            user,
            ready,
            login: async (payload) => {
                const data = await api('/api/auth/login', {
                    method: 'POST',
                    body: { ...payload, device: 'spa' },
                });
                setToken(data.token);
                setUser(data.user);
                return data.user;
            },
            register: async (payload) => {
                const data = await api('/api/auth/register', {
                    method: 'POST',
                    body: { ...payload, device: 'spa' },
                });
                setToken(data.token);
                setUser(data.user);
                return data.user;
            },
            logout: async () => {
                try {
                    await api('/api/auth/logout', { method: 'POST' });
                } finally {
                    clearToken();
                    setUser(null);
                }
            },
            setUser,
            refreshUser: async () => {
                const data = await api('/api/auth/user');
                setUser(data.user || null);
                return data.user;
            },
        }),
        [user, ready],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
