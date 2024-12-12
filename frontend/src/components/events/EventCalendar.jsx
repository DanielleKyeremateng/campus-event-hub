import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import { getEvents } from "../../services/eventService";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.startDateTime);
      return isSameDay(eventDate, date);
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>Loading...</div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto mt-8'>
      <div className='bg-white rounded-lg shadow'>
        <div className='flex items-center justify-between p-4 border-b'>
          <button
            onClick={previousMonth}
            className='p-2 hover:bg-gray-100 rounded transition'
          >
            &lt;
          </button>
          <h2 className='text-xl font-semibold'>
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={nextMonth}
            className='p-2 hover:bg-gray-100 rounded transition'
          >
            &gt;
          </button>
        </div>

        <div className='grid grid-cols-7 gap-px bg-gray-200'>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className='bg-gray-50 p-4 text-center font-semibold'>
              {day}
            </div>
          ))}
          {daysInMonth.map((date) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div
                key={date.toString()}
                className='bg-white p-4 min-h-[100px] hover:bg-gray-50 transition'
              >
                <div className='font-medium'>{format(date, "d")}</div>
                {dayEvents.length > 0 && (
                  <div className='mt-1'>
                    {dayEvents.map((event) => (
                      <div
                        key={event._id}
                        className='text-xs md:text-sm p-0.5 w-full mb-1 bg-purple-100 rounded text-purple-700'
                      >
                        {event.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
