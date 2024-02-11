import { ok } from 'assert';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'; // jwt is a standard for access tokens, which is a JSON object that contains information about the user and the token itself

export const signup = async (req, res, next) => {  //req: request, res: response
    const {username, email, password} = req.body; // req.body is the data that is sent to the server from the client

    if(!username || !email || !password || username === '' || email === '' || password === ''){ // Check if all fields are filled
       next(errorHandler(400, "All fields are required!") ); // Pass the error to the error handling middleware (in api/index.js)
    }

    const hashedPassword = bcryptjs.hashSync(password, 12); // Hash the password  // 12 is the number of rounds of hashing

    const newUser = new User({username, email, password:hashedPassword}); // Create a new user

    //mognodb will automatically create a collection called users and store the data
    //mongodb will verffy duplicate email and username
    try {
        await newUser.save(); // Save the new user
        res.json({message: "User created successfully!"});
    } catch (error) {
        next(error); // Pass the error to the error handling middleware (in api/index.js
    } 
};



export const signin = async (req, res, next) => {  //req: request, res: response
    const {email, password} = req.body;

    if(!email || !password || email === ''|| password === ''){ // Check if all fields are filled
       next(errorHandler(400, "All fields are required!") ); // Pass the error to the error handling middleware (in api/index.js)
    }

    try {
        const validUser = await User.findOne({email}); // Find the user by username, finfone es de mongoose,mongoose es el ORM de mongodb
        //orm es un mapeo de objetos relacionales, es decir, es una herramienta que permite a los desarrolladores de software crear, leer, actualizar y eliminar datos de la base de datos utilizando un lenguaje de programación orientado a objetos
        if(!validUser){
            return next(errorHandler(404, "Invalid credentials!") ); // Pass the error to the error handling middleware (in api/index.js)
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password); // Compare the password
        if(!validPassword){
            return next(errorHandler(400, "Invalid credentials!") ); // Pass the error to the error handling middleware (in api/index.js)
        }

        //everything fine, create the token
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'}); // Create the token
        
        const {password:pass, ...rest} = validUser._doc; // Remove the password from the user object

        
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest); // Send the token in a cookie,this is a secure way to store the token,without this 
    } catch (error) {
        next(error); // Pass the error to the error handling middleware (in api/index.js
    }
};

export const google = async (req, res, next) => { //next for error handling
    const {name, email, googlePhotoURL} = req.body; //req.body is the data that is sent to the server from the client
    
    if(!name || !email || name === '' || email === ''){ // Check if all fields are filled
       next(errorHandler(400, "All fields are required!") ); // Pass the error to the error handling middleware (in api/index.js)
    }

    try {
       
        // el usuario ya existe
        const validUser = await User.findOne({email}); // Find the user by email
        if(validUser){
            const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'}); // Create the token
            const {password:pass, ...rest} = validUser._doc; // Remove the password from the user object
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest); // Send the token in a cookie
        } else {
           const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password
           const hashedPassword = bcryptjs.hashSync(generatedPassword, 12); // Hash the password
           const newUser = new User({username: name.toLowerCase().split('').join('') + Math.random().toString(9).slice(-3),
            email, password:hashedPassword, profilePicture:googlePhotoURL}); // Create a new user
            
            await newUser.save(); // Save the new user
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'}); // Create the token
            const {password:pass, ...rest} = newUser._doc; // Remove the password from the user object
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest); // Send the token in a cookie
        }

    } catch (error) {
        next(error); // Pass the error to the error handling middleware (in api/index.js
    }
};
