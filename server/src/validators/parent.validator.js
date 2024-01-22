import Joi from 'joi';
import { idParam, listQuery, name, objectId, password, userName } from './common.js';

export const list = { query: listQuery };

export const create = {
  body: Joi.object({
    firstName: name().allow(''),
    lastName: name().allow(''),
    phone: Joi.string().trim().allow('').max(20),
    userName: userName().required(),
    password: password().required(),
  }),
};

export const byId = { params: idParam };

export const addChild = {
  params: idParam,
  body: Joi.object({ studentId: objectId().required() }),
};

export const removeChild = {
  params: Joi.object({
    id: objectId().required(),
    studentId: objectId().required(),
  }),
};
