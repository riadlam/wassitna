import { useMemo, useState } from 'react';
import { api, firstError } from '../api';
import { deliveryKind, deliverySpec } from '../delivery';

function CheckCard({ checked, onChange, title, hint }) {
    return (
        <label className={`txDelivery-check${checked ? ' is-checked' : ''}`}>
            <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
            <span>
                <strong>{title}</strong>
                <em>{hint}</em>
            </span>
        </label>
    );
}

export default function CategoryDeliveryPanel({ categorySlug, role, transactionId, delivery = {}, onUpdate }) {
    const spec = useMemo(() => deliverySpec(categorySlug), [categorySlug]);
    const isAccounts = deliveryKind(categorySlug) === 'accounts';
    const isSeller = role === 'seller';
    const [checked, setChecked] = useState(false);
    const [note, setNote] = useState(delivery.note || '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const sellerSent = Boolean(delivery.sent);
    const buyerReceived = Boolean(delivery.received);
    const done = isSeller ? sellerSent : buyerReceived;

    async function confirm(body) {
        if (!checked || busy) return;
        setBusy(true);
        setError('');
        try {
            const payload = await api(`/api/transactions/${encodeURIComponent(transactionId)}/deliver`, {
                method: 'POST',
                body,
            });
            onUpdate?.(payload.data || payload);
            setChecked(false);
        } catch (err) {
            setError(firstError(err.errors, err.message || 'Could not save.'));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="txActionPanel txDelivery">
            <p className="txDelivery-kicker">{isSeller ? spec.sellerKicker : spec.buyerKicker}</p>
            <p className="txActionPanel-title">{isSeller ? spec.sellerTitle : spec.buyerTitle}</p>
            <p className="txActionPanel-text">{isSeller ? spec.sellerText : spec.buyerText}</p>

            {isSeller && isAccounts ? (
                <div className="txDelivery-noteField">
                    <span>
                        Credentials <em>Optional</em>
                    </span>
                    <textarea
                        className="txDelivery-textarea"
                        rows={8}
                        value={note}
                        placeholder="Username, password, email, 2FA…"
                        readOnly={sellerSent}
                        onChange={(event) => setNote(event.target.value)}
                    />
                </div>
            ) : null}

            {done ? (
                <p className="txDelivery-done">{isSeller ? spec.sellerDone : spec.buyerDone}</p>
            ) : (
                <CheckCard
                    checked={checked}
                    onChange={setChecked}
                    title={isSeller ? spec.sellerCheck : spec.buyerCheck}
                    hint={isSeller ? spec.sellerCheckHint : spec.buyerCheckHint}
                />
            )}

            {error ? (
                <p className="txActionPanel-error" role="alert">
                    {error}
                </p>
            ) : null}

            {done ? null : (
                <button
                    type="button"
                    className="txActionPanel-btn"
                    disabled={!checked || busy}
                    onClick={() =>
                        confirm(
                            isSeller
                                ? { sent: true, ...(isAccounts ? { note } : {}) }
                                : { received: true },
                        )
                    }
                >
                    {busy ? 'Saving…' : isSeller ? spec.sellerCta : spec.buyerCta}
                </button>
            )}
        </div>
    );
}
