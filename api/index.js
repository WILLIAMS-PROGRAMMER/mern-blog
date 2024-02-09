import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'; // Import user routes

dotenv.config();                    // Load environment variables

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
}); // Connect to MongoDB

const app = express(); // Create express app

app.listen(3000, () => {    // Start server
  console.log('Server started on port 3000!');
});

// this is for testing purposes
app.use('/api/user', userRoutes);   // Use user routes