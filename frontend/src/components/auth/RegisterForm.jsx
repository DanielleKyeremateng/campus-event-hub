import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../../utils/validation";
import { ROUTES, ERROR_MESSAGES, EVENT_TYPES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferences: [],
    phoneNumber: "",
    organization: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePreferenceChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(type)
        ? prev.preferences.filter((t) => t !== type)
        : [...prev.preferences, type],
    }));
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!validateEmail(formData.email))
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    if (!validatePassword(formData.password))
      newErrors.password = ERROR_MESSAGES.INVALID_PASSWORD;
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (formData.preferences.length === 0)
      newErrors.preferences = "Please select at least one preference";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      const loadingToast = toast.loading("Creating your account...");

      try {
        const response = await api.post("/auth/signup", formData);

        if (response.data) {
          login(response.data);
          toast.dismiss(loadingToast);
          toast.success("Account created successfully!");
          navigate("/");
        }
      } catch (error) {
        toast.dismiss(loadingToast);

        // Get the specific error message from the server response
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create account. Please try again.";

        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputClasses = (error) => `
    w-full px-4 py-2 rounded-lg border 
    ${error ? "border-red-500" : "border-gray-300"}
    focus:outline-none focus:ring-2 focus:ring-purple-500 
    focus:border-transparent transition-all duration-200
  `;

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

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Name Fields */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className={inputClasses(errors.firstName)}
                placeholder='Enter your first name'
              />
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.firstName}
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
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className={inputClasses(errors.lastName)}
                placeholder='Enter your last name'
              />
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.lastName}
                </motion.p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={inputClasses(errors.email)}
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

          {/* Password Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className={inputClasses(errors.password)}
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

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses(errors.confirmPassword)}
                placeholder='Confirm your password'
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-1 text-sm text-red-500'
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>
          </div>

          {/* Additional Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone Number
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type='tel'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputClasses(errors.phoneNumber)}
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
                name='organization'
                value={formData.organization}
                onChange={handleChange}
                className={inputClasses(errors.organization)}
                placeholder='Enter your organization'
              />
            </div>
          </div>

          {/* Preferences */}
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
                  onClick={() => handlePreferenceChange(type)}
                  className={`p-2 rounded-lg text-sm ${
                    formData.preferences.includes(type)
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
                {errors.preferences}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
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
