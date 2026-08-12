import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const backIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 32 32" aria-hidden="true">
        <mask id="headerV3-back" width="11" height="17" x="9" y="7" maskUnits="userSpaceOnUse">
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="m19.41 9.29-5.863 6.12 5.862 6.12-1.805 1.88-7.68-8 7.68-8 1.805 1.88Z"
                clipRule="evenodd"
            />
        </mask>
        <g mask="url(#headerV3-back)">
            <path fill="currentColor" d="M0 0h24v24H0z" />
        </g>
    </svg>
);

const mobileShield = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" aria-hidden="true">
        <path
            d="M8.25 12.9c-.8 0-1.5-.7-1.5-1.55 0-.8.65-1.55 1.5-1.55h3.95V8.65h-4c-1.5 0-2.65 1.2-2.65 2.7s1.2 2.7 2.65 2.7h4V12.9z"
            className="logo-shield-inner"
            clipRule="evenodd"
        />
        <path
            d="M12.15 24h-.2l-.044-.014C11.133 23.743.511 20.41.85 4.15V3.9L2.4 1.7l.25-.05c.2-.05 9.45-1.5 9.45-1.5s9.3 1.45 9.5 1.5l.25.05 1.55 2.2v.25c.2 8.7-2.8 13.65-5.35 16.25-2.75 2.8-5.65 3.6-5.9 3.6M2.4 4.4c-.2 14.3 8.3 17.6 9.75 18.05C13.6 22 22.1 18.75 21.9 4.4l-.95-1.35c-1.05-.3-5.15-1.3-8.8-1.35-3.51.096-7.389 1.024-8.616 1.318L3.4 3.05zm14.3 2H8.3v1.65h8.4zm-8.4 8.35h8.4v1.65H8.3zm8.4-4.15H8.3v1.65h8.4z"
            className="logo-shield-border"
            clipRule="evenodd"
        />
    </svg>
);

export default function HeaderV3Simplified() {
    const navigate = useNavigate();

    return (
        <div data-component="navigation-header" data-from-webapp="true" data-header="no_header" data-theme="light">
            <header className="headerV3 is-header-scrollTop" data-sticky-header="" data-header-type="simplified">
                <div className="headerV3-primary">
                    <div className="headerV3-container section-container">
                        <div className="headerV3-inner">
                            <button
                                type="button"
                                className="headerV3-menuBtn headerV3-returnUrl"
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        navigate(-1);
                                    } else {
                                        navigate('/transactions');
                                    }
                                }}
                            >
                                {backIcon}
                                <span>Back</span>
                            </button>

                            <Logo variant="headerV3" to="/transactions" className="headerV3-logo media--hidden@mobile" />

                            <div className="headerV3-shield media--available@mobile">{mobileShield}</div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
