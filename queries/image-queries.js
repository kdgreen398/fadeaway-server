// fetch queries
const FETCH_IMAGES_BY_BARBER_ID = `
  SELECT IMAGE_ID, URL 
  FROM BARBER_IMAGES 
  WHERE BARBER_ID = ?
`;

module.exports = {
  FETCH_IMAGES_BY_BARBER_ID,
};
