import axiosInterceptors from "../../axiosinterceptors/axiosinterceptors";
import type { NotificationUser } from "./Notifications.interface";

export async function getNotifications(): Promise<NotificationUser> {
  try {
    const res = await axiosInterceptors.get("/notifications");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch your posts");
  }

}

export async function getUnreadCount() {
  try {
    const res = await axiosInterceptors.get("/notifications/unread-count");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch unread count");
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const res = await axiosInterceptors.patch(`/notifications/${notificationId}/read`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark as read");
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const res = await axiosInterceptors.patch("/notifications/read-all");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark all as read");
  }
}