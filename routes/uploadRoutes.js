import path from "path";
import multer from "multer";
import express from "express";
const router = express.Router();

// Set up storage with multer
const storage = multer.diskStorage({
    destination(req,file, cb) {
        cb(null, "upload/"); // Directory where files will be saved
    },
    filename(req, file, cb) { // Include 'file' parameter
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Custom filename
    }
});

// Function to check file type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true); // File type is acceptable
    } else {
        cb(new Error("Images Only!")); // File type not acceptable
    }
}

// Configure multer with storage and file filter
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb); // Validate file type using the checkFileType function
    }
});

// Route for uploading image
router.post("/", upload.single('image'), (req, res) => {
    // Ensure a file was uploaded
    if (!req.file) {
        return res.status(400).send({ message: "No file uploaded." });
    }
    res.send({
        message: "Image Uploaded!",
        image: `http://localhost:7000/${(req.file.path).replace(/\\/g,"/")}` // Return the path of the uploaded image
    });
});

export default router;
