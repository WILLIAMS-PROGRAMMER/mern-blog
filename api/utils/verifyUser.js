import jwt from 'jsonwebtoken';
import  {errorHandler} from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user;
        next(); // Call the next middleware because we are done here, para ir a la siguiente funcion(para entender mejor ir a linea 7 user.route.js)
    });
};
