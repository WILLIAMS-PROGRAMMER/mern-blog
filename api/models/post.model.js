
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
   content: {
       type: String,
       required: true
   },
   title: {
       type: String,
       required: true,
       unique: true
   },
   image: {
         type: String,
         default: "https://venngage-wordpress.s3.amazonaws.com/uploads/2020/10/Anatomy-of-the-Perfect-Blog-Post.png"
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: { //slug is a URL friendly version of the title
        type: String,
        required: true,
        unique: true
   },
}, { timestamps: true }); //timestamps: true will automatically add createdAt and updatedAt fields to the schema

const Post = mongoose.model('Post', postSchema); //Create a new model with the schema

export default Post;