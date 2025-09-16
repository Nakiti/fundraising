"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { getCampaignService, getDesignationService } from '@/app/services';

const CartContext = createContext();
const calculateTotalAmount = (items) => {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
};

// Cart Context Provider
export const CartContextProvider = ({ children, organizationId }) => {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from localStorage on mount or organization change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${organizationId}`);
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          const loadedItems = Array.isArray(cartData.items) ? cartData.items : [];
          setItems(loadedItems);
          setTotalAmount(calculateTotalAmount(loadedItems));
        } catch (err) {
          console.error('Error loading cart from localStorage:', err);
        }
      } else {
        // Reset if no saved cart for this org
        setItems([]);
        setTotalAmount(0);
      }
    }
  }, [organizationId]);

  // Save cart to localStorage when items/total change
  useEffect(() => {
    if (typeof window !== 'undefined' && items.length > 0) {
      const cartData = {
        items,
        totalAmount,
        organizationId
      };
      console.log('Saving cart to localStorage:', cartData);
      localStorage.setItem(`cart_${organizationId}`, JSON.stringify(cartData));
    }
  }, [items, totalAmount, organizationId]);

  // Add campaign to cart with full data loading
  const addToCart = async (campaignId, initialAmount = 0) => {
    try {
      console.log('AddToCart called with:', { campaignId, initialAmount, organizationId });
      setLoading(true);
      setError(null);

      // Fetch all required data for the campaign
      console.log('Fetching campaign data...');
      const campaignService = getCampaignService();
      const designationService = getDesignationService();
      
      // Use org designations endpoint and unwrap service responses consistently
      const [campaignDetailsResp, campaignDesignationsResp, organizationDesignationsResp, customQuestions] = await Promise.all([
        campaignService.getCampaignDetails(campaignId),
        campaignService.getCampaignDesignations(campaignId),
        designationService.getDesignationsByOrganization(organizationId),
        campaignService.getCustomQuestions(campaignId)
      ]);

      // Unwrap data payloads (BaseService.get returns { success, data, ... })
      const campaignDetails = campaignDetailsResp?.data ?? campaignDetailsResp ?? {};
      const campaignDesignations = campaignDesignationsResp?.data ?? campaignDesignationsResp ?? [];
      const organizationDesignations = organizationDesignationsResp?.data ?? organizationDesignationsResp ?? [];

      console.log('Fetched data:', { campaignDetails, campaignDesignations, organizationDesignations, customQuestions });

      const cartItem = {
        campaignId,
        campaignName: campaignDetails.externalName,
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
      // Merge or add item
      setItems((prev) => {
        const index = prev.findIndex((i) => i.campaignId === campaignId);
        let newItems;
        if (index >= 0) {
          newItems = [...prev];
          newItems[index] = { ...newItems[index], ...cartItem };
        } else {
          newItems = [...prev, cartItem];
        }
        setTotalAmount(calculateTotalAmount(newItems));
        return newItems;
      });
      console.log('Cart item added successfully');
      return cartItem;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add campaign to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove campaign from cart
  const removeFromCart = (campaignId) => {
    setItems((prev) => {
      const newItems = prev.filter(item => item.campaignId !== campaignId);
      setTotalAmount(calculateTotalAmount(newItems));
      // If cart is empty, clear storage
      if (typeof window !== 'undefined' && newItems.length === 0) {
        localStorage.removeItem(`cart_${organizationId}`);
      }
      return newItems;
    });
  };

  // Update amount for specific campaign
  const updateAmount = (campaignId, amount) => {
    setItems((prev) => {
      const newItems = prev.map(item =>
        item.campaignId === campaignId ? { ...item, amount } : item
      );
      setTotalAmount(calculateTotalAmount(newItems));
      return newItems;
    });
  };

  // Update designation for specific campaign
  const updateDesignation = (campaignId, designationId) => {
    setItems((prev) => prev.map(item => (
      item.campaignId === campaignId ? { ...item, selectedDesignation: designationId } : item
    )));
  };

  // Update custom question response
  const updateCustomResponse = (campaignId, questionId, response) => {
    setItems((prev) => prev.map(item => {
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
    }));
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    setTotalAmount(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cart_${organizationId}`);
    }
  };

  // Check if campaign is in cart
  const isInCart = (campaignId) => {
    return items.some(item => item.campaignId === campaignId);
  };

  // Get cart item count
  const getItemCount = () => {
    return items.length;
  };

  // Validate cart before checkout
  const validateCart = () => {
    const errors = [];
    
    items.forEach(item => {
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
    items,
    totalAmount,
    organizationId,
    loading,
    error,
    
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

