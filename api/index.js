import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js'; // Import user routes
import authRoutes from './routes/auth.route.js'; // Import auth routes
import postRoutes from './routes/post.route.js'; // Import post routes
import commentRoutes from './routes/comment.route.js'; // Import comment routes

import cookieParser from 'cookie-parser';
import path from 'path'; //DEPLOYMENT

dotenv.config();                    // Load environment variables

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('Connected to MongoDB!');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
}); // Connect to MongoDB

const __dirname = path.resolve(); // Set __dirname to the current directory name

const app = express(); // Create express app
app.use(express.json()); // Use express json middleware
//middleware is a function that has access to the request and response objects

app.use(cookieParser()); // Use cookie parser middleware

app.listen(3000, () => {    // Start server
  console.log('Server started on port 3000!');
});

// this is for testing purposes at the beginning,now not
app.use('/api/user', userRoutes);   // Use user routes
app.use('/api/auth', authRoutes);   // Use auth routes
app.use('/api/post', postRoutes);  // Use post routes
app.use('/api/comment', commentRoutes);  // Use comment routes

//DEPLOYMENT
app.use(express.static(path.join(__dirname, '/client/dist'))); // Serve the static files from the React app
app.get('*', (req, res) => { // Handles any requests that don't match the ones above
    res.sendFile(path.join(__dirname ,'client', 'dist', 'index.html'));
});
/////////////////////////////////////
app.use((err, req, res, next) => {  // Error handling middleware
    const statusCode = err.statusCode || 500; // If there is a status code in the error, use it, otherwise use 500
    const message = err.message || 'Internal server error'; // Get the error message
    res.status(statusCode).json({
      success: false,
      statusCode,
      message
    }); // Send the error message
}); 