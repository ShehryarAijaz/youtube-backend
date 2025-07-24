import dotenv from 'dotenv'
import express from 'express';
import connectDB from './db/index.js'

dotenv.config({
    path: ['.env.local', '.env']
})
const app = express();

connectDB();