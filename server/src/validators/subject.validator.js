import Joi from 'joi';
import { idParam, objectId } from './common.js';

const subjectName = Joi.string().trim().min(2).max(60);
const hours = Joi.number().integer().min(0).max(40);

export const create = {
  body: Joi.object({
    name: subjectName.required(),
    grade: objectId().required(),
    teacher: objectId().allow(null, ''),
    hoursPerWeek: hours,
  }),
};

export const update = {
  params: idParam,
  body: Joi.object({
    name: subjectName,
    teacher: objectId().allow(null, ''),
    hoursPerWeek: hours,
  }).min(1),
};

export const byId = { params: idParam };
