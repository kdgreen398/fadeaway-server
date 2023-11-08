const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const RegistrationService = require("../services/registration-service");

router.post("/registration/register-client", async (req, res) => {
  logger.info("Entering Registration Controller => register-client");

  const { firstName, lastName, email, phone, password } = req.body;

  try {
    const response = await RegistrationService.createClientInDB(
      firstName,
      lastName,
      email,
      phone,
      password,
    );

    if (response.error) {
      res.status(400).send(response.error);
    }

    res.send(response.message);

    logger.info("Exiting Registration Controller => register-client");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error creating client");
  }
});

// Will be used to generate public profile id's for barbers
// const crypto = require("crypto");

// function generateProfileId(email) {
//   // Create a hash object using a secure algorithm like SHA-256
//   const hash = crypto.createHash("sha256");

//   // Update the hash with the email
//   hash.update(email);

//   // Get the hexadecimal representation of the hash
//   const profileId = hash.digest("hex");

//   return profileId;
// }

// // Example usage:
// const email = "user@example.com";
// const profileId = generateProfileId(email);
// console.log(profileId);

module.exports = router;
