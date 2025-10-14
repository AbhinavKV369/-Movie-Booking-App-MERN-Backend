import mongoose from "mongoose";

const dbConfig = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfuly")
    } catch (error) {
      console.log(error)  
    }
}

export default dbConfig;