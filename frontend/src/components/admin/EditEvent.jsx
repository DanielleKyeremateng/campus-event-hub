import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { validateEventCapacity } from "../../utils/validation";
import { EVENT_TYPES, ERROR_MESSAGES, ROUTES } from "../../utils/constants";
import { getEventById, updateEvent } from "../../services/eventService";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        const formattedDate = eventData?.at(0)?.startDateTime
          ? new Date(eventData?.at(0)?.startDateTime).toISOString().slice(0, 16)
          : "";

        reset({
          title: eventData?.at(0)?.name,
          startDateTime: formattedDate,
          location: eventData?.at(0)?.location,
          capacity: eventData?.at(0)?.capacity,
          category: eventData?.at(0)?.category,
          description: eventData?.at(0)?.description,
        });
      } catch (error) {
        toast.error("Failed to fetch event details");
        navigate(ROUTES.MANAGE_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    // Validate capacity and date
    if (!validateEventCapacity(data.capacity)) {
      setError("capacity", {
        type: "manual",
        message: ERROR_MESSAGES.INVALID_CAPACITY,
      });
      return;
    }

    // if (!validateEventDate(data.startDateTime)) {
    //   setError("startDateTime", {
    //     type: "manual",
    //     message: ERROR_MESSAGES.INVALID_DATE,
    //   });
    //   return;
    // }

    try {
      const loadingToast = toast.loading("Updating event...");
      await updateEvent(id, data);
      toast.dismiss(loadingToast);
      toast.success("Event updated successfully");
      navigate(ROUTES.MANAGE_EVENTS);
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600'></div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto mt-8'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Edit Event</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700'
            >
              Event Title
            </label>
            <input
              type='text'
              id='title'
              {...register("title", { required: "Title is required" })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='startDateTime'
              className='block text-sm font-medium text-gray-700'
            >
              Date and Time
            </label>
            <input
              type='datetime-local'
              id='startDateTime'
              {...register("startDateTime", {
                required: "Date and time are required",
              })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
            />
            {errors.startDateTime && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.startDateTime.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='location'
              className='block text-sm font-medium text-gray-700'
            >
              Location
            </label>
            <input
              type='text'
              id='location'
              {...register("location", { required: "Location is required" })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
            />
            {errors.location && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='capacity'
              className='block text-sm font-medium text-gray-700'
            >
              Capacity
            </label>
            <input
              type='number'
              id='capacity'
              {...register("capacity", { required: "Capacity is required" })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
            />
            {errors.capacity && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700'
            >
              Event Category
            </label>
            <select
              id='category'
              {...register("category", { required: "Category is required" })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type.toLocaleLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700'
            >
              Description
            </label>
            <textarea
              id='description'
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='flex justify-end space-x-4'>
            <motion.button
              type='button'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(ROUTES.MANAGE_EVENTS)}
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            >
              Cancel
            </motion.button>
            <motion.button
              type='submit'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            >
              Update Event
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
