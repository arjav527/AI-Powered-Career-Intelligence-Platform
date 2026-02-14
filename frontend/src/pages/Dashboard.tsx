import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, LogOut, PlusCircle } from 'lucide-react';
import ReportList from '../components/ReportList';
import NewAnalysis from '../components/NewAnalysis';
import Profile from '../components/Profile';
import ReportDetail from '../components/ReportDetail';

const SidebarItem = ({ to, icon: Icon, label, active }: any) => (
    <Link to={to} className={`flex items-center px-6 py-3 transition-colors ${active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-r-4 border-indigo-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
        <Icon className="h-5 w-5 mr-3" />
        <span className="font-medium">{label}</span>
    </Link>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Force reload to clear state
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-indigo-600 tracking-tight">Antigravity</h2>
                </div>

                <nav className="flex-1 py-6 space-y-1">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Overview" active={location.pathname === '/dashboard'} />
                    <SidebarItem to="/dashboard/new" icon={PlusCircle} label="New Analysis" active={location.pathname === '/dashboard/new'} />
                    <SidebarItem to="/dashboard/reports" icon={FileText} label="My Reports" active={location.pathname.startsWith('/dashboard/reports')} />
                    <SidebarItem to="/dashboard/profile" icon={User} label="Profile" active={location.pathname === '/dashboard/profile'} />
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 md:px-12 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        {location.pathname === '/dashboard' ? 'Overview' :
                            location.pathname === '/dashboard/new' ? 'New Analysis' :
                                location.pathname === '/dashboard/reports' ? 'Reports' : 'Dashboard'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                            U
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<ReportList />} />
                        <Route path="/new" element={<NewAnalysis />} />
                        <Route path="/reports" element={<ReportList />} />
                        <Route path="/reports/:id" element={<ReportDetail />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
