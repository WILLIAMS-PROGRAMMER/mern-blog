import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();                    // Load environment variables

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
}); // Connect to MongoDB

const app = express();             // Create express app

app.listen(3000, () => {            // Start server
  console.log('Server started on port 3000!');
});