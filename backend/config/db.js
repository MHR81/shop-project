import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // options recommended by mongoose 6+ are default
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
