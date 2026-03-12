# Consult Automation - Project Context

## What We're Building

A **Proposal Manager** web app for FiftyFlowers (floral consultation business). Consultants use it to:
1. Build flower proposals for customers (weddings, baby showers, quinceañeras, etc.)
2. Generate two outputs: a visual presentation (PDF) and a shopping list with Shopify links

---

## Current State (Updated March 2026)

### Completed
- **React + Vite + Tailwind** frontend scaffolded
- **Firebase Hosting** deployed at https://consult-automation.web.app
- **Firestore** database integrated with security rules (@fiftyflowers.com users only)
- **Dashboard** reads proposals from Firestore, displays proposal cards with loading animation
- **Proposal Form** loads data via URL params (`/proposal/:id`)
- **Layout** with persistent sidebar navigation
- **DevTools** component for database seeding (dev mode only)
- **Auto-save** with debounced saves (1.5s delay) to Firestore
- **Session storage caching** (5-minute TTL) to reduce Firestore reads
- **Local assets** - All images downloaded from Figma, hosted locally (no external API calls)
- **Flower celebration animation** on login success
- **User profile pill** (avatar, name, logout) in top right corner
- **Branded login page** with gradient background, pattern overlay, white card
- **Loading animation** in main content area (1.2s minimum display time)
- **Delete proposal** functionality with confirmation dialog
- **Smart save status** - only shows when form has content (blank forms show nothing)
- **Three consultation tiers**: Basic, Professional, Deluxe (Deluxe behaves like Professional for now)
- **Removed proposalTemplate field** - was unused

### Form Sections Implemented
1. **Consultation Proposal Set** - All fields working (customer info, dates, consultation level)
2. **Inspiration & Style** - Images + color palette with full Add/Remove functionality
   - Add Photo: Tab interface with "From URL" or "From Computer" (file upload with drag & drop)
   - Add Color: Quick Pick preset swatches (18 colors) OR custom color picker with hex input
   - Remove: Hover to reveal X button on images/colors
   - Icons match Figma design (downloaded locally)
3. **Featured Blooms** - Display with images, pricing tiers, remove buttons, **product search working**
4. **Custom Floral Recipes** (Professional) - Recipe cards with images, ingredients list, Edit/Remove buttons
5. **Basic Floral Recipes** (Basic) - Template-based recipes component
6. **Create Recipe Form** - Full UI matching Figma (name, count, description, ingredients, photo)
7. **Shopping List** - Displays when recipes exist

### Product Search (Completed)
- **Lambda**: `SearchProducts` function in `functions/search-products/`
- **Hook**: `useProductSearch` in `frontend/src/hooks/useProductSearch.jsx`
- **API Endpoints**:
  - `GET /search-products?q=query` - Search products by name
  - `GET /search-products/{handle}` - Get full product details with variants

### In Progress: Presentation Generation
- **Figma design pulled** - MCP call made for "MacBook Air - 1" frame (node 196:11)
- **React code saved** - `figma-reference/MCP-Presentation-MacBookAir1-RAW.jsx`
- **Assets downloaded** - 50 images saved to `figma-reference/presentation_assets/`
- **Data mapping documented** - `figma-reference/PRESENTATION-DATA-MAPPING.md`
- **1 Figma MCP call remaining** (free tier limit)

### Pending
- **Share proposal functionality**
- **PDF generation** - Convert presentation React components to downloadable PDF
- **Shopping list data model** - Need to decide: auto-generate from recipes or manual curation?
- **Recipe descriptions** - Add description field to recipes[] for presentation cards
- **Coupon code field** - Add to data model for shopping list discount

---

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Auth**: Firebase Auth (Google sign-in, restricted to @fiftyflowers.com)
- **Backend**: AWS Lambda (via f50-aws-lambda repo)

---

## File Structure

