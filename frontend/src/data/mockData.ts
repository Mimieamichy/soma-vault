
export interface MaterialItem {
  id: string;
  folderId?: string; // Optional since MyLibrary items might not have it
  title: string;
  type: 'pdf' | 'docx' | 'image';
  date: string;
  size: string;
}

const SCHOOLS = ['Fulafia', 'Unizik', 'Unijos', 'Uniben', 'Esut', 'Uniport'];
const COURSES = [
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemistry',
  'Geology',
  'Physics',
  'Mathematics',
  'Microbiology',
  'Biochemistry',
  'Medicine',
  'Pharmacy',
  'Law',
  'Economics',
  'Accounting',
  'Political Science',
  'Mass Communication',
  'Architecture',
  'Theatre Arts'
];
const LEVELS = ['100L', '200L', '300L', '400L', '500L'];

const COURSE_TOPICS: Record<string, Record<string, string[]>> = {
  'Computer Science': {
    '100L': ['Introduction to Computing', 'Basic Programming Logic', 'History of Computer Science'],
    '200L': ['Data Structures', 'Object Oriented Programming', 'Digital Logic Design'],
    '300L': ['Algorithms and Complexity', 'Operating Systems', 'Database Management Systems'],
    '400L': ['Artificial Intelligence', 'Software Engineering', 'Compiler Construction'],
    '500L': ['Machine Learning', 'Cybersecurity', 'Final Year Project Documentation'],
  },
  'Mechanical Engineering': {
    '100L': ['Introduction to Engineering', 'Engineering Drawing I', 'Workshop Practice'],
    '200L': ['Thermodynamics I', 'Fluid Mechanics I', 'Strength of Materials'],
    '300L': ['Heat Transfer', 'Theory of Machines', 'Engineering Materials'],
    '400L': ['Refrigeration and Air Conditioning', 'Mechanical Vibrations', 'CAD/CAM'],
    '500L': ['Power Plant Engineering', 'Robotics', 'Automobile Engineering'],
  },
  'Civil Engineering': {
    '100L': ['Introduction to Civil Engineering', 'Engineering Mathematics I', 'Technical Drawing'],
    '200L': ['Structural Mechanics', 'Surveying I', 'Civil Engineering Materials'],
    '300L': ['Soil Mechanics', 'Hydraulics', 'Transportation Engineering'],
    '400L': ['Structural Analysis', 'Geotechnical Engineering', 'Highway Engineering'],
    '500L': ['Environmental Engineering', 'Bridge Design', 'Construction Management'],
  },
  'Electrical Engineering': {
    '100L': ['Basic Electricity', 'Applied Physics', 'Calculus for Engineers'],
    '200L': ['Circuit Theory', 'Electromagnetic Fields', 'Physical Electronics'],
    '300L': ['Control Systems', 'Electrical Machines', 'Digital Electronics'],
    '400L': ['Power Systems Analysis', 'Telecommunication Principles', 'Instrumentation'],
    '500L': ['Power Electronics', 'Renewable Energy Systems', 'High Voltage Engineering'],
  },
  'Chemistry': {
    '100L': ['General Chemistry I', 'Chemical Bonds 101', 'Practical Chemistry'],
    '200L': ['Organic Chemistry I', 'Physical Chemistry I', 'Inorganic Chemistry I'],
    '300L': ['Analytical Chemistry', 'Polymer Chemistry', 'Industrial Chemistry'],
    '400L': ['Quantum Chemistry', 'Spectroscopy', 'Environmental Chemistry'],
    '500L': ['Medicinal Chemistry', 'Nuclear Chemistry', 'Advanced Organic Synthesis'],
  },
  'Geology': {
    '100L': ['Introduction to Geology', 'Earth History', 'Crystallography'],
    '200L': ['Mineralogy', 'Petrology', 'Structural Geology'],
    '300L': ['Sedimentology', 'Stratigraphy', 'Geophysics'],
    '400L': ['Petroleum Geology', 'Hydrogeology', 'Geochemistry'],
    '500L': ['Economic Geology', 'Remote Sensing', 'Mining Geology'],
  },
  'Physics': {
    '100L': ['Mechanics and Properties of Matter', 'Heat and Thermodynamics', 'Optics'],
    '200L': ['Modern Physics', 'Electricity and Magnetism', 'Waves and Vibrations'],
    '300L': ['Quantum Mechanics I', 'Solid State Physics', 'Mathematical Physics'],
    '400L': ['Nuclear and Particle Physics', 'Electrodynamics', 'Atomic Physics'],
    '500L': ['Astrophysics', 'Plasma Physics', 'Advanced Quantum Mechanics'],
  },
  'Mathematics': {
    '100L': ['Algebra and Trigonometry', 'Calculus I', 'Vectors and Geometry'],
    '200L': ['Linear Algebra', 'Real Analysis I', 'Differential Equations'],
    '300L': ['Complex Analysis', 'Abstract Algebra', 'Numerical Analysis'],
    '400L': ['Topology', 'Functional Analysis', 'Probability Theory'],
    '500L': ['Measure Theory', 'Number Theory', 'Fluid Dynamics'],
  },
  'Microbiology': {
    '100L': ['Introduction to Microbiology', 'Cell Biology', 'General Biology'],
    '200L': ['Microbial Ecology', 'Virology', 'Bacteriology'],
    '300L': ['Microbial Genetics', 'Immunology', 'Mycology'],
    '400L': ['Industrial Microbiology', 'Medical Microbiology', 'Food Microbiology'],
    '500L': ['Pharmaceutical Microbiology', 'Public Health Microbiology', 'Epidemiology'],
  },
  'Biochemistry': {
    '100L': ['Introduction to Biochemistry', 'Biomolecules', 'Organic Chemistry for Life Sciences'],
    '200L': ['Enzymology', 'Metabolism of Carbohydrates', 'Bioenergetics'],
    '300L': ['Molecular Biology', 'Metabolism of Lipids', 'Clinical Biochemistry'],
    '400L': ['Nutritional Biochemistry', 'Biochemical Methods', 'Membrane Biochemistry'],
    '500L': ['Toxicology', 'Biotechnology', 'Genetic Engineering'],
  },
  'Medicine': {
    '100L': ['General Biology', 'General Chemistry', 'Physics for Health Sciences'],
    '200L': ['Human Anatomy (Gross)', 'Human Physiology', 'Medical Biochemistry'],
    '300L': ['Pathology', 'Pharmacology', 'Medical Microbiology'],
    '400L': ['Pediatrics', 'Obstetrics and Gynecology', 'Community Health'],
    '500L': ['Internal Medicine', 'General Surgery', 'Psychiatry'],
  },
  'Pharmacy': {
    '100L': ['Introduction to Pharmacy', 'Pharmaceutical Calculations', 'General Chemistry'],
    '200L': ['Pharmaceutics I', 'Pharmaceutical Chemistry', 'Pharmacognosy'],
    '300L': ['Pharmacology I', 'Pharmaceutical Microbiology', 'Dispensing'],
    '400L': ['Clinical Pharmacy', 'Pharmaceutical Technology', 'Forensic Pharmacy'],
    '500L': ['Advanced Therapeutics', 'Pharmacy Practice', 'Drug Design'],
  },
  'Law': {
    '100L': ['Legal System', 'Legal Method', 'Logic and Philosophy'],
    '200L': ['Law of Contract', 'Constitutional Law', 'Nigerian Legal System'],
    '300L': ['Criminal Law', 'Commercial Law', 'Law of Torts'],
    '400L': ['Land Law', 'Equity and Trusts', 'Family Law'],
    '500L': ['Jurisprudence', 'Company Law', 'International Law'],
  },
  'Economics': {
    '100L': ['Principles of Economics', 'Introduction to Microeconomics', 'Introduction to Macroeconomics'],
    '200L': ['Microeconomic Theory', 'Macroeconomic Theory', 'Mathematics for Economists'],
    '300L': ['Development Economics', 'History of Economic Thought', 'Econometrics I'],
    '400L': ['International Economics', 'Public Sector Economics', 'Monetary Economics'],
    '500L': ['Economic Planning', 'Energy Economics', 'Advanced Econometrics'],
  },
  'Accounting': {
    '100L': ['Introduction to Accounting', 'Business Mathematics', 'Principles of Management'],
    '200L': ['Financial Accounting I', 'Cost Accounting', 'Business Law'],
    '300L': ['Management Accounting', 'Taxation I', 'Auditing'],
    '400L': ['Public Sector Accounting', 'Financial Management', 'International Accounting'],
    '500L': ['Forensic Accounting', 'Advanced Financial Reporting', 'Accounting Theory'],
  },
  'Political Science': {
    '100L': ['Introduction to Political Science', 'Nigerian Constitutional Development', 'Introduction to African Politics'],
    '200L': ['Political Thought', 'International Relations', 'Political Analysis'],
    '300L': ['Public Administration', 'Comparative Politics', 'Research Methods'],
    '400L': ['Political Economy', 'Human Rights', 'Conflict Resolution'],
    '500L': ['Nigerian Foreign Policy', 'Democracy and Governance', 'Political Sociology'],
  },
  'Mass Communication': {
    '100L': ['Introduction to Mass Communication', 'History of Media', 'Writing for Mass Media'],
    '200L': ['News Writing and Reporting', 'Broadcasting', 'Media and Society'],
    '300L': ['Public Relations', 'Advertising', 'Media Law and Ethics'],
    '400L': ['Investigative Journalism', 'Media Management', 'International Communication'],
    '500L': ['Development Communication', 'Documentary Production', 'Media Research Project'],
  },
  'Architecture': {
    '100L': ['Introduction to Architecture', 'Architectural Graphics', 'Freehand Sketching'],
    '200L': ['Architectural Design I', 'History of Architecture', 'Building Construction'],
    '300L': ['Architectural Design II', 'Urban Planning', 'Building Services'],
    '400L': ['Landscape Architecture', 'Interior Design', 'Housing Development'],
    '500L': ['Advanced Architectural Design', 'Professional Practice', 'Project Management'],
  },
  'Theatre Arts': {
    '100L': ['Introduction to Theatre Arts', 'History of Theatre', 'Basic Acting Techniques'],
    '200L': ['Theatre Production', 'Playwriting', 'African Drama'],
    '300L': ['Directing', 'Costume and Make-up', 'Theatre for Development'],
    '400L': ['Scenography', 'Dramatic Theory and Criticism', 'Media Arts'],
    '500L': ['Theatre Management', 'Advanced Directing', 'Choreography'],
  },
};

