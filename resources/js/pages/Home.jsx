import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { brand } from '../brand';
import Header from '../components/Header';
import {
    HeroUpsellLogo,
    UpsellAccounts,
    UpsellDigital,
    UpsellElectronics,
    UpsellOther,
    UpsellPhysical,
    UpsellServices,
} from '../components/HeroUpsellIcons';
import { saveStartTxDraft } from '../startTxDraft';
import useCategories from '../hooks/useCategories';

const CHECK_ICON = (
    <svg className="sectionHero-upsell-icon" width="19" height="16" viewBox="0 0 19 16" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.69 6.892l2.322 2.21L16.35.312c.38-.4 1.012-.418 1.413-.038.4.38.417 1.013.037 1.414l-9.027 9.517c-.38.402-1.014.418-1.415.037L4.31 8.34c-.4-.38-.415-1.014-.034-1.414.38-.4 1.014-.415 1.414-.034zM11.836.978c.484.265.662.873.397 1.357-.265.485-.873.663-1.357.398C10.002 2.253 9.02 2 8 2 4.686 2 2 4.686 2 8s2.686 6 6 6 6-2.686 6-6c0-.552.448-1 1-1s1 .448 1 1c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c1.358 0 2.67.34 3.836.978z"
            fillRule="nonzero"
        />
    </svg>
);

const carouselSlides = [
    {
        title: 'Buy or sell physical goods safely in Algeria',
        note: 'Clothes, furniture, spare parts and everyday items — funds held until delivery is approved',
        icon: <UpsellPhysical />,
        steps: [
            'Buyer and seller agree on terms',
            `Buyer pays ${brand.domain}`,
            'Seller ships or hands over the item',
            'Buyer inspects & approves',
            `${brand.domain} pays the seller`,
        ],
    },
    {
        title: 'Protect phone and electronics deals',
        note: null,
        icon: <UpsellElectronics />,
        steps: [
            'Buyer and seller agree on terms',
            `Buyer pays ${brand.domain}`,
            'Seller delivers the device',
            'Buyer inspects & approves',
            `${brand.domain} pays the seller`,
        ],
    },
    {
        title: 'Secure digital products and licenses',
        note: null,
        icon: <UpsellDigital />,
        steps: [
            'Buyer and seller agree on terms',
            `Buyer pays ${brand.domain}`,
            'Seller sends files or license',
            'Buyer confirms access',
            `${brand.domain} pays the seller`,
        ],
    },
    {
        title: 'Pay for freelance work when it is done',
        note: null,
        icon: <UpsellServices />,
        steps: [
            'Buyer and seller agree on the work',
            `Buyer pays ${brand.domain}`,
            'Seller delivers the service',
            'Buyer approves the result',
            `${brand.domain} pays the seller`,
        ],
    },
    {
        title: 'Hand over gaming and social accounts safely',
        note: null,
        icon: <UpsellAccounts />,
        steps: [
            'Buyer and seller agree on terms',
            `Buyer pays ${brand.domain}`,
            'Seller sends the credentials',
            'Buyer confirms login works',
            `${brand.domain} pays the seller`,
        ],
    },
    {
        title: 'Escrow for any other deal you need',
        note: null,
        icon: <UpsellOther />,
        steps: [
            'Buyer and seller agree on terms',
            `Buyer pays ${brand.domain}`,
            'Seller delivers as agreed',
            'Buyer inspects & approves',
            `${brand.domain} pays the seller`,
        ],
    },
];

const howSteps = [
    { icon: '/vendor/escrow/icons/step-1.svg', title: 'Buyer and Seller agree to terms' },
    { icon: '/vendor/escrow/icons/step-2.svg', title: `Buyer submits payment to ${brand.name}` },
    { icon: '/vendor/escrow/icons/step-3.svg', title: 'Seller delivers goods or service to buyer' },
    { icon: '/vendor/escrow/icons/step-4.svg', title: 'Buyer approves goods or services' },
    { icon: '/vendor/escrow/icons/step-5.svg', title: `${brand.domain} releases payment to seller` },
];

