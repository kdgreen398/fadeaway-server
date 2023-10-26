const logger = {
  info: (message) => {
    console.log(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - INFO - ${message}`
    );
  },
  error: (message) => {
    console.error(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - ERROR - ${message}`
    );
  },
  warn: (message) => {
    console.warn(
      `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")} - WARN - ${message}`
    );
  },
};

module.exports = logger;
