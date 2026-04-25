import { CgClose } from "react-icons/cg";
import useEscape from "../hooks/useEscape";

type Keybinding = {
    key: string[];
    action: string;
};

interface Props {
    data?: Keybinding[];
    onClose?: () => void
}

const keybindings = [
    { key: ["Backspace"], action: "Double press to delete empty" },
    { key: ["Ctrl", "Up"], action: "Jump to previous" },
    { key: ["Ctrl", "Down"], action: "Jump to next" },
    { key: ["Up"], action: "Previous task/group" },
    { key: ["Down"], action: "Next task/group" },
];


function KeybindingTableModal({ data = keybindings, onClose }: Props) {

    useEscape(() => {
        onClose?.();
    });

    return (
        <div
            className='absolute flex items-center justify-center top-0 left-0 z-1 w-full h-full'
        >
            <div
                className='absolute bg-gray-950 opacity-50 top-0 left-0 z-0 w-full h-full'
                onClick={onClose}
            />
            <div className="relative  w-90  px-3 pt-2 pb-4 space-y-2 bg-gray-50 rounded-2xl" >
                <div className="flex justify-between text-sm py-2 " >
                    <h1 className="text-sm font-medium text-gray-800">Keyboard Shortcuts</h1>
                    <button className="cursor-pointer p-1 text-gray-700 hover:text-gray-800" onClick={onClose} >
                        <CgClose />
                    </button>
                </div>

                <div className=" bg-gray-50  overflow-hidden rounded-md">
                    <table className="relative w-full border-collapse text-gray-700">
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-gray-200 even:bg-gray-100"
                                >
                                    <td className="py-2 px-3 text-sm">
                                        {item.action}
                                    </td>
                                    <td className="py-2 px-3">
                                        <div
                                            className="text-sm text-right h-full flex justify-end items-center space-x-1"
                                        >
                                            {item.key.map((key, idx) => {
                                                return (
                                                    <button
                                                        className="text-[sm] font-mono! bg-gray-300 px-1.5 py-px rounded-sm border-0 border-b-2 border-gray-400"
                                                        key={`${idx}`}
                                                    >
                                                        {key}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default KeybindingTableModal;