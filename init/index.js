// created to initialize some data for DB  

const mongoose = require("mongoose");
const initData = require("./data.js");  //name of the exported object
const Listing = require("../models/listing.js");

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGOOSE_URL);
};



const initDB = async () => {
    await Listing.deleteMany({}); //to delete all data in db
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '66a0083198e8906febf9d4c1' })); // setting same owner for all listings
    await Listing.insertMany(initData.data); // to insert all data
    console.log("Data was initialized");
};

initDB();
