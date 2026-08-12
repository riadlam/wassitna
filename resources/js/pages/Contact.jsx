import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { brand } from '../brand';

const topics = [
    'I want to start a transaction',
    'I have a question about fees',
    'I need help with an existing deal',
    'I want to partner with Wassitna',
    'I think someone is impersonating you',
    'Something else',
];

export default function Contact() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        topic: topics[0],
        message: '',
    });

    function update(key, value) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function onSubmit(event) {
        event.preventDefault();
        setSent(true);
    }

    return (
        <>
            <PageHero
                title="Contact Us"
                desc="A real team in Algeria. Tell us about the deal and we will answer with a name, not a script."
            />
            <section className="trustPage">
                <div className="trustPage-wrap">
                    <div className="trustPage-intro">
                        <p className="trustPage-kicker">Get in touch</p>
                        <h2>We answer people, not tickets with no owner.</h2>
                        <p>
                            Use the form or write us directly. Include the transaction title if you already
                            started one. We do not ask for your password, RIP PIN, or a screenshot of a
                            “verification fee” — if someone does, it is not {brand.name}.
                        </p>
                    </div>

                    <ul className="trustPage-channels">
                        <li>
                            <span>Email</span>
                            <a href="mailto:support@wassitna.com">support@wassitna.com</a>
                            <small>Best for documents and deal details</small>
                        </li>
                        <li>
                            <span>Phone</span>
                            <a href={`tel:${brand.phone}`}>{brand.phone}</a>
                            <small>Saturday – Thursday, 9:00 – 17:00 (Algeria)</small>
                        </li>
                        <li>
                            <span>Help Center</span>
                            <Link to="/help">wassitna.com/help</Link>
                            <small>Fees, inspection, and how escrow works</small>
                        </li>
                    </ul>

                    <div className="trustPage-split">
                        <div className="trustPage-card">
                            <h3>Send a message</h3>
                            {sent ? (
                                <div className="trustPage-sent">
                                    <p>
                                        Thank you, {form.name || 'we received your note'}. We will reply to{' '}
                                        <strong>{form.email}</strong> as soon as we can — usually within one
                                        working day.
                                    </p>
                                    <button type="button" className="btn btn--secondary" onClick={() => setSent(false)}>
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form className="trustForm" onSubmit={onSubmit}>
                                    <label>
                                        Full name
                                        <input
                                            required
                                            value={form.name}
                                            onChange={(event) => update('name', event.target.value)}
                                        />
                                    </label>
                                    <div className="trustForm-row">
                                        <label>
                                            Email
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(event) => update('email', event.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Phone
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={(event) => update('phone', event.target.value)}
                                                placeholder="+213"
                                            />
                                        </label>
                                    </div>
                                    <label>
                                        Topic
                                        <select
                                            value={form.topic}
                                            onChange={(event) => update('topic', event.target.value)}
                                        >
                                            {topics.map((topic) => (
                                                <option key={topic}>{topic}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        How can we help?
                                        <textarea
                                            required
                                            rows={6}
                                            value={form.message}
                                            onChange={(event) => update('message', event.target.value)}
                                            placeholder="What are you buying or selling, the amount in DA, and where you are stuck."
                                        />
                                    </label>
                                    <button type="submit" className="btn btn--secondary btn--large">
                                        Send message
                                    </button>
                                    <p className="trustForm-fine">
                                        We use this only to reply about your request. We never ask you to pay
                                        a “release fee” outside {brand.domain}.
                                    </p>
                                </form>
                            )}
                        </div>

                        <aside className="trustPage-aside">
                            <div className="trustPage-card">
                                <h3>Where we work</h3>
                                <p>
                                    Wassitna is an Algerian startup. We serve buyers and sellers across the
                                    country. If you need a written summary of a deal, ask and we will send it
                                    to your email.
                                </p>
                                <p>
                                    <strong>Country:</strong> Algeria
                                    <br />
                                    <strong>Currency:</strong> Algerian Dinar (DA)
                                    <br />
                                    <strong>Max deal size:</strong> 200,000 DA
                                </p>
                            </div>
                            <div className="trustPage-card trustPage-card--warn">
                                <h3>Protect yourself</h3>
                                <ul>
                                    <li>Never pay a seller directly and call it “Wassitna”.</li>
                                    <li>Never share your password or email verification code.</li>
                                    <li>Check you are on {brand.domain} before you send funds.</li>
                                </ul>
                                <Link to="/about">Read who we are</Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}
