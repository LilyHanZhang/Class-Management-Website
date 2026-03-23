import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus } from 'lucide-react';
import clsx from 'clsx';

export const Gradebook = () => {
    const { students, assignments, classes, addAssignment, updateAssignmentGrade, updateAssignment } = useApp();
    const [selectedClassId] = useState<string>('all');
    const [showAddExamModal, setShowAddExamModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', totalPoints: 100, classId: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditExamModal, setShowEditExamModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState({ id: '', title: '', totalPoints: 100, classId: '' });
    
    // Filter assignments based on selected class
    const filteredAssignments = assignments.filter(a => selectedClassId === 'all' || a.classId === selectedClassId);

    // Filter students based on search query
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
        // Allow empty string for clearing input
        if (value === '') {
             // In a real app we might want to set to null or 0, here keeping as is or 0 is fine
             updateAssignmentGrade(assignmentId, studentId, 0); // Or handle null if supported
             return;
        }

        const newGrade = parseInt(value);
        if (!isNaN(newGrade)) {
            updateAssignmentGrade(assignmentId, studentId, newGrade);
        }
    };

    const handleAddAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAssignment.classId && newAssignment.title) {
            addAssignment({
                id: Date.now().toString(),
                classId: newAssignment.classId,
                title: newAssignment.title,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                totalPoints: newAssignment.totalPoints,
                submissions: []
            });
            setShowAddExamModal(false);
            setNewAssignment({ title: '', totalPoints: 100, classId: '' });
        }
    };

    const handleEditAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        updateAssignment({
            id: editingAssignment.id,
            title: editingAssignment.title,
            totalPoints: editingAssignment.totalPoints,
            classId: editingAssignment.classId
        });
        setShowEditExamModal(false);
    };

    const openEditModal = (assignment: any) => {
        setEditingAssignment({
            id: assignment.id,
            title: assignment.title,
            totalPoints: assignment.totalPoints,
            classId: assignment.classId
        });
        setShowEditExamModal(true);
    };
    
    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Gradebook</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAddExamModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Plus size={18} /> Add Exam
                    </button>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search student..." 
                            className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 bg-gray-50 z-10 p-4 border-b border-r border-gray-200 min-w-[200px] text-gray-600 font-medium text-sm">Student</th>
                                    {filteredAssignments.map(assignment => (
                                        <th key={assignment.id} className="p-4 border-b border-gray-200 min-w-[150px] text-gray-600 font-medium text-sm group cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => openEditModal(assignment)}>
                                            <div className="flex flex-col">
                                                <span>{assignment.title}</span>
                                                <span className="text-xs text-gray-400 font-normal truncate max-w-[140px]">
                                                    {classes.find(c => c.id === assignment.classId)?.code || 'Class'}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="p-4 border-b border-gray-200 min-w-[100px] text-gray-600 font-medium text-sm text-center">Average</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredStudents.map((student) => {
                                     // Calculate student average
                                    let totalEarned = 0;
                                    let totalPossible = 0;
            
                                    filteredAssignments.forEach(a => {
                                         const submission = a.submissions.find(s => s.studentId === student.id);
                                         if (submission) {
                                            totalEarned += submission.grade;
                                            totalPossible += a.totalPoints;
                                         }
                                    });
                                    const avg = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
            
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="sticky left-0 bg-white p-4 border-r border-gray-200 font-medium text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                {student.name}
                                            </td>
                                            {filteredAssignments.map((assignment) => {
                                                const submission = assignment.submissions.find(s => s.studentId === student.id);
                                                return (
                                                    <td key={assignment.id} className="p-4 text-center">
                                                         <div className="relative group">
                                                            <input 
                                                                type="text" 
                                                                inputMode="numeric"
                                                                pattern="[0-9]*"
                                                                className={clsx(
                                                                    "w-16 text-center border rounded py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all",
                                                                     (submission?.grade || 0) >= 90 ? "bg-green-50 border-green-200 text-green-700 font-medium" :
                                                                     (submission?.grade || 0) >= 80 ? "bg-blue-50 border-blue-200 text-blue-700" :
                                                                     (submission?.grade || 0) >= 70 ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                                                                     "bg-red-50 border-red-200 text-red-700"
                                                                )}
                                                                value={submission?.grade?.toString() ?? ''}
                                                                placeholder="-"
                                                                onChange={(e) => handleGradeChange(student.id, assignment.id, e.target.value)}
                                                            />
                                                         </div>
                                                    </td>
                                                );
                                            })}
                                             <td className="p-4 text-center">
                                                <span className={clsx(
                                                    "px-2 py-1 rounded-full text-sm font-bold",
                                                    avg >= 90 ? "bg-green-100 text-green-700" :
                                                    avg >= 80 ? "bg-blue-100 text-blue-700" :
                                                    avg >= 70 ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                                )}>
                                                    {avg}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                </div>
            </div>

            {/* Add Assignment Modal */}
            {showAddExamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Exam/Assignment</h3>
                        <form onSubmit={handleAddAssignment} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={newAssignment.title}
                                    onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                                    placeholder="e.g. Midterm Exam"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                                <select 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={newAssignment.classId}
                                    onChange={e => setNewAssignment({...newAssignment, classId: e.target.value})}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Points</label>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={newAssignment.totalPoints}
                                    onChange={e => setNewAssignment({...newAssignment, totalPoints: parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddExamModal(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Assignment Modal */}
            {showEditExamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Exam/Assignment</h3>
                        <form onSubmit={handleEditAssignment} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={editingAssignment.title}
                                    onChange={e => setEditingAssignment({...editingAssignment, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                                <select 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={editingAssignment.classId}
                                    onChange={e => setEditingAssignment({...editingAssignment, classId: e.target.value})}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Points</label>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={editingAssignment.totalPoints}
                                    onChange={e => setEditingAssignment({...editingAssignment, totalPoints: parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditExamModal(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
