// API Configuration for backend services

// BB Dev API Gateway URL (will be updated after deployment)
// For local development, can be overridden with VITE_API_URL env variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-bb-dev.fiftyflowers.com';

// API endpoints
export const ENDPOINTS = {
  SEARCH_PRODUCTS: '/search-products',
};

// Helper for making API requests
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }

  return response.json();
}