```
frontend/
├── src/
│   ├── assets/images/          # Bundled images (logos, icons)
│   │   ├── logo-main.png
│   │   ├── logo-flower.png
│   │   ├── chevron.png
│   │   ├── add-photo-icon.png
│   │   ├── color-palette-icon.png
│   │   ├── recipe-*.png        # Recipe thumbnails
│   │   └── shopping-list-icon.png
│   ├── components/
│   │   ├── Layout.jsx              # Persistent sidebar + user pill
│   │   ├── BasicFloralRecipes.jsx  # Basic tier recipes
│   │   ├── ShoppingList.jsx        # Shopping list component
│   │   ├── LoadingScreen.jsx       # Full-page loading (unused now)
│   │   └── DevTools.jsx            # Dev-only database tools
│   ├── pages/
│   │   ├── Login.jsx               # Branded login with gradient bg
│   │   ├── DashboardContent.jsx    # Proposal grid with loading animation
│   │   └── ProposalFormContent.jsx # Main form (all sections) with auto-save
│   ├── hooks/
│   │   ├── useAuth.jsx             # Auth context + flower celebration
│   │   ├── useProposals.jsx        # Firestore CRUD + session caching
│   │   └── useProductSearch.jsx    # Shopify product search
│   ├── utils/
│   │   └── celebrate.js            # Flower celebration animation
│   ├── lib/
│   │   ├── firebase.js             # Firebase config
│   │   └── api.js                  # Lambda API config
│   ├── data/
│   │   └── seedProposals.js        # Sample data (uses local images)
│   ├── index.css                   # Global styles + animations
│   └── App.jsx                     # Routes & auth protection
├── public/images/                  # Static images (proposal cards, etc.)
│   ├── proposal-card-*.png
│   ├── inspiration-*.png
│   └── seed-recipe-*.png
├── index.html
└── package.json

figma-reference/
├── MCP-Call-*-*.jsx                        # Previous MCP calls (dashboard, form)
├── MCP-Presentation-MacBookAir1-RAW.jsx    # Presentation layout code
├── PRESENTATION-DATA-MAPPING.md            # Data mapping analysis
├── presentation_assets/                     # Downloaded presentation images
└── presentation_screenshots/                # Manual screenshots of slides
```

---

## Firestore Data Model

```javascript
proposals/{id}
├── type: "Wedding" | "Bachelorette" | "Quinceañera" | "Baby Shower" | "Fund Raiser"
├── typeColor: "#055e5a" // Tag color
├── eventName: "Jonathan & Amanda's Wedding Flowers"
├── cardImage: "/images/proposal-card-1.png" // Local path
├── author: "Becky Memmo" // Linked to Firebase Auth user displayName
├── customerName: "Jonathan & Amanda Smith"
├── customerEmail: "email@example.com"
├── proposalName: "Jonathan & Amanda's - March 26"
├── consultationLevel: "Basic Consultation" | "Professional Consultation" | "Deluxe Consultation"
├── eventDate: Timestamp
├── deliveryDate: Timestamp
├── styleNotes: "Romantic garden theme..."
├── inspirationImages: ["/images/...", ...] // 4-8 images
├── colorPalette: ["#f9e8cc", "#f5dbdd", ...] // 4-8 hex colors
├── featuredBlooms: [{                    // Products available for recipes
│     name: "Quicksand Roses",
│     productHandle: "quicksand-cream-roses",  // Shopify product handle
│     image: "/images/...",
│     category: "Focal Flowers",              // From Shopify tags
│     selectedOption: 0,
│     options: [{ label: "25 Stems", price: 94.99 }, ...]
│   }, ...]
├── recipes: [{                            // Professional only - reference featuredBlooms
│     id: "1",
│     name: "Brides Bouquet",
│     quantity: 1,
│     image: "/images/...",
│     description: "Elegant hand-tied bouquet...",
│     ingredients: [{
│       productHandle: "quicksand-cream-roses",  // Links to featuredBloom
│       name: "Quicksand Roses",
│       count: 12                                 // Numeric for calculations
│     }, ...]
│   }, ...]
├── couponCode: "Consult2026"              // For shopping list discount
├── discountPercent: 5
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

## Figma Source

**URL:** https://www.figma.com/design/G1qPmsZBP4ygTe9CnJpgRJ/FTY---Consult-Automation

### Key MCP Calls Made
| Call | Frame ID | Description |
|------|----------|-------------|
| 1 | 1:7 | Dashboard with sidebar + proposal cards |
| 2 | 28:471 | Empty form state |
| 3 | 134:475 | Complete Professional form (5 recipes) |
| 4 | 134:915 | Complete Basic form with Shopping List |
| 5 | 20:332 | Shopping List component |
| 6 | 196:11 | **Presentation layout** (MacBook Air - 1) - full vertical scroll with all slides |

### Figma Pages
- **Proposal Builder** - Dashboard and form UI (calls 1-5)
- **Proposal** - Presentation/PDF output design (call 6)
  - "MacBook Air - 1" frame contains all slides stacked vertically
  - "Featured Blooms" is a standalone component (lower priority, not yet pulled)

---

## Related Repositories

### f50-aws-lambda (Backend)
- **Location**: `/Users/baylorharrison/Documents/GitHub/f50-aws-lambda`
- **BB Dev Template**: `template-bb-dev.yml`
- **API Base URL**: `https://ff-api.fiftyflowers.com/api/v1` (prod)

