import { supabase } from '../index.js';

// Get all predictions
export const getAllPredictions = async (req, res, next) => {
  try {
    const { risk_level, limit = 100, offset = 0 } = req.query;
    
    let query = supabase
      .from('churn_predictions')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email,
          photo
        )
      `)
      .order('prediction_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply risk level filter if provided
    if (risk_level) {
      query = query.eq('risk_level', risk_level);
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    res.status(200).json({
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get prediction by ID
export const getPredictionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('churn_predictions')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email,
          photo
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Prediction not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get predictions for a specific user
export const getUserPredictions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('churn_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('prediction_date', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Create new prediction
export const createPrediction = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Call the edge function to generate prediction
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/functions/v1/churn-prediction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create prediction');
    }
    
    const result = await response.json();
    
    res.status(201).json(result.prediction);
  } catch (error) {
    next(error);
  }
};

// Batch process predictions
export const batchProcessPredictions = async (req, res, next) => {
  try {
    // Call the edge function to batch process predictions
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/functions/v1/churn-prediction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ batchProcess: true }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to batch process predictions');
    }
    
    const result = await response.json();
    
    res.status(200).json({
      message: 'Batch processing completed',
      processed: result.processed,
      total: result.total
    });
  } catch (error) {
    next(error);
  }
};

// Get recommended actions for a user
export const getRecommendedActions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { predictionId } = req.query;
    
    // Get the latest prediction if predictionId is not provided
    let prediction;
    
    if (predictionId) {
      const { data, error } = await supabase
        .from('churn_predictions')
        .select('*')
        .eq('id', predictionId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Prediction not found' });
        }
        throw error;
      }
      
      prediction = data;
    } else {
      const { data, error } = await supabase
        .from('churn_predictions')
        .select('*')
        .eq('user_id', userId)
        .order('prediction_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'No predictions found for this user' });
        }
        throw error;
      }
      
      prediction = data;
    }
    
    // Generate recommendations based on risk level and factors
    const recommendations = [];
    
    if (prediction.risk_level === 'alto') {
      // High risk recommendations
      recommendations.push({
        action_type: 'ligação',
        action_description: 'Ligar para o aluno para entender suas necessidades',
        priority: 1
      });
      
      recommendations.push({
        action_type: 'desconto',
        action_description: 'Oferecer 20% de desconto na próxima mensalidade',
        priority: 2
      });
    } else if (prediction.risk_level === 'médio') {
      // Medium risk recommendations
      recommendations.push({
        action_type: 'mensagem',
        action_description: 'Enviar mensagem personalizada de incentivo',
        priority: 1
      });
      
      recommendations.push({
        action_type: 'aula_gratis',
        action_description: 'Oferecer uma aula experimental gratuita',
        priority: 2
      });
    } else {
      // Low risk recommendations
      recommendations.push({
        action_type: 'mensagem',
        action_description: 'Enviar newsletter com novidades da academia',
        priority: 3
      });
    }
    
    // Add factor-specific recommendations
    const factors = prediction.factors || [];
    for (const factor of factors) {
      if (factor.type === 'attendance' && factor.impact === 'alto') {
        recommendations.push({
          action_type: 'mensagem',
          action_description: 'Enviar lembrete sobre benefícios da frequência regular',
          priority: factor.impact === 'alto' ? 1 : 2
        });
      }
      
      if (factor.type === 'payment') {
        recommendations.push({
          action_type: 'mensagem',
          action_description: 'Enviar lembrete amigável sobre pagamento pendente',
          priority: factor.impact === 'alto' ? 1 : 2
        });
      }
      
      if (factor.type === 'feedback') {
        recommendations.push({
          action_type: 'mensagem',
          action_description: 'Solicitar feedback detalhado para melhorar experiência',
          priority: factor.impact === 'alto' ? 2 : 3
        });
      }
    }
    
    // Sort by priority
    recommendations.sort((a, b) => a.priority - b.priority);
    
    res.status(200).json(recommendations);
  } catch (error) {
    next(error);
  }
};

// Create action for a user
export const createAction = async (req, res, next) => {
  try {
    const { userId, predictionId, actionType, actionDescription } = req.body;
    
    // Create the action
    const { data, error } = await supabase
      .from('churn_actions')
      .insert({
        user_id: userId,
        prediction_id: predictionId,
        action_type: actionType,
        action_description: actionDescription,
        status: 'pendente',
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Update action status
export const updateActionStatus = async (req, res, next) => {
  try {
    const { actionId } = req.params;
    const { status } = req.body;
    
    // Update the action status
    const { data, error } = await supabase
      .from('churn_actions')
      .update({
        status,
        ...(status === 'concluido' ? { completed_at: new Date().toISOString() } : {})
      })
      .eq('id', actionId)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Action not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Get model metrics
export const getModelMetrics = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('churn_model_metrics')
      .select('*')
      .order('training_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No model metrics found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Evaluate model performance
export const evaluateModelPerformance = async (req, res, next) => {
  try {
    const { daysAgo = 30 } = req.body;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    // Get predictions from daysAgo
    const { data: predictions, error: predictionsError } = await supabase
      .from('churn_predictions')
      .select('*, users!inner(*)')
      .lt('prediction_date', cutoffDate.toISOString());
    
    if (predictionsError) throw predictionsError;
    
    if (!predictions || predictions.length === 0) {
      return res.status(200).json({
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1_score: 0,
        total_predictions: 0
      });
    }
    
    // Check which users actually churned (status changed to inactive or deleted)
    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;
    
    for (const prediction of predictions) {
      const { data: currentUser, error: currentUserError } = await supabase
        .from('users')
        .select('status')
        .eq('id', prediction.user_id)
        .single();
      
      if (currentUserError && currentUserError.code !== 'PGRST116') {
        throw currentUserError;
      }
      
      const actuallyChurned = !currentUser || currentUser.status === 'Inativo';
      const predictedChurn = prediction.churn_probability > 0.5;
      
      if (actuallyChurned && predictedChurn) truePositives++;
      else if (!actuallyChurned && predictedChurn) falsePositives++;
      else if (actuallyChurned && !predictedChurn) falseNegatives++;
      else trueNegatives++;
    }
    
    // Calculate metrics
    const accuracy = (truePositives + trueNegatives) / predictions.length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1_score = 2 * (precision * recall) / (precision + recall) || 0;
    
    // Save metrics to database
    await supabase
      .from('churn_model_metrics')
      .insert({
        accuracy,
        precision,
        recall,
        f1_score,
        feature_importance: {
          attendance_frequency: 0.4,
          payment_history: 0.3,
          feedback_rating: 0.15,
          demographics: 0.1,
          other: 0.05
        }
      });
    
    res.status(200).json({
      accuracy,
      precision,
      recall,
      f1_score,
      total_predictions: predictions.length
    });
  } catch (error) {
    next(error);
  }
};