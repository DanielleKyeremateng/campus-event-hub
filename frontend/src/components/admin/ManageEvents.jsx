import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { eventsCreatedByUser, deleteEvent } from "../../services/eventService";
import { ROUTES } from "../../utils/constants";
import { formatEventDate } from "../../utils/date";
import { useAuth } from "../../contexts/AuthContext";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const data = await eventsCreatedByUser(user.id);
      setEvents(data || []);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        toast.success("Event deleted successfully");
        fetchEvents();
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  const filteredEvents = events.filter((event) =>
    event?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <h1 className='text-3xl font-semibold text-gray-900'>
            Manage Events
          </h1>
          <p className='mt-2 text-sm text-gray-700'>
            A list of all events where you can edit or delete them.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <Link
            to={ROUTES.CREATE_EVENT}
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto'
          >
            Add Event
          </Link>
        </div>
      </div>

      <div className='mt-8'>
        <input
          type='text'
          placeholder='Search events...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
        />
      </div>

      <div className='mt-6 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle'>
            <div className='overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'>
                      Title
                    </th>
                    <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Date
                    </th>
                    <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Location
                    </th>
                    <th className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Capacity
                    </th>
                    <th className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {loading ? (
                    <tr>
                      <td colSpan='5' className='text-center py-4'>
                        <div className='flex justify-center'>
                          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr>
                      <td
                        colSpan='5'
                        className='text-center py-4 text-gray-500'
                      >
                        No events found
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <motion.tr
                        key={event._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900'>
                          {event.title}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {formatEventDate(event.date)}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {event.location}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                          {event.capacity}
                        </td>
                        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium'>
                          {/* <Link
                            to={`/admin/events/edit/${event._id}`}
                            className='text-purple-600 hover:text-purple-900 mr-4'
                          >
                            Edit
                          </Link> */}
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className='text-red-600 hover:text-red-900'
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
