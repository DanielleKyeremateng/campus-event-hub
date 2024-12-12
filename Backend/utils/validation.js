const validateEvent = (eventData) => {
  const errors = {};

  if (!eventData.name) {
    errors.name = "Event name is required";
  }

  if (!eventData.description) {
    errors.description = "Description is required";
  }

  if (!eventData.startDateTime) {
    errors.startDateTime = "Start date and time is required";
  }

  if (!eventData.location) {
    errors.location = "Location is required";
  }

  if (!eventData.capacity || eventData.capacity < 1) {
    errors.capacity = "Valid capacity is required";
  }

  if (!eventData.category) {
    errors.category = "Event category is required";
  }

  if (!eventData.imageUrl) {
    errors.imageUrl = "Event image URL is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateUpdateUser = (data) => {
  const errors = {};

  if (data.username) {
    if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (data.username.length > 30) {
      errors.username = "Username cannot exceed 30 characters";
    }
  }

  if (data.preferences && !Array.isArray(data.preferences)) {
    errors.preferences = "Preferences must be an array";
  }

  if (data.profileImage) {
    const validImageUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;
    if (!validImageUrl.test(data.profileImage)) {
      errors.profileImage = "Invalid image URL format";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateRegistration = (data) => {
  const errors = {};

  if (!data.username?.trim()) {
    errors.username = "Username is required";
  } else if (data.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(data.password)) {
    errors.password =
      "Password must contain at least one number, one lowercase and one uppercase letter";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateLogin = (data) => {
  const errors = {};

  if (!data.email?.trim()) errors.email = "Email is required";
  if (!data.password) errors.password = "Password is required";

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  validateEvent,
  validateUpdateUser,
  validateRegistration,
  validateLogin,
};
