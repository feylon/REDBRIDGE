import Joi from 'joi';
import { idParam, objectId } from './common.js';

const gradeName = Joi.string().trim().min(1).max(20);

export const create = {
  body: Joi.object({
    name: gradeName.required(),
    curator: objectId().allow(null, ''),
    room: Joi.string().trim().allow('').max(20),
  }),
};

export const update = {
  params: idParam,
  body: Joi.object({
    name: gradeName,
    curator: objectId().allow(null, ''),
    room: Joi.string().trim().allow('').max(20),
  }).min(1),
};

export const byId = { params: idParam };
