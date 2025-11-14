import { createContext, useContext, useReducer } from 'react';
import type { CartItem, CartState } from '../types/cart';
import type { Product } from '../types/product';

interface CartContextValue extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const initialState: CartState = { items: [] };

const CartContext = createContext<CartContextValue | undefined>(undefined);

type Action =
  | { type: 'ADD'; product: Product; quantity: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'UPDATE'; productId: string; quantity: number }
  | { type: 'CLEAR' };

const reducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((item) => item.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: Math.min(item.quantity + action.quantity, action.product.stock) }
              : item
          )
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: Math.min(action.quantity, action.product.stock) }]
      };
    }
    case 'REMOVE':
      return { items: state.items.filter((item) => item.product.id !== action.productId) };
    case 'UPDATE':
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: Math.max(1, Math.min(action.quantity, item.product.stock)) }
            : item
        )
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItem = (product: Product, quantity = 1) => dispatch({ type: 'ADD', product, quantity });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE', productId, quantity });
  const clear = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
