export default function PageHero({ title, desc }) {
    return (
        <section className="sectionHero">
            <div className="section-container">
                <div className="sectionHero-inner">
                    <div className="sectionHero-content">
                        <h1 className="sectionHero-title">{title}</h1>
                        {desc ? <h2 className="sectionHero-desc">{desc}</h2> : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
