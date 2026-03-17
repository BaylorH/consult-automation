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
  },
  inspiration: {
    img1: '/images/inspiration-1.png',
    img2: '/images/inspiration-2.png',
    img3: '/images/inspiration-3.png',
  },
  recipes: {
    recipe4: '/images/seed-recipe-4.png',
    recipe5: '/images/seed-recipe-5.png',
    recipe6: '/images/seed-recipe-6.png',
    recipe7: '/images/seed-recipe-7.png',
  },
  // Presentation reference images (from Figma)
  presentation: {
    inspiration1: '/presentation/inspiration-1.png',
    inspiration2: '/presentation/inspiration-2.png',
    inspiration3: '/presentation/inspiration-3.png',
    inspiration4: '/presentation/inspiration-4.png',
    inspiration5: '/presentation/inspiration-5.png',
    inspiration6: '/presentation/inspiration-6.png',
    inspiration7: '/presentation/inspiration-7.png',
    inspiration8: '/presentation/inspiration-8.png',
    inspiration9: '/presentation/inspiration-9.png',
    recipeBridal: '/presentation/recipe-bride-bouquet.png',
    recipeBridesmaids: '/presentation/recipe-bridesmaid.png',
    recipeBoutonniere: '/presentation/recipe-boutonniere.png',
    recipeGroomsmen: '/presentation/recipe-groomsmen.png',
    recipeCenterpiece: '/presentation/recipe-centerpiece.png',
  },
};

// ============================================
// REAL SHOPIFY PRODUCT DATA
// Fetched from production fiftyflowers.com
// Field names match what the UI expects:
// - name (not title)
// - options with label/price (not variants with title)
// ============================================

