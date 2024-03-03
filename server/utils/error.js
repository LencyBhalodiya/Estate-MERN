export const errorHandler = (res, statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return res.status(statusCode).send(error)
}