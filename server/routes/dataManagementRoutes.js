import express from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authorizeRole } from '../middleware/auth.js';
import * as dataManagementController from '../controllers/dataManagementController.js';
import path from 'path';

const router = express.Router();

// Get all templates
router.get('/templates', dataManagementController.getAllTemplates);

// Get template by name
router.get('/templates/:name', (req, res) => {
  const { name } = req.params;
  const filePath = path.resolve(process.cwd(), 'public', 'templates', name);
  res.download(filePath, name, (err) => {
    if (err) {
      res.status(404).json({ error: 'Template not found' });
    }
  });
});

// Get data schema
router.get('/schema', dataManagementController.getDataSchema);

// Get data integrity report
router.get('/integrity', authorizeRole(['admin']), dataManagementController.getDataIntegrityReport);

// Backup data
router.post(
  '/backup',
  authorizeRole(['admin']),
  dataManagementController.backupData
);

// Restore data
router.post(
  '/restore',
  authorizeRole(['admin']),
  validate([
    body('backupId').isString().notEmpty().withMessage('Backup ID is required')
  ]),
  dataManagementController.restoreData
);

// Clean cache
router.post(
  '/clean-cache',
  authorizeRole(['admin']),
  dataManagementController.cleanCache
);

// Audit data
router.post(
  '/audit',
  authorizeRole(['admin']),
  dataManagementController.auditData
);

export default router;