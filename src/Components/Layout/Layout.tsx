import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import { Toaster } from "react-hot-toast";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-full pt-19 min-h-screen bg-gray-100 w-full pb-10 justify-center items-center">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}

export default Layout;