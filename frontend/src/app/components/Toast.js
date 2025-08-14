"use client";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Toast context
const ToastContext = createContext();

// Toast types
export const TOAST_TYPES = {
   SUCCESS: 'success',
   ERROR: 'error',
   WARNING: 'warning',
   INFO: 'info'
};

// Toast component
const Toast = ({ id, type, title, message, duration = 5000, onClose }) => {
   const [isVisible, setIsVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsVisible(false);
         setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
   }, [duration, onClose]);

   const getToastStyles = () => {
      const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 transform transition-all duration-300";
      
      if (!isVisible) {
         return `${baseStyles} translate-x-full opacity-0`;
      }
      
      return `${baseStyles} translate-x-0 opacity-100`;
   };

   const getIconStyles = () => {
      switch (type) {
         case TOAST_TYPES.SUCCESS:
            return "text-green-400";
         case TOAST_TYPES.ERROR:
            return "text-red-400";
         case TOAST_TYPES.WARNING:
            return "text-yellow-400";
         case TOAST_TYPES.INFO:
            return "text-blue-400";
         default:
            return "text-gray-400";
      }
   };

   const getIcon = () => {
      switch (type) {
         case TOAST_TYPES.SUCCESS:
            return (
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
            );
         case TOAST_TYPES.ERROR:
            return (
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            );
         case TOAST_TYPES.WARNING:
            return (
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
               </svg>
            );
         case TOAST_TYPES.INFO:
            return (
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            );
         default:
            return null;
      }
   };

   return (
      <div className={getToastStyles()}>
         <div className="p-4">
            <div className="flex items-start">
               <div className={`flex-shrink-0 ${getIconStyles()}`}>
                  {getIcon()}
               </div>
               <div className="ml-3 w-0 flex-1 pt-0.5">
                  {title && (
                     <p className="text-sm font-medium text-gray-900">{title}</p>
                  )}
                  {message && (
                     <p className="mt-1 text-sm text-gray-500">{message}</p>
                  )}
               </div>
               <div className="ml-4 flex-shrink-0 flex">
                  <button
                     className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                     }}
                  >
                     <span className="sr-only">Close</span>
                     <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

// Toast container
const ToastContainer = ({ toasts, removeToast }) => {
   return (
      <div className="fixed top-4 right-4 z-50 space-y-4">
         {toasts.map((toast) => (
            <Toast
               key={toast.id}
               {...toast}
               onClose={() => removeToast(toast.id)}
            />
         ))}
      </div>
   );
};

// Toast provider
export const ToastProvider = ({ children }) => {
   const [toasts, setToasts] = useState([]);

   const addToast = useCallback(({ type, title, message, duration }) => {
      const id = Date.now() + Math.random();
      const newToast = { id, type, title, message, duration };
      
      setToasts(prev => [...prev, newToast]);
      
      return id;
   }, []);

   const removeToast = useCallback((id) => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
   }, []);

   const clearToasts = useCallback(() => {
      setToasts([]);
   }, []);

   const showSuccess = useCallback((title, message, duration) => {
      return addToast({ type: TOAST_TYPES.SUCCESS, title, message, duration });
   }, [addToast]);

   const showError = useCallback((title, message, duration) => {
      return addToast({ type: TOAST_TYPES.ERROR, title, message, duration });
   }, [addToast]);

   const showWarning = useCallback((title, message, duration) => {
      return addToast({ type: TOAST_TYPES.WARNING, title, message, duration });
   }, [addToast]);

   const showInfo = useCallback((title, message, duration) => {
      return addToast({ type: TOAST_TYPES.INFO, title, message, duration });
   }, [addToast]);

   const value = {
      toasts,
      addToast,
      removeToast,
      clearToasts,
      showSuccess,
      showError,
      showWarning,
      showInfo,
   };

   return (
      <ToastContext.Provider value={value}>
         {children}
         <ToastContainer toasts={toasts} removeToast={removeToast} />
      </ToastContext.Provider>
   );
};

// Hook to use toast
export const useToast = () => {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error('useToast must be used within a ToastProvider');
   }
   return context;
};

// Higher-order component for automatic error handling
export const withErrorToast = (Component) => {
   return (props) => {
      const { showError } = useToast();
      
      const handleError = (error) => {
         const message = error?.message || 'An unexpected error occurred';
         showError('Error', message);
      };

      return <Component {...props} onError={handleError} />;
   };
};

export default Toast;
