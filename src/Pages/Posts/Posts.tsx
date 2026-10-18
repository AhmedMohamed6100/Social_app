import { GetAllPosts } from "./Posts.services";
import { PostCard } from "../../Components/PostCard/PostCard";
import PostSidebar from "../../Components/PostSidebar/PostSidebar";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import CreatePost from "../../Components/CreatePost/CreatePost";
import Loading from "../../Components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import { DocumentText } from "iconsax-reactjs";

function Posts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["AllPosts"],
    queryFn: () => GetAllPosts(),
    refetchInterval: 2000,
    refetchOnMount: false,
  });

  if (isError) {
    return (
      <h1 className="text-red-500 text-7xl text-center py-20">
        {error.message}
      </h1>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex gap-5 justify-center max-w-7xl mx-auto pt-6 px-4 items-start">
      <div className="w-1/4 hidden lg:block sticky top-20 h-fit">
        <PostSidebar />
      </div>

     
      <div className="flex-1 max-w-2xl w-full flex flex-col gap-5">
        <CreatePost />

        {data && data.length > 0 ? (
          data.map((e) => <PostCard key={e._id} post={e} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
              <DocumentText size="24" color="#2563eb" variant="Outline" />
            </div>

            <h3 className="text-base font-bold text-gray-800">
              No posts available
            </h3>
            <p className="text-xs text-gray-400 text-center max-w-x">
              There are no posts to display right now. Check back later or
              create a new post!
            </p>
          </div>
        )}
      </div>
      <div className="w-1/4 hidden xl:block sticky top-20 h-fit">
        <SuggestedFriends />
      </div>
    </div>
  );
}

export default Posts;
