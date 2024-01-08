export default class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static badRequest(message = "So'rov noto'g'ri", details) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Avtorizatsiyadan o\'tilmagan') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Ruxsat berilmagan') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Topilmadi') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Bunday maʼlumot allaqachon mavjud') {
    return new ApiError(409, message);
  }
}
