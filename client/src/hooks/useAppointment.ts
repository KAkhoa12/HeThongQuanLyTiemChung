import React from 'react';
import { useApiWithParams } from './useApi';
import { appointmentService, keHoachTiemService, lichHenService, phieuTiemService } from '../services/appointment.service';
import { PagedResultDto } from '../types/common.types';

// Hook cho Appointment Service
export const useAppointments = (params: {
  page?: number;
  pageSize?: number;
  customerId?: string;
  status?: string;
}) => {
  return useApiWithParams<PagedResultDto<any>, typeof params>(
    async (p) => appointmentService.getAppointments(p),
    null
  );
};

export const useAppointmentById = (id: string | null) => {
  return useApiWithParams<any, { id: string }>(
    async (p) => appointmentService.getAppointmentById(p.id),
    id ? { id } : null
  );
};

export const useVaccinationSchedule = (id: string | null) => {
  return useApiWithParams<any, { id: string }>(
    async (p) => appointmentService.getVaccinationSchedule(p.id),
    id ? { id } : null
  );
};

// Hook cho KeHoachTiem Service
export const useKeHoachTiems = (params: {
  page?: number;
  pageSize?: number;
  customerId?: string;
  orderId?: string;
  status?: string;
}) => {
  return useApiWithParams<PagedResultDto<any>, typeof params>(
    async (p) => keHoachTiemService.getKeHoachTiems(p),
    null
  );
};

export const useKeHoachTiemById = (id: string | null) => {
  return useApiWithParams<any, { id: string }>(
    async (p) => keHoachTiemService.getKeHoachTiemById(p.id),
    id ? { id } : null
  );
};

export const useKeHoachTiemsByOrder = (orderId: string | null) => {
  const hook = useApiWithParams<any[], { orderId: string }>(
    async (p) => keHoachTiemService.getByOrder(p.orderId),
    null
  );
  
  // Execute when orderId changes
  React.useEffect(() => {
    if (orderId) {
      hook.execute({ orderId });
    }
  }, [orderId]);
  
  return hook;
};

export const useKeHoachTiemsByCustomer = (customerId: string | null) => {
  const hook = useApiWithParams<any[], { customerId: string }>(
    async (p) => keHoachTiemService.getByCustomer(p.customerId),
    null
  );
  
  React.useEffect(() => {
    if (customerId) {
      hook.execute({ customerId });
    }
  }, [customerId]);
  
  return hook;
};

// Hook cho LichHen Service
export const useLichHens = (params: {
  page?: number;
  pageSize?: number;
  orderId?: string;
  locationId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  return useApiWithParams<PagedResultDto<any>, typeof params>(
    async (p) => lichHenService.getLichHens(p),
    null
  );
};

export const useLichHenById = (id: string | null) => {
  return useApiWithParams<any, { id: string }>(
    async (p) => lichHenService.getLichHenById(p.id),
    id ? { id } : null
  );
};

export const useLichHensByOrder = (orderId: string | null) => {
  const hook = useApiWithParams<any[], { orderId: string }>(
    async (p) => lichHenService.getByOrder(p.orderId),
    null
  );
  
  React.useEffect(() => {
    if (orderId) {
      hook.execute({ orderId });
    }
  }, [orderId]);
  
  return hook;
};

export const useLichHensByLocationAndDate = (locationId: string | null, date: string | null) => {
  const hook = useApiWithParams<any[], { locationId: string; date: string }>(
    async (p) => lichHenService.getByLocationAndDate(p.locationId, p.date),
    null
  );
  
  React.useEffect(() => {
    if (locationId && date) {
      hook.execute({ locationId, date });
    }
  }, [locationId, date]);
  
  return hook;
};

// Hook cho PhieuTiem Service
export const usePhieuTiems = (params: {
  page?: number;
  pageSize?: number;
  customerId?: string;
  doctorId?: string;
  status?: string;
}) => {
  const hook = useApiWithParams<PagedResultDto<any>, typeof params>(
    async (p) => phieuTiemService.getPhieuTiems(p),
    null
  );
  
  React.useEffect(() => {
    if (params && Object.keys(params).length > 0) {
      hook.execute(params);
    }
  }, [params]);
  
  return hook;
};

export const usePhieuTiemById = (id: string | null) => {
  return useApiWithParams<any, { id: string }>(
    async (p) => phieuTiemService.getPhieuTiemById(p.id),
    id ? { id } : null
  );
};

export const usePhieuTiemsByCustomer = (customerId: string | null) => {
  const hook = useApiWithParams<any[], { customerId: string }>(
    async (p) => phieuTiemService.getByCustomer(p.customerId),
    null
  );
  
  React.useEffect(() => {
    if (customerId) {
      hook.execute({ customerId });
    }
  }, [customerId]);
  
  return hook;
};

export const usePhieuTiemsByDoctor = (doctorId: string | null) => {
  const hook = useApiWithParams<any[], { doctorId: string }>(
    async (p) => phieuTiemService.getByDoctor(p.doctorId),
    null
  );
  
  React.useEffect(() => {
    if (doctorId) {
      hook.execute({ doctorId });
    }
  }, [doctorId]);
  
  return hook;
};

// Hook cho các action operations
export const useCreateAppointmentFromOrder = () => {
  return useApiWithParams<string[], any>(
    async (p) => appointmentService.createFromOrder(p),
    null
  );
};

export const useApproveAppointment = () => {
  return useApiWithParams<any, { id: string; request: any }>(
    async (p) => appointmentService.approveAppointment(p.id, p.request),
    null
  );
};

export const useUpdateKeHoachTiemStatus = () => {
  return useApiWithParams<void, { id: string; status: string; note?: string }>(
    async (p) => keHoachTiemService.updateStatus(p.id, p.status, p.note),
    null
  );
};

export const useUpdateLichHenStatus = () => {
  return useApiWithParams<void, { id: string; status: string; note?: string }>(
    async (p) => lichHenService.updateStatus(p.id, p.status, p.note),
    null
  );
};

export const useCreateLichHen = () => {
  return useApiWithParams<string, any>(
    async (p) => lichHenService.createLichHen(p),
    null
  );
};

export const useCreatePhieuTiem = () => {
  return useApiWithParams<string, any>(
    async (p) => phieuTiemService.createPhieuTiem(p),
    null
  );
};

export const useUpdatePhieuTiem = () => {
  return useApiWithParams<void, { id: string; request: any }>(
    async (p) => phieuTiemService.updatePhieuTiem(p.id, p.request),
    null
  );
};

// Hook cho tình trạng tiêm chủng
export const useVaccinationStatus = (customerId: string | null) => {
  return useApiWithParams<any, { customerId: string }>(
    async (p) => appointmentService.getVaccinationStatus(p.customerId),
    customerId ? { customerId } : null
  );
};

// Hook cho lịch tiêm chủng chi tiết
export const useCustomerVaccinationSchedule = (customerId: string | null) => {
  return useApiWithParams<any, { customerId: string }>(
    async (p) => appointmentService.getCustomerVaccinationSchedule(p.customerId),
    customerId ? { customerId } : null
  );
};

// Hook cho tạo phiếu tiêm từ kế hoạch
export const useCreatePhieuTiemFromKeHoach = () => {
  return useApiWithParams<string, any>(
    async (p) => phieuTiemService.createFromKeHoach(p),
    null
  );
};

// Hook cho lấy kế hoạch sẵn sàng tiêm
export const useReadyToVaccinate = (customerId: string | null) => {
  return useApiWithParams<any, { customerId: string }>(
    async (p) => phieuTiemService.getReadyToVaccinate(p.customerId),
    customerId ? { customerId } : null
  );
};