const FETCH_BARBERS_BY_CITY_STATE = `
  SELECT BARBER_ID, CONCAT(FIRST_NAME, ' ', LAST_NAME) AS NAME, ALIAS, SHOP, PUBLIC_ID
  FROM BARBERS
  WHERE CITY = ? AND STATE = ?;
`;
const FETCH_IMAGES_BY_BARBER_ID = `SELECT IMAGE_ID, URL FROM BARBER_IMAGES WHERE BARBER_ID = ?`;
const FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID = `
  SELECT COUNT(REVIEWS.REVIEW_ID) AS TOTAL_REVIEWS, ROUND(AVG(REVIEWS.RATING), 1) AS AVERAGE_RATING
  FROM REVIEWS INNER JOIN CLIENTS ON CLIENTS.CLIENT_ID = REVIEWS.CLIENT_ID 
  WHERE BARBER_ID = ?;
`;
const FETCH_REVIEWS_BY_BARBER_ID = `SELECT REVIEWS.REVIEW_ID, REVIEWS.RATING, REVIEWS.DESCRIPTION, REVIEWS.DATE_CREATED, CONCAT(CLIENTS.FIRST_NAME, ' ', CLIENTS.LAST_NAME) as AUTHOR FROM REVIEWS INNER JOIN CLIENTS ON CLIENTS.CLIENT_ID = REVIEWS.CLIENT_ID WHERE BARBER_ID = ?`;
const FETCH_BARBER_DETAILS_BY_PUBLIC_ID = `
  SELECT 
    BARBER_ID,
    PROFILE_IMAGE,
    CONCAT(FIRST_NAME, ' ', LAST_NAME) AS NAME, 
    ALIAS, 
    SHOP,
    BIO,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    CITY,
    STATE,
    ZIP_CODE,
    EMAIL,
    PUBLIC_ID
  FROM BARBERS
  WHERE PUBLIC_ID = ?
`;
const FETCH_SERVICES_BY_BARBER_ID = `SELECT * FROM SERVICES WHERE BARBER_ID = ?`;
const FETCH_SERVICE_BY_SERVICE_ID_AND_BARBER_ID = `SELECT * FROM SERVICES WHERE SERVICE_ID = ? AND BARBER_ID = ?`;
const FETCH_SERVICE_COUNT_BY_BARBER_ID = `SELECT COUNT(*) AS SERVICE_COUNT FROM SERVICES WHERE BARBER_ID = ?`;

const FETCH_ALL_BARBER_CITY_STATES = `SELECT * FROM BARBER_CITY_STATES`;
const FETCH_CLIENT_BY_EMAIL = `SELECT * FROM CLIENTS WHERE EMAIL = ?`;
const FETCH_BARBER_BY_EMAIL = `SELECT * FROM BARBERS WHERE EMAIL = ?`;
const FETCH_APPOINTMENTS_BY_CLIENT_EMAIL = `
  SELECT 
  APPOINTMENTS.APPOINTMENT_ID,
  APPOINTMENTS.START_TIME,
  APPOINTMENTS.END_TIME,
  APPOINTMENTS.SERVICES,
  APPOINTMENTS.STATUS,
  CONCAT(BARBERS.FIRST_NAME, ' ', BARBERS.LAST_NAME) AS BARBER_NAME,
  BARBERS.ALIAS AS BARBER_ALIAS,
  BARBERS.SHOP,
  BARBERS.ADDRESS_LINE_1,
  BARBERS.ADDRESS_LINE_2,
  BARBERS.CITY,
  BARBERS.STATE,
  BARBERS.ZIP_CODE,
  BARBERS.EMAIL,
  BARBERS.PUBLIC_ID AS BARBER_PUBLIC_ID
  FROM APPOINTMENTS
  INNER JOIN BARBERS ON BARBERS.BARBER_ID = APPOINTMENTS.BARBER_ID
  INNER JOIN CLIENTS ON CLIENTS.CLIENT_ID = APPOINTMENTS.CLIENT_ID
  WHERE CLIENTS.EMAIL = ?
`;

const CREATE_CLIENT_IN_DB = `INSERT INTO CLIENTS (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?)`;
const CREATE_BARBER_IN_DB = `INSERT INTO BARBERS (FIRST_NAME, LAST_NAME, SHOP, ADDRESS_LINE_1, ADDRESS_LINE_2, CITY, STATE, ZIP_CODE, EMAIL, PASSWORD, PUBLIC_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const CREATE_SERVICE = `INSERT INTO SERVICES (NAME, HOURS, MINUTES, DESCRIPTION, PRICE, BARBER_ID) VALUES (?, ?, ?, ?, ?, ?)`;

const UPDATE_SERVICE = `UPDATE SERVICES
SET 
    NAME = ?,
    HOURS = ?,
    MINUTES = ?,
    DESCRIPTION = ?,
    PRICE = ?
WHERE
    SERVICE_ID = ?
    AND BARBER_ID = ?`;

const DELETE_SERVICE_BY_SERVICE_ID_AND_BARBER_ID = `DELETE FROM SERVICES WHERE SERVICE_ID = ? AND BARBER_ID = ?`;

module.exports = {
  FETCH_BARBERS_BY_CITY_STATE,
  FETCH_IMAGES_BY_BARBER_ID,
  FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID,
  FETCH_REVIEWS_BY_BARBER_ID,
  FETCH_BARBER_DETAILS_BY_PUBLIC_ID,
  FETCH_ALL_BARBER_CITY_STATES,
  FETCH_CLIENT_BY_EMAIL,
  FETCH_BARBER_BY_EMAIL,
  FETCH_APPOINTMENTS_BY_CLIENT_EMAIL,
  FETCH_SERVICES_BY_BARBER_ID,
  FETCH_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
  FETCH_SERVICE_COUNT_BY_BARBER_ID,
  CREATE_CLIENT_IN_DB,
  CREATE_BARBER_IN_DB,
  CREATE_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
};
