import { Avatar } from "@heroui/react";
import { Image as ImageIcon, EmojiHappy, Send2, CloseCircle } from "iconsax-reactjs";
import { useState, useContext, useRef } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateUserComment } from "./CreateComment.services";

export default function CreateComment({ postId }: { postId: string }) {
  const { userData } = useContext(UserAuthContext);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  if (!userData) return null;
  const { name, photo } = userData;

  const emojisList = ["😀", "❤️", "🔥", "👍", "😂", "🎉", "👏", "😍", "😢"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCommentImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    setShowEmojis(false); 
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !commentImage) return;

    const myFormData = new FormData();
    
    let finalContent = commentText.trim();
    if (finalContent.length < 2) {
      finalContent = commentImage ? "..." : finalContent; 
    }

    myFormData.append("content", finalContent);
    
    if (commentImage) {
      myFormData.append("image", commentImage);
    }

    toast.promise(
      CreateUserComment(postId, myFormData),
      {
        loading: "Adding comment...",
        success: (response: any) => {
          setCommentText("");
          setCommentImage(null);
          setImagePreview(null);

          // استخراج الكومنت الجديد من الـ Response أياً كان شكل الـ Backend
          const newComment = response?.data?.comment || response?.comment || response;

          // تحديث الكاش للتعليقات فوراً لتظهر في الواجهة بدون ريلود
          queryClient.setQueryData(["postsComments", postId], (oldComments: any = []) => {
            if (Array.isArray(oldComments)) {
              return [newComment, ...oldComments];
            }
            return [newComment];
          });

          queryClient.setQueryData(["PostDetails", postId], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              comments: [newComment, ...(oldData.comments || [])],
            };
          });

          // مزامنة في الخلفية للتأكد من صحة البيانات
          queryClient.invalidateQueries({ queryKey: ["PostDetails", postId] });
          queryClient.invalidateQueries({ queryKey: ["postsComments", postId] });
          queryClient.invalidateQueries({ queryKey: ["posts"] });

          return "Comment added successfully!";
        },
        error: (err: any) => err?.response?.data?.message || "Failed to add comment",
      }
    );
  };

  return (
    <form onSubmit={handleCommentSubmit} className="flex gap-2 items-start pt-3 mt-2 border-t border-gray-100 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <Avatar className="w-8 h-8 shrink-0">
        <Avatar.Image alt={name} src={photo} />
      </Avatar>

      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-2 focus-within:border-blue-500 transition relative">
        
        {imagePreview && (
          <div className="relative inline-block w-fit mt-1">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg object-cover border border-gray-200" />
            <button
              type="button"
              onClick={() => {
                setCommentImage(null);
                setImagePreview(null);
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700 shadow-sm cursor-pointer"
            >
              <CloseCircle size="20" variant="Bold" />
            </button>
          </div>
        )}

        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`Comment as ${name}...`}
          className="bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none w-full"
        />

        {showEmojis && (
          <div className="absolute bottom-12 left-2 bg-white border border-gray-200 shadow-lg rounded-xl p-2 flex gap-1 z-50 flex-wrap w-48">
            {emojisList.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="hover:bg-gray-100 p-1.5 rounded-lg text-base transition cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-gray-500">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              <ImageIcon size="16" color="#6b7280" variant="Outline" />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojis((prev) => !prev)}
              className="hover:text-yellow-600 transition cursor-pointer"
            >
              <EmojiHappy size="16" color="#6b7280" variant="Outline" />
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full transition cursor-pointer flex items-center justify-center shadow-xs"
          >
            <Send2 size="14" color="#ffffff" variant="Bold" />
          </button>
        </div>
      </div>
    </form>
  );
}