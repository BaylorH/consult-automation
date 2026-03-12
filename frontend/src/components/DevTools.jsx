// DevTools - Development utilities for seeding database
// Only shown in development mode

import { useState } from 'react';
import { seedProposals } from '../data/seedProposals';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function DevTools() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState('');

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const clearAndReseed = async () => {
    if (!confirm('This will DELETE all existing proposals and re-seed with sample data. Continue?')) {
      return;
    }

    setIsSeeding(true);
    setMessage('Clearing existing data...');

    try {
      // Delete all existing proposals
      const snapshot = await getDocs(collection(db, 'proposals'));
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, 'proposals', docSnap.id));
      }
      setMessage('Cleared. Now seeding...');

      // Re-seed
      await seedProposals();

      // Clear session storage cache so dashboard fetches fresh data
      sessionStorage.clear();

      setMessage('Done! Refreshing...');

      // Auto-refresh the page after a brief delay
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 p-3 rounded-lg shadow-lg max-w-xs z-50">
      <p className="font-bold text-yellow-800 text-sm mb-2">Dev Tools</p>
      <button
        onClick={clearAndReseed}
        disabled={isSeeding}
        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm px-3 py-1 rounded"
      >
        {isSeeding ? 'Working...' : 'Clear & Re-seed'}
      </button>
      {message && (
        <p className="text-xs text-yellow-700 mt-2">{message}</p>
      )}
    </div>
  );
}
