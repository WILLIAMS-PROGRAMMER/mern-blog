import bcrypt from 'bcryptjs'; // Import bcrypt to hash passwords
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js'; // Import the User model


export const test = (req, res) => { // Test route for the API to check if it's working
  res.json({ message: 'API is working!!' });
};

export const updateUser = async(req, res, next) => {
    // here we are checking if the user is trying to update their own account
   if(req.user.id !== req.params.userId){
       return next(errorHandler(403, "You can only update your account!") ); // Pass the error to the error handling middleware (in api/index.js)
   }

   //here we are checking if the user is trying to update their password
   if(req.body.password){
      if(req.body.password.length < 6){
         return next(errorHandler(400, "Password must be at least 6 characters long!") );
      }
      req.body.password = bcrypt.hashSync(req.body.password, 8); // Hash the password
   }

   //here we are checking if the user is trying to update their username
   if(req.body.username) {
      if(req.body.username.length < 3 || req.body.username.length > 20){
         return next(errorHandler(400, "Username must be between 3 and 20 characters long!") );
      }
      if(req.body.username.includes(' ')){
         return next(errorHandler(400, "Username cannot contain spaces!") );
      }
      if(req.body.username !== req.body.username.toLowerCase()){
         return next(errorHandler(400, "Username must be lowercase!") );
      }
      if(!req.body.username.match(/^[a-z0-9_]+$/)){
         return next(errorHandler(400, "Username can only contain lowercase letters, numbers, and underscores!") );
      }

      //NOTA: MONGODB revisa que no haiga usuarios duplicados
      try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
          $set: { // Set the fields to update
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
          }
        }, {new: true}); // Return the updated user
        const { password, ...rest } = updatedUser._doc; // Destructure the updated user and exclude the password
        res.status(200).json(rest); // Send the updated user
     } catch (error) {
       next(error); // Pass the error to the error handling middleware (in api/index.js)
     }
   }

 

      
};