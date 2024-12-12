import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../../utils/validation";
import { ROUTES, ERROR_MESSAGES, EVENT_TYPES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferences: [],
      phoneNumber: "",
      organization: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (!validateEmail(data.email)) {
      return toast.error(ERROR_MESSAGES.INVALID_EMAIL);
    }
    if (!validatePassword(data.password)) {
      return toast.error(ERROR_MESSAGES.INVALID_PASSWORD);
    }
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (data.preferences.length === 0) {
      return toast.error("Please select at least one preference");
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await api.post("/auth/signup", data);
      if (response.data) {
        login(response.data);
        toast.dismiss(loadingToast);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error.response?.data?.message || "Failed to create account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-2xl mx-auto mt-8 px-4'
    >
      <div className='bg-white p-8 rounded-xl shadow-lg'>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
        >
          Create Your Account
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='text'
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder='Enter your first name'
              />
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.firstName.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='text'
                {...register("lastName", { required: "Last name is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder='Enter your last name'
              />
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.lastName.message}
                </motion.p>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type='text'
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message:
                    "Username can only contain letters, numbers, underscores and dashes",
                },
              })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder='Choose a username'
            />
            {errors.username && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-1 text-sm text-red-500'
              >
                {errors.username.message}
              </motion.p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type='email'
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder='Enter your email'
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-1 text-sm text-red-500'
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='password'
                {...register("password", { required: "Password is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder='Enter your password'
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='password'
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder='Confirm your password'
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone Number
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='tel'
                {...register("phoneNumber")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder='Enter your phone number'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Organization
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='text'
                {...register("organization")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.organization ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder='Enter your organization'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Event Preferences
            </label>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
              {EVENT_TYPES.map((type) => (
                <motion.button
                  key={type}
                  type='button'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const currentPreferences = watch("preferences");
                    if (currentPreferences.includes(type)) {
                      setValue(
                        "preferences",
                        currentPreferences.filter((t) => t !== type)
                      );
                    } else {
                      setValue("preferences", [...currentPreferences, type]);
                    }
                  }}
                  className={`p-2 rounded-lg text-sm ${
                    watch("preferences").includes(type)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-colors duration-200`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
            {errors.preferences && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-1 text-sm text-red-500'
              >
                {errors.preferences.message}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
            className='w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200'
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className='w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto'
              />
            ) : (
              "Create Account"
            )}
          </motion.button>

          <div className='text-center mt-4'>
            <Link
              to={ROUTES.LOGIN}
              className='text-sm text-purple-600 hover:text-purple-500 transition-colors duration-200'
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
