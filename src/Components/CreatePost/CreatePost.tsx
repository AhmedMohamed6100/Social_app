import { Card, Avatar, TextArea } from "@heroui/react";
import {
  Global,
  Image as ImageIcon,
  EmojiHappy,
  Send2,
  CloseCircle,
  Profile,
  Profile2User,
} from "iconsax-reactjs";
import { useContext, useRef, useState } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import { useForm } from "react-hook-form";
import AppButton from "../../SharedComponet/AppButton/AppButton";
import toast from "react-hot-toast";
import { createUserPost } from "./CreatePost.services";
import { useMutation } from "@tanstack/react-query";

export default function CreatePost() {
  const { userData } = useContext(UserAuthContext);
  const inputFileUpload = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [privacy, setPrivacy] = useState("public");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  if (!userData) return null;

  const { name, photo } = userData;

  const { handleSubmit, register, reset, setValue } = useForm({
    defaultValues: {
      body: "",
      privacy: "public",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (inputFileUpload.current) {
      inputFileUpload.current.value = "";
    }
  };

  async function handleUserpost(data: { body: string; privacy: string }) {
    const myFormData = new FormData();
    myFormData.append("body", data.body);
    myFormData.append("privacy", data.privacy);

    const fileInput = inputFileUpload.current;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      myFormData.append("image", fileInput.files[0]);
    }

    await toast.promise(createUserPost(myFormData), {
      loading: "Please Wait....",
      success: () => {
        reset();
        removeImage();
        return "Post created successfully!";
      },
      error: (err: any) => err?.message || "Something went wrong",
    });
  }

  const { mutateAsync } = useMutation({
    mutationFn: handleUserpost,
  });

  return (
    <Card className="w-full p-4 shadow-md rounded-xl bg-white mb-5">
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit((data) => mutateAsync(data))}
      >
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <Avatar.Image alt="" src={photo} />
          </Avatar>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-sm text-gray-900">{name}</h3>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                className="flex items-center gap-1.5 text-xs bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-gray-700 font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                {privacy === "public" && (
                  <Global size="15" color="#374151" variant="Outline" />
                )}
                {privacy === "followrs" && (
                  <Profile2User size="15" color="#374151" variant="Outline" />
                )}
                {privacy === "onlyme" && (
                  <Profile size="15" color="#374151" variant="Outline" />
                )}

                <span className="capitalize">
                  {privacy === "onlyme" ? "Only Me" : privacy}
                </span>
                <span className="text-[10px]">▼</span>
              </button>

              {isPrivacyOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setPrivacy("public");
                      setValue("privacy", "public");
                      setIsPrivacyOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Global size="15" color="#374151" variant="Outline" />
                    <span>Public</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrivacy("followrs");
                      setValue("privacy", "followrs");
                      setIsPrivacyOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Profile2User size="15" color="#374151" variant="Outline" />
                    <span>followrs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrivacy("onlyme");
                      setValue("privacy", "onlyme");
                      setIsPrivacyOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Profile size="15" color="#374151" variant="Outline" />
                    <span>Only Me</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TextArea */}
        <div className="w-full">
          <TextArea
            {...register("body")}
            placeholder={`What's on your mind, ${name}?`}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-black flex justify-center max-h-[300px]">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-contain max-h-[300px] w-full"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black transition cursor-pointer"
            >
              <CloseCircle size="20" color="#ffffff" variant="Bold" />
            </button>
          </div>
        )}

        <hr className="border-gray-100 my-1" />

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer"
              onClick={() => inputFileUpload.current?.click()}
            >
              <ImageIcon size="18" color="#16a34a" variant="Outline" />
              <input
                type="file"
                hidden
                ref={inputFileUpload}
                accept="image/*"
                onChange={handleImageChange}
              />
              <span>Photo/video</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer"
            >
              <EmojiHappy size="18" color="#ca8a04" variant="Outline" />
              <span>Feeling/activity</span>
            </button>
          </div>

          <AppButton
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <span>Post</span>
            <Send2 size="15" color="#ffffff" variant="Outline" />
          </AppButton>
        </div>
      </form>
    </Card>
  );
}
