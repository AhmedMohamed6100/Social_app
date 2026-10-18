import React, { useState } from "react";
import { Key } from "iconsax-reactjs";

export default function Setting() {
  const [formData, setFormData] = useState({
    passwordCurrent: "",
    password: "",
    rePassword: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // التحقق من الحقول الفارغة
    if (!formData.passwordCurrent || !formData.password || !formData.rePassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    // التحقق من تطابق كلمة المرور الجديدة
    if (formData.password !== formData.rePassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    // محاكاة عملية التحديث محلياً بدون API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Password updated successfully locally!");
      setFormData({ passwordCurrent: "", password: "", rePassword: "" });
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500">Manage your account settings and security preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Key size="20" variant="Outline" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Current password</label>
            <input
              type="password"
              name="passwordCurrent"
              value={formData.passwordCurrent}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">New password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
            <span className="text-[10px] text-gray-400">
              At least 8 characters with uppercase, lowercase, number, and special character.
            </span>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Confirm new password</label>
            <input
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}