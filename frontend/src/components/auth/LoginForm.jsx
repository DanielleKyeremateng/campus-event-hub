import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../../utils/validation";
import { ROUTES, ERROR_MESSAGES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = ERROR_MESSAGES.INVALID_PASSWORD;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      const loadingToast = toast.loading("Signing in...");
      try {
        const response = await api.post("/auth/login", formData);
        toast.dismiss(loadingToast);
        toast.success("Successfully logged in!");
        login(response.data);
      } catch (error) {
        toast.dismiss(loadingToast);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred during login";

        toast.error(errorMessage);
      }
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-md mx-auto mt-8'
    >
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 text-center'
        >
          Welcome Back
        </motion.h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              placeholder='Enter your email'
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-1 text-sm text-red-500'
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              placeholder='Enter your password'
            />
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-1 text-sm text-red-500'
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
            className='w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 relative'
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className='w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto'
              />
            ) : (
              "Login"
            )}
          </motion.button>

          <div className='text-center mt-4'>
            <Link
              to={ROUTES.REGISTER}
              className='text-sm text-purple-600 hover:text-purple-500 transition-colors duration-200'
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
