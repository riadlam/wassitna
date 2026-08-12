export function IconPlus() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M11 5h2v14h-2z" />
            <path fill="currentColor" d="M5 11h14v2H5z" />
        </svg>
    );
}

export function IconList({ filled = false }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                d="M8 7h12M8 12h12M8 17h12"
            />
            <circle cx="4.5" cy="7" r="1.2" fill="currentColor" />
            <circle cx="4.5" cy="12" r="1.2" fill="currentColor" />
            <circle cx="4.5" cy="17" r="1.2" fill="currentColor" />
        </svg>
    );
}

export function IconWallet({ filled = false }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
                x="3.5"
                y="6"
                width="17"
                height="13"
                rx="2"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M3.5 9.5h17" />
            <circle cx="16.5" cy="14.2" r="1.2" fill={filled ? '#fff' : 'currentColor'} />
        </svg>
    );
}

export function IconCalc() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="3.5" width="14" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="8" y="6" width="8" height="3" rx="0.6" fill="currentColor" />
            <path fill="currentColor" d="M8 12h2v2H8zm3.5 0h2v2h-2zM15 12h2v2h-2zM8 15.5h2v2H8zm3.5 0h2v2h-2zM15 15.5h2v2h-2z" />
        </svg>
    );
}

export function IconInfo() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path fill="currentColor" d="M11.2 10h1.6v7h-1.6zM11.2 7h1.6v1.6h-1.6z" />
        </svg>
    );
}

export function IconLink() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                d="M10 13.5 8.8 14.7a3.2 3.2 0 0 1-4.5-4.5l2.4-2.4a3.2 3.2 0 0 1 4.5 0"
            />
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                d="M14 10.5 15.2 9.3a3.2 3.2 0 0 1 4.5 4.5l-2.4 2.4a3.2 3.2 0 0 1-4.5 0"
            />
        </svg>
    );
}

export function IconPhone() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                d="M7 4.5h3.2l1 3.2-2 1.2a11 11 0 0 0 5.9 5.9l1.2-2 3.2 1V17a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 5 6.7 2 2 0 0 1 7 4.5z"
            />
        </svg>
    );
}

export function IconSearch() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path stroke="currentColor" strokeWidth="1.8" d="m15.6 15.6 4 4" />
        </svg>
    );
}

export function IconChevron() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="m7 10 5 5 5-5z" />
        </svg>
    );
}

export function IconFilter() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M4 6h16v2H4zm3 5h10v2H7zm3 5h4v2h-4z" />
        </svg>
    );
}

export function IconUnfold() {
    return (
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path fill="currentColor" d="M8 3 4.5 7h7L8 3zm0 10 3.5-4h-7L8 13z" />
        </svg>
    );
}

export function EmptyTransactionsArt() {
    return (
        <svg className="txEmpty-art" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="64" cy="64" r="64" fill="#E8EEF2" />
            <rect x="34" y="30" width="60" height="72" rx="6" fill="#fff" stroke="#9AA8B3" strokeWidth="2" />
            <rect x="44" y="44" width="28" height="6" rx="3" fill="#C5CED6" />
            <rect x="44" y="56" width="40" height="6" rx="3" fill="#C5CED6" />
            <rect x="44" y="68" width="36" height="6" rx="3" fill="#C5CED6" />
            <circle cx="86" cy="90" r="16" fill="#3cb95d" />
            <path fill="#fff" d="M85 83h2v14h-2z" />
            <path fill="#fff" d="M79 89h14v2H79z" />
        </svg>
    );
}
