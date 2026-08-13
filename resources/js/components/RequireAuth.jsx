import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }) {
    const { user, ready } = useAuth();
    const location = useLocation();
    const path = `${location.pathname}${location.search}`;

    if (!ready) {
        return null;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: path }}
            />
        );
    }

    if (!user.email_verified && location.pathname !== '/verify-email') {
        return (
            <Navigate
                to="/verify-email"
                replace
                state={{ from: path }}
            />
        );
    }

    return children;
}
