"use client";
import { useEffect, useState } from 'react';
import { initializeServices } from '../services/base/ServiceRegistry';

export default function ServiceInitializer({ children }) {
  const [servicesReady, setServicesReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initServices = async () => {
      try {
        console.log('[ServiceInitializer] Starting service initialization...');
        await initializeServices();
        console.log('[ServiceInitializer] Services initialized successfully');
        setServicesReady(true);
      } catch (err) {
        console.error('[ServiceInitializer] Failed to initialize services:', err);
        setError(err);
      }
    };

    initServices();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Service Initialization Failed</h1>
          <p className="text-red-600 mb-4">Failed to initialize application services.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!servicesReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing services...</p>
        </div>
      </div>
    );
  }

  return children;
}
