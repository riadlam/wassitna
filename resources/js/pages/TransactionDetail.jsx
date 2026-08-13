import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, clearToken, firstError } from '../api';
import HeaderV3Simplified from '../components/HeaderV3Simplified';
import { brand } from '../brand';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../fees';
import useCategories, { categoryLabel } from '../hooks/useCategories';
import CategoryDeliveryPanel from '../components/CategoryDeliveryPanel';
import ClosedPanel from '../components/ClosedPanel';
import InspectionPanel from '../components/InspectionPanel';
import { deliveryKind, deliveryStepLabel } from '../delivery';
import { faqPreview } from '../faq';

const copyIcon = (
    <svg className="txDetail-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
);

const docIcon = (
    <svg className="txDetail-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
    </svg>
);

const historyIcon = (
    <svg className="txDetail-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
);

const faqIcon = (
    <svg className="txDetail-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 23.59v-3.6c-5.01-.26-9-4.42-9-9.49C2 5.26 6.26 1 11.5 1S21 5.26 21 10.5c0 4.95-3.44 9.93-8.57 12.4l-1.43.69zM11.5 3C7.36 3 4 6.36 4 10.5S7.36 18 11.5 18H13v2.3c3.64-2.3 6-6.08 6-9.8C19 6.36 15.64 3 11.5 3zm-1 11.5h2v2h-2zm2-1.5h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z" />
    </svg>
);

const upsellIcon = (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
            d="M15.5833 15.5833C15.9653 15.5833 16.2899 15.4496 16.5573 15.1822C16.8246 14.9149 16.9583 14.5902 16.9583 14.2083C16.9583 13.8263 16.8246 13.5017 16.5573 13.2343C16.2899 12.967 15.9653 12.8333 15.5833 12.8333C15.2014 12.8333 14.8767 12.967 14.6094 13.2343C14.342 13.5017 14.2083 13.8263 14.2083 14.2083C14.2083 14.5902 14.342 14.9149 14.6094 15.1822C14.8767 15.4496 15.2014 15.5833 15.5833 15.5833ZM15.5833 18.3333C16.0628 18.3333 16.4997 18.224 16.894 18.0054C17.2883 17.7868 17.6106 17.4942 17.8609 17.1275C17.5189 16.923 17.1569 16.7673 16.775 16.6604C16.393 16.5534 15.9958 16.4999 15.5833 16.4999C15.1708 16.4999 14.7736 16.5534 14.3916 16.6604C14.0097 16.7673 13.6477 16.923 13.3057 17.1275C13.5561 17.4942 13.8784 17.7868 14.2727 18.0054C14.6669 18.224 15.1038 18.3333 15.5833 18.3333ZM11 19.6906C9.0174 19.15 7.37592 17.983 6.07555 16.1897C4.77518 14.3963 4.125 12.3914 4.125 10.1749V4.90061L11 2.3269L17.875 4.90061V10.0939C17.6611 10.0069 17.4366 9.92847 17.2016 9.85856C16.9665 9.78863 16.7327 9.73369 16.5 9.69372V5.85779L11 3.80411L5.49998 5.85779V10.1749C5.49998 10.987 5.61456 11.78 5.84373 12.5539C6.07289 13.3278 6.38874 14.0511 6.79126 14.7239C7.19377 15.3967 7.67473 16.0008 8.23414 16.5361C8.79355 17.0714 9.40055 17.4989 10.0551 17.8186L10.0816 17.8098C10.2026 18.1458 10.3595 18.4678 10.5523 18.7757C10.745 19.0836 10.9642 19.3633 11.2098 19.6148C11.171 19.6266 11.136 19.6392 11.1049 19.6527C11.0737 19.6662 11.0388 19.6789 11 19.6906ZM15.5833 19.7083C14.4387 19.7083 13.465 19.3069 12.6623 18.5043C11.8597 17.7016 11.4583 16.7279 11.4583 15.5833C11.4583 14.4386 11.8597 13.465 12.6623 12.6623C13.465 11.8596 14.4387 11.4583 15.5833 11.4583C16.728 11.4583 17.7016 11.8596 18.5043 12.6623C19.307 13.465 19.7083 14.4386 19.7083 15.5833C19.7083 16.7279 19.307 17.7016 18.5043 18.5043C17.7016 19.3069 16.728 19.7083 15.5833 19.7083Z"
            fill="#2F80ED"
        />
    </svg>
);

