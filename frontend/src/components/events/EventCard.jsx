import React from "react";
import { motion } from "framer-motion";
import RSVPButton from "./RSVPButton";

const EventCard = ({ event, userid = null, onRSVP }) => {
  return (
    <motion.div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-[500px] flex flex-col'>
      <div className='relative h-48 flex-shrink-0'>
        <img
          src={event.imageUrl}
          alt={event.title}
          className='w-full h-full object-cover'
        />
        <div className='absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm'>
          {event.type}
        </div>
      </div>

      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-xl font-bold text-gray-900 mb-2 line-clamp-2'>
          {event.title}
        </h3>
        <p className='text-gray-600 mb-4 line-clamp-2'>{event.description}</p>

        <div className='space-y-2 mt-auto'>
          <div className='flex items-center text-gray-500 text-sm'>
            <svg
              className='w-5 h-5 mr-2 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <span className='truncate'>
              {new Date(event?.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {new Date(`1970-01-01T${event?.time}`).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </div>

          <div className='flex items-center text-gray-500 text-sm'>
            <svg
              className='w-5 h-5 mr-2 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            <span className='truncate'>{event.location}</span>
          </div>
        </div>

        <div className='mt-6'>
          <RSVPButton event={event} userid={userid} onRSVP={onRSVP} />
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
