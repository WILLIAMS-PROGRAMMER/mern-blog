import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test); // Test route

export default router; // Export the router
//default means that when we import this file, we can name it whatever we want