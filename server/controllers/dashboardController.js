import { supabase } from '../index.js';

// Get dashboard metrics
export const getDashboardMetrics = async (req, res, next) => {
  try {
    // Get active students count
    const { data: activeStudents, error: activeError } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .eq('status', 'Ativo');
    
    if (activeError) throw activeError;
    
    // Get total revenue
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount')
      .gte('paid_date', new Date(new Date().setDate(1)).toISOString()) // Current month
      .lt('paid_date', new Date(new Date().setMonth(new Date().getMonth() + 1, 1)).toISOString());
    
    if (paymentsError) throw paymentsError;
    
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get students at risk count
    const { data: riskStudents, error: riskError } = await supabase
      .from('churn_predictions')
      .select('count', { count: 'exact' })
      .eq('risk_level', 'alto');
    
    if (riskError) throw riskError;
    
    // Get average attendance
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .gte('date', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()); // Last 30 days
    
    if (attendanceError) throw attendanceError;
    
    // Calculate average attendance (simplified)
    const averageAttendance = Math.round(attendance.length / 30);
    
    res.status(200).json({
      activeStudents: activeStudents.count,
      totalRevenue,
      riskStudents: riskStudents.count,
      averageAttendance
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance data
export const getAttendanceData = async (req, res, next) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    // Calculate start date based on period
    switch (period) {
      case '7d':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
    }
    
    // Get attendance data
    const { data, error } = await supabase
      .from('attendance')
      .select('date, class_type')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());
    
    if (error) throw error;
    
    // Process data for chart
    const attendanceByDay = {};
    
    data.forEach(record => {
      const date = new Date(record.date).toISOString().split('T')[0];
      if (!attendanceByDay[date]) {
        attendanceByDay[date] = 0;
      }
      attendanceByDay[date]++;
    });
    
    // Convert to array format for frontend
    const chartData = Object.keys(attendanceByDay).map(date => ({
      date,
      count: attendanceByDay[date]
    }));
    
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};

// Get revenue data
export const getRevenueData = async (req, res, next) => {
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
      .gte('paid_date', startDate.toISOString())
      .lte('paid_date', endDate.toISOString())
      .order('paid_date');
    
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
        month: `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`,
        value: revenueByMonth[monthYear]
      };
    });
    
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};

// Get students at risk
export const getStudentsAtRisk = async (req, res, next) => {
  try {
    // Get students with high risk
    const { data, error } = await supabase
      .from('churn_predictions')
      .select(`
        id,
        user_id,
        churn_probability,
        risk_level,
        factors,
        users:user_id (
          id,
          name,
          email
        )
      `)
      .eq('risk_level', 'alto')
      .order('churn_probability', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get evasion trend
export const getEvasionTrend = async (req, res, next) => {
  try {
    const { period = '6m' } = req.query;
    
    // Mock data for evasion trend
    // In a real implementation, this would query actual cancellation data
    const evasionData = [
      { month: 'Jan', cancelamentos: 5, previsao: 6 },
      { month: 'Fev', cancelamentos: 7, previsao: 6 },
      { month: 'Mar', cancelamentos: 8, previsao: 7 },
      { month: 'Abr', cancelamentos: 6, previsao: 7 },
      { month: 'Mai', cancelamentos: 9, previsao: 8 },
      { month: 'Jun', cancelamentos: null, previsao: 7 },
      { month: 'Jul', cancelamentos: null, previsao: 6 },
    ];
    
    res.status(200).json(evasionData);
  } catch (error) {
    next(error);
  }
};

// Get gender distribution
export const getGenderDistribution = async (req, res, next) => {
  try {
    // Get gender distribution
    const { data, error } = await supabase
      .from('users')
      .select('gender');
    
    if (error) throw error;
    
    // Count genders
    const genderCounts = data.reduce((counts, user) => {
      const gender = user.gender || 'Não informado';
      counts[gender] = (counts[gender] || 0) + 1;
      return counts;
    }, {});
    
    // Convert to array format for frontend
    const chartData = Object.keys(genderCounts).map(gender => ({
      name: gender,
      value: genderCounts[gender]
    }));
    
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};

// Get age distribution
export const getAgeDistribution = async (req, res, next) => {
  try {
    // Get age data
    const { data, error } = await supabase
      .from('users')
      .select('age');
    
    if (error) throw error;
    
    // Define age ranges
    const ageRanges = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46+': 0
    };
    
    // Count ages by range
    data.forEach(user => {
      if (!user.age) return;
      
      if (user.age >= 18 && user.age <= 25) {
        ageRanges['18-25']++;
      } else if (user.age >= 26 && user.age <= 35) {
        ageRanges['26-35']++;
      } else if (user.age >= 36 && user.age <= 45) {
        ageRanges['36-45']++;
      } else if (user.age >= 46) {
        ageRanges['46+']++;
      }
    });
    
    // Convert to array format for frontend
    const chartData = Object.keys(ageRanges).map(range => ({
      name: range,
      value: ageRanges[range]
    }));
    
    res.status(200).json(chartData);
  } catch (error) {
    next(error);
  }
};

// Get custom dashboard data
export const getCustomDashboardData = async (req, res, next) => {
  try {
    const { startDate, endDate, metrics } = req.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    // Initialize result object
    const result = {};
    
    // Process each requested metric
    for (const metric of metrics) {
      switch (metric) {
        case 'revenue':
          // Get revenue data for the period
          const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('amount, paid_date')
            .gte('paid_date', start.toISOString())
            .lte('paid_date', end.toISOString());
          
          if (paymentsError) throw paymentsError;
          
          result.revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
          break;
          
        case 'newStudents':
          // Get new students count for the period
          const { data: newStudents, error: newStudentsError } = await supabase
            .from('users')
            .select('count', { count: 'exact' })
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());
          
          if (newStudentsError) throw newStudentsError;
          
          result.newStudents = newStudents.count;
          break;
          
        case 'attendance':
          // Get attendance data for the period
          const { data: attendance, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .gte('date', start.toISOString())
            .lte('date', end.toISOString());
          
          if (attendanceError) throw attendanceError;
          
          result.attendance = attendance.length;
          break;
          
        // Add more metrics as needed
        
        default:
          // Skip unknown metrics
          break;
      }
    }
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Update dashboard configuration
export const updateDashboardConfiguration = async (req, res, next) => {
  try {
    const { defaultMetrics, refreshInterval } = req.body;
    
    // In a real implementation, this would update a configuration in the database
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Dashboard configuration updated successfully',
      config: {
        defaultMetrics,
        refreshInterval
      }
    });
  } catch (error) {
    next(error);
  }
};