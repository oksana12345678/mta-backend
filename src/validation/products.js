import Joi from 'joi';
import { model, Schema } from 'mongoose';

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    types: {
      type: String,
    },
    price: {
      type: [String],
      required: true,
    },
    size: [
      {
        type: Map,
        of: Schema.Types.Mixed,
      },
    ],
    OpeningPage: {
      type: [String],
    },
    color: [
      {
        type: Map,
        of: String,
      },
    ],
    finish: {
      type: [String],
    },
    posts: [
      {
        type: Map,
        of: Number,
      },
    ],
    SuitOfFittings: [
      {
        type: Map,
        of: Number,
      },
    ],
    ElectricStrike: [
      {
        type: Map,
        of: Number,
      },
    ],
    description: [
      {
        type: Map,
        of: String,
      },
    ],
    tags: [String],
    SKU: {
      type: String,
      required: true,
    },
    long_desc: {
      type: Map,
      of: Object,
    },
    Additional_information: {
      type: Map,
      of: Object,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    photo: { type: [String] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProductsCollection = model('products', productsSchema);

export const validateProduct = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  types: Joi.string().min(3).max(100),
  price: Joi.array().items(Joi.string()).required(),
  size: Joi.array().items(
    Joi.object().pattern(
      Joi.string().required(),
      Joi.alternatives().try(Joi.number(), Joi.string()),
    ),
  ),
  OpeningPage: Joi.array().items(Joi.string()),
  color: Joi.array().items(
    Joi.object().pattern(
      Joi.string().min(1),
      Joi.string().regex(/^#[0-9A-Fa-f]{3,6}$/),
    ),
  ),
  finish: Joi.array().items(Joi.string().valid('Mat', 'Połysk')),
  posts: Joi.array().items(
    Joi.object().pattern(Joi.string().required(), Joi.number().required()),
  ),
  SuitOfFittings: Joi.array().items(
    Joi.object().pattern(Joi.string().required(), Joi.number()),
  ),
  ElectricStrike: Joi.array().items(
    Joi.object().pattern(
      Joi.string().valid('Tak', 'Nie').required(),
      Joi.number(),
    ),
  ),
  description: Joi.array().items(
    Joi.object().pattern(Joi.string().required(), Joi.string()),
  ),
  tags: Joi.array().items(Joi.string()),
  SKU: Joi.string().required(),
  long_desc: Joi.object().pattern(Joi.string().required(), Joi.string()),
  Additional_information: Joi.object().pattern(
    Joi.string().required(),
    Joi.string(),
  ),
  photo: Joi.array().items(Joi.string()),
});

export const validateUpdate = Joi.object({
  name: Joi.string().min(3).max(100),
  types: Joi.string().min(3).max(100),
  price: Joi.string(),
  size: Joi.array().items(
    Joi.object().pattern(
      Joi.string().required(),
      Joi.alternatives().try(Joi.number(), Joi.string()),
    ),
  ),
  OpeningPage: Joi.array().items(Joi.string()),
  color: Joi.array().items(
    Joi.object().pattern(
      Joi.string().min(1).required(),
      Joi.string().regex(/^#[0-9A-Fa-f]{6}$/),
    ),
  ),
  finish: Joi.array().items(Joi.string().valid('Mat', 'Połysk')),
  posts: Joi.array().items(
    Joi.object().pattern(Joi.string().required(), Joi.number().required()),
  ),
  SuitOfFittings: Joi.array().items(
    Joi.object().pattern(Joi.string().required(), Joi.number().required()),
  ),
  ElectricStrike: Joi.array().items(
    Joi.object().pattern(
      Joi.string().valid('Tak', 'Nie').required(),
      Joi.number().required(),
    ),
  ),
  description: Joi.array()
    .items(
      Joi.object().pattern(Joi.string().required(), Joi.string().required()),
    )
    .optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  SKU: Joi.string().optional(),
  long_desc: Joi.object()
    .pattern(Joi.string().required(), Joi.string().required())
    .optional(),
  Additional_information: Joi.object()
    .pattern(Joi.string().required(), Joi.string().required())
    .optional(),
  photo: Joi.array().items(Joi.string()),
});
