import { supabase } from '../index.js';

// Get all attendance records
export const getAllAttendance = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, startDate, endDate } = req.query;
    
    let query = supabase
      .from('attendance')
      .select(`
        *,
        user:user_id (
          id,
          name,
          email
        )
      `)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply date filters if provided
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

// Get attendance by ID
export const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('attendance')
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
        return res.status(404).json({ error: 'Attendance record not found' });
      }
      throw error;
    }
    
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// Get attendance by user ID
export const getUserAttendance = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 30, offset = 0, startDate, endDate } = req.query;
    
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply date filters if provided
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

// Create new attendance record
export const createAttendance = async (req, res, next) => {
  try {
    const { user_id, class_type, duration, date = new Date().toISOString() } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create attendance record
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        user_id,
        class_type,
        duration,
        date
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Update attendance record
export const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { class_type, duration, date } = req.body;
    
    // Update only provided fields
    const updates = {};
    if (class_type !== undefined) updates.class_type = class_type;
    if (duration !== undefined) updates.duration = duration;
    if (date !== undefined) updates.date = date;
    
    // Update attendance record
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

// Delete attendance record
export const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Delete attendance record
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Set default date range to last 30 days if not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end);
    if (!startDate) {
      start.setDate(end.getDate() - 30);
    }
    
    // Get attendance data for the period
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('date', start.toISOString())
      .lte('date', end.toISOString());
    
    if (error) throw error;
    
    // Calculate total attendance
    const totalAttendance = data.length;
    
    // Calculate attendance by class type
    const attendanceByType = data.reduce((acc, record) => {
      const type = record.class_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate attendance by day of week
    const attendanceByDay = data.reduce((acc, record) => {
      const date = new Date(record.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
      return acc;
    }, {});
    
    // Format attendance by day for frontend
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const formattedAttendanceByDay = daysOfWeek.map((day, index) => ({
      day,
      count: attendanceByDay[index] || 0
    }));
    
    // Calculate unique users
    const uniqueUsers = new Set(data.map(record => record.user_id)).size;
    
    // Calculate average attendance per user
    const avgAttendancePerUser = uniqueUsers > 0 ? totalAttendance / uniqueUsers : 0;
    
    res.status(200).json({
      totalAttendance,
      attendanceByType,
      attendanceByDay: formattedAttendanceByDay,
      uniqueUsers,
      avgAttendancePerUser: parseFloat(avgAttendancePerUser.toFixed(2))
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance heatmap data
export const getAttendanceHeatmap = async (req, res, next) => {
  try {
    // Get attendance data for the last 7 days
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);
    
    const { data, error } = await supabase
      .from('attendance')
      .select('date, class_type')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());
    
    if (error) throw error;
    
    // Define time slots
    const timeSlots = ['06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h'];
    
    // Initialize heatmap data structure
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const heatmapData = daysOfWeek.map(day => {
      const dayData = { name: day };
      timeSlots.forEach(slot => {
        dayData[slot] = 0;
      });
      return dayData;
    });
    
    // Process attendance data
    data.forEach(record => {
      const date = new Date(record.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to match our array (0 = Monday)
      
      const hour = date.getHours();
      let timeSlot;
      
      if (hour >= 5 && hour < 7) timeSlot = '06h';
      else if (hour >= 7 && hour < 9) timeSlot = '08h';
      else if (hour >= 9 && hour < 11) timeSlot = '10h';
      else if (hour >= 11 && hour < 13) timeSlot = '12h';
      else if (hour >= 13 && hour < 15) timeSlot = '14h';
      else if (hour >= 15 && hour < 17) timeSlot = '16h';
      else if (hour >= 17 && hour < 19) timeSlot = '18h';
      else if (hour >= 19 && hour < 21) timeSlot = '20h';
      else return; // Skip if outside our time slots
      
      // Increment the count for this day and time slot
      heatmapData[dayIndex][timeSlot]++;
    });
    
    // Convert counts to percentages (assuming max capacity of 20 per slot)
    const maxCapacity = 20;
    heatmapData.forEach(day => {
      timeSlots.forEach(slot => {
        day[slot] = Math.round((day[slot] / maxCapacity) * 100);
      });
    });
    
    res.status(200).json(heatmapData);
  } catch (error) {
    next(error);
  }
};

// Check in user
export const checkInUser = async (req, res, next) => {
  try {
    const { user_id, class_type } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create attendance record
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        user_id,
        class_type,
        duration: 60, // Default duration in minutes
        date: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      message: 'Check-in successful',
      attendance: data[0]
    });
  } catch (error) {
    next(error);
  }
};

// Generate QR code for check-in
export const generateQRCode = async (req, res, next) => {
  try {
    // In a real implementation, this would generate a QR code
    // For now, we'll just return a mock URL
    
    const qrCodeData = {
      type: 'check-in',
      timestamp: new Date().toISOString(),
      expiry: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes expiry
    };
    
    // In a real implementation, this would be signed with a secret key
    const qrCodeUrl = `https://api.example.com/attendance/qr?data=${encodeURIComponent(JSON.stringify(qrCodeData))}`;
    
    res.status(200).json({
      qrCodeUrl,
      expiresAt: qrCodeData.expiry
    });
  } catch (error) {
    next(error);
  }
};