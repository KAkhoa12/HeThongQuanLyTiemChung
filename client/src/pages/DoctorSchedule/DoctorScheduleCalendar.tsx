import React, { useState, useMemo } from 'react';
import { DoctorSchedule, Doctor, Appointment } from '../../interfaces/doctorSchedule.interface';

interface DoctorScheduleCalendarProps {
  schedules: DoctorSchedule[];
  appointments: Appointment[];
  doctors: Doctor[];
  onDateSelect: (date: Date) => void;
  onDoctorSelect: (doctorId: string) => void;
}

const DoctorScheduleCalendar: React.FC<DoctorScheduleCalendarProps> = ({
  schedules,
  appointments,
  doctors,
  onDateSelect,
  onDoctorSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  // Filter schedules by selected doctor
  const filteredSchedules = useMemo(() => {
    if (!selectedDoctor) return schedules;
    return schedules.filter(schedule => schedule.doctorId === selectedDoctor);
  }, [schedules, selectedDoctor]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const daySchedules = filteredSchedules.filter(schedule => 
      schedule.date === dateStr
    );
    
    const dayAppointments = appointments.filter(appointment => 
      appointment.appointmentDate === dateStr
    );

    return { schedules: daySchedules, appointments: dayAppointments };
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lịch Bác Sĩ
          </h2>
          
          {/* Doctor Filter */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Tất cả bác sĩ</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Hôm nay
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Month Display */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {formatDate(currentMonth)}
        </h3>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div
            key={day}
            className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((date, index) => {
          const events = getEventsForDate(date);
          const hasEvents = events.schedules.length > 0 || events.appointments.length > 0;

          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
              className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
              } ${!isCurrentMonth(date) ? 'text-gray-400 dark:text-gray-600' : ''}`}
            >
              {/* Date Number */}
              <div className={`text-sm font-medium mb-1 ${
                isToday(date) ? 'text-blue-600 dark:text-blue-400' : ''
              }`}>
                {date.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {/* Schedules */}
                {events.schedules.map(schedule => (
                  <div
                    key={schedule.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDoctorSelect(schedule.doctorId);
                    }}
                    className="text-xs p-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50"
                    title={`${schedule.doctorName} - ${schedule.startTime} - ${schedule.endTime}`}
                  >
                    <div className="font-medium truncate">{schedule.doctorName}</div>
                    <div className="text-xs opacity-75">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    <div className="text-xs opacity-75">
                      {schedule.currentPatients}/{schedule.maxPatients}
                    </div>
                  </div>
                ))}

                {/* Appointments */}
                {events.appointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                    title={`${appointment.patientName} - ${appointment.appointmentTime}`}
                  >
                    <div className="font-medium truncate">{appointment.patientName}</div>
                    <div className="text-xs opacity-75">{appointment.appointmentTime}</div>
                    <div className="text-xs opacity-75 capitalize">{appointment.status}</div>
                  </div>
                ))}

                {/* Show more indicator if there are many events */}
                {hasEvents && (events.schedules.length + events.appointments.length) > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{(events.schedules.length + events.appointments.length) - 3} nữa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Lịch bác sĩ</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Lịch hẹn</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600 rounded"></div>
          <span className="text-gray-700 dark:text-gray-300">Hôm nay</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleCalendar; 