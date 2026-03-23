import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Folder, Menu, X, Bell, Moon, Sun, Search, Calendar } from 'lucide-react';
import clsx from 'clsx';
import { useApp } from '../context/AppContext';

export const Layout = () => {
    const { user, updateUser, notifications, markAllRead } = useApp();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [tempUser, setTempUser] = useState(user);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Roster', icon: Users, path: '/roster' },
        { label: 'Schedule', icon: Calendar, path: '/schedule' },
        { label: 'Gradebook', icon: GraduationCap, path: '/gradebook' },
        { label: 'Resources', icon: Folder, path: '/resources' },
    ];

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(tempUser);
        setIsProfileModalOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple search functionality: if match found, navigate to that page or filter
        if (searchQuery.trim()) {
             // For now, redirect to Roster with search parmas or just console log
             // Ideally this would involve a global search context or URL params
             navigate(`/roster?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleNotificationsToggle = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (!isNotificationsOpen && notifications.some(n => !n.read)) {
            markAllRead();
        }
    };
    
    return (
        <div className={clsx("flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200")}>
            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0",
                !isSidebarOpen && "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <span className="text-xl font-bold text-gray-800 dark:text-gray-100">ScholarSync</span>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                isActive 
                                    ? "bg-blue-50 text-blue-700" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            onClick={() => setIsSidebarOpen(false)} // Close on mobile on click
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                     <button 
                        onClick={() => {
                            setTempUser(user);
                            setIsProfileModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">{user.initials}</div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                        </div>
                    </button>
                    <button 
                        onClick={toggleDarkMode}
                        className="mt-2 flex items-center justify-center w-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Toggle Dark Mode"
                    >
                         {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </aside>

             {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
                            <Menu size={24} />
                        </button>
                         {/* Global Search - Hidden on small mobile */}
                        <div className="hidden sm:block relative w-64 lg:w-96">
                            <form onSubmit={handleSearch}>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search student..." 
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 dark:text-white border-none rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={handleNotificationsToggle}
                                className="relative text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && notifications.some(n => !n.read) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                                )}
                            </button>
                            
                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-20 origin-top-right">
                                     <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Notifications</h3>
                                        <button onClick={() => {markAllRead(); setIsNotificationsOpen(false)}} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                                No notifications yet
                                            </div>
                                        ) : (
                                            <ul>
                                                {notifications.map((notification) => (
                                                    <li key={notification.id} className={clsx("p-3 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", !notification.read && "bg-blue-50/50 dark:bg-blue-900/10")}>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{notification.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <Outlet />
                </div>
            </main>

            {/* User Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl transform transition-all">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h2>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    value={tempUser.name} 
                                    onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initials</label>
                                <input 
                                    type="text" 
                                    value={tempUser.initials} 
                                    onChange={(e) => setTempUser({...tempUser, initials: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <input 
                                    type="text" 
                                    value={tempUser.role} 
                                    onChange={(e) => setTempUser({...tempUser, role: e.target.value})}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5 border"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsProfileModalOpen(false)}
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
