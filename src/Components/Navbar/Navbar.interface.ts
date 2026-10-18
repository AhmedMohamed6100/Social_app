export interface Data {
  photo: string;
  postId: string;
}

export interface ChangePhotoResponseType {
  data: Data;
  message: string;
  success: boolean;
}