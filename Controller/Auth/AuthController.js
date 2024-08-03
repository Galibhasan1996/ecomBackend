import validator from "validator"
import UserModel from "../../Model/user/UserModel.js"
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { customConsole } from "../../Util/Constent.js"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import orderModel from "../../Model/order/OrderModel.js"
dotenv.config()





// ---------------send varification email--------------

const sendVarificationEmail = async (email, token) => {
    // console.log('mailer fuction called ' + code);

    const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 587,
        // secure: false,
        // requireTLS: true,
        service: 'gmail',
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.NodeEmail_Email,
            pass: process.env.nodeEmailPassword,
        },
    });

    let info = await transporter.sendMail({
        from: 'Ecommerce app',
        to: `${email}`,
        subject: "Email verification",
        text: `varify your email  : http://localhost:3000/api/v1/auth/verify/${token}`,
        // html: `<b>Your Verification token is ${token}</b>`
    })
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}





// -----------register controller-----------------
export const userRegisterController = async (req, res) => {
    try {
        const { name, email, password, mobile, dateOfBirth } = req.body

        if (!name) {
            return res.status(400).json({
                status: false,
                error: "name is required",
            })
        }

        if (!email) {
            return res.status(400).json({
                status: false,
                error: "email is required",
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: false,
                error: "email format is invalid",
            })
        }

        if (!password) {
            return res.status(400).json({
                status: false,
                error: "password is required",
            })
        }
        if (!mobile) {
            return res.status(400).json({
                status: false,
                error: "mobile is required",
            })
        }
        if (!dateOfBirth) {
            return res.status(400).json({
                status: false,
                error: "dateOfBirth is required",
            })
        }

        const user = await UserModel.findOne({ email })

        if (user) {
            return res.status(400).json({
                status: false,
                error: "user already exists",
            })
        }

        const createUser = await UserModel.create({
            name,
            email,
            password,
            mobile,
            dateOfBirth
        })

        createUser.verificationToken = jwt.sign({ _id: createUser._id }, process.env.JWT_SECRET)

        await createUser.save()

        sendVarificationEmail(createUser.email, createUser.verificationToken)

        return res.status(200).json({
            status: true,
            message: "Register Successfully",
            createUser
        })

    } catch (error) {
        customConsole("🚀 ~ file: AuthController.js:124 ~ userRegisterController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}



// ----------varify controller----------------


export const varifyUserController = async (req, res) => {
    try {
        const { token } = req.params
        customConsole("🚀 ~ file: AuthController.js:141 ~ varifyUserController ~ token:", token)

        if (!token) {
            return res.status(400).json({
                status: false,
                error: "token is required",
            })
        }

        const user = await UserModel.findOne({ verificationToken: token })

        if (!user) {
            return res.status(400).json({
                status: false,
                error: "Invalid Varification Token",
            })
        }

        user.verified = true
        user.verificationToken = undefined
        await user.save()


        return res.status(200).json({
            status: true,
            message: "Email Varified Successfully",
            user
        })


    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:172 ~ varifyUserController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}



// ------------log in controlller--------------



export const userLonginController = async (req, res) => {
    try {
        const { email, password, } = req.body

        if (!email) {
            return res.status(400).json({
                status: false,
                error: "email is required",
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: false,
                error: "email format is invalid",
            })
        }

        if (!password) {
            return res.status(400).json({
                status: false,
                error: "password is required",
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                status: false,
                error: "user not found",
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                status: false,
                error: "invalid password",
            })
        }


        if (!user.verified) {
            return res.status(400).json({
                status: false,
                error: "user not verified",
            })
        }

        return res.status(200).json({
            status: true,
            message: "Login Successfully",
            user,
            token
        })



    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:250 ~ userLonginController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}



// -----------add new address controller------------

export const addNewAddressController = async (req, res) => {
    try {
        const { country, city, name, mobileNo, houseNo, street, landmark, postalCode, userId } = req.body


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
                error: "userId is required",
            })
        }

        if (!country) {
            return res.status(400).json({
                status: false,
                error: "country is required",
            })
        }

        if (!city) {
            return res.status(400).json({
                status: false,
                error: "city is required",
            })
        }

        if (!name) {
            return res.status(400).json({
                status: false,
                error: "name is required",
            })
        }

        if (!mobileNo) {
            return res.status(400).json({
                status: false,
                error: "mobileNo is required",
            })
        }

        if (!houseNo) {
            return res.status(400).json({
                status: false,
                error: "houseNo is required",
            })
        }

        if (!street) {
            return res.status(400).json({
                status: false,
                error: "street is required",
            })
        }

        if (!landmark) {
            return res.status(400).json({
                status: false,
                error: "landmark is required",
            })
        }

        if (!postalCode) {
            return res.status(400).json({
                status: false,
                error: "postalCode is required",
            })
        }

        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(400).json({
                status: false,
                error: "user not found",
            })
        }

        user.addresses.push({ city, name, houseNo, street, landmark, postalCode, mobileNo, country })

        await user.save()

        return res.status(200).json({
            status: true,
            message: "Address Added Successfully",
            user
        })
    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:359 ~ addNewAddressController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}

// -----------getAllUserListController -----------

export const getAllUserListController = async (req, res) => {
    try {
        const allUser = await UserModel.find({})

        if (!allUser) {
            return res.status(400).json({
                status: false,
                error: "user not found",
            })
        }

        return res.status(200).json({
            status: true,
            message: "All User List",
            total: allUser.length,
            allUser
        })

    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:389 ~ getAllUserListController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}


// ---------------getUserAddressController-----------

export const getUserAddressController = async (req, res) => {
    try {

        const { userId } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                error: "Invalid userId format"
            })
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

        const userAddress = user.addresses

        return res.status(200).json({
            status: true,
            message: "User Address",
            AddressCount: userAddress.length,
            user
        })


    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:440 ~ getUserAddressController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}


// ---------profile controller-----------
export const getUserProfileController = async (req, res) => {
    try {
        const { userId } = req.params

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

        return res.status(200).json({
            status: true,
            message: "User Profile",
            user
        })


    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:488 ~ getUserProfileController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })
    }
}


export const getUserOrderController = async (req, res) => {
    try {
        const { userId } = req.params

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

        const order = await orderModel.find({ user: userId }).populate("user")
        if (!order || order.length === 0) {
            return res.status(400).json({
                status: false,
                error: "order not found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "User Order",
            order
        })

    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:542 ~ getUserOrderController ~ error:", error)
        return res.status(500).json({
            status: false,
            error: "Internal Server Error",
            error: error.message
        })

    }
}