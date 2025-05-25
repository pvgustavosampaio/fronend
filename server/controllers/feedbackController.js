import { supabase } from '../index.js';

// Get all feedback
export const getAllFeedback = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, rating, startDate, endDate } = req.query;
    
    let query = supabase
      .from('feedback')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `, { count: 'exact' })
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (rating) {
      query = query.eq('rating', parseInt(rating));
    }
    
    if (startDate) {
      query = query.gte('date', new Date(startDate).toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', new Date(endDate).toISOString());
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

// Get feedback by ID
export const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get feedback by user ID
export const getUserFeedback = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 30, offset = 0 } = req.query;
    
    const { data, error, count } = await supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
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

// Create new feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { user_id, rating, comment, date = new Date().toISOString() } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create feedback record
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id,
        rating,
        comment,
        date
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Update feedback
export const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Prepare update object
    const updates = {};
    if (rating !== undefined) updates.rating = rating;
    if (comment !== undefined) updates.comment = comment;
    
    // Update feedback record
    const { data, error } = await supabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Delete feedback
export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete feedback record
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get feedback statistics
export const getFeedbackStats = async (req, res, next) => {
  try {
    // Get all feedback
    const { data, error } = await supabase
      .from('feedback')
      .select('rating, date');
    
    if (error) throw error;
    
    // Calculate average rating
    const totalRating = data.reduce((sum, item) => sum + (item.rating || 0), 0);
    const averageRating = data.length > 0 ? totalRating / data.length : 0;
    
    // Count ratings by value
    const ratingCounts = data.reduce((counts, item) => {
      const rating = item.rating || 0;
      counts[rating] = (counts[rating] || 0) + 1;
      return counts;
    }, {});
    
    // Format rating distribution for frontend
    const ratingDistribution = [];
    for (let i = 1; i <= 5; i++) {
      ratingDistribution.push({
        rating: i,
        count: ratingCounts[i] || 0,
        percentage: data.length > 0 ? ((ratingCounts[i] || 0) / data.length) * 100 : 0
      });
    }
    
    // Calculate trend (last 3 months vs previous 3 months)
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    const sixMonthsAgo = new Date(threeMonthsAgo);
    sixMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentFeedback = data.filter(item => new Date(item.date) >= threeMonthsAgo);
    const olderFeedback = data.filter(item => new Date(item.date) >= sixMonthsAgo && new Date(item.date) < threeMonthsAgo);
    
    const recentAverage = recentFeedback.length > 0
      ? recentFeedback.reduce((sum, item) => sum + (item.rating || 0), 0) / recentFeedback.length
      : 0;
    
    const olderAverage = olderFeedback.length > 0
      ? olderFeedback.reduce((sum, item) => sum + (item.rating || 0), 0) / olderFeedback.length
      : 0;
    
    const trend = olderAverage > 0
      ? ((recentAverage - olderAverage) / olderAverage) * 100
      : 0;
    
    res.status(200).json({
      totalFeedback: data.length,
      averageRating: parseFloat(averageRating.toFixed(2)),
      ratingDistribution,
      trend: parseFloat(trend.toFixed(2))
    });
  } catch (error) {
    next(error);
  }
};

// Get feedback sentiment analysis
export const getFeedbackSentiment = async (req, res, next) => {
  try {
    // Get feedback with comments
    const { data, error } = await supabase
      .from('feedback')
      .select('rating, comment')
      .not('comment', 'is', null);
    
    if (error) throw error;
    
    // In a real implementation, this would use NLP to analyze sentiment
    // For now, we'll use a simple approach based on rating
    
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0
    };
    
    data.forEach(item => {
      if (item.rating >= 4) {
        sentimentCounts.positive++;
      } else if (item.rating === 3) {
        sentimentCounts.neutral++;
      } else {
        sentimentCounts.negative++;
      }
    });
    
    // Calculate percentages
    const total = data.length;
    const sentimentPercentages = {
      positive: total > 0 ? (sentimentCounts.positive / total) * 100 : 0,
      neutral: total > 0 ? (sentimentCounts.neutral / total) * 100 : 0,
      negative: total > 0 ? (sentimentCounts.negative / total) * 100 : 0
    };
    
    res.status(200).json({
      counts: sentimentCounts,
      percentages: {
        positive: parseFloat(sentimentPercentages.positive.toFixed(2)),
        neutral: parseFloat(sentimentPercentages.neutral.toFixed(2)),
        negative: parseFloat(sentimentPercentages.negative.toFixed(2))
      },
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get feedback topics
export const getFeedbackTopics = async (req, res, next) => {
  try {
    // In a real implementation, this would use NLP to extract topics from feedback
    // For now, we'll return mock data
    
    const topics = [
      { name: 'Equipamentos', value: 45, color: '#9b87f5' },
      { name: 'Horários', value: 30, color: '#64B5F6' },
      { name: 'Limpeza', value: 25, color: '#81C784' },
      { name: 'Instrutores', value: 20, color: '#FFB74D' },
      { name: 'Preço', value: 15, color: '#E57373' }
    ];
    
    res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
};

// Respond to feedback
export const respondToFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    
    // In a real implementation, this would store the response and notify the user
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Response sent successfully',
      feedbackId: id,
      response
    });
  } catch (error) {
    next(error);
  }
};