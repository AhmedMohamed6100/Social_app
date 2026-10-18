import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetMyProfile } from "./myprofile.services";

import { PostCard } from "../../Components/PostCard/PostCard";
import { useContext } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import Loading from "../../Components/Loading/Loading";
import { User, Sms, Verify, DocumentText, Save2, Camera, Bookmark as BookmarkIcon } from "iconsax-reactjs";
import { getSavedPosts } from "../SavedPostsPage/Bookmark.services";
import MyPostsForMe from "../../Components/MyPostsForMe/MyPostsForMe";

export default function MyProfile() {
  const { userData } = useContext(UserAuthContext);
  const userId = userData?._id || userData?.id;

  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const { data: profileData, isLoading: profileLoading, isError: profileError, error: profileErrObj } = useQuery({
    queryKey: ["myProfile", userId],
    queryFn: () => GetMyProfile(userId),
    enabled: !!userId,
  });

  const { data: savedPostsData, isLoading: savedLoading } = useQuery({
    queryKey: ["savedPosts", userId],
    queryFn: getSavedPosts,
    // إزالة شرط الenabled عشان يجيب الداتا أو يستخدم الـ bookmarksCount لو مش متفعلة، 
    // أو يفضل خليه شغال لو بتجيبه عند الضغط بس هنعالج لو لسه undefined
  });

  if (profileLoading) return <Loading />;
  if (profileError) return <h1 className="text-red-500 text-center py-20">{profileErrObj.message}</h1>;

  const user = profileData?.data?.user;
  if (!user) return <p className="text-center py-20 text-gray-400">No user data found.</p>;

  // استخراج مصفوفة المحفوظات والعدد الفعلي بناءً عليها أو على الـ user object
  const savedPosts = savedPostsData?.posts || savedPostsData?.data?.posts || savedPostsData || [];
  
  // 👈 حساب العدد الفعلي (لو مصفوفة الـ savedPosts اتحملت ناخد طولها، لو لا نعتمد على الـ bookmarksCount بتاع اليوزر)
  const savedCount = savedPosts.length > 0 ? savedPosts.length : (user.bookmarksCount ?? 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 font-sans">
      
      <div className="relative bg-white rounded-[28px] border border-gray-200/80 shadow-xs overflow-hidden p-0">
        
        <div className="h-56 sm:h-72 w-full bg-[#1b365d] relative overflow-hidden">
          {user.cover ? (
            <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#112240] via-[#1d3557] to-[#2a4365]" />
          )}

          <label 
            htmlFor="cover-upload" 
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <Camera size="15" />
            <span>Add cover</span>
          </label>
          <input type="file" id="cover-upload" className="hidden" />
        </div>

        <div className="bg-white rounded-t-[28px] -mt-10 relative px-6 pt-0 pb-6">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between -mt-14 mb-6 gap-4">
            
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
                <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                <p className="text-xs text-gray-400 font-normal">@{user.username}</p>
                
                <div className="inline-flex items-center gap-1 mt-2 bg-[#eff6ff] text-[#2563eb] px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                  <Verify size="13" variant="Bold" />
                  <span>Route Posts member</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full lg:w-auto mt-2 lg:mt-8">
              <div className="flex-1 lg:w-32 bg-[#f8fafc] border border-gray-100 rounded-2xl py-3.5 px-4 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">FOLLOWERS</span>
                <span className="text-xl font-bold text-gray-900 mt-0.5 block">{user.followersCount}</span>
              </div>
              <div className="flex-1 lg:w-32 bg-[#f8fafc] border border-gray-100 rounded-2xl py-3.5 px-4 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">FOLLOWING</span>
                <span className="text-xl font-bold text-gray-900 mt-0.5 block">{user.followingCount}</span>
              </div>
              <div className="flex-1 lg:w-32 bg-[#f8fafc] border border-gray-100 rounded-2xl py-3.5 px-4 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">BOOKMARKS</span>
                <span className="text-xl font-bold text-gray-900 mt-0.5 block">{savedCount}</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
            
            <div className="lg:col-span-2 bg-[#f8fafc] border border-gray-100/80 rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">About</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sms size="16" className="text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User size="16" className="text-gray-400" />
                <span>Active on Route Posts</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#f8fafc] border border-gray-100/80 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DocumentText size="18" className="text-blue-600" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">MY POSTS</span>
                </div>
                <span className="font-bold text-base text-gray-900">9</span>
              </div>

              {/* 👈 هنا تم ربط العدد الفعلي لـ SAVED POSTS */}
              <div className="bg-[#f8fafc] border border-gray-100/80 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Save2 size="18" className="text-blue-600" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">SAVED POSTS</span>
                </div>
                <span className="font-bold text-base text-gray-900">{savedCount}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-[24px] border border-gray-200/80 p-5 shadow-xs flex flex-col gap-5">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "posts"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <DocumentText size="15" />
              <span>My Posts</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === "saved"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Save2 size="15" />
              <span>Saved</span>
            </button>
          </div>

          {/* 👈 تحديث العدد في الـ Badge بناءً على التاب النشطة */}
          <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {activeTab === "posts" ? 9 : savedCount}
          </span>
        </div>

        <div className="w-full">
          {activeTab === "posts" ? (
            <MyPostsForMe />
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {savedLoading ? (
                <div className="text-center py-12 text-gray-400 text-sm">Loading saved posts...</div>
              ) : savedPosts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {savedPosts.map((post: any) => (
                    <PostCard key={post._id || post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2">
                  <BookmarkIcon size="40" className="text-gray-400" variant="Outline" />
                  <p className="text-gray-500 text-sm font-medium">No saved posts yet</p>
                  <span className="text-xs text-gray-400">Posts you save will appear here.</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}