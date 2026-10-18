import { NavLink } from "react-router";
import { Home, User, People, Bookmark } from "iconsax-reactjs";

export default function PostSidebar() {
  const menuItems = [
    { name: "Feed", path: "/Feed", icon: <Home size="22" /> },
    { name: "MyPosts", path: "/myPosts", icon: <User size="22" /> },
    { name: "Community", path: "/Posts", icon: <People size="22" /> },
    { name: "Saved", path: "/SavedPosts", icon: <Bookmark size="22" /> },
  ];

  return (
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
  );
}