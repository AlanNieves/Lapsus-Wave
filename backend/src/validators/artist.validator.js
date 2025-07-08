import Joi from "joi";

export const createArtistSchema = Joi.object({
  name: Joi.string().min(1).required(),
  bio: Joi.string().max(500).allow("").optional(),
  imageUrl: Joi.string().uri().optional()
});
