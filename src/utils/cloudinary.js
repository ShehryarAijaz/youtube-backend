import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import { env } from '../config/env.js';

cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET
    })

const uploadHandler = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
            }
        )
        console.log("File uploaded successfully", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("Error uploading file", error);
        return null;
    }
}

export default uploadHandler;