import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';

dotenv.config({
    path: ['.env.local', '.env']
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });
    })
    .catch((err) => {
        console.log("ERROR: ", err);
        process.exit(1);
    });
