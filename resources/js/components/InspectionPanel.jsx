import { useEffect, useMemo, useState } from 'react';
import { api, firstError } from '../api';
import { brand } from '../brand';
import { useAuth } from '../context/AuthContext';
import { inspectionCopy, reportReasons } from '../delivery';

export default function InspectionPanel({ categorySlug, role, transactionId, delivery = {}, days, dayLabel, onUpdate }) {
    const { refreshUser } = useAuth();
    const copy = useMemo(() => inspectionCopy(categorySlug, role), [categorySlug, role]);
    const reasons = useMemo(() => reportReasons(categorySlug), [categorySlug]);
    const isBuyer = role === 'buyer';
    const [busy, setBusy] = useState('');
    const [error, setError] = useState('');
    const [reportOpen, setReportOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [pauseConfirm, setPauseConfirm] = useState(false);

    const adminHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
        `Hi Wassitna, I need help with transaction ${transactionId}`,
    )}`;

    useEffect(() => {
        if (!reportOpen) return undefined;
        const onKey = (event) => {
            if (event.key === 'Escape') setReportOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [reportOpen]);

    async function inspect(action) {
        if (busy) return;
        setBusy(action);
        setError('');
        try {
            const payload = await api(`/api/transactions/${encodeURIComponent(transactionId)}/inspect`, {
                method: 'POST',
                body: { action },
            });
            onUpdate?.(payload.data || payload);
            if (action === 'approve') {
                await refreshUser?.();
            }
            setReportOpen(false);
        } catch (err) {
            setError(firstError(err.errors, err.message || 'Could not update inspection.'));
        } finally {
            setBusy('');
        }
    }

    function openReport() {
        setReason('');
        setPauseConfirm(false);
        setError('');
        setReportOpen(true);
    }

    const canSubmitReport = Boolean(reason) && pauseConfirm && !busy;

    return (
        <div className="txActionPanel txDelivery">
            <p className="txDelivery-kicker">Inspection</p>
            <p className="txActionPanel-title">{copy.title}</p>
            <p className="txActionPanel-text">
                {copy.text} You have{' '}
                <strong>
                    {days} calendar {dayLabel}
                </strong>
                .
            </p>
            <ul className="txInspect-tips">
                {copy.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                ))}
            </ul>

            {delivery.note ? (
                <div className="txDelivery-noteField">
                    <span>Credentials</span>
                    <pre className="txDelivery-note">{delivery.note}</pre>
                </div>
            ) : null}

            {error && !reportOpen ? (
                <p className="txActionPanel-error" role="alert">
                    {error}
                </p>
            ) : null}

            {isBuyer ? (
                <div className="txInspect-actions">
                    <button
                        type="button"
                        className="txActionPanel-btn"
                        disabled={Boolean(busy)}
                        onClick={() => inspect('approve')}
                    >
                        {busy === 'approve' ? 'Closing…' : 'Approve and close'}
                    </button>
                    <button
                        type="button"
                        className="txActionPanel-btn txActionPanel-btn--ghost"
                        disabled={Boolean(busy)}
                        onClick={openReport}
                    >
                        Report
                    </button>
                </div>
            ) : (
                <p className="txDelivery-done">Waiting for the buyer to approve or report.</p>
            )}

            <a className="txInspect-admin" href={adminHref} target="_blank" rel="noreferrer">
                WhatsApp admin
            </a>

            {reportOpen ? (
                <div className="txModal-backdrop" onClick={() => setReportOpen(false)}>
                    <div
                        className="txModal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tx-report-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className="txDelivery-kicker">Pause carefully</p>
                        <h2 className="txModal-title" id="tx-report-title">
                            Talk to admin before you pause this deal
                        </h2>
                        <p className="txModal-text">
                            Most issues get sorted on WhatsApp. Reporting pauses the transaction and holds the funds
                            until Wassitna reviews it.
                        </p>

                        <a className="txModal-whatsapp" href={adminHref} target="_blank" rel="noreferrer">
                            Message admin on WhatsApp
                        </a>

                        <p className="txModal-label">If you still want to pause, what is wrong?</p>
                        <div className="txModal-reasons">
                            {reasons.map((item) => (
                                <label key={item.value} className={`txModal-reason${reason === item.value ? ' is-selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="report-reason"
                                        value={item.value}
                                        checked={reason === item.value}
                                        onChange={() => setReason(item.value)}
                                    />
                                    <span>{item.label}</span>
                                </label>
                            ))}
                        </div>

                        <label className={`txDelivery-check${pauseConfirm ? ' is-checked' : ''}`}>
                            <input
                                type="checkbox"
                                checked={pauseConfirm}
                                onChange={(event) => setPauseConfirm(event.target.checked)}
                            />
                            <span>
                                <strong>Pause this deal and ask Wassitna to review</strong>
                                <em>Only if chat with admin did not help.</em>
                            </span>
                        </label>

                        {error ? (
                            <p className="txActionPanel-error" role="alert">
                                {error}
                            </p>
                        ) : null}

                        <div className="txInspect-actions">
                            <button type="button" className="txActionPanel-btn txActionPanel-btn--ghost" onClick={() => setReportOpen(false)}>
                                Keep inspecting
                            </button>
                            <button
                                type="button"
                                className="txActionPanel-btn txActionPanel-btn--warn"
                                disabled={!canSubmitReport}
                                onClick={() => inspect('report')}
                            >
                                {busy === 'report' ? 'Pausing…' : 'Pause and report'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
