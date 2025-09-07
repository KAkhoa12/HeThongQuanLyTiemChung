import { useApiWithParams } from './useApi';
import { 
  checkOrderEligibility, 
  CheckOrderEligibilityRequest, 
  CheckOrderEligibilityResponse 
} from '../services/order.service';

/**
 * Hook để kiểm tra điều kiện mua đơn hàng
 */
export const useCheckOrderEligibility = () => {
  return useApiWithParams<CheckOrderEligibilityResponse, CheckOrderEligibilityRequest>(
    async (params) => checkOrderEligibility(params),
    null
  );
};