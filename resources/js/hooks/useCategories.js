import { useEffect, useState } from 'react';
import { api } from '../api';

const FALLBACK = [
    { slug: 'physical-goods', name: 'Physical Goods' },
    { slug: 'electronics', name: 'Electronics' },
    { slug: 'digital-products', name: 'Digital Products' },
    { slug: 'services-freelance', name: 'Services / Freelance' },
    { slug: 'accounts', name: 'Accounts (Gaming, Facebook, TikTok, etc.)' },
    { slug: 'other', name: 'Other' },
];

export default function useCategories(locale = 'en') {
    const [categories, setCategories] = useState(FALLBACK);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        api(`/api/categories?locale=${encodeURIComponent(locale)}`)
            .then((payload) => {
                if (cancelled) return;
                const rows = Array.isArray(payload.data) ? payload.data : payload;
                if (rows?.length) setCategories(rows);
            })
            .catch(() => {
                if (!cancelled) setCategories(FALLBACK);
            })
            .finally(() => {
                if (!cancelled) setReady(true);
            });

        return () => {
            cancelled = true;
        };
    }, [locale]);

    return { categories, ready };
}

export function categoryLabel(categories, slug) {
    return categories.find((item) => item.slug === slug)?.name || slug || '';
}
