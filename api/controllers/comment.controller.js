import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
    try {
       const {content, userId, postId} = req.body; // destructuring the content, userId, and postId from the request body,body is what the usser sends to the server
        //si el usuario no es igual que el usuario de la cookie entonces retorna un error
       if(userId !== req.user.id) return next(errorHandler(403, 'You are not allowed to create a comment')) // if the userId does not match the id of the user in the token, return an error
        
       const newComment = new Comment({content, userId, postId}); // create a new comment with the content, userId, and postId, NEWcOMMETN ES UNA INSTANCIA DE UN MODELO DE MONGOOSE
        await newComment.save(); // save the new comment to the database
        res.status(200).json(newComment); // return the new comment as a json response
    } catch (error) {
       next(error);
    }
}