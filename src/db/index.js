import mongoose from 'mongoose';
import DB_NAME from '../constants.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        if (connectionInstance) {
            console.log(`Connected to MongoDB ${DB_NAME} successfully.`);
        } else {
            console.log("Connection failed with MongoDB");
        }
    } catch (error) {
        console.log("!!MONGODB CONNECTION ERROR!!: ", error)
        process.exit(1);
    }
}

export default connectDB;