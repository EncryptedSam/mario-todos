import { AiOutlineContainer } from "react-icons/ai";
import { FaRegListAlt } from "react-icons/fa";

type EmptyStateBackgroundProps = {
    type: "group" | "task";
    onClick?: () => void;
    isLoading?: boolean;

};

export const EmptyStateBackground = ({
    type,
    isLoading = false,
    onClick,
}: EmptyStateBackgroundProps) => {
    const config = {
        group: {
            icon: <AiOutlineContainer className="text-3xl opacity-70" />,
            title: "Looks like you don't have any groups yet",
            description: "Create your first one to get started",
            button: "Create Group",
        },
        task: {
            icon: <FaRegListAlt className="text-3xl opacity-70" />,
            title: "Looks like you don't have any task yet",
            description: "Add your first item to begin",
            button: "Add Task",
        },
    };
    
    if (isLoading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
            </div>
        );
    }

    const { title, description, button, icon } = config[type];

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            {icon}

            <div className="space-y-1 text-center flex flex-col items-center">
                <p className="text-[16px] text-gray-900 font-semibold">
                    {title}
                </p>
                <p className="text-[13px] text-gray-600">
                    {description}
                </p>
            </div>

            <button
                onClick={onClick}
                className="p-2 px-4 text-white text-sm rounded-full bg-red-600 cursor-pointer"
            >
                {button}
            </button>
        </div>
    );
};