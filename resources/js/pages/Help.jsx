import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FaqAccordion from '../components/FaqAccordion';
import PageHero from '../components/PageHero';
import { IconSearch } from '../components/AppIcons';
import { brand } from '../brand';
import { faqCategories, faqItems, filterFaq } from '../faq';

export default function Help() {
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [openId, setOpenId] = useState(null);

    const items = useMemo(() => filterFaq(query, category), [query, category]);

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (!hash) return;
        const match = faqItems.find((item) => item.id === hash);
        if (!match) return;
        setCategory(match.category);
        setOpenId(match.id);
        window.requestAnimationFrame(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [location.hash]);

    return (
        <>
            <PageHero
                title="Help Center"
                desc="Answers about escrow, payments, fees, and withdrawals — for deals in Algeria."
            />
            <section className="faqPage">
                <div className="wrap faqPage-wrap">
                    <div className="faqIntro">
                        <p>
                            {brand.name} holds buyer funds until both sides finish their part. We operate in
                            Algeria in DA. New here? Stuck on a deal? Checking if a message is really from us?
                            Start below.
                        </p>
                    </div>

                    <div className="faqToolbar">
                        <label className="faqSearch">
                            <IconSearch />
                            <input
                                type="search"
                                placeholder="Search questions"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setOpenId(null);
                                }}
                            />
                        </label>
                        <div className="faqTabs" role="tablist" aria-label="FAQ topics">
                            <button
                                type="button"
                                className={`faqTab${category === 'all' ? ' is-active' : ''}`}
                                onClick={() => {
                                    setCategory('all');
                                    setOpenId(null);
                                }}
                            >
                                All
                            </button>
                            {faqCategories.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`faqTab${category === item.id ? ' is-active' : ''}`}
                                    onClick={() => {
                                        setCategory(item.id);
                                        setOpenId(null);
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="faqCount">
                        {items.length} question{items.length === 1 ? '' : 's'}
                    </p>

                    <FaqAccordion items={items} openId={openId} onToggle={setOpenId} />

                    <div className="faqFooter">
                        <h2>Still need help?</h2>
                        <p>
                            Email <a href="mailto:support@wassitna.com">support@wassitna.com</a> or{' '}
                            <Link to="/contact">contact us</Link>. Include your transaction ID if you already
                            started a deal.
                        </p>
                        <Link to="/transactions/start" className="btn btn--secondary">
                            Start a transaction
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
