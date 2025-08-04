import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import { env } from '../config/env.config.js';

cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET
    })

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
            }
        )
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("Error uploading file", error);
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId,
            {
                resource_type: "auto",
            }
        )

        return response;
    } catch (error) {
        console.log("Error deleting file", error);
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };