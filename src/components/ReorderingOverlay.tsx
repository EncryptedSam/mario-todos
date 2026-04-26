const ReorderingOverlay = () => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="absolute inset-0 bg-gray-950 opacity-10" />

            <div className="relative flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                <span className="text-sm text-gray-700 font-medium animate-pulse">
                    Reordering...
                </span>
            </div>
        </div>
    );
};

export default ReorderingOverlay;