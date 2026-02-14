import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    matchScore: number;
    atsScore: number;
    predictedSalary: number;
    matchedSkills: string[];
    missingSkills: string[];
    similarityExplanation?: string;
    pdfUrl?: string;
    createdAt: Date;
}

const ReportSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    matchScore: { type: Number, required: true },
    atsScore: { type: Number, required: true },
    predictedSalary: { type: Number, required: true },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    similarityExplanation: { type: String },
    pdfUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IReport>('Report', ReportSchema);
