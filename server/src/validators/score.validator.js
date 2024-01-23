import Joi from 'joi';
import { idParam, objectId } from './common.js';
import { MAX_SCORE, MIN_SCORE } from '../models/index.js';

export const list = {
  query: Joi.object({
    student: objectId().required(),
    subject: objectId().required(),
  }),
};

export const create = {
  body: Joi.object({
    student: objectId().required(),
    subject: objectId().required(),
    value: Joi.number().integer().min(MIN_SCORE).max(MAX_SCORE).required(),
    date: Joi.date().iso(),
    comment: Joi.string().trim().allow('').max(200),
  }),
};

export const byId = { params: idParam };
