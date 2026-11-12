
const express = require("express");
const router = express.Router();

const todoController = require("../controllers/todo.controller");
const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createTodoRules,
  updateTodoRules,
  getTodoByIdRules,
  getAllTodosRules,
} = require("../validators/todo.validator");

// Semua route Todo wajib login
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Manajemen Todo
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Membuat Todo baru
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar Node.js
 *               description:
 *                 type: string
 *                 example: Mempelajari Express dan MongoDB
 *               completed:
 *                 type: boolean
 *                 example: false
 *               category:
 *                 type: string
 *                 nullable: true
 *                 example: 65f123456789abcdef123456
 *     responses:
 *       201:
 *         description: Todo berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Belum login
 */
router.post(
  "/",
  createTodoRules,
  validate,
  todoController.createTodo
);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Mengambil daftar Todo milik user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         description: Mencari Todo berdasarkan judul
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at, updated_at, title, completed]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Daftar Todo berhasil diambil
 *       401:
 *         description: Belum login
 */
router.get(
  "/",
  getAllTodosRules,
  validate,
  todoController.getAllTodos
);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Mengambil Todo berdasarkan ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo berhasil ditemukan
 *       404:
 *         description: Todo tidak ditemukan
 */
router.get(
  "/:id",
  getTodoByIdRules,
  validate,
  todoController.getTodoById
);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Memperbarui Todo berdasarkan ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar Express
 *               description:
 *                 type: string
 *                 example: Memperbarui materi belajar
 *               completed:
 *                 type: boolean
 *                 example: true
 *               category:
 *                 type: string
 *                 nullable: true
 *                 example: 65f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Todo berhasil diperbarui
 *       400:
 *         description: Validasi gagal
 *       404:
 *         description: Todo tidak ditemukan
 */
router.put(
  "/:id",
  updateTodoRules,
  validate,
  todoController.updateTodo
);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Mengarsipkan Todo berdasarkan ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo berhasil diarsipkan
 *       404:
 *         description: Todo tidak ditemukan
 */
router.delete(
  "/:id",
  getTodoByIdRules,
  validate,
  todoController.deleteTodo
);

module.exports = router;
