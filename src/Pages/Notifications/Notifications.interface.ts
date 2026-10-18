export interface NotificationUser {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  notifications: Notification[]
}

export interface Notification {
  _id: string
  recipient: Recipient
  actor: Actor
  type: string
  entityType: string
  entityId: string
  isRead: boolean
  createdAt: string
  entity: Entity
}

export interface Recipient {
  _id: string
  name: string
  photo: string
}

export interface Actor {
  _id: string
  name: string
  photo: string
}

export interface Entity {
  _id: string
  user?: string
  commentsCount?: number
  topComment?: TopComment
  sharesCount?: number
  likesCount?: number
  isShare?: boolean
  id: string
  name?: string
  username?: string
  photo?: string
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
  body?: string
}

export interface TopComment {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: string[]
  createdAt: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
}

export interface Meta {
  feedMode: string
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
}
