// Seed data for proposals collection in Firestore
// Run this once to populate the database with sample proposals

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Type color mapping
const TYPE_COLORS = {
  'Wedding': '#055e5a',
  'Bachelorette': '#3ba59a',
  'Quinceeanera': '#e5c236',
  'Baby Shower': '#e28dd6',
  'Fund Raiser': '#8b5cf6',
};

// Local image paths (served from public folder)
const IMAGES = {
  proposalCards: {
    card1: '/images/proposal-card-1.png',
    card2: '/images/proposal-card-2.png',
    card3: '/images/proposal-card-3.png',
    card4: '/images/proposal-card-4.png',
    card5: '/images/proposal-card-5.png',
    card6: '/images/proposal-card-6.png',
    card7: '/images/proposal-card-7.png',
    card8: '/images/proposal-card-8.png',
  },
  inspiration: {
    img1: '/images/inspiration-1.png',
    img2: '/images/inspiration-2.png',
    img3: '/images/inspiration-3.png',
  },
  recipes: {
    recipe1: '/images/seed-recipe-1.png',
    recipe2: '/images/seed-recipe-2.png',
    recipe3: '/images/seed-recipe-3.png',
    recipe4: '/images/seed-recipe-4.png',
    recipe5: '/images/seed-recipe-5.png',
    recipe6: '/images/seed-recipe-6.png',
    recipe7: '/images/seed-recipe-7.png',
  },
};

