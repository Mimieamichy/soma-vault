// routes/material.routes.ts
import { Router } from 'express';
import multer from 'multer';
import materialController from './materials.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const materialRouter = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and images are allowed.'));
    }
  }
});

// All routes require authentication
materialRouter.use(authenticate);

// Upload file (PDF, DOC, DOCX, TXT, Image)
materialRouter.post('/upload', upload.single('file'), (req, res) => materialController.uploadFile(req, res));

// Create text note
materialRouter.post('/note', (req, res) => materialController.createTextNote(req, res));

// Get all user materials
materialRouter.get('/', (req, res) => materialController.getUserMaterials(req, res));

// Get material stats
materialRouter.get('/stats', (req, res) => materialController.getMaterialStats(req, res));

// Search materials
materialRouter.get('/search', (req, res) => materialController.searchMaterials(req, res));

// Get specific material
materialRouter.get('/:id', (req, res) => materialController.getMaterial(req, res));

// Update material
materialRouter.patch('/:id', (req, res) => materialController.updateMaterial(req, res));

// Archive material
materialRouter.patch('/:id/archive', (req, res) => materialController.archiveMaterial(req, res));

// Unarchive material
materialRouter.patch('/:id/unarchive', (req, res) => materialController.unarchiveMaterial(req, res));


// Delete material
materialRouter.delete('/:id', (req, res) => materialController.deleteMaterial(req, res));

export default materialRouter;