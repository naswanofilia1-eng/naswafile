# Todo List API

API backend untuk aplikasi Todo List, dibangun sebagai boilerplate belajar backend Node.js: struktur folder Controller-Service-Model, middleware, autentikasi JWT, proteksi API Key, validasi input, pagination, automated testing, dan dokumentasi Swagger.
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=FFFFFF)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi yang Dipakai](#teknologi-yang-dipakai)
- [Struktur Project](#struktur-project)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Menjalankan Project](#menjalankan-project)
- [Menjalankan Test](#menjalankan-test)
- [Dokumentasi API](#dokumentasi-api)
- [Referensi Endpoint Singkat](#referensi-endpoint-singkat)
- [Lisensi](#lisensi)

## Fitur

- CRUD Todo dengan struktur Controller-Service-Model
- Autentikasi JWT dan otorisasi berbasis role (RBAC)
- Proteksi endpoint machine-to-machine dengan API Key
- Validasi input di setiap endpoint
- Pagination, filtering, dan sorting pada data list
- Global error handling dengan status code yang konsisten
- Automated test dengan Jest dan Supertest
- Dokumentasi interaktif dengan Swagger UI

## Teknologi yang Dipakai

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB dengan Mongoose
- **Autentikasi:** JSON Web Token (JWT), bcryptjs
- **Validasi:** express-validator
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Dokumentasi:** swagger-jsdoc, swagger-ui-express

## Struktur Project

```
src/
├── config/ # Koneksi database & konfigurasi Swagger
├── middlewares/ # Logger, auth, error handler, validasi, dll
├── validators/ # Aturan validasi input per resource
├── models/ # Schema Mongoose
├── services/ # Business logic
├── controllers/ # Penghubung HTTP request/response ke service
├── routes/ # Definisi endpoint
├── utils/ # AppError, catchAsync
├── app.js # Konfigurasi Express
└── server.js # Entry point aplikasi
```

## Persyaratan

Sebelum menjalankan project ini, pastikan sudah terinstall:

- Node.js versi 18 ke atas
- MongoDB (lokal) atau akun MongoDB Atlas
- npm (sudah termasuk saat install Node.js)

## Minimum Requirements

Pastikan environment pengembangan memenuhi spesifikasi minimum berikut:

| Software       | Versi Minimum |
| -------------- | ------------- |
| Node.js        | 18.x          |
| npm            | 9.x           |
| MongoDB        | 6.x           |
| RAM            | 2 GB          |
| Storage Kosong | 500 MB        |

Sistem operasi yang didukung:

- Windows 10/11
- Linux (Ubuntu 22.04+ direkomendasikan)
- macOS 12+

## Instalasi

```bash
git clone https://github.com/username-kamu/todo-api.git
cd todo-api
npm install
```

## Environment Variables

Salin file `.env.example` menjadi `.env`, lalu sesuaikan nilainya:

```bash
cp .env.example .env
```

| Variable           | Wajib | Contoh Nilai                            | Keterangan                                                    |
| ------------------ | ----- | --------------------------------------- | ------------------------------------------------------------- |
| `PORT`             | Tidak | `3000`                                  | Port server, default `3000` jika tidak diisi                  |
| `MONGODB_URI`      | Ya    | `mongodb://127.0.0.1:27017/todo_api_db` | Connection string MongoDB                                     |
| `NODE_ENV`         | Ya    | `development` / `test` / `production`   | Menentukan mode aplikasi berjalan (lihat penjelasan di bawah) |
| `JWT_SECRET`       | Ya    | string acak & panjang                   | Kunci rahasia untuk menandatangani token JWT                  |
| `JWT_EXPIRES_IN`   | Ya    | `1d`                                    | Masa berlaku token JWT                                        |
| `EXTERNAL_API_KEY` | Ya    | string acak & panjang                   | Kunci akses untuk endpoint `/api/stats`                       |

## Menjalankan Project

```bash

# Mode development (auto-restart saat ada perubahan kode)

npm run dev

# Mode production

npm start
```

Server berjalan di `http://localhost:3000` (atau sesuai `PORT` yang diisi di `.env`).

## Menjalankan Test

```bash
npm test
```

Test memakai `mongodb-memory-server`, jadi tidak akan menyentuh database development sungguhan.

## Dokumentasi API

Dokumentasi interaktif tersedia di `http://localhost:3000/api-docs` setelah server dijalankan.

## Referensi Endpoint Singkat

| Method | Endpoint             | Autentikasi | Keterangan                         |
| ------ | -------------------- | ----------- | ---------------------------------- |
| POST   | `/api/auth/register` | -           | Registrasi user baru               |
| POST   | `/api/auth/login`    | -           | Login, mendapatkan token JWT       |
| POST   | `/api/todos`         | JWT         | Membuat todo baru                  |
| GET    | `/api/todos`         | JWT         | Mengambil daftar todo (pagination) |
| GET    | `/api/todos/:id`     | JWT         | Mengambil satu todo                |
| PUT    | `/api/todos/:id`     | JWT         | Mengupdate todo                    |
| DELETE | `/api/todos/:id`     | JWT         | Menghapus todo                     |
| GET    | `/api/stats/summary` | API Key     | Ringkasan statistik todo           |

Untuk detail lengkap tiap endpoint (skema request/response, contoh, dan kemungkinan error), lihat dokumentasi Swagger di atas.

## Lisensi

Project ini dirilis di bawah lisensi **MIT License**.

Anda bebas untuk:

- Menggunakan untuk kebutuhan pribadi maupun komersial
- Mempelajari source code
- Memodifikasi project
- Mendistribusikan ulang project

Dengan syarat tetap menyertakan copyright dan lisensi asli.