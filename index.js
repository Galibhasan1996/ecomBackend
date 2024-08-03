import bodyParser from "body-parser"
import chalk from "chalk"
import cookieParser from "cookie-parser"
import express from "express"
import ExpressMongoSanitize from "express-mongo-sanitize"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import { currentIPAddress, currentTime } from "./Util/Constent.js"

import auth from "../ecomBackend/Route/Auth/Auth.js"
import order from "../ecomBackend/Route/order/OrderRoute.js"

import { connectDB } from "./db.js"



dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

connectDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(ExpressMongoSanitize())
app.use(helmet())
app.use(cors({ credentials: true, origin: true }))
app.use(morgan("dev"))


app.use("/api/v1/auth", auth)
app.use("/api/v1/order", order)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Emern" })
})


app.listen(PORT, () => {
    console.log(`Server is running on ( PORT ${chalk.red(PORT)} IP ${chalk.red(currentIPAddress())}  Time ${chalk.red(currentTime)} )`);
});



