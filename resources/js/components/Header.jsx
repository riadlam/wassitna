import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { brand, navItems } from '../brand';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const chevronSvg = (
    <svg className="icon headerV2-primaryNav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 16c-.3 0-.5-.1-.7-.3l-6-6 1.4-1.4 5.3 5.3 5.3-5.3 1.4 1.4-6 6c-.2.2-.4.3-.7.3z" />
    </svg>
);

function UpsellBlock({ hiddenAtTablet = false, hiddenAtMobile = false }) {
    const cls = [
        'headerV2-upsell',
        hiddenAtTablet ? 'media--hidden@tablet' : '',
        hiddenAtMobile ? 'media--hidden@mobile' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cls}>
            <div className="headerV2-upsell-content">
                <h3 className="headerV2-upsell-title">Start A Transaction With {brand.name}</h3>
                {!hiddenAtMobile ? (
                    <p className="headerV2-upsell-desc">
                        Sell or buy domains, services, digital products, accounts, and merchandise
                    </p>
                ) : null}
            </div>
            <div className="headerV2-upsell-action">
                <Link to="/start-transaction" className="btn btn--secondary">
                    Get Started Now
                </Link>
            </div>
        </div>
    );
}

export default function Header({ transparent = false, menuOpen = false, onMenuToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function goToNav(event, to) {
        if (!to?.includes('#')) return;
        event.preventDefault();
        setOpenNav(null);
        const [path, hash] = to.split('#');
        const targetPath = path || '/';
        const selector = `#${hash}`;
        if (location.pathname === targetPath) {
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', to);
            return;
        }
        navigate(to);
    }
    const [scrolled, setScrolled] = useState(false);
    const [openNav, setOpenNav] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('is-sidebar-active', menuOpen);
        document.body.classList.toggle('is-mobileNavActive', menuOpen);
        return () => {
            document.body.classList.remove('is-sidebar-active', 'is-mobileNavActive');
        };
    }, [menuOpen]);

    const headerClass = [
        'headerV2',
        scrolled ? 'is-sticky' : '',
        !scrolled && transparent ? 'is-header-scrollTop' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <header className={headerClass} data-sticky-header data-header-logged-out data-header data-theme="light">
            <div className="headerV2-primary headerV2-primary--">
                <div className="headerV2-container section-container">
                    <div className="headerV2-inner">
                        <button
                            type="button"
                            className="headerV2-menuBtn media--available@tablet"
                            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
                            aria-expanded={menuOpen}
                            onClick={() => onMenuToggle?.()}
                        >
                            <svg
                                className="icon headerV2-menuBtn-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 16c-.3 0-.5-.1-.7-.3l-6-6 1.4-1.4 5.3 5.3 5.3-5.3 1.4 1.4-6 6c-.2.2-.4.3-.7.3z" />
                            </svg>
                        </button>

                        <Logo />

                        <nav className="headerV2-nav">
                            <ul className="headerV2-primaryNav">
                                <li className="headerV2-primaryNav-item headerV2-primaryNav-upsell media--available@tablet">
                                    <UpsellBlock hiddenAtMobile />
                                    <Link
                                        to="/start-transaction"
                                        className="btn btn--secondary btn--block media--available@mobile"
                                    >
                                        Start A Transaction
                                    </Link>
                                </li>

                                {navItems.map((item) => {
                                    const hasMenu = Boolean(item.children?.length);
                                    const isOpen = hasMenu && openNav === item.id;

                                    if (!hasMenu) {
                                        return (
                                            <li key={item.id} className="headerV2-primaryNav-item" id={`header-${item.id}`}>
                                                <Link
                                                    to={item.to}
                                                    className="headerV2-primaryNav-title"
                                                    onClick={(event) => goToNav(event, item.to)}
                                                >
                                                    <span className="headerV2-primaryNav-text">{item.label}</span>
                                                </Link>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li
                                            role="tab"
                                            tabIndex={0}
                                            key={item.id}
                                            className={`headerV2-primaryNav-item${isOpen ? ' is-active' : ''}`}
                                            aria-controls={`header-${item.id}-tab`}
                                            id={`header-${item.id}`}
                                            onMouseEnter={() => setOpenNav(item.id)}
                                            onMouseLeave={() => setOpenNav(null)}
                                            onFocus={() => setOpenNav(item.id)}
                                            onBlur={(e) => {
                                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                                    setOpenNav(null);
                                                }
                                            }}
                                        >
                                            <span className="headerV2-primaryNav-title">
                                                <span className="headerV2-primaryNav-text">{item.label}</span>
                                                {chevronSvg}
                                            </span>
                                            <div
                                                className="headerV2-subnav"
                                                role="tabpanel"
                                                aria-labelledby={`header-${item.id}`}
                                                id={`header-${item.id}-tab`}
                                            >
                                                <div className="headerV2-subnav-container">
                                                    <ul className="headerV2-subnav-list">
                                                        {item.children.map((child) => {
                                                            const className = child.mobileOnly
                                                                ? 'headerV2-subnav-item media--available@mobile'
                                                                : 'headerV2-subnav-item';
                                                            const inner = (
                                                                <>
                                                                    <h3 className="headerV2-subnav-title">{child.label}</h3>
                                                                    {child.desc ? (
                                                                        <p className="headerV2-subnav-desc">{child.desc}</p>
                                                                    ) : null}
                                                                </>
                                                            );
                                                            return (
                                                                <li className={className} key={child.label + (child.to || child.href)}>
                                                                    {child.href ? (
                                                                        <a href={child.href} className="headerV2-subnav-link">
                                                                            {inner}
                                                                        </a>
                                                                    ) : (
                                                                        <Link
                                                                            to={child.to}
                                                                            className="headerV2-subnav-link"
                                                                            onClick={(event) => goToNav(event, child.to)}
                                                                        >
                                                                            {inner}
                                                                        </Link>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                    <UpsellBlock hiddenAtTablet />
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="headerV2-search media--hidden@mobile">
                                <form className="expandableSearch" onSubmit={(e) => e.preventDefault()}>
                                    <label className="expandableSearch-label" htmlFor="expandable-search">
                                        <svg
                                            className="expandableSearch-icon"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                                                transform="translate(-3 -3)"
                                            />
                                        </svg>
                                    </label>
                                    <input
                                        type="text"
                                        className="expandableSearch-input"
                                        id="expandable-search"
                                        placeholder={`Search for ${brand.domain}`}
                                    />
                                </form>
                            </div>

                            <ul className="headerV2-authNav">
                                {user ? (
                                    <>
                                        <li className="headerV2-authNav-item">
                                            <Link to="/transactions" className="headerV2-authNav-link">
                                                <span className="headerV2-authNav-text">Transactions</span>
                                            </Link>
                                        </li>
                                        <li className="headerV2-authNav-item">
                                            <button
                                                type="button"
                                                className="headerV2-authNav-link"
                                                onClick={async () => {
                                                    await logout();
                                                    navigate('/');
                                                }}
                                            >
                                                <span className="headerV2-authNav-text">Log out</span>
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="headerV2-authNav-item">
                                            <Link to="/login" className="headerV2-authNav-link">
                                                <span className="headerV2-authNav-text">Login</span>
                                            </Link>
                                        </li>
                                        <li className="headerV2-authNav-item">
                                            <Link to="/signup" className="headerV2-authNav-link">
                                                <span className="headerV2-authNav-text">Signup →</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
