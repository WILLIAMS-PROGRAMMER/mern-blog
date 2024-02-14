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
};

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId //params comes from the url of the request
        }).sort({createdAt: -1}); // find all comments with the postId from the url, sort them by the createdAt field in descending order
        
        res.status(200).json(comments); // return the comments as a json response

    }
    catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.commentId); // find the comment by the id from the url
            if(!comment) return next(errorHandler(404, 'Comment not found')); // if the comment does not exist, return an error
            
            
            const userIndex = comment.likes.indexOf(req.user.id); // find the index of the user's id in the likes array of the comment
            if(userIndex === -1) { // if the user's id is not in the likes array
                comment.numberOfLikes ++; // increment the numberOfLikes field by 1
                comment.likes.push(req.user.id); // add the user's id to the likes array
            } else {
                comment.numberOfLikes --; // decrement the numberOfLikes field by 1
                comment.likes.splice(userIndex, 1); // remove the user's id from the likes array
            }
            await comment.save(); // save the updated comment to the database
            res.status(200).json(comment); // return the updated comment as a json response
        } catch (error) {
            next(error);
        }
};

//el ADMIN PUEDE EDITAR CUALQUIER COMENTARIO
export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId); // find the comment by the id from the url
        if(!comment) return next(errorHandler(404, 'Comment not found')); // if the comment does not exist, return an error
        if((comment.userId !== req.user.id) && !req.user.isAdmin) return next(errorHandler(403, 'You are not allowed to edit this comment')); // if the userId of the comment does not match the id of the user in the token, return an error
        
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {content: req.body.content}, {new: true}); // find the comment by the id from the url and update the content with the content from the request body
        res.status(200).json(editedComment); // return the updated comment as a json response
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId); // find the comment by the id from the url
        if(!comment) return next(errorHandler(404, 'Comment not found')); // if the comment does not exist, return an error
        if((comment.userId !== req.user.id) && !req.user.isAdmin) return next(errorHandler(403, 'You are not allowed to delete this comment')); // if the userId of the comment does not match the id of the user in the token, return an error
        
        await Comment.findByIdAndDelete(req.params.commentId); // find the comment by the id from the url and delete it
        res.status(200).json('Comment deleted successfully'); // return a success message as a json response
    } catch (error) {
        next(error);
    }
};


export const getAllComments = async (req, res, next) => {
    if(!req.user.isAdmin) return next(errorHandler(403, 'You are not allowed to get all comments') ); // if the user is not an admin, return an error
    try {
        const startIndex = parseInt(req.query.startIndex) || 0; // parse the startIndex from the query string of the request
        const limit = parseInt(req.query.limit) || 9; // parse the limit from the query string of the request
        const sortDirection = req.query.sort == 'asc' ? 1 : -1; // parse the sortDirection from the query string of the request
        const comments = await Comment.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit); // find all comments, sort them by the createdAt field in the sortDirection, skip the startIndex, and limit the number of comments

        const totalComments = await Comment.countDocuments(); // count the total number of comments
        const now = new Date(); // create a new Date object
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); // create a new Date object for one month ago
        const lastMonthComments = await Comment.countDocuments({createdAt: {$gte: oneMonthAgo}}); // count the number of comments created in the last month

        res.status(200).json({comments, totalComments, lastMonthComments}); // return the comments, totalComments, and lastMonthComments as a json response
    } catch (error) {
        next(error);
    }
};

//skip startindex significa que si startIndex es 0, entonces no se salta ningun comentario, si startIndex es 1, entonces se salta el primer comentario, si startIndex es 2, entonces se salta los dos primeros comentarios, y asi sucesivamente