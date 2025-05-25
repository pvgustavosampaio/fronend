import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as churnPredictionController from '../controllers/churnPredictionController.js';

const router = express.Router();

// Get all predictions
router.get('/', churnPredictionController.getAllPredictions);

// Get prediction by ID
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Invalid prediction ID format')
  ]),
  churnPredictionController.getPredictionById
);

// Get predictions for a specific user
router.get(
  '/user/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format')
  ]),
  churnPredictionController.getUserPredictions
);

// Create new prediction
router.post(
  '/',
  validate([
    body('userId').isUUID().withMessage('User ID is required and must be a valid UUID')
  ]),
  churnPredictionController.createPrediction
);

// Batch process predictions
router.post(
  '/batch',
  authorizeRole(['admin']),
  churnPredictionController.batchProcessPredictions
);

// Get recommended actions for a user
router.get(
  '/actions/:userId',
  validate([
    param('userId').isUUID().withMessage('Invalid user ID format'),
    query('predictionId').optional().isUUID().withMessage('Invalid prediction ID format')
  ]),
  churnPredictionController.getRecommendedActions
);

// Create action for a user
router.post(
  '/actions',
  validate([
    body('userId').isUUID().withMessage('User ID is required and must be a valid UUID'),
    body('predictionId').isUUID().withMessage('Prediction ID is required and must be a valid UUID'),
    body('actionType').isIn(['mensagem', 'desconto', 'ligação', 'aula_gratis', 'outro']).withMessage('Invalid action type'),
    body('actionDescription').isString().notEmpty().withMessage('Action description is required')
  ]),
  churnPredictionController.createAction
);

// Update action status
router.put(
  '/actions/:actionId',
  validate([
    param('actionId').isUUID().withMessage('Invalid action ID format'),
    body('status').isIn(['pendente', 'em_andamento', 'concluido', 'cancelado']).withMessage('Invalid status')
  ]),
  churnPredictionController.updateActionStatus
);

// Get model metrics
router.get('/metrics/model', churnPredictionController.getModelMetrics);

// Evaluate model performance
router.post(
  '/metrics/evaluate',
  authorizeRole(['admin']),
  validate([
    body('daysAgo').optional().isInt({ min: 1 }).withMessage('Days ago must be a positive integer')
  ]),
  churnPredictionController.evaluateModelPerformance
);

export default router;