const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-rose-300 mx-auto"></div>
                <p className="mt-3 text-slate-500 text-sm">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
