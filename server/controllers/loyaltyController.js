import { supabase } from '../index.js';

// Get loyalty program overview
export const getLoyaltyOverview = async (req, res, next) => {
  try {
    // In a real implementation, this would fetch data from a database
    // For now, we'll return mock data
    
    const overview = {
      totalPoints: 12450,
      activeMembers: 85,
      totalMembers: 100,
      redemptionRate: 73
    };
    
    res.status(200).json(overview);
  } catch (error) {
    next(error);
  }
};

// Get loyalty tiers
export const getLoyaltyTiers = async (req, res, next) => {
  try {
    // In a real implementation, these would be fetched from a database
    const tiers = [
      { 
        name: 'Bronze', 
        emoji: '🥉', 
        threshold: 0, 
        benefits: ['Desconto 5%', 'Acesso básico'] 
      },
      { 
        name: 'Prata', 
        emoji: '🥈', 
        threshold: 5000, 
        benefits: ['Desconto 10%', 'Aula experimental grátis'] 
      },
      { 
        name: 'Ouro', 
        emoji: '🏅', 
        threshold: 15000, 
        benefits: ['Desconto 20%', 'Acesso à sauna grátis', 'Personal trainer 1x/mês'] 
      }
    ];
    
    res.status(200).json(tiers);
  } catch (error) {
    next(error);
  }
};

// Get user loyalty status
export const getUserLoyaltyStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real implementation, this would fetch the user's points from a database
    // For now, we'll return mock data
    
    // Determine which tier the user is in
    const mockPoints = Math.floor(Math.random() * 20000);
    let tier, nextTier;
    
    if (mockPoints >= 15000) {
      tier = 'Ouro';
      nextTier = 0; // Already at max tier
    } else if (mockPoints >= 5000) {
      tier = 'Prata';
      nextTier = 15000 - mockPoints; // Points needed for Gold
    } else {
      tier = 'Bronze';
      nextTier = 5000 - mockPoints; // Points needed for Silver
    }
    
    res.status(200).json({
      userId,
      name: user.name,
      points: mockPoints,
      tier,
      nextTier,
      nextTierName: nextTier > 0 ? (tier === 'Bronze' ? 'Prata' : 'Ouro') : null,
      joinedAt: '2023-01-15T00:00:00Z', // Mock join date
      lastActivity: '2h atrás' // Mock last activity
    });
  } catch (error) {
    next(error);
  }
};

// Add points to user
export const addPoints = async (req, res, next) => {
  try {
    const { userId, points, reason } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real implementation, this would update the user's points in a database
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Points added successfully',
      transaction: {
        userId,
        points,
        reason,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Redeem points for reward
export const redeemPoints = async (req, res, next) => {
  try {
    const { userId, rewardId, points } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real implementation, this would:
    // 1. Check if the user has enough points
    // 2. Check if the reward is available
    // 3. Deduct points from the user
    // 4. Record the redemption
    
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Points redeemed successfully',
      redemption: {
        userId,
        rewardId,
        points,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get available rewards
export const getAvailableRewards = async (req, res, next) => {
  try {
    // In a real implementation, these would be fetched from a database
    const rewards = [
      { 
        id: '1', 
        name: 'Camiseta Vintage', 
        description: 'Camiseta exclusiva da academia', 
        points: 2000, 
        image: '👕', 
        available: true 
      },
      { 
        id: '2', 
        name: 'Mês Grátis', 
        description: 'Um mês de mensalidade grátis', 
        points: 5000, 
        image: '🏋️', 
        available: true 
      },
      { 
        id: '3', 
        name: 'Personal Trainer', 
        description: 'Sessão exclusiva com personal trainer', 
        points: 8000, 
        image: '💪', 
        available: true 
      },
      { 
        id: '4', 
        name: 'Kit Suplementos', 
        description: 'Kit com suplementos premium', 
        points: 3500, 
        image: '🥤', 
        available: false 
      },
    ];
    
    res.status(200).json(rewards);
  } catch (error) {
    next(error);
  }
};

// Create new reward
export const createReward = async (req, res, next) => {
  try {
    const { name, description, points, available } = req.body;
    
    // In a real implementation, this would create a new reward in the database
    // For now, we'll just return success
    
    const newReward = {
      id: Date.now().toString(),
      name,
      description,
      points,
      image: '🎁', // Default image
      available,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newReward);
  } catch (error) {
    next(error);
  }
};

// Update reward
export const updateReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, points, available } = req.body;
    
    // In a real implementation, this would update the reward in the database
    // For now, we'll just return success
    
    const updatedReward = {
      id,
      name,
      description,
      points,
      available,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json(updatedReward);
  } catch (error) {
    next(error);
  }
};

// Get points history for user
export const getPointsHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real implementation, this would fetch the user's points history from a database
    // For now, we'll return mock data
    
    const history = [
      {
        id: '1',
        type: 'earn',
        points: 100,
        reason: 'Check-in na academia',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        type: 'earn',
        points: 50,
        reason: 'Compartilhamento nas redes sociais',
        timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: '3',
        type: 'redeem',
        points: -500,
        reason: 'Desconto na mensalidade',
        timestamp: new Date(Date.now() - 604800000).toISOString() // 7 days ago
      },
      {
        id: '4',
        type: 'earn',
        points: 200,
        reason: 'Indicação de amigo',
        timestamp: new Date(Date.now() - 1209600000).toISOString() // 14 days ago
      }
    ];
    
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

// Get loyalty program statistics
export const getLoyaltyStats = async (req, res, next) => {
  try {
    // In a real implementation, this would fetch statistics from a database
    // For now, we'll return mock data
    
    const stats = {
      totalPointsIssued: 125000,
      totalPointsRedeemed: 78500,
      activeUsers: 85,
      mostPopularReward: 'Mês Grátis',
      averagePointsPerUser: 1470,
      redemptionRate: 62.8,
      monthlyGrowth: 8.5
    };
    
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};