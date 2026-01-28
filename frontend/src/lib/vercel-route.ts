// Utility script for handling Vercel function routing
// This helper ensures that API requests are correctly routed 
// whether running locally or on Vercel's edge network

const isProduction = import.meta.env.PROD;

// When deployed to Vercel, the backend might be on a different URL
// or routed via rewrites in vercel.json
const VERCEL_BACKEND_URL = import.meta.env.VITE_API_URL || '/api';
const LOCAL_BACKEND_URL = 'http://localhost:4000/api/v1';

export const getApiRoute = (endpoint: string): string => {
  const baseUrl = isProduction ? VERCEL_BACKEND_URL : LOCAL_BACKEND_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Example usage:
// const loginUrl = getApiRoute('/auth/login');
