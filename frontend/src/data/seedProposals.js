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
  // Presentation reference images (from Figma)
  presentation: {
    inspiration1: '/images/presentation/inspiration-1.png',
    inspiration2: '/images/presentation/inspiration-2.png',
    inspiration3: '/images/presentation/inspiration-3.png',
    inspiration4: '/images/presentation/inspiration-4.png',
    bloom1: '/images/presentation/bloom-01.png',
    bloom2: '/images/presentation/bloom-02.png',
    bloom3: '/images/presentation/bloom-03.png',
    bloom4: '/images/presentation/bloom-04.png',
    bloom5: '/images/presentation/bloom-05.png',
    bloom6: '/images/presentation/bloom-06.png',
    bloom7: '/images/presentation/bloom-07.png',
    bloom8: '/images/presentation/bloom-08.png',
    bloom9: '/images/presentation/bloom-09.png',
    bloom10: '/images/presentation/bloom-10.png',
    bloom11: '/images/presentation/bloom-11.png',
    bloom12: '/images/presentation/bloom-12.png',
    bloom13: '/images/presentation/bloom-13.png',
    bloom14: '/images/presentation/bloom-14.png',
    bloom15: '/images/presentation/bloom-15.png',
    recipeBridal: '/images/presentation/recipe-bride-bouquet.png',
    recipeBridesmaids: '/images/presentation/recipe-bridesmaid.png',
    recipeBoutonniere: '/images/presentation/recipe-boutonniere.png',
    recipeCenterpiece: '/images/presentation/recipe-centerpiece.png',
  },
};

