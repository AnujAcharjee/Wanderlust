const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, isLoggedIn, checkOwner } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    //Index Route
    .get(wrapAsync(listingController.index))
    //Create Route
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing));
// //Multer
// .post( upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// });

//New Route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);

router.route("/:id")
    //Show Route
    .get(wrapAsync(listingController.showListings))
    //Update route
    .put(
        isLoggedIn,
        checkOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    //Delete route
    .delete(
        isLoggedIn,
        checkOwner,
        wrapAsync(listingController.destroyListing));


//Edit route
router.get("/:id/edit",
    isLoggedIn,
    checkOwner,
    wrapAsync(listingController.renderEditForm));


module.exports = router;