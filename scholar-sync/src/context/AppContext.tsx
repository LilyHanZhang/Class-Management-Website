import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Student, ClassSubject, Assignment } from '../types';
import { students as initialStudents, classes as initialClasses, assignments as initialAssignments } from '../data/mockData';

interface UserProfile {
    name: string;
    role: string;
    initials: string;
}

export interface DocFile {
    id: string;
    name: string;
    url: string; // Base64 Data URL or Object URL
    type: string;
    size: number;
    uploadDate: string;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
}

interface AppContextType {
    students: Student[];
    addStudent: (student: Student) => void;
    deleteStudent: (id: string) => void;
    classes: ClassSubject[];
    addClass: (cls: ClassSubject) => void;
    updateClass: (cls: ClassSubject) => void; 
    deleteClass: (id: string) => void;
    assignments: Assignment[];
    addAssignment: (assignment: Assignment) => void;
    updateAssignment: (assignment: Partial<Assignment>) => void;
    updateAssignmentGrade: (assignmentId: string, studentId: string, grade: number) => void;
    user: UserProfile;
    updateUser: (user: UserProfile) => void;
    // Simple document interface instead of File to avoid serialization issues if we move to localStorage later,
    // though File is fine for in-memory. Let's use a custom type to prevent confusion.
    documents: DocFile[];
    addDocument: (doc: DocFile) => void;
    deleteDocument: (id: string) => void;
    notifications: Notification[];
    markAllRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from existing mock data or potentially localStorage in future
    const [students, setStudents] = useState<Student[]>(() => {
        const saved = localStorage.getItem('students');
        return saved ? JSON.parse(saved) : initialStudents;
    });
    const [classes, setClasses] = useState<ClassSubject[]>(() => {
        const saved = localStorage.getItem('classes');
        return saved ? JSON.parse(saved) : initialClasses;
    });
    const [assignments, setAssignments] = useState<Assignment[]>(() => {
        const saved = localStorage.getItem('assignments');
        return saved ? JSON.parse(saved) : initialAssignments;
    });
    const [user, setUser] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { name: 'Jane P.', role: 'Teacher', initials: 'JP' };
    });
    const [documents, setDocuments] = useState<DocFile[]>(() => {
        const saved = localStorage.getItem('documents');
        return saved ? JSON.parse(saved) : [];
    });
    const [notifications, setNotifications] = useState<Notification[]>(() => {
         const saved = localStorage.getItem('notifications');
         return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('students', JSON.stringify(students));
    }, [students]);

    useEffect(() => {
        localStorage.setItem('classes', JSON.stringify(classes));
    }, [classes]);

    useEffect(() => {
        localStorage.setItem('assignments', JSON.stringify(assignments));
    }, [assignments]);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('documents', JSON.stringify(documents));
    }, [documents]);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (message: string) => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            message,
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications((prev) => [newNotification, ...prev]);
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    };
    
    const addStudent = (student: Student) => {
        setStudents((prev) => [...prev, student]);
        addNotification(`New student added: ${student.name}`);
    };

    const deleteStudent = (id: string) => {
        const student = students.find(s => s.id === id);
        setStudents((prev) => prev.filter(s => s.id !== id));
        if (student) addNotification(`Student removed: ${student.name}`);
    };
    
    const addClass = (cls: ClassSubject) => {
        setClasses((prev) => [...prev, cls]);
        addNotification(`New class added: ${cls.title}`);
    };

    const updateClass = (updatedClass: ClassSubject) => {
        setClasses((prev) => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
        addNotification(`Class updated: ${updatedClass.title}`);
    };

    const deleteClass = (id: string) => {
        const cls = classes.find(c => c.id === id);
        setClasses((prev) => prev.filter(c => c.id !== id));
        // Remove assignments associated with the deleted class
        setAssignments((prev) => prev.filter(a => a.classId !== id));
        if (cls) addNotification(`Class removed: ${cls.title}`);
    };

    const addAssignment = (assignment: Assignment) => {
        setAssignments((prev) => [...prev, assignment]);
        addNotification(`New assignment created: ${assignment.title}`);
    };

    const updateAssignment = (updatedAssignment: Partial<Assignment>) => {
        setAssignments((prev) => prev.map(a => a.id === updatedAssignment.id ? { ...a, ...updatedAssignment } : a));
        addNotification(`Assignment updated: ${updatedAssignment.title}`);
    };
    
    const updateAssignmentGrade = (assignmentId: string, studentId: string, grade: number) => {
        setAssignments((prev) => prev.map(assign => {
            if (assign.id === assignmentId) {
                const subIndex = assign.submissions.findIndex((s) => s.studentId === studentId);
                const newSubmissions = [...assign.submissions];
                if (subIndex >= 0) {
                    newSubmissions[subIndex] = { ...newSubmissions[subIndex], grade, status: 'submitted' };
                } else {
                    newSubmissions.push({ studentId, grade, status: 'submitted' });
                }
                return { ...assign, submissions: newSubmissions };
            }
            return assign;
        }));
    };

    const updateUser = (newUser: UserProfile) => {
        setUser(newUser);
        addNotification(`Profile updated`);
    };

    const addDocument = (doc: DocFile) => {
        setDocuments((prev) => [...prev, doc]);
        addNotification(`Document uploaded: ${doc.name}`);
    };
    
    const deleteDocument = (id: string) => {
        const doc = documents.find(d => d.id === id);
        setDocuments((prev) => prev.filter(d => d.id !== id));
         if (doc) addNotification(`Document deleted: ${doc.name}`);
    };

    // Add default notifications for new users
    useEffect(() => {
        const savedNotifications = localStorage.getItem('notifications');
        if (!savedNotifications) {
             setNotifications([
                { id: '1', message: 'Welcome to ScholarSync! Get started by adding your first class.', timestamp: new Date().toISOString(), read: false },
                { id: '2', message: 'Your profile is set to Teacher.', timestamp: new Date().toISOString(), read: false }
             ]);
        }
    }, []);

    return (
        <AppContext.Provider value={{
            students, addStudent, deleteStudent,
            classes, addClass, updateClass, deleteClass,
            assignments, addAssignment, updateAssignment, updateAssignmentGrade,
            user, updateUser,
            documents, addDocument, deleteDocument,
            notifications, markAllRead
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
