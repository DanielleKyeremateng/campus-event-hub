import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validateEventCapacity } from "../../utils/validation";
import { EVENT_TYPES, ERROR_MESSAGES } from "../../utils/constants";
import { createEvent } from "../../services/eventService";
import { toast } from "react-hot-toast";

const getRandomImage = () => {
  const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3",
  ];
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

export default function EventForm() {
  const [imagePreview, setImagePreview] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm();

  // Watch the imageUrl field to update preview
  const imageUrl = watch("imageUrl");

  // Update image preview when imageUrl changes
  React.useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const handleImageError = () => {
    setImagePreview("");
    setError("imageUrl", {
      type: "manual",
      message: "Invalid image URL",
    });
  };

  const onSubmit = async (data) => {
    try {
      if (!validateEventCapacity(data.capacity)) {
        setError("capacity", {
          type: "manual",
          message: ERROR_MESSAGES.INVALID_CAPACITY,
        });
        return;
      }

      // Prepare event data matching backend schema requirements
      const eventData = {
        name: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        capacity: parseInt(data.capacity),
        category: data.type?.toLowerCase(),
        imageUrl: data.imageUrl || getRandomImage(),
      };

      const res = await createEvent(eventData);

      reset();
      setImagePreview("");
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className='max-w-2xl mx-auto mt-8'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          Create New Event
        </h2>

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
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700'
              >
                Date
              </label>
              <input
                type='date'
                id='date'
                {...register("date", { required: "Date is required" })}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              {errors.date && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='time'
                className='block text-sm font-medium text-gray-700'
              >
                Time
              </label>
              <input
                type='time'
                id='time'
                {...register("time", { required: "Time is required" })}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              {errors.time && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date and Time
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type='datetime-local'
              {...register("startdatetime", {
                required: "Date and time is required",
                validate: (value) => {
                  return (
                    new Date(value) > new Date() ||
                    "Date and time must be in the future"
                  );
                },
              })}
              className={`w-full px-4 py-2 rounded-lg border
                ${errors.datetime ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-purple-500 
                focus:border-transparent`}
            />
            {errors.datetime && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='mt-1 text-sm text-red-500'
              >
                {errors.datetime.message}
              </motion.p>
            )}
          </div> */}

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
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.capacity && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700'
            >
              Event Type
            </label>
            <select
              id='type'
              {...register("type", { required: "Event type is required" })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className='mt-1 text-sm text-red-600'>{errors.type.message}</p>
            )}
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
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='imageUrl'
              className='block text-sm font-medium text-gray-700'
            >
              Event Image URL
            </label>
            <input
              type='url'
              id='imageUrl'
              {...register("imageUrl")}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              placeholder='https://example.com/image.jpg'
            />
            {errors.imageUrl && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.imageUrl.message}
              </p>
            )}

            {imagePreview && (
              <div className='mt-2'>
                <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                  <img
                    src={imagePreview}
                    alt='Event preview'
                    onError={handleImageError}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
