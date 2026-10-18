import { ThreeDots } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-full min-h-screen bg-gray-900/10 backdrop-blur-md transition-all duration-300">
    
      <div className="flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-11/12 md:w-auto">
        
    
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#3b82f6" 
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />

        <p className="mt-4 text-base font-semibold text-gray-700 dark:text-gray-200 tracking-wide animate-pulse">
            Loading...
        </p>
      </div>
    </div>
  );
}