import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, firstError } from '../api';
import { feeScheduleCopy, formatMoney } from '../fees';

const tierHints = {
    empty: 'Enter an amount to estimate your fee.',
    free: 'Under 20,000 DA — no Wassitna fee.',
    mid: '1.5% applies from 20,000 to 100,000 DA.',
    high: '1% applies from 100,000 to 200,000 DA.',
};

function mapFeeResult(payload) {
    return {
        amount: Number(payload.amount || 0),
        fee: Number(payload.fee || 0),
        cappedAmount: Number(payload.capped_amount ?? payload.cappedAmount ?? 0),
        overCap: Boolean(payload.over_cap ?? payload.overCap),
        rate: Number(payload.rate || 0),
        rateLabel: payload.rate_label || payload.rateLabel || 'Free',
        tier: payload.tier || 'empty',
    };
}

export default function FeeCalculator() {
    const [amount, setAmount] = useState('50000');
    const [result, setResult] = useState(null);
    const [shown, setShown] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const progress = Math.min(100, (Number(result?.cappedAmount || 0) / 200000) * 100);

    async function onCalculate(event) {
        event.preventDefault();
        setBusy(true);
        setError('');
        try {
            const payload = await api('/api/fees/calculate', {
                method: 'POST',
                body: { amount: Number(amount) || 0 },
            });
            setResult(mapFeeResult(payload));
            setShown(true);
        } catch (err) {
            setShown(false);
            setResult(null);
            setError(firstError(err.errors, err.message || 'Could not calculate fee.'));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="app-fee-page">
            <div className="appFee-hero">
                <div className="appFee-hero-copy">
                    <p className="appFee-kicker">Pricing</p>
                    <h1 className="appContent-title">Fee Calculator</h1>
                    <p className="appFee-lead">
                        Transparent escrow fees in DA. Free under 20,000 — then 1.5% or 1%, capped at 200,000 DA.
                    </p>
                </div>
            </div>

            <div className="feeCalculator-wrap feeCalculator-wrap--app">
                <div className="feeCalculator-card feeCalculator-card--panel">
                    <div className="feeCalculator-panelHead">
                        <h2>Estimate your fee</h2>
                        <p>Enter the transaction amount, then calculate.</p>
                    </div>

                    <form className="feeCalculator-form" onSubmit={onCalculate}>
                        <label className="feeCalculator-amount" htmlFor="fee-amount">
                            <span className="feeCalculator-amount-label">Transaction amount</span>
                            <span className="feeCalculator-amount-field">
                                <span className="feeCalculator-amount-prefix">DA</span>
                                <input
                                    id="fee-amount"
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={amount}
                                    onChange={(event) => {
                                        setAmount(event.target.value);
                                        setShown(false);
                                        setError('');
                                    }}
                                    placeholder="50 000"
                                />
                            </span>
                        </label>

                        <div className="feeCalculator-meter" aria-hidden="true">
                            <div className="feeCalculator-meter-track">
                                <div className="feeCalculator-meter-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="feeCalculator-meter-marks">
                                <span>0</span>
                                <span>20k</span>
                                <span>100k</span>
                                <span>200k</span>
                            </div>
                        </div>

                        {error ? (
                            <p className="feeCalculator-note feeCalculator-note--warn" role="alert">
                                {error}
                            </p>
                        ) : null}

                        <button type="submit" className="feeCalculator-submitBtn" disabled={busy}>
                            {busy ? 'Calculating…' : 'Calculate fee'}
                        </button>
                    </form>

                    {shown && result ? (
                        <div className={`feeCalculator-result is-visible tier-${result.tier}`} role="status">
                            <div className="feeCalculator-result-glow" aria-hidden="true" />
                            <p className="feeCalculator-result-label">Wassitna fee</p>
                            <p className="feeCalculator-result-total">{formatMoney(result.fee, 'DZD')}</p>
                            <div className="feeCalculator-result-meta">
                                <div>
                                    <span>Amount</span>
                                    <strong>{formatMoney(result.cappedAmount, 'DZD')}</strong>
                                </div>
                                <div>
                                    <span>Rate</span>
                                    <strong>{result.rateLabel}</strong>
                                </div>
                            </div>
                            <p className="feeCalculator-note">{tierHints[result.tier] || tierHints.empty}</p>
                            {result.overCap ? (
                                <p className="feeCalculator-note feeCalculator-note--warn">
                                    Amount capped at 200,000 DA for fee calculation.
                                </p>
                            ) : null}
                            <Link
                                to="/transactions/start"
                                state={{ price: result.cappedAmount, currency: 'DZD' }}
                                className="feeCalculator-cta"
                            >
                                Start a transaction
                            </Link>
                        </div>
                    ) : (
                        <div className="feeCalculator-placeholder">
                            <p>Your estimated fee will appear here after you calculate.</p>
                        </div>
                    )}
                </div>

                <aside className="feeCalculator-schedule feeCalculator-schedule--tiers">
                    <div className="feeCalculator-panelHead">
                        <h2>Fee schedule</h2>
                        <p>Simple tiers. No surprises.</p>
                    </div>
                    <ul>
                        {feeScheduleCopy.map((row, index) => (
                            <li key={row.range} className={`feeTier feeTier--${index}`}>
                                <div className="feeTier-index">{String(index + 1).padStart(2, '0')}</div>
                                <div className="feeTier-body">
                                    <span>{row.range}</span>
                                    <strong>{row.rate}</strong>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
}
