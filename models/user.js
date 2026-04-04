const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    image: {
        url: {
        type: String,
        },
        filename: {
        type: String,
        },
    },
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    usernameLowerCase: true,
});

module.exports = mongoose.model("User", userSchema);
