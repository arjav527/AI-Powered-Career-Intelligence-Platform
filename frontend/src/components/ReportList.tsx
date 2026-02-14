import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, ChevronRight, Clock } from 'lucide-react';

const ReportList = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/reports', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(response.data.data.reports);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="text-center py-10">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Reports</h2>

            {reports.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No reports yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Create a new analysis to get started.</p>
                    <Link to="/dashboard/new" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        New Analysis
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                        <Link key={report._id} to={`/dashboard/reports/${report._id}`} className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                        <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                                            report.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {report.matchScore}% Match
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-2">
                                    {report.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    View Analysis
                                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportList;
