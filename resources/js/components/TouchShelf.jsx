import { Link, useNavigate } from 'react-router-dom';
import { touchShelfLinks } from '../brand';
import { useAuth } from '../context/AuthContext';

export default function TouchShelf({ open = false, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <div
            className={`touchShelf${open ? ' is-visible' : ''}`}
            data-component="touchShelf"
            data-target="modal-touchShelf"
            tabIndex={0}
            aria-hidden={!open}
        >
            <div className="touchShelf-closeContainer" onClick={onClose} role="button" tabIndex={0} aria-label="Close menu">
                <svg
                    version="1.1"
                    className="icon icon--close"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M10,8l8-8l2,2l-8,8l8,8l-2,2l-8-8l-8,8l-2-2l8-8L0,2l2-2L10,8z" />
                </svg>
            </div>
            <div className="touchShelf-container">
                <div className="touchShelf-containerInner">
                    <div className="touchShelf-user">
                        {user ? (
                            <div>
                                <p className="touchShelf-link" style={{ marginBottom: 12 }}>
                                    {user.email}
                                    <span className="touchShelf-linkRubric">{user.phone}</span>
                                </p>
                                <button
                                    type="button"
                                    className="btn btn--primary touchShelf-logIn"
                                    onClick={async () => {
                                        await logout();
                                        onClose();
                                        navigate('/');
                                    }}
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div data-target="loggedout-section">
                                <Link to="/signup" className="btn btn--primary touchShelf-signUp" onClick={onClose}>
                                    Register
                                </Link>
                                <Link to="/login" className="btn btn--primary touchShelf-logIn" onClick={onClose}>
                                    Log in
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="touchShelf-search" data-target="menu-search-container">
                        <form
                            className="touchShelf-searchForm search search--large defaultForm--inline"
                            role="search"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="search-container">
                                <svg
                                    className="icon icon--search search-icon icon--small"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 19.8 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M19.4,19.6c-0.5,0.5-1.3,0.5-1.7,0l-4.1-4.1c-1.4,1-3.1,1.6-5,1.6
    C3.9,17.1,0,13.3,0,8.6S3.9,0,8.6,0c4.7,0,8.6,3.8,8.6,8.6c0,2-0.7,3.8-1.8,5.3l4.1,4.1C19.9,18.4,19.9,19.2,19.4,19.6z M8.6,2.1
    C5,2.1,2.2,5,2.2,8.6C2.2,12.1,5,15,8.6,15c1.5,0,2.9-0.5,4-1.4c0.1-0.1,0.1-0.3,0.3-0.4c0.1-0.1,0.3-0.2,0.4-0.3
    c1-1.1,1.7-2.6,1.7-4.3C15,5,12.1,2.1,8.6,2.1z"
                                    />
                                </svg>
                                <div className="field field--large" data-field="touchShelf-search">
                                    <label className="field-label" htmlFor="field-touchShelf-search">
                                        <span>search</span>
                                    </label>
                                    <div className="field-input">
                                        <input
                                            type="search"
                                            className="defaultInput touchShelf-search"
                                            id="field-touchShelf-search"
                                            name="touchShelf-search"
                                            placeholder="What are you looking for?"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <nav className="touchShelf-nav" aria-label="main navigation">
                        {touchShelfLinks.map((link) => (
                            <Link key={link.label} to={link.to} className="touchShelf-link" onClick={onClose}>
                                {link.label}
                                <span className="touchShelf-linkRubric">{link.rubric}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
