const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        require: true,
        type: String,
        trim: true,
    },
    email: {
        require: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
                const regex =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(regex);
            },
            message: "Please enter a valid email address"
        }
    },
    password: {
        requier: true,
        type: String,
    },
    address: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "user",
    },
    _id: {
        require: true,
        type: String,
        trim: true,
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;
