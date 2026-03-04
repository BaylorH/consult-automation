# MCP Output Merge Plan

## Overview

This document outlines how to merge the 5 Figma MCP outputs into a single React codebase while preserving **exact MCP code** (no adaptations until user approval).

---

## 1. MCP Output Analysis

### Files & Their Purposes

| MCP Call | Node ID | Purpose | Sidebar Active State |
|----------|---------|---------|---------------------|
| Call 1 - Dashboard | 1:7 | Proposal list/grid view | "Recent Proposals" |
| Call 2 - EmptyForm | 28:471 | New proposal (empty state) | "Create New Proposal" |
| Call 3 - ProfessionalForm | 134:475 | Professional consultation (filled) | "Create New Proposal" |
| Call 4 - BasicForm | 134:915 | Basic consultation (filled) | "Create New Proposal" |
| Call 5 - ShoppingList | 20:332 | Shopping list component (standalone) | N/A (component only) |

---

## 2. Key Structural Differences

### Sidebar Active States

**Dashboard (Call 1) - "Recent Proposals" is ACTIVE:**
```jsx
// Create New Proposal - INACTIVE (no border, black text)
<div className="content-stretch flex items-center justify-center px-[15px] py-[10px] relative shrink-0 w-full" data-node-id="1:36">
  <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#161616] text-[14px]" data-node-id="1:19">
    Create New Proposal
  </p>
</div>

// Recent Proposals - ACTIVE (teal border-r-4, teal text)
<div className="border-[#4a9380] border-r-4 border-solid content-stretch flex gap-[10px] items-center justify-center px-[15px] relative shrink-0 w-full" data-node-id="1:40">
  <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#4a9380] text-[16px]" data-node-id="1:41">
    Recent Proposals
  </p>
</div>
```

**Form Views (Calls 2-4) - "Create New Proposal" is ACTIVE:**
```jsx
// Create New Proposal - ACTIVE (teal border-r-4, teal text)
<div className="border-[#4a9380] border-r-4 border-solid content-stretch flex items-center justify-center px-[15px] py-[10px] relative shrink-0 w-full" data-node-id="28:478">
  <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#4a9380] text-[16px]" data-node-id="28:479">
    Create New Proposal
  </p>
</div>

// Recent Proposals - INACTIVE (no border, black text)
<div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] relative shrink-0 w-full" data-node-id="31:3">
  <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#161616] text-[16px]" data-node-id="31:4">
    Recent Proposals
  </p>
</div>
```

### Header Differences

| View | Header Text |
|------|-------------|
| Dashboard | "Proposals" |
| Forms | "Proposal Builder > New Proposal" |

### Consultation Level Differences

**Basic Consultation:**
- Shows "Proposal Template" dropdown field
- Uses template-based recipes (pre-made arrangements)
- Consultation Level dropdown shows "Basic Consultation"

**Professional Consultation:**
- NO "Proposal Template" dropdown
- Shows custom recipe builder with "Add Another Recipe" and "Create Recipe" form
- Color palette shows actual filled colors
- Featured Blooms shows "Current Proposal Inventory" section
- Consultation Level dropdown shows "Professional Consultation"

---

## 3. Proposed Component Architecture

```
frontend/src/
├── pages/
│   ├── DashboardPage.jsx        # Uses Call 1 MCP code
│   └── ProposalFormPage.jsx     # Uses Calls 2-4 MCP code (conditional)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Sidebar with active state prop
│   │   └── Header.jsx           # Header with dynamic title
│   │
│   ├── dashboard/
│   │   └── ProposalCard.jsx     # Single proposal card from Call 1
│   │
│   ├── form/
│   │   ├── ConsultationProposalSet.jsx   # Form fields section
│   │   ├── InspirationStyle.jsx          # Images + color palette + notes
│   │   ├── FeaturedBlooms.jsx            # Bloom search + inventory
│   │   ├── CustomFloralRecipes.jsx       # Professional-only recipes
│   │   ├── BasicFloralRecipes.jsx        # Basic-only templates
│   │   └── ShoppingList.jsx              # Call 5 component
│   │
│   └── shared/
│       ├── Button.jsx           # Action buttons
│       └── FormField.jsx        # Input fields
│
└── figma-reference/             # Existing MCP output files (source of truth)
```

