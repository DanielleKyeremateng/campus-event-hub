import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { cancelRSVP } from "../../services/eventService";
import { motion } from "framer-motion";

const RSVPButton = ({ event, onRSVP }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [isUserRSVPed, setIsUserRSVPed] = useState(false);
  const [isEventFull, setIsEventFull] = useState(false);
  const [isEventPassed, setIsEventPassed] = useState(false);

  useEffect(() => {
    setIsUserRSVPed(
      event.attendees.some((attendee) => attendee?.user?._id === user?.id)
    );
    setIsEventFull(event.attendees.length >= event.capacity);
    setIsEventPassed(new Date(event.endDate) < new Date());
  }, [event, event.attendees, event.capacity, event.endDate, user?.id]);

  const handleRSVPError = (error) => {
    if (error.code === 403) {
      toast.error("You've already RSVP'd to this event");
    } else if (error.code === 406) {
      toast.error("Event is at full capacity");
    } else {
      toast.error("Failed to RSVP. Please try again later.");
    }
  };

  const getButtonClassName = () => {
    if (isUserRSVPed) {
      return "w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold opacity-90 cursor-not-allowed";
    }
    if (isEventFull) {
      return "w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-2 rounded-lg font-semibold opacity-90 cursor-not-allowed";
    }
    return "w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity";
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (isUserRSVPed) return "RSVP'd";
    if (isEventFull) return "Full";
    return "RSVP";
  };

  const handleRSVP = async () => {
    if (!user) {
      toast.error("Please login to RSVP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/events/${event._id}/rsvp`);
      onRSVP && onRSVP(response.data);
      toast.success("Successfully RSVP'd to event!");
    } catch (error) {
      handleRSVPError(error);
    } finally {
      setLoading(false);
    }
  };

  if (isEventPassed) {
    return <span className='text-gray-500'>Event has ended</span>;
  }

  return (
    <div className='flex items-center w-full gap-4 mt-5'>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRSVP}
        disabled={loading || isUserRSVPed || isEventFull}
        className={`${getButtonClassName()} w-full`}
      >
        {getButtonText()}
      </motion.button>

      {isUserRSVPed && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            cancelRSVP(event._id)
              .then(() => {
                onRSVP && onRSVP(event._id);
                toast.success("Successfully cancelled RSVP");
              })
              .catch(() => {
                toast.error("Failed to cancel RSVP. Please try again later.");
              });
          }}
          className='bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:opacity-90 transition-opacity'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM5 9a1 1 0 011-1h8a1 1 0 010 2H6a1 1 0 01-1-1z'
              clipRule='evenodd'
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default RSVPButton;
