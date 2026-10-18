function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center w-full px-4 overflow-hidden relative">
            
            <div className="absolute top-1/4 left-1/10 w-64 h-64 bg-cyan-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/10 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="text-center max-w-7xl w-full z-10">
                <div className="relative inline-block">
                    <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-extrabold tracking-tighter leading-none select-none bg-clip-text text-transparent bg-gradient-to-b from-cyan-300 via-sky-400 to-cyan-500">
                        404
                    </h1>
                    <div className="absolute -bottom-4 left-0 right-0 h-1.5 bg-cyan-400 rounded-full transform scale-x-75"></div>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-950 mt-10 leading-tight">
                    Oops! You've drifted <span className="text-cyan-600">off course</span>.
                </h2>
                
                <p className="mt-8 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2">
                    It seems you've charted a path to a page that doesn't exist. Don't worry, even the best explorers get temporary lost. Let's get you back to familiar waters.
                </p>
                
                <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <a 
                        href="/" 
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-sky-700 transition duration-150 shadow-lg shadow-cyan-200 flex items-center justify-center gap-3 transform hover:-translate-y-1"
                    >
                        <span>⚓</span> Back to Home
                    </a>
                    <a 
                        href="/support" 
                        className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-cyan-200 text-cyan-700 rounded-xl font-semibold text-lg hover:bg-cyan-50 transition duration-150 flex items-center justify-center gap-3"
                    >
                        Report an Issue
                    </a>
                </div>
            </div>

        </div>
    );
}



export default NotFound;