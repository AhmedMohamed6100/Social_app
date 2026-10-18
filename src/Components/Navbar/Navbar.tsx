import { Avatar } from "@heroui/react";
import logoImage from "../../assets/route.png";
import { useContext, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import AppButton from "../../SharedComponet/AppButton/AppButton";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { handelChangeProfilePhoto } from "./Navabar.services";
import toast from "react-hot-toast";
import { getUserData } from "../../Context/UserAuthProvider/userAuthProvider.services";
import {
  Home,
  User,
  Message,
  HamburgerMenu,
  Setting2,
  LogoutCurve,
} from "iconsax-reactjs";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../Pages/Notifications/Notifications.services";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData, setUserData } = useContext(UserAuthContext);
  const router = useNavigate();
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { data } = useQuery({
   queryKey: ["unreadCount"],
   queryFn: getUnreadCount,
    refetchOnWindowFocus: true,
  });

  const unreadCount =
    typeof data === "number"
      ? data
      : (data?.count ??
        data?.data?.count ??
        data?.unreadCount ??
        data?.data?.unreadCount ??
        data?.data ??
        0);

  function handleAvatar() {
    setIsOpen(!isOpen);
  }

  function handleLogOut() {
    localStorage.removeItem("user_tkn");
    setUserData(null);
    setIsOpen(false);
    router("/login");
  }

  async function changeProfilePhoto() {
    const file = inputFileRef.current?.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const dataForm = new FormData();
    dataForm.append("photo", file);

    toast.promise(
      handelChangeProfilePhoto(dataForm).then(async (res) => {
        try {
          const data = await getUserData();
          setUserData(data);
          setIsOpen(false);
        } catch (err) {
          console.error("Error fetching updated user data:", err);
        }
        return res;
      }),
      {
        loading: "Updating photo...",
        success: (res) => String(res || "Photo updated successfully"),
        error: (err) => err?.message || "Failed to update photo",
      },
    );
  }

  return (
    <nav className="bg-white fixed w-full z-20 top-0 border-b border-gray-100 shadow-sm py-2.5">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/Feed" className="flex items-center gap-3">
          <img src={logoImage} alt="Route Posts Logo" className="h-10 w-auto" />
          <span className="font-bold text-xl text-gray-900">Route Posts</span>
        </Link>

        {userData && (
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full p-1.5 shadow-inner gap-1">
            <NavLink
              to="/Feed"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              <Home size="18" variant="Outline" />
              <span>Feed</span>
            </NavLink>

            <NavLink
              to="/myProfile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              <User size="18" variant="Outline" />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="/Notifications"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition relative ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              <div className="relative">
                <Message size="18" variant="Outline" />
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadCount}
                </span>
              </div>
              <span>Notifications</span>
            </NavLink>
          </div>
        )}

        <div className="flex items-center relative">
          {userData ? (
            <div className="relative">
              <button
                onClick={handleAvatar}
                type="button"
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full py-1.5 px-3 transition cursor-pointer"
              >
                <Avatar className="w-8 h-8">
                  <Avatar.Image alt={userData.name} src={userData.photo} />
                  <Avatar.Fallback>JD</Avatar.Fallback>
                </Avatar>
                <span className="text-sm font-bold text-gray-800 max-w-[100px] truncate">
                  {userData.name}
                </span>
                <HamburgerMenu size="18" className="text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {userData.name}
                    </p>
                  </div>

                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/myProfile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                      >
                        <User size="18" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/setting"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700"
                      >
                        <Setting2 size="18" /> Settings
                      </Link>
                    </li>
                    <li>
                      <span
                        onClick={() => inputFileRef.current?.click()}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700 cursor-pointer"
                      >
                        <User size="18" /> Update photo
                      </span>
                      <input
                        type="file"
                        onChange={changeProfilePhoto}
                        hidden
                        ref={inputFileRef}
                      />
                    </li>
                  </ul>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogoutCurve size="18" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login">
                <AppButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                  Login
                </AppButton>
              </Link>
              <Link to="/register">
                <AppButton className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold">
                  Register
                </AppButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