// Sample proposals matching the dashboard mockup
export const sampleProposals = [
  {
    // Card display fields
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: 'Jonathan & Amandas Wedding Flowers',
    cardImage: IMAGES.proposalCards.card1,
    author: 'Becky Memmo',

    // Form fields - FULLY FILLED OUT (reference proposal) - PROFESSIONAL
    customerName: 'Jonathan & Amanda Smith',
    customerEmail: 'jonathan.amanda@email.com',
    proposalName: 'Jonathan & Amandas - March 26',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-03-19')),
    deliveryDate: Timestamp.fromDate(new Date('2026-03-16')),
    styleNotes: 'Romantic garden theme with soft pastels. Bride loves peonies and garden roses. Ceremony will be outdoors in a vineyard setting.',

    // Inspiration images - cardImage is first/cover image
    inspirationImages: [
      IMAGES.proposalCards.card1,
      IMAGES.inspiration.img1,
      IMAGES.inspiration.img2,
      IMAGES.inspiration.img3,
    ],

    // Color palette
    colorPalette: ['#f9e8cc', '#f5dbdd', '#fef8df', '#97cce8', '#cee5cb', '#ef865b'],

    // Featured blooms for Professional consultation
    featuredBlooms: [
      {
        name: 'Blue Tinted Roses',
        image: IMAGES.recipes.recipe1,
        selectedOption: 0,
        options: [
          { label: '5 Bunches', price: 164.99 },
          { label: '50 Stems', price: 279.99 },
          { label: '100 Stems', price: 354.99 },
        ],
      },
      {
        name: 'Creamy White Bulk Spray Roses',
        image: IMAGES.recipes.recipe2,
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 119.99 },
          { label: '50 Stems', price: 279.99 },
          { label: '100 Stems', price: 354.99 },
        ],
      },
      {
        name: 'Silver Dollar Eucalyptus Greens',
        image: IMAGES.recipes.recipe3,
        selectedOption: 0,
        options: [
          { label: '20 Bunches', price: 119.99 },
          { label: '50 Bunches', price: 159.99 },
          { label: '100 Bunches', price: 259.99 },
          { label: '200 Bunches', price: 464.99 },
        ],
      },
    ],

    // Custom floral recipes for Professional consultation
    recipes: [
      {
        id: '1',
        name: 'Brides Bouquet',
        quantity: 1,
        image: IMAGES.recipes.recipe4,
        ingredients: [
          { name: 'Quick Sandroses', count: '3' },
          { name: 'Antique Mauve Fresh Cut Rose', count: '1' },
          { name: 'Creamy White Bulk Spray Roses', count: '2' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/2' },
        ],
      },
      {
        id: '2',
        name: 'Bridesmaid Bouquet',
        quantity: 4,
        image: IMAGES.recipes.recipe5,
        ingredients: [
          { name: 'Quick Sandroses', count: '3' },
          { name: 'Antique Mauve Fresh Cut Rose', count: '1' },
          { name: 'Creamy White Bulk Spray Roses', count: '2' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/2' },
        ],
      },
      {
        id: '3',
        name: 'Groomsmen Boutonniere',
        quantity: 4,
        image: IMAGES.recipes.recipe6,
        ingredients: [
          { name: 'Quick Sandroses', count: '1' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/4' },
        ],
      },
      {
        id: '4',
        name: 'Officiant Boutonniere',
        quantity: 1,
        image: IMAGES.recipes.recipe6,
        ingredients: [
          { name: 'Quick Sandroses', count: '1' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/4' },
        ],
      },
      {
        id: '5',
        name: 'Centerpiece Arrangement',
        quantity: 10,
        image: IMAGES.recipes.recipe7,
        ingredients: [
          { name: 'Quick Sandroses', count: '3' },
          { name: 'Antique Mauve Fresh Cut Rose', count: '1' },
          { name: 'Creamy White Bulk Spray Roses', count: '2' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/2' },
        ],
      },
    ],

    updatedAt: Timestamp.fromDate(new Date('2026-03-20')), // Most recent - shows first
    createdAt: Timestamp.fromDate(new Date('2026-02-15')),
  },
  {
    type: 'Bachelorette',
    typeColor: TYPE_COLORS['Bachelorette'],
    eventName: "Brittany's Bachelorette Weekend",
    cardImage: IMAGES.proposalCards.card2,
    author: 'Becky Memmo',

    customerName: 'Brittany Johnson',
    customerEmail: 'brittany.j@email.com',
    proposalName: "Brittany's Bach - April 5",
    consultationLevel: 'Basic Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-04-05')),
    deliveryDate: Timestamp.fromDate(new Date('2026-04-04')),
    styleNotes: 'Fun and flirty vibe. Pink and gold color scheme.',
    colorPalette: ['#ff69b4', '#ffd700', '#fff0f5'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-03-01')),
  },
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: "Callum & Jackie's Wedding Flowers",
    cardImage: IMAGES.proposalCards.card3,
    author: 'Cynthia Paz',

    customerName: 'Callum & Jackie Williams',
    customerEmail: 'callum.jackie@email.com',
    proposalName: "Callum & Jackie's - May 10",
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-05-10')),
    deliveryDate: Timestamp.fromDate(new Date('2026-05-08')),
    styleNotes: 'Elegant and timeless. White and green palette with touches of gold.',
    colorPalette: ['#ffffff', '#228b22', '#ffd700', '#f5f5dc'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-02-20')),
  },
  {
    type: 'Quinceeanera',
    typeColor: TYPE_COLORS['Quinceeanera'],
    eventName: "Tiffany Garcia's 15 Birthday",
    cardImage: IMAGES.proposalCards.card4,
    author: 'Becky Memmo',

    customerName: 'Maria Garcia (Mother)',
    customerEmail: 'maria.garcia@email.com',
    proposalName: "Tiffany's Quince - June 15",
    consultationLevel: 'Basic Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-06-15')),
    deliveryDate: Timestamp.fromDate(new Date('2026-06-14')),
    styleNotes: 'Princess theme with lots of pink and purple. Roses are a must!',
    colorPalette: ['#ff69b4', '#9370db', '#ffffff', '#ffc0cb'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-03-05')),
  },
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: 'Kowalski Wedding Ceremony',
    cardImage: IMAGES.proposalCards.card5,
    author: 'Adelena Whittaker',

    customerName: 'Michael & Sarah Kowalski',
    customerEmail: 'kowalski.wedding@email.com',
    proposalName: 'Kowalski Wedding - July 4',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-07-04')),
    deliveryDate: Timestamp.fromDate(new Date('2026-07-02')),
    styleNotes: 'Patriotic summer wedding. Red, white, and blue with wildflowers.',
    colorPalette: ['#b22234', '#ffffff', '#3c3b6e', '#90ee90'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-02-28')),
  },
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: 'Beth Goldstein Tropical Wedding',
    cardImage: IMAGES.proposalCards.card6,
    author: 'Mari Ramos',

    customerName: 'Beth & David Goldstein',
    customerEmail: 'beth.goldstein@email.com',
    proposalName: 'Goldstein Tropical - August 22',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-08-22')),
    deliveryDate: Timestamp.fromDate(new Date('2026-08-20')),
    styleNotes: 'Beach destination wedding. Tropical flowers, orchids, birds of paradise.',
    colorPalette: ['#ff6f61', '#ffd700', '#00ced1', '#98fb98'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-03-10')),
  },
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: 'Patels Traditional Wedding',
    cardImage: IMAGES.proposalCards.card7,
    author: 'Adelena Whittaker',

    customerName: 'Raj & Priya Patel',
    customerEmail: 'patel.wedding@email.com',
    proposalName: 'Patel Wedding - September 5',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-09-05')),
    deliveryDate: Timestamp.fromDate(new Date('2026-09-03')),
    styleNotes: 'Traditional Indian wedding. Rich reds, oranges, and golds. Marigolds essential.',
    colorPalette: ['#ff4500', '#ffa500', '#ffd700', '#8b0000'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-03-12')),
  },
  {
    type: 'Baby Shower',
    typeColor: TYPE_COLORS['Baby Shower'],
    eventName: 'Singer Modern Baby Shower',
    cardImage: IMAGES.proposalCards.card8,
    author: 'Camille Lemons',

    customerName: 'Jessica Singer',
    customerEmail: 'jessica.singer@email.com',
    proposalName: 'Singer Baby Shower - October 10',
    consultationLevel: 'Basic Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-10-10')),
    deliveryDate: Timestamp.fromDate(new Date('2026-10-09')),
    styleNotes: 'Modern minimalist baby shower. Gender neutral - yellows and greens.',
    colorPalette: ['#f0e68c', '#90ee90', '#ffffff', '#d3d3d3'],
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-03-15')),
  },
];

// Function to seed the database
export async function seedProposals() {
  console.log('Starting to seed proposals...');

  const proposalsRef = collection(db, 'proposals');

  for (const proposal of sampleProposals) {
    try {
      const docRef = await addDoc(proposalsRef, proposal);
      console.log(`Added proposal: ${proposal.eventName} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`Error adding proposal ${proposal.eventName}:`, error);
    }
  }

  console.log('Seeding complete!');
}
