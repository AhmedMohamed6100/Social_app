import { Card, Avatar } from "@heroui/react";
import {
  Global,
  Like1,
  Message,
  Repeat,
  SaveAdd,
  Share,
  More,
  CloseSquare,
  Edit,
  Trash,
} from "iconsax-reactjs";
import type { Post } from "../../Pages/Posts/Posts.interface";
import { useState, useContext } from "react";
import { Link } from "react-router";
import { getpostComments } from "../Comment/Comment.services";
import Comment from "../Comment/Comment";
import CreateComment from "../CreateComment/CreateComment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import {
  createPostShare,
  DeletePost,
  togglePostBookmark,
  togglePostLike,
  UpdatePost,
} from "../../Pages/Posts/Posts.services";

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function PostCard({
  post,
  isDetails = false,
}: {
  post: Post;
  isDetails?: boolean;
}) {
  const { userData } = useContext(UserAuthContext);
  const currentUserId = userData?._id || userData?.id;

  const [isOpen, setIsOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareBody, setShareBody] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBody, setEditBody] = useState(post.body || "");
  const [editImage, setEditImage] = useState<File | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    createdAt,
    _id,
    commentsCount,
    body,
    user,
    image,
    topComment,
    sharesCount,
    likesCount,
    likes,
    bookmarked,
    privacy,
  } = post;

  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState<boolean>(
    Boolean(currentUserId && likes?.includes(currentUserId)),
  );
  const [likesCountState, setLikesCountState] = useState<number>(
    likesCount ?? likes?.length ?? 0,
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked);

  const isOwner = currentUserId === user?._id;

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(_id),
    onMutate: () => {
      setIsLiked((prev) => !prev);
      setLikesCountState((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      setIsLiked((prev) => !prev);
      setLikesCountState((prev) => (isLiked ? prev + 1 : prev - 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => togglePostBookmark(_id),
    onMutate: () => {
      setIsBookmarked((prev) => !prev);
    },
    onError: () => {
      setIsBookmarked((prev) => !prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: (formData: FormData) => createPostShare(_id, formData),
    onSuccess: () => {
      setIsShareModalOpen(false);
      setShareBody("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => DeletePost(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.refetchQueries({ queryKey: ["posts"] });
      queryClient.refetchQueries({ queryKey: ["userPosts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => UpdatePost(_id, formData),
    onSuccess: (updatedResponse) => {
      setIsEditModalOpen(false);
      setEditImage(null);

      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.map((p: any) =>
            p._id === _id ? { ...p, ...updatedResponse?.data?.post } : p,
          );
        }
        return oldData;
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["postComments", _id] });
      queryClient.refetchQueries({ queryKey: ["posts"] });
    },
  });

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (shareBody.trim()) {
      formData.append("body", shareBody);
    }
    shareMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (editBody.trim()) {
      formData.append("body", editBody);
    }
    if (editImage) {
      formData.append("image", editImage);
    }
    updateMutation.mutate(formData);
  };

  const { data: rawComments } = useQuery({
    queryKey: ["postComments", _id],
    queryFn: () => getpostComments(_id),
    enabled: showAllComments || isDetails,
  });

  const allComments = Array.isArray(rawComments)
    ? rawComments
    : (rawComments as any)?.comments ||
      (rawComments as any)?.data?.comments ||
      [];

  return (
    <Card className="w-full p-4 shadow-md rounded-xl bg-white relative">
      <Card.Header className="flex flex-col gap-3 pb-3 border-b">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar>
              <Avatar.Image alt={user?.name} src={user?.photo} />
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm text-gray-900">{user?.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>
                  @
                  {user?.username ||
                    user?.name?.toLowerCase().replace(/\s+/g, "")}
                </span>
                <span>•</span>
                <span>{formatTimeAgo(createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Global size="15" color="#040404" variant="Outline" />
                  <span>{privacy}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 font-bold p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <More size="20" color="#6b7280" variant="Outline" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    bookmarkMutation.mutate();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <SaveAdd
                    size="18"
                    color="#0d0d0e"
                    variant={isBookmarked ? "Bold" : "Outline"}
                  />
                  <span>{isBookmarked ? "Remove Bookmark" : "Save Post"}</span>
                </button>

                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                      <Edit size="18" color="#374151" variant="Outline" />
                      <span>Edit post</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this post?",
                          )
                        ) {
                          deleteMutation.mutate();
                        }
                        setIsOpen(false);
                      }}
                      disabled={deleteMutation.isPending}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash size="18" color="#dc2626" variant="Outline" />
                      <span>
                        {deleteMutation.isPending
                          ? "Deleting..."
                          : "Delete post"}
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Card.Header>

      {body && (
        <div className="py-1 text-sm text-gray-800 whitespace-pre-wrap">
          <p>{body}</p>
        </div>
      )}

      {image && !post.sharedPost && (
        <div className="py-3">
          <div
            onClick={() => setPreviewImage(image)}
            className="rounded-lg overflow-hidden border border-gray-100 bg-black flex justify-center cursor-pointer group relative"
          >
            <img
              src={image}
              alt="Post content"
              className="max-h-[500px] object-contain w-full transition duration-300 group-hover:opacity-95"
            />
          </div>
        </div>
      )}

      {post.isShare && post.sharedPost && (
        <div className="mt-2 border border-gray-200 rounded-2xl p-3 bg-gray-50/70 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 shrink-0">
              <Avatar.Image
                alt={post.sharedPost.user?.name}
                src={post.sharedPost.user?.photo}
              />
            </Avatar>
            <div className="flex flex-col">
              <h4 className="font-bold text-xs text-gray-900">
                {post.sharedPost.user?.name}
              </h4>
              <span className="text-[10px] text-gray-500">
                @{post.sharedPost.user?.username || "user"}
              </span>
            </div>
          </div>

          {post.sharedPost.body && (
            <p className="text-xs text-gray-800">{post.sharedPost.body}</p>
          )}

          {post.sharedPost.image && (
            <div
              onClick={() => setPreviewImage(post.sharedPost?.image ?? null)}
              className="rounded-xl overflow-hidden border border-gray-200 bg-black flex justify-center max-h-[350px] cursor-pointer group relative"
            >
              <img
                src={post.sharedPost.image}
                alt="Shared post content"
                className="object-cover w-full max-h-[350px] transition duration-300 group-hover:opacity-95"
              />
            </div>
          )}
        </div>
      )}

      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition cursor-pointer"
            >
              <CloseSquare size="28" variant="Outline" />
            </button>
            {/* الصورة المكبرة */}
            <img
              src={previewImage}
              alt="Enlarged view"
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-b border-gray-100 px-1">
        <div className="flex items-center gap-1">
          <span className="bg-blue-500 text-white p-1 rounded-full text-[10px] flex items-center justify-center">
            <Like1 size="12" color="#ffffff" variant="Bold" />
          </span>
          <span>{likesCountState} likes</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Repeat size="15" color="#060606" variant="Outline" />
            <span>{sharesCount} shares</span>
          </div>
          <span>{commentsCount} comments</span>

          {!isDetails && (
            <Link
              to={`/PostDetails/${_id}`}
              className="text-blue-600 font-semibold cursor-pointer hover:underline text-xs"
            >
              <span>View details</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-around py-1.5 border-b border-gray-100 text-gray-600 font-medium text-sm">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-2 hover:bg-gray-50 flex-1 justify-center py-1.5 rounded-lg transition cursor-pointer font-semibold ${
            isLiked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <Like1
            size="22"
            color={isLiked ? "#2563eb" : "#020202"}
            variant={isLiked ? "Bold" : "Outline"}
          />
          <span>{isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowAllComments((prev) => !prev)}
          className="flex items-center gap-2 hover:bg-gray-50 flex-1 justify-center py-1.5 rounded-lg transition cursor-pointer"
        >
          <Message size="22" color="#000000" variant="Outline" />
          Comment
        </button>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 hover:bg-gray-50 flex-1 justify-center py-1.5 rounded-lg transition cursor-pointer"
        >
          <Share size="22" color="#080808" variant="Outline" />
          Share
        </button>
      </div>

      {/* مودال التعديل */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Edit Post</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
              >
                <CloseSquare size="22" variant="Outline" />
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="p-5 flex flex-col gap-4"
            >
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600">
                  Change or add image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setEditImage(e.target.files[0]);
                    }
                  }}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Share post</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
              >
                <CloseSquare size="22" variant="Outline" />
              </button>
            </div>

            <form
              onSubmit={handleShareSubmit}
              className="p-5 flex flex-col gap-4"
            >
              <textarea
                value={shareBody}
                onChange={(e) => setShareBody(e.target.value)}
                placeholder="Say something about this..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shareMutation.isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {shareMutation.isPending ? "Sharing..." : "Share now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-3">
        {isDetails ? (
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <div className="flex items-center gap-1.5 font-bold">
                <span>Comments</span>
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  {commentsCount}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {allComments.length > 0 ? (
                allComments.map((comment: any) => (
                  <Comment
                    key={comment._id}
                    Comment={comment}
                    postId={_id}
                    postOwnerId={user?._id}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-xs text-center py-2">
                  No comments yet.
                </p>
              )}
            </div>

            <CreateComment postId={_id} />
          </div>
        ) : (
          <>
            {showAllComments ? (
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>Comments</span>
                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">
                      {commentsCount}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {allComments.length > 0 ? (
                    allComments.map((comment: any) => (
                      <Comment
                        key={comment._id}
                        Comment={comment}
                        postId={_id}
                        postOwnerId={user?._id}
                      />
                    ))
                  ) : (
                    <p className="text-gray-400 text-xs text-center py-2">
                      No comments yet.
                    </p>
                  )}
                </div>

                <CreateComment postId={_id} />

                <button
                  onClick={() => setShowAllComments(false)}
                  className="text-xs text-blue-500 font-semibold hover:underline text-center py-1 cursor-pointer"
                >
                  Hide comments
                </button>
              </div>
            ) : (
              <>
                {topComment && (
                  <Comment
                    Comment={topComment}
                    postId={_id}
                    postOwnerId={user?._id}
                  />
                )}

                {commentsCount > 0 && (
                  <button
                    onClick={() => setShowAllComments(true)}
                    className="text-xs text-gray-500 font-medium hover:text-blue-600 pt-2 transition cursor-pointer"
                  >
                    View all comments ({commentsCount})
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}