import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveRoute = (path) => location.pathname === path;

  const navLinks = [
    { path: ROUTES.HOME, label: "Events" },
    { path: ROUTES.CALENDAR, label: "Calendar" },
    ...(user?.role === "admin"
      ? [{ path: ROUTES.DASHBOARD, label: "Dashboard" }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    setIsProfileOpen(false);
  };

  const getUserInitials = () => {
    if (!user) return "";
    return `${user.firstName?.[0] || ""}${
      user.lastName?.[0] || ""
    }`.toUpperCase();
  };

  return (
    <nav className='bg-white/80 backdrop-blur-md shadow-lg fixed w-full z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className='text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity'
          >
            Campus Event Hub
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className='relative px-4 py-2 rounded-lg group'
              >
                <span
                  className={`relative z-10 ${
                    isActiveRoute(link.path) ||
                    (link.path === ROUTES.DASHBOARD &&
                      location.pathname.includes("/admin"))
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </span>
                {(isActiveRoute(link.path) ||
                  (link.path === ROUTES.DASHBOARD &&
                    location.pathname.includes("/admin"))) && (
                  <motion.div
                    layoutId='navbar-active'
                    className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg'
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}

            {/* Profile Dropdown */}
            {user ? (
              <div className='relative' ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='flex items-center space-x-2 focus:outline-none'
                >
                  <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold'>
                    {getUserInitials()}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50'
                    >
                      <div className='px-4 py-2 border-b border-gray-100'>
                        <p className='text-sm font-semibold text-gray-900'>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className='text-xs text-gray-500'>{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link
                  to={ROUTES.LOGIN}
                  className='px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg'
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className='px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity'
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='md:hidden'
            >
              <div className='px-2 pt-2 pb-4 space-y-1'>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActiveRoute(link.path)
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
                  >
                    Sign out
                  </button>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setIsOpen(false)}
                      className='block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={() => setIsOpen(false)}
                      className='block px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg'
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
