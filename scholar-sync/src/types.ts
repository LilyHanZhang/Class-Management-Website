export type StudentStatus = 'at-risk' | 'stable' | 'excelling';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: StudentStatus;
  enrollmentDate: string;
  gradeLevel?: number; // Added based on Roster filter req
}

export interface ClassSubject {
  id: string;
  title: string;
  code: string;
  schedule: {
    days: string[];
    time: string;
  };
  color: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  dueDate: string;
  totalPoints: number;
  submissions: Submission[];
}

export type SubmissionStatus = 'submitted' | 'missing';

export interface Submission {
  studentId: string;
  grade: number;
  status: SubmissionStatus;
}
