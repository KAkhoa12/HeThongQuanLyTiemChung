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

  // Load cart từ localStorage lần đầu
  useEffect(() => {
    if (globalCartItems.length === 0) {
      const savedCart = localStorage.getItem('vaccineCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          globalCartItems = parsedCart.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          notifyListeners();
        } catch (error) {
          console.error('Failed to parse cart:', error);
        }
      }
    }

    // Load service types lần đầu
    if (globalServiceTypes.length === 0) {
      getAllServiceTypesNoPage().then(types => {
        globalServiceTypes = types || [];
        notifyListeners();
      });
    }
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

    const existingItem = globalCartItems.find(item => item.service.id === service.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      globalCartItems.push({
        service: serviceWithTypeName,
        quantity: 1,
        addedAt: new Date()
      });
    }

    localStorage.setItem('vaccineCart', JSON.stringify(globalCartItems));
    notifyListeners();
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

  return {
    cartItems: globalCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };
}; 