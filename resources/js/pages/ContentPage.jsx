import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { brand } from '../brand';

const pages = {
    partners: {
        title: 'Partners',
        desc: 'Add escrow to your marketplace, broker workflow, or classifieds site in Algeria.',
        body: [
            { heading: 'Marketplaces', text: 'Protect high-value sales with Wassitna Pay or our API as we expand.' },
            { heading: 'Brokers', text: 'Run domain, service, and merchandise deals with a neutral party holding funds in DA.' },
        ],
    },
    'transaction-types': {
        title: 'Categories',
        desc: 'Use Wassitna for physical goods, electronics, digital products, services, accounts and more.',
        body: [
            { heading: 'Physical goods', text: 'Clothes, furniture, spare parts and everyday items with delivery and inspection.' },
            { heading: 'Electronics', text: 'Phones, laptops and gadgets — funds held until the buyer checks the device.' },
            { heading: 'Digital products', text: 'Files, licenses and downloads with confirmation before payout.' },
            { heading: 'Services / freelance', text: 'Release payment when the agreed work is delivered and approved.' },
            { heading: 'Accounts', text: 'Gaming, Facebook, TikTok and similar account handovers.' },
            { heading: 'Other', text: 'Anything else you need to trade safely in Algeria.' },
        ],
    },
    'domain-names': {
        title: 'Domain Names',
        desc: 'Buy or sell domains and websites securely.',
        body: [{ heading: 'How it works', text: `Agree on terms, the buyer pays ${brand.domain}, the seller transfers the domain, the buyer approves, then we pay the seller.` }],
    },
    merchandise: {
        title: 'General Merchandise',
        desc: 'Complete protection for merchandise transactions.',
        body: [{ heading: 'How it works', text: 'Seller delivers after payment is secured. Buyer inspects and approves before funds are released.' }],
    },
    milestone: {
        title: 'Milestone Transactions',
        desc: 'Pay for services as you go with milestone payments.',
        body: [{ heading: 'How it works', text: 'Define a schedule. Funds are released only when each milestone is approved.' }],
    },
    about: {
        title: 'About Wassitna',
        desc: 'Escrow built in Algeria for people who trade online.',
        body: [{ heading: 'Our mission', text: 'Help Algerians buy and sell without paying strangers first — or delivering and never getting paid.' }],
    },
    careers: { title: 'Careers', desc: 'Build secure payments in Algeria.', body: [{ heading: 'Open roles', text: 'Send your resume to careers@wassitna.com.' }] },
    contact: { title: 'Contact', desc: 'We are here to help.', body: [{ heading: 'Support', text: 'Email support@wassitna.com or use the contact form. We are based in Algeria.' }] },
    press: { title: 'Press', desc: 'News and media resources.', body: [{ heading: 'Media', text: 'Contact press@wassitna.com for interviews and brand assets.' }] },
    fees: {
        title: 'Fees',
        desc: 'Simple, transparent escrow pricing in DA.',
        body: [
            { heading: 'Under 20,000 DA', text: 'Free — no Wassitna fee.' },
            { heading: '20,000 – 100,000 DA', text: '1.5% escrow fee.' },
            { heading: 'Over 100,000 DA', text: '1% escrow fee.' },
        ],
    },
    security: {
        title: 'Security',
        desc: 'How we protect buyers and sellers in Algeria.',
        body: [
            { heading: 'Funds held by Wassitna', text: 'Buyer payments are not sent to the seller’s personal account. They stay with us until the deal is approved.' },
            { heading: 'Your account', text: 'Use a strong password. We will never ask for it by email or WhatsApp.' },
        ],
    },
    licenses: {
        title: 'Legal & compliance',
        desc: 'Who we are and what we do not claim.',
        body: [
            { heading: 'Operating in Algeria', text: `${brand.name} is an Algerian company. We hold buyer funds until both sides complete the deal, with clear fees in DA.` },
            { heading: 'As we grow', text: 'We are working toward the right local compliance and payment partners. Until then, our process stays simple and transparent.' },
        ],
    },
    pay: { title: 'Wassitna Pay', desc: 'Secure payments for your site.', body: [{ heading: 'Integrate', text: 'Add escrow checkout to your website, app, or marketplace as our API rolls out.' }] },
    offer: { title: 'Wassitna Offer', desc: 'Agree a price, then close with escrow.', body: [{ heading: 'Make Offer', text: 'Settle on an amount for a domain, service, digital product, account, or merchandise — then move the deal into escrow on Wassitna.' }] },
    api: { title: 'Wassitna API', desc: 'Escrow for developers.', body: [{ heading: 'Developers', text: 'Integrate protected payments as simply as other checkout methods — coming as we scale in Algeria.' }] },
    terms: { title: 'Terms of Use', desc: `The agreement between you and ${brand.domain}.`, body: [{ heading: 'Overview', text: 'By using Wassitna you agree to our transaction rules, acceptable use, and fee schedule for deals in Algeria.' }] },
    privacy: { title: 'Privacy Policy', desc: 'How we collect and use your information.', body: [{ heading: 'Your data', text: 'We use account and transaction data to operate escrow, process withdrawals, and meet legal requirements in Algeria.' }] },
    cookies: { title: 'Cookie Policy', desc: 'How Wassitna uses cookies.', body: [{ heading: 'Cookies', text: 'We use essential cookies for login and optional analytics cookies to improve the site.' }] },
};

export default function ContentPage({ pageKey }) {
    const page = pages[pageKey] ?? pages.fees;
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;
        const el = document.querySelector(location.hash);
        if (!el) return;
        window.requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [location.hash, pageKey]);

    return (
        <>
            <PageHero title={page.title} desc={page.desc} />
            <section className="contentPage">
                <div className="wrap" style={{ maxWidth: 760 }}>
                    {page.body.map((block) => (
                        <div key={block.heading} id={block.id}>
                            <h2>{block.heading}</h2>
                            <p>{block.text}</p>
                        </div>
                    ))}
                    <p style={{ marginTop: 32 }}>
                        <Link to="/help" className="btn btn--secondary" style={{ marginRight: 12 }}>
                            Read the FAQ
                        </Link>
                        <Link to="/transactions/start" className="btn btn--secondary">
                            Start Transaction
                        </Link>
                    </p>
                </div>
            </section>
        </>
    );
}
