# Consult Automation - Project Context

## What We're Building

A **Proposal Manager** web app for FiftyFlowers (floral consultation business). Consultants use it to:
1. Build flower proposals for customers (weddings, baby showers, quinceañeras, etc.)
2. Generate two outputs: a visual presentation (PDF) and a shopping list with Shopify links

**Current state:** Empty repository. Building from Figma wireframes.

**MVP Goal:** Navigable frontend that matches the Figma designs. PDF generation can come later.

---

## Figma Source

**URL:** https://www.figma.com/design/G1qPmsZBP4ygTe9CnJpgRJ/FTY---Consult-Automation

**Figma MCP:** Connected but rate-limited (6 calls/month on free tier). We extracted full metadata already.

---

## App Structure

### Groups & Frame Counts

| Group | Count | Purpose |
|-------|-------|---------|
| **Dashboard** | 2 frames (identical) | Proposal list view |
| **Form** | 11 layouts | Progressive states of proposal builder |
| **Presentation** | 3 slides | PDF output (screenshots only in Figma) |

---

## Screen 1: Dashboard

**Frame IDs:** 1:7, 134:1727 (both 1367px height, identical)

When a consultant opens the app, they see:

**Left sidebar:**
- FiftyFlowers logo
- "Proposal Manager" title
- "Create New Proposal" button
- "Recent Proposals" categorized by event type:
  - Weddings (26)
  - Baby Showers (15)
  - Quinceañera (11)
  - Fund Raiser (3)

**Main area:**
- Grid of proposal cards showing past work
- Each card: event type tag, title, cover image, last updated, consultant name
- Three buttons per card: **View** | **Edit** | **Duplicate**

**Actions:**
- "Create New Proposal" → Empty form
- "Edit" → Filled form for that proposal
- "View" → Generated presentation
- "Duplicate" → Copy existing proposal

---

## Screen 2: Proposal Form

The form has 5 sections. It grows taller as sections expand with content.

### Section 1: Consultation Proposal Set
- Customer Name, Customer Email
- Proposal Name
- **Consultation Level** (dropdown): Basic Consultation, Professional Consultation
- Event Name
- Proposal Template (dropdown): Modern Wedding Consultation
- Event Date, Delivery Date

### Section 2: Inspiration & Style
- Upload 4-8 inspirational images
- Pick 4-8 colors for palette
- Style Notes (textarea)

### Section 3: Featured Blooms
- Search bar to find flowers from Shopify inventory
- Filter by "All" or "By Color"
- Product cards show: flower name, quantity tiers with pricing, "Add Ingredient" button
- Selected flowers appear in "Current Proposal Inventory" with Remove buttons

### Section 4: Recipes (varies by tier - see below)

**Professional Consultation → Custom Floral Recipes:**
- Build recipes from scratch
- Specify exact flowers and stem counts per arrangement
- Full control: "Bridal Bouquet = 5 Quicksand Roses + 3 Antique Mauve + 2 Eucalyptus"

**Basic Consultation → Basic Floral Recipes:**
- Pre-defined arrangement templates
- Generic ratios: "18 Focal, 5 Filler, 8 Line, 5 Greenery"
- Just select template and quantity
- System calculates using flower categories from Shopify

### Section 5: Shopping List
- Starts empty: "Your shopping list will appear once you add recipes"
- After recipes: auto-calculates flowers needed
- Groups by type (Focal Flowers, Filler Flowers)
- Shows: quantity, stems needed, price, "View Product" link to Shopify
- Subtotal, Consultation Discount (15%), Total, Delivery Date

---

## Consultation Tiers

| | Basic | Professional |
|---|-------|--------------|
| **Select flowers** | Yes | Yes |
| **Flower categories** | From Shopify product data | Not needed |
| **Define arrangements** | Pick from templates | Build from scratch |
| **Specify stems per arrangement** | No (template ratios) | Yes (exact counts) |
| **Recipe section shown** | Basic Floral Recipes | Custom Floral Recipes |

**Shopify flower products have a variable indicating category:** Focal, Filler, Line, or Greenery. (Exact variable name TBD when we integrate.)

---

## Form Frame Progression (11 layouts)

### Full-Page States (8 frames)

| Frame ID | Height | Tier | State |
|----------|--------|------|-------|
| 28:471 | 1899px | Basic | Empty form, 4 photo placeholders |
| 31:44 | 1759px | Basic | Inspiration filled, style notes written |
| 31:330 | 2325px | Basic | Search active, flower results showing |
| 134:6 | 2481px | Professional | 3 flowers selected, customer info filled |
| 31:560 | 3313px | Professional | Recipe creation form open |
| 134:915 | 3131px | Basic | **Complete with Basic Floral Recipes + filled Shopping List** |
| 134:475 | 4267px | Professional | 5 recipes created, still editing |
| 134:1355 | 4267px | Professional | Same as above (minor text difference) |

### Section Components (3 frames)

| Frame ID | Height | Shows |
|----------|--------|-------|
| 5:492 | 972px | Featured Blooms: search results + current inventory |
| 19:777 | 2038px | Custom Floral Recipes: recipe list + creation form |
| 20:332 | 1190px | Shopping List: fully calculated with pricing |

These components show detailed states of form sections.

---

## Outputs

### Output 1: Visual Presentation (PDF)

3 slides shown as screenshots in Figma (66:2, 66:3, 66:4):

**Slide 1:**
- FiftyFlowers logo
- "Inspiration Photos" (3 uploaded images)
- "Color Palette" (7 color circles)
- "Featured Blooms" (grid of circular flower product images)
- Footer: "[Customer Names] said 'I Do'" | "March, 2026" | www.fiftyflowers.com

