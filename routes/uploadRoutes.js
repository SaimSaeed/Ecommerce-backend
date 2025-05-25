import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js"; // your cloudinary config file
import { Readable } from "stream";

const router = express.Router();

// Multer memory storage to avoid saving files locally
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload image
router.post("/", upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    // Convert buffer to readable stream
    const stream = cloudinary.uploader.upload_stream(
      { folder: "upload" }, // Optional folder name
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          return res.status(500).json({ message: "Upload failed." });
        }
        return res.json({
          message: "Image Uploaded!",
          image: result.secure_url // cloudinary URL
        });
      }
    );

    // Pipe the file buffer to the Cloudinary stream
    Readable.from(req.file.buffer).pipe(stream);

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected server error." });
  }
});

export default router;
