import React, { useState, useMemo, useEffect } from 'react';
import { DoctorSchedule, Doctor, Appointment } from '../../interfaces/doctorSchedule.interface';
import ScheduleDetailModal from '../../components/DoctorSchedule/ScheduleDetailModal';

interface DoctorScheduleCalendarProps {
  schedules: DoctorSchedule[];
  appointments: Appointment[];
  doctors: Doctor[];
  onDateSelect: (date: Date) => void;
  onDoctorSelect: (doctorId: string) => void;
  onMonthChange?: (fromDate: string, toDate: string) => void;
  onScheduleUpdate?: (updatedSchedule: DoctorSchedule) => void;
}

const DoctorScheduleCalendar: React.FC<DoctorScheduleCalendarProps> = ({
  schedules,
  appointments,
  doctors,
  onDateSelect,
  onDoctorSelect,
  onMonthChange,
  onScheduleUpdate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'year'>('month');
  const [yearView, setYearView] = useState(new Date().getFullYear());
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);

  // Notify parent component when month changes - chỉ khi user click navigation
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    if (onMonthChange) {
      const year = newMonth.getFullYear();
      const month = newMonth.getMonth();
      
      // Mở rộng range để bao gồm cả ngày cuối tháng trước và đầu tháng sau
      const fromDate = new Date(year, month, 1);
      fromDate.setDate(fromDate.getDate() - 7); // Lùi 7 ngày
      
      const toDate = new Date(year, month + 1, 0);
      toDate.setDate(toDate.getDate() + 7); // Tiến 7 ngày
      
      const fromDateStr = fromDate.toISOString().split('T')[0];
      const toDateStr = toDate.toISOString().split('T')[0];
      
             console.log('🔄 Month changed to:', {
         month: year + '-' + (month + 1),
         fromDate: fromDateStr,
         toDate: toDateStr,
         // Debug: Kiểm tra timezone
         fromDateObj: fromDate.toISOString(),
         toDateObj: toDate.toISOString()
       });
      
      onMonthChange(fromDateStr, toDateStr);
    }
  };

  // Filter schedules by selected doctor
  const filteredSchedules = useMemo(() => {
    if (!selectedDoctor) return schedules;
    return schedules.filter(schedule => schedule.doctorId === selectedDoctor);
  }, [schedules, selectedDoctor]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Mở rộng calendar để bao gồm cả ngày cuối tháng và đầu tháng sau
    const extendedLastDay = new Date(lastDay);
    extendedLastDay.setDate(extendedLastDay.getDate() + 7); // Thêm 7 ngày nữa
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    // Tạo calendar với 6 tuần (42 ngày) để đảm bảo hiển thị đầy đủ
    while (days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
         // Debug: Log tóm tắt calendar
     console.log('🔍 Calendar Summary:', {
       month: year + '-' + (month + 1),
       firstDay: firstDay.toLocaleDateString('en-CA'),
       lastDay: lastDay.toLocaleDateString('en-CA'),
       extendedLastDay: extendedLastDay.toLocaleDateString('en-CA'),
       startDate: startDate.toLocaleDateString('en-CA'),
       totalDays: days.length,
       availableSchedules: filteredSchedules.length,
       // Debug: Kiểm tra xem có bao gồm các ngày quan trọng không
       includesAug31: days.some(d => d.toLocaleDateString('en-CA') === '2025-08-31'),
       includesSep01: days.some(d => d.toLocaleDateString('en-CA') === '2025-09-01'),
       includesSep04: days.some(d => d.toLocaleDateString('en-CA') === '2025-09-04')
     });

    return days;
  }, [currentMonth, filteredSchedules]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    // Sử dụng toLocaleDateString để tránh vấn đề timezone
    const dateStr = date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    
    // Debug: Log để kiểm tra date conversion
    if (date.getDate() === 2) { // Chỉ log cho ngày 2 để debug
      console.log('🔍 Debug date 2:', {
        originalDate: date,
        dateStr: dateStr,
        dateISO: date.toISOString(),
        dateLocal: date.toLocaleDateString('en-CA'),
        dateUTC: date.toUTCString(),
        schedules: filteredSchedules.filter(s => s.date === '2025-09-02' || s.date === '2025-08-02')
      });
    }
    
    const daySchedules = filteredSchedules.filter(schedule => {
      const isMatch = schedule.date === dateStr;
      
      // Debug: Log chi tiết để kiểm tra timezone issue
      if (isMatch) {
        console.log('✅ Found schedule for', dateStr, ':', schedule.doctorName);
      } else {
        // Debug: Log để kiểm tra vấn đề timezone
        const scheduleDate = new Date(schedule.date + 'T00:00:00');
        const calendarDate = new Date(date);
        const diffDays = Math.floor((calendarDate.getTime() - scheduleDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (Math.abs(diffDays) <= 1) {
          console.log('⚠️ Timezone issue detected:', {
            scheduleDate: schedule.date,
            calendarDate: dateStr,
            diffDays,
            scheduleDateObj: scheduleDate.toISOString(),
            calendarDateObj: date.toISOString()
          });
        }
      }
      return isMatch;
    });
    
    const dayAppointments = appointments.filter(appointment => 
      appointment.appointmentDate === dateStr
    );

    // Debug: Chỉ log khi có events
    if (daySchedules.length > 0 || dayAppointments.length > 0) {
      console.log('📅 Events for', dateStr, ':', { 
        schedules: daySchedules.length, 
        appointments: dayAppointments.length 
      });
    }

    return { schedules: daySchedules, appointments: dayAppointments };
  };

  // Get location name by ID (if available)
  const getLocationName = () => {
    // This would need to be passed from parent component
    return 'Địa điểm chính';
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    console.log('⬅️ Going to previous month:', newMonth.toISOString().split('T')[0]);
    handleMonthChange(newMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    console.log('➡️ Going to next month:', newMonth.toISOString().split('T')[0]);
    handleMonthChange(newMonth);
  };

  // Navigate to today
  const goToToday = () => {
    console.log('🏠 Going to today:', new Date().toISOString().split('T')[0]);
    handleMonthChange(new Date());
  };

  // Handle schedule click
  const handleScheduleClick = (schedule: DoctorSchedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  // Handle schedule update from modal
  const handleScheduleUpdateModal = (updatedSchedule: DoctorSchedule) => {
    if (onScheduleUpdate) {
      onScheduleUpdate(updatedSchedule);
    }
  };

             // Debug: Log khi component render
     useEffect(() => {
       console.log('🔍 Calendar - Component rendered with:', {
         currentMonth: currentMonth.toLocaleDateString('en-CA'),
         schedulesCount: schedules.length,
         filteredSchedulesCount: filteredSchedules.length,
         selectedDoctor
       });
       
           // Debug: Log tóm tắt schedules
     if (schedules.length > 0) {
       console.log('📋 Schedules Summary:', {
         total: schedules.length,
         dates: schedules.map(s => s.date),
         doctors: [...new Set(schedules.map(s => s.doctorName))]
       });
       
       // Debug: Kiểm tra xem calendar có bao gồm tất cả ngày schedules không
       const calendarDateStrings = calendarDays.map(d => d.toLocaleDateString('en-CA'));
       const missingDates = schedules.filter(s => !calendarDateStrings.includes(s.date));
       
       if (missingDates.length > 0) {
         console.log('⚠️ Missing dates in calendar:', missingDates.map(s => s.date));
       } else {
         console.log('✅ All schedule dates are included in calendar');
       }
     }
    }, [currentMonth, schedules, filteredSchedules, selectedDoctor, calendarDays]);

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lịch Bác Sĩ
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'year'
                    ? 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Năm
              </button>
            </div>
            
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
          {viewMode === 'year' ? (
            <>
              <button
                onClick={() => setYearView(yearView - 1)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              
              <button
                onClick={() => setYearView(new Date().getFullYear())}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Năm nay
              </button>
              
              <button
                onClick={() => setYearView(yearView + 1)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Month/Year Display */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {viewMode === 'year' ? `Năm ${yearView}` : formatDate(currentMonth)}
        </h3>
      </div>

              {/* Calendar Content */}
        {viewMode === 'month' ? (
          /* Month View */
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
              
              // Debug: Log để kiểm tra timezone issue
              if (hasEvents) {
                console.log(`📅 Day ${index} (${date.toLocaleDateString('en-CA')}):`, {
                  schedules: events.schedules.length,
                  appointments: events.appointments.length,
                  // Debug: Kiểm tra date objects
                  dateObj: date.toISOString(),
                  dateLocal: date.toLocaleDateString('en-CA'),
                  dateUTC: date.toUTCString()
                });
              }

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
                          handleScheduleClick(schedule);
                        }}
                        className="text-xs p-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 border-l-2 border-green-500"
                        title={`${schedule.doctorName} - ${schedule.startTime} - ${schedule.endTime} - ${schedule.currentPatients}/${schedule.maxPatients} bệnh nhân`}
                      >
                        <div className="font-medium truncate text-green-900 dark:text-green-100">
                          🏥 {schedule.doctorName} 
                        </div>
                        <div className="text-xs opacity-75 text-green-700 dark:text-green-200">
                          ⏰ {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="text-xs opacity-75 text-green-600 dark:text-green-300">
                          👥 {schedule.currentPatients}/{schedule.maxPatients}
                        </div>
                        <div className="text-xs opacity-75 text-green-600 dark:text-green-300">
                          📍 {getLocationName()}
                        </div>
                      </div>
                    ))}

                    {/* Appointments */}
                    {events.appointments.map(appointment => (
                      <div
                        key={appointment.id}
                        className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded border-l-2 border-blue-500"
                        title={`${appointment.patientName} - ${appointment.appointmentTime} - ${appointment.status}`}
                      >
                        <div className="font-medium truncate text-blue-900 dark:text-blue-100">
                          👤 {appointment.patientName || 'Khách hàng'}
                        </div>
                        <div className="text-xs opacity-75 text-blue-700 dark:text-blue-200">
                          ⏰ {appointment.appointmentTime}
                        </div>
                        <div className="text-xs opacity-75 capitalize text-blue-600 dark:text-blue-300">
                          📋 {appointment.status}
                        </div>
                      </div>
                    ))}

                    {/* Show more indicator if there are many events */}
                    {hasEvents && (events.schedules.length + events.appointments.length) > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center bg-gray-100 dark:bg-gray-700 rounded p-1">
                        +{(events.schedules.length + events.appointments.length) - 3} nữa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
                 ) : viewMode === 'week' ? (
                  <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const date = new Date(currentMonth);
                    date.setDate(currentMonth.getDate() + dayIndex);
                    const events = getEventsForDate(date);
                    const hasEvents = events.schedules.length > 0 || events.appointments.length > 0;
     
                    return (
                      <div
                        key={dayIndex}
                        className={`min-h-[400px] p-3 border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="text-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                          <div className={`text-lg font-semibold ${
                            isToday(date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                          </div>
                          <div className={`text-sm ${
                            isToday(date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className={`text-xs ${
                            isToday(date) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {date.toLocaleDateString('vi-VN', { month: 'short' })}
                          </div>
                        </div>
     
                        <div className="text-center mb-3">
                          <button
                            onClick={() => onDateSelect(date)}
                            className="w-full px-2 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                          >
                            + Thêm lịch
                          </button>
                        </div>
     
                        <div className="space-y-2">
                          {hasEvents ? (
                            <>
                              {/* Schedules */}
                              {events.schedules.map(schedule => (
                                <div
                                  key={schedule.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleScheduleClick(schedule);
                                  }}
                                  className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-green-600 dark:text-green-400">🏥</span>
                                    <span className="text-xs text-green-600 dark:text-green-400">
                                      {schedule.currentPatients}/{schedule.maxPatients}
                                    </span>
                                  </div>
                                  <div className="font-medium text-green-900 dark:text-green-100 truncate mb-1">
                                    {schedule.doctorName}
                                  </div>
                                  <div className="text-green-700 dark:text-green-300 mb-1">
                                    ⏰ {schedule.startTime} - {schedule.endTime}
                                  </div>
                                  <div className="text-green-600 dark:text-green-400">
                                    📍 {getLocationName()}
                                  </div>
                                </div>
                              ))}
     
                              {/* Appointments */}
                              {events.appointments.map(appointment => (
                                <div
                                  key={appointment.id}
                                  className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-blue-600 dark:text-blue-400">👤</span>
                                    <span className={`text-xs px-1 py-0.5 rounded-full ${
                                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                    }`}>
                                      {appointment.status}
                                    </span>
                                  </div>
                                  <div className="font-medium text-blue-900 dark:text-blue-100 truncate mb-1">
                                    {appointment.patientName || 'Khách hàng'}
                                  </div>
                                  <div className="text-blue-700 dark:text-blue-300">
                                    ⏰ {appointment.appointmentTime}
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-xs">
                              Không có lịch
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
         ) : (
           /* Year View - Grid of 12 months */
           <div className="grid grid-cols-3 gap-6">
             {Array.from({ length: 12 }, (_, monthIndex) => {
               const monthDate = new Date(yearView, monthIndex, 1);
               const monthName = monthDate.toLocaleDateString('vi-VN', { month: 'long' });
               const monthSchedules = schedules.filter(schedule => {
                 const scheduleDate = new Date(schedule.date);
                 return scheduleDate.getFullYear() === yearView && scheduleDate.getMonth() === monthIndex;
               });
               
               return (
                 <div
                   key={monthIndex}
                   className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                   onClick={() => {
                     setCurrentMonth(monthDate);
                     setViewMode('month');
                   }}
                 >
                   {/* Month Header */}
                   <div className="text-center mb-3">
                     <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                       {monthName}
                     </h4>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                       {monthSchedules.length} lịch làm việc
                     </p>
                   </div>
                   
                   {/* Month Preview */}
                   <div className="grid grid-cols-7 gap-1 text-xs">
                     {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                       <div key={day} className="text-center text-gray-500 dark:text-gray-400">
                         {day}
                       </div>
                     ))}
                     
                     {/* Generate mini calendar for this month */}
                     {(() => {
                       const firstDay = new Date(yearView, monthIndex, 1);
                       const lastDay = new Date(yearView, monthIndex + 1, 0);
                       const startDate = new Date(firstDay);
                       startDate.setDate(startDate.getDate() - firstDay.getDay());
                       
                       const days = [];
                       const currentDate = new Date(startDate);
                       
                       while (currentDate <= lastDay || days.length < 42) {
                         days.push(new Date(currentDate));
                         currentDate.setDate(currentDate.getDate() + 1);
                       }
                       
                       return days.map((date, dayIndex) => {
                         const isCurrentMonth = date.getMonth() === monthIndex;
                         const hasSchedule = monthSchedules.some(schedule => {
                           const scheduleDate = new Date(schedule.date);
                           return scheduleDate.toDateString() === date.toDateString();
                         });
                         
                         return (
                           <div
                             key={dayIndex}
                             className={`text-center p-1 text-xs ${
                               isCurrentMonth 
                                 ? hasSchedule 
                                   ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-medium' 
                                   : 'text-gray-800 dark:text-white'
                                 : 'text-gray-300 dark:text-gray-600'
                             }`}
                           >
                             {date.getDate()}
                           </div>
                         );
                       });
                     })()}
                   </div>
                   
                   {/* Quick Actions */}
                   <div className="mt-3 text-center">
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         setCurrentMonth(monthDate);
                         setViewMode('month');
                       }}
                       className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                     >
                       Xem chi tiết
                     </button>
                   </div>
                 </div>
               );
             })}
           </div>
         )
         }

      {/* Schedule Detail Modal */}
      <ScheduleDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        schedule={selectedSchedule}
        onScheduleUpdate={handleScheduleUpdateModal}
      />
    </div>
  );
};

export default DoctorScheduleCalendar; 