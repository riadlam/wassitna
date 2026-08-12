import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HeaderV3Simplified from '../components/HeaderV3Simplified';
import OutlinedField from '../components/OutlinedField';
import PhoneField from '../components/PhoneField';
import { api, firstError } from '../api';
import { applyFeePayer, calculateEscrowFee, feeScheduleCopy, formatMoney } from '../fees';
import useCategories, { categoryLabel } from '../hooks/useCategories';

const roles = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'broker', label: 'Broker' },
];

const currencies = [
    { value: 'dzd', label: 'DZD', symbol: 'DA ' },
    { value: 'usd', label: 'USD', symbol: '$' },
    { value: 'eur', label: 'EUR', symbol: '€' },
    { value: 'gbp', label: 'GBP', symbol: '£' },
];

const feePayers = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
    { value: 'split', label: '50 / 50' },
];


const warningIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="icon icon--warning"
        width="22.5"
        height="20"
        viewBox="0 0 22.5 20"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.6,20H1.9c-1,0-1.9-0.8-1.9-1.9c0-0.3,0.1-0.7,0.2-0.9L9.6,0.9  C9.9,0.4,10.6,0,11.2,0s1.3,0.4,1.6,0.9l9.4,16.2c0.2,0.3,0.2,0.6,0.2,0.9C22.5,19.2,21.7,20,20.6,20z M11.3,1.9L11.3,1.9L11.3,1.9  L1.9,18.1l18.8,0L11.3,1.9z M11.2,13.7c0.7,0,1.2,0.6,1.2,1.2s-0.6,1.2-1.2,1.2S10,15.7,10,15S10.6,13.7,11.2,13.7z M11.9,12  c0,0.3-0.3,0.5-0.6,0.5s-0.6-0.2-0.6-0.5L10,8.3c0-0.1,0-0.1,0-0.2c0-0.7,0.6-1.2,1.2-1.2s1.2,0.6,1.2,1.2c0,0.1,0,0.1,0,0.2  L11.9,12z"
        />
    </svg>
);

const checkboxBlank = (
    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </svg>
);

const checkboxChecked = (
    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
);

function mapIncomingRole(role) {
    if (role === 'buying' || role === 'buyer') return 'buyer';
    if (role === 'brokering' || role === 'broker') return 'broker';
    return 'seller';
}

function money(amount, symbol, currencyLabel) {
    if (currencyLabel === 'DZD' || symbol.includes('DA')) {
        return formatMoney(amount, 'DZD');
    }
    return `${symbol}${Number(amount).toFixed(2)}`;
}

