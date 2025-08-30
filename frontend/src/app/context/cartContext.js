"use client"
import { createContext, useContext, useReducer, useEffect } from 'react';
import { getCampaignDesignations, getAllDesignations, getCampaignDetails, getCustomQuestions } from '@/app/services/fetchService';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_AMOUNT: 'UPDATE_AMOUNT',
  UPDATE_DESIGNATION: 'UPDATE_DESIGNATION',
  UPDATE_CUSTOM_RESPONSE: 'UPDATE_CUSTOM_RESPONSE',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial cart state
const initialState = {
  items: [],
  totalAmount: 0,
  organizationId: null,
  loading: false,
  error: null
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const newItem = action.payload;
      console.log('Reducer ADD_TO_CART:', { newItem, currentState: state });
      const existingItemIndex = state.items.findIndex(item => item.campaignId === newItem.campaignId);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        console.log('Updating existing item at index:', existingItemIndex);
        newItems = [...state.items];
        newItems[existingItemIndex] = { ...newItems[existingItemIndex], ...newItem };
      } else {
        // Add new item
        console.log('Adding new item to cart');
        newItems = [...state.items, newItem];
      }
      
      const totalAmount = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      const newState = {
        ...state,
        items: newItems,
        totalAmount,
        organizationId: newItem.organizationId
      };
      
      console.log('New cart state:', newState);
      return newState;
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const newItems = state.items.filter(item => item.campaignId !== action.payload.campaignId);
      const totalAmount = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      return {
        ...state,
        items: newItems,
        totalAmount
      };
    }
    
    case CART_ACTIONS.UPDATE_AMOUNT: {
      const { campaignId, amount } = action.payload;
      const newItems = state.items.map(item =>
        item.campaignId === campaignId ? { ...item, amount } : item
      );
      const totalAmount = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      
      return {
        ...state,
        items: newItems,
        totalAmount
      };
    }
    
    case CART_ACTIONS.UPDATE_DESIGNATION: {
      const { campaignId, designationId } = action.payload;
      const newItems = state.items.map(item =>
        item.campaignId === campaignId ? { ...item, selectedDesignation: designationId } : item
      );
      
      return {
        ...state,
        items: newItems
      };
    }
    
    case CART_ACTIONS.UPDATE_CUSTOM_RESPONSE: {
      const { campaignId, questionId, response } = action.payload;
      const newItems = state.items.map(item => {
        if (item.campaignId === campaignId) {
          return {
            ...item,
            customResponses: {
              ...item.customResponses,
              [questionId]: response
            }
          };
        }
        return item;
      });
      
      return {
        ...state,
        items: newItems
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        totalAmount: 0
      };
    }
    
    case CART_ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }
    
    case CART_ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      };
    }
    
    default:
      return state;
  }
};

// Cart Context Provider
export const CartContextProvider = ({ children, organizationId }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    organizationId
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${organizationId}`);
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          cartData.items.forEach(item => {
            dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: item });
          });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [organizationId]);

  // Save cart to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && state.items.length > 0) {
      const cartData = {
        items: state.items,
        totalAmount: state.totalAmount,
        organizationId: state.organizationId
      };
      console.log('Saving cart to localStorage:', cartData);
      localStorage.setItem(`cart_${organizationId}`, JSON.stringify(cartData));
    }
  }, [state.items, state.totalAmount, organizationId]);

  // Add campaign to cart with full data loading
  const addToCart = async (campaignId, initialAmount = 0) => {
    try {
      console.log('AddToCart called with:', { campaignId, initialAmount, organizationId });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null });

      // Fetch all required data for the campaign
      console.log('Fetching campaign data...');
      const [campaignDetails, campaignDesignations, organizationDesignations, customQuestions] = await Promise.all([
        getCampaignDetails(campaignId),
        getCampaignDesignations(campaignId),
        getAllDesignations(organizationId),
        getCustomQuestions(campaignId)
      ]);

      console.log('Fetched data:', { campaignDetails, campaignDesignations, organizationDesignations, customQuestions });

      const cartItem = {
        campaignId,
        campaignName: campaignDetails.external_name || campaignDetails.internal_name,
        campaignImage: campaignDetails.image,
        amount: initialAmount,
        selectedDesignation: null,
        availableDesignations: campaignDesignations || [],
        organizationDesignations: organizationDesignations || [],
        customQuestions: customQuestions || [],
        customResponses: {},
        organizationId,
        addedAt: new Date().toISOString()
      };

      console.log('Creating cart item:', cartItem);
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: cartItem });
      console.log('Cart item added successfully');
      return cartItem;
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to add campaign to cart' });
      throw error;
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Remove campaign from cart
  const removeFromCart = (campaignId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { campaignId } });
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      const newItems = state.items.filter(item => item.campaignId !== campaignId);
      if (newItems.length === 0) {
        localStorage.removeItem(`cart_${organizationId}`);
      }
    }
  };

  // Update amount for specific campaign
  const updateAmount = (campaignId, amount) => {
    dispatch({ type: CART_ACTIONS.UPDATE_AMOUNT, payload: { campaignId, amount } });
  };

  // Update designation for specific campaign
  const updateDesignation = (campaignId, designationId) => {
    dispatch({ type: CART_ACTIONS.UPDATE_DESIGNATION, payload: { campaignId, designationId } });
  };

  // Update custom question response
  const updateCustomResponse = (campaignId, questionId, response) => {
    dispatch({ type: CART_ACTIONS.UPDATE_CUSTOM_RESPONSE, payload: { campaignId, questionId, response } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cart_${organizationId}`);
    }
  };

  // Check if campaign is in cart
  const isInCart = (campaignId) => {
    return state.items.some(item => item.campaignId === campaignId);
  };

  // Get cart item count
  const getItemCount = () => {
    return state.items.length;
  };

  // Validate cart before checkout
  const validateCart = () => {
    const errors = [];
    
    state.items.forEach(item => {
      if (!item.amount || item.amount <= 0) {
        errors.push(`Please set an amount for ${item.campaignName}`);
      }
      
      // Check for required custom questions
      item.customQuestions.forEach(question => {
        if (question.required && !item.customResponses[question.id]) {
          errors.push(`Please answer the required question for ${item.campaignName}: ${question.question}`);
        }
      });
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const value = {
    // State
    items: state.items,
    totalAmount: state.totalAmount,
    organizationId: state.organizationId,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addToCart,
    removeFromCart,
    updateAmount,
    updateDesignation,
    updateCustomResponse,
    clearCart,
    
    // Utilities
    isInCart,
    getItemCount,
    validateCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};

