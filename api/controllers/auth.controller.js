import { ok } from 'assert';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {  //req: request, res: response
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){ // Check if all fields are filled
       next(errorHandler(400, "All fields are required!") ); // Pass the error to the error handling middleware (in api/index.js)
    }

    const hashedPassword = bcryptjs.hashSync(password, 12); // Hash the password  // 12 is the number of rounds of hashing

    const newUser = new User({username, email, password:hashedPassword}); // Create a new user

    try {
        await newUser.save(); // Save the new user
        res.json({message: "User created successfully!"});
    } catch (error) {
        next(error); // Pass the error to the error handling middleware (in api/index.js
    }
   
}
