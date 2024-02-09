import { ok } from 'assert';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {  //req: request, res: response
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){ // Check if all fields are filled
        return res.status(400).json({message: "All fields are required"});
    }

    const hashedPassword = bcryptjs.hashSync(password, 12); // Hash the password  // 12 is the number of rounds of hashing

    const newUser = new User({username, email, password:hashedPassword}); // Create a new user

    try {
        await newUser.save(); // Save the new user
        res.json({message: "User created successfully!"});
    } catch (error) {
        res.status(500).json({message: "Error creating user"});
    }
   
}
