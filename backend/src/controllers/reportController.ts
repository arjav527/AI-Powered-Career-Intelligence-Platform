import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import Report from '../models/Report';
import { AppError } from '../middleware/errorMiddleware';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api/v1';

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, resumeText, jobDescription, resumeSkills, jobSkills, experience, skillCount, educationLevel } = req.body;
        // @ts-ignore
        const userId = req.user.id;

        // 1. Get Match %
        const matchResponse = await axios.post(`${ML_SERVICE_URL}/match`, {
            resume_text: resumeText,
            job_description: jobDescription,
        });

        // 2. Get Skill Gap
        const skillGapResponse = await axios.post(`${ML_SERVICE_URL}/skill-gap`, {
            resume_skills: resumeSkills || [], // You'd typically extract these first, but for now assuming frontend sends them or we add an extraction step
            job_skills: jobSkills || [],
        });

        // 3. Get Salary Prediction
        const salaryResponse = await axios.post(`${ML_SERVICE_URL}/salary`, {
            years_experience: experience || 0,
            skill_count: skillCount || 0,
            education_level: educationLevel || 0,
        });

        // 4. Get ATS Score
        const atsResponse = await axios.post(`${ML_SERVICE_URL}/ats-score`, {
            resume_text: resumeText,
            job_description: jobDescription
        });

        const newReport = await Report.create({
            userId,
            title: title || 'Untitled Report',
            matchScore: matchResponse.data.match_percentage,
            atsScore: atsResponse.data.ats_score,
            predictedSalary: salaryResponse.data.predicted_salary,
            matchedSkills: skillGapResponse.data.matched_skills,
            missingSkills: skillGapResponse.data.missing_skills,
            similarityExplanation: matchResponse.data.similarity_explanation,
        });

        res.status(201).json({
            status: 'success',
            data: {
                report: newReport,
                details: {
                    match: matchResponse.data,
                    skills: skillGapResponse.data,
                    salary: salaryResponse.data,
                    ats: atsResponse.data
                }
            },
        });
    } catch (error) {
        console.error('ML Service Error:', error);
        next(new AppError('Failed to generate report. Ensure ML service is running.', 500));
    }
};

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: reports.length,
            data: { reports }
        });
    } catch (error) {
        next(error);
    }
};

export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const report = await Report.findOne({ _id: req.params.id, userId: req.user.id });

        if (!report) {
            return next(new AppError('Report not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { report }
        });
    } catch (error) {
        next(error);
    }
};
