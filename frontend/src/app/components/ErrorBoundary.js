"use client";
import React from 'react';

class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { 
         hasError: false, 
         error: null, 
         errorInfo: null,
         retryCount: 0 
      };
   }

   static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      // Log error to console in development
      if (process.env.NODE_ENV === 'development') {
         console.error('Error Boundary caught an error:', error, errorInfo);
      }

      // Log error to external service in production
      if (process.env.NODE_ENV === 'production') {
         // You can send error to your error reporting service here
         // Example: Sentry.captureException(error, { extra: errorInfo });
      }

      this.setState({
         error: error,
         errorInfo: errorInfo
      });
   }

   handleRetry = () => {
      this.setState(prevState => ({
         hasError: false,
         error: null,
         errorInfo: null,
         retryCount: prevState.retryCount + 1
      }));
   };

   handleReset = () => {
      this.setState({
         hasError: false,
         error: null,
         errorInfo: null,
         retryCount: 0
      });
   };

   render() {
      if (this.state.hasError) {
         // Custom fallback UI
         if (this.props.fallback) {
            return this.props.fallback({
               error: this.state.error,
               errorInfo: this.state.errorInfo,
               retry: this.handleRetry,
               reset: this.handleReset,
               retryCount: this.state.retryCount
            });
         }

         // Default fallback UI
         return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                  <div className="text-center">
                     <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg 
                           className="h-6 w-6 text-red-600" 
                           fill="none" 
                           viewBox="0 0 24 24" 
                           stroke="currentColor"
                        >
                           <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                           />
                        </svg>
                     </div>
                     
                     <h2 className="text-lg font-medium text-gray-900 mb-2">
                        Something went wrong
                     </h2>
                     
                     <p className="text-sm text-gray-500 mb-6">
                        We're sorry, but something unexpected happened. Please try again.
                     </p>

                     <div className="space-y-3">
                        <button
                           onClick={this.handleRetry}
                           className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                           Try Again
                        </button>
                        
                        <button
                           onClick={this.handleReset}
                           className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                           Reset
                        </button>
                     </div>

                     {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details className="mt-6 text-left">
                           <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                              Error Details (Development)
                           </summary>
                           <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto">
                              <div className="mb-2">
                                 <strong>Error:</strong>
                                 <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
                              </div>
                              {this.state.errorInfo && (
                                 <div>
                                    <strong>Component Stack:</strong>
                                    <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                                 </div>
                              )}
                           </div>
                        </details>
                     )}
                  </div>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

// Higher-order component for error boundaries
export const withErrorBoundary = (Component, fallback) => {
   return (props) => (
      <ErrorBoundary fallback={fallback}>
         <Component {...props} />
      </ErrorBoundary>
   );
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
   const [error, setError] = React.useState(null);

   const handleError = React.useCallback((error) => {
      console.error('Error caught by useErrorHandler:', error);
      setError(error);
   }, []);

   const clearError = React.useCallback(() => {
      setError(null);
   }, []);

   return { error, handleError, clearError };
};

export default ErrorBoundary;
