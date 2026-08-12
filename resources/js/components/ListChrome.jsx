import { useEffect, useRef, useState } from 'react';
import { IconChevron, IconUnfold } from './AppIcons';

export function formatStatus(status) {
    return String(status || '')
        .split('_')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function StatusBadge({ status, children }) {
    return <span className={`txBadge txBadge--${status || 'default'}`}>{children}</span>;
}

export function StatusFilter({ value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const root = useRef(null);
    const label = options.find((option) => option.value === value)?.label || 'All';

    useEffect(() => {
        if (!open) return undefined;
        const onClick = (event) => {
            if (!root.current?.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="txStatusFilter" ref={root}>
            <button
                type="button"
                className={`txFilterBtn${open ? ' is-open' : ''}${value !== 'all' ? ' is-active' : ''}`}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                <span>{label}</span>
                <IconChevron />
            </button>
            {open ? (
                <div className="txStatusMenu" role="listbox">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`txStatusMenu-item${option.value === value ? ' is-active' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function SortHeader({ column, sort, onSort }) {
    const active = sort.key === column.key;
    return (
        <th className={`${column.align === 'right' ? 'is-right' : ''}${column.sortable ? ' is-sortable' : ''}`}>
            {column.sortable ? (
                <button
                    type="button"
                    className={`txSort${active ? ` is-${sort.dir}` : ''}`}
                    onClick={() => onSort(column.key)}
                >
                    {column.label}
                    <IconUnfold />
                </button>
            ) : (
                column.label
            )}
        </th>
    );
}

export function TableSkeleton({ columns, rows = 7 }) {
    return (
        <div className="txTableWrap">
            <table className="txTable">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={col.align === 'right' ? 'is-right' : ''}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }, (_, index) => (
                        <tr key={index} className="txSkel-row">
                            {columns.map((col) => (
                                <td key={col.key} className={col.align === 'right' ? 'is-right' : ''}>
                                    <span className={`txSkel-bar${col.key === 'title' ? ' is-wide' : ''}`} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function sortRows(rows, sort) {
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
        const left = a.sort?.[sort.key];
        const right = b.sort?.[sort.key];
        if (typeof left === 'number' && typeof right === 'number') {
            return (left - right) * dir;
        }
        return String(left || '').localeCompare(String(right || ''), undefined, { sensitivity: 'base' }) * dir;
    });
}
