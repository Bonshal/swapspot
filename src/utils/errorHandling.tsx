import { useState, useCallback } from 'react';
import React from 'react';

interface ErrorState {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorState | null>(null);
  
  const handleError = useCallback((err: unknown) => {
    if (typeof err === 'string') {
      setError({ message: err });
    } else if (err instanceof Error) {
      setError({ message: err.message });
    } else if (err && typeof err === 'object' && 'message' in err) {
      setError(err as ErrorState);
    } else {
      setError({ message: 'An unknown error occurred' });
    }
    
    // Log the error for debugging
    console.error('Error caught by handler:', err);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    setError,
    handleError,
    clearError
  };
};

/**
 * Component to display validation errors for form fields
 */
export const FieldError: React.FC<{ error?: string[] }> = ({ error }) => {
  if (!error || error.length === 0) return null;
  
  return (
    <div className="mt-1 text-sm text-red-600">
      {error.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

/**
 * Component to display general error messages
 */
export const ErrorMessage: React.FC<{ message: string; onDismiss?: () => void }> = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};
