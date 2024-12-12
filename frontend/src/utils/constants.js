export const EVENT_TYPES = [
  "Workshop",
  "Seminar",
  "Club Activity",
  "Sports",
  "Academic",
];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EVENTS: "/events",
  CALENDAR: "/calendar",
  CREATE_EVENT: "/admin/create-event",
  DASHBOARD: "/admin",
  MANAGE_EVENTS: "/admin/events",
};

export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters long",
  INVALID_CAPACITY: "Capacity must be a positive number",
  INVALID_DATE: "Event date must be in the future",
};
