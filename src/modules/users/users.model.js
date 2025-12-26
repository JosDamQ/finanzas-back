const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // username: {
    //     type: String,
    //     required: true
    // },
    birthdate: {
        type: Date,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        minlength: 8,
        maxlength: 8
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Expresión regular para validar un email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'src/assets/default-user.jpg'
    },
    dateCreate: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
})


module.exports = mongoose.model('User', userSchema)