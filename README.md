# RedBridge

Maktab boshqaruv tizimi: sinflar, fanlar, o'qituvchilar, o'quvchilar, ota-onalar va elektron jurnal.

## Texnologiyalar

| Qism | Texnologiyalar |
| --- | --- |
| Frontend | Vue 3.4 (Composition API), Vite 5, Pinia, Vue Router 4, Axios, SCSS |
| Backend | Node.js 20, Express 4, Mongoose 8, JWT, Joi, Helmet, express-rate-limit |
| Maʼlumotlar bazasi | MongoDB 7 |
| Infratuzilma | Docker, Docker Compose, Nginx |

## Loyiha tuzilmasi

```
REDBRIDGE/
├── client/                 Vue 3 SPA
│   ├── src/api/            HTTP klient va API servislar
│   ├── src/components/     UI va sahifa komponentlari
│   ├── src/composables/    Qayta ishlatiladigan mantiq
│   ├── src/layouts/        Asosiy layout (sidebar)
│   ├── src/router/         Marshrutlar va himoya
│   ├── src/stores/         Pinia store'lar
│   ├── src/styles/         Dizayn tizimi
│   ├── src/views/          Sahifalar
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 Express REST API
│   ├── src/config/         Muhit va MongoDB ulanishi
│   ├── src/controllers/    Biznes mantiq
│   ├── src/middlewares/    Auth, validatsiya, xatoliklar
│   ├── src/models/         Mongoose modellari
│   ├── src/routes/         API marshrutlari
│   ├── src/validators/     Joi sxemalari
│   ├── src/scripts/        Seed va admin yaratish
│   └── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

## Docker orqali ishga tushirish

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec server npm run seed
```

Ilova: http://localhost:8080

Standart administrator: `admin` / `admin123` (`.env` orqali o'zgartiriladi).

## Lokal ishlab chiqish

```bash
docker compose -f docker-compose.dev.yml up -d

cd server
cp .env.example .env
npm install
npm run seed
npm run dev

cd ../client
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:5173, API: http://localhost:5000/api

## API

Barcha so'rovlar (`/api/auth/login` va `/api/health` dan tashqari) `Authorization: Bearer <token>` sarlavhasini talab qiladi.

| Metod | Yo'l | Tavsif |
| --- | --- | --- |
| POST | `/api/auth/login` | Tizimga kirish |
| GET | `/api/auth/me` | Joriy foydalanuvchi |
| PATCH | `/api/auth/password` | Parolni o'zgartirish |
| GET | `/api/stats` | Boshqaruv paneli statistikasi |
| GET, POST | `/api/teachers` | O'qituvchilar ro'yxati / qo'shish |
| GET, PATCH, DELETE | `/api/teachers/:id` | O'qituvchi |
| GET, POST | `/api/grades` | Sinflar ro'yxati / qo'shish |
| GET, PATCH, DELETE | `/api/grades/:id` | Sinf |
| GET | `/api/grades/:id/subjects` | Sinf fanlari |
| GET | `/api/grades/:id/students` | Sinf o'quvchilari |
| GET | `/api/grades/:id/journal` | Sinf jurnali (o'rtacha baholar) |
| POST | `/api/subjects` | Fan qo'shish |
| PATCH, DELETE | `/api/subjects/:id` | Fan |
| GET, POST | `/api/students` | O'quvchilarni qidirish / qo'shish |
| GET, PATCH, DELETE | `/api/students/:id` | O'quvchi |
| GET, POST | `/api/parents` | Ota-onalar ro'yxati / qo'shish |
| GET, DELETE | `/api/parents/:id` | Ota-ona |
| POST | `/api/parents/:id/children` | Farzand biriktirish |
| DELETE | `/api/parents/:id/children/:studentId` | Farzandni ajratish |
| GET, POST | `/api/scores` | Baholar tarixi / baho qo'yish |
| DELETE | `/api/scores/:id` | Bahoni o'chirish |
| GET | `/api/health` | Server holati |

## Skriptlar

| Joy | Buyruq | Tavsif |
| --- | --- | --- |
| server | `npm run dev` | Nodemon bilan ishga tushirish |
| server | `npm run seed` | Demo maʼlumotlarni yuklash |
| server | `npm run lint` | ESLint tekshiruvi |
| client | `npm run dev` | Vite dev server |
| client | `npm run build` | Production build |
| client | `npm run lint` | ESLint tekshiruvi |
