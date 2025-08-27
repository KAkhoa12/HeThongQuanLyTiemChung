import React from 'react';
import { useCart } from '../../../hooks/useCart';

const CartIcon: React.FC = () => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <div className="relative">
      <div className="text-2xl cursor-pointer hover:text-blue-600 transition-colors">
        🛒
      </div>
      {itemCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </div>
      )}
    </div>
  );
};

export default CartIcon; 