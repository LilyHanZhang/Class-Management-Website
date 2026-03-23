// Placeholder data for prototyping
import type { Student, ClassSubject, Assignment } from '../types';

export const students: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    status: 'excelling',
    enrollmentDate: '2023-09-01',
    gradeLevel: 10,
    avatar: 'AJ'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    status: 'stable',
    enrollmentDate: '2023-09-01',
    gradeLevel: 10,
     avatar: 'BS'
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    status: 'at-risk',
    enrollmentDate: '2023-11-15',
    gradeLevel: 11,
     avatar: 'CB'
  },
   {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    status: 'excelling',
    enrollmentDate: '2023-09-01',
    gradeLevel: 12,
     avatar: 'DP'
  },
  {
    id: '5',
    name: 'Evan Wright',
    email: 'evan.wright@example.com',
    status: 'stable',
    enrollmentDate: '2023-10-05',
    gradeLevel: 10,
     avatar: 'EW'
  }
];

export const classes: ClassSubject[] = [
  {
    id: '101',
    title: 'Introduction to Physics',
    code: 'PHYS101',
    schedule: { days: ['Mon', 'Wed'], time: '10:00 AM' },
    color: '#3B82F6' // blue-500
  },
  {
    id: '102',
    title: 'Advanced Mathematics',
    code: 'MATH201',
    schedule: { days: ['Tue', 'Thu'], time: '01:00 PM' },
    color: '#10B981' // green-500
  },
    {
    id: '103',
    title: 'World History',
    code: 'HIST301',
    schedule: { days: ['Fri'], time: '09:00 AM' },
    color: '#F59E0B' // amber-500
  }
];

export const assignments: Assignment[] = [
  {
    id: 'a1',
    classId: '101',
    title: 'Physics Lab Report 1',
    dueDate: '2023-12-15T23:59:00Z',
    totalPoints: 100,
    submissions: [
      { studentId: '1', grade: 95, status: 'submitted' },
      { studentId: '2', grade: 82, status: 'submitted' },
      { studentId: '3', grade: 0, status: 'missing' }
    ]
  },
  {
    id: 'a2',
    classId: '102',
    title: 'Calculus Quiz',
    dueDate: '2023-12-10T10:00:00Z',
    totalPoints: 50,
     submissions: [
      { studentId: '1', grade: 48, status: 'submitted' },
      { studentId: '3', grade: 35, status: 'submitted' },
       { studentId: '4', grade: 50, status: 'submitted' }
    ]
  }
];
