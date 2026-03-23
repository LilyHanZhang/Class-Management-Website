// Placeholder component for Dashboard
import { Users, GraduationCap, Calendar, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { students, assignments, classes } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalStudents = students.length;
    // Calculate a dummy average from assignments
    let totalScore = 0;
    let count = 0;
    assignments.forEach(a => {
        a.submissions.forEach(s => {
            totalScore += s.grade;
            count++;
        });
    });
    const avg = count > 0 ? Math.round(totalScore / count) : 0;
    
    // Calculate upcoming deadlines (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const upcoming = assignments.filter(a => {
        const d = new Date(a.dueDate);
        return d >= now && d <= nextWeek;
    }).length;

    return [
      { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', link: '/roster' },
      { label: 'Class Average', value: `${avg}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', link: '/gradebook' },
      { label: 'Upcoming Deadlines', value: upcoming, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100', link: '/schedule' },
      // Mock data for attendance
      { label: 'Attendance Rate', value: '94%', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100', link: null }, 
    ];
  }, [students, assignments]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 ${stat.link ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
            onClick={() => stat.link && navigate(stat.link)}
          >
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
             <ul className="space-y-4">
                <li className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <div>
                        <p className="text-gray-800 text-sm"> <span className="font-semibold">Alice Johnson</span> submitted <span className="font-medium">Physics Lab Report 1</span></p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                </li>
                  <li className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0" />
                    <div>
                        <p className="text-gray-800 text-sm"> <span className="font-semibold">Bob Smith</span> achieved <span className="font-medium">92%</span> in <span className="font-medium">Calculus Quiz</span></p>
                         <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                    </div>
                </li>
                <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <div>
                        <p className="text-gray-800 text-sm">New assignment <span className="font-medium">History Essay</span> created for <span className="font-medium">World History</span></p>
                         <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                </li>
            </ul>
        </div>
        
        {/* Quick Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
             <div className="space-y-3">
                {classes.slice(0, 3).map((cls) => (
                    <div key={cls.id} className="flex items-center p-3 rounded-lg border-l-4 bg-gray-50" style={{ borderLeftColor: cls.color }}>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{cls.title}</p>
                            <p className="text-sm text-gray-500">{cls.schedule.time} • {cls.code}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
