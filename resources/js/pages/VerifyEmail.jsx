import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, fieldError } from '../api';
import AuthAlert from '../components/AuthAlert';
import AuthField from '../components/AuthField';
import { brand } from '../brand';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, ready, setUser, logout, refreshUser } = useAuth();
    const next = location.state?.from || '/transactions';
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState('');
    const [busy, setBusy] = useState(false);
    const [resendBusy, setResendBusy] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputsRef = useRef([]);

    const code = useMemo(() => digits.join(''), [digits]);

    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    if (!ready) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: '/verify-email' }} />;
    }

    if (user.email_verified) {
        return <Navigate to={next} replace />;
    }

    const setDigitAt = (index, value) => {
        const cleaned = value.replace(/\D/g, '').slice(-1);
        setDigits((current) => {
            const nextDigits = [...current];
            nextDigits[index] = cleaned;
            return nextDigits;
        });
        if (cleaned && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const onPaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const nextDigits = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
        setDigits(nextDigits);
        inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setInfo('');
        if (code.length !== 6) {
            setError({
                message: 'Enter the 6-digit code from your email.',
                errors: { code: ['Enter the 6-digit code from your email.'] },
            });
            return;
        }
        setBusy(true);
        try {
            const data = await api('/api/auth/email/verify', {
                method: 'POST',
                body: { code },
            });
            setUser(data.user);
            navigate(next, { replace: true });
        } catch (err) {
            setError(err);
        } finally {
            setBusy(false);
        }
    };

    const onResend = async () => {
        if (cooldown > 0 || resendBusy) return;
        setError(null);
        setInfo('');
        setResendBusy(true);
        try {
            await api('/api/auth/email/resend', { method: 'POST' });
            setInfo('A new code was sent to your email.');
            setCooldown(60);
            await refreshUser();
        } catch (err) {
            setError(err);
        } finally {
            setResendBusy(false);
        }
    };

    return (
        <section className="section section--form">
            <div className="section-container">
                <div className="section-form verifyEmail">
                    <p className="signupForm-login">
                        Signed in as <strong>{user.email}</strong>
                        {' · '}
                        <button type="button" className="signup-link verifyEmail-logout" onClick={() => logout()}>
                            Use a different account
                        </button>
                    </p>
                    <h1 className="section-formHeading section-formHeading--divided">Verify your email</h1>
                    <p className="verifyEmail-lead">
                        We sent a 6-digit code to <strong>{user.email}</strong>. Enter it below to finish
                        creating your {brand.name} account.
                    </p>

                    <form className="defaultForm" onSubmit={onSubmit} noValidate>
                        <AuthAlert error={error} title="Could not verify email" />
                        {info ? <p className="verifyEmail-info">{info}</p> : null}

                        <AuthField
                            id="verify-code-0"
                            label="Verification code"
                            required
                            error={fieldError(error?.errors, 'code')}
                        >
                            <div className="verifyEmail-code" onPaste={onPaste}>
                                {digits.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(node) => {
                                            inputsRef.current[index] = node;
                                        }}
                                        id={index === 0 ? 'verify-code-0' : undefined}
                                        className="defaultInput verifyEmail-digit"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => setDigitAt(index, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && !digits[index] && index > 0) {
                                                inputsRef.current[index - 1]?.focus();
                                            }
                                        }}
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </AuthField>

                        <button
                            type="submit"
                            className="btn btn--secondary btn--large btn--block"
                            disabled={busy || code.length !== 6}
                        >
                            {busy ? 'Verifying…' : 'Verify and continue'}
                        </button>
                    </form>

                    <p className="verifyEmail-resend">
                        Didn&apos;t get the email?{' '}
                        <button
                            type="button"
                            className="signup-link"
                            onClick={onResend}
                            disabled={resendBusy || cooldown > 0}
                        >
                            {cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : resendBusy
                                  ? 'Sending…'
                                  : 'Send a new code'}
                        </button>
                    </p>
                    <p className="verifyEmail-hint">
                        Check spam/junk if you don&apos;t see it. The code expires in 15 minutes.
                    </p>
                    <p className="verifyEmail-hint">
                        Need help? <Link to="/contact">Contact us</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
