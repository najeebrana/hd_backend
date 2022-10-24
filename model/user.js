const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	imageURL: String,
});

module.exports = mongoose.model("User", userSchema);
//const User = mongoose.model("User", userSchema);