---

## 4. Merge Strategy

### Phase 1: Static Implementation (Literal MCP Code)

**Step 1: Create Sidebar Component**
- Extract sidebar from Call 1 (Dashboard active state)
- Extract sidebar from Call 2 (Form active state)
- Create single component with `activeItem` prop that switches between the two exact MCP code blocks

**Step 2: Create Dashboard Page**
- Copy exact code from `MCP-Call-1-Dashboard-FULL.jsx`
- Keep all `data-node-id` attributes
- Keep all exact class names and spacing
- Replace sidebar section with Sidebar component (activeItem="dashboard")

**Step 3: Create Proposal Form Page (Empty State)**
- Copy exact code from `MCP-Call-2-EmptyForm-FULL.jsx`
- Keep all `data-node-id` attributes
- Replace sidebar with Sidebar component (activeItem="newProposal")

**Step 4: Create Shopping List Component**
- Copy exact code from `MCP-Call-5-ShoppingList-FULL.jsx`
- This is a standalone component, no sidebar

### Phase 2: Conditional Content (After Approval)

Once static pages are approved, add conditional rendering:

**Consultation Level Toggle:**
```jsx
// Pseudocode - actual implementation will use exact MCP code blocks
{consultationLevel === 'professional' ? (
  // Exact JSX from MCP-Call-3-ProfessionalForm
) : (
  // Exact JSX from MCP-Call-4-BasicForm
)}
```

---

## 5. Sidebar Active State Logic

### Exact Classes to Apply

**ACTIVE state:**
```
Container: "border-[#4a9380] border-r-4 border-solid content-stretch flex items-center justify-center px-[15px] py-[10px] relative shrink-0 w-full"
Text: "flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#4a9380] text-[16px]"
```

**INACTIVE state:**
```
Container: "content-stretch flex items-center justify-center px-[15px] py-[10px] relative shrink-0 w-full"
Text: "flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#161616] text-[14px]"
```

---

## 6. Form Sections Breakdown

### Shared Between Basic & Professional:
1. **Consultation Proposal Set** - Form fields (customer name, event name, dates, etc.)
2. **Inspiration & Style** - Photo uploads, color palette, style notes
3. **Featured Blooms** - Search and bloom selection
4. **Shopping List** - Empty state or filled (Call 5)

### Basic Only:
- "Proposal Template" dropdown field
- Template-based recipe selection

### Professional Only:
- "Custom Floral Recipes" section with:
  - Recipe cards grid
  - "Add Another Recipe" button
  - "Create Recipe" form
- "Current Proposal Inventory" in Featured Blooms

---

## 7. Route Structure

```
/                     → Dashboard (Call 1)
/proposal/new         → Empty Form (Call 2)
/proposal/:id         → Filled Form (Call 3 or 4 based on consultationLevel)
```

---

## 8. Implementation Order

1. **Create Sidebar component** with exact MCP code for both states
2. **Create DashboardPage** using Call 1 MCP code
3. **Create ProposalFormPage (empty)** using Call 2 MCP code
4. **Create ShoppingList component** using Call 5 MCP code
5. **User reviews static output** (screenshot comparison)
6. **Add dynamic functionality** after approval:
   - React state
   - Event handlers
   - Conditional rendering for Basic vs Professional

---

## 9. Files to Create (Phase 1)

| File | Source MCP | Description |
|------|------------|-------------|
| `Sidebar.jsx` | Calls 1 & 2 | Sidebar with active state switching |
| `DashboardPage.jsx` | Call 1 | Full dashboard with proposal grid |
| `ProposalFormPage.jsx` | Call 2 | Empty form state |
| `ShoppingList.jsx` | Call 5 | Shopping list component |

---

## 10. Questions for User

Before implementation:

1. Should we start with just the static Dashboard and Empty Form pages?
2. Do you want the Basic vs Professional toggle to be a dropdown in the form, or separate routes?
3. Should the Shopping List always be visible (with empty state), or hidden until recipes exist?
