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
const port = process.env.PORT;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configuredOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  "https://mohipal-donater-group.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://fu-group.onrender.com",
];

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins])];
const allowAllCors = process.env.CORS_ALLOW_ALL === "true" || process.env.NODE_ENV !== "production";

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowAllCors) return callback(null, true);

    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
    const isLoopbackIp = /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
    if (isLocalhost || isLoopbackIp || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Apply CORS with options
app.use(cors(corsOptions));
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup with local disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext && [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) ? ext : ".jpg";
    const randomStr = Math.random().toString(36).substring(2, 8);
    cb(null, `${Date.now()}-${randomStr}${safeExt}`);
  },
});

const upload = multer({ storage });

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

// admin pass setup
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

console.log("✅ Admin Password Loaded:", ADMIN_PASSWORD);
console.log("✅ Local upload storage ready:", uploadsDir);

app.post("/api/admin/login", (req, res) => {
  console.log("Admin entered password");
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: "Invalid password" });
});

// POST donor with image
app.post("/api/donors", (req, res) => {
  upload.single("image")(req, res, async (uploadErr) => {
    if (uploadErr) {
      const readableError = getReadableUploadError(uploadErr);
      console.error("❌ Image upload middleware error:", readableError);
      return res.status(500).json({
        message: "Image upload failed",
        error: readableError,
      });
    }

    try {
      // Validate image
      if (!req.file) {
        console.log("❌ Image upload failed - no file received");
        return res.status(400).json({ message: "Image file is required" });
      }

      // Validate required fields
      const { name, bloodGroup, group, location, phone } = req.body;
      const resolvedBloodGroup = bloodGroup || group;

      if (!name || !resolvedBloodGroup || !location || !phone) {
        console.log("❌ Missing required fields:", { name, bloodGroup: resolvedBloodGroup, location, phone });
        return res.status(400).json({ message: "All fields (name, blood group, location, phone) are required" });
      }

      console.log("📝 Creating donor with:", { name, bloodGroup: resolvedBloodGroup, location, phone, imageUrl: req.file.filename });

      const donor = new Donor({
        name: name.trim(),
        bloodGroup: resolvedBloodGroup.trim(),
        location: location.trim(),
        phone: phone.trim(),
        image: req.file.filename,
      });

      await donor.save();
      console.log("✅ Donor added successfully:", donor._id);
      return res.status(201).json(donor);
    } catch (err) {
      console.error("❌ POST donor ERROR:", err);
      return res.status(500).json({
        message: "Error adding donor",
        error: err.message,
      });
    }
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to our Mohipal blood donor api.");
});
app.use("/uploads", express.static(uploadsDir));

// GET + DELETE routes
app.use("/api/donors", donorRoutes);

// MongoDB connection
mongoose
  .connect(url)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

app.use((err, req, res, next) => {
  const message =
    err?.message ||
    err?.error?.message ||
    (typeof err === "string" ? err : null) ||
    "Server error";

  const details = (() => {
    try {
      return typeof err === "object" ? JSON.stringify(err) : String(err);
    } catch {
      return "Unable to serialize error";
    }
  })();

  console.error("❌ Unhandled server error:", message, details);
  res.status(err?.status || 500).json({
    message,
    details,
  });
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
