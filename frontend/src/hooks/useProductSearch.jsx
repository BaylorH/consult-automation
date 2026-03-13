import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../lib/api';

const DEBOUNCE_MS = 300;

/**
 * Hook for searching Shopify products via Lambda API
 *
 * Provides two search modes:
 * 1. searchProducts(query) - Text search using Shopify Predictive Search
 * 2. browseProducts(filters) - Filter search using flowers_view database
 *
 * @returns {Object} - { searchProducts, browseProducts, getProduct, results, loading, error, clearResults }
 *
 * Usage:
 *   const { searchProducts, browseProducts, results, loading } = useProductSearch();
 *
 *   // Text search (debounced)
 *   <input onChange={(e) => searchProducts(e.target.value)} />
 *
 *   // Filter search
 *   browseProducts({ colors: ['Red', 'Pink'], category: 'Focal Flowers' });
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
  const browseAbortController = useRef(null);

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
      setLoading(false);
      return;
    }

    // Set loading immediately so UI shows "Searching..." during debounce
    setLoading(true);

    // Debounce the search
    debounceTimer.current = setTimeout(async () => {
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
   * Browse products by filters using flowers_view database (not debounced)
   * @param {Object} filters - Filter criteria
   * @param {string[]} filters.colors - Array of color names (e.g., ["Red", "Pink"])
   * @param {string} filters.category - Category name (e.g., "Focal Flowers")
   * @param {string} filters.flowerType - Flower type (e.g., "Roses Standard")
   * @param {number} limit - Max results (default 12)
   */
  const browseProducts = useCallback(async (filters, limit = 12) => {
    // Cancel any pending browse request
    if (browseAbortController.current) {
      browseAbortController.current.abort();
    }

    // Validate we have at least one filter
    const { colors = [], category, flowerType } = filters;
    if (colors.length === 0 && !category && !flowerType) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    browseAbortController.current = new AbortController();

    try {
      const url = `${API_BASE_URL}${ENDPOINTS.SEARCH_PRODUCTS}/filter`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...filters, limit }),
        signal: browseAbortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Filter search failed: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.products || []);
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') return;

      console.error('Browse products error:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
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
    browseProducts,
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
