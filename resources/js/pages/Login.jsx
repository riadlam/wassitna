import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fieldError } from '../api';
import AuthAlert from '../components/AuthAlert';
import AuthField from '../components/AuthField';
import { useAuth } from '../context/AuthContext';
import { brand } from '../brand';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const next = location.state?.from || '/transactions';
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setBusy(true);
        try {
            await login({ login: identifier, password });
            navigate(next, { replace: true });
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
                    <p className="loginForm-signup">
                        New to {brand.name}?{' '}
                        <Link to="/signup" className="signup-link" state={{ from: next }}>
                            Register an Account
                        </Link>
                    </p>
                    <h1 className="section-formHeading section-formHeading--divided">
                        Login to {brand.domain}
                    </h1>

                    <form className="defaultForm" onSubmit={onSubmit} noValidate>
                        <AuthAlert error={error} title="Could not log in" />

                        <AuthField
                            id="login-identifier"
                            label="Please enter your email address or phone number"
                            required
                            error={fieldError(error?.errors, 'login')}
                        >
                            <input
                                id="login-identifier"
                                className="defaultInput"
                                type="text"
                                name="login"
                                autoComplete="username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </AuthField>

                        <AuthField
                            id="login-password"
                            label="Please enter your password"
                            required
                            error={fieldError(error?.errors, 'password')}
                            link={
                                <Link to="/help" className="field-label-link">
                                    Recover your password
                                </Link>
                            }
                        >
                            <input
                                id="login-password"
                                className="defaultInput"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </AuthField>

                        <button
                            type="submit"
                            className="btn btn--secondary btn--large btn--block"
                            disabled={busy}
                        >
                            {busy ? 'Signing in…' : 'Secure Login'}
                        </button>
                    </form>

                    <p className="authForm-or">- OR -</p>

                    <Link to="/signup" className="btn btn--hollow btn--large btn--block" state={{ from: next }}>
                        Register an Account
                    </Link>
                </div>
            </div>
        </section>
    );
}
