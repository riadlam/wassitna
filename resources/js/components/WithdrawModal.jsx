import { useEffect, useMemo, useState } from 'react';
import { api, fieldError, firstError } from '../api';
import { useAuth } from '../context/AuthContext';

const METHODS = [
    {
        value: 'ccp',
        title: 'CCP',
        text: 'Algérie Poste current account. You will enter the CCP number, clé, and account holder name.',
    },
    {
        value: 'baridimob',
        title: 'BaridiMob',
        text: 'Mobile wallet. You will enter your RIP BaridiMob.',
    },
];

function Field({ id, label, hint, error, children }) {
    return (
        <label className={`txWithdraw-field${error ? ' is-invalid' : ''}`} htmlFor={id}>
            <span>
                {label}
                {hint ? <em>{hint}</em> : null}
            </span>
            {children}
            {error ? <strong className="txWithdraw-error">{error}</strong> : null}
        </label>
    );
}

export default function WithdrawModal({ open, onClose, onSaved }) {
    const { user, setUser } = useAuth();
    const [step, setStep] = useState(0);
    const [method, setMethod] = useState(user?.payout_method || '');
    const [ccpNumber, setCcpNumber] = useState(user?.ccp_number || '');
    const [cle, setCle] = useState(user?.cle || '');
    const [holder, setHolder] = useState(user?.account_holder_name || user?.name || '');
    const [rip, setRip] = useState(user?.rip_baridimob || '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return undefined;
        setStep(0);
        setMethod(user?.payout_method || '');
        setCcpNumber(user?.ccp_number || '');
        setCle(user?.cle || '');
        setHolder(user?.account_holder_name || user?.name || '');
        setRip(user?.rip_baridimob || '');
        setBusy(false);
        setError('');
        setErrors({});

        const onKey = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, user, onClose]);

    const canContinue = Boolean(method);
    const canSave = useMemo(() => {
        if (method === 'ccp') {
            return Boolean(ccpNumber.trim() && cle.trim() && holder.trim());
        }
        if (method === 'baridimob') {
            return Boolean(rip.trim());
        }
        return false;
    }, [method, ccpNumber, cle, holder, rip]);

    async function save() {
        if (busy || !canSave) return;
        setBusy(true);
        setError('');
        setErrors({});
        try {
            const payload = await api('/api/auth/payout', {
                method: 'PATCH',
                body: {
                    payout_method: method,
                    ccp_number: method === 'ccp' ? ccpNumber : '',
                    cle: method === 'ccp' ? cle : '',
                    account_holder_name: method === 'ccp' ? holder : '',
                    rip_baridimob: method === 'baridimob' ? rip : '',
                },
            });
            if (payload.user) setUser?.(payload.user);
            onSaved?.(payload.user);
        } catch (err) {
            setErrors(err.errors || {});
            setError(firstError(err.errors, err.message || 'Could not save payout details.'));
        } finally {
            setBusy(false);
        }
    }

    if (!open) return null;

    return (
        <div className="txModal-backdrop txWithdraw-backdrop txModalHost" onClick={onClose}>
            <div
                className="txModal txWithdraw-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tx-withdraw-title"
                onClick={(event) => event.stopPropagation()}
            >
                <p className="txDelivery-kicker">Withdraw</p>
                <h2 className="txModal-title" id="tx-withdraw-title">
                    Where should we send the funds?
                </h2>
                <div className="txWithdraw-steps" aria-hidden="true">
                    <span className={step === 0 ? 'is-active' : ''}>1</span>
                    <i />
                    <span className={step === 1 ? 'is-active' : ''}>2</span>
                </div>

                <div className="txWithdraw-viewport">
                    <div className={`txWithdraw-track is-step-${step}`}>
                        <div className={`txWithdraw-pane${step === 0 ? ' is-active' : ''}`}>
                            <p className="txModal-text">Choose how you want to receive the payout.</p>
                            <div className="txModal-reasons">
                                {METHODS.map((item) => (
                                    <label
                                        key={item.value}
                                        className={`txModal-reason txWithdraw-choice${method === item.value ? ' is-selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payout-method"
                                            value={item.value}
                                            checked={method === item.value}
                                            onChange={() => setMethod(item.value)}
                                        />
                                        <span>
                                            <strong>{item.title}</strong>
                                            <em>{item.text}</em>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={`txWithdraw-pane${step === 1 ? ' is-active' : ''}`}>
                            <p className="txModal-text">
                                {method === 'baridimob'
                                    ? 'Enter your RIP BaridiMob. We will keep it on your account for the next payout.'
                                    : 'Enter your CCP details. We will keep them on your account for the next payout.'}
                            </p>

                            <div key={method} className={`txWithdraw-fields${method ? ` is-${method}` : ''}`}>
                                {method === 'ccp' ? (
                                    <>
                                        <Field
                                            id="withdraw-ccp"
                                            label="CCP number"
                                            hint="digits only"
                                            error={fieldError(errors, 'ccp_number')}
                                        >
                                            <input
                                                id="withdraw-ccp"
                                                className="txWithdraw-input"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                value={ccpNumber}
                                                onChange={(event) => setCcpNumber(event.target.value)}
                                            />
                                        </Field>
                                        <Field
                                            id="withdraw-cle"
                                            label="Clé"
                                            hint="2 digits"
                                            error={fieldError(errors, 'cle')}
                                        >
                                            <input
                                                id="withdraw-cle"
                                                className="txWithdraw-input"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                maxLength={2}
                                                value={cle}
                                                onChange={(event) => setCle(event.target.value)}
                                            />
                                        </Field>
                                        <Field
                                            id="withdraw-holder"
                                            label="Account holder name"
                                            error={fieldError(errors, 'account_holder_name')}
                                        >
                                            <input
                                                id="withdraw-holder"
                                                className="txWithdraw-input"
                                                autoComplete="name"
                                                value={holder}
                                                onChange={(event) => setHolder(event.target.value)}
                                            />
                                        </Field>
                                    </>
                                ) : (
                                    <Field
                                        id="withdraw-rip"
                                        label="RIP BaridiMob"
                                        hint="20 digits"
                                        error={fieldError(errors, 'rip_baridimob')}
                                    >
                                        <input
                                            id="withdraw-rip"
                                            className="txWithdraw-input"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            value={rip}
                                            onChange={(event) => setRip(event.target.value)}
                                        />
                                    </Field>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error ? (
                    <p className="txActionPanel-error" role="alert">
                        {error}
                    </p>
                ) : null}

                <div className="txInspect-actions">
                    {step === 0 ? (
                        <>
                            <button type="button" className="txActionPanel-btn txActionPanel-btn--ghost" onClick={onClose}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="txActionPanel-btn"
                                disabled={!canContinue}
                                onClick={() => setStep(1)}
                            >
                                Continue
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="txActionPanel-btn txActionPanel-btn--ghost"
                                onClick={() => {
                                    setError('');
                                    setErrors({});
                                    setStep(0);
                                }}
                            >
                                Back
                            </button>
                            <button type="button" className="txActionPanel-btn" disabled={!canSave || busy} onClick={save}>
                                {busy ? 'Saving…' : 'Save changes'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
