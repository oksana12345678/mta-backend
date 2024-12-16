import createHttpError from 'http-errors';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../services/products.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';
import env from '../utils/evn.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';

export const getProductsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllProducts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: `Success!`,
    data: contacts,
  });
};

export const getProductByIdController = async (req, res) => {
  const { productId } = req.params;
  const product = await getProductById(productId);
  console.log('ProductId', productId);
  if (!product) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${productId}!`,
    data: product,
  });
};

export const createProductController = async (req, res) => {
  const photos = req.files;
  let photoUrls = [];

  if (photos && photos.length) {
    for (const photo of photos) {
      let photoUrl;
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
      photoUrls.push(photoUrl);
    }
  }

  const productData = {
    ...req.body,
    photo: photoUrls,
  };
  const product = await createProduct(productData);

  res.status(201).json({
    status: 201,
    message: `Successfully created a product!`,
    data: product,
  });
};

export const deleteProductController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await deleteProduct(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Product not found');
  }

  res.status(204).send();
};

export const patchProductController = async (req, res) => {
  const { productId } = req.params;
  const photos = req.files;

  let photoUrls = [];

  if (photos && photos.length) {
    for (const photo of photos) {
      let photoUrl;
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
      photoUrls.push(photoUrl);
    }
  }

  const result = await updateProduct(productId, {
    ...req.body,
    photo: photoUrls,
  });

  if (!result) {
    throw createHttpError(404, 'Product not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a product!',
    data: result.product,
  });
};

export const upsertContactController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await updateProduct(productId, req.body, req.user._id, {
      upsert: true,
    });
    console.log('result', result);
    console.log('Request body', req.body);
    if (!result) {
      throw createHttpError(404, 'Product not found!');
    }
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: 'Successfully upserted a product!',
      data: result.contact,
    });
  } catch (err) {
    next(err);
  }
};
