import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation.js';
import * as chatbotController from '../controllers/chatbotController.js';

const router = express.Router();

// Get conversation history
router.get(
  '/history',
  chatbotController.getConversationHistory
);

// Send message to chatbot
router.post(
  '/message',
  validate([
    body('message').isString().notEmpty().withMessage('Message is required')
  ]),
  chatbotController.sendMessage
);

// Get suggested queries
router.get('/suggested-queries', chatbotController.getSuggestedQueries);

// Get chatbot settings
router.get('/settings', chatbotController.getChatbotSettings);

// Update chatbot settings
router.put(
  '/settings',
  validate([
    body('mode').optional().isIn(['gestao', 'aluno', 'financeiro']).withMessage('Invalid mode'),
    body('responseStyle').optional().isIn(['concise', 'detailed']).withMessage('Invalid response style')
  ]),
  chatbotController.updateChatbotSettings
);

// Execute action from chatbot
router.post(
  '/execute-action',
  validate([
    body('action').isString().notEmpty().withMessage('Action is required'),
    body('parameters').optional().isObject().withMessage('Parameters must be an object')
  ]),
  chatbotController.executeAction
);

export default router;