import { GetPostDetails } from "../../Components/PostCard/PostCard.Services";
import { useParams, useNavigate } from "react-router"; // 👈 استبدلنا Link بـ useNavigate
import { PostCard } from "../../Components/PostCard/PostCard";
import Loading from "../../Components/Loading/Loading";
import { ArrowLeft } from "iconsax-reactjs";
import { useQuery } from "@tanstack/react-query";
import AppButton from "../../SharedComponet/AppButton/AppButton";

export default function PostDetails() {
  const { id, _id } = useParams<{ id?: string; _id?: string }>();
  const postId = id || _id; 

  const navigate = useNavigate(); 

  const {
    data: post,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["PostDetails", postId],
    queryFn: () => GetPostDetails(postId!),
    enabled: !!postId,
    refetchInterval: false, 
    refetchOnMount: false,
  });

  if (isError) {
    return <h1 className="text-red-500 text-7xl">{error.message}</h1>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!post) {
    return (
      <div className="text-center py-20 font-bold text-gray-600">
        Error loading post details.
      </div>
    );
  }
  return (
    <div className="pt-2 max-w-3xl mx-auto px-4">
      <div className="inline-block mb-4">
        <AppButton 
          onClick={() => navigate(-1)} 
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm transition cursor-pointer"
        >
          <ArrowLeft size="18" />
          <span>Back</span>
        </AppButton>
      </div>

      <PostCard post={post} isDetails={true} />
    </div>
  );
}