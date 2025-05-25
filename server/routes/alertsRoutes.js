import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as alertsController from '../controllers/alertsController.js';

const router = express.Router();

// Get all alerts
router.get('/', alertsController.getAllAlerts);

// Get alert by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid alert ID format')
  ]),
  alertsController.getAlertById
);

// Get alerts by user ID
router.get(
  '/user/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  alertsController.getUserAlerts
);

// Create new alert
router.post(
  '/',
  validate([
    body('user_id').optional().isUUID().withMessage('User ID must be a valid UUID'),
    body('severity').isIn(['low', 'medium', 'high']).withMessage('Invalid severity level'),
    body('message').isString().notEmpty().withMessage('Message is required'),
    body('status').optional().isIn(['pending', 'resolved', 'dismissed']).withMessage('Invalid status')
  ]),
  alertsController.createAlert
);

// Update alert
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid alert ID format'),
    body('status').isIn(['pending', 'resolved', 'dismissed']).withMessage('Invalid status'),
    body('resolved_at').optional().isISO8601().withMessage('Resolved date must be a valid date')
  ]),
  alertsController.updateAlert
);

// Delete alert
router.delete(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid alert ID format')
  ]),
  alertsController.deleteAlert
);

// Get alert statistics
router.get('/stats/overview', alertsController.getAlertStats);

// Generate automatic alerts
router.post(
  '/generate',
  authorizeRole(['admin']),
  alertsController.generateAutomaticAlerts
);

// Dismiss multiple alerts
router.post(
  '/dismiss-multiple',
  validate([
    body('alertIds').isArray().withMessage('Alert IDs must be an array'),
    body('alertIds.*').isUUID().withMessage('Each alert ID must be a valid UUID')
  ]),
  alertsController.dismissMultipleAlerts
);

export default router;