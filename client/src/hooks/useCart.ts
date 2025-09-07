import { useState, useEffect } from 'react';
import { Service, ServiceType } from '../types/service.types';
import { getAllServiceTypesNoPage } from '../services/service.service';

export interface CartItem {
  service: Service;
  quantity: number;
  addedAt: Date;
}

// Singleton state để đảm bảo tất cả component dùng chung
let globalCartItems: CartItem[] = [];
let globalServiceTypes: ServiceType[] = [];
let globalListeners: (() => void)[] = [];

const notifyListeners = () => {
  globalListeners.forEach(listener => listener());
};

export const useCart = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    globalListeners.push(listener);
    
    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
    };
  }, []);

  // Load cart từ localStorage lần đầu và lắng nghe thay đổi
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('vaccineCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          globalCartItems = parsedCart.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
        } catch (error) {
          console.error('Failed to parse cart:', error);
          globalCartItems = [];
        }
      } else {
        globalCartItems = [];
      }
      notifyListeners();
    };

    // Load cart lần đầu
    loadCart();

    // Lắng nghe sự thay đổi trong localStorage (từ tab khác)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vaccineCart') {
        loadCart();
      }
    };

    // Lắng nghe custom event khi cart bị xóa từ cùng tab
    const handleCartCleared = () => {
      globalCartItems = [];
      notifyListeners();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartCleared', handleCartCleared);

    // Load service types lần đầu
    if (globalServiceTypes.length === 0) {
      getAllServiceTypesNoPage().then(types => {
        globalServiceTypes = types || [];
        notifyListeners();
      });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, []);

  const getServiceTypeName = (typeId: string | undefined) => {
    if (!typeId) return 'Khác';
    const serviceType = globalServiceTypes.find(type => type.id === typeId);
    return serviceType ? serviceType.name : 'Khác';
  };

  const addToCart = (service: Service) => {
    const serviceWithTypeName = {
      ...service,
      serviceTypeName: service.serviceTypeName || getServiceTypeName(service.serviceTypeId)
    };

    // Xóa tất cả dịch vụ cũ và chỉ giữ lại dịch vụ mới
    globalCartItems = [{
      service: serviceWithTypeName,
      quantity: 1,
      addedAt: new Date()
    }];

    localStorage.setItem('vaccineCart', JSON.stringify(globalCartItems));
    notifyListeners();
    return true;
  };

  const removeFromCart = (serviceId: string) => {
    globalCartItems = globalCartItems.filter(item => item.service.id !== serviceId);
    localStorage.setItem('vaccineCart', JSON.stringify(globalCartItems));
    notifyListeners();
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    
    const item = globalCartItems.find(item => item.service.id === serviceId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('vaccineCart', JSON.stringify(globalCartItems));
      notifyListeners();
    }
  };

  const clearCart = () => {
    globalCartItems = [];
    localStorage.setItem('vaccineCart', JSON.stringify(globalCartItems));
    notifyListeners();
  };

  const getCartTotal = () => {
    return globalCartItems.reduce((total, item) => {
      const price = item.service.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return globalCartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (serviceId: string) => {
    return globalCartItems.some(item => item.service.id === serviceId);
  };

  return {
    cartItems: globalCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
  };
}; 