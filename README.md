# Hospital Management System

## Project description

Энэхүү project нь эмнэлгийн өдөр тутмын үйл ажиллагааг удирдах web систем юм. Өвчтөн цаг захиалах, эмч цагийн хуваариа харах, жор бичих, өвчтөн өөрийн жороо харах/хэвлэх, admin эмч болон өвчтөний мэдээллийг удирдах боломжтой.

## Ашигласан технологи

### Frontend
- React
- React Scripts / Create React App
- Axios
- CSS Modules

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- JWT authentication
- Passport Google OAuth
- Prisma schema/migration

## Project бүтэц

```text
hospital_biy_daalt/
├─ frontend/          React frontend
├─ src/               Express backend
│  ├─ controllers/
│  ├─ routes/
│  ├─ middleware/
│  ├─ config/
│  └─ prisma/
└─ README.md
```

## Install хийх

### 1. Backend dependencies

```bash
cd src
npm install
```

### 2. Frontend dependencies

```bash
cd frontend
npm install
```

## Database тохиргоо

MySQL дээр database үүсгэнэ.

```sql
CREATE DATABASE hospital_db;
```

Backend-ийн `src/.env` файлд дараах тохиргоог хийнэ.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL="mysql://root:your_password@localhost:3306/hospital_db"
```

Prisma migration ашиглах бол:

```bash
cd src
npx prisma migrate dev
```

## Ажиллуулах command

### Backend

```bash
cd src
npm run dev
```

Backend default URL:

```text
http://localhost:3000
```

### Frontend

Backend `3000` port ашиглаж байгаа тул frontend-ийг `3001` дээр асаах нь тохиромжтой.

Windows PowerShell:

```powershell
cd frontend
$env:PORT=3001
npm start
```

Frontend URL:

```text
http://localhost:3001
```

## Гол features

- Role-based login: admin, doctor, patient
- Email/username + password login
- Google OAuth login
- Admin dashboard statistics
  - Нийт өвчтөн
  - Нийт эмч
  - Өнөөдрийн цаг захиалга
  - Хүлээгдэж буй цаг
  - Сүүлийн жорууд
- Өвчтөн бүртгэл, засвар
- Эмч нэмэх, засах, устгах
- Эмчийн нууц үг шинэчлэх
- Өвчтөн цаг захиалах
- Сонгосон эмчийн завгүй цагууд disabled харагдах
- Давхардсан цаг дээр шууд анхааруулга харуулах
- Эмч өвчтөний үзлэгийн бичлэг оруулах
- Эмч жор бичих
- Өвчтөн өөрийн жороо харах
- Жор хэвлэх болон Save as PDF хийх
- Өвчтөн өөрийн профайл засах
  - нэр
  - утас
  - төрсөн огноо
  - хаяг
- Эмч өөрийн профайл засах
  - өрөө
  - ажлын өдөр
  - туршлага

## API endpoint-ууд

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/google
GET  /api/auth/google/callback
```

### Dashboard

```text
GET /api/dashboard/stats
```

### Patients

```text
GET /api/patients
GET /api/patients/me
PUT /api/patients/me
GET /api/patients/:id
POST /api/patients
PUT /api/patients/:id
```

### Doctors

```text
GET    /api/doctors
GET    /api/doctors/me
PUT    /api/doctors/me
GET    /api/doctors/:id
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id
PUT    /api/doctors/:id/password
```

### Appointments

```text
POST   /api/appointments
GET    /api/appointments
GET    /api/appointments/me
GET    /api/appointments/doctor/:doctorId?date=YYYY-MM-DD
PUT    /api/appointments/:id/status
DELETE /api/appointments/:id
```

### Prescriptions

```text
POST /api/prescriptions
GET  /api/prescriptions
GET  /api/prescriptions/me
GET  /api/prescriptions/patient/:patientId
```

### Medical Records

```text
POST /api/medical-records
GET  /api/medical-records/patient/:patientId
```

## Screenshot-ууд

Screenshot зургаа `docs/screenshots/` хавтсанд байрлуулаад доорх нэрээр хадгалж болно.

| Дэлгэц | Файл |
| --- | --- |
| Нэвтрэх / бүртгүүлэх | `docs/screenshots/auth.png` |
| Admin dashboard | `docs/screenshots/dashboard.png` |
| Эмчийн жагсаалт | `docs/screenshots/doctors.png` |
| Цаг захиалга | `docs/screenshots/appointments.png` |
| Жор / хэвлэх | `docs/screenshots/prescriptions.png` |
| Профайл засах | `docs/screenshots/profile.png` |

```markdown
![Auth](docs/screenshots/auth.png)
![Dashboard](docs/screenshots/dashboard.png)
![Appointments](docs/screenshots/appointments.png)
![Prescriptions](docs/screenshots/prescriptions.png)
![Profile](docs/screenshots/profile.png)
```

## Build шалгах

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax шалгах:

```bash
cd src
node --check app.js
```

## Тайлбар

- `.env`, `node_modules`, `build`, log файлууд git-д орохгүй.
- Facebook login устгагдсан.
- Google login ашиглах бол Google Cloud Console дээр redirect URI-г `http://localhost:3000/api/auth/google/callback` гэж тохируулна.
