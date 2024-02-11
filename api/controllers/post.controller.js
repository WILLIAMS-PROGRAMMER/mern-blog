import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js" // Import the error handler


//req.body es el objeto que se envia en el body de la peticion
//req.user es el objeto que se envia en el token del archivo verifyUser.js carpeta utils

export const create = async (req, res, next) => {
    // Check if the user is an admin
    if(!req.user.isAdmin) { //req.user viene de verifyToken (carpeta utils) inea 13,verifica token se importa en post.route.js
        return next(errorHandler(403, "You are not allowed to create a post"));
    }
    if(!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Title and content are required"));
    }
    //slug is a URL friendly version of the title
    const slug = req.body.title.toLowerCase().split(" ").join("-").replace(/[^a-zA-Z0-9-]/g, "-");

    const newPost = new Post({
        ...req.body, slug, userId: req.user.id //... req.body ,con esos tres puntos ,slug y userId tambien se agregan al objeto
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);  //error duplicate key porque en el modelo de post , titulo es unique y slug es unique, eso causa error
    }

};