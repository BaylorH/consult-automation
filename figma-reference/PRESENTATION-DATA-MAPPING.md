# Presentation Data Mapping

This document maps the **Proposal Form fields** (Firestore) to the **Presentation slides**.

---

## Current Firestore Data Model

```javascript
proposals/{id}
├── type                  // "Wedding" | "Bachelorette" | "Quinceañera" | "Baby Shower" | "Fund Raiser"
├── typeColor             // "#055e5a"
├── eventName             // "Jonathan & Amanda's Wedding Flowers"
├── cardImage             // Dashboard card thumbnail
├── author                // Consultant name
├── customerName          // "Jonathan & Amanda Smith"
├── customerEmail         // "email@example.com"
├── proposalName          // "Jonathan & Amanda's - March 26"
├── consultationLevel     // "Basic" | "Professional" | "Deluxe"
├── eventDate             // Timestamp
├── deliveryDate          // Timestamp
├── styleNotes            // Free text description
├── inspirationImages[]   // Array of image URLs
├── colorPalette[]        // Array of hex colors: ["#f9e8cc", ...]
├── featuredBlooms[]      // Array of bloom objects (see below)
├── recipes[]             // Array of recipe objects (see below)
├── createdAt             // Timestamp
└── updatedAt             // Timestamp
```

### featuredBlooms[] structure:
```javascript
{
  name: "Blue Tinted Roses",
  image: "/images/seed-recipe-1.png",
  selectedOption: 0,  // Index into options array
  options: [
    { label: "5 Bunches", price: 164.99 },
    { label: "50 Stems", price: 279.99 },
    // ...
  ]
}
```

### recipes[] structure:
```javascript
{
  id: "1",
  name: "Bride's Bouquet",
  quantity: 1,
  image: "/images/seed-recipe-4.png",
  ingredients: [
    { name: "Quick Sand Roses", count: "3" },
    { name: "Gunnii Eucalyptus Greens", count: "1/2" },
    // ...
  ]
}
```

---

## Presentation Slide Mapping

### SLIDE 1: Title/Header
| Presentation Element | Firestore Field | Status |
|---------------------|-----------------|--------|
| Event title (e.g., "Lucia and Gabby say 'I Do'") | `eventName` | ✅ EXISTS |
| Event date | `eventDate` | ✅ EXISTS |
| Background floral image | Static asset | ✅ STATIC |

### SLIDE 2: Inspirational Photos + Color Palette
| Presentation Element | Firestore Field | Status |
|---------------------|-----------------|--------|
| Photo collage (8 images) | `inspirationImages[]` | ✅ EXISTS |
| Color swatches (8 circles) | `colorPalette[]` | ✅ EXISTS (render circles from hex) |
| Section title "INSPIRATIONAL PHOTOS" | Static | ✅ STATIC |
| Section title "Color Pallet" | Static | ✅ STATIC |

### SLIDE 3: Featured Blooms
| Presentation Element | Firestore Field | Status |
|---------------------|-----------------|--------|
| Circular bloom images (15 shown) | `featuredBlooms[].image` | ✅ EXISTS |
| Section title | Static | ✅ STATIC |

**Note:** Presentation shows up to 15 blooms. Current form may have fewer.

### SLIDE 4: Custom Floral Recipes
| Presentation Element | Firestore Field | Status |
|---------------------|-----------------|--------|
| Recipe card image | `recipes[].image` | ✅ EXISTS |
| Recipe name + quantity | `recipes[].name` + `recipes[].quantity` | ✅ EXISTS |
| Recipe description | `recipes[].description` | ⚠️ MISSING - need to add |
| Ingredients list | `recipes[].ingredients[]` | ✅ EXISTS |

### SLIDE 5: Shopping List (YOUR WEDDING SHOPPING LIST)
| Presentation Element | Firestore Field | Status |
|---------------------|-----------------|--------|
| **Order By date** | Calculated: `deliveryDate - X days` | ⚠️ NEEDS LOGIC |
| **Delivery Date** | `deliveryDate` | ✅ EXISTS |
| **Coupon Code** | `couponCode` | ❌ MISSING - need to add |
| **Product categories** (Focal, Filler, Line, Greenery) | `shoppingList[].category` | ❌ MISSING - need restructure |
| Product image | `shoppingList[].image` | ❌ MISSING |
| Product name | `shoppingList[].name` | ❌ MISSING |
| Quantity/Size selected | `shoppingList[].quantity` | ❌ MISSING |
| Recipe needs (stems) | Calculated from recipes | ⚠️ NEEDS LOGIC |
| Price | `shoppingList[].price` | ❌ MISSING |
| Product URL | `shoppingList[].url` | ❌ MISSING |
| **Subtotal** | Calculated | ⚠️ NEEDS LOGIC |
| **Discount amount** | Calculated from coupon | ⚠️ NEEDS LOGIC |
| **Grand Total** | Calculated | ⚠️ NEEDS LOGIC |

### SLIDES 6-15: Static Content (same for all proposals)
| Slide | Content | Status |
|-------|---------|--------|
| Resources & Tutorials | Supplies list, links, tutorials | ✅ STATIC |
| Tips & Tricks | Floral prep, design prep, transportation | ✅ STATIC |
| Wedding Week (2 slides) | Checklists | ✅ STATIC |
| Flower Day 1-3 (3 slides) | Daily checklists | ✅ STATIC |
| Event Day | Final checklist | ✅ STATIC |
| Shipping & Tracking | Delivery info | ✅ STATIC |
| Share Your Flair | Promo | ✅ STATIC |

---

## Gap Analysis: What's Missing

