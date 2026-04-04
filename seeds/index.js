require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

const listings = require("./listings.seed");
const seedReviews = require("./reviews.seed");

const MONGO_URL = process.env.MONGO_ATLAS_URI;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");

  // CLEAN DB (important)
  await Listing.deleteMany({});
  await Review.deleteMany({});

  // Insert Listings
  const insertedListings = await Listing.insertMany(listings);
  console.log("✅ Listings seeded");

  // Add Reviews
  await seedReviews();

  console.log("🎉 Database seeded successfully");
  mongoose.connection.close();
}

main();
