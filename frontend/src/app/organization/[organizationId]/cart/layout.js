"use client"
import { useParams } from 'next/navigation';
import { CartContextProvider } from '@/app/context/cartContext';

const CartLayout = ({ children }) => {
  const params = useParams();
  const organizationId = params.organizationId;

  return (
    <CartContextProvider organizationId={organizationId}>
      {children}
    </CartContextProvider>
  );
};

export default CartLayout;

