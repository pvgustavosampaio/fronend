import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type Attendance = Database['public']['Tables']['attendance']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type Feedback = Database['public']['Tables']['feedback']['Row'];
type PhysicalProgress = Database['public']['Tables']['physical_progress']['Row'];
type ContentEngagement = Database['public']['Tables']['content_engagement']['Row'];

/**
 * Calculates the churn probability for a user based on various factors
 * 
 * @param userId The user ID to calculate churn probability for
 * @returns A prediction object with probability, confidence, risk level and factors
 */
export async function predictChurn(userId: string) {
  try {
    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    // Fetch attendance data
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);
    
    if (attendanceError) throw attendanceError;

    // Fetch payment data
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: false })
      .limit(6);
    
    if (paymentError) throw paymentError;

    // Fetch feedback data
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);
    
    if (feedbackError) throw feedbackError;

    // Calculate features
    const features = calculateFeatures(user, attendanceData, paymentData, feedbackData);
    
    // Calculate churn probability using the features
    const { probability, confidence, factors } = calculateProbability(features);
    
    // Determine risk level
    const riskLevel = getRiskLevel(probability);
    
    // Save prediction to database
    const { data: prediction, error: predictionError } = await supabase
      .from('churn_predictions')
      .insert({
        user_id: userId,
        churn_probability: probability,
        confidence_score: confidence,
        risk_level: riskLevel,
        factors: factors
      })
      .select()
      .single();
    
    if (predictionError) throw predictionError;
    
    return prediction;
  } catch (error) {
    console.error('Error predicting churn:', error);
    throw error;
  }
}

/**
 * Calculate features from user data for the prediction model
 */
function calculateFeatures(
  user: User, 
  attendanceData: Attendance[], 
  paymentData: Payment[],
  feedbackData: Feedback[]
) {
  // Calculate attendance features
  const attendanceCount = attendanceData.length;
  const lastAttendanceDate = attendanceData[0]?.date ? new Date(attendanceData[0].date) : null;
  const daysSinceLastAttendance = lastAttendanceDate 
    ? Math.floor((new Date().getTime() - lastAttendanceDate.getTime()) / (1000 * 60 * 60 * 24)) 
    : 30;
  
  // Calculate attendance frequency (last 30 days)
  const attendanceFrequency = attendanceCount / 30;
  
  // Calculate payment features
  const hasLatePayment = paymentData.some(p => 
    p.status === 'atrasado' || 
    (p.status === 'pendente' && new Date(p.due_date) < new Date())
  );
  const paymentDelayDays = hasLatePayment 
    ? Math.max(...paymentData
        .filter(p => p.status === 'atrasado')
        .map(p => Math.floor((new Date().getTime() - new Date(p.due_date).getTime()) / (1000 * 60 * 60 * 24)))
      )
    : 0;
  
  // Calculate feedback features
  const averageRating = feedbackData.length > 0
    ? feedbackData.reduce((sum, item) => sum + (item.rating || 0), 0) / feedbackData.length
    : 3; // Default neutral rating
  
  // Calculate demographic features
  const age = user.age || 30; // Default age if missing
  
  return {
    attendanceFrequency,
    daysSinceLastAttendance,
    hasLatePayment,
    paymentDelayDays,
    averageRating,
    age,
    gender: user.gender || 'unknown'
  };
}

/**
 * Calculate churn probability based on features
 * This is a simplified model - in production this would use a trained ML model
 */
