import Joi from 'joi';
import { idParam, listQuery, name, password, userName } from './common.js';

const phone = Joi.string().trim().allow('').max(20);

export const list = { query: listQuery };

export const create = {
  body: Joi.object({
    firstName: name().required(),
    lastName: name().required(),
    fatherName: name().allow(''),
    phone,
    userName: userName().required(),
    password: password().required(),
  }),
};

export const update = {
  params: idParam,
  body: Joi.object({
    firstName: name(),
    lastName: name(),
    fatherName: name().allow(''),
    phone,
    password: password(),
  }).min(1),
};

export const byId = { params: idParam };
