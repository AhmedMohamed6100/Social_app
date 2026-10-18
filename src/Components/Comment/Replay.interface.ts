export interface GetAllReplayComment {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  replies: Reply[]
}

export interface Reply {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: string
  likes: any[]
  createdAt: string
  likesCount: number
  isReply: boolean
  id: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  limit: number
  total: number
  numberOfPages: number
}
