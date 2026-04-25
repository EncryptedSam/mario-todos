import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle
} from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxRows?: number;
}

const AutoTextarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ maxRows = 4, value, ...props }, forwardedRef) => {
        const innerRef = useRef<HTMLTextAreaElement | null>(null);

        // expose inner ref to parent
        useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement);

        const resize = () => {
            const el = innerRef.current;
            if (!el) return;

            const computed = window.getComputedStyle(el);

            let lineHeight = parseFloat(computed.lineHeight);
            if (isNaN(lineHeight)) {
                const fontSize = parseFloat(computed.fontSize);
                lineHeight = fontSize * 1.2;
            }

            const padding =
                parseFloat(computed.paddingTop) +
                parseFloat(computed.paddingBottom);

            const maxHeight = lineHeight * maxRows + padding;

            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
        };

        useEffect(() => {
            resize();
        }, [value, maxRows]);

        return (
            <textarea
                ref={innerRef}
                value={value}
                onInput={resize}
                className="resize-none overflow-auto"
                {...props}
            />
        );
    }
);

export default AutoTextarea;