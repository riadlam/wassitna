import { useEffect, useState } from 'react';
import { api, fieldError, firstError } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../fees';
import WithdrawModal from './WithdrawModal';

function hasPayout(user) {
    if (user?.payout_method === 'ccp') {
        return Boolean(user.ccp_number && user.cle && user.account_holder_name);
    }
    if (user?.payout_method === 'baridimob') {
        return Boolean(user.rip_baridimob);
    }
    return false;
}

export default function CreateWithdrawalModal({ open, onClose, onCreated }) {
    const { user, setUser } = useAuth();
    const wallet = Number(user?.wallet || 0);
    const [amount, setAmount] = useState(user?.wallet || '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return undefined;
        setAmount(user?.wallet || '');
        setBusy(false);
        setError('');
        setErrors({});

        const onKey = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, user, onClose]);

    if (!open) return null;

    if (!hasPayout(user)) {
        return <WithdrawModal open={open} onClose={onClose} onSaved={() => {}} />;
    }

    async function submit() {
        if (busy) return;
        setBusy(true);
        setError('');
        setErrors({});
        try {
            const payload = await api('/api/withdrawals', {
                method: 'POST',
                body: { amount: Number(amount) },
            });
            if (payload.user) setUser?.(payload.user);
            onCreated?.(payload.data);
        } catch (err) {
            setErrors(err.errors || {});
            setError(firstError(err.errors, err.message || 'Could not create the withdrawal.'));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="txModal-backdrop txWithdraw-backdrop txModalHost" onClick={onClose}>
            <div
                className="txModal txWithdraw-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tx-create-withdraw-title"
                onClick={(event) => event.stopPropagation()}
            >
                <p className="txDelivery-kicker">Withdraw</p>
                <h2 className="txModal-title" id="tx-create-withdraw-title">
                    New withdrawal
                </h2>
                <p className="txModal-text">
                    Available in your wallet: <strong>{formatMoney(wallet, 'DZD')}</strong>
                </p>
                <label className={`txWithdraw-field${fieldError(errors, 'amount') ? ' is-invalid' : ''}`} htmlFor="withdraw-amount">
                    <span>
                        Amount <em>DA</em>
                    </span>
                    <input
                        id="withdraw-amount"
                        className="txWithdraw-input"
                        inputMode="decimal"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                    {fieldError(errors, 'amount') ? (
                        <strong className="txWithdraw-error">{fieldError(errors, 'amount')}</strong>
                    ) : null}
                </label>
                {error && !fieldError(errors, 'amount') ? (
                    <p className="txActionPanel-error" role="alert">
                        {error}
                    </p>
                ) : null}
                <div className="txInspect-actions">
                    <button type="button" className="txActionPanel-btn txActionPanel-btn--ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="txActionPanel-btn"
                        disabled={busy || !(Number(amount) > 0)}
                        onClick={submit}
                    >
                        {busy ? 'Saving…' : 'Request withdrawal'}
                    </button>
                </div>
            </div>
        </div>
    );
}
