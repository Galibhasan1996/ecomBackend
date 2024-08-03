import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: [true, "user is required"],
    },
    products: [
        {
            name: {
                type: String,
                required: [true, "product name is required"],
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"],
            },
            price: {
                type: Number,
                required: [true, "price is required"],
            },
            image: {
                type: String,
                required: [true, "image is required"],
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: [true, "total price is required"],
    },
    shippingAddress: {
        name: {
            type: String,
            required: [true, "addressname is required"],
        },
        mobileNo: {
            type: String,
            required: [true, "mobile no is required"],
        },
        houseNo: {
            type: String,
            required: [true, "house no is required"],
        },
        street: {
            type: String,
            required: [true, "street is required"],
        },
        landmark: {
            type: String,
            required: [true, "landmark is required"],
        },
        postalCode: {
            type: String,
            required: [true, "postal code is required"],
        },
    },
    paymentMethod: {
        type: String,
        required: [true, "payment method is required"],
    },

}, { timestamps: true });



const orderModel = mongoose.model("Order", orderSchema)
export default orderModel