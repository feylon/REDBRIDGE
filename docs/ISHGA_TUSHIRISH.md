# RedBridge — ishga tushirish bo'yicha qo'llanma

Ushbu hujjatda loyihani ikki usulda ishga tushirish ko'rsatilgan:

1. **Docker orqali** — tavsiya etiladi, faqat Docker kerak bo'ladi.
2. **Lokal ishlab chiqish rejimida** — kodni o'zgartirib, natijani darhol ko'rish uchun.

---

## 1. Talablar

| Dastur | Versiya | Qaysi usul uchun |
| --- | --- | --- |
| Docker | 24+ | Ikkala usul |
| Docker Compose | v2+ | Ikkala usul |
| Node.js | 20 LTS | Faqat lokal usul |
| npm | 10+ | Faqat lokal usul |

Versiyalarni tekshirish:

```bash
docker -v
docker compose version
node -v
npm -v
```

---

## 2. Docker orqali ishga tushirish

### 2.1. Muhit faylini yaratish

Loyiha ildiz papkasida:

```bash
cp .env.example .env
```

`.env` faylidagi qiymatlar:

| O'zgaruvchi | Standart qiymat | Tavsif |
| --- | --- | --- |
| `APP_PORT` | `8080` | Ilova ochiladigan port |
| `JWT_SECRET` | — | Token imzolash kaliti, albatta o'zgartiring |
| `JWT_EXPIRES_IN` | `1d` | Token amal qilish muddati |
| `CORS_ORIGIN` | `*` | Ruxsat etilgan manbalar |
| `ADMIN_USERNAME` | `admin` | Administrator logini |
| `ADMIN_PASSWORD` | `admin123` | Administrator paroli |

Tasodifiy `JWT_SECRET` yaratish:

```bash
openssl rand -hex 32
```

### 2.2. Konteynerlarni yig'ish va ishga tushirish

```bash
docker compose up -d --build
```

Uchta servis ishga tushadi:

| Servis | Vazifasi |
| --- | --- |
| `mongo` | MongoDB 7 maʼlumotlar bazasi |
| `server` | Express REST API (port 5000, faqat ichki tarmoqda) |
| `client` | Nginx: frontend va `/api` so'rovlarini serverga yo'naltirish |

Holatini tekshirish:

```bash
docker compose ps
```

Barcha servislar `healthy` yoki `Up` holatida bo'lishi kerak.

### 2.3. Demo maʼlumotlarni yuklash (ixtiyoriy)

```bash
docker compose exec server npm run seed
```

Bu buyruq 6 ta o'qituvchi, 4 ta sinf, 32 ta o'quvchi, 4 ta ota-ona va baholarni yaratadi.

> Diqqat: seed administratordan tashqari barcha mavjud maʼlumotlarni o'chirib yuboradi.

### 2.4. Ilovani ochish

Brauzerda: **http://localhost:8080**

| Rol | Login | Parol |
| --- | --- | --- |
| Administrator | `admin` | `admin123` |
| O'qituvchi (demo) | `d.karimova` | `teacher123` |
| Ota-ona (demo) | `parent1` | `parent123` |

Hozircha boshqaruv paneliga faqat administrator kira oladi.

API holatini tekshirish:

```bash
curl http://localhost:8080/api/health
```

### 2.5. Foydali buyruqlar

```bash
docker compose logs -f server
docker compose logs -f client
docker compose restart server
docker compose down
docker compose down -v
docker compose up -d --build
```

| Buyruq | Tavsif |
| --- | --- |
| `logs -f server` | Backend loglarini kuzatish |
| `logs -f client` | Nginx loglarini kuzatish |
| `restart server` | Backendni qayta ishga tushirish |
| `down` | To'xtatish (maʼlumotlar saqlanadi) |
| `down -v` | To'xtatish va bazani butunlay o'chirish |
| `up -d --build` | Koddagi o'zgarishlardan so'ng qayta yig'ish |

---

## 3. Lokal ishlab chiqish rejimi

### 3.1. MongoDB'ni ishga tushirish

```bash
docker compose -f docker-compose.dev.yml up -d
```

MongoDB `localhost:27017` portida ishlaydi.

### 3.2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

API: **http://localhost:5000/api**

### 3.3. Frontend

Yangi terminalda:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Ilova: **http://localhost:5173**

Vite `/api` so'rovlarini avtomatik ravishda `http://localhost:5000` ga yo'naltiradi. Boshqa manzil kerak bo'lsa, `client/.env` faylidagi `VITE_PROXY_TARGET` qiymatini o'zgartiring.

### 3.4. Kod sifatini tekshirish

```bash
cd server && npm run lint
cd client && npm run lint
cd client && npm run build
```

---

## 4. Muammolarni hal qilish

| Muammo | Yechim |
| --- | --- |
| `port is already allocated` | `.env` da `APP_PORT` ni boshqa portga o'zgartiring, masalan `8081` |
| `server` servisi `unhealthy` | `docker compose logs server` orqali xatoni ko'ring, odatda MongoDB hali tayyor bo'lmagan bo'ladi |
| Login qilib bo'lmayapti | Administrator faqat baza bo'sh bo'lganda yaratiladi. `docker compose down -v` bilan bazani tozalab, qayta ishga tushiring |
| Lokal rejimda `MONGO_URI` xatosi | `server/.env` fayli yaratilganini va MongoDB ishlayotganini tekshiring |
| Frontend API'ga ulana olmayapti | Backend `5000` portda ishlayotganini va `VITE_PROXY_TARGET` to'g'riligini tekshiring |
