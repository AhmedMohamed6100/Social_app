import { useQuery } from "@tanstack/react-query";
import { PostCard } from "../PostCard/PostCard";
import { getMyPosts } from "../../Pages/myPosts/myPosts.services";
import { useContext } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";

export default function MyPostsForMe() {

  const { userData } = useContext(UserAuthContext);
  const userId = userData?._id || userData?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myPosts", userId], 
    queryFn: () => getMyPosts(userId),
    enabled: !!userId, 
    refetchInterval:false,
  });

  const myPosts = data?.posts || data?.data?.posts || data?.data || [];

  return (
    <div className="flex gap-5 justify-center max-w-7xl items-start w-full">
      <div className="flex-1 max-w-2xl w-full flex flex-col gap-5">

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 gap-3">
            <div className="w-9 h-9 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-semibold text-gray-700">
                Loading your posts...
              </p>
              <p className="text-xs text-gray-400">Please wait a moment</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-10 text-red-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            {error?.message || "Failed to load posts"}
          </div>
        )}

        {!isLoading && !isError && myPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
            You haven't created any posts yet.
          </div>
        )}

        {!isLoading &&
          !isError &&
          myPosts.map((post: any) => (
            <PostCard key={post._id || post.id} post={post} />
          ))}
      </div>
    </div>
  );
}