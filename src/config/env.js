import dotenv from 'dotenv';

// Load environment variables
dotenv.config({
    path: ['./.env.local', './.env.prod', './.env']
});

// Export environment variables for use in other modules
export const env = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN
};

console.log("PORT", env.PORT);
console.log("NODE_ENV", env.NODE_ENV);
console.log("MONGODB_URI", env.MONGODB_URI);
console.log("ACCESS_TOKEN_SECRET", env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET", env.REFRESH_TOKEN_SECRET);
console.log("CLOUDINARY_CLOUD_NAME", env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY", env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET", env.CLOUDINARY_API_SECRET);
console.log("CORS_ORIGIN", env.CORS_ORIGIN);