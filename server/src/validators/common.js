import Joi from 'joi';

export const objectId = () =>
  Joi.string()
    .trim()
    .pattern(/^[a-f\d]{24}$/i)
    .messages({ 'string.pattern.base': "{{#label}} noto'g'ri identifikator" });

export const idParam = Joi.object({ id: objectId().required() });

export const name = () => Joi.string().trim().min(2).max(60);

export const userName = () =>
  Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9._-]{3,32}$/)
    .messages({
      'string.pattern.base': "Login 3–32 ta lotin harfi, raqam yoki . _ - belgilaridan iborat bo'lishi kerak",
    });

export const password = () => Joi.string().min(6).max(64);

export const listQuery = Joi.object({
  search: Joi.string().trim().allow('').max(60),
});
