import Joi from 'joi';

export const login = {
  body: Joi.object({
    userName: Joi.string().trim().lowercase().required(),
    password: Joi.string().required(),
  }),
};

export const changePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(64).required(),
  }),
};
