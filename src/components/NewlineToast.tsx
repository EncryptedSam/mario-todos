import { useEffect, useState } from "react";

const STORAGE_KEY = "hide_newline_toast";

interface Props {
    onClose?(): void
}

function NewlineToast({ onClose }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const hidden = localStorage.getItem(STORAGE_KEY);
        if (!hidden) {
            setVisible(true);
        }
    }, []);


    const handleDontShow = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="absolute mx-auto left-0 right-0 top-12 border border-gray-200 bg-gray-100 text-gray-900 p-4 rounded-lg shadow-lg w-72 space-y-2 toast-enter">
            <p className="text-sm">
                Press <b>Shift + Enter</b> for a new line
            </p>

            <div className="flex justify-between text-xs">
                <button
                    className="opacity-70 hover:opacity-100 cursor-pointer"
                    onClick={onClose}
                >
                    Close
                </button>

                <button
                    onClick={handleDontShow}
                    className="text-blue-400 hover:underline cursor-pointer"
                >
                    Don't show again
                </button>
            </div>
        </div>
    );
}

export default NewlineToast; 