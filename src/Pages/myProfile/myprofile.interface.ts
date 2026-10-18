export interface GetMyProfile {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  user: User
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  cover: string
  bookmarks: any[]
  followers: string[]
  following: any[]
  createdAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
