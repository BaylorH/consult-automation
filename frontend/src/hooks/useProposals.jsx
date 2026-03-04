import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'proposals';
const CACHE_PREFIX = 'proposal_cache_';
const CACHE_LIST_KEY = 'proposals_list_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Session storage helpers
const getCache = (key) => {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCache = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Session storage full or unavailable
  }
};

const invalidateCache = (id) => {
  sessionStorage.removeItem(CACHE_LIST_KEY);
  if (id) sessionStorage.removeItem(CACHE_PREFIX + id);
};

// Minimum loading time for smooth UX (ms)
const MIN_LOADING_TIME = 1200;

// Hook to fetch all proposals (for dashboard)
export function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProposals = useCallback(async (skipCache = false) => {
    const startTime = Date.now();

    try {
      // Check cache first
      if (!skipCache) {
        const cached = getCache(CACHE_LIST_KEY);
        if (cached) {
          setProposals(cached);
          // Still show loading for minimum time even with cache
          const elapsed = Date.now() - startTime;
          const remaining = MIN_LOADING_TIME - elapsed;
          if (remaining > 0) {
            await new Promise(resolve => setTimeout(resolve, remaining));
          }
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProposals(data);
      setCache(CACHE_LIST_KEY, data);
      setError(null);

      // Ensure minimum loading time
      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADING_TIME - elapsed;
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Refresh function to force re-fetch
  const refresh = useCallback(() => fetchProposals(true), [fetchProposals]);

  return { proposals, loading, error, refresh };
}

// Hook to fetch a single proposal by ID (for edit form)
export function useProposal(id) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === 'new') {
      setProposal(null);
      setLoading(false);
      return;
    }

    const fetchProposal = async () => {
      try {
        // Check cache first
        const cached = getCache(CACHE_PREFIX + id);
        if (cached) {
          setProposal(cached);
          setLoading(false);
          return;
        }

        setLoading(true);
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProposal(data);
          setCache(CACHE_PREFIX + id, data);
          setError(null);
        } else {
          setError('Proposal not found');
          setProposal(null);
        }
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  return { proposal, loading, error };
}

// Service functions for CRUD operations
export const proposalService = {
  // Create a new proposal
  async create(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    invalidateCache(); // Clear list cache
    return docRef.id;
  },

  // Update an existing proposal
  async update(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    invalidateCache(id); // Clear both list and specific proposal cache
    // Update the cache with new data immediately
    const cached = getCache(CACHE_PREFIX + id);
    if (cached) {
      setCache(CACHE_PREFIX + id, { ...cached, ...data, updatedAt: new Date() });
    }
  },

  // Delete a proposal
  async delete(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    invalidateCache(id);
  }
};
