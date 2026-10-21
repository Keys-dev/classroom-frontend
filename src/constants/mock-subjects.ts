export interface Subject {
  id: number;
  code: string;
  name: string;
  department: string;
  description: string;
  createdAt: string;
}

export const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description: "A foundational course covering programming basics, algorithms, and problem-solving techniques using modern programming languages.",
    createdAt: "2025-09-01T08:00:00Z"
  },
  {
    id: 2,
    code: "MATH201",
    name: "Linear Algebra",
    department: "Mathematics",
    description: "An in-depth study of vector spaces, linear transformations, matrices, and their applications in engineering and computer science.",
    createdAt: "2025-09-02T09:00:00Z"
  },
  {
    id: 3,
    code: "PHYS150",
    name: "Classical Mechanics",
    department: "Physics",
    description: "An introduction to Newtonian mechanics, covering motion, forces, energy, momentum, and rotational dynamics with practical laboratory exercises.",
    createdAt: "2025-09-03T10:00:00Z"
  },
  {
    id: 4,
    code: "CS201",
    name: "Data Structures and Algorithms",
    department: "Computer Science",
    description: "A study of fundamental data structures such as trees, graphs, and hash tables, along with algorithm design and analysis techniques.",
    createdAt: "2025-09-04T11:00:00Z"
  },
  {
    id: 5,
    code: "CHEM101",
    name: "General Chemistry",
    department: "Chemistry",
    description: "An introduction to chemical principles, including atomic structure, bonding, reactions, stoichiometry, and thermodynamics.",
    createdAt: "2025-09-05T12:00:00Z"
  },
  {
    id: 6,
    code: "MATH101",
    name: "Calculus I",
    department: "Mathematics",
    description: "An introduction to differential and integral calculus, covering limits, continuity, derivatives, and basic integration techniques.",
    createdAt: "2025-09-06T13:00:00Z"
  },
  {
    id: 7,
    code: "PHYS201",
    name: "Electromagnetism",
    department: "Physics",
    description: "A study of electric and magnetic fields, Maxwell's equations, electromagnetic waves, and their applications in modern technology.",
    createdAt: "2025-09-07T14:00:00Z"
  },
  {
    id: 8,
    code: "CS301",
    name: "Database Systems",
    department: "Computer Science",
    description: "An introduction to database design, relational models, SQL, normalization, and transaction management.",
    createdAt: "2025-09-08T15:00:00Z"
  },
  {
    id: 9,
    code: "CHEM201",
    name: "Organic Chemistry",
    department: "Chemistry",
    description: "A study of the structure, properties, composition, and reactions of organic compounds and materials.",
    createdAt: "2025-09-09T16:00:00Z"
  },
  {
    id: 10,
    code: "MATH301",
    name: "Probability and Statistics",
    department: "Mathematics",
    description: "An introduction to probability theory, statistical inference, hypothesis testing, and regression analysis.",
    createdAt: "2025-09-10T17:00:00Z"
  },
  {
    id: 11,
    code: "CS150",
    name: "Web Development Fundamentals",
    department: "Computer Science",
    description: "An introduction to web technologies including HTML, CSS, JavaScript, and modern web frameworks for building responsive web applications.",
    createdAt: "2025-09-11T08:30:00Z"
  },
  {
    id: 12,
    code: "PHYS101",
    name: "Introduction to Physics",
    department: "Physics",
    description: "A survey course covering fundamental concepts in mechanics, thermodynamics, waves, and optics.",
    createdAt: "2025-09-12T09:30:00Z"
  }
];
