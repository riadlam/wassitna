import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HeaderV3Simplified from '../components/HeaderV3Simplified';
import OutlinedField from '../components/OutlinedField';
import PhoneField from '../components/PhoneField';
import { api, firstError } from '../api';
import { applyFeePayer, calculateEscrowFee, feeScheduleCopy, formatMoney } from '../fees';
import useCategories, { categoryLabel } from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';
import { clearStartTxDraft, readStartTxDraft } from '../startTxDraft';
import IosKeyboardDoneBar from '../components/IosKeyboardDoneBar';
import { dismissIosKeyboard } from '../iosKeyboard';

const roles = [
    { value: 'buyer', label: 'Buyer' },
    { value: 'seller', label: 'Seller' },
];

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
    return 'seller';
}

function mergeIncoming(locationState) {
    const draft = readStartTxDraft();
    return { ...draft, ...(locationState || {}) };
}

function emailsMatch(a, b) {
    return (
        String(a || '')
            .trim()
            .toLowerCase() ===
        String(b || '')
            .trim()
            .toLowerCase()
    );
}

function phoneDigits(phone) {
    return String(phone || '').replace(/\D+/g, '');
}

function phonesMatch(a, b) {
    const left = phoneDigits(a);
    const right = phoneDigits(b);
    if (!left || !right || left.length < 8 || right.length < 8) return false;
    return left === right || left.endsWith(right) || right.endsWith(left);
}

function dismissKeyboardOnDone(event) {
    if (event.key !== 'Enter') return;
    const tag = String(event.target?.tagName || '').toUpperCase();
    if (tag === 'TEXTAREA' || tag === 'BUTTON') return;
    event.preventDefault();
    dismissIosKeyboard();
}

export default function StartTransaction() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const incoming = mergeIncoming(location.state);
    const { categories } = useCategories();

    const [title, setTitle] = useState(incoming.what || '');
    const [role, setRole] = useState(mapIncomingRole(incoming.role));
    const [inspectionPeriod, setInspectionPeriod] = useState('1');
    const [category, setCategory] = useState(incoming.category || '');
    const [itemName, setItemName] = useState(incoming.what || '');
    const [price, setPrice] = useState(incoming.price ? Number(incoming.price).toFixed(2) : '0.00');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState([]);
    const [titleTouched, setTitleTouched] = useState(false);
    const [showFeeHelp, setShowFeeHelp] = useState(false);
    const [partyEmail, setPartyEmail] = useState('');
    const [partyPhone, setPartyPhone] = useState('+213');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const feePayer = 'buyer';
    const titleError = titleTouched && !title.trim();
    const partyEmailSameAsUser = Boolean(user?.email && partyEmail.includes('@') && emailsMatch(partyEmail, user.email));
    const partyPhoneSameAsUser = Boolean(user?.phone && phonesMatch(partyPhone, user.phone));
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
        partyEmail.includes('@') &&
        !partyEmailSameAsUser &&
        !partyPhoneSameAsUser;

    const categoryOptions = useMemo(
        () => categories.map((item) => ({ value: item.slug, label: item.name })),
        [categories],
    );

    function formatAmount(value) {
        return formatMoney(value, 'DZD');
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
        if (partyEmailSameAsUser) {
            setSubmitError('Use a different email — you cannot invite yourself.');
            return;
        }
        if (partyPhoneSameAsUser) {
            setSubmitError('Use a different phone number — you cannot invite yourself.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const created = await api('/api/transactions', {
                method: 'POST',
                body: {
                    title: title.trim(),
                    role,
                    currency: 'DZD',
                    inspection_period_days: days,
                    fee_payer: 'buyer',
                    terms_accepted: true,
                    party_email: partyEmail.trim(),
                    party_phone: partyPhone,
                    items: items.map((item) => ({
                        category: item.category,
                        name: item.name,
                        description: item.description || null,
                        price: Number(item.price),
                        quantity: 1,
                    })),
                },
            });
            clearStartTxDraft();
            const ulid = created?.data?.ulid || created?.data?.id;
            navigate(ulid ? `/transaction/${ulid}` : '/transactions', { replace: true });
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
            <IosKeyboardDoneBar />
            <main>
                <div data-container="spa" id="spa">
                    <div className="createTransaction section--mid">
                        <div className="section-container section--small createTransaction-form--container">
                            <form
                                name="StartTransactionV3"
                                data-tracking-section="StartTransactionV3"
                                onSubmit={onSubmit}
                                onKeyDown={dismissKeyboardOnDone}
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
                                        enterKeyHint="done"
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
                                                label="Inspection period (days)"
                                                name="inspectionPeriod"
                                                type="text"
                                                inputMode="numeric"
                                                enterKeyHint="done"
                                                value={inspectionPeriod}
                                                helperText=""
                                                onChange={(event) =>
                                                    setInspectionPeriod(event.target.value.replace(/[^\d]/g, ''))
                                                }
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
                                                        enterKeyHint="done"
                                                        onChange={(event) => setItemName(event.target.value)}
                                                    />
                                                </div>
                                                <div className="createTransaction-inline-field--half">
                                                    <OutlinedField
                                                        label="Price (DA)"
                                                        name="items[0].price"
                                                        type="text"
                                                        inputMode="decimal"
                                                        enterKeyHint="done"
                                                        prefix="DA "
                                                        value={price}
                                                        onChange={(event) =>
                                                            setPrice(event.target.value.replace(/[^\d.]/g, ''))
                                                        }
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
                                                        <span>Escrow fee paid by Buyer</span>:
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
                                                All prices are in DA.
                                            </div>
                                        </div>

                                        <div className="createTransaction-check-container">
                                            <div className="createTransaction-subform--header">{counterparty} details</div>
                                            <div className="createTransaction-inline-fields-container">
                                                <div className="createTransaction-inline-field--half">
                                                    <OutlinedField
                                                        label="Email"
                                                        name={role === 'seller' ? 'buyerEmail' : 'sellerEmail'}
                                                        type="email"
                                                        autoComplete="email"
                                                        enterKeyHint="done"
                                                        value={partyEmail}
                                                        error={partyEmailSameAsUser}
                                                        helperText={
                                                            partyEmailSameAsUser
                                                                ? 'Use a different email — you cannot invite yourself.'
                                                                : undefined
                                                        }
                                                        onChange={(event) => setPartyEmail(event.target.value)}
                                                    />
                                                </div>
                                                <div className="createTransaction-inline-field--half">
                                                    <PhoneField
                                                        value={partyPhone}
                                                        onChange={setPartyPhone}
                                                        error={partyPhoneSameAsUser}
                                                        helperText={
                                                            partyPhoneSameAsUser
                                                                ? 'Use a different phone number — you cannot invite yourself.'
                                                                : undefined
                                                        }
                                                    />
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
                            The buyer pays the Wassitna fee. Buyer price includes the fee; seller proceeds are the item total.
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
