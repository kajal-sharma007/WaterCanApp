// logger.js
const isDev = __DEV__; // This checks if the app is in development mode

// Simple log function for development
export const log = (message, ...params) => {
  if (isDev) {
    console.log(message, ...params); // Log to the console if in development
  }
};

// Simple warn function for development
export const warn = (message, ...params) => {
  if (isDev) {
    console.warn(message, ...params); // Log warnings to the console
  }
};

// Simple error function for development
export const error = (message, ...params) => {
  if (isDev) {
    console.error(message, ...params); // Log errors to the console
  }
};
