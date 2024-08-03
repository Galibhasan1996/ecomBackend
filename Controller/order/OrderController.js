import mongoose from "mongoose";
import orderModel from "../../Model/order/OrderModel.js"
import UserModel from "../../Model/user/UserModel.js"
export const createOrderController = async (req, res) => {
    try {
        const { userId, cartItem, totalPrice, shippingAddress, paymentMethod } = req.body

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                error: "Invalid userId format",
            });
        }
        if (!userId) {
            return res.status(400).json({
                status: false,
                error: "userId is required"
            })
        }

        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(400).json({
                status: false,
                error: "user not found"
            })
        }


        const product = cartItem.map((item) => ({
            name: item?.title,
            image: item?.image,
            price: item?.price,
            quantity: item?.quantity
        }))


        const order = await orderModel.create({
            user: userId,
            products: product,
            totalPrice: totalPrice,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod
        })


        return res.status(200).json({
            status: true,
            message: "Order created successfully",
            order
        })

    } catch (error) {
        console.log("🚀 ~ file: OrderController.js:56 ~ createOrderController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}