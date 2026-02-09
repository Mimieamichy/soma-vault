import { Router } from 'express';
import schoolController from './schools.controller';

const schoolRouter = Router();

schoolRouter.get('/', (req, res) =>
  schoolController.getSchools(req, res)
);

schoolRouter.get('/courses', (req, res) =>
  schoolController.getCourses(req, res)
);

schoolRouter.get('/course-groups', (req, res) =>
  schoolController.getCourseGroups(req, res)
);

export default schoolRouter;
