import { flattenErrors } from '../api';

export default function AuthAlert({ error, title = 'We could not continue' }) {
    if (!error) return null;

    const items = flattenErrors(error.errors);
    const message =
        items.length === 0
            ? error.message || title
            : items.length === 1
              ? items[0].message
              : 'Please review the highlighted fields and try again.';

    return (
        <div className="authAlert" role="alert">
            <div className="authAlert-title">{title}</div>
            <p className="authAlert-message">{message}</p>
            {items.length > 1 ? (
                <ul className="authAlert-list">
                    {items.map((item) => (
                        <li key={`${item.field}-${item.message}`}>{item.message}</li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
