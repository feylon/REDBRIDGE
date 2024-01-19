import Joi from 'joi';
import { idParam, name, objectId } from './common.js';

export const list = {
  query: Joi.object({
    grade: objectId(),
    search: Joi.string().trim().allow('').max(60),
  }),
};

export const create = {
  body: Joi.object({
    firstName: name().required(),
    lastName: name().required(),
    fatherName: name().allow(''),
    birthDate: Joi.date().iso().allow(null),
    grade: objectId().required(),
    activeDate: Joi.date().iso().allow(null),
  }),
};

export const update = {
  params: idParam,
  body: Joi.object({
    firstName: name(),
    lastName: name(),
    fatherName: name().allow(''),
    birthDate: Joi.date().iso().allow(null),
    grade: objectId(),
    activeDate: Joi.date().iso().allow(null),
  }).min(1),
};

export const byId = { params: idParam };