### 1. Recipe Description Field
**Current:** recipes[] has `name`, `quantity`, `image`, `ingredients`
**Needed:** Add `description` field for presentation card text

```javascript
// ADD to recipe object:
description: "Elegant hand-tied bouquet of roses, peonies, and soft greenery"
```

### 2. Shopping List Data Structure
**Current:** No shopping list in Firestore. `featuredBlooms` has products but not structured for shopping list.
**Needed:** Either:
- **Option A:** Generate shopping list from `featuredBlooms` + `recipes` (calculate quantities)
- **Option B:** Add explicit `shoppingList[]` array to store final product selections

**Proposed shoppingList[] structure:**
```javascript
shoppingList: [
  {
    category: "Focal Flowers",  // or "Filler Flowers" | "Line Flowers" | "Greenery"
    productHandle: "lilac-scabiosa-flower",  // Shopify handle for API lookup
    name: "Lilac Focal Scoop Scabiosa Flower",
    image: "https://...",
    selectedVariant: "20 Stems (2 Bunches)",
    price: 99.99,
    recipeNeeds: 16,  // stems needed per recipes
    url: "https://fiftyflowers.com/products/..."
  },
  // ...
]
```

### 3. Coupon/Discount Fields
**Needed:**
```javascript
couponCode: "Consult2026",
discountPercent: 15,  // or discountAmount
```

### 4. Order By Date Logic
**Needed:** Calculate from deliveryDate
- Typically: `orderByDate = deliveryDate - 14 days` (or configurable)
- Could store explicitly or calculate on render

---

## Recommended Data Model Updates

```javascript
proposals/{id}
├── ... (existing fields) ...
│
├── // NEW: Recipe description
├── recipes[].description        // "Elegant hand-tied bouquet..."
│
├── // NEW: Shopping list
├── shoppingList: [
│     {
│       category: "Focal Flowers",
│       productHandle: "lilac-scabiosa",
│       name: "Lilac Focal Scoop Scabiosa Flower",
│       image: "https://...",
│       selectedVariant: "20 Stems (2 Bunches)",
│       price: 99.99,
│       recipeNeeds: 16,
│       url: "https://..."
│     }
│   ]
│
├── // NEW: Coupon
├── couponCode: "Consult2026"
├── discountPercent: 15
│
├── // NEW OR CALCULATED: Order deadline
├── orderByDate: Timestamp  // or calculate from deliveryDate
```

---

## Consultation Tier Data Flow (CONFIRMED)

### Basic Consultation
```
Featured Blooms (consultant selects products + quantities)
       ↓
Shopping List = Featured Blooms directly (what consultant selected)
       ↓
Client receives: Template recipes (standard guidance, not customized)
```
- Consultant manually determines how much of each bloom to buy
- Client gets rough/template recipes to figure out arrangements themselves
- Simpler, less personalized service

### Professional/Deluxe Consultation
```
Featured Blooms (product palette - no quantities yet)
       ↓
Custom Recipes (ingredients reference Featured Blooms)
       ↓
Shopping List = CALCULATED from all recipes
```
- Featured Blooms = available products to use in recipes
- Recipes specify ingredients with counts (e.g., "3 Quick Sand Roses")
- Shopping List aggregates total needs across all recipes × quantities
- More personalized, calculated service

### Example Calculation (Professional)
```
Recipes:
- Bride's Bouquet (×1): 3 Quick Sand Roses, 2 Spray Roses
- Bridesmaid Bouquet (×4): 3 Quick Sand Roses, 2 Spray Roses
- Centerpiece (×10): 5 Quick Sand Roses, 3 Spray Roses

Calculated totals:
- Quick Sand Roses: (3×1) + (3×4) + (5×10) = 65 stems
- Spray Roses: (2×1) + (2×4) + (3×10) = 40 stems

Shopping List:
- Quick Sand Roses: 65 stems needed → Select "75 Roses" variant ($179.99)
- Spray Roses: 40 stems needed → Select "50 stems (5 Bunches)" variant ($159.99)
```

### Data Model Update Needed

**Link ingredients to Featured Blooms:**
```javascript
// Current: ingredients are just strings
ingredients: [
  { name: "Quick Sand Roses", count: "3" }
]

// Proposed: reference the Featured Bloom product
ingredients: [
  {
    bloomIndex: 0,  // or productHandle: "quicksand-cream-roses"
    count: 3        // numeric for calculations
  }
]
```

---

## Questions to Resolve

### ANSWERED ✅

1. **Shopping List Generation:**
   - **Basic**: Manually set by consultant on Featured Blooms
   - **Professional/Deluxe**: Auto-calculated from recipes

2. **Product Categories:**
   - ✅ RESOLVED: Come from Shopify product tags (`Uses_Bulk Focal`, etc.)
   - Lambda updated to extract category from tags

### NEEDS STAKEHOLDER INPUT ⚠️

3. **Stem/Unit Math:**
   - How do recipe counts (e.g., "3") map to product units?
   - Products sold as "25 Roses", "50 stems (5 Bunches)", etc.
   - Is count = stems? Or bunches? Or depends on product?
   - **Likely**: Based on how product is sold (need to confirm)

4. **Variant Selection:**
   - Auto-select smallest variant that covers the need?
   - Or show consultant options to choose?
   - What about buffer/overage (buy extra for mistakes)?

5. **Recipe Descriptions:**
   - Are these written by the consultant?
   - Or auto-generated based on ingredients?

6. **Coupon Codes:**
   - Are these unique per proposal?
   - Or standard codes (e.g., "Consult2026")?
   - Who generates them?

7. **Order By Date:**
   - Standard formula (delivery - 14 days)?
   - Or consultant sets it manually?
