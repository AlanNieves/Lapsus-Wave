import Joi from "joi";

export const createReviewSchema = Joi.object({
  songId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).allow("").optional()
});