const faqs = faqPreview(3);

function partyByRole(parties, role) {
    return (parties || []).find((party) => party.role === role) || null;
}

function statusMeta(status) {
    switch (status) {
        case 'awaiting_payment':
            return { label: 'Awaiting Payment', tag: 'awaiting', step: 1 };
        case 'awaiting_delivery':
            return { label: 'Awaiting Delivery', tag: 'ongoing', step: 2 };
        case 'awaiting_inspection':
            return { label: 'Inspection', tag: 'ongoing', step: 3 };
        case 'completed':
            return { label: 'Completed', tag: 'completed', step: 4 };
        case 'cancelled':
            return { label: 'Cancelled', tag: 'cancelled', step: 0 };
        case 'disputed':
            return { label: 'Disputed', tag: 'disputed', step: 3 };
        case 'pending_acceptance':
        default:
            return { label: 'Awaiting Agreement', tag: 'awaiting', step: 0 };
    }
}

function formatHistoryDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    const stamped = date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Africa/Algiers',
    });
    return `${stamped} (Algeria)`;
}

function viewerContext(tx, user) {
    const buyer = partyByRole(tx?.parties, 'buyer');
    const seller = partyByRole(tx?.parties, 'seller');
    const myEmail = (user?.email || '').toLowerCase();
    const fromApi = tx?.viewer || {};
    const myRole =
        fromApi.role ||
        (myEmail && buyer?.email?.toLowerCase() === myEmail
            ? 'buyer'
            : myEmail && seller?.email?.toLowerCase() === myEmail
              ? 'seller'
              : tx?.creator_role === 'broker'
                ? 'broker'
                : tx?.creator_role || 'seller');
    const counterRole = myRole === 'buyer' ? 'seller' : myRole === 'seller' ? 'buyer' : 'buyer';
    const counterparty = partyByRole(tx?.parties, counterRole);
    const canAccept = Boolean(fromApi.can_accept);
    const canPay = Boolean(fromApi.can_pay);
    const isCreator = fromApi.is_creator ?? false;
    const inviteStatus = fromApi.invite_status || (canAccept ? 'pending' : 'accepted');
    const iAccepted = inviteStatus === 'accepted';
    const waitingOn = fromApi.waiting_on || counterRole;
    const waitingParty = waitingOn === 'buyer' ? buyer : waitingOn === 'seller' ? seller : counterparty;

    return {
        myRole,
        counterRole,
        counterparty,
        canAccept,
        canPay,
        isCreator,
        iAccepted,
        waitingOn,
        waitingParty,
        buyerAccepted: Boolean(fromApi.buyer_accepted),
        sellerAccepted: Boolean(fromApi.seller_accepted),
        showShare: Boolean(isCreator && tx?.status === 'pending_acceptance'),
    };
}

