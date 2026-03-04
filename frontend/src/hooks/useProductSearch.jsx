import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../lib/api';

const DEBOUNCE_MS = 300;

/**
 * Hook for searching Shopify products via Lambda API
 *
 * @returns {Object} - { searchProducts, getProduct, results, loading, error, clearResults }
 *
 * Usage:
 *   const { searchProducts, results, loading } = useProductSearch();
 *
 *   // Search for products (debounced)
 *   <input onChange={(e) => searchProducts(e.target.value)} />
 *
 *   // Display results
 *   {results.map(product => (
 *     <div key={product.handle}>{product.title}</div>
 *   ))}
 */
export function useProductSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  /**
   * Search products by query (debounced)
   * @param {string} query - Search query (min 2 chars)
   * @param {number} limit - Max results (default 8)
   */
  const searchProducts = useCallback(async (query, limit = 8) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Clear results if query too short
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    // Debounce the search
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}${ENDPOINTS.SEARCH_PRODUCTS}?q=${encodeURIComponent(query.trim())}&limit=${limit}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();
        setResults(data.products || []);
      } catch (err) {
        console.error('Product search error:', err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  /**
   * Get full product details by handle (not debounced)
   * @param {string} handle - Product handle
   * @returns {Promise<Object>} - Full product data with variants
   */
  const getProduct = useCallback(async (handle) => {
    if (!handle) {
      throw new Error('Product handle is required');
    }

    const url = `${API_BASE_URL}${ENDPOINTS.SEARCH_PRODUCTS}/${encodeURIComponent(handle)}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to get product: ${response.status}`);
    }

    return response.json();
  }, []);

  /**
   * Clear search results
   */
  const clearResults = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setResults([]);
    setError(null);
  }, []);

  return {
    searchProducts,
    getProduct,
    results,
    loading,
    error,
    clearResults,
  };
}

/**
 * Format price from cents to dollars
 * @param {number} cents - Price in cents
 * @returns {string} - Formatted price (e.g., "$99.99")
 */
export function formatPrice(cents) {
  if (typeof cents !== 'number') return '';
  return '$' + (cents / 100).toFixed(2);
}
