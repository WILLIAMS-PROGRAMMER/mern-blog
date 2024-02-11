import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create } from '../controllers/post.controller.js';

const router = express.Router(); // Create a new router

router.post('/create',verifyToken, create); // Signup route

export default router; // Export the router
//default means that when we import this file, we can name it whatever we want