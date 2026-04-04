const Listing = require("../models/listing");
const Review = require("../models/review");

const userIds = [
  "69d10cfcfb3d788d98a6237c",
  "69d10ef526cd7ddf3fd2fbe8",
  "69d10f0c26cd7ddf3fd2fbef"
];

const comments = [
  "Amazing stay!",
  "Very comfortable",
  "Loved the location",
  "Worth the money",
  "Would visit again",
  "Decent experience",
  "Highly recommended"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedReviews() {
  const listings = await Listing.find({});

  for (let listing of listings) {
    for (let i = 0; i < 2; i++) {
      const review = new Review({
        comment: random(comments),
        rating: Math.floor(Math.random() * 5) + 1,
        author: random(userIds)
      });

      await review.save();
      listing.reviews.push(review._id);
    }

    await listing.save();
  }

  console.log("✅ Reviews seeded");
}

module.exports = seedReviews;