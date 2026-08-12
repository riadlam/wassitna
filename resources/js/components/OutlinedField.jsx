import { useEffect, useId, useRef, useState } from 'react';

export default function OutlinedField({
    label,
    name,
    value,
    onChange,
    onBlur,
    error = false,
    helperText = '',
    type = 'text',
    select = false,
    options = [],
    prefix = '',
    multiline = false,
    autoFocus = false,
    autoComplete,
    placeholder,
}) {
    const id = useId();
    const rootRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const filled = value !== '' && value != null;
    const shrink = focused || filled || menuOpen || select || Boolean(prefix) || Boolean(placeholder);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        if (!menuOpen) return undefined;

        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setMenuOpen(false);
                setFocused(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                setFocused(false);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const controlClass = [
        'MuiFormControl-root MuiFormControl-marginNormal MuiFormControl-fullWidth MuiTextField-root',
        error ? 'is-error' : '',
        focused ? 'is-focused' : '',
        shrink ? 'is-shrink' : '',
        filled ? 'is-filled' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const inputClass = [
        'MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl',
        error ? 'Mui-error' : '',
        prefix ? 'MuiInputBase-adornedStart' : '',
        multiline ? 'MuiInputBase-multiline' : '',
        select ? 'MuiInputBase-select' : '',
        select && filled ? 'is-filled' : '',
        select && menuOpen ? 'is-open' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div ref={rootRef} className={`${controlClass}${select && menuOpen ? ' is-open' : ''}`}>
            <label
                className={`MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-outlined${
                    shrink ? ' MuiInputLabel-shrink' : ''
                }${error ? ' Mui-error' : ''}`}
                htmlFor={id}
            >
                {label}
            </label>
            <div className={inputClass}>
                {prefix ? <span className="MuiInputAdornment-root">{prefix}</span> : null}
                {select ? (
                    <>
                        <button
                            type="button"
                            id={id}
                            name={name}
                            className={`MuiSelect-select MuiInputBase-input MuiOutlinedInput-input${
                                filled ? ' is-filled' : ''
                            }`}
                            aria-haspopup="listbox"
                            aria-expanded={menuOpen}
                            onClick={() => {
                                setMenuOpen((open) => !open);
                                setFocused(true);
                            }}
                            onBlur={(event) => {
                                if (rootRef.current?.contains(event.relatedTarget)) return;
                                setFocused(false);
                                onBlur?.(event);
                            }}
                        >
                            {selectedOption?.label || ''}
                        </button>
                        <svg
                            className={`MuiSvgIcon-root MuiSelect-icon${menuOpen ? ' is-open' : ''}`}
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                        >
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                        {menuOpen ? (
                            <ul className="MuiMenu-list" role="listbox">
                                {options
                                    .filter((option) => option.value !== '')
                                    .map((option) => (
                                        <li key={option.value} role="none">
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={value === option.value}
                                                className={
                                                    value === option.value
                                                        ? 'MuiMenuItem-root is-selected'
                                                        : 'MuiMenuItem-root'
                                                }
                                                onClick={() => {
                                                    onChange?.({ target: { name, value: option.value } });
                                                    setMenuOpen(false);
                                                    setFocused(false);
                                                }}
                                            >
                                                {option.label}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        ) : null}
                    </>
                ) : multiline ? (
                    <textarea
                        id={id}
                        name={name}
                        className="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMultiline"
                        value={value}
                        onChange={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={(event) => {
                            setFocused(false);
                            onBlur?.(event);
                        }}
                        rows={1}
                    />
                ) : (
                    <input
                        id={id}
                        name={name}
                        type={type}
                        className="MuiInputBase-input MuiOutlinedInput-input"
                        value={value}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        autoComplete={autoComplete}
                        onChange={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={(event) => {
                            setFocused(false);
                            onBlur?.(event);
                        }}
                    />
                )}
                <fieldset aria-hidden="true" className="MuiOutlinedInput-notchedOutline">
                    <legend className={shrink ? 'is-notched' : ''}>
                        <span>{label}</span>
                    </legend>
                </fieldset>
            </div>
            {helperText !== undefined ? (
                <p className={`MuiFormHelperText-root${error ? ' Mui-error' : ''}`}>{helperText}</p>
            ) : null}
        </div>
    );
}
