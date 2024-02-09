import express from 'express';
import { signup } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/signup', signup); // Signup route


export default router; // Export the router
//default means that when we import this file, we can name it whatever we want