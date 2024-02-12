import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletePost, getposts } from '../controllers/post.controller.js';

const router = express.Router(); // Create a new router

router.post('/create',verifyToken, create); // Signup route
router.get('/getposts', getposts); // Signup route
router.delete('/deletepost/:postId/:userId',verifyToken, deletePost); // Delete post route

export default router; // Export the router
//default means that when we import this file, we can name it whatever we want