// Sample proposals matching the dashboard mockup
export const sampleProposals = [
  // ============================================
  // REFERENCE PROPOSAL: Lucia & Gabby (from Figma presentation)
  // This is the "ideal" proposal that matches our presentation design
  // Author: Baylor Harrison (dev account)
  // ============================================
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: "Lucia and Gabby said 'I Do'",
    cardImage: IMAGES.presentation.inspiration1,
    author: 'Baylor Harrison',

    // Form fields
    customerName: 'Lucia & Gabby Martinez-Chen',
    customerEmail: 'lucia.gabby@email.com',
    proposalName: 'Lucia & Gabby Wedding - March 2026',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-03-28')),
    deliveryDate: Timestamp.fromDate(new Date('2026-03-26')),
    styleNotes: 'Colorful garden wedding with a mix of bold and soft tones. Love ranunculus, anemones, and garden roses. Outdoor ceremony in a greenhouse setting with rustic barn reception.',

    // Inspiration images (4 images matching presentation)
    inspirationImages: [
      IMAGES.presentation.inspiration1,
      IMAGES.presentation.inspiration2,
      IMAGES.presentation.inspiration3,
      IMAGES.presentation.inspiration4,
    ],

    // Color palette (6 colors from presentation)
    colorPalette: ['#E8D4A8', '#F5C6CB', '#FFF3CD', '#9DD4F0', '#C8E6C9', '#FF8A65'],

    // Featured blooms with product handles for linking
    // These are the "palette" of products available for recipes
    featuredBlooms: [
      {
        name: 'Orange Ranunculus',
        productHandle: 'orange-ranunculus-flower',
        image: IMAGES.presentation.bloom1,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '30 Stems', price: 89.99 },
          { label: '60 Stems', price: 149.99 },
          { label: '100 Stems', price: 219.99 },
        ],
      },
      {
        name: 'Yellow Lisianthus',
        productHandle: 'yellow-lisianthus-flower',
        image: IMAGES.presentation.bloom2,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 79.99 },
          { label: '40 Stems', price: 139.99 },
        ],
      },
      {
        name: 'Yellow Button Mums',
        productHandle: 'yellow-button-mums',
        image: IMAGES.presentation.bloom3,
        category: 'Filler Flowers',
        selectedOption: 0,
        options: [
          { label: '14 Bunches', price: 99.99 },
          { label: '28 Bunches', price: 179.99 },
        ],
      },
      {
        name: 'Peach Garden Roses',
        productHandle: 'peach-garden-roses',
        image: IMAGES.presentation.bloom4,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '24 Stems', price: 119.99 },
          { label: '48 Stems', price: 219.99 },
        ],
      },
      {
        name: 'Yellow Poppies',
        productHandle: 'yellow-poppy-flower',
        image: IMAGES.presentation.bloom5,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '40 Stems', price: 89.99 },
          { label: '80 Stems', price: 159.99 },
        ],
      },
      {
        name: 'White Delphinium',
        productHandle: 'white-delphinium-flower',
        image: IMAGES.presentation.bloom6,
        category: 'Line Flowers',
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 79.99 },
          { label: '40 Stems', price: 149.99 },
        ],
      },
      {
        name: 'Purple Asters',
        productHandle: 'purple-aster-flower',
        image: IMAGES.presentation.bloom7,
        category: 'Filler Flowers',
        selectedOption: 0,
        options: [
          { label: '14 Bunches', price: 69.99 },
          { label: '28 Bunches', price: 129.99 },
        ],
      },
      {
        name: 'Magenta Allium',
        productHandle: 'magenta-allium-flower',
        image: IMAGES.presentation.bloom8,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '30 Stems', price: 99.99 },
          { label: '60 Stems', price: 179.99 },
        ],
      },
      {
        name: 'Pink Ranunculus',
        productHandle: 'pink-ranunculus-flower',
        image: IMAGES.presentation.bloom9,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '30 Stems', price: 89.99 },
          { label: '60 Stems', price: 149.99 },
        ],
      },
      {
        name: 'Purple Stock',
        productHandle: 'purple-stock-flower',
        image: IMAGES.presentation.bloom10,
        category: 'Line Flowers',
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 69.99 },
          { label: '40 Stems', price: 129.99 },
        ],
      },
      {
        name: 'White Feverfew',
        productHandle: 'white-feverfew-daisy',
        image: IMAGES.presentation.bloom11,
        category: 'Filler Flowers',
        selectedOption: 0,
        options: [
          { label: '10 Bunches', price: 59.99 },
          { label: '20 Bunches', price: 109.99 },
        ],
      },
      {
        name: 'White Garden Roses',
        productHandle: 'white-garden-roses',
        image: IMAGES.presentation.bloom12,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '24 Stems', price: 119.99 },
          { label: '48 Stems', price: 219.99 },
        ],
      },
      {
        name: 'White Anemones',
        productHandle: 'white-anemone-flower',
        image: IMAGES.presentation.bloom13,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '30 Stems', price: 99.99 },
          { label: '60 Stems', price: 179.99 },
        ],
      },
      {
        name: 'Pink Spray Roses',
        productHandle: 'pink-spray-roses',
        image: IMAGES.presentation.bloom14,
        category: 'Filler Flowers',
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 79.99 },
          { label: '50 Stems', price: 159.99 },
        ],
      },
      {
        name: 'Red Anemones',
        productHandle: 'red-anemone-flower',
        image: IMAGES.presentation.bloom15,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '30 Stems', price: 99.99 },
          { label: '60 Stems', price: 179.99 },
        ],
      },
    ],

    // Custom floral recipes - ingredients link to featuredBlooms via productHandle
    recipes: [
      {
        id: '1',
        name: 'Bridal Bouquet',
        quantity: 1,
        image: IMAGES.presentation.recipeBridal,
        description: 'Lush, romantic hand-tied bouquet featuring a mix of focal blooms and delicate fillers.',
        ingredients: [
          { productHandle: 'white-garden-roses', name: 'White Garden Roses', count: 8 },
          { productHandle: 'white-anemone-flower', name: 'White Anemones', count: 10 },
          { productHandle: 'pink-ranunculus-flower', name: 'Pink Ranunculus', count: 5 },
          { productHandle: 'white-feverfew-daisy', name: 'White Feverfew', count: 3 },
        ],
      },
      {
        id: '2',
        name: 'Bridesmaids Bouquet',
        quantity: 4,
        image: IMAGES.presentation.recipeBridesmaids,
        description: 'Complementary bouquet with colorful focal blooms and garden-style greenery.',
        ingredients: [
          { productHandle: 'peach-garden-roses', name: 'Peach Garden Roses', count: 5 },
          { productHandle: 'orange-ranunculus-flower', name: 'Orange Ranunculus', count: 4 },
          { productHandle: 'pink-spray-roses', name: 'Pink Spray Roses', count: 3 },
          { productHandle: 'purple-aster-flower', name: 'Purple Asters', count: 2 },
        ],
      },
      {
        id: '3',
        name: 'Groom Boutonniere',
        quantity: 1,
        image: IMAGES.presentation.recipeBoutonniere,
        description: 'Classic boutonniere with single focal bloom and accent greenery.',
        ingredients: [
          { productHandle: 'white-garden-roses', name: 'White Garden Roses', count: 1 },
          { productHandle: 'white-feverfew-daisy', name: 'White Feverfew', count: 1 },
        ],
      },
      {
        id: '4',
        name: 'Groomsmen Boutonniere',
        quantity: 5,
        image: IMAGES.presentation.recipeBoutonniere,
        description: 'Coordinating boutonniere with colorful accent bloom.',
        ingredients: [
          { productHandle: 'orange-ranunculus-flower', name: 'Orange Ranunculus', count: 1 },
          { productHandle: 'purple-aster-flower', name: 'Purple Asters', count: 1 },
        ],
      },
      {
        id: '5',
        name: 'Centerpiece Arrangement',
        quantity: 12,
        image: IMAGES.presentation.recipeCenterpiece,
        description: 'Garden-style centerpiece with mixed blooms in a low compote vase.',
        ingredients: [
          { productHandle: 'peach-garden-roses', name: 'Peach Garden Roses', count: 3 },
          { productHandle: 'orange-ranunculus-flower', name: 'Orange Ranunculus', count: 4 },
          { productHandle: 'yellow-lisianthus-flower', name: 'Yellow Lisianthus', count: 3 },
          { productHandle: 'purple-stock-flower', name: 'Purple Stock', count: 2 },
          { productHandle: 'white-feverfew-daisy', name: 'White Feverfew', count: 2 },
        ],
      },
    ],

    // Shopping list / coupon fields (for presentation)
    couponCode: 'Consult2026',
    discountPercent: 5,

    updatedAt: Timestamp.fromDate(new Date('2026-03-12')),
    createdAt: Timestamp.fromDate(new Date('2026-02-01')),
  },

  // ============================================
  // Jonathan & Amanda - Professional with linked ingredients
  // ============================================
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: 'Jonathan & Amandas Wedding Flowers',
    cardImage: IMAGES.proposalCards.card1,
    author: 'Becky Memmo',

    customerName: 'Jonathan & Amanda Smith',
    customerEmail: 'jonathan.amanda@email.com',
    proposalName: 'Jonathan & Amandas - March 26',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-03-19')),
    deliveryDate: Timestamp.fromDate(new Date('2026-03-16')),
    styleNotes: 'Romantic garden theme with soft pastels. Bride loves peonies and garden roses. Ceremony will be outdoors in a vineyard setting.',

    inspirationImages: [
      IMAGES.proposalCards.card1,
      IMAGES.inspiration.img1,
      IMAGES.inspiration.img2,
      IMAGES.inspiration.img3,
    ],

    colorPalette: ['#f9e8cc', '#f5dbdd', '#fef8df', '#97cce8', '#cee5cb', '#ef865b'],

    featuredBlooms: [
      {
        name: 'Quicksand Roses',
        productHandle: 'quicksand-cream-roses',
        image: IMAGES.recipes.recipe1,
        category: 'Focal Flowers',
        selectedOption: 0,
        options: [
          { label: '25 Stems', price: 94.99 },
          { label: '50 Stems', price: 149.99 },
          { label: '100 Stems', price: 234.99 },
        ],
      },
      {
        name: 'Creamy White Spray Roses',
        productHandle: 'creamy-white-spray-bulk-roses',
        image: IMAGES.recipes.recipe2,
        category: 'Filler Flowers',
        selectedOption: 0,
        options: [
          { label: '20 Stems', price: 119.99 },
          { label: '50 Stems', price: 159.99 },
          { label: '100 Stems', price: 259.99 },
        ],
      },
      {
        name: 'Silver Dollar Eucalyptus',
        productHandle: 'silver-dollar-eucalyptus',
        image: IMAGES.recipes.recipe3,
        category: 'Greenery',
        selectedOption: 0,
        options: [
          { label: '20 Bunches', price: 119.99 },
          { label: '50 Bunches', price: 159.99 },
          { label: '100 Bunches', price: 259.99 },
        ],
      },
    ],

    recipes: [
      {
        id: '1',
        name: 'Brides Bouquet',
        quantity: 1,
        image: IMAGES.recipes.recipe4,
        description: 'Elegant hand-tied bouquet with romantic garden roses and soft eucalyptus.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 12 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Spray Roses', count: 6 },
          { productHandle: 'silver-dollar-eucalyptus', name: 'Silver Dollar Eucalyptus', count: 4 },
        ],
      },
      {
        id: '2',
        name: 'Bridesmaid Bouquet',
        quantity: 4,
        image: IMAGES.recipes.recipe5,
        description: 'Complementary bouquet with softer tones.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 8 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Spray Roses', count: 4 },
          { productHandle: 'silver-dollar-eucalyptus', name: 'Silver Dollar Eucalyptus', count: 3 },
        ],
      },
      {
        id: '3',
        name: 'Boutonniere',
        quantity: 6,
        image: IMAGES.recipes.recipe6,
        description: 'Classic boutonniere with single rose and eucalyptus accent.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 1 },
          { productHandle: 'silver-dollar-eucalyptus', name: 'Silver Dollar Eucalyptus', count: 1 },
        ],
      },
      {
        id: '4',
        name: 'Centerpiece',
        quantity: 10,
        image: IMAGES.recipes.recipe7,
        description: 'Low and lush centerpiece perfect for round tables.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 6 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Spray Roses', count: 4 },
          { productHandle: 'silver-dollar-eucalyptus', name: 'Silver Dollar Eucalyptus', count: 3 },
        ],
      },
    ],

    updatedAt: Timestamp.fromDate(new Date('2026-03-20')),
    createdAt: Timestamp.fromDate(new Date('2026-02-15')),
  },

  // ============================================
  // Basic Consultation Examples
  // ============================================
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
    featuredBlooms: [],
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
    featuredBlooms: [],
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
    featuredBlooms: [],
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
    featuredBlooms: [],
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
    featuredBlooms: [],
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
    featuredBlooms: [],
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
    featuredBlooms: [],
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
