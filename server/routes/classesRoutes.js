import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as classesController from '../controllers/classesController.js';

const router = express.Router();

// Get all classes
router.get('/', classesController.getAllClasses);

// Get class by ID
router.get(
  '/:id',
  validate([
    param('id').isString().notEmpty().withMessage('Invalid class ID format')
  ]),
  classesController.getClassById
);

// Create new class
router.post(
  '/',
  authorizeRole(['admin', 'staff']),
  validate([
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('instructor').isString().notEmpty().withMessage('Instructor is required'),
    body('time').isString().notEmpty().withMessage('Time is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('level').isIn(['Iniciante', 'Intermediário', 'Avançado']).withMessage('Invalid level'),
    body('type').isString().notEmpty().withMessage('Type is required')
  ]),
  classesController.createClass
);

// Update class
router.put(
  '/:id',
  authorizeRole(['admin', 'staff']),
  validate([
    param('id').isString().notEmpty().withMessage('Invalid class ID format'),
    body('name').optional().isString().notEmpty().withMessage('Name is required'),
    body('instructor').optional().isString().notEmpty().withMessage('Instructor is required'),
    body('time').optional().isString().notEmpty().withMessage('Time is required'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('level').optional().isIn(['Iniciante', 'Intermediário', 'Avançado']).withMessage('Invalid level'),
    body('type').optional().isString().notEmpty().withMessage('Type is required')
  ]),
  classesController.updateClass
);

// Delete class
router.delete(
  '/:id',
  authorizeRole(['admin']),
  validate([
    param('id').isString().notEmpty().withMessage('Invalid class ID format')
  ]),
  classesController.deleteClass
);

// Get class schedule
router.get('/schedule', classesController.getClassSchedule);

// Get class attendance
router.get(
  '/:id/attendance',
  validate([
    param('id').isString().notEmpty().withMessage('Invalid class ID format')
  ]),
  classesController.getClassAttendance
);

// Register for class
router.post(
  '/:id/register',
  validate([
    param('id').isString().notEmpty().withMessage('Invalid class ID format'),
    body('userId').isUUID().withMessage('User ID is required and must be a valid UUID')
  ]),
  classesController.registerForClass
);

// Cancel class registration
router.delete(
  '/:id/register/:userId',
  validate([
    param('id').isString().notEmpty().withMessage('Invalid class ID format'),
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  classesController.cancelClassRegistration
);

// Get class statistics
router.get(
  '/stats/overview',
  authorizeRole(['admin', 'staff']),
  classesController.getClassStats
);

export default router;