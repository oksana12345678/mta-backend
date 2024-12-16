import { SORT_ORDER } from '../constants/index.js';
import calculatePagination from '../utils/calculatePagination.js';
import { ProductsCollection } from '../validation/products.js';

export const getAllProducts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const productsQuery = ProductsCollection.find();

  if (filter.types) {
    productsQuery.where('types').equals(filter.types);
  }
  if (filter.isFavourite) {
    productsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [ProductsCount, products] = await Promise.all([
    ProductsCollection.countDocuments(),
    productsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePagination(ProductsCount, perPage, page);

  return {
    data: products,
    ...paginationData,
  };
};

export const getProductById = async (productId) => {
  const product = await ProductsCollection.findOne({ _id: productId });

  return product;
};

export const deleteProduct = async (productId, userId) => {
  const contact = await ProductsCollection.findOneAndDelete({
    _id: productId,
    userId,
  });
  return contact;
};

export const updateProduct = async (productId, payload, options = {}) => {
  const rawResult = await ProductsCollection.findByIdAndUpdate(
    { _id: productId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    product: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const createProduct = async (payload) => {
  const product = new ProductsCollection({
    ...payload,
    userId: payload.userId,
  });
  await product.save();
  return product;
};
