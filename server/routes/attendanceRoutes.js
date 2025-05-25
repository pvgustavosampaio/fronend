import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import * as attendanceController from '../controllers/attendanceController.js';

const router = express.Router();

// Get all attendance records
router.get('/', attendanceController.getAllAttendance);

// Get attendance by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid attendance ID format')
  ]),
  attendanceController.getAttendanceById
);

// Get attendance by user ID
router.get(
  '/user/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  attendanceController.getUserAttendance
);

// Create new attendance record
router.post(
  '/',
  validate([
    body('user_id').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('class_type').isIn(['presencial', 'online']).withMessage('Class type must be either presencial or online'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer')
  ]),
  attendanceController.createAttendance
);

// Update attendance record
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid attendance ID format'),
    body('class_type').optional().isIn(['presencial', 'online']).withMessage('Class type must be either presencial or online'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer')
  ]),
  attendanceController.updateAttendance
);

// Delete attendance record
router.delete(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid attendance ID format')
  ]),
  attendanceController.deleteAttendance
);

// Get attendance statistics
router.get(
  '/stats/overview',
  validate([
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
  ]),
  attendanceController.getAttendanceStats
);

// Get attendance heatmap data
router.get('/stats/heatmap', attendanceController.getAttendanceHeatmap);

// Check in user
router.post(
  '/check-in',
  validate([
    body('user_id').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('class_type').isIn(['presencial', 'online']).withMessage('Class type must be either presencial or online')
  ]),
  attendanceController.checkInUser
);

// Generate QR code for check-in
router.get('/qr-code', attendanceController.generateQRCode);

export default router;