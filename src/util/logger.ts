module.exports = {
  info: (message: string) => {
    console.log(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - INFO - ${message}`
    );
  },
  error: (message: string) => {
    console.error(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - ERROR - ${message}`
    );
  },
  warn: (message: string) => {
    console.warn(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - WARN - ${message}`
    );
  },
};
