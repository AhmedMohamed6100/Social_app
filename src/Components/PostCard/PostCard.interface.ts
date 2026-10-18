export interface PostDetailsResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  post: Post
}

export interface Post {
  _id: string
  body: string
  privacy: string
  user: User
  sharedPost: any
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment: any
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
