import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected!");
  } catch (error) {
    console.log(`Error connection to mongoDB: ${error.message}`);
  }
};

export default connectDb;