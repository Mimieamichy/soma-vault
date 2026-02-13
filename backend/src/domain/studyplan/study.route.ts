// routes/studyplan.routes.ts
import { Router } from 'express';
import studyPlanController from './study.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';


const studyRouter = Router();

import upload from '../../shared/utils/fileUpload';



// All routes require authentication
studyRouter.use(authenticate);


studyRouter.post('/', (req, res) => studyPlanController.createStudyPlan(req, res));
studyRouter.post('/upload', upload.single('studyPlan'), (req, res) => studyPlanController.createStudyPlanWithFile(req, res));
studyRouter.get('/', (req, res) => studyPlanController.getUserStudyPlans(req, res));
studyRouter.get('/:id', (req, res) => studyPlanController.getStudyPlan(req, res));
studyRouter.get('/:id/progress', (req, res) => studyPlanController.getStudyProgress(req, res));
studyRouter.patch('/:id/status', (req, res) => studyPlanController.updateStudyPlanStatus(req, res));
studyRouter.post('/fragment/:fragmentId/complete', (req, res) => studyPlanController.markFragmentComplete(req, res));
studyRouter.delete('/:id', (req, res) => studyPlanController.deleteStudyPlan(req, res));

export default studyRouter;