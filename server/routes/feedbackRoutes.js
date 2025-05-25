import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import * as feedbackController from '../controllers/feedbackController.js';

const router = express.Router();

// Get all feedback
router.get('/', feedbackController.getAllFeedback);

// Get feedback by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid feedback ID format')
  ]),
  feedbackController.getFeedbackById
);

// Get feedback by user ID
router.get(
  '/user/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  feedbackController.getUserFeedback
);

// Create new feedback
router.post(
  '/',
  validate([
    body('user_id').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string')
  ]),
  feedbackController.createFeedback
);

// Update feedback
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid feedback ID format'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string')
  ]),
  feedbackController.updateFeedback
);

// Delete feedback
router.delete(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid feedback ID format')
  ]),
  feedbackController.deleteFeedback
);

// Get feedback statistics
router.get('/stats/overview', feedbackController.getFeedbackStats);

// Get feedback sentiment analysis
router.get('/stats/sentiment', feedbackController.getFeedbackSentiment);

// Get feedback topics
router.get('/stats/topics', feedbackController.getFeedbackTopics);

// Respond to feedback
router.post(
  '/:id/respond',
  validate([
    param('id').isUUID().withMessage('Invalid feedback ID format'),
    body('response').isString().notEmpty().withMessage('Response is required')
  ]),
  feedbackController.respondToFeedback
);

export default router;