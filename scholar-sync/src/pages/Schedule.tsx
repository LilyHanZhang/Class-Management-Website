// Placeholder component for Schedule
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { ClassSubject } from '../types';

export const Schedule = () => {
    const { classes, addClass, updateClass, deleteClass } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingClassId, setEditingClassId] = useState<string | null>(null);
    const [newClass, setNewClass] = useState<Partial<ClassSubject>>({
        title: '',
        code: '',
        schedule: { days: [], time: '' },
        color: '#3B82F6' // Default Blue
    });

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    const handleEdit = (cls: ClassSubject) => {
        setNewClass({
            title: cls.title,
            code: cls.code,
            schedule: { days: cls.schedule.days, time: cls.schedule.time },
            color: cls.color
        });
        setEditingClassId(cls.id);
        setIsEditMode(true);
        setTitle('Edit Class');
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setNewClass({
            title: '',
            code: '',
            schedule: { days: [], time: '' },
            color: '#3B82F6'
        });
        setEditingClassId(null);
        setIsEditMode(false);
        setTitle('Add New Class');
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (newClass.title && newClass.code && newClass.schedule?.time) {
            if (isEditMode && editingClassId) {
                updateClass({
                    id: editingClassId,
                    title: newClass.title,
                    code: newClass.code,
                    schedule: {
                        days: newClass.schedule.days || [],
                        time: newClass.schedule.time
                    },
                    color: newClass.color || '#3B82F6'
                });
            } else {
                addClass({
                    id: Date.now().toString(),
                    title: newClass.title,
                    code: newClass.code,
                    schedule: {
                        days: newClass.schedule.days || [],
                        time: newClass.schedule.time
                    },
                    color: newClass.color || '#3B82F6'
                });
            }
            setIsModalOpen(false);
            setNewClass({ title: '', code: '', schedule: { days: [], time: '' }, color: '#3B82F6' });
        }
    };

    const toggleDay = (day: string) => {
        const currentDays = newClass.schedule?.days || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        setNewClass({ ...newClass, schedule: { ...newClass.schedule!, days: newDays } });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Schedule</h2>
                <button 
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Class
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative group cursor-pointer" onClick={() => handleEdit(cls)}>
                        <div 
                            className="absolute top-0 left-0 w-1.5 h-full rounded-l-xl" 
                            style={{ backgroundColor: cls.color }}
                        />
                        <div className="ml-2">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cls.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{cls.code}</p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteClass(cls.id); }}
                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Class"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Calendar size={16} />
                                    <span className="text-sm">{cls.schedule.days.join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Clock size={16} />
                                    <span className="text-sm">{cls.schedule.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Class Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={newClass.title}
                                    onChange={e => setNewClass({...newClass, title: e.target.value})}
                                    placeholder="e.g. Advanced Physics"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={newClass.code}
                                    onChange={e => setNewClass({...newClass, code: e.target.value})}
                                    placeholder="e.g. PHY301"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Days</label>
                                <div className="flex gap-2">
                                    {daysOfWeek.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={clsx(
                                                "px-3 py-1 rounded-full text-sm font-medium transition-colors border",
                                                newClass.schedule?.days?.includes(day)
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2.5 border"
                                    value={newClass.schedule?.time}
                                    onChange={e => setNewClass({...newClass, schedule: { ...newClass.schedule!, time: e.target.value }})}
                                    placeholder="e.g. 10:00 AM - 11:30 AM"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
