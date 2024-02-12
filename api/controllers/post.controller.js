import { parse } from "qs";
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
        return next(errorHandler(400, "Title and content are required")); //next es una funcion que se ejecuta cuando hay un error,viene de express
    }
    //slug is a URL friendly version of the title
    const slug = req.body.title.toLowerCase().split(" ").join("-").replace(/[^a-zA-Z0-9-]/g, "-");

    const newPost = new Post({
        ...req.body, slug, userId: req.user.id //... req.body ,con esos tres puntos ,slug y userId tambien se agregan al objeto
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost); // se retorna savedPost, que es el post que se acaba de guardar, es un objeto
    } catch (error) {
        next(error);  //error duplicate key porque en el modelo de post , titulo es unique y slug es unique, eso causa error
    }

};

//the query comes from the URL, the body comes from a form, the user comes from the token in verifyuser.js
export const getposts = async (req, res, next) => {
    try {
        //startIndex is the index of the first post to return
        const startIndex = parseInt(req.query.startIndex) || 0; //req.query viene de la url, es un objeto que se envia en la url
        const limit = parseInt(req.query.limit) || 9; //limit es la cantidad de posts que se quieren mostrar
        const sortDirection = req.query.order === 'asc' ? 1: -1; //sortDirection es la direccion en la que se quieren ordenar los posts
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}), //if userId is in the query, add it to the query
            ...(req.query.category && {category: req.query.userId}), //if userId is in the query, add it to the query
            ...(req.query.slug && {slug: req.query.userId}), //if userId is in the query, add it to the query
            ...(req.query.postId && {_id: req.query.userId}), //if userId is in the query, add it to the query
            ...(req.query.searchTerm && {
                $or: [ // or is a mongoDB operator that allows us to query for multiple fields, regex is a mongoDB operator that allows us to query for a string that matches a pattern
                    {title: { $regex: req.query.searchTerm, $options: "i" }}, //if userId is in the query, add it to the query
                    {content: { $regex: req.query.searchTerm, $options: "i" }}, //if userId is in the query, add it to the query
                ]
            }), //if userId is in the query, add it to the query
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit); //sort is a mongoDB function that allows us to sort the results, skip is a mongoDB function that allows us to skip a number of results, limit is a mongoDB function that allows us to limit the number of results
    
        const totalPost = await Post.countDocuments(); //countDocuments is a mongoDB function that allows us to count the number of documents in a collection
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthPosts = await Post.countDocuments({createdAt: {$gte: oneMonthAgo} });

        res.status(200).json({posts, totalPost, lastMonthPosts});

    } catch (error) {
        next(error); // next come from express, it is a function that is called when there is an error
    }
}