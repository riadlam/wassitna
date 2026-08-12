import { Link } from 'react-router-dom';
import {
    brand,
    footerCompany,
    footerPartners,
    footerServices,
    footerSupport,
} from '../brand';
import Logo from './Logo';

const year = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className="defaultFooter defaultFooter--">
            <div className="defaultFooter-container section-container">
                <div className="defaultFooter-nav defaultFooter-item">
                    <Link className="defaultFooter-title defaultFooter-title--expand" to="/transaction-types">
                        Categories
                    </Link>
                    <nav className="defaultFooter-links" aria-label="Categories">
                        {footerServices.map((link) => (
                            <Link key={link.label} className="defaultFooter-link" to={link.to}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="defaultFooter-nav defaultFooter-item">
                    <Link className="defaultFooter-title defaultFooter-title--expand" to="/help">
                        Help
                    </Link>
                    <nav className="defaultFooter-links" aria-label="Help">
                        {footerSupport.map((link) => (
                            <Link key={link.label} className="defaultFooter-link" to={link.to}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="defaultFooter-nav defaultFooter-item">
                    <Link className="defaultFooter-title defaultFooter-title--expand" to="/partners">
                        Partners
                    </Link>
                    <nav className="defaultFooter-links" aria-label="Partners">
                        {footerPartners.map((link) => (
                            <Link key={link.label} className="defaultFooter-link" to={link.to}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="defaultFooter-contact defaultFooter-item">
                    <nav className="defaultFooter-links" aria-label="Company">
                        <Link className="defaultFooter-title" to="/about">
                            Company
                        </Link>
                        {footerCompany.map((link) => (
                            <Link key={link.label} className="defaultFooter-link" to={link.to}>
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href={`tel:${brand.phone.replace(/\s+/g, '')}`}
                            className="defaultFooter-link defaultFooter-link--contact defaultFooter-contactLink"
                        >
                            <span className="defaultFooter-contactIcon">
                                <svg
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20.1 20"
                                    className="icon icon--phone"
                                    aria-hidden="true"
                                >
                                    <path d="M14.8,20c-0.5,0-1-0.1-1.5-0.3C7.2,17.6,2.3,12.6,0.3,6.5c-0.6-1.9,0-3.9,1.6-5.1l1-0.8C3.5,0.2,4.1,0,4.8,0 C6,0,7,0.7,7.6,1.7l1.7,3.2c0.2,0.3,0.2,0.7,0.2,1c0,0.5-0.2,1.1-0.6,1.5L8.6,7.8C8.2,8.2,8.2,8.7,8.4,9.2c0.6,1.1,1.5,2,2.6,2.6 c0.4,0.2,1,0.2,1.4-0.2l0.4-0.3c0.7-0.6,1.7-0.7,2.5-0.3l3.2,1.7c1,0.5,1.7,1.6,1.7,2.8c0,0.8-0.3,1.6-0.9,2.2l-1.1,1.1 C17.2,19.5,16,20,14.8,20z M4.8,1.9C4.5,1.9,4.3,2,4.1,2.1l-1,0.8c-0.9,0.7-1.3,1.9-0.9,3C3.9,11.5,8.4,16,13.9,18 c1,0.3,2.1,0.1,2.8-0.7l1.1-1.1c0.2-0.2,0.4-0.5,0.4-0.9c0-0.5-0.3-0.9-0.7-1.1l-3.2-1.7c-0.1-0.1-0.3,0-0.4,0l-0.4,0.3 c-0.9,0.9-2.4,1.1-3.5,0.5c-1.5-0.7-2.6-1.9-3.4-3.4C6.1,8.9,6.3,7.5,7.2,6.5l0.3-0.4c0,0,0.1-0.1,0.1-0.2c0,0,0-0.1,0-0.1L5.9,2.6 C5.7,2.1,5.3,1.9,4.8,1.9z" />
                                </svg>
                            </span>
                            {brand.phone}
                        </a>
                    </nav>
                </div>
            </div>

            <div className="defaultFooter-corporate section-container">
                <div className="defaultFooter-logo">
                    <Logo footer />
                </div>
                <nav className="defaultFooter-corporateNav" aria-label="Legal">
                    <Link className="defaultFooter-corporateLink" to="/legal/terms">
                        Terms
                    </Link>
                    <Link className="defaultFooter-corporateLink" to="/legal/privacy">
                        Privacy
                    </Link>
                    <Link className="defaultFooter-corporateLink" to="/licenses">
                        Legal & compliance
                    </Link>
                </nav>
                <div role="contentinfo">
                    <div className="defaultFooter-copyright">
                        © {year} {brand.domain}. Escrow service operating in {brand.country}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
