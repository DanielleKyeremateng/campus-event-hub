import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const Dashboard = () => {
  const { user } = useAuth();

  const adminActions = [
    {
      title: "Create Event",
      description: "Add a new event to the platform",
      path: ROUTES.CREATE_EVENT,
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 4v16m8-8H4'
          />
        </svg>
      ),
    },
    {
      title: "Manage Events",
      description: "View, edit and delete existing events",
      path: ROUTES.MANAGE_EVENTS,
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 10h16M4 14h16M4 18h16'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {adminActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className='block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow'
          >
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-purple-100 rounded-lg text-purple-600'>
                {action.icon}
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {action.title}
                </h3>
                <p className='text-gray-600'>{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
