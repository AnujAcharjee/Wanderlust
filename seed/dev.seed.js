require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");

const MONGO_URL = process.env.MONGO_ATLAS_URI || "mongodb://localhost:27017/travelbnb-dev";

main()
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sampleListings = [
  {
    title: "Beachfront Villa in Goa",
    description:
      "Wake up to ocean waves in this stunning beachfront villa with private pool and sunset views.",
    image: {
      url: "https://imgs.search.brave.com/dB5Bzws-Ntr1SwWFNK-4ZOaKg2RCXKK8TFmwHRBWBf4/rs:fit:860:0:0:0/g:ce/aHR0cDovL21haXNv/bjl2aWxsYS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjQv/MDkvVmlsbGFzLWlu/LUdvYS1mb3ItR3Jv/dXAtU3RheS0xMDI0/eDY4Mi5qcGVn",
      filename: "listingimage",
    },
    price: 8500,
    location: "Goa",
    country: "India",
    categories: ["beach", "trending"],
  },

  {
    title: "Cozy Mountain Cabin",
    description:
      "A peaceful wooden cabin surrounded by pine forests and perfect for winter getaways.",
    image: {
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      filename: "listingimage",
    },
    price: 4200,
    location: "Manali",
    country: "India",
    categories: ["mountains", "camping"],
  },

  {
    title: "Luxury Apartment with City View",
    description:
      "Modern high-rise apartment with panoramic skyline views and rooftop infinity pool.",
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      filename: "listingimage",
    },
    price: 6800,
    location: "Mumbai",
    country: "India",
    categories: ["iconic cities", "luxury"],
  },

  {
    title: "Traditional Rajasthani Haveli",
    description:
      "Experience royal heritage in a restored haveli filled with history and handcrafted interiors.",
    image: {
      url: "https://images.unsplash.com/photo-1599661046289-e31897846e41",
      filename: "listingimage",
    },
    price: 5400,
    location: "Jaipur",
    country: "India",
    categories: ["heritage", "trending"],
  },

  {
    title: "Lake View Cottage",
    description:
      "Quiet lakeside retreat perfect for relaxing weekends and kayaking mornings.",
    image: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      filename: "listingimage",
    },
    price: 3900,
    location: "Nainital",
    country: "India",
    categories: ["lake", "nature"],
  },

  {
    title: "Desert Camp Under the Stars",
    description:
      "Sleep under the Milky Way in luxury desert tents with bonfire nights and camel rides.",
    image: {
      url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
      filename: "listingimage",
    },
    price: 3100,
    location: "Jaisalmer",
    country: "India",
    categories: ["camping", "desert"],
  },

  {
    title: "Treehouse Escape",
    description:
      "Unique treehouse stay deep in the forest with glass walls and sunrise views.",
    image: {
      url: "https://images.unsplash.com/photo-1475856034135-3f2a3d1c1e0a",
      filename: "listingimage",
    },
    price: 4700,
    location: "Wayanad",
    country: "India",
    categories: ["nature", "unique stays"],
  },

  {
    title: "Snowy Alpine Chalet",
    description:
      "Warm wooden chalet near ski slopes with fireplace and mountain balcony.",
    image: {
      url: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66",
      filename: "listingimage",
    },
    price: 7600,
    location: "Gulmarg",
    country: "India",
    categories: ["mountains", "amazing views"],
  },
];

const seedDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(sampleListings);
  console.log("Database seeded");
};

seedDB();
