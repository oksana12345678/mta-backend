import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/controllers.js';
import validateBody from '../middlewares/validateBody.js';
import { validateContact, validateUpdate } from '../validation/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

// contactsRouter.post(
//   '/register',
//   validateBody(validateContact),
//   ctrlWrapper(createContactController),
// );

contactsRouter.post(
  '',
  upload.single('photo'),
  validateBody(validateContact),
  ctrlWrapper(createContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

contactsRouter.put(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(validateUpdate),
  validateBody(validateContact),
  ctrlWrapper(upsertContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(validateUpdate),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
