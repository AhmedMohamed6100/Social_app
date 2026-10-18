import { Avatar } from "@heroui/react";
import type { TopComment } from "../../Pages/Posts/Posts.interface";
import { formatTimeAgo } from "../PostCard/PostCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleCommentLike, deleteComment, createCommentReply, editComment } from "../CreateComment/CreateComment.services";
import { useContext, useState, useRef } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { More, Edit, Trash, Heart, Gallery, EmojiHappy, Send2, CloseCircle } from "iconsax-reactjs";
import EmojiPicker from "emoji-picker-react";
import { getCommentReplies } from "./Comment.services";
import type { Reply } from "./Replay.interface";


export default function Comment({
  Comment,
  postId,
  isTop = false,
}: {
  Comment: TopComment & { image?: string; replies?: any[]; repliesCount?: number };
  postId: string;
  isTop?: boolean;
}) {
  const { userData } = useContext(UserAuthContext);
  const currentUserId = userData?._id || userData?.id;

  const { commentCreator, content, createdAt, image, likes, _id: commentId, repliesCount } = Comment;

  const queryClient = useQueryClient();

  const [showRepliesSection, setShowRepliesSection] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLiked, setIsLiked] = useState<boolean>(likes?.includes(currentUserId));
  const [likesCountState, setLikesCountState] = useState<number>(likes?.length ?? 0);

  const { data: serverReplies = [], refetch: refetchReplies } = useQuery({
    queryKey: ["commentReplies", postId, commentId],
    queryFn: () => getCommentReplies(postId, commentId),
    enabled: showRepliesSection,
  });

  // 1. Like Mutation
  const likeMutation = useMutation({
    mutationFn: () => toggleCommentLike(postId, commentId),
    onMutate: () => {
      setIsLiked((prev) => !prev);
      setLikesCountState((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      setIsLiked((prev) => !prev);
      setLikesCountState((prev) => (isLiked ? prev + 1 : prev - 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
  });

  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
  });

  // 3. Edit Mutation
  const editMutation = useMutation({
    mutationFn: (newContent: string) => {
      const formData = new FormData();
      formData.append("content", newContent);
      return editComment(postId, commentId, formData);
    },
    onSuccess: () => {
      setIsEditing(false);
      setIsMenuOpen(false);
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
  });

  // 4. Reply Mutation
  const replyMutation = useMutation({
    mutationFn: (formData: FormData) => createCommentReply(postId, commentId, formData),
    onSuccess: (response: any) => {
      setReplyText("");
      setSelectedImage(null);
      setImagePreview(null);
      setShowEmojiPicker(false);
      setShowRepliesSection(true);

      const newReply = response?.data?.reply || response?.reply || response?.data?.data || response;

      queryClient.setQueryData(["commentReplies", postId, commentId], (oldReplies: any = []) => {
        const list = Array.isArray(oldReplies) ? oldReplies : (oldReplies?.data?.replies || []);
        return [...list, newReply];
      });

      refetchReplies();
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    setReplyText((prev) => prev + emojiData.emoji);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !selectedImage) return;

    console.log("🚀 [DEBUG] Sending reply -> Post ID:", postId, "| Comment ID:", commentId);

    const formData = new FormData();
    if (replyText.trim()) formData.append("content", replyText);
    if (selectedImage) formData.append("image", selectedImage);

    replyMutation.mutate(formData);
  };

  const handleUpdateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;
    editMutation.mutate(editText);
  };

  const isOwner = currentUserId === commentCreator?._id;
  const totalReplies = serverReplies.length > 0 ? serverReplies.length : (repliesCount ?? 0);
  const username = commentCreator?.username || commentCreator?.name?.toLowerCase().replace(/\s+/g, "") || "user";

  return (
    <div className="flex flex-col gap-2 py-2">
      {/* الكومنت الرئيسي */}
      <div className="flex items-start gap-3 group relative">
        <Avatar className="w-9 h-9 shrink-0">
          <Avatar.Image alt={commentCreator?.name || "User"} src={commentCreator?.photo || ""} />
          <Avatar.Fallback>{commentCreator?.name?.split(" ").map((n) => n[0]).join("") || "U"}</Avatar.Fallback>
        </Avatar>

        <div className="flex flex-col flex-1">
          {isTop && (
            <span className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Top Comment</span>
          )}

          {/* مربع الكومنت */}
          <div className="bg-gray-100/80 rounded-2xl px-4 py-3 max-w-xl relative group/box">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-900 hover:underline cursor-pointer">
                  {commentCreator?.name || "User"}
                </span>
                <span className="text-[11px] text-gray-400">@{username}</span>
                <span className="text-[11px] text-gray-400">· {formatTimeAgo(createdAt)}</span>
              </div>

              {/* القائمة 3 نقاط للتعديل/الحذف */}
              {isOwner && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded-full hover:bg-gray-200 transition"
                  >
                    <More size="16" color="#6b7280" variant="Outline" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Edit size="14" color="#374151" variant="Outline" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteMutation.mutate();
                          setIsMenuOpen(false);
                        }}
                        disabled={deleteMutation.isPending}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash size="14" color="#dc2626" variant="Outline" />
                        <span>{deleteMutation.isPending ? "Deleting..." : "Delete"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* محتوى الكومنت */}
            {isEditing ? (
              <form onSubmit={handleUpdateComment} className="mt-2 flex flex-col gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-[11px] text-gray-500 hover:underline cursor-pointer px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editMutation.isPending}
                    className="bg-blue-600 text-white text-[11px] font-semibold px-3 py-1 rounded-lg cursor-pointer"
                  >
                    {editMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {content && (
                  <p className="text-xs text-gray-800 mt-1.5 whitespace-pre-wrap leading-relaxed">{content}</p>
                )}
                {image && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-black flex justify-center max-h-[200px]">
                    <img src={image} alt="Comment attachment" className="object-contain max-h-[200px] w-full" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* أزرار التفاعل */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5 px-1 font-medium">
            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={`flex items-center gap-1 hover:underline cursor-pointer font-semibold transition ${
                isLiked ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Heart size="14" color={isLiked ? "#2563eb" : "#6b7280"} variant={isLiked ? "Bold" : "Outline"} />
              <span>{isLiked ? "Liked" : "Like"} ({likesCountState})</span>
            </button>

            <button
              onClick={() => {
                console.log("🖱️ [DEBUG] Clicked Reply button for Comment ID:", commentId);
                setShowRepliesSection((prev) => !prev);
              }}
              className="hover:underline cursor-pointer font-semibold"
            >
              {showRepliesSection
                ? "Hide replies"
                : totalReplies > 0
                ? `Reply (${totalReplies})`
                : "Reply"}
            </button>
          </div>
        </div>
      </div>

      {/* قسم الردود */}
      {showRepliesSection && (
        <div className="ml-5 border-l-2 border-blue-100 pl-6 flex flex-col gap-3 py-1">
          {serverReplies && serverReplies.length > 0 ? (
            <div className="flex flex-col gap-3">
              {serverReplies.map((reply: Reply) => (
                <div key={reply._id || reply.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <Avatar.Image alt={reply.commentCreator?.name} src={reply.commentCreator?.photo} />
                  </Avatar>
                  <div className="bg-gray-100/70 rounded-2xl px-3.5 py-2.5 max-w-md flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{reply.commentCreator?.name}</span>
                      <span className="text-[10px] text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                    </div>

                    {reply.content && <p className="text-xs text-gray-800 mt-1">{reply.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-1">No replies yet.</p>
          )}

          {/* فورم كتابة رد جديد */}
          <div className="flex items-start gap-3 mt-1">
            <Avatar className="w-8 h-8 shrink-0">
              <Avatar.Image alt={userData?.name} src={userData?.photo} />
            </Avatar>

            <form onSubmit={handleSendReply} className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-3 shadow-xs flex flex-col gap-2 relative">
              <span className="text-[11px] text-gray-400">
                Replying to <span className="font-semibold text-gray-600">{commentCreator?.name}</span>
              </span>
              
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full text-xs text-gray-800 focus:outline-none resize-none bg-transparent"
              />

              {imagePreview && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 text-white bg-black/60 rounded-full cursor-pointer"
                  >
                    <CloseCircle size="16" />
                  </button>
                </div>
              )}

              {showEmojiPicker && (
                <div className="absolute z-30 bottom-14 left-0">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={280}
                    height={350}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-gray-400">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:text-blue-600 cursor-pointer transition"
                  >
                    <Gallery size="18" color="#9ca3af" variant="Outline" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="hover:text-blue-600 cursor-pointer transition"
                  >
                    <EmojiHappy size="18" color="#9ca3af" variant="Outline" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={replyMutation.isPending || (!replyText.trim() && !selectedImage)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition cursor-pointer disabled:opacity-40 flex items-center justify-center shadow-sm"
                >
                  <Send2 size="16" color="#ffffff" variant="Bold" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}