import express from 'express';
import { createReport, getReports, getReportById } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // Protect all routes

router.route('/')
    .get(getReports)
    .post(createReport);

router.route('/:id')
    .get(getReportById);

export default router;