const siteFeatures = [
    {
        icon: '/vendor/escrow/icons/feature-general-merchandise.svg',
        title: 'Physical goods',
        to: '/transactions/start',
        desc: `Clothes, furniture, spare parts and more. ${brand.domain} holds the payment until the buyer receives and checks the item.`,
    },
    {
        icon: '/vendor/escrow/icons/feature-electronics.svg',
        title: 'Electronics',
        to: '/transactions/start',
        desc: `Phones, laptops and gadgets. Funds stay with us until the buyer has inspected the device.`,
    },
    {
        icon: '/vendor/escrow/icons/feature-digital-products.svg',
        title: 'Digital products',
        to: '/transactions/start',
        desc: `Files, licenses and downloads. The seller delivers, the buyer confirms, then we release payment.`,
    },
    {
        icon: '/vendor/escrow/icons/feature-milestone-transactions.svg',
        title: 'Services / freelance',
        to: '/transactions/start',
        desc: `Design, development, repairs and other work. Pay only when the agreed work is delivered and approved.`,
    },
    {
        icon: '/vendor/escrow/icons/feature-accounts.svg',
        title: 'Accounts',
        to: '/transactions/start',
        desc: `Gaming, Facebook, TikTok and other accounts. Credentials stay protected until the buyer confirms handover.`,
    },
    {
        icon: '/vendor/escrow/icons/feature-other.svg',
        title: 'Other',
        to: '/transactions/start',
        desc: `Anything else you need to buy or sell safely in Algeria. Same escrow steps, clear fees in DA.`,
    },
];

