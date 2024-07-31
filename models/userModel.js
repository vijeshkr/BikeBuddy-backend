const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// User registration schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'mechanic', 'admin'], default: 'customer', required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    profilePicture: {type: String},
    phone: {type: String},
    place: {type: String},
},{
    timestamps: true
});

// Token generation
userSchema.methods.generateAuthToken = async function () {
    try {
        let tokenGen = jwt.sign({_id: this._id, role: this.role }, process.env.JWT_SECRET,{
            expiresIn: "1d",
        });
        return tokenGen;
    } catch (error) {
        console.log('Error while generating auth token: ', error);
        res.status(422).json(error);
        }
}

// Create user model
const userModel = mongoose.model('user',userSchema);

module.exports = userModel;