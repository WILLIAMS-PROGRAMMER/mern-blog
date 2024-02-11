import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test); // Test route
router.put('/update/:userId', verifyToken,updateUser); // Update route
//put is for updating an existing resource

export default router; // Export the router
//default means that when we import this file, we can name it whatever we want