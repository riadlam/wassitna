import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import TouchShelf from './TouchShelf';

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [menuOpen, setMenuOpen] = useState(false);

    const onMenuToggle = useCallback(() => {
        setMenuOpen((open) => !open);
    }, []);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            {!isHome ? (
                <Header transparent={false} menuOpen={menuOpen} onMenuToggle={onMenuToggle} />
            ) : null}
            <Outlet context={{ menuOpen, onMenuToggle, closeMenu }} />
            <Footer />
            <TouchShelf open={menuOpen} onClose={closeMenu} />
        </>
    );
}
