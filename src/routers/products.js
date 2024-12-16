import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  patchProductController,
  upsertContactController,
} from '../controllers/controllers.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadMultiple } from '../middlewares/multer.js';
import { validateProduct, validateUpdate } from '../validation/products.js';

const productsRouter = Router();

productsRouter.use(authenticate);

productsRouter.get('/', ctrlWrapper(getProductsController));

productsRouter.get(
  '/:productId',
  isValidId,
  ctrlWrapper(getProductByIdController),
);

// contactsRouter.post(
//   '/register',
//   validateBody(validateContact),
//   ctrlWrapper(createContactController),
// );

productsRouter.post(
  '',
  uploadMultiple,
  validateBody(validateProduct),
  ctrlWrapper(createProductController),
);

productsRouter.delete(
  '/:productId',
  isValidId,
  ctrlWrapper(deleteProductController),
);

productsRouter.put(
  '/:productId',
  uploadMultiple,
  isValidId,
  validateBody(validateUpdate),
  validateBody(validateProduct),
  ctrlWrapper(upsertContactController),
);

productsRouter.patch(
  '/:productId',
  uploadMultiple,
  isValidId,
  validateBody(validateUpdate),
  ctrlWrapper(patchProductController),
);

export default productsRouter;
