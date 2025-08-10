import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const IS_VERCEL = !!process.env.VERCEL;
const USE_CLOUDINARY = !!(process.env.CLOUDINARY_URL || (
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
));

if (USE_CLOUDINARY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Determine upload directory for local storage (dev only)
const uploadDir = IS_VERCEL
  ? path.join(process.env.TMPDIR || '/tmp', 'uploads')
  : path.join(__dirname, '../uploads');

if (!USE_CLOUDINARY) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Configure multer for file uploads
const storage = USE_CLOUDINARY
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    });

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (USE_CLOUDINARY) {
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'formBuilderPro' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadFromBuffer();
      return res.json({
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url,
        filename: result.public_id,
      });
    } else {
      // On Vercel, local file system is ephemeral; this path is for local/dev only.
      const imageUrl = `/api/upload/image/${req.file.filename}`;
      return res.json({
        message: 'Image uploaded successfully',
        imageUrl,
        filename: req.file.filename,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete uploaded image
router.delete('/image/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    if (USE_CLOUDINARY) {
      const result = await cloudinary.uploader.destroy(filename);
      if (result.result === 'not found') {
        return res.status(404).json({ message: 'Image not found' });
      }
      return res.json({ message: 'Image deleted successfully' });
    } else {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ message: 'Image deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Image not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve uploaded image bytes (useful on serverless where static folders are not exposed)
router.get('/image/:filename', (req, res) => {
  try {
    if (USE_CLOUDINARY) {
      return res.status(400).json({ message: 'Use the Cloudinary imageUrl directly' });
    }
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.gif' ? 'image/gif' : 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;