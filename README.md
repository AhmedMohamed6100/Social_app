#  Route Posts — Social Media Web Application

A full-featured, modern, and high-performance Social Media Single Page Application (SPA) built using **React 19**, **TypeScript**, **Tailwind CSS**, and **TanStack Query (React Query v5)**. 

Designed and developed with a smooth user experience, optimistic UI updates, real-time-like comment replies, and robust profile management.

---

##  Developer Information

* **Developer:** Ahmed Mohamed Gouda
* **Role:** Full-Stack / Front-End Software Engineer
* **University:** 6th of October Technological University (Faculty of Industrial and Energy Technology — IT Department)

---

##  Key Features

* **Authentication & Authorization:** Secure user authentication using JWT and custom Axios Interceptors.
* **Feed & Posts:**
  * Create, update, share, and delete posts with text and image attachments (`FormData` support).
  * Smooth infinite-like post interactions (Likes, Shares, and Bookmarks/Save Post).
  * Dynamic post updates and cache invalidation without full-page reloads.
* **Interactive Comments & Replies System:**
  * Top comments preview and detailed view.
  * Multi-level nested replies for comments.
  * Emoji picker support and comment image attachments.
  * Live comment editing and deletion.
* **User Profiles (`MyProfile` & `UsersProfile`):**
  * SPA navigation between profiles without page reloads.
  * Dynamic cover photo & avatar displays.
  * Tabbed views for **My Posts** and **Saved Posts (Bookmarks)** with live counters.
  * Follow / Unfollow user logic.

---

##  Tech Stack & Libraries

### **Front-End Architecture**
* **Framework / Library:** React 19, Vite
* **Language:** TypeScript
* **State & Data Fetching:** TanStack Query v5 (`@tanstack/react-query`)
* **Routing:** React Router v7
* **HTTP Client:** Axios (with custom Interceptors)

### **UI & Styling**
* **Styling Framework:** Tailwind CSS
* **Component Library:** HeroUI (`@heroui/react`)
* **Icons:** Iconsax React (`iconsax-reactjs`)
* **Utilities:** `emoji-picker-react`

