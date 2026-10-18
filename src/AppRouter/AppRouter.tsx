import { createBrowserRouter, Outlet } from "react-router";
import Posts from "../Pages/Posts/Posts";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import NotFound from "../Pages/NotFound/NotFound";
import Layout from "../Components/Layout/Layout";
import ProtectedRoute from "../Components/ProtectedRoute/ProtectedRoute";
import AuthProtected from "../Components/AuthProtected/AuthProtected";
import PostDetails from "../Pages/PostDetails/PostDetails";
import SavedPostsPage from "../Pages/SavedPostsPage/SavedPostsPage";
import Feed from "../Pages/Feed/Feed";
import MyPosts from "../Pages/myPosts/myPosts";
import MyProfile from "../Pages/myProfile/myProfile";
import Notifications from "../Pages/Notifications/Notifications";
import UsersProfile from "../Pages/UsersProfile/UsersProfile";
import Setting from "../Pages/Setting/setting";
import Suggestions from "../Pages/Suggestions/Suggestions";

function AuthLayout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute><Posts /></ProtectedRoute> },
      { path: "posts", element: <ProtectedRoute><Posts /></ProtectedRoute> },
      { path: "PostDetails/:_id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
      { path: "MyPosts", element: <ProtectedRoute><MyPosts /></ProtectedRoute> },
      { path: "SavedPosts", element: <ProtectedRoute><SavedPostsPage /></ProtectedRoute> },
      { path: "Notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      { path: "Setting", element: <ProtectedRoute><Setting /></ProtectedRoute> },
      { path: "Suggestions", element: <ProtectedRoute><Suggestions /></ProtectedRoute> },
      { path: "myProfile", element: <ProtectedRoute><MyProfile /> </ProtectedRoute> },
      { path: "UsersProfile/:id", element: <ProtectedRoute><UsersProfile /> </ProtectedRoute> },
      
      { path: "Feed", element: <ProtectedRoute><Feed /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <AuthProtected><Login /></AuthProtected> },
      { path: "register", element: <AuthProtected><Register /></AuthProtected> },
    ],
  },
]);