const SHOPIFY_PRODUCTS = {
  // Focal Flowers
  orangeRanunculus: {
    productHandle: 'orange-ranunculus-fresh-cut-flower',
    name: 'Orange Ranunculus Fresh Cut Flower',
    productType: 'Ranunculus',
    category: 'Focal Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/orange-ranunculus-fresh-cut-flower-wholesale-flowers-close-up_4700c_c0jy0.webp?v=1771440708',
    selectedOption: 0,
    options: [
      { label: '20 Stems (2 Bunches)', price: 104.99, variantId: 40402831409314 },
      { label: '50 Stems (5 Bunches)', price: 159.99, variantId: 44488316485794 },
      { label: '100 Stems (10 Bunches)', price: 274.99, variantId: 44488316551330 },
      { label: '150 Stems (15 Bunches)', price: 359.99, variantId: 44488316584098 },
      { label: '200 Stems (20 Bunches)', price: 459.99, variantId: 44488316616866 },
      { label: '300 Stems (30 Bunches)', price: 644.99, variantId: 40402828525730 },
    ],
  },
  pinkRanunculus: {
    productHandle: 'light-pink-ranunculus-fresh-cut-flower',
    name: 'Light Pink Ranunculus Fresh Cut Flower',
    productType: 'Ranunculus',
    category: 'Focal Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/light-pink-ranunculus-fresh-cut-flowers-wholesale-flowers-close-up_4bec4_wxy51.webp?v=1771443971',
    selectedOption: 0,
    options: [
      { label: '20 Stems (2 Bunches)', price: 104.99, variantId: 40402832261282 },
      { label: '50 Stems (5 Bunches)', price: 159.99, variantId: 44488317698210 },
      { label: '100 Stems (10 Bunches)', price: 274.99, variantId: 44488317763746 },
      { label: '150 Stems (15 Bunches)', price: 359.99, variantId: 44488317829282 },
      { label: '200 Stems (20 Bunches)', price: 459.99, variantId: 44488317894818 },
      { label: '300 Stems (30 Bunches)', price: 644.99, variantId: 40402828230818 },
    ],
  },
  peachGardenRose: {
    productHandle: 'peach-sherbet-garden-rose',
    name: 'Peach Sherbet Garden Rose',
    productType: 'Roses Garden',
    category: 'Focal Flowers',
    stemsPerBunch: 12,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/peach-sherbet-garden-roses-online_pri_1_5322_l_8avl5.webp?v=1771442531',
    selectedOption: 0,
    options: [
      { label: '24 Garden Roses (2 Bunches)', price: 169.99, variantId: 44056407998626 },
      { label: '36 Garden Roses (3 Bunches)', price: 234.99, variantId: 37679807004834 },
      { label: '48 Garden Roses (4 Bunches)', price: 284.99, variantId: 44056408031394 },
      { label: '60 Garden Roses (5 Bunches)', price: 334.99, variantId: 44056408064162 },
      { label: '72 Garden Roses (6 Bunches)', price: 374.99, variantId: 44056408096930 },
      { label: '144 Garden Roses (12 Bunches)', price: 679.99, variantId: 44056408129698 },
    ],
  },
  whiteGardenRose: {
    productHandle: 'paper-white-garden-rose',
    name: 'Paper White Garden Rose',
    productType: 'Roses Garden',
    category: 'Focal Flowers',
    stemsPerBunch: 12,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/paper-white-garden-rose-wholesale-flowers-close-up_12796_iiw70.webp?v=1771442507',
    selectedOption: 0,
    options: [
      { label: '24 Garden Roses (2 Bunches)', price: 169.99, variantId: 37679784100002 },
      { label: '36 Garden Roses (3 Bunches)', price: 234.99, variantId: 37679784165538 },
      { label: '48 Garden Roses (4 Bunches)', price: 284.99, variantId: 44056257888418 },
      { label: '60 Garden Roses (5 Bunches)', price: 334.99, variantId: 44056257953954 },
      { label: '72 Garden Roses (6 Bunches)', price: 374.99, variantId: 44056257986722 },
      { label: '144 Garden Roses (12 Bunches)', price: 679.99, variantId: 44056258019490 },
    ],
  },
  whiteAnemone: {
    productHandle: 'blush-white-anemones-wholesale-flowers',
    name: 'Blush White Wholesale Anemone Flowers',
    productType: 'Anemone',
    category: 'Focal Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/blush-white-anemones-wholesale-flowers-wholesale-flowers-close-up_1d004_2ura1.webp?v=1771446136',
    selectedOption: 0,
    options: [
      { label: '50 Stems (5 Bunches)', price: 149.99, variantId: 44488245018786 },
      { label: '100 Stems (10 Bunches)', price: 259.99, variantId: 44488245051554 },
      { label: '150 Stems (15 Bunches)', price: 339.99, variantId: 44488245084322 },
      { label: '200 Stems (20 Bunches)', price: 444.99, variantId: 44488245117090 },
      { label: '300 Stems (30 Bunches)', price: 599.99, variantId: 44488245149858 },
    ],
  },
  redAnemone: {
    productHandle: 'red-fresh-cut-anemone-flower',
    name: 'Red Fresh Cut Anemone Flower',
    productType: 'Anemone',
    category: 'Focal Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/red-fresh-cut-anemone-flower-wholesale-flowers-close-up_20114_whqf2.webp?v=1771440638',
    selectedOption: 0,
    options: [
      { label: '50 Stems (5 Bunches)', price: 149.99, variantId: 44488243052706 },
      { label: '100 Stems (10 Bunches)', price: 259.99, variantId: 44488243085474 },
      { label: '150 Stems (15 Bunches)', price: 339.99, variantId: 44488243118242 },
      { label: '200 Stems (20 Bunches)', price: 444.99, variantId: 44488243151010 },
      { label: '300 Stems (30 Bunches)', price: 599.99, variantId: 44488243183778 },
    ],
  },
  quicksandRoses: {
    productHandle: 'quicksand-cream-roses',
    name: 'Quicksand Cream Roses',
    productType: 'Roses Standard',
    category: 'Focal Flowers',
    stemsPerBunch: 25,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/quicksand-cream-roses-vase-close-up_9eca.webp?v=1771442373',
    selectedOption: 0,
    options: [
      { label: '25 Roses (1 Bunch)', price: 139.99, variantId: 43917822853282 },
      { label: '50 Roses (2 Bunches)', price: 194.99, variantId: 37679740682402 },
      { label: '100 Roses (4 Bunches)', price: 304.99, variantId: 37679740846242 },
    ],
  },

  // Filler Flowers
  champagneLisianthus: {
    productHandle: 'champagne-lisianthus-wholesale-flowers',
    name: 'Champagne Lisianthus Wholesale Flowers',
    productType: 'Lisianthus',
    category: 'Filler Flowers',
    stemsPerBunch: 5,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/arena-gold-yellow-lisianthus-flowers-online_pri_18_6670_l_75wi5.webp?v=1771444023',
    selectedOption: 0,
    options: [
      { label: '5 Bunches', price: 254.99, variantId: 37680827826338 },
      { label: '10 Bunches', price: 374.99, variantId: 37680827859106 },
      { label: '20 Bunches', price: 659.99, variantId: 37680827891874 },
    ],
  },
  yellowButtonPom: {
    productHandle: 'yellow-button-pom-flower',
    name: 'Yellow Button Pom Flower',
    productType: 'PomPom',
    category: 'Filler Flowers',
    stemsPerBunch: 5,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/yellow-button-pom-flower-wholesale-flowers_e01db_u9g90.webp?v=1771439745',
    selectedOption: 0,
    options: [
      { label: '6 Bunches', price: 114.99, variantId: 39854152089762 },
      { label: '12 Bunches', price: 164.99, variantId: 39854152122530 },
      { label: '24 Bunches', price: 254.99, variantId: 39854152155298 },
      { label: '48 Bunches', price: 414.99, variantId: 39854152188066 },
    ],
  },
  purpleAster: {
    productHandle: 'aster-flowers-purple',
    name: 'Purple Aster Flowers',
    productType: 'Asters',
    category: 'Filler Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/purple-aster-flowers-online_pri_92_5192_l_jl955.webp?v=1771442755',
    selectedOption: 0,
    options: [
      { label: '50 Stems (5 Bunches)', price: 124.99, variantId: 37680707666082 },
      { label: '100 Stems (10 Bunches)', price: 194.99, variantId: 44207977758882 },
      { label: '200 Stems (20 Bunches)', price: 269.99, variantId: 44207977791650 },
    ],
  },
  amethystAllium: {
    productHandle: 'amethyst-hues-allium-flower',
    name: 'Amethyst Hues Allium Flowers',
    productType: 'Allium',
    category: 'Filler Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/allium-summer-drummer-bloom_3a4be_9rjz1.webp?v=1771443852',
    selectedOption: 0,
    options: [
      { label: '40 Stems (4 Bunches)', price: 224.99, variantId: 44288098795682 },
    ],
  },
  feverfew: {
    productHandle: 'feverfew-daisy-wholesale-cut-flower',
    name: 'Feverfew Daisy Wholesale Cut Flower',
    productType: 'Feverfew',
    category: 'Filler Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/feverfew-daisy-wholesale-cut-flower-wholesale-flowers_66702_r3w41.webp?v=1771442684',
    selectedOption: 0,
    options: [
      { label: '50 Stems (5 Bunches)', price: 164.99, variantId: 37680765173922 },
      { label: '100 Stems (10 Bunches)', price: 239.99, variantId: 37680765206690 },
      { label: '150 Stems (15 Bunches)', price: 289.99, variantId: 37680765239458 },
      { label: '200 Stems (20 Bunches)', price: 334.99, variantId: 37680765272226 },
    ],
  },
  pinkSprayRoses: {
    productHandle: 'light-pink-spray-bulk-roses',
    name: 'Light Pink Bulk Spray Roses',
    productType: 'Roses Spray',
    category: 'Filler Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/light-pink-spray-roses-flowers-online_pri_86_840_l_ypto4.webp?v=1771440591',
    selectedOption: 0,
    options: [
      { label: '20 Stems (2 Bunches)', price: 114.99, variantId: 40778049945762 },
      { label: '50 Stems (5 Bunches)', price: 149.99, variantId: 40778052763810 },
      { label: '100 Stems (10 Bunches)', price: 229.99, variantId: 37680430743714 },
      { label: '200 Stems (20 Bunches)', price: 404.99, variantId: 37680430776482 },
    ],
  },
  creamyWhiteSprayRoses: {
    productHandle: 'creamy-white-spray-bulk-roses',
    name: 'Creamy White Bulk Spray Roses',
    productType: 'Roses Spray',
    category: 'Filler Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/creamy-white-bulk-spray-roses-close-up.jpg_8af1.webp?v=1773180980',
    selectedOption: 0,
    options: [
      { label: '20 Stems (2 Bunches)', price: 119.99, variantId: 40813037650082 },
      { label: '50 Stems (5 Bunches)', price: 159.99, variantId: 37680430907554 },
      { label: '100 Stems (10 Bunches)', price: 259.99, variantId: 37680430940322 },
      { label: '200 Stems (20 Bunches)', price: 464.99, variantId: 43549814292642 },
    ],
  },

  // Line Flowers
  whiteDelphinium: {
    productHandle: 'white-delphinium-flower',
    name: 'White Delphinium Flowers',
    productType: 'Delphinium',
    category: 'Line Flowers',
    stemsPerBunch: 5,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/white-delphinium-flower-wholesale-flowers-close-up_8f314_lexv3.webp?v=1771440162',
    selectedOption: 0,
    options: [
      { label: '30 Stems (6 Bunches)', price: 234.99, variantId: 39854182367394 },
      { label: '45 Stems (9 Bunches)', price: 314.99, variantId: 39854182400162 },
      { label: '90 Stems (18 Bunches)', price: 519.99, variantId: 39854182432930 },
    ],
  },
  purpleStock: {
    productHandle: 'stock-lavender-purple-flower',
    name: 'Lavender Purple Stock Flower',
    productType: 'Stock',
    category: 'Line Flowers',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/lavender-purple-stock-flowers-online_pri_31_518_l_mz630.webp?v=1771440243',
    selectedOption: 0,
    options: [
      { label: '30 Stems (3 Bunches)', price: 149.99, variantId: 45084742680738 },
      { label: '50 Stems (5 Bunches)', price: 159.99, variantId: 45084742779042 },
      { label: '100 Stems (10 Bunches)', price: 234.99, variantId: 45084742877346 },
      { label: '200 Stems (20 Bunches)', price: 434.99, variantId: 45084742975650 },
    ],
  },

  // Greenery
  silverDollarEucalyptus: {
    productHandle: 'silver-dollar-eucalyptus-greens',
    name: 'Silver Dollar Eucalyptus Greens',
    productType: 'Eucalyptus',
    category: 'Greenery',
    stemsPerBunch: 5,
    image: 'https://cdn.shopify.com/s/files/1/0516/8968/5154/files/silver-dollar-eucalyptus-greens-wholesale-flowers-close-up_7fe7d_w69f2.webp?v=1771440199',
    selectedOption: 0,
    options: [
      { label: '5 Bunches', price: 154.99, variantId: 39854206910626 },
      { label: '10 Bunches', price: 209.99, variantId: 39854206943394 },
      { label: '15 Bunches', price: 279.99, variantId: 39854206976162 },
      { label: '20 Bunches', price: 324.99, variantId: 39854207008930 },
    ],
  },
  israeliRuscus: {
    productHandle: 'israeli-ruscus-greenery',
    name: 'Israeli Ruscus Greenery',
    productType: 'Greenery',
    category: 'Greenery',
    stemsPerBunch: 10,
    image: 'https://cdn.shopify.com/s/files/1/0637/5522/3180/files/israeli-ruscus-310-close_d00b333c_otw90.webp?v=1755635846',
    selectedOption: 0,
    options: [
      { label: '5 bunches', price: 104.99, variantId: 44403891404940 },
      { label: '10 bunches', price: 154.99, variantId: 44403891437708 },
      { label: '15 bunches', price: 189.99, variantId: 44403891470476 },
      { label: '20 bunches', price: 244.99, variantId: 44403891503244 },
      { label: '30 bunches', price: 304.99, variantId: 44403891536012 },
    ],
  },

  // Additional Focal Flowers
  romanticAntiquePinkRose: {
    productHandle: 'cabbage-garden-rose-romantic-antique-pink',
    name: 'Romantic Antique Pink Cabbage Garden Rose',
    productType: 'Roses Garden',
    category: 'Focal Flowers',
    stemsPerBunch: 12,
    image: 'https://cdn.shopify.com/s/files/1/0637/5522/3180/files/cabbage-garden-rose-romantic-antique-pink-wholesale-flowers-close-up_764be_l6jd4.webp?v=1766611270',
    selectedOption: 0,
    options: [
      { label: '24 Garden Roses', price: 154.99, variantId: 45553668128908 },
      { label: '36 Garden Roses', price: 209.99, variantId: 45553668161676 },
      { label: '48 Garden Roses', price: 259.99, variantId: 45553668194444 },
      { label: '60 Garden Roses', price: 304.99, variantId: 45553668227212 },
      { label: '72 Garden Roses', price: 339.99, variantId: 45553668259980 },
      { label: '144 Garden Roses', price: 624.99, variantId: 45553668292748 },
    ],
  },
};

