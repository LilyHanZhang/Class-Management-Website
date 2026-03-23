import { useState, useEffect } from 'react';
import type { Student } from '../types';
import { useApp } from '../context/AppContext';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';

export const Roster = () => {
    const { students, addStudent, deleteStudent } = useApp();
    const [search, setSearch] = useState('');
    const [searchParams] = useSearchParams();
    const [filterStatus, setFilterStatus] = useState<Student['status'] | 'all'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newStudentData, setNewStudentData] = useState({ title: '', email: '' });
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearch(query);
        }
    }, [searchParams]);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                              student.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            deleteStudent(id);
        }
    };

    const handleAddStudent = () => {
       setIsAddModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent(student);
        setNewStudentData({ title: student.name, email: student.email });
        setShowEditModal(true);
    };

    const handleSaveStudent = (e: React.FormEvent) => {
        e.preventDefault();
        const newStudent: Student = {
            id: Date.now().toString(),
            name: newStudentData.title as string,
            email: newStudentData.email,
            status: 'stable',
            enrollmentDate: new Date().toISOString().split('T')[0],
        };
        addStudent(newStudent);
        setIsAddModalOpen(false);
         setNewStudentData({ title: '', email: '' });
    };

    const handleUpdateStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStudent) {
            // Updated to ensure initials re-render
            const updatedStudent = {
                ...editingStudent,
                name: newStudentData.title,
                email: newStudentData.email,
                avatar: newStudentData.title.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            };
            
            // Ideally call updateStudent in context, but for now we simulate by deleting and adding
            deleteStudent(editingStudent.id);
            addStudent(updatedStudent);
            
            setShowEditModal(false);
            setEditingStudent(null);
            setNewStudentData({ title: '', email: '' });
        }
    };
    
    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Student Roster</h2>
                <button 
                    onClick={handleAddStudent}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} /> Add Student
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="stable">Stable</option>
                        <option value="at-risk">At Risk</option>
                        <option value="excelling">Excelling</option>
                    </select>
                </div>
            
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Enrollment Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                                {student.avatar || student.name.charAt(0)}
                                            </div>
                                            <div className="font-medium text-gray-900">{student.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            {
                                                'bg-green-100 text-green-700': student.status === 'excelling',
                                                'bg-blue-100 text-blue-700': student.status === 'stable',
                                                'bg-red-100 text-red-700': student.status === 'at-risk' 
                                            }
                                        )}>
                                            {student.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{student.enrollmentDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors"
                                                onClick={() => handleEditClick(student)}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                onClick={() => handleDelete(student.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Modal */}
             {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Add New Student</h2>
                        <form onSubmit={handleSaveStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newStudentData.title}
                                    onChange={(e) => setNewStudentData({...newStudentData, title: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newStudentData.email}
                                    onChange={(e) => setNewStudentData({...newStudentData, email: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Student</h2>
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newStudentData.title}
                                    onChange={(e) => setNewStudentData({...newStudentData, title: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newStudentData.email}
                                    onChange={(e) => setNewStudentData({...newStudentData, email: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowEditModal(false); setNewStudentData({ title: '', email: '' }); }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
