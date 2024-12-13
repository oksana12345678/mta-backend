import createHttpError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, 'Not Found'));
};

export default notFoundHandler;
