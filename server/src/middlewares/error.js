import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Yo'l topilmadi: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  let error = err;

  if (error instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Noto'g'ri identifikator: ${error.value}`);
  } else if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    error = ApiError.badRequest("Maʼlumotlar tekshiruvdan o'tmadi", details);
  } else if (error?.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    error = ApiError.conflict(field ? `"${error.keyValue[field]}" allaqachon mavjud` : undefined);
  } else if (error?.type === 'entity.parse.failed') {
    error = ApiError.badRequest("JSON formati noto'g'ri");
  }

  const status = error instanceof ApiError ? error.status : 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message: status >= 500 && env.isProduction ? 'Serverda xatolik yuz berdi' : error.message,
    ...(error.details && { details: error.details }),
  });
}
