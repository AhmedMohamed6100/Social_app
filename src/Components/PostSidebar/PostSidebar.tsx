import { NavLink } from "react-router";
import { Home, User, People, Bookmark } from "iconsax-reactjs";

export default function PostSidebar() {
  const menuItems = [
    { name: "Feed", path: "/Feed", icon: <Home size="20" /> },
    { name: "MyPosts", path: "/myPosts", icon: <User size="20" /> },
    { name: "Community", path: "/Posts", icon: <People size="20" /> },
    { name: "Saved", path: "/SavedPosts", icon: <Bookmark size="20" /> },
  ];

  return (
    <>
      <aside className="w-full hidden lg:block sticky top-20 h-fit space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-3 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-around gap-1 bg-white/95 backdrop-blur-md border border-slate-200/80 p-1.5 rounded-full shadow-xl w-full max-w-xs">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center gap-1 px-3 py-2 rounded-full transition-all cursor-pointer flex-1 ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-[11px] font-medium hidden sm:inline">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}