#### Relevant Branches
| Project | Branch | Purpose |
|---------|--------|---------|
| **Deployment** | `baylor/bb-dev-combined` | Combined branch for BB Dev deployment (Internal AI + Share Your Flair + SearchProducts) |
| Consult Automation PR | `baylor/consult-automation` | Standalone PR branch for SearchProducts function only |
| FiftyFlowers Internal AI | `baylor/internal-ai-clean` | PR pending |
| Share Your Flair | `baylor/share-your-flair` | In development |

**Note:** Deploy from `baylor/bb-dev-combined`. The `baylor/consult-automation` branch is for PR review only - its changes are already merged into bb-dev-combined.

### shopify-theme2.0 (Frontend Reference)
- **Location**: `/Users/baylorharrison/Documents/GitHub/shopify-theme2.0`
- **Rush Order Form**: `snippets/rush-order-form.liquid` (product search reference)
- **Share Your Flair**: `baylor/v3-rush-order` branch

---

## Deployment

### Frontend (Firebase)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Lambda - BB Dev)
```bash
cd /path/to/f50-aws-lambda
sam build
sam deploy --config-env bb-dev
```

---

## Dev Commands

```bash
# Start frontend dev server
cd frontend && npm run dev

# Re-seed Firestore (use DevTools button in UI)
# 1. Open localhost:5173
# 2. Click yellow "Dev Tools" panel (bottom-right)
# 3. Click "Seed DB" or "Clear DB"

# Sign out clears session storage for fresh testing
```

---

## Key Design Tokens

| Token | Value |
|-------|-------|
| Primary teal | `#4a9380` |
| Sidebar bg | `#f3f5f6` |
| Form bg | `#fcfefe` |
| Card shadow | `0px 2px 2px rgba(0,0,0,0.25)` |
| Border light | `#eef0ef` |
| Border medium | `#ccc` |
| Text dark | `#161616` |
| Text primary | `#333` |
| Text secondary | `#666` |
| Text muted | `#999` |

### Event Type Colors
| Type | Color |
|------|-------|
| Wedding | `#055e5a` |
| Bachelorette | `#3ba59a` |
| Quinceañera | `#e5c236` |
| Baby Shower | `#e28dd6` |
| Fund Raiser | `#8b5cf6` |

---

## Presentation Generation (PDF Output)

### Slide Structure
The presentation is a vertical scroll layout with 15 "slides":

