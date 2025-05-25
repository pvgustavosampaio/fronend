import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as paymentsController from '../controllers/paymentsController.js';

const router = express.Router();

// Get all payments
router.get('/', paymentsController.getAllPayments);

// Get payment by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid payment ID format')
  ]),
  paymentsController.getPaymentById
);

// Get payments by user ID
router.get(
  '/user/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  paymentsController.getUserPayments
);

// Create new payment
router.post(
  '/',
  validate([
    body('user_id').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('status').isIn(['pendente', 'pago', 'atrasado']).withMessage('Invalid status'),
    body('due_date').isISO8601().withMessage('Due date must be a valid date')
  ]),
  paymentsController.createPayment
);

// Update payment
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid payment ID format'),
    body('status').optional().isIn(['pendente', 'pago', 'atrasado']).withMessage('Invalid status'),
    body('paid_date').optional().isISO8601().withMessage('Paid date must be a valid date')
  ]),
  paymentsController.updatePayment
);

// Delete payment
router.delete(
  '/:id',
  authorizeRole(['admin']),
  validate([
    param('id').isUUID().withMessage('Invalid payment ID format')
  ]),
  paymentsController.deletePayment
);

// Get payment statistics
router.get('/stats/overview', paymentsController.getPaymentStats);

// Get revenue by period
router.get(
  '/stats/revenue',
  validate([
    query('period').optional().isIn(['1m', '3m', '6m', '1y']).withMessage('Invalid period')
  ]),
  paymentsController.getRevenueByPeriod
);

// Get pending payments
router.get('/pending', paymentsController.getPendingPayments);

// Send payment reminder
router.post(
  '/remind/:id',
  validate([
    param('id').isUUID().withMessage('Invalid payment ID format')
  ]),
  paymentsController.sendPaymentReminder
);

// Process payment
router.post(
  '/process/:id',
  validate([
    param('id').isUUID().withMessage('Invalid payment ID format'),
    body('paymentMethod').isIn(['pix', 'credit_card', 'bank_transfer']).withMessage('Invalid payment method')
  ]),
  paymentsController.processPayment
);

export default router;