import bcrypt from 'bcryptjs'; // Import bcrypt to hash passwords
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js'; // Import the User model


export const test = (req, res) => { // Test route for the API to check if it's working
  res.json({ message: 'API is working!!' });
};


//req.body es el objeto que se envia en el body de la peticion
//req.user es el objeto que se envia en el token del archivo verifyUser.js carpeta utils


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
};


export const deleteUser = async(req, res, next) => {
  // here we are checking if the user is trying to delete their own account
  if(!req.user.isAdmin && req.user.id !== req.params.userId){ // si el usuaario es admin puede eliminar otros perfiles
    return next(errorHandler(403, "You can only delete your account!") ); // Pass the error to the error handling middleware (in api/index.js)
  }
  try {
    await User.findByIdAndDelete(req.params.userId); // Delete the user,params.userId es el id que se envia en la url de la peticion,no de la pagina
    res.status(200).json({ message: "Account has been deleted!" }); // Send a success message
  } catch (error) {
    next(error); // Pass the error to the error handling middleware (in api/index.js)
  }
};


export const signout = (req, res,next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out') // Clear the access token cookie
    } catch (error) {
        next(error); // Pass the error to the error handling middleware (in api/index.js)
    }
}



export const getusers = async(req, res, next) => {
    if(!req.user.isAdmin){
      return next(errorHandler(403, "You are not authorized to view all users!") ); // Pass the error to the error handling middleware (in api/index.js)
    }

    try {
      const startIndex =  parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
      const users = await User.find().skip(startIndex).limit(limit).sort({createdAt: sortDirection}); // Find all users
      const usersWithoutPassword = users.map(user => { // Map through the users and exclude the password
        const { password, ...rest } = user._doc; // Destructure the user and exclude the password,._doc is a method that returns the raw object from the database
        return rest;
      });
      const totalUsers = await User.countDocuments(); // Count the total number of users
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } }); // Count the number of users created in the last month
    
      res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers }); // Send the users, total number of users, and number of users created in the last month
    } catch (error) {
      next(error); // Pass the error to the error handling middleware (in api/index.js)
    }
};


export const getUser = async(req, res, next) => {
  try {
      const user = await User.findById(req.params.userId); // Find the user by id
      if(!user) {
          return next(errorHandler(404, "User not found!") ); // Pass the error to the error handling middleware (in api/index.js)
      }
      const { password, ...rest } = user._doc; // Destructure the user and exclude the password
      res.status(200).json(rest); // Send the user
  } catch (error) {
      next(error); // Pass the error to the error handling middleware (in api/index.js)
  }
};