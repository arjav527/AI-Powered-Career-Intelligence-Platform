import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, UploadCloud } from 'lucide-react';

const NewAnalysis = () => {
    const [title, setTitle] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experience, setExperience] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple mock extraction for skills (in real app, use NLP or regex on frontend before sending, or let backend do it)
        // For standard demo, we'll let the backend/ML service handle extraction from the `resume_text` string if structured correctly,
        // but our ML service `skill_gap` endpoint expects lists.
        // Let's do a simple split by comma for now or rely on ML service improvements.
        // To make it work with the current backend `createReport` which proxies to ML service:
        // `createReport` sends `resumeSkills` and `jobSkills`.
        // We'll mock extraction here for the sake of the demo or add input fields.
        // Let's add simple input fields for skills or quick regex extraction.

        const extractSkills = (text: string) => {
            // Mock list of common tech skills to check against
            const techSkills = ['python', 'java', 'javascript', 'typescript', 'react', 'node', 'express', 'mongodb', 'sql', 'docker', 'aws', 'kubernetes', 'html', 'css', 'git'];
            return techSkills.filter(skill => text.toLowerCase().includes(skill));
        };

        const resumeSkills = extractSkills(resumeText);
        const jobSkills = extractSkills(jobDescription);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/reports', {
                title,
                resumeText,
                jobDescription,
                resumeSkills,
                jobSkills,
                experience: Number(experience),
                skillCount: resumeSkills.length,
                educationLevel: 1 // Default Bachelor
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate(`/dashboard/reports/${response.data.data.report._id}`);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Analysis failed. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Analysis</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Paste your resume and job description to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent"
                            placeholder="e.g. Frontend Dev Application"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience</label>
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={experience}
                            onChange={(e) => setExperience(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume Content</label>
                        <textarea
                            rows={6}
                            required
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent font-mono text-sm"
                            placeholder="Paste resume text here..."
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                        <textarea
                            rows={6}
                            required
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-transparent font-mono text-sm"
                            placeholder="Paste job description here..."
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <UploadCloud className="h-5 w-5 mr-2" />}
                        {loading ? 'Analyzing...' : 'Run Analysis'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewAnalysis;
