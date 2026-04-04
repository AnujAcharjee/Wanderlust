const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const fs = require("fs/promises");
const { uploadToCloudinary } = require("../cloudConfig.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const cleanupLocalFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Temporary upload cleanup failed:", err);
    }
  }
};

const uploadListingImage = async (file) => {
  try {
    const result = await uploadToCloudinary(file.path);
    await cleanupLocalFile(file.path);
    return result;
  } catch (err) {
    await cleanupLocalFile(file.path);
    throw err;
  }
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res) => {
  // Geocode the location
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // Check if the response contains features
  if (response.body.features.length === 0) {
    req.flash(
      "error",
      "Location could not be found. Please provide a valid location.",
    );
    return res.redirect("/listings/new"); // Redirect to the form or wherever appropriate
  }

  if (!req.file) {
    req.flash("error", "Please upload an image for the listing.");
    return res.redirect("/listings/new");
  }

  let uploadResult;
  try {
    uploadResult = await uploadListingImage(req.file);
  } catch (err) {
    req.flash("error", "Image upload failed. Please try again.");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {
    url: uploadResult.secure_url || uploadResult.url,
    filename: uploadResult.public_id,
  };
  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  // console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  } else {
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("listings/edit.ejs", { listing, originalImgUrl });
  }
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  );

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  if (typeof req.file !== "undefined") {
    let uploadResult;
    try {
      uploadResult = await uploadListingImage(req.file);
    } catch (err) {
      req.flash("error", "Image upload failed. Please try again.");
      return res.redirect(`/listings/${id}/edit`);
    }

    listing.image = {
      url: uploadResult.secure_url || uploadResult.url,
      filename: uploadResult.public_id,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.search = async (req, res) => {
  const { region } = req.query;
  const allListings = await Listing.find({ region: region });
  res.render("listings/index.ejs", { allListings });
};

module.exports.filter = async (req, res) => {
  const category = req.query.category.toLowerCase();
  const allListings = await Listing.find({ categories: category });

  if (allListings.length === 0) {
    req.flash("error", "Listing not found! Try another filter.");
    return res.redirect("/listings");
  } else {
    res.render("listings/index.ejs", { allListings });
  }
};
