import { format, parseISO } from 'date-fns';

export const formatEventDate = (date) => {
  return format(parseISO(date), 'PPP');
};

export const formatEventTime = (time) => {
  return format(parseISO(`2000-01-01T${time}`), 'p');
};

export const isEventUpcoming = (date) => {
  return new Date(date) > new Date();
};

export const sortEventsByDate = (events) => {
  return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
};