export default function TransactionDetail() {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const { categories } = useCategories();
    const [tx, setTx] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [forbidden, setForbidden] = useState(false);
    const [qrSrc, setQrSrc] = useState('');
    const [actionBusy, setActionBusy] = useState(false);
    const [actionError, setActionError] = useState('');
    const [payMethod, setPayMethod] = useState('cib_dahabia');
    const [payNote, setPayNote] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError('');
            setForbidden(false);

            try {
                const payload = await api(`/api/transactions/${encodeURIComponent(transactionId)}`);
                if (cancelled) return;
                const data = payload.data || payload;
                setTx(data);
                if (data.payment_method) setPayMethod(data.payment_method);
                if (data.status === 'completed') {
                    refreshUser?.().catch(() => {});
                }
            } catch (err) {
                if (cancelled) return;
                if (err.status === 401) {
                    clearToken();
                    navigate('/login', {
                        replace: true,
                        state: { from: `/transaction/${transactionId}` },
                    });
                    return;
                }
                if (err.status === 403) {
                    setForbidden(true);
                    setTx(null);
                    setError('This transaction is only available to the invited buyer or seller.');
                    return;
                }

                setTx(null);
                setError(firstError(err.errors, err.message || 'Could not load this transaction.'));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [transactionId, navigate]);

    const buyer = partyByRole(tx?.parties, 'buyer');
    const seller = partyByRole(tx?.parties, 'seller');
    const view = useMemo(() => (tx ? viewerContext(tx, user) : null), [tx, user]);
    const waitingOn = view?.waitingOn || view?.counterRole || 'buyer';
    const waitingParty = view?.waitingParty || view?.counterparty;
    const shareUrl = useMemo(() => {
        if (!tx?.ulid || typeof window === 'undefined') return '';
        return `${window.location.origin}/transaction/${tx.ulid}`;
    }, [tx?.ulid]);
    const shareMessage = useMemo(() => {
        if (!tx || !view) return '';
        const who = view.counterRole;
        return `You're invited to review this ${brand.name} escrow as the ${who}: "${tx.title}". Open: ${shareUrl}`;
    }, [tx, view, shareUrl]);

    useEffect(() => {
        let cancelled = false;
        if (!shareUrl || !view?.showShare) {
            setQrSrc('');
            return undefined;
        }

        QRCode.toDataURL(shareUrl, {
            width: 336,
            margin: 1,
            color: {
                dark: '#01426a',
                light: '#ffffff',
            },
            errorCorrectionLevel: 'M',
        })
            .then((url) => {
                if (!cancelled) setQrSrc(url);
            })
            .catch(() => {
                if (!cancelled) setQrSrc('');
            });

        return () => {
            cancelled = true;
        };
    }, [shareUrl, view?.showShare]);

    const meta = statusMeta(tx?.status);
    const primaryCategory = categoryLabel(categories, tx?.items?.[0]?.category) || 'item';
    const categorySlug =
        (tx?.items || []).find((item) => deliveryKind(item.category) === 'accounts')?.category ||
        tx?.items?.[0]?.category ||
        'other';
    const isDomain = categorySlug.includes('digital');
    const transferLabel = deliveryStepLabel(categorySlug);
    const steps = ['Agreement', 'Payment', transferLabel, 'Inspection', 'Closed'];
    const days = Number(tx?.inspection_period_days || 1);
    const dayLabel = days === 1 ? 'day' : 'days';

    const history = useMemo(() => {
        if (!tx) return [];
        const roleLabel = (tx.creator_role || 'seller').replace(/^./, (c) => c.toUpperCase());
        const entries = [
            {
                date: formatHistoryDate(tx.created_at),
                note: `${roleLabel} initiates the transaction`,
            },
        ];
        if (tx.status === 'awaiting_payment' || meta.step >= 1) {
            entries.push({
                date: formatHistoryDate(tx.updated_at),
                note: 'Both parties agreed to the terms',
            });
        }
        if (meta.step >= 2) {
            entries.push({
                date: formatHistoryDate(tx.updated_at),
                note: 'Buyer payment received. Seller can deliver.',
            });
        }
        if (meta.step >= 3) {
            entries.push({
                date: formatHistoryDate(tx.updated_at),
                note: 'Delivery confirmed. Inspection started.',
            });
        }
        if (tx.status === 'completed') {
            entries.push({
                date: formatHistoryDate(tx.updated_at),
                note: 'Buyer approved. Transaction closed.',
            });
        }
        if (tx.status === 'disputed') {
            entries.push({
                date: formatHistoryDate(tx.updated_at),
                note: 'Buyer reported an issue.',
            });
        }
        return entries;
    }, [tx, meta.step]);

    async function copyId() {
        try {
            await navigator.clipboard.writeText(tx.ulid);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    }

    async function copyShareLink() {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setLinkCopied(true);
            window.setTimeout(() => setLinkCopied(false), 1800);
        } catch {
            setLinkCopied(false);
        }
    }

    async function shareNative() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${brand.name} transaction`,
                    text: shareMessage,
                    url: shareUrl,
                });
                return;
            } catch {
                // user cancelled or share failed — fall through to copy
            }
        }
        copyShareLink();
    }

    function openShare(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    async function acceptTransaction() {
        if (!tx?.ulid || actionBusy) return;
        setActionBusy(true);
        setActionError('');
        try {
            const payload = await api(`/api/transactions/${encodeURIComponent(tx.ulid)}/accept`, {
                method: 'POST',
            });
            setTx(payload.data || payload);
        } catch (err) {
            if (err.status === 401) {
                clearToken();
                navigate('/login', { replace: true, state: { from: `/transaction/${tx.ulid}` } });
                return;
            }
            setActionError(firstError(err.errors, err.message || 'Could not confirm this transaction.'));
        } finally {
            setActionBusy(false);
        }
    }

    async function startPayment() {
        if (!tx?.ulid || actionBusy) return;
        setActionBusy(true);
        setActionError('');
        setPayNote('');
        try {
            const payload = await api(`/api/transactions/${encodeURIComponent(tx.ulid)}/pay`, {
                method: 'POST',
                body: { method: payMethod },
            });
            setTx(payload.data || payload);
            setPayNote(payload.payment?.message || 'Payment method saved.');
        } catch (err) {
            if (err.status === 401) {
                clearToken();
                navigate('/login', { replace: true, state: { from: `/transaction/${tx.ulid}` } });
                return;
            }
            setActionError(firstError(err.errors, err.message || 'Could not start payment.'));
        } finally {
            setActionBusy(false);
        }
    }

    if (loading) {
        return (
            <section className="content transactionDetailPage">
                <HeaderV3Simplified backTo="/transactions" />
                <main>
                    <div className="txDetail section--mid">
                        <div className="section-container section--small txDetail-grid" aria-busy="true" aria-label="Loading transaction">
                            <div className="txDetail-main">
                                <div className="txDetail-card txDetail-card--primary">
                                    <div className="txSkel txSkel--title" />
                                    <div className="txSkel txSkel--id" />
                                    <div className="txSkel txSkel--line" />
                                    <div className="txSkel txSkel--line txSkel--short" />
                                    <div className="txSkel-row">
                                        <div className="txSkel txSkel--chip" />
                                    </div>
                                    <div className="txSkel-steps">
                                        <div className="txSkel txSkel--step" />
                                        <div className="txSkel txSkel--step" />
                                        <div className="txSkel txSkel--step" />
                                        <div className="txSkel txSkel--step" />
                                        <div className="txSkel txSkel--step" />
                                    </div>
                                    <div className="txSkel txSkel--panel" />
                                </div>
                                <div className="txDetail-card">
                                    <div className="txSkel txSkel--label" />
                                    <div className="txSkel txSkel--line" />
                                    <div className="txSkel txSkel--line txSkel--mid" />
                                </div>
                            </div>
                            <aside className="txDetail-aside">
                                <div className="txDetail-card">
                                    <div className="txSkel txSkel--label" />
                                    <div className="txSkel txSkel--line txSkel--short" />
                                    <div className="txSkel txSkel--line txSkel--mid" />
                                </div>
                                <div className="txDetail-card">
                                    <div className="txSkel txSkel--label" />
                                    <div className="txSkel txSkel--line" />
                                    <div className="txSkel txSkel--line txSkel--short" />
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
            </section>
        );
    }

    if (!tx) {
        return (
            <section className="content transactionDetailPage">
                <HeaderV3Simplified backTo="/transactions" />
                <main>
                    <div className="txDetail-loading">
                        <p>
                            {forbidden
                                ? 'This link is only for the invited buyer or seller on this transaction.'
                                : error || 'Transaction not found.'}
                        </p>
                        <Link to="/transactions">Back to transactions</Link>
                    </div>
                </main>
            </section>
        );
    }

    return (
        <section className="content transactionDetailPage">
            <HeaderV3Simplified backTo="/transactions" />
            <main>
                <div data-container="spa" id="spa">
                    <div className="txDetail section--mid">
                        <div className="section-container section--small txDetail-grid">
                            <div className="txDetail-main">
                                {isDomain ? (
                                    <div className="txDetail-upsell" role="note">
                                        <div className="txDetail-upsell-icon">{upsellIcon}</div>
                                        <div>
                                            <p className="txDetail-upsell-title">
                                                The Concierge Service may be applied to this transaction
                                            </p>
                                            <p>
                                                {brand.name} may assist in the safe and secure transfer of the domain
                                                name.
                                            </p>
                                            <p>
                                                Contact{' '}
                                                <a href="mailto:concierge@wassitna.com">concierge@wassitna.com</a> to
                                                avail the <Link to="/transaction-types/domain-names">Concierge</Link>{' '}
                                                service.
                                            </p>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="txDetail-card txDetail-card--primary">
                                    <div className="txDetail-summary">
                                        <h1 className="txDetail-title">{tx.title}</h1>
                                        <div className="txDetail-idRow">
                                            <p>Transaction #{tx.ulid}</p>
                                            <button
                                                type="button"
                                                className="txDetail-copyBtn"
                                                aria-label="Copy Transaction Id"
                                                title={copied ? 'Copied' : 'Copy Transaction Id'}
                                                onClick={copyId}
                                            >
                                                {copyIcon}
                                            </button>
                                            {copied ? <span className="txDetail-copied">Copied</span> : null}
                                        </div>
                                        <p className="txDetail-blurb">
                                            <a href={`mailto:${buyer?.email || ''}`}>{buyer?.email || 'Buyer'}</a> is
                                            buying a <strong>{primaryCategory}</strong> from{' '}
                                            <a href={`mailto:${seller?.email || ''}`}>{seller?.email || 'Seller'}</a>.
                                            The <strong>inspection period</strong> for this transaction is{' '}
                                            <strong>
                                                {days} calendar {dayLabel}
                                            </strong>
                                            .
                                        </p>
                                    </div>

                                    <div className="transactions-tags-container">
                                        <span
                                            className={`transactions-tags-item transactions-tags-item--${meta.tag} transactions-tags-item--left`}
                                        >
                                            {meta.label}
                                        </span>
                                    </div>

                                    {tx.status === 'pending_acceptance' && view?.canAccept ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">Confirm as the buyer</p>
                                            <p className="txNextStep-text">
                                                Review the terms and confirm. Once you agree, payment (step 2) starts.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'pending_acceptance' && view?.myRole === 'seller' ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">Waiting for the buyer to agree</p>
                                            <p className="txNextStep-text">
                                               Payment unlocks after the buyer
                                                agrees
                                                {view?.waitingParty?.email || partyByRole(tx?.parties, 'buyer')?.email ? (
                                                    <>
                                                        {' '}
                                                        (
                                                        <a
                                                            href={`mailto:${
                                                                view?.waitingParty?.email ||
                                                                partyByRole(tx?.parties, 'buyer')?.email
                                                            }`}
                                                        >
                                                            {view?.waitingParty?.email ||
                                                                partyByRole(tx?.parties, 'buyer')?.email}
                                                        </a>
                                                        )
                                                    </>
                                                ) : null}
                                                .
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_payment' && view?.myRole === 'buyer' ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">Your turn to pay</p>
                                            <p className="txNextStep-text">
                                                Agreement is done. Fund the escrow so the seller can deliver.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_payment' && view?.myRole === 'seller' ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">Waiting for the buyer to pay</p>
                                            <p className="txNextStep-text">
                                                The buyer agreed. You deliver after they fund this deal.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_inspection' && view?.myRole === 'buyer' ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">Inspect and approve</p>
                                            <p className="txNextStep-text">
                                                Check what you received. You have {days} calendar {dayLabel}.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_inspection' && view?.myRole === 'seller' ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">Buyer is inspecting</p>
                                            <p className="txNextStep-text">
                                                Stay reachable. Funds release when the buyer approves.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_delivery' ? (
                                        <div className="txNextStep" role="status">
                                            <p className="txNextStep-title">
                                                {view?.myRole === 'seller'
                                                    ? `Payment received — complete ${transferLabel.toLowerCase()}`
                                                    : `Payment received — waiting on ${transferLabel.toLowerCase()}`}
                                            </p>
                                            <p className="txNextStep-text">
                                                {view?.myRole === 'seller'
                                                    ? 'Send it on chat or below, then confirm.'
                                                    : 'Waiting on the seller. Confirm once it arrives on chat.'}
                                            </p>
                                        </div>
                                    ) : null}

                                    <ol className="txDetail-stepper" aria-label="Transaction progress">
                                        {steps.map((label, index) => {
                                            const active = index === meta.step;
                                            const done = index < meta.step;
                                            return (
                                                <li
                                                    key={label}
                                                    className={`txDetail-step${active ? ' is-active' : ''}${
                                                        done ? ' is-done' : ''
                                                    }`}
                                                >
                                                    {index > 0 ? <span className="txDetail-step-line" aria-hidden="true" /> : null}
                                                    <div className="txDetail-step-icon" aria-hidden="true">
                                                        {index + 1}
                                                    </div>
                                                    <div className="txDetail-step-label">{label}</div>
                                                </li>
                                            );
                                        })}
                                    </ol>

                                    {view?.showShare ? (
                                        <div className="txSharePanel">
                                            <div className="txSharePanel-qrBlock">
                                                <div className="txShareQr">
                                                    <span className="txShareQr-finder txShareQr-finder--tl" />
                                                    <span className="txShareQr-finder txShareQr-finder--tr" />
                                                    <span className="txShareQr-finder txShareQr-finder--bl" />
                                                    <div className="txShareQr-frame">
                                                        {qrSrc ? (
                                                            <img
                                                                src={qrSrc}
                                                                alt="QR code linking to this transaction"
                                                                width={108}
                                                                height={108}
                                                                loading="lazy"
                                                            />
                                                        ) : null}
                                                        <div className="txShareQr-badge" aria-hidden="true">
                                                            W
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="txSharePanel-qrHint">Scan to open</p>
                                            </div>

                                            <div className="txSharePanel-copy">
                                                <p className="txSharePanel-kicker">Invite {view.counterRole}</p>
                                                <p className="txSharePanel-title">
                                                    Send this so the {view.counterRole} can agree
                                                </p>
                                                <p className="txSharePanel-text">
                                                    Share with{' '}
                                                    {view.counterparty?.email ? (
                                                        <a href={`mailto:${view.counterparty.email}`}>
                                                            {view.counterparty.email}
                                                        </a>
                                                    ) : (
                                                        <strong>the {view.counterRole}</strong>
                                                    )}
                                                    . They must log in with that email. Both of you must confirm
                                                    before payment.
                                                </p>

                                                <div className="txSharePanel-linkRow">
                                                    <input
                                                        className="txSharePanel-input"
                                                        type="text"
                                                        readOnly
                                                        value={shareUrl}
                                                        aria-label="Transaction share link"
                                                        onFocus={(event) => event.target.select()}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="txSharePanel-copyBtn"
                                                        onClick={copyShareLink}
                                                    >
                                                        {linkCopied ? 'Copied' : 'Copy'}
                                                    </button>
                                                </div>

                                                <div className="txSharePanel-social" aria-label="Share on social media">
                                                    <button
                                                        type="button"
                                                        className="txShareSocial txShareSocial--whatsapp"
                                                        onClick={() =>
                                                            openShare(
                                                                `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="txShareSocial-icon" aria-hidden="true">
                                                            WA
                                                        </span>
                                                        WhatsApp
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="txShareSocial txShareSocial--telegram"
                                                        onClick={() =>
                                                            openShare(
                                                                `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="txShareSocial-icon" aria-hidden="true">
                                                            TG
                                                        </span>
                                                        Telegram
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="txShareSocial txShareSocial--facebook"
                                                        onClick={() =>
                                                            openShare(
                                                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="txShareSocial-icon" aria-hidden="true">
                                                            f
                                                        </span>
                                                        Facebook
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="txShareSocial txShareSocial--mail"
                                                        onClick={() =>
                                                            openShare(
                                                                `mailto:${view.counterparty?.email || ''}?subject=${encodeURIComponent(`${brand.name} transaction invite`)}&body=${encodeURIComponent(shareMessage)}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="txShareSocial-icon" aria-hidden="true">
                                                            @
                                                        </span>
                                                        Email
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="txShareSocial txShareSocial--more"
                                                        onClick={shareNative}
                                                    >
                                                        <span className="txShareSocial-icon" aria-hidden="true">
                                                            ⋯
                                                        </span>
                                                        More
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {view?.canAccept ? (
                                        <div className="txActionPanel">
                                            <p className="txActionPanel-title">Confirm as buyer</p>
                                            <p className="txActionPanel-text">
                                                You agree to the price, inspection period, and to pay Wassitna before
                                                delivery. After you confirm, the deal moves to payment.
                                            </p>
                                            {actionError ? (
                                                <p className="txActionPanel-error" role="alert">
                                                    {actionError}
                                                </p>
                                            ) : null}
                                            <button
                                                type="button"
                                                className="txActionPanel-btn"
                                                onClick={acceptTransaction}
                                                disabled={actionBusy}
                                            >
                                                {actionBusy ? 'Confirming…' : 'Confirm agreement'}
                                            </button>
                                        </div>
                                    ) : null}

                                    {tx.status === 'pending_acceptance' && view?.myRole === 'seller' ? (
                                        <div className="txActionPanel txActionPanel--quiet">
                                            <p className="txActionPanel-title">Waiting on the buyer</p>
                                            <p className="txActionPanel-text">
                                                Sellers do not confirm the agreement. Step 2 (payment) starts when the
                                                buyer agrees.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_payment' && view?.canPay ? (
                                        <div className="txActionPanel">
                                            <p className="txActionPanel-title">Pay now</p>
                                            <p className="txActionPanel-text">
                                                Choose how you will fund this escrow. Amount due:{' '}
                                                <strong>{formatMoney(tx.buyer_total, tx.currency || 'DZD')}</strong>
                                            </p>
                                            <div className="txPayMethods" role="radiogroup" aria-label="Payment method">
                                                <label
                                                    className={`txPayMethod${payMethod === 'cib_dahabia' ? ' is-selected' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="pay-method"
                                                        value="cib_dahabia"
                                                        checked={payMethod === 'cib_dahabia'}
                                                        onChange={() => setPayMethod('cib_dahabia')}
                                                    />
                                                    <span>
                                                        <strong>CIB / Dahabia</strong>
                                                        <em>Pay by card through SATIM</em>
                                                    </span>
                                                </label>
                                                <label
                                                    className={`txPayMethod${payMethod === 'wire' ? ' is-selected' : ''}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="pay-method"
                                                        value="wire"
                                                        checked={payMethod === 'wire'}
                                                        onChange={() => setPayMethod('wire')}
                                                    />
                                                    <span>
                                                        <strong>Wire bank transfer</strong>
                                                        <em>Transfer from your bank account</em>
                                                    </span>
                                                </label>
                                            </div>
                                            {actionError ? (
                                                <p className="txActionPanel-error" role="alert">
                                                    {actionError}
                                                </p>
                                            ) : null}
                                            {payNote ? <p className="txActionPanel-note">{payNote}</p> : null}
                                            <button
                                                type="button"
                                                className="txActionPanel-btn"
                                                onClick={startPayment}
                                                disabled={actionBusy}
                                            >
                                                {actionBusy ? 'Recording payment…' : 'Pay now'}
                                            </button>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_payment' && !view?.canPay ? (
                                        <div className="txActionPanel txActionPanel--quiet">
                                            <p className="txActionPanel-title">
                                                {view?.myRole === 'seller'
                                                    ? 'Waiting for buyer payment'
                                                    : 'Waiting for payment'}
                                            </p>
                                            <p className="txActionPanel-text">
                                                {view?.myRole === 'seller'
                                                    ? 'The buyer funds the escrow next. You will deliver after payment is received.'
                                                    : 'Payment will show here once you can fund this deal.'}
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_delivery' && view?.myRole === 'broker' ? (
                                        <div className="txActionPanel txActionPanel--quiet">
                                            <p className="txActionPanel-title">Payment received</p>
                                            <p className="txActionPanel-text">
                                                The seller can now complete {transferLabel.toLowerCase()}. The buyer
                                                will review it during inspection.
                                            </p>
                                        </div>
                                    ) : null}

                                    {tx.status === 'awaiting_delivery' && view?.myRole && view.myRole !== 'broker' ? (
                                        <CategoryDeliveryPanel
                                            categorySlug={categorySlug}
                                            role={view.myRole}
                                            transactionId={tx.ulid}
                                            delivery={tx.delivery}
                                            onUpdate={setTx}
                                        />
                                    ) : null}

                                    {tx.status === 'awaiting_inspection' ? (
                                        <InspectionPanel
                                            categorySlug={categorySlug}
                                            role={view?.myRole}
                                            transactionId={tx.ulid}
                                            delivery={tx.delivery}
                                            days={days}
                                            dayLabel={dayLabel}
                                            onUpdate={setTx}
                                        />
                                    ) : null}

                                    {tx.status === 'completed' ? (
                                        <ClosedPanel
                                            isSeller={view?.myRole === 'seller'}
                                            transactionId={tx.ulid}
                                            sellerProceeds={tx.seller_proceeds}
                                            onSummary={() => {
                                                document.getElementById('tx-summary')?.scrollIntoView({
                                                    behavior: 'smooth',
                                                    block: 'start',
                                                });
                                            }}
                                        />
                                    ) : null}

                                    {tx.status === 'disputed' ? (
                                        <div className="txActionPanel txActionPanel--quiet">
                                            <p className="txActionPanel-title">Issue reported</p>
                                            <p className="txActionPanel-text">
                                                Wassitna will review this transaction. Use WhatsApp admin if you need
                                                to add details.
                                            </p>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="txDetail-card txDetail-itemsCard" id="tx-summary">
                                    <table className="txDetail-itemsTable">
                                        <thead>
                                            <tr>
                                                <th colSpan={2}>
                                                    <div className="txDetail-cardHead">
                                                        {docIcon}
                                                        <span>Item details</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(tx.items || []).map((item) => (
                                                <tr key={item.id || item.name}>
                                                    <td>
                                                        <div className="txDetail-itemName">{item.name}</div>
                                                        <p className="txDetail-itemDesc">
                                                            {categoryLabel(categories, item.category)}
                                                        </p>
                                                        {item.description ? (
                                                            <p className="txDetail-itemDesc">{item.description}</p>
                                                        ) : null}
                                                    </td>
                                                    <td className="is-right">
                                                        {formatMoney(item.price, tx.currency || 'DZD')}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="is-muted">
                                                <td>Subtotal</td>
                                                <td className="is-right">
                                                    {formatMoney(tx.subtotal, tx.currency || 'DZD')}
                                                </td>
                                            </tr>
                                            <tr className="is-muted">
                                                <td>Wassitna fee</td>
                                                <td className="is-right">
                                                    {formatMoney(tx.fee_amount, tx.currency || 'DZD')}
                                                </td>
                                            </tr>
                                            <tr className="is-total">
                                                <td>
                                                    <strong>Total ({tx.currency || 'DZD'})</strong>
                                                </td>
                                                <td className="is-right">
                                                    <strong>{formatMoney(tx.buyer_total, tx.currency || 'DZD')}</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {tx.status === 'completed' || tx.status === 'disputed' ? null : (
                                    <div className="txDetail-cancelWrap">
                                        <button type="button" className="kyc-cancelTransactionButton" disabled>
                                            Cancel transaction
                                        </button>
                                    </div>
                                )}
                            </div>

                            <aside className="txDetail-aside">
                                <div className="txDetail-card">
                                    <div className="txDetail-cardHead">
                                        {historyIcon}
                                        <p>History</p>
                                    </div>
                                    <ul className="txDetail-history">
                                        {history.map((entry) => (
                                            <li key={`${entry.date}-${entry.note}`}>
                                                <div className="txDetail-historyBody">
                                                    <strong>{entry.date}</strong>
                                                    <p>{entry.note}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="txDetail-card">
                                    <div className="txDetail-cardHead">
                                        {faqIcon}
                                        <p>Frequently asked questions</p>
                                    </div>
                                    <div className="txDetail-faqList">
                                        {faqs.map((item, index) => {
                                            const open = openFaq === index;
                                            return (
                                                <div key={item.q} className={`txDetail-faq${open ? ' is-open' : ''}`}>
                                                    <button
                                                        type="button"
                                                        className="txDetail-faqToggle"
                                                        aria-expanded={open}
                                                        onClick={() => setOpenFaq(open ? null : index)}
                                                    >
                                                        <span>{item.q}</span>
                                                        <span className="txDetail-faqChevron" aria-hidden="true">
                                                            ▾
                                                        </span>
                                                    </button>
                                                    {open ? <div className="txDetail-faqBody">{item.a}</div> : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="txDetail-moreHelp">
                                        <Link to="/help">Need more help?</Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    );
}
