import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { brand } from '../brand';

const steps = [
    { n: '01', title: 'Agree the deal', text: 'Buyer and seller confirm the item, price in DA, and inspection period.' },
    { n: '02', title: 'Buyer pays Wassitna', text: 'Funds come to us first — not to a personal account you cannot trace.' },
    { n: '03', title: 'Seller delivers', text: 'The seller ships the goods or completes the service as agreed.' },
    { n: '04', title: 'Buyer inspects', text: 'The buyer checks the item during the inspection window.' },
    { n: '05', title: 'We pay the seller', text: 'Only after approval do we release the money to the seller.' },
];

const principles = [
    {
        title: 'Money is never sent “to a stranger”',
        text: 'The buyer pays Wassitna. The seller is paid by Wassitna. That is the whole point of escrow.',
    },
    {
        title: 'Fees are published before you start',
        text: 'Under 20,000 DA is free. Then 1.5% or 1% depending on the amount. No surprise “processing” line at the end.',
    },
    {
        title: 'Built in Algeria, for Algeria',
        text: 'Deals in DA, local support, and a fee schedule you can read before you start. We are growing here — step by step.',
    },
    {
        title: 'Both sides stay protected',
        text: 'Buyers can inspect before funds move. Sellers are paid only after approval — not after a risky direct transfer.',
    },
];

export default function About() {
    return (
        <>
            <PageHero
                title="About Wassitna"
                desc="A young escrow company in Algeria. We hold the payment until both sides have done their part."
            />
            <section className="trustPage">
                <div className="trustPage-wrap">
                    <div className="trustPage-intro">
                        <p className="trustPage-kicker">Who we are</p>
                        <h2>People should be able to trade without sending money into the dark.</h2>
                        <p>
                            {brand.domain} started because too many good deals in Algeria still end the same way:
                            one person pays first, the other disappears — or the goods arrive and the buyer
                            reverses the payment. Escrow is the boring, fair middle.
                        </p>
                        <p>
                            We are based in Algeria and launching locally first. That means a DA fee schedule
                            and a process you can follow in five steps. We would rather be small and clear than
                            loud and fake.
                        </p>
                    </div>

                    <ul className="trustPage-stats">
                        <li>
                            <strong>Algeria</strong>
                            <span>Where we are building</span>
                        </li>
                        <li>
                            <strong>20,000 DA</strong>
                            <span>Free under this amount</span>
                        </li>
                        <li>
                            <strong>6 categories</strong>
                            <span>Goods to accounts covered</span>
                        </li>
                        <li>
                            <strong>5 steps</strong>
                            <span>Agree, pay, deliver, inspect, release</span>
                        </li>
                    </ul>

                    <div className="trustPage-block">
                        <p className="trustPage-kicker">How your money is handled</p>
                        <h2>The payment sits with us until the deal is complete.</h2>
                        <ol className="trustPage-steps">
                            {steps.map((step) => (
                                <li key={step.n}>
                                    <span>{step.n}</span>
                                    <div>
                                        <h3>{step.title}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="trustPage-block">
                        <p className="trustPage-kicker">How we work</p>
                        <h2>Trust is built with rules, not slogans.</h2>
                        <div className="trustPage-grid">
                            {principles.map((item) => (
                                <article key={item.title}>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="trustPage-note">
                        <h3>Watch out for impersonators</h3>
                        <p>
                            Real deals only happen on {brand.domain}. The buyer pays Wassitna — never a seller’s
                            personal CCP or BaridiMob. We never ask for a “verification fee” on WhatsApp. If
                            someone uses our name but wants money outside the site,{' '}
                            <Link to="/contact">tell us right away</Link>.
                        </p>
                    </div>

                    <div className="trustPage-cta">
                        <Link to="/transactions/start" className="btn btn--secondary btn--large">
                            Start a protected transaction
                        </Link>
                        <Link to="/contact" className="trustPage-cta-link">
                            Talk to the team
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
