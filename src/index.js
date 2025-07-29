import './config/env.js';
import connectDB from './db/index.js';
import app from './app.js';
import { env } from './config/env.js';

connectDB()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });
    })
    .catch((err) => {
        console.log("ERROR: ", err);
        process.exit(1);
    });