| # | Slide | Type | Data Source |
|---|-------|------|-------------|
| 1 | Title/Header | Dynamic | `eventName`, `eventDate` |
| 2 | Inspirational Photos + Color Palette | Dynamic | `inspirationImages[]`, `colorPalette[]` |
| 3 | Featured Blooms | Dynamic | `featuredBlooms[].image` |
| 4 | Custom Floral Recipes | Dynamic | `recipes[]` |
| 5 | Shopping List | Dynamic | **TBD - needs data model update** |
| 6-15 | Resources, Tips, Checklists | Static | Same for all proposals |

### Reference Files
```
figma-reference/
├── MCP-Presentation-MacBookAir1-RAW.jsx    # React + Tailwind code from Figma
├── PRESENTATION-DATA-MAPPING.md            # Form → Presentation field mapping
├── presentation_assets/                     # Downloaded images (50 files)
│   ├── header-bg.png
│   ├── inspiration-*.png
│   ├── bloom-*.png
│   ├── color-*.svg
│   ├── recipe-*.png
│   ├── product-*.png
│   └── ...
└── presentation_screenshots/                # Manual screenshots of all slides
```

### Consultation Tier Architecture (CONFIRMED)

**Basic Consultation:**
- Featured Blooms → Consultant sets quantities directly → Shopping List
- Client gets template recipes (general guidance)

**Professional/Deluxe Consultation:**
- Featured Blooms → Custom Recipes (use blooms as ingredients) → Shopping List (calculated)
- Shopping list quantities are auto-calculated from recipe needs

**Key insight:** Featured Blooms are the "palette" of products. For Professional, recipes reference these as ingredients, and the shopping list is derived from recipe totals.

### Data Model Gaps (for Shopping List slide)
See `figma-reference/PRESENTATION-DATA-MAPPING.md` for full analysis. Key missing fields:
- `recipes[].ingredients[].bloomIndex` - Link ingredient to Featured Bloom (for calculations)
- `recipes[].description` - Text description for recipe cards
- `couponCode` - Discount code for shopping list
- `discountPercent` - Discount percentage

**Needs Stakeholder Input:**
- Stem/unit math: How do recipe counts map to product variants?
- Variant selection: Auto-select or consultant chooses?

---

## Session Features

- **Auto-save**: Changes save to Firestore after 1.5s of inactivity
- **Session caching**: Proposals cached for 5 minutes to reduce reads
- **Logout clears cache**: Sign out clears sessionStorage for fresh start
- **Loading animation**: 1.2s minimum display in main content area

---

## Available Shopify API Access (Backend Discovery)

The f50-aws-lambda backend has existing Shopify integrations that can be leveraged for the shopping list feature.

### 1. Search Products Lambda ✅ (Already Using)
**Endpoint**: `/search-products`
**API**: Shopify Storefront API (public, no auth required)

```javascript
// Search products by name
GET /search-products?q=roses&limit=8
// Response: { products: [{ handle, title, url, image, price, priceMin, priceMax }] }

// Get full product details by handle
GET /search-products/{handle}
// Response: { id, handle, title, description, vendor, type, tags, price,
//             priceMin, priceMax, available, images[], featuredImage,
//             variants: [{ id, title, price, available, sku, option1, option2, option3 }],
//             options[] }
```

**Relevance**: Product search is complete. Variants include price, SKU, and availability - useful for shopping list.

### 2. Get Collections Lambda
**Location**: `functions/get-collections/`
**API**: Shopify Admin GraphQL API

```javascript
// Returns: collections with id, title, handle, templateSuffix, image
// Has pagination support (cursor-based)
// Filters for custom collections only
```

**Relevance**: Could organize products by flower category (Focal, Filler, Line, Greenery) if collections are set up this way.

### 3. Get Metaobjects Lambda
**Location**: `functions/get-metaobjects/`
**API**: Shopify Admin GraphQL API

```javascript
// Retrieves metaobjects with fields: title, gallery, flower_type_filter,
// color_filter, theme_style_filter, occasion_filter
```

