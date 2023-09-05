const express = require("express");
const router = express.Router();

router.post("/barber-service/fetch-by-location", async (req, res) => {
  res.send([
    {
      id: 1,
      barberName: "Barber#" + Math.floor(Math.random() * 100),
      shopName: "Magic Fades Barber Shop",
      rating: "4.5",
      reviewCount: 100,
      topFourImages: [
        "https://picsum.photos/400/400",
        "https://picsum.photos/401/400",
        "https://picsum.photos/402/400",
        "https://picsum.photos/403/400",
      ],
    },
    {
      id: 2,
      barberName: "Barber#" + Math.floor(Math.random() * 100),
      shopName: "Magic Fades Barber Shop",
      rating: "4.5",
      reviewCount: 100,
      topFourImages: [
        "https://picsum.photos/405/400",
        "https://picsum.photos/406/400",
        "https://picsum.photos/407/400",
        "https://picsum.photos/408/400",
      ],
    },
  ]);
});

router.post("/barber-service/fetch-barber-details", async (req, res) => {
  res.send({
    id: 1,
    profilePhoto: "https://picsum.photos/100/100",
    barberName: "Trey Johnson",
    shopName: "Magic Fades Barber Shop",
    rating: "3.0",
    reviewCount: 145,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum risus sit amet malesuada cursus.",
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
    ],
    paymentOptions: ["Cash", "Card", "Cash App"],
    address: "2615 Memorial Drive, Nashville, TN 35834",
    phoneNumber: "(662) 555-0371",
    email: "youremail@gmail.com",
    reviews: [
      {
        id: 1,
        rating: 4,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum risus sit amet malesuada cursus.",
        date: "2022-01-01 10:00:00",
        user: {
          id: 1,
          name: "User 1",
        },
      },
    ],
    services: [
      {
        id: 1,
        name: "Service 1",
        appointmentLength: "30 minutes",
        description: "Description 1",
        price: "$100",
      },
    ],
    // available times will be fetched once navigating to the time selection screen
  });
});

module.exports = router;
