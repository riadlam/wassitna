import { useEffect, useState } from 'react';
import { dismissIosKeyboard, isTextEntryElement } from '../iosKeyboard';

function isTouchLike() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
}

export default function IosKeyboardDoneBar() {
    const [visible, setVisible] = useState(false);
    const [bottom, setBottom] = useState(0);

    useEffect(() => {
        if (!isTouchLike()) return undefined;

        const syncViewport = () => {
            const viewport = window.visualViewport;
            if (!viewport) {
                setBottom(0);
                return;
            }
            const occluded = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
            setBottom(occluded);
        };

        const onFocusIn = (event) => {
            if (!isTextEntryElement(event.target)) return;
            setVisible(true);
            syncViewport();
        };

        const onFocusOut = () => {
            window.setTimeout(() => {
                if (!isTextEntryElement(document.activeElement)) {
                    setVisible(false);
                    setBottom(0);
                }
            }, 30);
        };

        window.visualViewport?.addEventListener('resize', syncViewport);
        window.visualViewport?.addEventListener('scroll', syncViewport);
        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('focusout', onFocusOut);
        window.addEventListener('resize', syncViewport);

        return () => {
            window.visualViewport?.removeEventListener('resize', syncViewport);
            window.visualViewport?.removeEventListener('scroll', syncViewport);
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', onFocusOut);
            window.removeEventListener('resize', syncViewport);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="iosKeyboardDoneBar" style={{ bottom: `${bottom}px` }} role="toolbar" aria-label="Keyboard">
            <button
                type="button"
                className="iosKeyboardDoneBar-button"
                onMouseDown={(event) => event.preventDefault()}
                onTouchStart={(event) => event.preventDefault()}
                onClick={() => dismissIosKeyboard()}
            >
                Done
            </button>
        </div>
    );
}
