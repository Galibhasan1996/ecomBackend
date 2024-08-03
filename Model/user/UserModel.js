import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { customConsole } from "../../Util/Constent.js";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true
    },
    mobile: {
        type: String,
        required: [true, "mobile is required"],
        trim: true
    },
    dateOfBirth: {
        type: String,
        required: [true, "dateOfBirth is required"],
        trim: true
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    addresses: [
        {
            name: String,
            mobileNo: String,
            houseNo: String,
            street: String,
            landmark: String,
            city: String,
            country: String,
            postalCode: String,
        },
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
}, { timestamps: true })



userSchema.pre("save", async function (next) {
    customConsole("Before Save", this.password)

    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    customConsole("After Save", this.password)
    next()
})



const UserModel = mongoose.model("User", userSchema)
export default UserModel