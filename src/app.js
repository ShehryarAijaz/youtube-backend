import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.config.js';

const app = express();

app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.get('/test', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

// routes
import userRoutes from './routes/user.routes.js';

// routes declaration
app.use('/api/v1/users', userRoutes);

export default app;