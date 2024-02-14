import express from 'express';
import { createComment, getComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();

router.post('/create',verifyToken ,createComment); //post es para crear  adicionalmente delete es para eliminar
router.get('/getPostComments/:postId' ,getComments); //get es para obtener
router.put('/likeComment/:commentId',verifyToken ,likeComment); //put es para actualizar

export default router;