export default function StartTransaction() {
    const location = useLocation();
    const navigate = useNavigate();
    const incoming = location.state || {};
    const { categories } = useCategories();

    const [title, setTitle] = useState(incoming.what || '');
    const [role, setRole] = useState(mapIncomingRole(incoming.role));
    const [currency, setCurrency] = useState((incoming.currency || 'DZD').toLowerCase());
    const [inspectionPeriod, setInspectionPeriod] = useState('1');
    const [category, setCategory] = useState(incoming.category || '');
    const [itemName, setItemName] = useState(incoming.what || '');
    const [price, setPrice] = useState(incoming.price ? Number(incoming.price).toFixed(2) : '0.00');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState([]);
    const [titleTouched, setTitleTouched] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [feePayer, setFeePayer] = useState('buyer');
    const [showFeeHelp, setShowFeeHelp] = useState(false);
    const [partyEmail, setPartyEmail] = useState('');
    const [partyPhone, setPartyPhone] = useState('+213');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const currencyMeta = currencies.find((item) => item.value === currency) || currencies[0];
    const titleError = titleTouched && !title.trim();
    const canAddItem = Boolean(category && itemName.trim() && Number(price) > 0);
    const hasItems = items.length > 0;
    const days = Math.max(1, Number(inspectionPeriod) || 1);
    const inspectionLabel = `${days} Day${days === 1 ? '' : 's'}`;
    const subtotal = items.reduce((sum, item) => sum + Number(item.price), 0);
    const feeInfo = calculateEscrowFee(subtotal);
    const summary = applyFeePayer(feeInfo.cappedAmount, feeInfo.fee, feePayer);
    const counterparty = role === 'seller' ? 'Buyer' : 'Seller';
    const canSubmit =
        hasItems &&
        title.trim() &&
        agreeTerms &&
        (role === 'broker' ? partyEmail.includes('@') && buyerEmail.includes('@') : partyEmail.includes('@'));

    const categoryOptions = useMemo(
        () => categories.map((item) => ({ value: item.slug, label: item.name })),
        [categories],
    );

    function formatAmount(value) {
        return money(value, currencyMeta.symbol, currencyMeta.label);
    }

    function addItem() {
        if (!canAddItem) return;
        setItems((current) => [
            ...current,
            {
                category,
                name: itemName.trim(),
                price: Number(calculateEscrowFee(price).cappedAmount || price).toFixed(2),
                description: description.trim(),
            },
        ]);
        setCategory('');
        setItemName('');
        setPrice('0.00');
        setDescription('');
        setTitleTouched(true);
    }

    function editItem(index) {
        const item = items[index];
        if (!item) return;
        setCategory(item.category);
        setItemName(item.name);
        setPrice(item.price);
        setDescription(item.description || '');
        setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (!canSubmit || submitting) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const created = await api('/api/transactions', {
                method: 'POST',
                body: {
                    title: title.trim(),
                    role,
                    currency: currencyMeta.label,
                    inspection_period_days: days,
                    fee_payer: feePayer,
                    terms_accepted: true,
                    party_email: partyEmail.trim(),
                    party_phone: partyPhone,
                    buyer_email: role === 'broker' ? buyerEmail.trim() : undefined,
                    items: items.map((item) => ({
                        category: item.category,
                        name: item.name,
                        description: item.description || null,
                        price: Number(item.price),
                        quantity: 1,
                    })),
                },
            });
            const ulid = created?.data?.ulid || created?.data?.id;
            navigate(ulid ? `/transaction/${ulid}` : '/transactions');
        } catch (error) {
            if (error.status === 401) {
                navigate('/login', { replace: true, state: { from: '/transactions/start' } });
                return;
            }
            setSubmitError(firstError(error.errors, error.message || 'Could not create transaction.'));
            setSubmitting(false);
        }
    }

    return (
        <section className="content startTransactionPage">
            <HeaderV3Simplified />
            <main>
                <div data-container="spa" id="spa">
                    <div className="announcement announcement--warning announcement--icon headerV3-announcement--warning">
                        <div className="announcement-container">
                            <div className="announcement-content">
                                <span className="announcement-icon">
                                    <div>{warningIcon}</div>
                                </span>
                                <span className="announcement-title">Please verify your email address</span>
                                <div className="announcement-extra">
                                    <span>
                                        Verify your email address to confirm that this account belongs to you. Haven&apos;t
                                        received a verification email?{' '}
                                    </span>
                                    <a
                                        role="button"
                                        tabIndex={0}
                                        className="headerV3-announcement-link"
                                        onClick={() => setEmailSent(true)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setEmailSent(true);
                                            }
                                        }}
                                    >
                                        {emailSent ? 'Verification email sent' : 'Send verification email'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="createTransaction section--mid">
                        <div className="section-container section--small createTransaction-form--container">
                            <form
                                name="StartTransactionV3"
                                data-tracking-section="StartTransactionV3"
                                onSubmit={onSubmit}
                            >
                                <div>
                                    <div className="createTransaction-title">Start Transaction</div>
                                    <hr className="MuiDivider-root MuiDivider-fullWidth" />

                                    <OutlinedField
                                        label="Transaction title"
                                        name="title"
                                        value={title}
                                        error={titleError}
                                        helperText={titleError ? 'Required' : undefined}
                                        onChange={(event) => setTitle(event.target.value)}
                                        onBlur={() => setTitleTouched(true)}
                                    />

                                    <div className="createTransaction-inline-fields-container">
                                        <div className="createTransaction-inline-field--narrow">
                                            <OutlinedField
                                                label="My role"
                                                name="role"
                                                select
                                                options={roles}
                                                value={role}
                                                onChange={(event) => setRole(event.target.value)}
                                            />
                                        </div>
                                        <div className="createTransaction-inline-field--narrow">
                                            <OutlinedField
                                                label="Currency"
                                                name="currency"
                                                select
                                                options={currencies}
                                                value={currency}
                                                onChange={(event) => setCurrency(event.target.value)}
                                            />
                                        </div>
                                        <div className="createTransaction-inline-field--narrow">
                                            <OutlinedField
                                                label="Inspection period (days)"
                                                name="inspectionPeriod"
                                                type="number"
                                                value={inspectionPeriod}
                                                helperText=""
                                                onChange={(event) => setInspectionPeriod(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="createTransaction-subform--header"> Transaction details </div>
                                    {hasItems
                                        ? items.map((item, index) => (
                                              <div
                                                  key={`${item.name}-${index}`}
                                                  className="materialUI-box-border materialUI-box-container"
                                                  data-e2e-name="item-edit-box"
                                                  data-e2e-label={`Item ${index + 1}`}
                                              >
                                                  <div className="materialUI-border">
                                                      <button
                                                          type="button"
                                                          className="materialUI-box-edit-backdrop"
                                                          onClick={() => editItem(index)}
                                                      >
                                                          <svg
                                                              className="materialUI-box-edit-icon"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 24 24"
                                                              width="32"
                                                              height="32"
                                                              aria-hidden="true"
                                                          >
                                                              <path
                                                                  fill="currentColor"
                                                                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                                                              />
                                                          </svg>
                                                          <span className="materialUI-box-edit-text">Edit</span>
                                                      </button>
                                                      <div className="materialUI-box-content">
                                                          <div className="content-header">
                                                              <div className="content-title">{title || item.name}</div>
                                                              <div className="createTransaction-fee-amount">
                                                                  {formatAmount(item.price)}
                                                              </div>
                                                          </div>
                                                          <div className="materialUI-box-content-italic">
                                                              {categoryLabel(categories, item.category)}
                                                          </div>
                                                          <div>{item.name}</div>
                                                          {item.description ? (
                                                              <div className="materialUI-box-content-description">
                                                                  {item.description}
                                                              </div>
                                                          ) : null}
                                                          <div>Inspection Period: {inspectionLabel}</div>
                                                      </div>
                                                  </div>
                                              </div>
                                          ))
                                        : null}

                                    {!hasItems ? (
                                        <div>
                                            <OutlinedField
                                                label="Item category"
                                                name="category"
                                                select
                                                value={category}
                                                options={[{ value: '', label: 'Electronics, services...' }, ...categoryOptions]}
                                                onChange={(event) => setCategory(event.target.value)}
                                            />

                                            <div className="createTransaction-inline-fields-container">
                                                <div className="createTransaction-inline-field--half">
                                                    <OutlinedField
                                                        label="Item name"
                                                        name="items[0].name"
                                                        value={itemName}
                                                        autoFocus
                                                        onChange={(event) => setItemName(event.target.value)}
                                                    />
                                                </div>
                                                <div className="createTransaction-inline-field--half">
                                                    <OutlinedField
                                                        label={`Price (${currencyMeta.label})`}
                                                        name="items[0].price"
                                                        type="number"
                                                        prefix={currencyMeta.symbol}
                                                        value={price}
                                                        onChange={(event) => setPrice(event.target.value)}
                                                        onBlur={() => {
                                                            const next = Number(price);
                                                            setPrice(Number.isFinite(next) ? next.toFixed(2) : '0.00');
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <OutlinedField
                                                label="Item description"
                                                name="items[0].description"
                                                multiline
                                                value={description}
                                                onChange={(event) => setDescription(event.target.value)}
                                            />

                                            <div className="createTransaction-button-container-right">
                                                <button
                                                    className="MuiButtonBase-root MuiButton-root createTransaction-button-right MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge"
                                                    type="button"
                                                    disabled={!canAddItem}
                                                    onClick={addItem}
                                                >
                                                    Add item
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {hasItems ? (
                                    <>
                                        <div>
                                            <div className="createTransaction-summary-header">
                                                <div className="createTransaction-subform--header"> Transaction summary </div>
                                                <a
                                                    role="button"
                                                    tabIndex={0}
                                                    className="createTransaction-summary-header-anchor"
                                                    onClick={() => setShowFeeHelp(true)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter' || event.key === ' ') {
                                                            event.preventDefault();
                                                            setShowFeeHelp(true);
                                                        }
                                                    }}
                                                >
                                                    <span>How are the totals calculated?</span>
                                                </a>
                                            </div>
                                            <div className="createTransaction-fee-container">
                                                <div className="createTransaction-fee">
                                                    <div className="createTransaction-fee-text">
                                                        <span>Subtotal</span>:
                                                    </div>
                                                    <div className="createTransaction-fee-text createTransaction-fee-amount">
                                                        <span>{formatAmount(feeInfo.cappedAmount)}</span>
                                                    </div>
                                                </div>
                                                <div className="createTransaction-fee">
                                                    <div className="createTransaction-fee-text">
                                                        <div className="createTransaction-check-inline">
                                                            <div className="createTransaction-check-inline">
                                                                Escrow fee paid by:{' '}
                                                            </div>
                                                            <div className="createTransaction-check-inline">
                                                                <div className="MuiInputBase-root MuiInput-root MuiInputBase-colorPrimary feePayerSelect">
                                                                    <select
                                                                        name="escrowFeePayer"
                                                                        id="mui-component-select-escrowFeePayer"
                                                                        className="MuiSelect-select MuiSelect-standard MuiInputBase-input MuiInput-input"
                                                                        value={feePayer}
                                                                        onChange={(event) => setFeePayer(event.target.value)}
                                                                    >
                                                                        {feePayers.map((option) => (
                                                                            <option key={option.value} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    <svg
                                                                        className="MuiSvgIcon-root MuiSelect-icon MuiSelect-iconStandard"
                                                                        focusable="false"
                                                                        aria-hidden="true"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path d="M7 10l5 5 5-5z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="createTransaction-fee-text createTransaction-fee-amount">
                                                        <span>{formatAmount(summary.fee)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="MuiDivider-root MuiDivider-fullWidth" />
                                            <div className="createTransaction-fee">
                                                <div className="createTransaction-fee-text">
                                                    <span>Buyer price</span>:
                                                </div>
                                                <div className="createTransaction-fee-text createTransaction-fee-amount">
                                                    <span>{formatAmount(summary.buyerPrice)}</span>
                                                </div>
                                            </div>
                                            <div className="createTransaction-fee">
                                                <div className="createTransaction-fee-text">
                                                    <span>Seller proceeds</span>:
                                                </div>
                                                <div className="createTransaction-fee-text createTransaction-fee-amount">
                                                    <span>{formatAmount(summary.sellerProceeds)}</span>
                                                </div>
                                            </div>
                                            <div className="materialUI-box-content-italic createTransaction-fee-total-description">
                                                All prices are in {currencyMeta.label}. Taxes may apply.
                                            </div>
                                        </div>

                                        <div className="createTransaction-check-container">
                                            {role === 'broker' ? (
                                                <>
                                                    <div className="createTransaction-subform--header">Buyer details</div>
                                                    <div className="createTransaction-inline-fields-container">
                                                        <div className="createTransaction-inline-field--half">
                                                            <OutlinedField
                                                                label="Email"
                                                                name="buyerEmail"
                                                                value={buyerEmail}
                                                                onChange={(event) => setBuyerEmail(event.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="createTransaction-subform--header">Seller details</div>
                                                </>
                                            ) : (
                                                <div className="createTransaction-subform--header">{counterparty} details</div>
                                            )}
                                            <div className="createTransaction-inline-fields-container">
                                                <div className="createTransaction-inline-field--half">
                                                    <OutlinedField
                                                        label="Email"
                                                        name={role === 'seller' ? 'buyerEmail' : 'sellerEmail'}
                                                        value={partyEmail}
                                                        onChange={(event) => setPartyEmail(event.target.value)}
                                                    />
                                                </div>
                                                <div className="createTransaction-inline-field--half">
                                                    <PhoneField value={partyPhone} onChange={setPartyPhone} />
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="MuiDivider-root MuiDivider-fullWidth" />
                                        <div className="createTransaction-check-container createTransaction-check-row-header">
                                            <label className="MuiFormControlLabel-root createTransaction-checkbox-label MuiFormControlLabel-labelPlacementEnd">
                                                <span
                                                    className={`MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary${
                                                        agreeTerms ? ' Mui-checked' : ''
                                                    }`}
                                                >
                                                    <input
                                                        className="PrivateSwitchBase-input"
                                                        name="agreeTermsConditions"
                                                        type="checkbox"
                                                        checked={agreeTerms}
                                                        onChange={(event) => setAgreeTerms(event.target.checked)}
                                                    />
                                                    {agreeTerms ? checkboxChecked : checkboxBlank}
                                                </span>
                                                <span className="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label">
                                                    <span className="createTransaction-default-text">
                                                        I have read and agree to the{' '}
                                                        <Link to="/legal/terms" target="_blank">
                                                            General Escrow Instructions
                                                        </Link>{' '}
                                                        and{' '}
                                                        <Link to="/legal/privacy" target="_blank">
                                                            Privacy Policy
                                                        </Link>
                                                        .
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                        <div className="createTransaction-submit">
                                            {submitError ? (
                                                <div className="materialUI-box-content" role="alert" style={{ color: '#b42318', marginBottom: 12 }}>
                                                    {submitError}
                                                </div>
                                            ) : null}
                                            <button
                                                disabled={!canSubmit || submitting}
                                                className="createTransaction-submit-button createTransaction-submit-button--fullWidth"
                                                type="submit"
                                            >
                                                <div
                                                    className={`createTransaction-submit-text${!canSubmit ? ' disabled' : ''}`}
                                                >
                                                    Start transaction
                                                </div>
                                                <div className="createTransaction-submit-spinner-wrapper" />
                                            </button>
                                        </div>
                                    </>
                                ) : null}
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {showFeeHelp ? (
                <div className="createTransaction-fee-modal-backdrop" onClick={() => setShowFeeHelp(false)}>
                    <div
                        className="createTransaction-fee-modal"
                        role="dialog"
                        aria-labelledby="fee-help-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="createTransaction-fee-modal-title" id="fee-help-title">
                            How are the totals calculated?
                        </div>
                        <div className="createTransaction-fee-modal-subtitle">Wassitna fee ({feeInfo.rateLabel})</div>
                        <div className="createTransaction-fee-modal-description">
                            <ul className="feeHelp-list">
                                {feeScheduleCopy.map((row) => (
                                    <li key={row.range}>
                                        <span>{row.range}</span>
                                        <strong>{row.rate}</strong>
                                    </li>
                                ))}
                            </ul>
                            Who pays the fee changes the buyer price and seller proceeds.
                        </div>
                        <div className="createTransaction-fee-modal-button">
                            <button type="button" className="btn btn--secondary" onClick={() => setShowFeeHelp(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
