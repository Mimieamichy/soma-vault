import {schools} from './schools';
import {courses, type CourseCategory} from './courses';

class EducationService {
  getSchools(filters?: {
    type?: string;
    ownership?: string;
  }) {
    let result = schools;

    if (filters?.type) {
      result = result.filter(
        i => i.type.toLowerCase() === filters.type!.toLowerCase()
      );
    }

    if (filters?.ownership) {
      result = result.filter(
        i => i.ownership.toLowerCase() === filters.ownership!.toLowerCase()
      );
    }

    return result;
  }

  getCourses(category?: CourseCategory) {
    if (!category) {
      return courses;
    }

    const selected = courses[category];

    if (!selected) {
      return {};
    }

    return {
      category,
      courses: selected,
      length: selected.length
    };
  }


  getCourseGroups() {
    const selected = Object.keys(courses);

    if (!selected) {
      return {};
    } 

    return {
      courses: selected,
      length: selected.length
    };
  }
}

export default new EducationService();
