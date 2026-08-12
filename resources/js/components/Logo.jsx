import { Link } from 'react-router-dom';
import { brand } from '../brand';

function ShieldMark({ className = 'logo-shield' }) {
    return (
        <svg
            version="1.1"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 336.2 120 119.4"
            aria-hidden="true"
        >
            <g className="logo-shield">
                <path
                    className="logo-text--primary logo-primary"
                    d="M56.6,455.6h-1c-0.5-0.5-56.9-15.5-55.4-99.3v-1.2l7.7-11l1.5-0.2
          c1-0.2,47.2-7.5,47.2-7.5s46.4,7.2,47.4,7.5l1.2,0.2l7.7,11v1.2c1,43.4-14,68.1-26.7,81.1C72.4,451.6,57.9,455.6,56.6,455.6z
           M8,357.8c-1,71.4,41.7,87.6,48.7,89.8c7.2-2.2,49.6-18.5,48.7-90.1l-4.7-6.7c-5.2-1.2-25.7-6.2-43.9-6.7
          c-18.2,0.5-38.4,5.5-43.9,6.7L8,357.8z"
                />
                <rect x="37.4" y="388.5" className="logo-text--primary logo-primary" width="41.9" height="8.2" />
                <rect x="37.4" y="409.2" className="logo-text--primary logo-primary" width="41.9" height="8.2" />
                <rect x="37.4" y="367.8" className="logo-text--primary logo-primary" width="41.9" height="8.2" />
                <path
                    className="logo-text--secondary logo-secondary"
                    d="M37.2,400c-4,0-7.5-3.5-7.5-7.7c0-4,3.2-7.7,7.5-7.7h19.7v-5.7h-20
        c-7.5,0-13.2,6-13.2,13.5l0,0c0,7.5,6,13.5,13.2,13.5h20V400H37.2z"
                />
            </g>
        </svg>
    );
}

function Wordmark({ className = 'logo-wordmark header-logo-img' }) {
    return (
        <svg
            width="153"
            height="18"
            viewBox="0 0 153 18"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={brand.domain}
        >
            <title>{brand.domain}</title>
            <text
                x="0"
                y="14"
                className="logo-primary"
                style={{ fontFamily: "Montserrat, Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 16 }}
            >
                Wassit
                <tspan className="logo-secondary">na</tspan>
            </text>
        </svg>
    );
}

export function ShieldMarkExport(props) {
    return <ShieldMark {...props} />;
}

export default function Logo({ className = '', footer = false, variant = 'default', to = '/' }) {
    if (variant === 'mark') {
        return (
            <Link to={to} className={`logo-mark-link ${className}`} title="Go to home page" aria-label={brand.name}>
                <ShieldMark />
            </Link>
        );
    }

    if (variant === 'headerV3') {
        return (
            <Link to={to} className={className || 'headerV3-logo'} title="Go to transactions" aria-label={brand.name}>
                <span className="logo headerV3-wordmark">
                    <span className="logo-primary logo-text--primary">Wassit</span>
                    <span className="logo-secondary logo-text--secondary">na</span>
                </span>
            </Link>
        );
    }

    if (footer || variant === 'app') {
        return (
            <Link to={to} className={`logo-wordmark ${className}`} title="Go to home page" aria-label={brand.name}>
                <span className="logo-name">
                    <span className="logo-primary">Wassit</span>
                    <span className="logo-secondary">na</span>
                </span>
            </Link>
        );
    }

    return (
        <Link to="/" className={`headerV2-logo ${className}`} title="Go to home page" aria-label={brand.name}>
            <span className="media--available@tablet">
                <Wordmark />
            </span>
            <span className="media--hidden@tablet logo-compact">
                <ShieldMark />
                <span className="logo-name">
                    <span className="logo-primary">Wassit</span>
                    <span className="logo-secondary">na</span>
                </span>
            </span>
        </Link>
    );
}
