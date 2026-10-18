import {
  FieldError,
  Form,
  Input,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { loginSchema } from "./login.zod";
import type { LoginUserDataType } from "./login.interface";
import { userLogin } from "./login.services";
import AppButton from "../../SharedComponet/AppButton/AppButton";
import { useContext } from "react";
import { UserAuthContext } from "../../Context/UserAuthProvider/UserAuthProvider";
import AuthLeftSide from "../../Components/AuthLeftSide/AuthLeftSide";

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginUserDataType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const router = useNavigate();
  const { setUserData } = useContext(UserAuthContext);

  function sendUserData(data: LoginUserDataType) {
    toast.promise(userLogin(data), {
      loading: "Logging in...",
      success: function (res) {
        localStorage.setItem("user_tkn", res.data.token);
        setUserData(res.data.user);
        reset();
        router("/");
        return <h1 className="text-emerald-500 capitalize">{res.message}</h1>;
      },
      error: (err) => (
        <h1 className="text-red-500 capitalize">{err.message}</h1>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* ===== Left Side ===== */}
        <AuthLeftSide />

        {/* ===== Right Side - Login Card ===== */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                className="flex-1 py-2.5 text-sm font-semibold text-[#0a2e6e] bg-white rounded-lg shadow-sm"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => router("/register")}
                className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Register
              </button>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Log in to Route Posts
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Log in and continue your social journey.
              </p>
            </div>

            {/* Form */}
            <Form
              onSubmit={handleSubmit(sendUserData)}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <TextField isRequired type="email" isInvalid={!!errors.email}>
                <Input
                  aria-label="Email"
                  {...register("email")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  placeholder="Email or username"
                  autoComplete="off"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              {/* Password */}
              <TextField isRequired type="password" isInvalid={!!errors.password}>
                <Input
                aria-label="password"
                  {...register("password")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  placeholder="Password"
                  autoComplete="off"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              {/* Submit */}
              <AppButton
                isDisabled={isSubmitting}
                className="w-full bg-[#0a2e6e] hover:bg-[#08255a] text-white font-semibold py-3.5 rounded-xl transition text-sm mt-2"
                type="submit"
              >
                Log In
              </AppButton>

              {/* Forgot Password */}
              <div className="text-center mt-2">
                <a
                  href="#forgot"
                  className="text-sm text-[#0a2e6e] font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}