**Relevance**: Could be useful for flower categorization and filtering if metaobjects are configured for this purpose.

### 4. Product Metafields (via Share Your Flair)
**Location**: `functions/process-share-your-flair/queries.js`
**API**: Shopify Admin GraphQL API

```javascript
// getProductMetafields(productId) - Gets metafields from "custom" namespace
// Returns: namespace, key, value, type
// Known fields: product_theme, product_color, roles
```

**Relevance**: Product metadata could help categorize flowers (Focal/Filler/etc.) if stored in metafields.

### 5. Order/Customer Operations
**Location**: `functions/delegate-create-new-order/queries.js`
**API**: Shopify Admin GraphQL API

Available operations:
- `beginEdit`, `addVariant`, `commitEdit` - Order editing
- `tagOrder` - Add tags to orders
- `getOrderFulfillmentOrders` - Get fulfillment data
- `getCustomerTags` - Get customer tags
- `getOrderMetafields`, `getDraftOrderMetafields` - Get metafields

**Relevance**: Future use for creating shopping carts or draft orders.

### Authentication Setup
**Location**: `dependencies/nodejs/index.js`

```javascript
// Shared Shopify header used across Lambda functions
exports.SHOPIFY_HEADER = {
  "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
  "Content-Type": "application/json",
};
```

Environment variables (in `template-bb-dev.yml`):
- `SHOPIFY_ACCESS_TOKEN` - Admin API access token
- `SHOPIFY_SITE_URL` - Store URL with auth (for Admin API)
- `SHOPIFY_BASE_URL` - Store URL without auth (for Storefront API)
- `API_VERSION` - Shopify API version

### What We Have vs. What We Need for Shopping List

| Need | Status | Source |
|------|--------|--------|
| Product search | ✅ Complete | search-products Lambda |
| Product details (name, image, price) | ✅ Complete | search-products/{handle} |
| Product variants with pricing | ✅ Complete | search-products/{handle} |
| Product categories (Focal/Filler/etc.) | ⚠️ **Needs Lambda Update** | Product tags (see below) |
| Product URLs | ✅ Can construct | `https://fiftyflowers.com/products/{handle}` |
| Create draft orders | ✅ Available | delegate-create-new-order (not yet used) |

### Product Category Discovery (Tested March 2026)

**Finding**: FiftyFlowers products HAVE category tags, but our Lambda uses the wrong endpoint.

| Tag | Category |
|-----|----------|
| `Uses_Bulk Focal` | Focal Flowers |
| `Uses_Bulk Filler` | Filler Flowers |
| `Uses_Bulk Line` | Line Flowers |
| `Uses_Bulk Greens` | Greenery |

**The Problem**:
- Our Lambda uses `/products/{handle}.js` → returns `tags: []` (empty)
- Shopify's `/products/{handle}.json` → returns full tags string

**Test Results**:
```bash
# Our Lambda (uses .js endpoint) - EMPTY TAGS
curl ".../search-products/red-ecuadorian-roses"
# Returns: { "tags": [], "type": "Bulk", ... }

# Shopify .json endpoint - HAS CATEGORY TAGS
curl "https://www.fiftyflowers.com/products/quicksand-cream-roses.json"
# Returns: { "tags": "..., Uses_Bulk Focal, ..." }
```

**Solution Options**:
1. **Update Lambda** - Change search-products to use `.json` instead of `.js` endpoint
2. **Parse tag string** - Tags come as comma-separated string, need to split
3. **Alternative**: Use collections API - products are also in category collections:
   - `best-selling-focal-flowers`
   - `best-selling-filler-flowers`
   - `all-greenery`

**Additional Tag Info Available**:
- `Colors_*` - Color categorization (e.g., `Colors_White`, `Colors_Blush`)
- `Flower Type_*` - Flower type (e.g., `Flower Type_Roses Standard`)
- `Roles_*` - Season availability (e.g., `Roles_Fall`, `Roles_Spring`)
