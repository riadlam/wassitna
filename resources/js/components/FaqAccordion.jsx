import { useState } from 'react';

export default function FaqAccordion({ items, openId, onToggle }) {
    if (!items.length) {
        return <p className="faqEmpty">No questions match your search. Try another word or browse all topics.</p>;
    }

    return (
        <div className="faqList">
            {items.map((item) => {
                const open = openId === item.id;
                return (
                    <div key={item.id} className={`faqItem${open ? ' is-open' : ''}`} id={item.id}>
                        <button
                            type="button"
                            className="faqToggle"
                            aria-expanded={open}
                            onClick={() => onToggle(open ? null : item.id)}
                        >
                            <span>{item.q}</span>
                            <span className="faqChevron" aria-hidden="true">
                                ▾
                            </span>
                        </button>
                        {open ? <div className="faqBody">{item.a}</div> : null}
                    </div>
                );
            })}
        </div>
    );
}
