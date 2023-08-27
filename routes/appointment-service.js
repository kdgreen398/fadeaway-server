const express = require("express");
const router = express.Router();

router.post("/appointment-service/fetch-by-user", async (req, res) => {
  res.send([
    {
      id: 1,
      status: "PENDING",
      scheduledTime: "2021-01-01 10:00:00",
      barber: {
        id: 1,
        barberName: "Trey Johnson",
        shopName: "Magic Fades Barber Shop",
        address: "Address 1",
        phoneNumber: "1234567890",
        email: "test@gmail.com",
      },
      services: [
        {
          id: 1,
          name: "Service 1",
          appointmentLength: "30 minutes",
          description: "Description 1",
          price: "$100",
        },
      ],
    },
  ]);
});

module.exports = router;
