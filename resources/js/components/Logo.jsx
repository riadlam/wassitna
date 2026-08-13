import { Link } from 'react-router-dom';
import { brand } from '../brand';

export const LOGO_SRC = '/vendor/escrow/images/escrow-pay/logo.png';

function BrandMark({ className = 'brandLogo', alt = '' }) {
    return <img src={LOGO_SRC} alt={alt} className={className} />;
}

function WordName({ className = 'logo-name' }) {
    return (
        <span className={className}>
            <span className="logo-primary">Wassit</span>
            <span className="logo-secondary">na</span>
        </span>
    );
}

export function ShieldMarkExport({ className = 'brandLogo brandLogo--mark' }) {
    return <BrandMark className={className} alt={brand.name} />;
}

export default function Logo({ className = '', footer = false, variant = 'default', to = '/' }) {
    const title = variant === 'headerV3' || variant === 'app' ? 'Go to transactions' : 'Go to home page';

    if (variant === 'mark') {
        return (
            <Link to={to} className={`logo-mark-link ${className}`} title={title} aria-label={brand.name}>
                <BrandMark className="brandLogo brandLogo--mark" alt="" />
            </Link>
        );
    }

    if (variant === 'headerV3') {
        return (
            <Link to={to} className={className || 'headerV3-logo'} title={title} aria-label={brand.name}>
                <span className="brandLogoLockup">
                    <BrandMark className="brandLogo brandLogo--headerV3" alt="" />
                    <WordName className="logo-name logo-name--headerV3" />
                </span>
            </Link>
        );
    }

    if (footer || variant === 'app') {
        return (
            <Link to={to} className={`logo-wordmark ${className}`} title={title} aria-label={brand.name}>
                <span className="brandLogoLockup">
                    <BrandMark className={`brandLogo${footer ? ' brandLogo--footer' : ' brandLogo--app'}`} alt="" />
                    <WordName />
                </span>
            </Link>
        );
    }

    return (
        <Link to={to || '/'} className={`headerV2-logo ${className}`} title={title} aria-label={brand.name}>
            <span className="brandLogoLockup">
                <BrandMark className="brandLogo brandLogo--header" alt="" />
                <WordName />
            </span>
        </Link>
    );
}
