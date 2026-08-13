import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { dismissIosKeyboard } from '../iosKeyboard';

export default function PhoneField({ value, onChange, error = false, helperText }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`phoneField${focused ? ' is-focused' : ''}${error ? ' is-error' : ''}`}>
            <label className="phoneField-label">Phone</label>
            <PhoneInput
                defaultCountry="dz"
                value={value}
                onChange={(phone) => onChange(phone)}
                placeholder="Phone number (optional)"
                preferredCountries={['dz', 'us', 'gb', 'fr', 'ae', 'sa', 'ma', 'tn', 'eg']}
                inputProps={{
                    name: 'phone',
                    autoComplete: 'tel',
                    enterKeyHint: 'done',
                    inputMode: 'tel',
                    'aria-invalid': error || undefined,
                    onFocus: () => setFocused(true),
                    onBlur: () => setFocused(false),
                    onKeyDown: (event) => {
                        if (event.key !== 'Enter') return;
                        event.preventDefault();
                        dismissIosKeyboard();
                    },
                }}
            />
            {helperText ? (
                <p className={`MuiFormHelperText-root${error ? ' Mui-error' : ''}`}>{helperText}</p>
            ) : null}
        </div>
    );
}
