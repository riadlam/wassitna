import { Link, NavLink, Outlet } from 'react-router-dom';
import { brand } from '../brand';
import Logo, { ShieldMarkExport } from './Logo';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../fees';
import {
    IconCalc,
    IconInfo,
    IconList,
    IconPhone,
    IconPlus,
    IconWallet,
} from './AppIcons';

const topNav = [
    { to: '/transactions', label: 'Transactions', icon: IconList, end: true },
    { to: '/withdrawals', label: 'Withdraw', icon: IconWallet },
    { to: '/transactions/fees', label: 'Fee Calculator', icon: IconCalc },
];

const bottomNav = [
    { to: '/about', label: 'About Us', icon: IconList },
    { to: '/help', label: 'FAQ', icon: IconInfo },
    { to: '/contact', label: 'Contact Us', icon: IconPhone },
];

function NavItem({ to, label, icon: Icon, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `appSidebar-item${isActive ? ' is-selected' : ''}`}
        >
            {({ isActive }) => (
                <>
                    <Icon filled={isActive} />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    );
}

export default function AppShell() {
    const { user } = useAuth();
    const showWallet = Boolean(user?.has_seller_wallet);
    const navItems = showWallet ? topNav : topNav.filter((item) => item.to !== '/withdrawals');

    return (
        <div className="appShell">
            <div className="appShell-page PageContainer">
                <aside className="appSidebar SideBarNavigation">
                    <div className="TopNavigation">
                        <Logo variant="app" to="/transactions" className="EscrowLogo appSidebar-logo" />
                        <Link to="/transactions/start" className="appSidebar-cta Cta">
                            <IconPlus />
                            <span>Start a transaction</span>
                        </Link>
                        {showWallet ? (
                            <div className="appSidebar-wallet">
                                <span>Wallet</span>
                                <strong>{formatMoney(user.wallet, 'DZD')}</strong>
                            </div>
                        ) : null}
                        <nav className="appSidebar-nav" aria-label="Account">
                            {navItems.map((item) => (
                                <NavItem key={item.to} {...item} />
                            ))}
                        </nav>
                    </div>
                    <nav className="appSidebar-nav appSidebar-nav--bottom" aria-label="Help">
                        {bottomNav.map((item) => (
                            <NavItem key={item.to} {...item} />
                        ))}
                    </nav>
                </aside>

                <div className="appMain MainContent">
                    <header className="appTopbar">
                        <Link to="/transactions" className="appAvatar" title={brand.name} aria-label="Account">
                            <ShieldMarkExport />
                        </Link>
                    </header>
                    <div className="appContent PageContent">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
