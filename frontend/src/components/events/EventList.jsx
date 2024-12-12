import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "./EventCard";
import EventSkeleton from "./EventSkeleton";
import toast from "react-hot-toast";
import { getEvents } from "../../services/eventService";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data || []);
      const types = ["all", ...new Set(data.map((event) => event.category))];
      setEventTypes(types);
      setFilteredEvents(data || []);
    } catch (error) {
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) => event.category === selectedFilter)
      );
    }
  }, [selectedFilter, events]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Hero Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className='text-center mb-16'
        >
          <h1 className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4'>
            Upcoming Events
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Discover amazing events and expand your knowledge with our curated
            workshops and meetups.
          </p>
        </motion.div>

        {/* Filters */}
        <div className='flex justify-center flex-wrap gap-4 mb-12'>
          {loading ? (
            // Skeleton filters
            <div className='flex gap-4'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='w-24 h-10 bg-gray-200 rounded-full animate-pulse'
                />
              ))}
            </div>
          ) : (
            eventTypes.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2 rounded-full ${
                  selectedFilter === filter
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                } transition-all duration-200 shadow-md`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))
          )}
        </div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
        >
          {loading
            ? Array(6)
                .fill(0)
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <EventSkeleton />
                  </motion.div>
                ))
            : filteredEvents.map((event) => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
        </motion.div>

        {!loading && filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center text-gray-500 mt-12'
          >
            No events found for this category.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EventList;