function HeroCarousel() {
    const [active, setActive] = useState(0);
    const [exiting, setExiting] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setExiting(active);
            setActive((prev) => (prev + 1) % carouselSlides.length);
            setStepIndex(0);
            setTimeout(() => setExiting(null), 600);
        }, 5000);
        return () => clearInterval(id);
    }, [active]);

    useEffect(() => {
        const id = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % 5);
        }, 1000);
        return () => clearInterval(id);
    }, [active]);

    return (
        <div className="sectionHero-carousel carousel" data-component="carousel">
            {carouselSlides.map((slide, i) => {
                const classes = [
                    'sectionHero-upsell',
                    'carousel-item',
                    i === active ? 'is-active' : '',
                    i === exiting ? 'is-exiting' : '',
                ]
                    .filter(Boolean)
                    .join(' ');

                return (
                    <div className={classes} data-target="carousel-item" key={slide.title}>
                        <span className="sectionHero-upsell-title">
                            <HeroUpsellLogo icon={slide.icon} />
                            <span className="sectionHero-upsell-text">{slide.title}</span>
                        </span>
                        <div className="sectionHero-steps" data-component="steps-rotator">
                            <span className="sectionHero-steps-decorator sectionHero-steps-decorator--above" />
                            <ol className="sectionHero-upsell-list">
                                {slide.steps.map((step, si) => {
                                    let itemClass = 'sectionHero-upsell-item';
                                    if (i === active) {
                                        if (si === stepIndex) itemClass += ' is-highlighted';
                                        else if (si < stepIndex) itemClass += ' is-complete';
                                        else itemClass += ' is-disabled';
                                    } else {
                                        itemClass += ' is-disabled';
                                    }
                                    return (
                                        <li className={itemClass} data-target="step-item" key={step}>
                                            {CHECK_ICON}
                                            <span className="sectionHero-upsell-desc">{step}</span>
                                        </li>
                                    );
                                })}
                            </ol>
                            <span className="sectionHero-steps-decorator sectionHero-steps-decorator--below" />
                        </div>
                        {slide.note ? (
                            <footer className="sectionHero-upsell-footer">
                                <p className="sectionHero-upsell-note">{slide.note}</p>
                            </footer>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

function HeroCalculator() {
    const navigate = useNavigate();
    const { categories } = useCategories();
    const [role, setRole] = useState('seller');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('50000');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryRef = useRef(null);

    const selectedCategory = categories.find((item) => item.slug === category);

    useEffect(() => {
        if (!categoryOpen) return undefined;

        const onPointerDown = (event) => {
            if (!categoryRef.current?.contains(event.target)) {
                setCategoryOpen(false);
            }
        };
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setCategoryOpen(false);
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [categoryOpen]);

    const onStartTransaction = (e) => {
        e?.preventDefault?.();
        const draft = {
            role,
            category,
            price: String(price || '0'),
            currency: 'DZD',
            what: selectedCategory?.name || '',
        };
        saveStartTxDraft(draft);
        navigate('/transactions/start', { state: draft });
    };

    return (
        <div className="calculator">
            <form
                className="calculator-form defaultForm defaultForm--compact defaultForm--large defaultForm--light"
                onSubmit={onStartTransaction}
                noValidate
            >
                <div className="defaultForm-group">
                    <div className="field calculator-formUser field--minor" data-field="role">
                        <div className="field-input">
                            <div className="field-prefix">
                                <div className="field-prefix-wrapper">
                                    <span className="field-prefix-label">I'm</span>
                                </div>
                            </div>
                            <div className="defaultSelect defaultSelect--form">
                                <select
                                    className="defaultSelect-select"
                                    name="role"
                                    id="field-role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="seller">Selling</option>
                                    <option value="buyer">Buying</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`field calculator-formService${categoryOpen ? ' is-open' : ''}`}
                        data-field="calculator-search"
                    >
                        <div className="field-input">
                            <div
                                ref={categoryRef}
                                className={`defaultSelect defaultSelect--form${category ? '' : ' is-placeholder'}${
                                    categoryOpen ? ' is-open' : ''
                                }`}
                            >
                                <button
                                    type="button"
                                    className="defaultSelect-select calculator-search"
                                    id="field-calculator-search"
                                    aria-label="Category"
                                    aria-haspopup="listbox"
                                    aria-expanded={categoryOpen}
                                    onClick={() => setCategoryOpen((open) => !open)}
                                >
                                    {selectedCategory?.name || 'Electronics, services...'}
                                </button>
                                {categoryOpen ? (
                                    <ul className="defaultSelect-menu" role="listbox">
                                        {categories.map((item) => (
                                            <li key={item.slug} role="none">
                                                <button
                                                    type="button"
                                                    role="option"
                                                    aria-selected={category === item.slug}
                                                    className={
                                                        category === item.slug
                                                            ? 'defaultSelect-option is-selected'
                                                            : 'defaultSelect-option'
                                                    }
                                                    onClick={() => {
                                                        setCategory(item.slug);
                                                        setCategoryOpen(false);
                                                    }}
                                                >
                                                    {item.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="defaultForm-group">
                    <div className="field calculator-price" data-field="price">
                        <div className="field-input">
                            <div className="field-prefix">
                                <div className="field-prefix-wrapper">
                                    <span className="field-prefix-label">for</span>
                                </div>
                            </div>
                            <input
                                type="number"
                                className="defaultInput"
                                id="field-price"
                                name="price"
                                step="100"
                                min="0"
                                max="200000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="field calculator-currency" data-field="currency">
                        <div className="field-input">
                            <div className="defaultSelect defaultSelect--form defaultSelect--flags calculator-currencyStatic">
                                <span className="defaultSelect-flag" data-select-value="DZA" aria-hidden="true" />
                                <select
                                    className="defaultSelect-select"
                                    name="currency"
                                    id="field-currency"
                                    value="DZD"
                                    disabled
                                    aria-label="Currency: Algerian Dinar"
                                >
                                    <option value="DZD">DA</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <footer className="calculator-footer">
                <button
                    type="button"
                    className="btn btn--secondary btn--large calculator-cta"
                    onClick={onStartTransaction}
                >
                    Start transaction
                </button>
            </footer>
        </div>
    );
}

export default function Home() {
    const { menuOpen, onMenuToggle } = useOutletContext();
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;
        const el = document.querySelector(location.hash);
        if (!el) return;
        window.requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [location.hash]);

    return (
        <>
            <section className="sectionHero sectionHero--calculator">
                <div className="header--transparent">
                    <Header transparent menuOpen={menuOpen} onMenuToggle={onMenuToggle} />
                </div>
                <div className="section-container" data-component="calculator">
                    <div className="sectionHero-inner">
                        <div className="sectionHero-content">
                            <h1
                                className="sectionHero-title"
                                style={{
                                    fontFamily:
                                        "Montserrat, Helvetica, Arial, 'Microsoft Yahei', STXihei, sans-serif",
                                }}
                            >
                                {brand.tagline}
                            </h1>
                            <h2
                                className="sectionHero-desc"
                                style={{
                                    fontFamily:
                                        "Montserrat, Helvetica, Arial, 'Microsoft Yahei', STXihei, sans-serif",
                                }}
                            >
                                {brand.subtitle}
                            </h2>
                            <HeroCalculator />
                        </div>
                        <HeroCarousel />
                    </div>
                </div>
            </section>

            <section className="reputation" id="benefits">
                <div className="section-container">
                    <ul className="reputation-inner">
                        <li className="reputation-item reputation-item--stats">
                            <div className="reputation-stats">
                                <span className="reputation-stats-value">6 categories</span>
                                <span className="reputation-stats-label">Goods, electronics, digital, services, accounts</span>
                            </div>
                        </li>
                        <li className="reputation-item reputation-item--stats">
                            <div className="reputation-stats">
                                <span className="reputation-stats-value">5 steps</span>
                                <span className="reputation-stats-label">Agree, pay, deliver, inspect, release</span>
                            </div>
                        </li>
                        <li className="reputation-item reputation-item--stats">
                            <div className="reputation-stats">
                                <span className="reputation-stats-value">Algeria</span>
                                <span className="reputation-stats-label">Built for local deals in DA</span>
                            </div>
                        </li>
                        <li className="reputation-item reputation-item--stats">
                            <div className="reputation-stats">
                                <span className="reputation-stats-value">CCP & BaridiMob</span>
                                <span className="reputation-stats-label">Seller payouts the Algerian way</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <main role="main">
                <section className="section howItWorks" id="how-it-works">
                    <div className="section-container howItWorks-container">
                        <header className="section-header">
                            <div className="sectionHeading howItWorks-sectionHeading">
                                <h2 className="sectionHeading-title" role="heading">
                                    A safer way to buy and sell in Algeria
                                </h2>
                                <div className="sectionHeading-subTitle">
                                    {brand.domain} is a new escrow service built for local deals. We hold the
                                    buyer&apos;s funds until the item or service is delivered and approved —
                                    so neither side has to trust a stranger first.
                                </div>
                            </div>
                        </header>
                        <div className="steps">
                            <ol className="steps-list formHero-steps">
                                {howSteps.map((step) => (
                                    <li className="steps-step" key={step.title}>
                                        <div className="steps-image">
                                            <img src={step.icon} alt="" width="111" height="100" />
                                        </div>
                                        <div className="steps-title">{step.title}</div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <footer className="section-footer">
                            <div className="section-footer-actions">
                                <Link to="/signup" className="btn btn--secondary section-footer-btn btn--large">
                                    Get started now
                                </Link>
                                <div>
                                    <Link to="/about" className="section-footer-link">
                                        Learn More about {brand.name}
                                    </Link>
                                </div>
                            </div>
                        </footer>
                    </div>
                </section>

                <section className="section services" id="services">
                    <div className="section-container">
                        <header className="section-header">
                            <div className="sectionHeading services-title">
                                <h2 className="sectionHeading-title" role="heading">
                                    Safely buy and sell across our categories
                                </h2>
                            </div>
                        </header>
                        <div className="grid grid--horizontalCenter">
                            <div className="grid-col grid-col--desktopSmall-10">
                                <ul className="siteFeatures siteFeatures--large grid grid--spaceAround">
                                    {siteFeatures.map((feature) => (
                                        <li
                                            className="siteFeatures-item grid-col grid-col--tablet-5"
                                            key={feature.title}
                                        >
                                            <div className="siteFeatures-iconHolder">
                                                <img src={feature.icon} alt="" width="48" height="48" />
                                            </div>
                                            <div>
                                                <span className="siteFeatures-title">{feature.title}</span>
                                                <p className="siteFeatures-desc">{feature.desc}</p>
                                                <Link to={feature.to} className="siteFeatures-cta">
                                                    Learn More
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <footer className="section-footer">
                            <div>
                                <p className="section-footer-copy">
                                    Contact our friendly support team on{' '}
                                    <a href={`tel:${brand.phone}`}>{brand.phone}</a> to find out if your
                                    transaction can be covered.
                                </p>
                                <div className="section-footer-actions">
                                    <Link to="/signup" className="btn btn--secondary btn--large">
                                        Get started now
                                    </Link>
                                    <Link to="/transactions/fees" className="section-footer-link section-footer-link--inline">
                                        Try our Fee Calculator
                                    </Link>
                                </div>
                            </div>
                        </footer>
                    </div>
                </section>

                <section className="section partnerQuote partnerQuote--standalone partners" id="partners">
                    <div className="section-container">
                        <header className="section-header">
                            <h2 className="sectionHeading-title" role="heading">
                                Built with early partners in Algeria
                            </h2>
                            <div className="sectionHeading-subTitle">
                                We are a startup. If you run a marketplace, classifieds page, workshop or
                                brokerage, we would like to protect your deals while we grow together. No
                                integration required — start a transaction and invite the other party.
                            </div>
                            <div>
                                <Link to="/signup" className="btn btn--secondary btn--large">
                                    Get started now
                                </Link>
                            </div>
                        </header>
                    </div>
                </section>

                <section className="section apiIntroduction" id="pay">
                    <div className="section-container">
                        <div className="grid grid--verticalCenter">
                            <div className="grid-col grid-col--desktopSmall-5">
                                <figure className="apiIntroduction-figure media--hidden@tablet">
                                    <img
                                        src="/vendor/escrow/images/escrow-pay/home-escrow-pay.png"
                                        className="apiIntroduction-img apiIntroduction-img--pay"
                                        alt={`${brand.name} Pay: Secure payments in one line of code.`}
                                    />
                                </figure>
                            </div>
                            <div className="grid-col grid-col--desktopSmall-6 grid-col--flushRight">
                                <div className="sectionHeading sectionHeading--alignLeft">
                                    <h2 className="apiIntroduction-title sectionHeading-title">
                                        {brand.name} Pay: hold the money until the deal is done.
                                    </h2>
                                </div>
                                <p className="apiIntroduction-desc">
                                    The buyer pays {brand.domain}. We keep the funds until the seller delivers
                                    and the buyer approves. Then we pay the seller — without sending money to a
                                    stranger first.
                                </p>
                                <Link to="/transactions/start" className="btn btn--secondary btn--hollow btn--large">
                                    Start a transaction
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section apiIntroduction" id="offer">
                    <div className="section-container">
                        <div className="grid grid--verticalCenter">
                            <div className="grid-col grid-col--desktopSmall-6">
                                <div className="sectionHeading sectionHeading--alignLeft">
                                    <h2 className="apiIntroduction-title sectionHeading-title">
                                        Introducing {brand.name} Offer
                                    </h2>
                                </div>
                                <p className="apiIntroduction-desc">
                                    Agree a price first, then protect the payment. {brand.name} Offer is how
                                    buyers and sellers settle on an amount for a domain, service, digital
                                    product, account, or merchandise — then move the deal into escrow on{' '}
                                    {brand.domain}. No API, no extra software. Just a clear offer and a safe
                                    hold on the funds.
                                </p>
                                <Link to="/transactions/start" className="btn btn--secondary btn--hollow btn--large">
                                    Make an offer
                                </Link>
                            </div>
                            <div className="grid-col grid-col--desktopSmall-6 grid-col--flushRight">
                                <figure className="apiIntroduction-figure media--hidden@tablet">
                                    <img
                                        src="/vendor/escrow/images/offer/offer-introduction.png"
                                        className="apiIntroduction-img"
                                        alt={`Introducing ${brand.name} Offer`}
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section licensing" id="licensing">
                    <div className="section-container licensing-container">
                        <div className="grid grid--verticalCenter">
                            <div className="grid-col grid-col--desktopSmall-6 media--hidden@tablet">
                                <img
                                    src="/vendor/escrow/images/sections/licensing/map.png"
                                    className="licensing-img"
                                    alt="Building a trusted escrow service in Algeria"
                                />
                            </div>
                            <div className="grid-col grid-col--desktopSmall-6 grid-col--flushRight">
                                <h2 className="sectionHeading-title" role="heading">
                                    Built in Algeria, for deals between people who have not met
                                </h2>
                                <div className="licensing-subtitle">
                                    {brand.domain} is a young escrow service based in Algeria. We are launching
                                    locally first — clear fees, clear steps, deals in DA.
                                </div>
                                <p className="sectionHeading-subTitle">
                                    Buyer funds are held until both sides complete the deal. We are working
                                    toward the right local compliance as we grow. Until then we stay
                                    transparent: clear fees in DA and a simple process you
                                    can follow from start to finish.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
