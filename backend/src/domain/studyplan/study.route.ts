// routes/studyplan.routes.ts
import { Router } from 'express';
import studyPlanController from './study.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import multer from 'multer';

const studyRouter = Router();

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
studyRouter.use(authenticate);


studyRouter.post('/', (req, res) => studyPlanController.createStudyPlan(req, res));
studyRouter.post('/upload',upload.single('file'), (req, res) => studyPlanController.createStudyPlanWithFile(req, res));
studyRouter.get('/', (req, res) => studyPlanController.getUserStudyPlans(req, res));
studyRouter.get('/:id', (req, res) => studyPlanController.getStudyPlan(req, res));
studyRouter.get('/:id/progress', (req, res) => studyPlanController.getStudyProgress(req, res));
studyRouter.patch('/:id/status', (req, res) => studyPlanController.updateStudyPlanStatus(req, res));
studyRouter.post('/fragment/:fragmentId/complete', (req, res) => studyPlanController.markFragmentComplete(req, res));
studyRouter.delete('/:id', (req, res) => studyPlanController.deleteStudyPlan(req, res));

export default studyRouter;