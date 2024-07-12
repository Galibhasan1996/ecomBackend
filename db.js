import mongoose from "mongoose";
import dotenv from "dotenv"
import { currentIPAddress, currentTime, customConsole } from "./Util/Constent.js";
import chalk from "chalk";

dotenv.config()


export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
            .then(() => {
                console.log(`DB Connected (  IP ${chalk.red(currentIPAddress())}  Time ${chalk.red(currentTime)} )`);
            })
            .catch((error) => {
                customConsole("🚀 ~ file: db.js:14 ~ connectDB ~ error:", error.message)
            })
    } catch (error) {
        customConsole("🚀 ~ file: db.js:17 ~ connectDB ~ error:", error.message)
    }
}
