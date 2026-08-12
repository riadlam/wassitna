import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, clearToken, firstError } from '../api';
import { EmptyTransactionsArt, IconPlus, IconSearch } from '../components/AppIcons';
import CreateWithdrawalModal from '../components/CreateWithdrawalModal';
import {
    StatusBadge,
    StatusFilter,
    SortHeader,
    TableSkeleton,
    formatDate,
    formatStatus,
    sortRows,
} from '../components/ListChrome';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../fees';

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'created', label: 'Created', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status' },
];

const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'rejected', label: 'Rejected' },
];

function formatMethod(method) {
    if (method === 'ccp') return 'CCP';
    if (method === 'baridimob') return 'BaridiMob';
    return formatStatus(method);
}

export default function Withdrawals() {
    const navigate = useNavigate();
    const { user, ready } = useAuth();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [sort, setSort] = useState({ key: 'created', dir: 'desc' });

    useEffect(() => {
        if (!ready) return;
        if (!user?.has_seller_wallet) {
            navigate('/transactions', { replace: true });
        }
    }, [ready, user, navigate]);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
        return () => window.clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (!user?.has_seller_wallet) return undefined;
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError('');
            try {
                const params = new URLSearchParams();
                if (debouncedQuery) params.set('q', debouncedQuery);
                if (status && status !== 'all') params.set('status', status);
                params.set('per_page', '50');

                const payload = await api(`/api/withdrawals?${params.toString()}`);
                if (cancelled) return;

                const data = Array.isArray(payload.data) ? payload.data : [];
                setRows(
                    data.map((row) => ({
                        id: row.ulid || row.id,
                        created: formatDate(row.created_at),
                        amount: formatMoney(row.amount, row.currency || 'DZD'),
                        method: formatMethod(row.method),
                        methodKey: row.method,
                        status: formatStatus(row.status),
                        statusKey: row.status,
                        sort: {
                            created: new Date(row.created_at).getTime() || 0,
                            amount: Number(row.amount) || 0,
                        },
                    })),
                );
                setTotal(payload.meta?.total ?? data.length);
            } catch (err) {
                if (cancelled) return;
                if (err.status === 401) {
                    clearToken();
                    navigate('/login', { replace: true, state: { from: '/withdrawals' } });
                    return;
                }
                if (err.status === 403) {
                    navigate('/transactions', { replace: true });
                    return;
                }
                setError(firstError(err.errors, err.message || 'Could not load withdrawals.'));
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
    }, [debouncedQuery, status, navigate, user?.has_seller_wallet, reloadKey]);

    const visibleRows = useMemo(() => sortRows(rows, sort), [rows, sort]);

    function onSort(key) {
        setSort((current) =>
            current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
        );
    }

    if (!user?.has_seller_wallet) {
        return null;
    }

    return (
        <div className="app-transactions-page">
            <div className="txPageHead">
                <div>
                    <h1 className="appContent-title">Withdrawals</h1>
                    <p className="txCount">
                        {loading ? 'Loading payouts…' : `${total} result${total === 1 ? '' : 's'}`}
                    </p>
                </div>
                <button type="button" className="txHeader-cta" onClick={() => setCreateOpen(true)}>
                    <IconPlus />
                    <span>Withdrawal</span>
                </button>
            </div>

            <div className="txHeader">
                <div className="txFilterBar">
                    <label className="txSearch">
                        <IconSearch />
                        <input
                            type="search"
                            placeholder="Search withdrawals"
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
                                <tr key={row.id}>
                                    <td>
                                        <span className="txMono" title={row.id}>
                                            {String(row.id).slice(-8)}
                                        </span>
                                    </td>
                                    <td className="txMuted">{row.created}</td>
                                    <td className="is-right">
                                        <span className="txAmount">{row.amount}</span>
                                    </td>
                                    <td>
                                        <span className="txRole">{row.method}</span>
                                    </td>
                                    <td>
                                        <StatusBadge status={row.statusKey}>{row.status}</StatusBadge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : !error ? (
                <div className="txTableWrap">
                    <div className="txEmpty">
                        <EmptyTransactionsArt />
                        <p>No withdrawals yet. Move funds from your wallet when you are ready.</p>
                        <button type="button" className="txEmpty-cta" onClick={() => setCreateOpen(true)}>
                            New withdrawal
                        </button>
                    </div>
                </div>
            ) : null}

            <CreateWithdrawalModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    setCreateOpen(false);
                    setReloadKey((value) => value + 1);
                }}
            />
        </div>
    );
}
