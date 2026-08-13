import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fieldError } from '../api';
import AuthAlert from '../components/AuthAlert';
import AuthField from '../components/AuthField';
import PhoneField from '../components/PhoneField';
import { brand } from '../brand';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();
    const next = location.state?.from || '/transactions';
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+213');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    const passwordChecks = useMemo(
        () => [
            { label: 'be 8 or more characters long', ok: password.length >= 8 },
            {
                label: 'have at least one upper and one lower case character',
                ok: /[a-z]/.test(password) && /[A-Z]/.test(password),
            },
            {
                label: 'have at least one number or special character',
                ok: /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password),
            },
        ],
        [password],
    );

    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setBusy(true);
        try {
            const data = await register({ email, phone, password });
            navigate('/verify-email', {
                replace: true,
                state: {
                    from: next,
                    resend_available_in: data.resend_available_in ?? 60,
                },
            });
        } catch (err) {
            setError(err);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="section section--form">
            <div className="section-container">
                <div className="section-form">
                    <p className="signupForm-login">
                        Already have an account?{' '}
                        <Link to="/login" className="signup-link">
                            Log in
                        </Link>
                    </p>
                    <h1 className="section-formHeading section-formHeading--divided">Create an account</h1>

                    <form className="defaultForm" onSubmit={onSubmit} noValidate>
                        <AuthAlert error={error} title="Could not create your account" />

                        <AuthField
                            id="signup-email"
                            label="Please enter your email address"
                            required
                            error={fieldError(error?.errors, 'email')}
                        >
                            <input
                                id="signup-email"
                                className="defaultInput"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </AuthField>

                        <AuthField
                            id="signup-phone"
                            label="Please enter your phone number"
                            required
                            error={fieldError(error?.errors, 'phone')}
                        >
                            <PhoneField value={phone} onChange={setPhone} />
                        </AuthField>

                        <AuthField
                            id="signup-password"
                            label="Please enter a new password"
                            required
                            error={fieldError(error?.errors, 'password')}
                            hint={
                                <div className="signupForm-suggestion">
                                    <div className="signupForm-suggestion-title">Your password must :</div>
                                    <ul className="signupForm-suggestion-list">
                                        {passwordChecks.map((check) => (
                                            <li
                                                key={check.label}
                                                className={`signupForm-suggestion-item${
                                                    password
                                                        ? check.ok
                                                            ? ' is-success'
                                                            : ' is-invalid'
                                                        : ''
                                                }`}
                                            >
                                                {check.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                        >
                            <input
                                id="signup-password"
                                className="defaultInput"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </AuthField>

                        <p className="signupForm-agreement field-hint">
                            By creating an account you agree to the {brand.domain}{' '}
                            <Link to="/legal/terms">Terms of Use</Link> and{' '}
                            <Link to="/legal/privacy">Privacy Policy</Link>.
                        </p>

                        <button
                            type="submit"
                            className="btn btn--secondary btn--large btn--block"
                            disabled={busy}
                        >
                            {busy ? 'Creating account…' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
