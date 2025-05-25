import { supabase } from '../index.js';

// Get all classes
export const getAllClasses = async (req, res, next) => {
  try {
    const { type, level, instructor } = req.query;
    
    let query = supabase
      .from('classes')
      .select('*');
    
    // Apply filters if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    if (level) {
      query = query.eq('level', level);
    }
    
    if (instructor) {
      query = query.eq('instructor', instructor);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Since we don't have a real classes table, we'll return mock data
    const mockClasses = [
      {
        id: '1',
        name: 'Spinning',
        instructor: 'Ricardo',
        time: '07:00',
        day: 'seg',
        duration: 45,
        level: 'Intermediário',
        type: 'cardio',
        capacity: 20,
        occupancy: 12
      },
      {
        id: '2',
        name: 'Musculação',
        instructor: 'Ana',
        time: '07:00',
        day: 'ter',
        duration: 60,
        level: 'Iniciante',
        type: 'força',
        capacity: 15,
        occupancy: 8
      },
      {
        id: '3',
        name: 'Yoga',
        instructor: 'Paula',
        time: '08:00',
        day: 'ter',
        duration: 60,
        level: 'Iniciante',
        type: 'flexibilidade',
        capacity: 20,
        occupancy: 15
      },
      {
        id: '4',
        name: 'Funcional',
        instructor: 'Marcos',
        time: '08:00',
        day: 'qua',
        duration: 45,
        level: 'Avançado',
        type: 'resistência',
        capacity: 15,
        occupancy: 10
      },
      {
        id: '5',
        name: 'Boxe',
        instructor: 'Carlos',
        time: '18:00',
        day: 'seg',
        duration: 60,
        level: 'Intermediário',
        type: 'combate',
        capacity: 12,
        occupancy: 7
      },
      {
        id: '6',
        name: 'Dança',
        instructor: 'Juliana',
        time: '18:00',
        day: 'qua',
        duration: 60,
        level: 'Iniciante',
        type: 'ritmo',
        capacity: 25,
        occupancy: 18
      }
    ];
    
    // Apply filters to mock data
    let filteredClasses = mockClasses;
    
    if (type) {
      filteredClasses = filteredClasses.filter(c => c.type.toLowerCase() === type.toLowerCase());
    }
    
    if (level) {
      filteredClasses = filteredClasses.filter(c => c.level === level);
    }
    
    if (instructor) {
      filteredClasses = filteredClasses.filter(c => c.instructor.toLowerCase().includes(instructor.toLowerCase()));
    }
    
    res.status(200).json(filteredClasses);
  } catch (error) {
    next(error);
  }
};

// Get class by ID
export const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Since we don't have a real classes table, we'll return mock data
    const mockClasses = [
      {
        id: '1',
        name: 'Spinning',
        instructor: 'Ricardo',
        time: '07:00',
        day: 'seg',
        duration: 45,
        level: 'Intermediário',
        type: 'cardio',
        capacity: 20,
        occupancy: 12,
        description: 'Aula de ciclismo indoor com música motivacional',
        equipment: ['Bicicleta estacionária', 'Toalha', 'Garrafa de água'],
        playlist: ['Physical - Olivia Newton-John', 'Eye of the Tiger - Survivor', 'Fame - Irene Cara']
      },
      {
        id: '2',
        name: 'Musculação',
        instructor: 'Ana',
        time: '07:00',
        day: 'ter',
        duration: 60,
        level: 'Iniciante',
        type: 'força',
        capacity: 15,
        occupancy: 8,
        description: 'Treino de força com foco em hipertrofia',
        equipment: ['Pesos livres', 'Máquinas', 'Colchonete'],
        playlist: []
      }
    ];
    
    const classData = mockClasses.find(c => c.id === id);
    
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    res.status(200).json(classData);
  } catch (error) {
    next(error);
  }
};

