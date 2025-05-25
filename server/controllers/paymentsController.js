import { supabase } from '../index.js';

// Get all payments
export const getAllPayments = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, status, startDate, endDate } = req.query;
    
    let query = supabase
      .from('payments')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `)
      .order('due_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (startDate) {
      query = query.gte('due_date', new Date(startDate).toISOString());
    }
    
    if (endDate) {
      query = query.lte('due_date', new Date(endDate).toISOString());
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

// Get payment by ID
export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('payments')
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
        return res.status(404).json({ error: 'Payment not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get payments by user ID
export const getUserPayments = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 30, offset = 0 } = req.query;
    
    const { data, error, count } = await supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('due_date', { ascending: false })
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

// Create new payment
export const createPayment = async (req, res, next) => {
  try {
    const { user_id, amount, status, due_date, paid_date } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create payment record
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id,
        amount,
        status,
        due_date,
        paid_date: status === 'pago' ? (paid_date || new Date().toISOString()) : null
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Update payment
export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paid_date, amount } = req.body;
    
    // Prepare update object
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (amount !== undefined) updates.amount = amount;
    
    // If status is changed to 'pago', set paid_date if not provided
    if (status === 'pago') {
      updates.paid_date = paid_date || new Date().toISOString();
    } else if (status === 'pendente' || status === 'atrasado') {
      updates.paid_date = null;
    }
    
    // Update payment record
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Delete payment
export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete payment record
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get payment statistics
export const getPaymentStats = async (req, res, next) => {
  try {
    // Get current month's revenue
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const nextMonthStart = new Date(currentMonthStart);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
    
    const { data: currentMonthPayments, error: currentMonthError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'pago')
      .gte('paid_date', currentMonthStart.toISOString())
      .lt('paid_date', nextMonthStart.toISOString());
    
    if (currentMonthError) throw currentMonthError;
    
    const currentMonthRevenue = currentMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get previous month's revenue for comparison
    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    
    const { data: previousMonthPayments, error: previousMonthError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'pago')
      .gte('paid_date', previousMonthStart.toISOString())
      .lt('paid_date', currentMonthStart.toISOString());
    
    if (previousMonthError) throw previousMonthError;
    
    const previousMonthRevenue = previousMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate percentage change
    const percentageChange = previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 100;
    
    // Get pending payments
    const { data: pendingPayments, error: pendingError } = await supabase
      .from('payments')
      .select('count', { count: 'exact' })
      .eq('status', 'pendente');
    
    if (pendingError) throw pendingError;
    
    // Get overdue payments
    const { data: overduePayments, error: overdueError } = await supabase
      .from('payments')
      .select('count', { count: 'exact' })
      .eq('status', 'atrasado');
    
    if (overdueError) throw overdueError;
    
    // Get payment success rate
    const { data: allPayments, error: allPaymentsError } = await supabase
      .from('payments')
      .select('status')
      .gte('due_date', previousMonthStart.toISOString());
    
    if (allPaymentsError) throw allPaymentsError;
    
    const paidPayments = allPayments.filter(payment => payment.status === 'pago').length;
    const successRate = allPayments.length > 0
      ? (paidPayments / allPayments.length) * 100
      : 0;
    
    res.status(200).json({
      currentMonthRevenue,
      previousMonthRevenue,
      percentageChange: parseFloat(percentageChange.toFixed(2)),
      pendingPayments: pendingPayments.count,
      overduePayments: overduePayments.count,
      successRate: parseFloat(successRate.toFixed(2))
    });
  } catch (error) {
    next(error);
  }
};

// Get revenue by period
export const getRevenueByPeriod = async (req, res, next) => {
  try {
    const { period = '6m' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    // Calculate start date based on period
    switch (period) {
      case '1m':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3m':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6m':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
    }
    
    // Get payment data
    const { data, error } = await supabase
      .from('payments')
      .select('amount, paid_date')
      .eq('status', 'pago')
      .gte('paid_date', startDate.toISOString())
      .lte('paid_date', endDate.toISOString());
    
    if (error) throw error;
    
    // Process data for chart
    const revenueByMonth = {};
    
    data.forEach(payment => {
      const date = new Date(payment.paid_date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!revenueByMonth[monthYear]) {
        revenueByMonth[monthYear] = 0;
      }
      
      revenueByMonth[monthYear] += payment.amount;
    });
    
    // Convert to array format for frontend
    const chartData = Object.keys(revenueByMonth).map(monthYear => {
      const [year, month] = monthYear.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      return {
        month: `${monthNames[parseInt(month) - 1]}`,
        value: revenueByMonth[monthYear]
      };
    });
    
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};

// Get pending payments
export const getPendingPayments = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const { data, error, count } = await supabase
      .from('payments')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `, { count: 'exact' })
      .in('status', ['pendente', 'atrasado'])
      .order('due_date', { ascending: true })
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

// Send payment reminder
export const sendPaymentReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
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
    
    if (paymentError) {
      if (paymentError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Payment not found' });
      }
      throw paymentError;
    }
    
    // Check if payment is pending or overdue
    if (payment.status === 'pago') {
      return res.status(400).json({ error: 'Cannot send reminder for a paid payment' });
    }
    
    // In a real implementation, this would send an email or notification
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Payment reminder sent successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        dueDate: payment.due_date,
        status: payment.status
      },
      user: {
        id: payment.user.id,
        name: payment.user.name,
        email: payment.user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Process payment
export const processPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    
    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (paymentError) {
      if (paymentError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Payment not found' });
      }
      throw paymentError;
    }
    
    // Check if payment is already paid
    if (payment.status === 'pago') {
      return res.status(400).json({ error: 'Payment has already been processed' });
    }
    
    // Update payment status
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'pago',
        paid_date: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.status(200).json({
      message: 'Payment processed successfully',
      payment: data[0],
      paymentMethod
    });
  } catch (error) {
    next(error);
  }
};