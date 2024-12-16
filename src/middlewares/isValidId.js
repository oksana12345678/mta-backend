import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
const isValidId = (req, res, next) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    throw createHttpError(404, 'Not found');
  }
  next();
};

export default isValidId;
