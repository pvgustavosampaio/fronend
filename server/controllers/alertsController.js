import { supabase } from '../index.js';

// Get all alerts
export const getAllAlerts = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, status, severity } = req.query;
    
    let query = supabase
      .from('alerts')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (severity) {
      query = query.eq('severity', severity);
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

// Get alert by ID
export const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('alerts')
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
        return res.status(404).json({ error: 'Alert not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get alerts by user ID
export const getUserAlerts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 30, offset = 0, status } = req.query;
    
    let query = supabase
      .from('alerts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
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

// Create new alert
export const createAlert = async (req, res, next) => {
  try {
    const { user_id, severity, message, status = 'pending' } = req.body;
    
    // If user_id is provided, check if user exists
    if (user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user_id)
        .single();
      
      if (userError || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    // Create alert record
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        user_id,
        severity,
        message,
        status
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Update alert
export const updateAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolved_at } = req.body;
    
    // Prepare update object
    const updates = { status };
    
    // If status is changed to 'resolved', set resolved_at if not provided
    if (status === 'resolved') {
      updates.resolved_at = resolved_at || new Date().toISOString();
    }
    
    // Update alert record
    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Delete alert
export const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete alert record
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get alert statistics
export const getAlertStats = async (req, res, next) => {
  try {
    // Get alerts by status
    const { data: statusData, error: statusError } = await supabase
      .from('alerts')
      .select('status');
    
    if (statusError) throw statusError;
    
    // Count alerts by status
    const statusCounts = statusData.reduce((counts, alert) => {
      counts[alert.status] = (counts[alert.status] || 0) + 1;
      return counts;
    }, {});
    
    // Get alerts by severity
    const { data: severityData, error: severityError } = await supabase
      .from('alerts')
      .select('severity');
    
    if (severityError) throw severityError;
    
    // Count alerts by severity
    const severityCounts = severityData.reduce((counts, alert) => {
      counts[alert.severity] = (counts[alert.severity] || 0) + 1;
      return counts;
    }, {});
    
    // Get recent alerts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentAlerts, error: recentError } = await supabase
      .from('alerts')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());
    
    if (recentError) throw recentError;
    
    res.status(200).json({
      total: statusData.length,
      byStatus: {
        pending: statusCounts.pending || 0,
        resolved: statusCounts.resolved || 0,
        dismissed: statusCounts.dismissed || 0
      },
      bySeverity: {
        low: severityCounts.low || 0,
        medium: severityCounts.medium || 0,
        high: severityCounts.high || 0
      },
      recentCount: recentAlerts.length
    });
  } catch (error) {
    next(error);
  }
};

// Generate automatic alerts
export const generateAutomaticAlerts = async (req, res, next) => {
  try {
    const alerts = [];
    
    // Check for users with consecutive absences
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('user_id, date')
      .order('date', { ascending: false });
    
    if (attendanceError) throw attendanceError;
    
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name');
    
    if (usersError) throw usersError;
    
    // Group attendance by user
    const userAttendance = {};
    attendanceData.forEach(record => {
      if (!userAttendance[record.user_id]) {
        userAttendance[record.user_id] = [];
      }
      userAttendance[record.user_id].push(new Date(record.date));
    });
    
    // Check for users with no attendance in the last 14 days
    const now = new Date();
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);
    
    for (const user of users) {
      const userRecords = userAttendance[user.id] || [];
      
      // If user has no attendance records or last attendance is older than 14 days
      if (userRecords.length === 0 || userRecords[0] < fourteenDaysAgo) {
        // Create absence alert
        const { data, error } = await supabase
          .from('alerts')
          .insert({
            user_id: user.id,
            severity: 'medium',
            message: `${user.name} não frequenta a academia há mais de 14 dias`,
            status: 'pending'
          })
          .select();
        
        if (error) throw error;
        
        alerts.push(data[0]);
      }
    }
    
    // Check for overdue payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        id,
        user_id,
        amount,
        due_date,
        users:user_id (
          name
        )
      `)
      .eq('status', 'pendente')
      .lt('due_date', now.toISOString());
    
    if (paymentsError) throw paymentsError;
    
    for (const payment of paymentsData) {
      const dueDate = new Date(payment.due_date);
      const daysPastDue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
      
      if (daysPastDue > 0) {
        // Create payment alert
        const { data, error } = await supabase
          .from('alerts')
          .insert({
            user_id: payment.user_id,
            severity: daysPastDue > 7 ? 'high' : 'medium',
            message: `Pagamento de ${payment.users.name} atrasado há ${daysPastDue} dias (R$ ${payment.amount})`,
            status: 'pending'
          })
          .select();
        
        if (error) throw error;
        
        alerts.push(data[0]);
        
        // Update payment status to 'atrasado'
        await supabase
          .from('payments')
          .update({ status: 'atrasado' })
          .eq('id', payment.id);
      }
    }
    
    res.status(200).json({
      message: 'Automatic alerts generated successfully',
      alertsGenerated: alerts.length,
      alerts
    });
  } catch (error) {
    next(error);
  }
};

// Dismiss multiple alerts
export const dismissMultipleAlerts = async (req, res, next) => {
  try {
    const { alertIds } = req.body;
    
    // Update all alerts to dismissed
    const { data, error } = await supabase
      .from('alerts')
      .update({
        status: 'dismissed',
        resolved_at: new Date().toISOString()
      })
      .in('id', alertIds)
      .select();
    
    if (error) throw error;
    
    res.status(200).json({
      message: 'Alerts dismissed successfully',
      count: data.length,
      alerts: data
    });
  } catch (error) {
    next(error);
  }
};