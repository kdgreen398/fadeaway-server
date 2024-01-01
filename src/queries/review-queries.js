// fetch queries
const FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID = `
  SELECT COUNT(REVIEWS.REVIEW_ID) AS TOTAL_REVIEWS, ROUND(AVG(REVIEWS.RATING), 1) AS AVERAGE_RATING
  FROM REVIEWS INNER JOIN CLIENTS ON CLIENTS.CLIENT_ID = REVIEWS.CLIENT_ID 
  WHERE BARBER_ID = ?
`;
const FETCH_REVIEWS_BY_BARBER_ID = `
  SELECT REVIEWS.REVIEW_ID, REVIEWS.RATING, REVIEWS.DESCRIPTION, REVIEWS.DATE_CREATED, CONCAT(CLIENTS.FIRST_NAME, ' ', CLIENTS.LAST_NAME) as AUTHOR 
  FROM REVIEWS INNER JOIN CLIENTS ON CLIENTS.CLIENT_ID = REVIEWS.CLIENT_ID 
  WHERE BARBER_ID = ?
`;

module.exports = {
  FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID,
  FETCH_REVIEWS_BY_BARBER_ID,
};