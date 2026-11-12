 
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama category wajib diisi"],
      unique: true,
      trim: true,
      minlength: [2, "Nama category minimal 2 karakter"],
      maxlength: [50, "Nama category maksimal 50 karakter"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Deskripsi maksimal 200 karakter"],
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
