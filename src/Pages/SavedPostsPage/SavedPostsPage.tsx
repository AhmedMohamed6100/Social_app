import { useQuery } from "@tanstack/react-query";
import { PostCard } from "../../Components/PostCard/PostCard";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import PostSidebar from "../../Components/PostSidebar/PostSidebar";
import { Bookmark as BookmarkIcon } from "iconsax-reactjs";
import { getSavedPosts } from "./Bookmark.services";
import CreatePost from "../../Components/CreatePost/CreatePost";

export default function SavedPostsPage() {
  const {
    data: savedPosts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });

  return (
    <div className="flex gap-5 justify-center max-w-7xl mx-auto pt-6 px-4 items-start pb-20 lg:pb-6">
      <div className="w-1/4 hidden lg:block sticky top-20 h-fit">
        <PostSidebar />
      </div>

      <div className="block lg:hidden">
        <PostSidebar />
      </div>

      <div className="flex-1 flex flex-col gap-4 max-w-2xl">
        <div>
          <CreatePost />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Loading saved posts...
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500 text-sm">
            Failed to load saved posts.
          </div>
        ) : savedPosts.length > 0 ? (
          savedPosts.map((post: any) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2">
            <BookmarkIcon size="48" color="#9ca3af" variant="Outline" />
            <p className="text-gray-500 text-sm font-medium">
              No saved posts yet
            </p>
            <span className="text-xs text-gray-400">
              Posts you save will appear here.
            </span>
          </div>
        )}
      </div>

      <div className="w-1/4 hidden xl:block sticky top-20 h-fit">
        <SuggestedFriends />
      </div>
    </div>
  );
}