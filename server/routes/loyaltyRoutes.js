import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as loyaltyController from '../controllers/loyaltyController.js';

const router = express.Router();

// Get loyalty program overview
router.get('/overview', loyaltyController.getLoyaltyOverview);

// Get loyalty tiers
router.get('/tiers', loyaltyController.getLoyaltyTiers);

// Get user loyalty status
router.get(
  '/user/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  loyaltyController.getUserLoyaltyStatus
);

// Add points to user
router.post(
  '/points/add',
  validate([
    body('userId').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    body('reason').isString().notEmpty().withMessage('Reason is required')
  ]),
  loyaltyController.addPoints
);

// Redeem points for reward
router.post(
  '/points/redeem',
  validate([
    body('userId').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('rewardId').isString().notEmpty().withMessage('Reward ID is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer')
  ]),
  loyaltyController.redeemPoints
);

// Get available rewards
router.get('/rewards', loyaltyController.getAvailableRewards);

// Create new reward
router.post(
  '/rewards',
  authorizeRole(['admin']),
  validate([
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('description').isString().notEmpty().withMessage('Description is required'),
    body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    body('available').isBoolean().withMessage('Available must be a boolean')
  ]),
  loyaltyController.createReward
);

// Update reward
router.put(
  '/rewards/:id',
  authorizeRole(['admin']),
  validate([
    param('id').isString().notEmpty().withMessage('Invalid reward ID format'),
    body('name').optional().isString().notEmpty().withMessage('Name is required'),
    body('description').optional().isString().notEmpty().withMessage('Description is required'),
    body('points').optional().isInt({ min: 1 }).withMessage('Points must be a positive integer'),
    body('available').optional().isBoolean().withMessage('Available must be a boolean')
  ]),
  loyaltyController.updateReward
);

// Get points history for user
router.get(
  '/history/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  loyaltyController.getPointsHistory
);

// Get loyalty program statistics
router.get(
  '/stats',
  authorizeRole(['admin']),
  loyaltyController.getLoyaltyStats
);

export default router;