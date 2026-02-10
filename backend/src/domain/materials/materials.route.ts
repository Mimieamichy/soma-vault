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

// 1. Static/Search Routes (Place these ABOVE parameterized routes)
materialRouter.get('/all', (req, res) => materialController.getAllMaterials(req, res));
materialRouter.get('/stats', (req, res) => materialController.getMaterialStats(req, res));
materialRouter.get('/search', (req, res) => materialController.searchMaterials(req, res));

// 2. Filtered Routes (Add prefixes to avoid collisions) /schools
materialRouter.get('/schools', (req, res) => materialController.getSchools(req, res));
materialRouter.get('/groups', (req, res) => materialController.getGroups(req, res));
materialRouter.get('/levels', (req, res) => materialController.getLevels(req, res));
materialRouter.get('/materialTypes', (req, res) => materialController.getMaterialTypes(req, res));


// 3. ID Specific Routes (Keep these at the bottom)
materialRouter.get('/:id', (req, res) => materialController.getMaterial(req, res));
materialRouter.patch('/:id', (req, res) => materialController.updateMaterial(req, res));
materialRouter.delete('/:id', (req, res) => materialController.deleteMaterial(req, res));

// 4. Action Specific Routes
materialRouter.patch('/:id/archive', (req, res) => materialController.archiveMaterial(req, res));
materialRouter.patch('/:id/unarchive', (req, res) => materialController.unarchiveMaterial(req, res));


export default materialRouter;