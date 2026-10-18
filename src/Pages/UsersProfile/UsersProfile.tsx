import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@heroui/react";
import { PostCard } from "../../Components/PostCard/PostCard";
import Loading from "../../Components/Loading/Loading";
import AppButton from "../../SharedComponet/AppButton/AppButton"; 
import { ArrowLeft, UserAdd, UserTick } from "iconsax-reactjs";

import { getUserProfile, GetUserPosts } from "./UsersProfile.services"; 
import { toggleFollowUser } from "../Suggestions/FollowerUSer.services";

export default function UsersProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("🔍 [DEBUG] UsersProfile Loaded with ID:", id);

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id!),
    enabled: !!id,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: () => GetUserPosts(id!),
    enabled: !!id,
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => toggleFollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", id] });
      queryClient.invalidateQueries({ queryKey: ["suggestedFriends"] });
    },
  });

  if (profileLoading || postsLoading) return <Loading />;

  const user = profileData?.data?.user;
  const isFollowing = profileData?.data?.isFollowing;
  const userPosts = postsData?.data?.posts || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 font-sans">
      
      {/* زر الرجوع للخلف بسلاسة */}
      <div>
        <AppButton 
          onClick={() => navigate(-1)} 
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-xs px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs transition cursor-pointer"
        >
          <ArrowLeft size="16" />
          <span>Back</span>
        </AppButton>
      </div>

      {/* الكارد الرئيسي للبروفايل (Cover + Profile Info + Follow Button) */}
      <div className="relative bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* الغلاف (Cover) */}
        <div className="h-48 sm:h-60 w-full bg-gray-200 relative overflow-hidden">
          {user?.cover ? (
            <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900" />
          )}
        </div>

        {/* الجزء السفلي المتداخل */}
        <div className="px-6 pb-6 pt-4 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-end gap-4 -mt-16 sm:-mt-20">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
              <Avatar className="w-full h-full">
                <Avatar.Image src={user?.photo} alt={user?.name} className="w-full h-full object-cover" />
                <Avatar.Fallback>{user?.name?.[0] || "U"}</Avatar.Fallback>
              </Avatar>
            </div>
            
            <div className="mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {user?.name || "User Name"}
              </h1>
              <p className="text-xs text-gray-400 font-normal">
                @{user?.username || "username"}
              </p>
            </div>
          </div>

          {/* زر الفولو / أنفولو الديناميكي */}
          <button
            onClick={() => user?._id && followMutation.mutate(user._id)}
            disabled={followMutation.isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs ${
              isFollowing
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {followMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isFollowing ? (
              <UserTick size="16" />
            ) : (
              <UserAdd size="16" />
            )}
            <span>{isFollowing ? "Following" : "Follow"}</span>
          </button>

        </div>

      </div>

      <div className="flex flex-col gap-4">
        {userPosts.length > 0 ? (
          userPosts.map((post: any) => (
            <PostCard key={post._id || post.id} post={post} />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-xs font-medium shadow-xs">
            This user hasn't published any posts yet.
          </div>
        )}
      </div>

    </div>
  );
}