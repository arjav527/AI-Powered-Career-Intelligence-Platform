import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';

const ReportDetail = () => {
    const { id } = useParams();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/reports/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReport(response.data.data.report);
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const downloadPDF = () => {
        if (!report) return;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Antigravity Career Report", 20, 20);

        doc.setFontSize(16);
        doc.text(`Title: ${report.title}`, 20, 35);

        doc.setFontSize(12);
        doc.text(`Match Score: ${report.matchScore}%`, 20, 50);
        doc.text(`ATS Score: ${report.atsScore}`, 20, 60);
        doc.text(`Predicted Salary: $${report.predictedSalary?.toLocaleString()}`, 20, 70);

        doc.text("Matched Skills:", 20, 90);
        doc.text(report.matchedSkills.join(", "), 20, 100, { maxWidth: 170 });

        doc.text("Missing Skills:", 20, 120);
        doc.text(report.missingSkills.join(", "), 20, 130, { maxWidth: 170 });

        doc.save(`${report.title.replace(/\s+/g, '_')}_Report.pdf`);
    };

    if (loading) return <div>Loading...</div>;
    if (!report) return <div>Report not found.</div>;

    const skillData = [
        { subject: 'Match', A: report.matchScore, fullMark: 100 },
        { subject: 'ATS', A: report.atsScore, fullMark: 100 },
        { subject: 'Skills', A: (report.matchedSkills.length / (report.matchedSkills.length + report.missingSkills.length)) * 100, fullMark: 100 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{report.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={downloadPDF} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </button>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Match Score</h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{report.matchScore}%</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">ATS Score</h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{report.atsScore}</span>
                        <span className="ml-2 text-sm text-gray-500">/ 100</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Predicted Salary</h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${report.predictedSalary?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Charts & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-96">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Skills List */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills Analysis</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">Matched Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {report.matchedSkills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-red-600 uppercase tracking-wide mb-2">Missing Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {report.missingSkills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similarity Explanation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {report.similarityExplanation}
                </p>
            </div>
        </div>
    );
};

export default ReportDetail;
