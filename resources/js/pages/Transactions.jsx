import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, clearToken, firstError } from '../api';
import { EmptyTransactionsArt, IconSearch } from '../components/AppIcons';
import {
    StatusBadge,
    StatusFilter,
    SortHeader,
    TableSkeleton,
    formatDate,
    formatStatus,
    sortRows,
} from '../components/ListChrome';
import { formatMoney } from '../fees';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'created', label: 'Created', sortable: true },
    { key: 'title', label: 'Transaction', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' },
];

const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'pending_acceptance', label: 'Pending acceptance' },
    { value: 'awaiting_payment', label: 'Awaiting payment' },
    { value: 'awaiting_delivery', label: 'Awaiting delivery' },
    { value: 'awaiting_inspection', label: 'Inspection' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'disputed', label: 'Disputed' },
];

function actionForStatus(status) {
    if (status === 'pending_acceptance') return 'Waiting for party';
    if (status === 'awaiting_payment') return 'Payment needed';
    if (status === 'awaiting_delivery') return 'Delivery needed';
    if (status === 'awaiting_inspection') return 'Inspection';
    if (status === 'disputed') return 'Review dispute';
    return '';
}

export default function Transactions() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sort, setSort] = useState({ key: 'created', dir: 'desc' });

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
        return () => window.clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError('');
            try {
                const params = new URLSearchParams();
                if (debouncedQuery) params.set('q', debouncedQuery);
                if (status && status !== 'all') params.set('status', status);
                params.set('per_page', '50');

                const payload = await api(`/api/transactions?${params.toString()}`);
                if (cancelled) return;

                const data = Array.isArray(payload.data) ? payload.data : [];
                setRows(
                    data.map((tx) => ({
                        id: tx.ulid || tx.id,
                        created: formatDate(tx.created_at),
                        title: tx.title,
                        amount: formatMoney(tx.subtotal, tx.currency || 'DZD'),
                        role: formatStatus(tx.creator_role),
                        status: formatStatus(tx.status),
                        statusKey: tx.status,
                        action: actionForStatus(tx.status),
                        sort: {
                            created: new Date(tx.created_at).getTime() || 0,
                            title: tx.title || '',
                            amount: Number(tx.subtotal) || 0,
                        },
                    })),
                );
                setTotal(payload.meta?.total ?? data.length);
            } catch (err) {
                if (cancelled) return;
                if (err.status === 401) {
                    clearToken();
                    navigate('/login', { replace: true, state: { from: '/transactions' } });
                    return;
                }
                setError(firstError(err.errors, err.message || 'Could not load transactions.'));
                setRows([]);
                setTotal(0);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, status, navigate]);

    const visibleRows = useMemo(() => sortRows(rows, sort), [rows, sort]);

    function onSort(key) {
        setSort((current) =>
            current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
        );
    }

    return (
        <div className="app-transactions-page">
            <div className="txPageHead">
                <div>
                    <h1 className="appContent-title">Transactions</h1>
                    <p className="txCount">
                        {loading ? 'Loading deals…' : `${total} result${total === 1 ? '' : 's'}`}
                    </p>
                </div>
            </div>

            <div className="txHeader">
                <div className="txFilterBar">
                    <label className="txSearch">
                        <IconSearch />
                        <input
                            type="search"
                            placeholder="Search by title"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                    <StatusFilter value={status} options={statusOptions} onChange={setStatus} />
                </div>
            </div>

            {error ? (
                <div className="field-error" role="alert" style={{ marginBottom: 16 }}>
                    <span className="field-errorMsg">{error}</span>
                </div>
            ) : null}

            {loading ? (
                <TableSkeleton columns={columns} />
            ) : visibleRows.length > 0 ? (
                <div className="txTableWrap">
                    <table className="txTable">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <SortHeader key={col.key} column={col} sort={sort} onSort={onSort} />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="is-clickable"
                                    onClick={() => navigate(`/transaction/${row.id}`)}
                                >
                                    <td>
                                        <span className="txMono" title={row.id}>
                                            {String(row.id).slice(-8)}
                                        </span>
                                    </td>
                                    <td className="txMuted">{row.created}</td>
                                    <td>
                                        <Link className="txTitleLink" to={`/transaction/${row.id}`} onClick={(e) => e.stopPropagation()}>
                                            {row.title}
                                        </Link>
                                    </td>
                                    <td className="is-right">
                                        <span className="txAmount">{row.amount}</span>
                                    </td>
                                    <td>
                                        <span className="txRole">{row.role}</span>
                                    </td>
                                    <td>
                                        <StatusBadge status={row.statusKey}>{row.status}</StatusBadge>
                                    </td>
                                    <td className="txMuted">{row.action || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : !error ? (
                <div className="txTableWrap">
                    <div className="txEmpty">
                        <EmptyTransactionsArt />
                        <p>No transactions yet. Start one to hold funds safely.</p>
                        <Link to="/transactions/start" className="txEmpty-cta">
                            Start a new transaction
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
