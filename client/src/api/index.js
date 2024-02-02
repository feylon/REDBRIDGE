import http from './http';

const clean = (data) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === '' ? null : value]));

export const authApi = {
  login: (payload) => http.post('/auth/login', payload),
  me: () => http.get('/auth/me'),
  changePassword: (payload) => http.patch('/auth/password', payload),
};

export const statsApi = {
  overview: () => http.get('/stats'),
};

export const teachersApi = {
  list: (params) => http.get('/teachers', { params }),
  get: (id) => http.get(`/teachers/${id}`),
  create: (payload) => http.post('/teachers', payload),
  update: (id, payload) => http.patch(`/teachers/${id}`, payload),
  remove: (id) => http.delete(`/teachers/${id}`),
};

export const gradesApi = {
  list: () => http.get('/grades'),
  get: (id) => http.get(`/grades/${id}`),
  create: (payload) => http.post('/grades', clean(payload)),
  update: (id, payload) => http.patch(`/grades/${id}`, clean(payload)),
  remove: (id) => http.delete(`/grades/${id}`),
  subjects: (id) => http.get(`/grades/${id}/subjects`),
  students: (id) => http.get(`/grades/${id}/students`),
  journal: (id) => http.get(`/grades/${id}/journal`),
};

export const subjectsApi = {
  create: (payload) => http.post('/subjects', clean(payload)),
  update: (id, payload) => http.patch(`/subjects/${id}`, clean(payload)),
  remove: (id) => http.delete(`/subjects/${id}`),
};

export const studentsApi = {
  list: (params) => http.get('/students', { params }),
  create: (payload) => http.post('/students', clean(payload)),
  update: (id, payload) => http.patch(`/students/${id}`, clean(payload)),
  remove: (id) => http.delete(`/students/${id}`),
};

export const parentsApi = {
  list: (params) => http.get('/parents', { params }),
  get: (id) => http.get(`/parents/${id}`),
  create: (payload) => http.post('/parents', payload),
  remove: (id) => http.delete(`/parents/${id}`),
  addChild: (id, studentId) => http.post(`/parents/${id}/children`, { studentId }),
  removeChild: (id, studentId) => http.delete(`/parents/${id}/children/${studentId}`),
};

export const scoresApi = {
  list: (params) => http.get('/scores', { params }),
  create: (payload) => http.post('/scores', payload),
  remove: (id) => http.delete(`/scores/${id}`),
};
