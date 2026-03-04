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

// Sample proposals matching the dashboard mockup
export const sampleProposals = [
  {
    // Card display fields
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: 'Jonathan & Amandas Wedding Flowers',
    cardImage: 'https://www.figma.com/api/mcp/asset/cd315ad4-2c3a-42b2-9275-48274563c445',
    author: 'Becky Memmo',

    // Form fields - FULLY FILLED OUT (reference proposal) - PROFESSIONAL
    customerName: 'Jonathan & Amanda Smith',
    customerEmail: 'jonathan.amanda@email.com',
    proposalName: 'Jonathan & Amandas - March 26',
    consultationLevel: 'Professional Consultation',
    proposalTemplate: 'Modern Wedding Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-03-19')),
    deliveryDate: Timestamp.fromDate(new Date('2026-03-16')),
    styleNotes: 'Romantic garden theme with soft pastels. Bride loves peonies and garden roses. Ceremony will be outdoors in a vineyard setting.',

    // Inspiration images (from Figma MCP) - cardImage is first/cover image
    inspirationImages: [
      'https://www.figma.com/api/mcp/asset/cd315ad4-2c3a-42b2-9275-48274563c445', // cardImage/cover
      'https://www.figma.com/api/mcp/asset/150bd0b9-1c6d-48e2-82d9-1e4cd77bb1ce',
      'https://www.figma.com/api/mcp/asset/8de135ac-4c96-424e-9e6b-ba805762fed6',
      'https://www.figma.com/api/mcp/asset/1a15fd2d-c784-4e5c-8829-ff60a52fefd4',
    ],

    // Color palette (from Figma MCP)
    colorPalette: ['#f9e8cc', '#f5dbdd', '#fef8df', '#97cce8', '#cee5cb', '#ef865b'],

    // Featured blooms for Professional consultation (from Figma MCP)
    featuredBlooms: [
      {
        name: 'Blue Tinted Roses',
        image: 'https://www.figma.com/api/mcp/asset/19064288-7b83-4ff6-a6b5-1e13aab441cc',
        selectedOption: 0,
        options: [
          { label: '5 Bunches', price: 164.99 },
          { label: '50 Stems', price: 279.99 },
          { label: '100 Stems', price: 354.99 },
        ],
      },
      {
        name: 'Creamy White Bulk Spray Roses',
        image: 'https://www.figma.com/api/mcp/asset/9e870d1a-f9b6-4ca2-b79b-29412df8d8f8',
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 119.99 },
          { label: '50 Stems', price: 279.99 },
          { label: '100 Stems', price: 354.99 },
        ],
      },
      {
        name: 'Silver Dollar Eucalyptus Greens',
        image: 'https://www.figma.com/api/mcp/asset/eac566f3-fad3-4ae4-be93-e7f2a652cc08',
        selectedOption: 0,
        options: [
          { label: '20 Bunches', price: 119.99 },
          { label: '50 Bunches', price: 159.99 },
          { label: '100 Bunches', price: 259.99 },
          { label: '200 Bunches', price: 464.99 },
        ],
      },
    ],

    // Custom floral recipes for Professional consultation (from Figma MCP)
    recipes: [
      {
        id: '1',
        name: 'Brides Bouquet',
        quantity: 1,
        image: 'https://www.figma.com/api/mcp/asset/f00fd4b2-0ab3-481e-91d1-66a201f0abce',
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
        image: 'https://www.figma.com/api/mcp/asset/daa9bbf9-a026-454e-89a4-b541f24a9f6f',
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
        image: 'https://www.figma.com/api/mcp/asset/851c9feb-0c60-4d54-ac1b-538360ee1b9f',
        ingredients: [
          { name: 'Quick Sandroses', count: '1' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/4' },
        ],
      },
      {
        id: '4',
        name: 'Officiant Boutonniere',
        quantity: 1,
        image: 'https://www.figma.com/api/mcp/asset/851c9feb-0c60-4d54-ac1b-538360ee1b9f',
        ingredients: [
          { name: 'Quick Sandroses', count: '1' },
          { name: 'Gunnii Eucalyptus Greens', count: '1/4' },
        ],
      },
      {
        id: '5',
        name: 'Centerpiece Arrangement',
        quantity: 10,
        image: 'https://www.figma.com/api/mcp/asset/5e2cc6c1-7046-43fe-9c63-f9d3a95a942f',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/1ca91548-dda3-4d97-982b-952d863e69a6',
    author: 'Becky Memmo',

    customerName: 'Brittany Johnson',
    customerEmail: 'brittany.j@email.com',
    proposalName: "Brittany's Bach - April 5",
    consultationLevel: 'Basic Consultation',
    proposalTemplate: 'Modern Wedding Consultation',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/6c4108f1-39a0-4e9c-9323-23b67aaae990',
    author: 'Cynthia Paz',

    customerName: 'Callum & Jackie Williams',
    customerEmail: 'callum.jackie@email.com',
    proposalName: "Callum & Jackie's - May 10",
    consultationLevel: 'Professional Consultation',
    proposalTemplate: 'Classic Wedding Consultation',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/e2c6e9ed-17d1-42de-848c-e9c03958fbae',
    author: 'Becky Memmo',

    customerName: 'Maria Garcia (Mother)',
    customerEmail: 'maria.garcia@email.com',
    proposalName: "Tiffany's Quince - June 15",
    consultationLevel: 'Basic Consultation',
    proposalTemplate: 'Quinceañera Consultation',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/c73da2b9-f214-4456-8e7b-657c00b9d0f1',
    author: 'Adelena Whittaker',

    customerName: 'Michael & Sarah Kowalski',
    customerEmail: 'kowalski.wedding@email.com',
    proposalName: 'Kowalski Wedding - July 4',
    consultationLevel: 'Professional Consultation',
    proposalTemplate: 'Modern Wedding Consultation',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/2a79e4d7-51da-40d0-968f-73e270b863cf',
    author: 'Mari Ramos',

    customerName: 'Beth & David Goldstein',
    customerEmail: 'beth.goldstein@email.com',
    proposalName: 'Goldstein Tropical - August 22',
    consultationLevel: 'Professional Consultation',
    proposalTemplate: 'Modern Wedding Consultation',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/bc7a18cb-3e8e-4504-a923-752bade2a7ae',
    author: 'Adelena Whittaker',

    customerName: 'Raj & Priya Patel',
    customerEmail: 'patel.wedding@email.com',
    proposalName: 'Patel Wedding - September 5',
    consultationLevel: 'Professional Consultation',
    proposalTemplate: 'Classic Wedding Consultation',
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
    cardImage: 'https://www.figma.com/api/mcp/asset/5d50eef7-8bb8-4a4c-a0bf-28d30230f486',
    author: 'Camille Lemons',

    customerName: 'Jessica Singer',
    customerEmail: 'jessica.singer@email.com',
    proposalName: 'Singer Baby Shower - October 10',
    consultationLevel: 'Basic Consultation',
    proposalTemplate: 'Baby Shower Consultation',
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
