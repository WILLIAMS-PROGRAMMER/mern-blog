import express from 'express';
import { signup, signin, google } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/signup', signup); // Signup route
router.post('/signin', signin); // Signin route
router.post('/google', google); // Signin route


export default router; // Export the router
//default means that when we import this file, we can name it whatever we want