// Create new class
export const createClass = async (req, res, next) => {
  try {
    const { name, instructor, time, day, duration, level, type, capacity, description, equipment } = req.body;
    
    // In a real implementation, this would create a new class in the database
    // For now, we'll just return success
    
    const newClass = {
      id: Date.now().toString(),
      name,
      instructor,
      time,
      day,
      duration,
      level,
      type,
      capacity,
      occupancy: 0,
      description,
      equipment,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
};

// Update class
export const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, instructor, time, day, duration, level, type, capacity, description, equipment } = req.body;
    
    // In a real implementation, this would update the class in the database
    // For now, we'll just return success
    
    const updatedClass = {
      id,
      name,
      instructor,
      time,
      day,
      duration,
      level,
      type,
      capacity,
      description,
      equipment,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
};

// Delete class
export const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would delete the class from the database
    // For now, we'll just return success
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get class schedule
export const getClassSchedule = async (req, res, next) => {
  try {
    // Since we don't have a real classes table, we'll return mock data
    const mockSchedule = [
      { day: 'seg', '06h': null, '08h': 'Spinning', '10h': null, '12h': null, '14h': null, '16h': null, '18h': 'Boxe', '20h': null },
      { day: 'ter', '06h': null, '08h': 'Musculação', '10h': 'Yoga', '12h': null, '14h': null, '16h': null, '18h': null, '20h': null },
      { day: 'qua', '06h': null, '08h': 'Funcional', '10h': null, '12h': null, '14h': null, '16h': null, '18h': 'Dança', '20h': null },
      { day: 'qui', '06h': null, '08h': null, '10h': null, '12h': null, '14h': null, '16h': null, '18h': null, '20h': 'Muay Thai' },
      { day: 'sex', '06h': null, '08h': 'Yoga', '10h': null, '12h': null, '14h': null, '16h': null, '18h': 'Crossfit', '20h': null },
      { day: 'sab', '06h': null, '08h': 'Funcional', '10h': 'Pilates', '12h': null, '14h': null, '16h': null, '18h': null, '20h': null },
      { day: 'dom', '06h': null, '08h': null, '10h': null, '12h': null, '14h': null, '16h': null, '18h': null, '20h': null }
    ];
    
    res.status(200).json(mockSchedule);
  } catch (error) {
    next(error);
  }
};

// Get class attendance
export const getClassAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    // In a real implementation, this would fetch attendance data for the class
    // For now, we'll return mock data
    
    const mockAttendance = [
      { userId: '1', name: 'Ana Silva', checkInTime: '06:55', status: 'present' },
      { userId: '2', name: 'Carlos Oliveira', checkInTime: '07:05', status: 'late' },
      { userId: '3', name: 'Marta Rocha', checkInTime: null, status: 'absent' },
      { userId: '4', name: 'João Souza', checkInTime: '06:50', status: 'present' },
      { userId: '5', name: 'Luiza Costa', checkInTime: '06:58', status: 'present' }
    ];
    
    res.status(200).json({
      classId: id,
      date: date || new Date().toISOString().split('T')[0],
      attendance: mockAttendance,
      stats: {
        total: mockAttendance.length,
        present: mockAttendance.filter(a => a.status === 'present').length,
        late: mockAttendance.filter(a => a.status === 'late').length,
        absent: mockAttendance.filter(a => a.status === 'absent').length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register for class
export const registerForClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real implementation, this would register the user for the class
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Successfully registered for class',
      registration: {
        classId: id,
        userId,
        registeredAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel class registration
export const cancelClassRegistration = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    
    // In a real implementation, this would cancel the user's registration
    // For now, we'll just return success
    
    res.status(200).json({
      message: 'Registration cancelled successfully',
      cancellation: {
        classId: id,
        userId,
        cancelledAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get class statistics
export const getClassStats = async (req, res, next) => {
  try {
    // In a real implementation, this would fetch statistics from a database
    // For now, we'll return mock data
    
    const mockStats = {
      totalClasses: 42,
      averageAttendance: 78,
      mostPopularClass: 'Spinning',
      leastPopularClass: 'Yoga',
      peakHour: '18:00',
      occupancyByDay: [
        { day: 'Seg', value: 78 },
        { day: 'Ter', value: 82 },
        { day: 'Qua', value: 90 },
        { day: 'Qui', value: 85 },
        { day: 'Sex', value: 80 },
        { day: 'Sáb', value: 70 },
        { day: 'Dom', value: 40 }
      ],
      occupancyByType: [
        { type: 'cardio', value: 85 },
        { type: 'força', value: 75 },
        { type: 'flexibilidade', value: 65 },
        { type: 'resistência', value: 80 },
        { type: 'combate', value: 70 },
        { type: 'ritmo', value: 90 }
      ]
    };
    
    res.status(200).json(mockStats);
  } catch (error) {
    next(error);
  }
};