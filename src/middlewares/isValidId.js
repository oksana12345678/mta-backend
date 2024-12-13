import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    throw createHttpError(404, 'Not found');
  }
  next();
};

export default isValidId;