**Slide 2:**
- Logo, color palette, more inspiration photos (arrangements, ceremony, boutonniere, venue)
- Same personalized footer

**Slide 3:**
- Logo, "Featured Blooms" header, larger flower grid
- Same footer

### Output 2: Shopping List

- Itemized flowers grouped by Focal/Filler
- Each item: product name, quantity (bunches/stems), stems needed, price, "View Product" link
- Subtotal, Consultation Discount (15%), Total
- Delivery Date
- Note: "Click product names to add items to your cart. Your discount will be applied at checkout."

---

## User Flow

```
DASHBOARD (1:7)
    │
    ├─ [Create New Proposal] ──► EMPTY FORM (28:471)
    │                                   │
    │                                   ▼
    │                           Fill Inspiration & Style
    │                                   │
    │                                   ▼
    │                           Search & Select Flowers
    │                                   │
    │                    ┌──────────────┴──────────────┐
    │                    │                             │
    │              BASIC TIER                   PROFESSIONAL TIER
    │                    │                             │
    │                    ▼                             ▼
    │           Basic Floral Recipes          Custom Floral Recipes
    │           (pick templates)              (build from scratch)
    │                    │                             │
    │                    └──────────────┬──────────────┘
    │                                   │
    │                                   ▼
    │                           Shopping List Calculates
    │                                   │
    │                                   ▼
    │                           [Share Proposal]
    │                                   │
    │                    ┌──────────────┴──────────────┐
    │                    ▼                             ▼
    │           Visual Presentation           Shopping List
    │           (PDF mood board)              (Shopify links)
    │
    ├─ [Edit] on card ──► FILLED FORM (134:475, etc.)
    │
    └─ [View] on card ──► PRESENTATION (3 slides)
```

---

## Data Model (Inferred)

```
Proposal
├── id
├── customerName
├── customerEmail
├── proposalName
├── consultationLevel (Basic, Professional)
├── eventName
├── proposalTemplate
├── eventDate
├── deliveryDate
├── inspirationImages[] (4-8 URLs)
├── colorPalette[] (4-8 hex colors)
├── styleNotes
├── featuredBlooms[]
│   ├── shopifyProductId
│   ├── productName
│   ├── category (Focal, Filler, Line, Greenery)
│   ├── selectedQuantity
│   └── price
├── recipes[] (Custom) OR selectedTemplates[] (Basic)
│   ├── name
│   ├── arrangementCount
│   ├── description (Custom only)
│   ├── ingredients[] (Custom only)
│   │   ├── bloomId
│   │   ├── bloomName
│   │   └── stemCount
│   └── photoUrl
├── createdAt
├── updatedAt
├── createdBy
└── status (draft, completed)
```

---

## Tech Notes

### Shopify Integration
- Flower inventory comes from Shopify (preferred) or direct database if needed
- Products have a category variable (Focal, Filler, Line, Greenery)
- Shopping List "View Product" links go to Shopify product pages
- Related repos in parent folder: Shopify theme inspector, lambda backend

### Stack (TBD)
- Likely: Next.js + React + Tailwind
- PDF generation: TBD (not needed for MVP)

---

## Figma MCP Reference Code

We made 5 strategic MCP calls to extract React+Tailwind reference code. Files saved in `figma-reference/`:

| Call | Frame ID | File | Description |
|------|----------|------|-------------|
| 1 | 1:7 | Dashboard.jsx | Sidebar + proposal card grid |
| 2 | 28:471 | EmptyForm.jsx | Initial empty form state |
| 3 | 134:475 | FilledFormProfessional.jsx | Full form with Custom Recipes |
| 4 | 134:915 | BasicFloralRecipes.jsx | Full form with Basic Recipes |
| 5 | 20:332 | ShoppingList.jsx | Shopping list component |

**Note:** Image assets expire after 7 days. Reference code is for design extraction only - adapt to actual project stack.

**Key Colors Extracted:**
- Primary teal: `#4a9380`
- Sidebar bg: `#f3f5f6`
- Form bg: `#fcfefe`
- Card shadow: `rgba(0,0,0,0.25)`
- Event type tags: `#055e5a` (Wedding), `#3ba59a` (Bachelorette), `#e5c236` (Quinceañera), `#e28dd6` (Baby Shower)
- Text colors: `#161616` (dark), `#333` (primary), `#666` (secondary), `#999` (muted)
- Borders: `#ccc`, `#eef0ef`, `#f1f1f1`

---

## Open Questions for PM

1. **Basic tier Featured Blooms:** Do Basic consultants still select specific flowers, or is there a simpler flow? (Current assumption: they still select flowers, but use template recipes instead of custom.)

2. **Flower category variable:** What's the exact Shopify variable name for Focal/Filler/Line/Greenery?

3. **"View" action:** Does clicking "View" on a proposal card show the PDF presentation, the shopping list, or both?

4. **"Share Proposal" button:** Does this generate PDF, share a link, or both?

5. **Data persistence:** Do proposals need to be saved/retrieved from a database, or is this session-only for MVP?

6. **Authentication:** Single user, small team, or needs login system?

---

## Files in This Repo

- `CLAUDE.md` - This file (project context, auto-read by Claude Code)
- `PROJECT_CONTEXT.md` - (can be deleted, superseded by this file)
- `FIGMA_MAP.md` - (can be deleted, superseded by this file)
- `FIGMA_FLOW.md` - (can be deleted, superseded by this file)
