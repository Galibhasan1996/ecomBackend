import express from "express"
import { addNewAddressController, getAllUserListController, getUserAddressController, getUserOrderController, getUserProfileController, userLonginController, userRegisterController, varifyUserController } from "../../Controller/Auth/AuthController.js"
const router = express.Router()
import { rateLimit } from 'express-rate-limit'


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    statusCode: 429,
    // store: ... , // Redis, Memcached, etc. See below.
    message: (req, res) => {
        return res.status(429).json({
            status: false,
            error: "Too Many Requests || Try after 15 minutes",
        })
    }
})

// ----------register router-------------

router.post("/register", userRegisterController)

// --------varify email -----------

router.get("/verify/:token", varifyUserController)

// ----------login controller-----------------

router.post("/login", limiter, userLonginController)

// --------add new address-------------

router.post("/addAddress/", addNewAddressController)

// --------get all user list --------------

router.get("/getAllUserList", getAllUserListController)

// -------------get user Address ---------------

router.get("/getUserAddress/:userId", getUserAddressController)

// --------------user profile-------------
router.get("/userProfile/:userId", getUserProfileController)
// ---------------user order-------------
router.get("/userOrder/:userId", getUserOrderController)

export default router