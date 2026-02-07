import { Request, Response } from 'express';
import educationService from './school.service';
import { CourseCategory } from './courses';

class EducationController {
  async getSchools(req: Request, res: Response) {
    try {
      const { type, ownership } = req.query;

      const data = educationService.getSchools({
        type: type as string,
        ownership: ownership as string
      });

      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch institutions'
      });
    }
  }

  async getCourses(req: Request, res: Response) {
    try {
      const { category } = req.query;

      if (!category) {
        throw new Error('Category is required');  
    }

      const data = educationService.getCourses(category as CourseCategory);

      res.status(200).json({success: true, data});
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({success: false, message: 'Failed to fetch courses'});
    }
  }
}

export default new EducationController();
