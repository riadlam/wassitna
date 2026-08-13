import { useNavigate } from 'react-router-dom';
import Logo, { LOGO_SRC } from './Logo';
import { brand } from '../brand';

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

                            <div className="headerV3-shield media--available@mobile">
                                <img src={LOGO_SRC} alt={brand.name} className="brandLogo brandLogo--mark" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
