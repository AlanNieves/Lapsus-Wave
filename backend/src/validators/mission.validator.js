import Joi from "joi";

export const updateMissionProgressSchema = Joi.object({
  missionId: Joi.string().required(),
  progress: Joi.number().min(0).max(100).required()
});
