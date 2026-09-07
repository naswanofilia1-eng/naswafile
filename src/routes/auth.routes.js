const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
 
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi
 *               email:
 *                 type: string
 *                 example: budi@example.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       400:
 *         description: Data tidak lengkap
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/register", authController.register);
 
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dan mendapatkan JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: budi@example.com
 *               password:
 *                 type: string
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: Login berhasil, token dikembalikan
 *       401:
 *         description: Email atau password salah
 */
router.post("/login", authController.login);
 
module.exports = router;