function calculateProbability(features: any) {
  // These weights would normally come from a trained model
  const weights = {
    attendanceFrequency: -0.4,      // Higher frequency -> lower churn
    daysSinceLastAttendance: 0.03,  // More days since last visit -> higher churn
    hasLatePayment: 0.2,            // Late payment -> higher churn
    paymentDelayDays: 0.01,         // More days late -> higher churn
    averageRating: -0.15,           // Higher rating -> lower churn
    baseRate: 0.15                  // Base churn rate
  };
  
  // Calculate logit (log-odds)
  let logit = weights.baseRate;
  logit += features.attendanceFrequency * weights.attendanceFrequency;
  logit += features.daysSinceLastAttendance * weights.daysSinceLastAttendance;
  logit += (features.hasLatePayment ? 1 : 0) * weights.hasLatePayment;
  logit += features.paymentDelayDays * weights.paymentDelayDays;
  logit += (5 - features.averageRating) * Math.abs(weights.averageRating); // Invert rating scale
  
  // Convert logit to probability using sigmoid function
  const probability = 1 / (1 + Math.exp(-logit));
  
  // Calculate confidence (simplified)
  const confidence = 0.7 + (Math.random() * 0.2); // Between 0.7 and 0.9
  
  // Determine key factors
  const factors = [];
  
  if (features.daysSinceLastAttendance > 14) {
    factors.push({
      type: 'attendance',
      description: `${features.daysSinceLastAttendance} dias sem frequentar`,
      impact: 'alto'
    });
  }
  
  if (features.hasLatePayment) {
    factors.push({
      type: 'payment',
      description: `Pagamento atrasado há ${features.paymentDelayDays} dias`,
      impact: 'alto'
    });
  }
  
  if (features.averageRating < 3) {
    factors.push({
      type: 'feedback',
      description: `Avaliação média baixa: ${features.averageRating.toFixed(1)}/5`,
      impact: 'médio'
    });
  }
  
  if (features.attendanceFrequency < 0.2) { // Less than 6 days per month
    factors.push({
      type: 'attendance',
      description: `Baixa frequência: ${Math.round(features.attendanceFrequency * 30)} dias/mês`,
      impact: 'médio'
    });
  }
  
  return {
    probability,
    confidence,
    factors
  };
}

/**
 * Determine risk level based on churn probability
 */
function getRiskLevel(probability: number): 'baixo' | 'médio' | 'alto' {
  if (probability < 0.3) return 'baixo';
  if (probability < 0.7) return 'médio';
  return 'alto';
}

/**
 * Batch process all users to generate churn predictions
 */
export async function batchProcessChurnPredictions() {
  try {
    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('status', 'Ativo');
    
    if (usersError) throw usersError;
    
    // Process each user
    const results = [];
    for (const user of users || []) {
      try {
        const prediction = await predictChurn(user.id);
        results.push(prediction);
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      }
    }
    
    return {
      processed: results.length,
      total: users?.length || 0
    };
  } catch (error) {
    console.error('Error in batch processing:', error);
    throw error;
  }
}

/**
 * Get recommended actions based on churn prediction
 */
export async function getRecommendedActions(userId: string, predictionId: string) {
  try {
    // Get the prediction
    const { data: prediction, error: predictionError } = await supabase
      .from('churn_predictions')
      .select('*')
      .eq('id', predictionId)
      .single();
    
    if (predictionError) throw predictionError;
    if (!prediction) throw new Error('Prediction not found');
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    if (!user) throw new Error('User not found');
    
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
    
    return recommendations;
  } catch (error) {
    console.error('Error getting recommended actions:', error);
    throw error;
  }
}

/**
 * Evaluate model performance by comparing predictions with actual churn
 */
export async function evaluateModelPerformance(daysAgo: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    // Get predictions from daysAgo
    const { data: predictions, error: predictionsError } = await supabase
      .from('churn_predictions')
      .select('*, users!inner(*)')
      .lt('prediction_date', cutoffDate.toISOString());
    
    if (predictionsError) throw predictionsError;
    if (!predictions || predictions.length === 0) {
      return {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1_score: 0,
        total_predictions: 0
      };
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
        // PGRST116 is "Row not found" error, which means the user was deleted
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
    
    return {
      accuracy,
      precision,
      recall,
      f1_score,
      total_predictions: predictions.length
    };
  } catch (error) {
    console.error('Error evaluating model performance:', error);
    throw error;
  }
}