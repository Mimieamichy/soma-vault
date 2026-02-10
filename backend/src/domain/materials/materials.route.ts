// routes/material.routes.ts
import { Router } from 'express';
import materialController from './materials.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const materialRouter = Router();

import upload from '../../shared/utils/fileUpload';

// All routes require authentication
materialRouter.use(authenticate);

// Upload file (PDF, DOC, DOCX, TXT, Image)
materialRouter.post('/upload', upload.single('file'), (req, res) => materialController.uploadFile(req, res));


// Get all user materials
materialRouter.get('/', (req, res) => materialController.getUserMaterials(req, res));

// Get material stats
materialRouter.get('/stats', (req, res) => materialController.getMaterialStats(req, res));

// Search materials
materialRouter.get('/search', (req, res) => materialController.searchMaterials(req, res));

// Get specific material
materialRouter.get('/:id', (req, res) => materialController.getMaterial(req, res));
materialRouter.get('/:groupName', (req, res) => materialController.getMaterialsBygroupName(req, res));
materialRouter.get('/:levelName', (req, res) => materialController.getMaterialsByLevelName(req, res));
materialRouter.get('/:materialType', (req, res) => materialController.getMaterialsByMaterialType(req, res));
materialRouter.get('/:schoolName', (req, res) => materialController.getMaterialsBySchoolName(req, res));

// Get all materials 
materialRouter.get('/all', (req, res) => materialController.getAllMaterials(req, res));

// Update material
materialRouter.patch('/:id', (req, res) => materialController.updateMaterial(req, res));

// Archive material
materialRouter.patch('/:id/archive', (req, res) => materialController.archiveMaterial(req, res));

// Unarchive material
materialRouter.patch('/:id/unarchive', (req, res) => materialController.unarchiveMaterial(req, res));


// Delete material
materialRouter.delete('/:id', (req, res) => materialController.deleteMaterial(req, res));

export default materialRouter;