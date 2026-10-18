import { Avatar } from "@heroui/react";
import { SearchNormal1, UserAdd, UserTick, UserSearch } from "iconsax-reactjs";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSuggestedFriends } from "./SuggestedFriends.services";
import { Link, useNavigate } from "react-router";
import { toggleFollowUser } from "../../Pages/Suggestions/FollowerUSer.services";

export default function SuggestedFriends() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 

  const { data, isLoading } = useQuery({
    queryKey: ["suggestedFriends", searchQuery],
    queryFn: () => GetSuggestedFriends(searchQuery, 1),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => toggleFollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedFriends"] });
      queryClient.invalidateQueries({ queryKey: ["allSuggestedFriends"] });
    },
  });

  const suggestedUsers = data?.data?.suggestions || [];
  const totalCount = data?.meta?.pagination?.total || 0;

  return (
    <div className="fixed bg-white border border-gray-200 rounded-2xl p-4 shadow-sm w-1/2 max-w-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <UserSearch size="22" color="#2563eb" variant="Outline" />
          <h3 className="font-bold text-gray-900 text-sm">Suggested Friends</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
          {totalCount}
        </span>
      </div>

      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400">
          <SearchNormal1 size="18" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
        {isLoading ? (
          <p className="text-xs text-gray-400 text-center py-4">Loading...</p>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.map((user: any) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2.5 border border-gray-100 rounded-xl bg-white hover:border-gray-200 transition shadow-2xs"
            >
              {/* 👈 هنا تم إضافة الـ console.log و الـ navigate بدون Reload */}
              <div 
                onClick={() => {
                  console.log("Sidebar Clicked - User ID:", user._id);
                  navigate(`/UsersProfile/${user._id}`);
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <Avatar.Image alt={user.name} src={user.photo} />
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-gray-900 hover:underline">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    @{user.username}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {user.followersCount} followers
                  </span>
                </div>
              </div>

              {/* زرار الـ Follow */}
              <button
                onClick={() => followMutation.mutate(user._id)}
                disabled={followMutation.isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
                  user.isFollowing
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                }`}
              >
                {followMutation.isPending && followMutation.variables === user._id ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : user.isFollowing ? (
                  <UserTick size="14" />
                ) : (
                  <UserAdd size="14" />
                )}

                <span>
                  {followMutation.isPending && followMutation.variables === user._id
                    ? "Loading..."
                    : user.isFollowing
                    ? "Following"
                    : "Follow"}
                </span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">
            No suggestions found
          </p>
        )}
      </div>

      <Link
        to="/Suggestions"
        className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer border border-gray-200 shadow-2xs text-center block"
      >
        View more
      </Link>
    </div>
  );
}