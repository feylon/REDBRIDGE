import ApiError from '../utils/ApiError.js';

const messages = {
  'any.required': '{{#label}} majburiy',
  'string.empty': "{{#label}} bo'sh bo'lmasligi kerak",
  'string.min': '{{#label}} kamida {{#limit}} ta belgidan iborat bo\'lishi kerak',
  'string.max': '{{#label}} ko\'pi bilan {{#limit}} ta belgidan iborat bo\'lishi kerak',
  'number.base': "{{#label}} son bo'lishi kerak",
  'number.min': "{{#label}} {{#limit}} dan kichik bo'lmasligi kerak",
  'number.max': "{{#label}} {{#limit}} dan katta bo'lmasligi kerak",
  'date.base': "{{#label}} sana bo'lishi kerak",
  'object.min': "Kamida bitta maydon yuborilishi kerak",
};

const validate = (schemas) => (req, _res, next) => {
  for (const source of ['params', 'query', 'body']) {
    if (!schemas[source]) continue;

    const { value, error } = schemas[source].validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
      messages,
      errors: { wrap: { label: false } },
    });

    if (error) {
      const details = error.details.map((item) => ({
        field: item.path.join('.'),
        message: item.message,
      }));
      return next(ApiError.badRequest("Kiritilgan maʼlumotlar noto'g'ri", details));
    }

    if (source === 'query') {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, value);
    } else {
      req[source] = value;
    }
  }

  return next();
};

export default validate;
