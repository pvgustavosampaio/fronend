import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', dashboardController.getDashboardMetrics);

// Get attendance data
router.get('/attendance', dashboardController.getAttendanceData);

// Get revenue data
router.get('/revenue', dashboardController.getRevenueData);

// Get students at risk
router.get('/students-at-risk', dashboardController.getStudentsAtRisk);

// Get evasion trend
router.get('/evasion-trend', dashboardController.getEvasionTrend);

// Get gender distribution
router.get('/gender-distribution', dashboardController.getGenderDistribution);

// Get age distribution
router.get('/age-distribution', dashboardController.getAgeDistribution);

// Get custom dashboard data
router.post(
  '/custom-data',
  validate([
    body('startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().withMessage('End date must be a valid date'),
    body('metrics').isArray().withMessage('Metrics must be an array')
  ]),
  dashboardController.getCustomDashboardData
);

// Admin only: Update dashboard configuration
router.put(
  '/configuration',
  authorizeRole(['admin']),
  validate([
    body('defaultMetrics').isArray().withMessage('Default metrics must be an array'),
    body('refreshInterval').isInt({ min: 5, max: 3600 }).withMessage('Refresh interval must be between 5 and 3600 seconds')
  ]),
  dashboardController.updateDashboardConfiguration
);

export default router;