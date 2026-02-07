/**
 * List of Accredited Courses in Nigeria
 * Organized into 32 Categories.
 */
export const courses = {
  "Agriculture and Forestry": [
    "Agric Extension and Rural Development",
    "Agricultural and Bio-Resources Engineering",
    "Agricultural Economics",
    "Agricultural Engineering",
    "Agricultural Science and Education",
    "Agriculture",
    "Agronomy",
    "Animal and Environmental Biology",
    "Animal Production",
    "Animal Science",
    "Aquaculture and Fisheries Management",
    "Crop Production",
    "Crop Science",
    "Fisheries",
    "Forestry and Wildlife",
    "Soil Science",
    "Wildlife Management"
  ],
  "Architecture and Building": [
    "Architecture",
    "Building",
    "Building Technology",
    "Estate Management",
    "Geography and Regional Planning",
    "Quantity Surveying",
    "Urban and Regional Planning"
  ],
  "Arts and Design": [
    "Creative Arts",
    "Fine Arts",
    "Industrial Design"
  ],
  "Banking and Finance": [
    "Actuarial Science",
    "Banking and Finance",
    "Insurance"
  ],
  "Biological Sciences": [
    "Applied Biology",
    "Applied Microbiology",
    "Biology",
    "Biotechnology",
    "Botany",
    "Education and Biology",
    "Microbiology",
    "Plant Biology and Biotechnology",
    "Plant Science and Biotechnology",
    "Zoology"
  ],
  "Business and Management": [
    "Business Administration",
    "Business Education",
    "Business Management",
    "Cooperative Economics and Management",
    "Educational Management",
    "Entrepreneurship",
    "Environmental Management",
    "Hospitality and Tourism Management",
    "Industrial Relations and Personnel Management",
    "Information Resources Management",
    "Marketing",
    "Office Technology and Management",
    "Transport Management"
  ],
  "Chemical Sciences": [
    "Applied Chemistry",
    "Biochemistry",
    "Chemistry",
    "Education and Chemistry",
    "Industrial Chemistry"
  ],
  "Civil Engineering": [
    "Civil Engineering",
    "Civil Law",
    "Water Resources and Environmental Engineering"
  ],
  "Computing and IT": [
    "Computer Education",
    "Computer Engineering",
    "Computer Science",
    "Computer with Statistics",
    "Electronics and Computer Technology",
    "Information and Communication Technology",
    "Cyber Security"
  ],
  "Dentistry": [
    "Dentistry"
  ],
  "Economics": [
    "Economics",
    "Education and Economics",
    "Home Economics",
    "Home Economics and Education"
  ],
  "Education: Arts and Humanities": [
    "Adult Education",
    "Early Childhood Education",
    "Education and English Language",
    "Education and French",
    "Education and History",
    "Educational Administration",
    "Educational Administration and Planning",
    "Guidance and Counseling",
    "Library and Information Science",
    "Primary Education Studies",
    "Special Education"
  ],
  "Education: Science and Tech": [
    "Education and Physics",
    "Technical Education",
    "Vocational Education"
  ],
  "Electrical Engineering": [
    "Electrical Engineering",
    "Electrical/Electronics Engineering",
    "Telecommunication Engineering"
  ],
  "Environmental Sciences": [
    "Education and Geography",
    "Environmental Education",
    "Environmental Health Technology",
    "Geography",
    "Land Surveying",
    "Surveying and Geoinformatics"
  ],
  "History and International Studies": [
    "History",
    "History and International Studies",
    "International Law and Jurisprudence",
    "International Relations",
    "Jurisprudence and International Law",
    "Peace and Conflict Resolution"
  ],
  "Languages and Linguistics": [
    "Arabic Studies",
    "English and Literary Studies",
    "English Language",
    "Foreign Languages and Literature",
    "French",
    "Hausa",
    "Igbo",
    "Languages and Linguistics",
    "Linguistics",
    "Yoruba"
  ],
  "Law": [
    "Common Law",
    "Law",
    "Private and Property Law",
    "Public Law"
  ],
  "Mass Communication": [
    "Mass Communication"
  ],
  "Mathematics and Statistics": [
    "Applied Mathematics",
    "Education and Mathematics",
    "Industrial Mathematics",
    "Mathematics",
    "Statistics"
  ],
  "Mechanical Engineering": [
    "Mechanical Engineering",
    "Mechatronics Engineering"
  ],
  "Medical Laboratory Science": [
    "Medical Laboratory Science"
  ],
  "Medicine and Surgery": [
    "Anatomy",
    "Human Anatomy",
    "Human Physiology",
    "Medical Rehabilitation",
    "Medicine and Surgery",
    "Physiology",
    "Veterinary Medicine"
  ],
  "Nursing Science": [
    "Nursing/Nursing Science"
  ],
  "Performing Arts": [
    "Drama/Dramatic/Performing Arts",
    "Music",
    "Performing Arts",
    "Theatre Arts"
  ],
  "Pharmacy": [
    "Pharmacology and Therapeutics",
    "Pharmacy"
  ],
  "Physical Sciences": [
    "Applied Geophysics",
    "Applied Physics",
    "Geology",
    "Geophysics",
    "Industrial Physics",
    "Physics"
  ],
  "Political Science and Admin": [
    "Education and Political Science",
    "Local Government Administration",
    "Political Science",
    "Political Science and Public Administration",
    "Public Administration"
  ],
  "Religious Studies": [
    "Christian Religious Studies",
    "Education and Christian Religious Studies",
    "Education and Islamic Studies",
    "Islamic Studies",
    "Religious Studies",
    "Theology"
  ],
  "Sociology and Psychology": [
    "Criminology and Security Studies",
    "Educational Psychology",
    "Psychology",
    "Social Work",
    "Sociology",
    "Sociology and Anthropology"
  ],
  "Engineering (Others)": [
    "Chemical Engineering",
    "Food Science and Technology",
    "Metallurgical and Materials Engineering",
    "Petroleum Engineering",
    "Polymer and Textile Engineering"
  ],
  "General / Uncategorized": [
    "Accountancy",
    "Accounting",
    "Archaeology",
    "Art and Design",
    "Biological Sciences",
    "Biomedical Engineering",
    "Chemical Pathology",
    "Communication Arts",
    "Counsellor Education",
    "Education and Integrated Science",
    "Education and Social Studies",
    "Educational Foundations",
    "Fine and Applied Arts",
    "Health Education",
    "Human Kinetics",
    "Human Nutrition and Dietetics",
    "Nutrition and Dietetics",
    "Optometry",
    "Philosophy",
    "Physical and Health Education",
    "Physical Education",
    "Physiotherapy",
    "Printing Technology",
    "Public Health",
    "Public Health Technology",
    "Radiography",
    "Science Education",
    "Science Laboratory Technology",
    "Social Studies",
    "Teacher Education Science"
  ]
} as const;


export type CourseCategory = keyof typeof courses;


