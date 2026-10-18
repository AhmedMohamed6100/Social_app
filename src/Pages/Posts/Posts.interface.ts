export interface AllPostsResponseType {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  posts: Post[]
}

export interface Post {
  _id: string
  body?: string
  image?: string
  privacy: string
  user: User
  sharedPost?: SharedPost
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment?: TopComment2
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
}

export interface SharedPost {
  _id: string
  body: string
  image?: string
  privacy: string
  user: User2
  sharedPost: any
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment?: TopComment
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
}

export interface User2 {
  _id: string
  name: string
  username: string
  photo: string
}

export interface TopComment {
  _id: string
  content: string
  commentCreator: CommentCreator
  post: string
  parentComment: any
  likes: any[]
  createdAt: string
}

export interface CommentCreator {
  _id: string
  name: string
  username: string
  photo: string
}

export interface TopComment2 {
  _id: string
  content: string
  commentCreator: CommentCreator2
  post: string
  parentComment: any
  likes: string[]
  createdAt: string
}

export interface CommentCreator2 {
  _id: string
  name: string
  username: string
  photo: string
}

export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
  total: number
}
