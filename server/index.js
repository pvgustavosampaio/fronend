import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import dashboardRoutes from './routes/dashboardRoutes.js';
import managementRoutes from './routes/managementRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import churnPredictionRoutes from './routes/churnPredictionRoutes.js';
import mlPredictionRoutes from './routes/mlPredictionRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import dataManagementRoutes from './routes/dataManagementRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import communicationRoutes from './routes/communicationRoutes.js';
import classesRoutes from './routes/classesRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import savedClassesRoutes from './routes/savedClassesRoutes.js';
import activitiesRoutes from './routes/activitiesRoutes.js';
import programsRoutes from './routes/programsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import languageRoutes from './routes/languageRoutes.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/management', authenticateToken, managementRoutes);
app.use('/api/alerts', authenticateToken, alertsRoutes);
app.use('/api/churn-prediction', authenticateToken, churnPredictionRoutes);
app.use('/api/ml-prediction', authenticateToken, mlPredictionRoutes);
app.use('/api/analysis', authenticateToken, analysisRoutes);
app.use('/api/attendance', authenticateToken, attendanceRoutes);
app.use('/api/notifications', authenticateToken, notificationsRoutes);
app.use('/api/data-management', dataManagementRoutes);
app.use('/api/chatbot', authenticateToken, chatbotRoutes);
app.use('/api/payments', authenticateToken, paymentsRoutes);
app.use('/api/feedback', authenticateToken, feedbackRoutes);
app.use('/api/integration', authenticateToken, integrationRoutes);
app.use('/api/loyalty', authenticateToken, loyaltyRoutes);
app.use('/api/communication', authenticateToken, communicationRoutes);
app.use('/api/classes', authenticateToken, classesRoutes);
app.use('/api/schedule', authenticateToken, scheduleRoutes);
app.use('/api/saved-classes', authenticateToken, savedClassesRoutes);
app.use('/api/activities', authenticateToken, activitiesRoutes);
app.use('/api/programs', authenticateToken, programsRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);
app.use('/api/billing', authenticateToken, billingRoutes);
app.use('/api/language', authenticateToken, languageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;