const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unque: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        First_Name:{type:String},
        Last_Name:{type:String}

    },
    { timestamps: true }
 )

 module.exports = mongoose.model("User",UserSchema )

 