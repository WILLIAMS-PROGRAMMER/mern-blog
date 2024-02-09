import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'; // Import user routes
import authRoutes from './routes/auth.route.js'; // Import auth routes

dotenv.config();                    // Load environment variables

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
}); // Connect to MongoDB

const app = express(); // Create express app
app.use(express.json()); // Use express json middleware
//middleware is a function that has access to the request and response objects

app.listen(3000, () => {    // Start server
  console.log('Server started on port 3000!');
});

// this is for testing purposes
app.use('/api/user', userRoutes);   // Use user routes
app.use('/api/auth', authRoutes);   // Use auth routes