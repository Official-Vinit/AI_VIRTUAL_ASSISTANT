import mongoose from "mongoose"

import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);


const connectDb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb