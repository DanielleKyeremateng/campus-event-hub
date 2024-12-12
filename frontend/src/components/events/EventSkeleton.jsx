// EventSkeleton.jsx
import React from "react";

const EventSkeleton = () => (
  <div className='bg-white rounded-xl shadow-lg overflow-hidden animate-pulse h-[500px]'>
    <div className='w-full h-48 bg-gray-200'></div>
    <div className='p-6'>
      <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
      <div className='h-4 bg-gray-200 rounded mb-2'></div>
      <div className='h-4 bg-gray-200 rounded w-5/6 mb-4'></div>
      <div className='space-y-3'>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
      </div>
      <div className='mt-6'>
        <div className='h-10 bg-gray-200 rounded'></div>
      </div>
    </div>
  </div>
);

export default EventSkeleton;
