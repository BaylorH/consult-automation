# Consult Automation - Project Context

## Overview
Proposal Manager web app for FiftyFlowers floral consultation business. Allows staff to create, edit, and manage floral consultation proposals for weddings, baby showers, quinceañeras, and other events.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Hosting:** Firebase Hosting (https://consult-automation.web.app)
- **Database:** Firebase Firestore
- **Auth:** Firebase Google Authentication (@fiftyflowers.com domain restricted)
- **Backend:** AWS Lambda (f50-aws-lambda repo) for Shopify product search

## Project Structure
```
consult-automation/
├── frontend/
│   ├── src/
│   │   ├── assets/images/     # Local bundled assets (logos, icons)
│   │   ├── components/
│   │   │   ├── Layout.jsx     # Main layout with sidebar
│   │   │   ├── BasicFloralRecipes.jsx
│   │   │   ├── ShoppingList.jsx
│   │   │   └── DevTools.jsx   # Dev tools panel (seed/clear DB)
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Google auth login page
│   │   │   ├── DashboardContent.jsx  # Recent proposals list
│   │   │   └── ProposalFormContent.jsx  # Proposal builder form
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx    # Firebase auth hook
│   │   │   ├── useProposals.jsx  # Firestore proposals + session caching
│   │   │   └── useProductSearch.jsx  # Shopify product search
│   │   ├── lib/
│   │   │   ├── firebase.js    # Firebase config
│   │   │   └── api.js         # API config for Lambda
│   │   └── data/
│   │       └── seedProposals.js  # Sample data for seeding DB
│   ├── public/images/         # Static images (proposal cards, etc)
│   └── dist/                  # Build output
└── firebase.json              # Firebase hosting config
```

## Key Features Implemented

### Authentication
- Google Sign-In with @fiftyflowers.com domain restriction
- Protected routes redirect to login

### Dashboard (Recent Proposals)
- Lists all proposals from Firestore
- Proposal cards with type, name, image, date, author
- View/Edit/Duplicate actions

### Proposal Builder Form
- Two tiers: Basic Consultation, Professional Consultation
- Form fields: Customer info, event details, dates
- Inspiration Images: Add via URL or file upload (drag & drop supported)
- Color Palette: Quick pick swatches or custom color picker
- Featured Blooms: Search Shopify products via Lambda API
- Floral Recipes: Create custom recipes with ingredients (Professional only)
- Shopping List: Auto-generated from recipes

### Auto-Save
- Debounced auto-save (1.5s after changes)
- Creates new proposals automatically
- Updates existing proposals
- Status indicator: Saving/Saved/Unsaved/Error

### Session Storage Caching
- Caches Firestore queries for 5 minutes
- Reduces database reads on navigation
- Invalidates on create/update/delete

### Local Assets
- All images downloaded from Figma and stored locally
- UI assets in src/assets/images/ (bundled)
- Data images in public/images/ (static)
- No more external Figma API calls

## Lambda Endpoints (BB Dev)
- `GET /search-products?q=query` - Search Shopify products
- `GET /search-products/{handle}` - Get product details

## DevTools Panel
- Available in development mode
- "Seed DB" button: Populates Firestore with sample proposals
- "Clear DB" button: Removes all proposals

## Related Repos
- `f50-aws-lambda`: Lambda functions including SearchProducts
- `internal-company-ai`: Reference for flower animation and profile UI

## TODO
- [ ] Flower celebration animation on login
- [ ] User profile pill (avatar, name, logout) in top right
- [ ] Share proposal functionality
- [ ] PDF export
