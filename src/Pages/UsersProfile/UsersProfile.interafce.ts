export interface GetUSerProfile {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  isFollowing: boolean
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
  followers: Follower[]
  following: any[]
  createdAt: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}

export interface Follower {
  _id: string
  name: string
  photo: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  id: string
}
