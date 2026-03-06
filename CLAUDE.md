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

### Pending
- **Share proposal functionality**
- **PDF generation** - Visual presentation output

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
```

---

## Firestore Data Model

```javascript
proposals/{id}
├── type: "Wedding" | "Bachelorette" | "Quinceañera" | "Baby Shower" | "Fund Raiser"
├── typeColor: "#055e5a" // Tag color
├── eventName: "Jonathan & Amanda's Wedding Flowers"
├── cardImage: "/images/proposal-card-1.png" // Local path
├── author: "Becky Memmo"
├── customerName: "Jonathan & Amanda Smith"
├── customerEmail: "email@example.com"
├── proposalName: "Jonathan & Amanda's - March 26"
├── consultationLevel: "Professional Consultation" | "Basic Consultation"
├── proposalTemplate: "Modern Wedding Consultation"
├── eventDate: Timestamp
├── deliveryDate: Timestamp
├── styleNotes: "Romantic garden theme..."
├── inspirationImages: ["/images/...", ...] // 4-8 images
├── colorPalette: ["#f9e8cc", "#f5dbdd", ...] // 4-8 hex colors
├── featuredBlooms: [...]
├── recipes: [...] // Professional only
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

---

## Related Repositories

### f50-aws-lambda (Backend)
- **Location**: `/Users/baylorharrison/Documents/GitHub/f50-aws-lambda`
- **BB Dev Template**: `template-bb-dev.yml`
- **API Base URL**: `https://ff-api.fiftyflowers.com/api/v1` (prod)

#### Relevant Branches
| Project | Branch | Status |
|---------|--------|--------|
| FiftyFlowers Internal AI | `baylor/internal-ai-clean` | PR pending |
| Share Your Flair | `baylor/share-your-flair` | In development |
| Consult Automation | `baylor/consult-automation` | Created, adds SearchProducts |
| Combined BB Dev | `baylor/bb-dev-combined` | All 3 projects merged |

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

## Session Features

- **Auto-save**: Changes save to Firestore after 1.5s of inactivity
- **Session caching**: Proposals cached for 5 minutes to reduce reads
- **Logout clears cache**: Sign out clears sessionStorage for fresh start
- **Loading animation**: 1.2s minimum display in main content area
