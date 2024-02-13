import express from 'express';
import { test, updateUser, deleteUser, signout, getusers, getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test); // Test route
router.put('/update/:userId', verifyToken,updateUser); // Update route
//put is for updating an existing resource
router.delete('/delete/:userId', verifyToken, deleteUser); // Delete route
router.post('/signout', signout); // Signout route
router.get('/getusers',verifyToken, getusers); // Get all users route
router.get('/:userId', getUser); // Get user by id route


export default router; // Export the router
//default means that when we import this file, we can name it whatever we want