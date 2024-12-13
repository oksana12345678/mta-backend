import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    user: {
      name: String,
      email: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    accessToken: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v > new Date(),
        message: 'accessTokenValidUntil must be in the future.',
      },
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SessionCollection = model('sessions', sessionSchema);

export default SessionCollection;
