import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';


export default function PhoneField({ value, onChange }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`phoneField${focused ? ' is-focused' : ''}`}>
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
                    onFocus: () => setFocused(true),
                    onBlur: () => setFocused(false),
                }}
            />
        </div>
    );
}
