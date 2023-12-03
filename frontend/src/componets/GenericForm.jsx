import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, signup, changePassword } from "../actions";
import { useNavigate } from "react-router-dom";

const GenericForm = ({ formType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formType === "signup") {
        await dispatch(
          signup(
            formData.email,
            formData.username,
            formData.password,
            formData.confirmPassword
          )
        );
        // If the dispatch is successful, navigate to "/login"
        navigate("/login");
      } else if (formType === "login") {
        await dispatch(login(formData.email, formData.password));
        // If the dispatch is successful, navigate to "/Dashboard"
        navigate("/Dashboard");
      } else {
        await dispatch(
          changePassword(
            formData.oldPassword,
            formData.newPassword,
            formData.confirmPassword
          )
        );
        // If the dispatch is successful, navigate to "/Dashboard"
        navigate("/Dashboard");
      }
    } catch (error) {
      // Handle errors if needed
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-#181b21">
      <div className="bg-slate-950 p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-white">
          {formType === "login"
            ? "Login"
            : formType === "signup"
            ? "Sign Up"
            : "Change Password"}
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {(formType === "login" || formType === "signup") && (
            <div>
              <label
                htmlFor="email"
                className="block text-stone-500 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your email address"
              />
            </div>
          )}
          {formType === "signup" && (
            <div>
              <label
                htmlFor="username"
                className="block text-stone-500 font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your username"
              />
            </div>
          )}
          {(formType === "login" || formType === "signup") && (
            <div>
              <label
                htmlFor="password"
                className="block text-stone-500 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your password"
              />
            </div>
          )}
          {formType !== "login" && formType !== "signup" && (
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-stone-500 font-bold mb-2"
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your old password"
              />
            </div>
          )}
          {formType !== "login" && formType !== "signup" && (
            <div>
              <label
                htmlFor="newPassword"
                className="block text-stone-500 font-bold mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Enter your new password"
              />
            </div>
          )}
          {formType !== "login" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-stone-500 font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="relative w-full px-6 py-2 text-xl font-medium uppercase text-white"
            >
              <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-rose-800 relative inline-block">
                <span className="relative text-white">
                  {formType === "login"
                    ? "Login"
                    : formType === "signup"
                    ? "Sign Up"
                    : "Change Password"}
                </span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericForm;
