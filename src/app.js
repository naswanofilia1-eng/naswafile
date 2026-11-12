 
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Routes
const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes");
const statsRoutes = require("./routes/stats.routes");
const categoryRoutes = require("./routes/category.routes");
const activityLogRoutes = require("./routes/activityLog.routes");

// Middlewares
const logger = require("./middlewares/logger.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// ======================================
// MIDDLEWARE
// ======================================
app.use(logger);
app.use(cors());
app.use(express.json());

// ======================================
// ROOT ENDPOINT
// ======================================
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
  });
});

// ======================================
// SWAGGER DOCUMENTATION
// ======================================
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";

const JS_URL = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js",
];

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl: CSS_URL,
    customJs: JS_URL,
  })
);

// ======================================
// API ROUTES
// ======================================
app.use("/api/auth", authRoutes);

app.use("/api/todos", todoRoutes);

app.use("/api/stats", statsRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/activity-logs", activityLogRoutes);

// ======================================
// ERROR HANDLING
// ======================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
