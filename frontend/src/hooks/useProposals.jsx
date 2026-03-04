import { useState, useEffect } from 'react';
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

// Hook to fetch all proposals (for dashboard)
export function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
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
        setError(null);
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { proposals, loading, error };
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
        setLoading(true);
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProposal({ id: docSnap.id, ...docSnap.data() });
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
    return docRef.id;
  },

  // Update an existing proposal
  async update(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Delete a proposal
  async delete(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
