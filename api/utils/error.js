export const errorHandler = (statusCode, message) => {  // Error handling middleware
    const error = new Error(message); // Create a new error
    error.statusCode = statusCode; // Set the status code
    error.message = message; // Set the message
    return error; // Return the error
};