const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, checkReviewAuthor } = require("../middlewares.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");



//Reviews
//Post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, checkReviewAuthor, wrapAsync(reviewController.destroyReview));



module.exports = router;