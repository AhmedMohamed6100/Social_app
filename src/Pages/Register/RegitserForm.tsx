import {
  FieldError,
  Form,
  Input,
  TextField,
  ListBox,
  Select,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "iconsax-reactjs";
import { Controller, useForm } from "react-hook-form";
import { userRegister } from "./register.services";
import { registerSchema } from "./register.zod";
import type { UserDataType } from "./register.interface";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AppButton from "../../SharedComponet/AppButton/AppButton";
import AuthLeftSide from "../../Components/AuthLeftSide/AuthLeftSide";

function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm<UserDataType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    mode: "all",
    resolver: zodResolver(registerSchema),
  });

  const router = useNavigate();

  function sendUserData(data: UserDataType) {
    toast.promise(userRegister(data), {
      loading: "Please wait while registering...",
      success: function (data) {
        router("/login");
        return <h1 className="text-emerald-500 capitalize">{data}</h1>;
      },
      error: "Error",
    });
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* ===== Left Side ===== */}
       <AuthLeftSide />

        {/* ===== Right Side - Register Card ===== */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
            
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => router("/login")}
                className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Login
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 text-sm font-semibold text-[#0a2e6e] bg-white rounded-lg shadow-sm"
              >
                Register
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create an account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Join Route Posts and start connecting.
              </p>
            </div>

            <Form
              onSubmit={handleSubmit(sendUserData)}
              className="flex flex-col gap-4"
            >
              <TextField isRequired type="text" isInvalid={!!errors.name}>
                <Input
                aria-label="name"
                  {...register("name")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  placeholder="Full Name"
                  autoComplete="off"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              <TextField isRequired type="text" isInvalid={!!errors.username}>
                <Input
                aria-label="username"
                  {...register("username")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  placeholder="Username"
                  autoComplete="off"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              <TextField isRequired type="email" isInvalid={!!errors.email}>
                <Input
                aria-label="Email"
                  {...register("email")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  placeholder="Email"
                  autoComplete="off"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

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

              <TextField isRequired type="password" isInvalid={!!errors.rePassword}>
                <Input
                aria-label="repassword"
                  {...register("rePassword")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  placeholder="Confirm Password"
                  autoComplete="off"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              <TextField isRequired type="date" isInvalid={!!errors.dateOfBirth}>
                <Input
                aria-label="dateOfBirth"
                  {...register("dateOfBirth")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Gender"
                    isInvalid={!!errors.gender}
                    className="w-full"
                  >
                    <Select.Trigger className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="male" textValue="male">
                          Male
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="female" textValue="female">
                          Female
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />
              {errors.gender && (
                <span className="text-red-500 text-xs -mt-2">
                  {errors.gender?.message}
                </span>
              )}

              <AppButton
                isDisabled={isSubmitting}
                className="w-full bg-[#0a2e6e] hover:bg-[#08255a] text-white font-semibold py-3.5 rounded-xl transition text-sm mt-2 flex items-center justify-center gap-2"
                type="submit"
              >
                <Check size="18" />
                Sign Up
              </AppButton>

              <AppButton
                className="w-full border border-gray-200 text-gray-600 bg-red-400 hover:bg-gray-50 py-3 rounded-xl text-sm font-medium transition"
                type="reset"
              >
                Reset
              </AppButton>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;