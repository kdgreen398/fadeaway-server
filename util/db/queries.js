const FETCH_BARBERS_BY_CITY_STATE = `SELECT * FROM BARBERS WHERE CITY = ? AND STATE = ?`;
const FETCH_IMAGES_BY_BARBER_ID = `SELECT IMAGE_ID, URL FROM BARBER_IMAGES WHERE BARBER_ID = ?`;
const FETCH_REVIEWS_BY_BARBER_ID = `SELECT REVIEWS.REVIEW_ID, REVIEWS.RATING, REVIEWS.DESCRIPTION, REVIEWS.DATE_CREATED, CONCAT(CLIENTS.FIRST_NAME, ' ', CLIENTS.LAST_NAME) as AUTHOR FROM REVIEWS INNER JOIN CLIENTS ON CLIENTS.CLIENT_ID = REVIEWS.CLIENT_ID WHERE BARBER_ID = ?`;
const FETCH_ALL_BARBER_CITY_STATES = `SELECT * FROM BARBER_CITY_STATES`;
const FETCH_CLIENT_BY_EMAIL = `SELECT * FROM CLIENTS WHERE EMAIL = ?`;
const FETCH_BARBER_BY_EMAIL = `SELECT * FROM BARBERS WHERE EMAIL = ?`;

module.exports = {
  FETCH_BARBERS_BY_CITY_STATE,
  FETCH_IMAGES_BY_BARBER_ID,
  FETCH_REVIEWS_BY_BARBER_ID,
  FETCH_ALL_BARBER_CITY_STATES,
  FETCH_CLIENT_BY_EMAIL,
  FETCH_BARBER_BY_EMAIL,
};
