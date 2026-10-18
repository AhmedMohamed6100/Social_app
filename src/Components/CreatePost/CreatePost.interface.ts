export interface CreatePostResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  post: Post
}

export interface Post {
  body: string
  privacy: string
  user: string
  sharedPost: any
  likes: any[]
  _id: string
  createdAt: string
  likesCount: number
  isShare: boolean
  id: string
}
