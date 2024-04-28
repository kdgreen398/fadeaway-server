export default {
  info: (message: string) => {
    console.log(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - INFO - ${message}`,
    );
  },
  error: (error: Error | string) => {
    console.error(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - ERROR - ${error}`,
    );
  },
  warn: (message: string) => {
    console.warn(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - WARN - ${message}`,
    );
  },
};
