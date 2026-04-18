import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import donorRoutes from "./routes/donorRoutes.js";
import Donor from "./models/donorModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const url = process.env.MONGO_URL;
const port = process.env.PORT || 5000; // ✅ FIXED

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   CORS CONFIG (FIXED)
========================= */

const configuredOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  "https://fu-donation-group.vercel.app", // ✅ FIXED (your live frontend)
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const allowedOrigins = [
  ...new Set([...defaultAllowedOrigins, ...configuredOrigins]),
];

// ✅ FIXED safer production control
const allowAllCors = process.env.CORS_ALLOW_ALL === "true";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowAllCors) return callback(null, true);

    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
    const isLoopbackIp = /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

    if (isLocalhost || isLoopbackIp || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

/* =========================
   UPLOAD CONFIG
========================= */

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt =
      [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)
        ? ext
        : ".jpg";

    const randomStr = Math.random().toString(36).substring(2, 8);

    cb(null, `${Date.now()}-${randomStr}${safeExt}`);
  },
});

const upload = multer({ storage });

/* =========================
   HELPERS
========================= */

const getReadableUploadError = (error) => {
  if (!error) return "Unknown upload error";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.error?.message) return error.error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return "Image upload failed";
  }
};

/* =========================
   ADMIN LOGIN
========================= */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Invalid password" });
});

/* =========================
   CREATE DONOR
========================= */

app.post("/api/donors", (req, res) => {
  upload.single("image")(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(500).json({
        message: "Image upload failed",
        error: getReadableUploadError(uploadErr),
      });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Image file is required" });
      }

      const { name, bloodGroup, group, location, phone } = req.body;

      const resolvedBloodGroup = bloodGroup || group;

      if (!name || !resolvedBloodGroup || !location || !phone) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const donor = new Donor({
        name: name.trim(),
        bloodGroup: resolvedBloodGroup.trim(),
        location: location.trim(),
        phone: phone.trim(),
        image: req.file.filename,
      });

      await donor.save();

      return res.status(201).json(donor);
    } catch (err) {
      return res.status(500).json({
        message: "Error adding donor",
        error: err.message,
      });
    }
  });
});

/* =========================
   STATIC FILES
========================= */

app.use("/uploads", express.static(uploadsDir));

/* =========================
   ROUTES
========================= */

app.use("/api/donors", donorRoutes);

/* =========================
   FRONTEND BUILD SERVE
========================= */

const frontendBuildPath = path.join(__dirname, "../frontend/build");

/* =========================
   MONGO DB
========================= */

mongoose
  .connect(url)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    message: err.message || "Server error",
  });
});

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: "API route not found" });
    }

    return res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to Feni University Blood Donor API 🚀");
  });
}

/* =========================
   START SERVER
========================= */

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});