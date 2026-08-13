import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, downloadFile, firstError } from '../api';
import { useAuth } from '../context/AuthContext';
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

export default function ClosedPanel({
    isSeller = false,
    transactionId,
    sellerProceeds,
    onSummary,
}) {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    async function downloadInvoice() {
        if (downloading || !transactionId) return;
        setDownloading(true);
        setError('');
        try {
            await downloadFile(
                `/api/transactions/${encodeURIComponent(transactionId)}/invoice`,
                `wassitna-invoice-${transactionId}.pdf`,
            );
        } catch (err) {
            if (err.status === 401) {
                navigate('/login', { replace: true, state: { from: `/transaction/${transactionId}` } });
                return;
            }
            setError(firstError(err.errors, err.message || 'Could not download the invoice.'));
        } finally {
            setDownloading(false);
        }
    }

    async function requestWithdrawal(nextUser = user) {
        if (busy) return;
        if (!hasPayout(nextUser)) {
            setOpen(true);
            return;
        }

        setBusy(true);
        setError('');
        try {
            const payload = await api('/api/withdrawals', {
                method: 'POST',
                body: {
                    amount: Number(sellerProceeds),
                    transaction_id: transactionId,
                },
            });
            if (payload.user) setUser?.(payload.user);
            setDone(true);
            navigate('/withdrawals');
        } catch (err) {
            const message = firstError(err.errors, err.message || 'Could not create the withdrawal.');
            if (/already withdrawn/i.test(message)) {
                navigate('/withdrawals');
                return;
            }
            setError(message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="txActionPanel txClosed">
            <p className="txDelivery-kicker">Closed</p>
            <p className="txActionPanel-title">This transaction is now closed</p>
            <p className="txActionPanel-text">
                {isSeller
                    ? 'The buyer approved. Funds are in your wallet. You can withdraw them now.'
                    : 'The buyer approved. You can still open the summary or download the invoice below.'}
            </p>
            {error ? (
                <p className="txActionPanel-error" role="alert">
                    {error}
                </p>
            ) : null}
            {isSeller ? (
                done ? (
                    <p className="txDelivery-done">Withdrawal requested. Open Withdraw to follow it.</p>
                ) : (
                    <button
                        type="button"
                        className="txActionPanel-btn txWithdraw-btn"
                        disabled={busy}
                        onClick={requestWithdrawal}
                    >
                        {busy ? 'Withdrawing…' : 'Withdraw'}
                    </button>
                )
            ) : null}
            <div className="txInspect-actions">
                <button type="button" className="txActionPanel-btn txActionPanel-btn--ghost" onClick={onSummary}>
                    View transaction summary
                </button>
                <button
                    type="button"
                    className="txActionPanel-btn txActionPanel-btn--ghost"
                    disabled={downloading}
                    onClick={downloadInvoice}
                >
                    {downloading ? 'Downloading…' : 'Download invoice'}
                </button>
            </div>
            {isSeller ? (
                <WithdrawModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSaved={(savedUser) => {
                        setOpen(false);
                        requestWithdrawal(savedUser);
                    }}
                />
            ) : null}
        </div>
    );
}