// Sample proposals matching the dashboard mockup
export const sampleProposals = [
  // ============================================
  // REFERENCE PROPOSAL: Lucia & Gabby (from Figma presentation)
  // Professional Consultation - featuredBlooms are palette (no quantity needed)
  // Shopping list would be CALCULATED from recipes
  // ============================================
  {
    type: 'Wedding',
    typeColor: TYPE_COLORS['Wedding'],
    eventName: "Lucia and Gabby said 'I Do'",
    cardImage: IMAGES.presentation.inspiration1,
    author: 'Becky Memmo',

    // Form fields
    customerName: 'Lucia & Gabby Martinez-Chen',
    customerEmail: 'lucia.gabby@email.com',
    proposalName: 'Lucia & Gabby Wedding - March 2026',
    consultationLevel: 'Professional Consultation',
    eventDate: Timestamp.fromDate(new Date('2026-03-28')),
    deliveryDate: Timestamp.fromDate(new Date('2026-03-26')),
    styleNotes: 'Colorful garden wedding with a mix of bold and soft tones. Love ranunculus, anemones, and garden roses. Outdoor ceremony in a greenhouse setting with rustic barn reception.',

    // Inspiration images (9 images matching Figma presentation)
    inspirationImages: [
      IMAGES.presentation.inspiration1,
      IMAGES.presentation.inspiration2,
      IMAGES.presentation.inspiration3,
      IMAGES.presentation.inspiration4,
      IMAGES.presentation.inspiration5,
      IMAGES.presentation.inspiration6,
      IMAGES.presentation.inspiration7,
      IMAGES.presentation.inspiration8,
      IMAGES.presentation.inspiration9,
    ],

    // Color palette (6 colors from presentation)
    colorPalette: ['#E8D4A8', '#F5C6CB', '#FFF3CD', '#9DD4F0', '#C8E6C9', '#FF8A65'],

    // Featured blooms - PROFESSIONAL CONSULTATION
    // These are the product "palette" - exactly matching what's used in recipes
    featuredBlooms: [
      SHOPIFY_PRODUCTS.quicksandRoses,
      SHOPIFY_PRODUCTS.romanticAntiquePinkRose,
      SHOPIFY_PRODUCTS.creamyWhiteSprayRoses,
      SHOPIFY_PRODUCTS.israeliRuscus,
    ],

    // Custom floral recipes - ingredients reference featuredBlooms via productHandle
    // Exact recipes from the Figma presentation
    recipes: [
      {
        id: '1',
        name: 'Brides Bouquet',
        quantity: 1,
        image: IMAGES.presentation.recipeBridal,
        description: 'Elegant hand-tied bouquet of roses, peonies, and soft greenery',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 3 },
          { productHandle: 'cabbage-garden-rose-romantic-antique-pink', name: 'Romantic Antique Pink Rose', count: 1 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Bulk Spray Roses', count: 2 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.5 },
        ],
      },
      {
        id: '2',
        name: 'Bridesmaid Bouquet',
        quantity: 4,
        image: IMAGES.presentation.recipeBridesmaids,
        description: 'Delicate matching bouquets of pastel blooms with light greenery accents',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 3 },
          { productHandle: 'cabbage-garden-rose-romantic-antique-pink', name: 'Romantic Antique Pink Rose', count: 1 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Bulk Spray Roses', count: 2 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.5 },
        ],
      },
      {
        id: '3',
        name: 'Grooms Boutonniere',
        quantity: 1,
        image: IMAGES.presentation.recipeBoutonniere,
        description: 'Classic single bloom boutonniere with greenery, neatly pinned to lapel',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 1 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.25 },
        ],
      },
      {
        id: '4',
        name: 'Groomsmen Boutonniere',
        quantity: 4,
        image: IMAGES.presentation.recipeGroomsmen,
        description: 'Matching boutonnieres with subtle accents',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 1 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.25 },
        ],
      },
      {
        id: '5',
        name: 'Officiant Boutonniere',
        quantity: 1,
        image: IMAGES.presentation.recipeGroomsmen,
        description: 'Simple coordinating boutonniere with single bloom and light greenery',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 1 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.25 },
        ],
      },
      {
        id: '6',
        name: "Mom's Corsage",
        quantity: 1,
        image: IMAGES.presentation.recipeBoutonniere,
        description: 'Elegant wrist corsage with delicate blooms and soft greenery accents',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 1 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.25 },
        ],
      },
      {
        id: '7',
        name: 'Centerpiece Arrangement',
        quantity: 10,
        image: IMAGES.presentation.recipeCenterpiece,
        description: 'Low floral centerpiece with seasonal blooms and soft greenery accents',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Roses', count: 3 },
          { productHandle: 'cabbage-garden-rose-romantic-antique-pink', name: 'Romantic Antique Pink Rose', count: 1 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Bulk Spray Roses', count: 2 },
          { productHandle: 'israeli-ruscus-greenery', name: 'Israeli Ruscus Greenery', count: 0.5 },
        ],
      },
    ],

    // Shopping list / coupon fields (for presentation)
    couponCode: 'Consult2026',

    updatedAt: Timestamp.fromDate(new Date('2026-03-12')),
    createdAt: Timestamp.fromDate(new Date('2026-02-01')),
  },

  // ============================================
  // Jonathan & Amanda - Professional Consultation
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

    // Featured blooms - product palette (no quantity for Professional)
    featuredBlooms: [
      SHOPIFY_PRODUCTS.quicksandRoses,
      SHOPIFY_PRODUCTS.creamyWhiteSprayRoses,
      SHOPIFY_PRODUCTS.silverDollarEucalyptus,
    ],

    recipes: [
      {
        id: '1',
        name: 'Brides Bouquet',
        quantity: 1,
        image: IMAGES.recipes.recipe4,
        description: 'Elegant hand-tied bouquet with romantic garden roses and soft eucalyptus.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Cream Roses', count: 12 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Spray Roses', count: 6 },
          { productHandle: 'silver-dollar-eucalyptus-greens', name: 'Silver Dollar Eucalyptus', count: 4 },
        ],
      },
      {
        id: '2',
        name: 'Bridesmaid Bouquet',
        quantity: 4,
        image: IMAGES.recipes.recipe5,
        description: 'Complementary bouquet with softer tones.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Cream Roses', count: 8 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Spray Roses', count: 4 },
          { productHandle: 'silver-dollar-eucalyptus-greens', name: 'Silver Dollar Eucalyptus', count: 3 },
        ],
      },
      {
        id: '3',
        name: 'Boutonniere',
        quantity: 6,
        image: IMAGES.recipes.recipe6,
        description: 'Classic boutonniere with single rose and eucalyptus accent.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Cream Roses', count: 1 },
          { productHandle: 'silver-dollar-eucalyptus-greens', name: 'Silver Dollar Eucalyptus', count: 1 },
        ],
      },
      {
        id: '4',
        name: 'Centerpiece',
        quantity: 10,
        image: IMAGES.recipes.recipe7,
        description: 'Low and lush centerpiece perfect for round tables.',
        ingredients: [
          { productHandle: 'quicksand-cream-roses', name: 'Quicksand Cream Roses', count: 6 },
          { productHandle: 'creamy-white-spray-bulk-roses', name: 'Creamy White Spray Roses', count: 4 },
          { productHandle: 'silver-dollar-eucalyptus-greens', name: 'Silver Dollar Eucalyptus', count: 3 },
        ],
      },
    ],

    couponCode: 'Consult2026',

    updatedAt: Timestamp.fromDate(new Date('2026-03-20')),
    createdAt: Timestamp.fromDate(new Date('2026-02-15')),
  },

  // ============================================
  // Basic Consultation Example
  // For Basic: featuredBlooms HAVE selectedOption set (consultant picks quantity)
  // Shopping list = featuredBlooms directly
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

    // Inspiration images - card image is first
    inspirationImages: [
      IMAGES.proposalCards.card2,
    ],

    colorPalette: ['#ff69b4', '#ffd700', '#fff0f5'],

    // Basic consultation - featuredBlooms WITH selectedOption (quantity chosen)
    featuredBlooms: [
      { ...SHOPIFY_PRODUCTS.pinkSprayRoses, selectedOption: 1 }, // 50 Stems selected
      { ...SHOPIFY_PRODUCTS.pinkRanunculus, selectedOption: 1 }, // 50 Stems selected
    ],

    // Basic uses template recipes (not custom)
    recipes: [],

    updatedAt: Timestamp.fromDate(new Date('2026-03-19')),
    createdAt: Timestamp.fromDate(new Date('2026-03-01')),
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
