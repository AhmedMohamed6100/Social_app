export default function AuthLeftSide() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#0a2e6e]">
          Route Posts
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-md">
          Connect with friends and the world around you on Route Posts.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-wider text-blue-600 mb-2">
          ABOUT ROUTE ACADEMY
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Egypt's Leading IT Training Center Since 2012
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Route Academy is the premier IT training center in Egypt, established in 2012. We
          specialize in delivering high-quality training courses in programming, web development,
          and application development. We've identified the unique challenges people may face
          when learning new technology and made efforts to provide strategies to overcome them.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-[#0a2e6e]">2012</p>
            <p className="text-xs text-gray-500 mt-1">FOUNDED</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-[#0a2e6e]">40K+</p>
            <p className="text-xs text-gray-500 mt-1">GRADUATES</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-[#0a2e6e]">50+</p>
            <p className="text-xs text-gray-500 mt-1">PARTNER COMPANIES</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-[#0a2e6e]">5</p>
            <p className="text-xs text-gray-500 mt-1">BRANCHES</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-lg font-bold text-[#0a2e6e]">20</p>
            <p className="text-xs text-gray-500 mt-1">DIPLOMAS AVAILABLE</p>
          </div>
        </div>
      </div>
    </div>
  );
}