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
        address: "2615 Memorial Drive, Nashville, TN 35834",
        phoneNumber: "1234567890",
        email: "test@gmail.com",
      },
      services: [
        {
          id: 1,
          name: "Adult Haircut with Beard Trim",
          appointmentLength: "45 minutes",
          description: "Description 1",
          price: "$100",
        },
        {
          id: 2,
          name: "Adult Haircut",
          appointmentLength: "30 minutes",
          price: "$40",
        },
        {
          id: 3,
          name: "Adult Haircut",
          appointmentLength: "30 minutes",
          price: "$40",
        },
      ],
    },
    {
      id: 2,
      status: "COMPLETE",
      scheduledTime: "2021-01-01 10:00:00",
      barber: {
        id: 1,
        barberName: "Trey Johnson",
        shopName: "Magic Fades Barber Shop",
        address: "2615 Memorial Drive, Nashville, TN 35834",
        phoneNumber: "1234567890",
        email: "test@gmail.com",
      },
      services: [
        {
          id: 1,
          name: "Adult Haircut with Beard Trim",
          appointmentLength: "45 minutes",
          description: "Description 1",
          price: "$100",
        },
        {
          id: 2,
          name: "Adult Haircut",
          appointmentLength: "30 minutes",
          price: "$40",
        },
        {
          id: 3,
          name: "Adult Haircut",
          appointmentLength: "30 minutes",
          price: "$40",
        },
      ],
    },
    {
      id: 3,
      status: "DECLINED",
      scheduledTime: "2021-01-01 10:00:00",
      barber: {
        id: 1,
        barberName: "Trey Johnson",
        shopName: "Magic Fades Barber Shop",
        address: "2615 Memorial Drive, Nashville, TN 35834",
        phoneNumber: "1234567890",
        email: "test@gmail.com",
      },
      services: [
        {
          id: 1,
          name: "Adult Haircut with Beard Trim",
          appointmentLength: "45 minutes",
          description: "Description 1",
          price: "$100",
        },
        {
          id: 2,
          name: "Adult Haircut",
          appointmentLength: "30 minutes",
          price: "$40",
        },
        {
          id: 3,
          name: "Adult Haircut",
          appointmentLength: "30 minutes",
          price: "$40",
        },
      ],
    },
  ]);
});

module.exports = router;
