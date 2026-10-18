import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "./Notifications.services";
import { Avatar } from "@heroui/react";
import { useState } from "react";
import { Message, Heart, TickCircle, Notification as NotifIcon, Check } from "iconsax-reactjs";
import Loading from "../../Components/Loading/Loading";
import { formatTimeAgo } from "../../Components/PostCard/PostCard";



export default function Notifications() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    refetchOnWindowFocus: false,
  });

const markOneMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const notificationsList = data?.data?.notifications || [];

  const filteredNotifications = notificationsList.filter((notif) => {
    if (activeTab === "unread") return !notif.isRead;
    return true;
  });

 const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-red-500 font-semibold">
        {error?.message || "Failed to load notifications"}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-6 px-4 pb-12 flex flex-col gap-6">
      
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-500 mt-1">
            Realtime updates for likes, comments, shares, and follows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending || unreadCount === 0}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Check size="16" className="text-gray-600" />
          <span>{markAllMutation.isPending ? "Marking..." : "Mark all as read"}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveTab("unread")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === "unread"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === "unread" ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-600"}`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            let actionText = "interacted with your post";
            if (notif.type === "comment") actionText = "commented on your post";
            if (notif.type === "like") actionText = "liked your post";
            if (notif.type === "follow") actionText = "started following you";

            return (
              <div
                key={notif._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-md"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <Avatar className="w-11 h-11 border border-gray-100 shrink-0">
                    <Avatar.Image src={notif.actor?.photo || "/default-avatar.png"} alt={notif.actor?.name} />
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-800">
                      <span className="font-bold text-gray-900">{notif.actor?.name}</span>{" "}
                      <span className="text-gray-500">{actionText}</span>
                    </p>

                    {notif.entity?.body && (
                      <p className="text-xs text-gray-600 line-clamp-1 mt-0.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        {notif.entity.body}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2">
                      {notif.type === "comment" && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Message size="16" variant="Outline" />
                        </div>
                      )}
                      {notif.type === "like" && (
                        <div className="flex items-center gap-1 text-red-500">
                          <Heart size="16" variant="Bold" />
                        </div>
                      )}

                      {notif.isRead ? (
                        <div className="flex items-center gap-1 text-green-600 text-[11px] font-medium">
                          <TickCircle size="14" variant="Bold" />
                          <span>Read</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markOneMutation.mutate(notif._id)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[11px] font-semibold cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg transition"
                        >
                          <TickCircle size="14" />
                          <span>Mark as read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center text-xs text-gray-400">
                  <span>{formatTimeAgo(notif.createdAt)}</span>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
              <NotifIcon size="24" color="#2563eb" variant="Outline" />
            </div>
            <h3 className="text-base font-bold text-gray-800">No notifications found</h3>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              You are all caught up! There are no notifications to display right now.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}