const generateMaterials = (type: 'materials' | 'pq'): MaterialItem[] => {
  const materials: MaterialItem[] = [];
  let idCounter = 1;

  SCHOOLS.forEach((school) => {
    const schoolIdPart = school.toLowerCase().replace(/\s+/g, '-');
    
    COURSES.forEach((course) => {
      const courseIdPart = course.toLowerCase().replace(/\s+/g, '-');
      
      LEVELS.forEach((level) => {
        const levelIdPart = level.toLowerCase().replace(/\s+/g, '-');
        const folderId = type === 'materials' 
          ? `m-${schoolIdPart}-${courseIdPart}-${levelIdPart}`
          : `pq-${schoolIdPart}-${courseIdPart}-${levelIdPart}`;

        // Get realistic topics for this course and level
        const courseTopics = COURSE_TOPICS[course]?.[level] || ['General Topic', 'Advanced Topic', 'Research Methods'];

        // Generate 2-3 items per level
        const itemsCount = 2 + Math.floor(Math.random() * 2); // 2 or 3 items
        
        for (let i = 0; i < itemsCount; i++) {
          const isPdf = Math.random() > 0.3;
          const materialType = isPdf ? 'pdf' : 'docx';
          
          let title = '';
          const topic = courseTopics[i % courseTopics.length];
          
          if (type === 'materials') {
             // Randomly append a type like "Notes" or "Assignment" sometimes, but keep the main title clean as requested
             const suffix = Math.random() > 0.7 ? ' - Lecture Notes' : '';
             title = `${topic}${suffix}`;
          } else {
             const years = ['2023', '2022', '2021', '2020'];
             const year = years[i % years.length];
             title = `${topic} - Past Question ${year}`;
          }

          materials.push({
            id: `${type}-${idCounter++}`,
            folderId,
            title,
            type: materialType,
            date: new Date(2024, 0, 1 + Math.floor(Math.random() * 28)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            size: `${(0.5 + Math.random() * 5).toFixed(1)} MB`
          });
        }
      });
    });
  });

  return materials;
};

export const mockArchiveMaterials: MaterialItem[] = generateMaterials('materials');
export const mockArchivePQs: MaterialItem[] = generateMaterials('pq');

export const mockLibraryMaterials: MaterialItem[] = [
  { id: '1', title: 'My Organic Chemistry Notes', type: 'pdf', date: 'Jan 12, 2024', size: '2.4 MB' },
  { id: '2', title: 'Calculus Cheat Sheet', type: 'image', date: 'Jan 11, 2024', size: '1.2 MB' },
];

export const mockLibraryPQs: MaterialItem[] = [
  { id: 'pq-1', title: 'CSC 101 Past Questions 2023', type: 'pdf', date: 'Jan 10, 2024', size: '3.5 MB' },
  { id: 'pq-2', title: 'MTH 101 Exam Paper', type: 'pdf', date: 'Jan 9, 2024', size: '1.8 MB' },
];
