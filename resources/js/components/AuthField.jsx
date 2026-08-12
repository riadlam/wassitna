export default function AuthField({
    id,
    label,
    required = false,
    hint,
    link,
    error,
    children,
}) {
    return (
        <div className={`field${error ? ' is-invalid' : ''}`} data-field={id}>
            <label className="field-label" htmlFor={id}>
                <span>{label}</span>
                {required ? <span className="field-required">*</span> : null}
                {link || null}
            </label>
            <div className="field-input">{children}</div>
            {hint ? <div className="field-hint">{hint}</div> : null}
            {error ? (
                <div className="field-error">
                    <span className="field-errorMsg">{error}</span>
                </div>
            ) : null}
        </div>
    );
}
