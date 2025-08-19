import LoadingScreen from "@/app/components/loadingScreen";

const Loading = () => {
   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
         <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your profile...</p>
         </div>
      </div>
   );
};

export default Loading;
