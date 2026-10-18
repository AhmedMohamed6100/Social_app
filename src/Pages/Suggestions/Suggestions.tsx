import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Avatar } from "@heroui/react";
import { ArrowLeft, SearchNormal1, UserAdd, UserTick, UserSearch } from "iconsax-reactjs";
import { toggleFollowUser } from "./FollowerUSer.services";
import { GetSuggestedFriends } from "../../Components/SuggestedFriends/SuggestedFriends.services";

export default function Suggestions() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const navigate = useNavigate(); 

  const { data, isLoading } = useQuery({
    queryKey: ["allSuggestedFriends", searchQuery],
    queryFn: () => GetSuggestedFriends("", searchQuery),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => toggleFollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSuggestedFriends"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedFriends"] });
    },
  });

  const suggestedUsers = data?.data?.suggestions || [];
  const totalCount = data?.meta?.pagination?.total || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div>
        <button
          onClick={() => navigate("/")} 
          className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-xs cursor-pointer"
        >
          <ArrowLeft size="16" />
          Back to feed
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col gap-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <UserSearch size="24" color="#2563eb" variant="Outline" />
            <h1 className="font-bold text-gray-900 text-lg">All Suggested Friends</h1>
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-semibold">
            {totalCount}
          </span>
        </div>

        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400">
            <SearchNormal1 size="18" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading suggested friends...</div>
        ) : suggestedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedUsers.map((user: any) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 transition shadow-2xs"
              >
                <div
                  onClick={() => {
                    console.log("Clicked User ID for Profile Navigation:", user._id);
                    navigate(`/UsersProfile/${user._id}`);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <Avatar.Image alt={user.name} src={user.photo} />
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-gray-900 hover:underline">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-gray-500">@{user.username}</span>
                    <span className="text-[10px] text-gray-400 mt-1 bg-gray-50 px-2 py-0.5 rounded-md w-fit">
                      {user.followersCount} followers
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => followMutation.mutate(user._id)}
                  disabled={followMutation.isPending}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex-shrink-0 ${
                    user.isFollowing
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  {followMutation.isPending && followMutation.variables === user._id ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            No suggestions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}