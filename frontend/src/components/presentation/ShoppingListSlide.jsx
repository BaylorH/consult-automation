// ShoppingListSlide - Shopping list for presentation
// Uses same calculation logic as ShoppingList.jsx in form

import { useMemo } from 'react';
import SlideWrapper from './SlideWrapper';
import { getDiscountForCode } from '../../utils/couponCodes';

export default function ShoppingListSlide({
  recipes = [],
  featuredBlooms = [],
  isBasicConsultation = false,
  eventDate = '',
  deliveryDate = '',
  couponCode = 'Consult2026',
  savedSelections = {}
}) {
  // Get discount percentage from coupon code lookup
  const discountPercent = getDiscountForCode(couponCode);
  // Helper to extract quantity and unit from variant label
  const parseVariantLabel = (label) => {
    if (!label) return { quantity: 0, unit: 'stems', isBunches: false, explicitStems: false };

    const stemMatch = label.match(/^(\d+)\s*(Roses?|Stems?|Garden Roses?|Ranunculus|Anemone|Dahlia|Peony|Hydrangea|Lisianthus|Carnation|Tulip|Delphinium|Stock|Eucalyptus|Ruscus|Fern)/i);
    if (stemMatch) {
      return {
        quantity: parseInt(stemMatch[1], 10),
        unit: 'stems',
        isBunches: false,
        explicitStems: true
      };
    }

    const bunchMatch = label.match(/^(\d+)\s*bunch/i);
    if (bunchMatch) {
      return {
        quantity: parseInt(bunchMatch[1], 10),
        unit: 'bunches',
        isBunches: true,
        explicitStems: false
      };
    }

    const match = label.match(/^(\d+)/);
    const quantity = match ? parseInt(match[1], 10) : 0;
    return { quantity, unit: 'stems', isBunches: false, explicitStems: false };
  };

  // Calculate total stems for a variant (accounting for bunches)
  const calculateTotalStems = (label, stemsPerBunch) => {
    const { quantity, isBunches, explicitStems } = parseVariantLabel(label);

    if (explicitStems) {
      return quantity;
    }

    if (isBunches && stemsPerBunch) {
      return quantity * stemsPerBunch;
    }

    return quantity;
  };

  // Find the best variant for a given stem need
  const findSuggestedVariant = (bloom, stemsNeeded) => {
    const options = bloom.options || [];
    if (options.length === 0) return { variant: null, index: 0 };

    const stemsPerBunch = bloom.stemsPerBunch || null;

    // Parse all variants with total stem counts
    const parsedVariants = options.map((opt, idx) => {
      const totalStems = calculateTotalStems(opt.label, stemsPerBunch);
      return { ...opt, totalStems, originalIndex: idx };
    }).sort((a, b) => a.totalStems - b.totalStems);

    // Find smallest variant that covers the need
    const coveringVariant = parsedVariants.find(v => v.totalStems >= stemsNeeded);

    if (coveringVariant) {
      return { variant: coveringVariant, index: coveringVariant.originalIndex };
    }

    // If none covers, use the largest
    const largest = parsedVariants[parsedVariants.length - 1];
    return { variant: largest, index: largest.originalIndex };
  };

  // Calculate shopping items based on consultation type
  const shoppingItems = useMemo(() => {
    // BASIC: Use featured blooms directly
    if (isBasicConsultation && recipes.length === 0 && featuredBlooms.length > 0) {
      return featuredBlooms.map((bloom) => {
        const selectedIdx = bloom.selectedOption || 0;
        const selectedVariant = bloom.options?.[selectedIdx] || null;
        const { quantity } = selectedVariant ? parseVariantLabel(selectedVariant.label) : { quantity: 0 };

        return {
          productHandle: bloom.productHandle || bloom.handle,
          name: bloom.name,
          category: bloom.category || 'Uncategorized',
          image: bloom.image || null,
          stemsNeeded: quantity,
          selectedVariant: selectedVariant?.label || '',
          variantId: selectedVariant?.variantId || null,
          price: selectedVariant?.price || 0,
        };
      });
    }

    // PROFESSIONAL: Aggregate from recipes
    const totals = {};

    recipes.forEach((recipe) => {
      const recipeQty = recipe.quantity || 1;

      (recipe.ingredients || []).forEach((ing) => {
        const handle = ing.productHandle || '';
        const count = parseFloat(ing.count) || 0;

        if (!handle) return;

        if (!totals[handle]) {
          totals[handle] = {
            productHandle: handle,
            name: ing.name || '',
            stemsNeeded: 0,
          };
        }

        totals[handle].stemsNeeded += count * recipeQty;
      });
    });

    // Match each total to its featured bloom and use saved selection or find best variant
    return Object.values(totals).map((item) => {
      const bloom = featuredBlooms.find(
        (b) => b.productHandle === item.productHandle || b.handle === item.productHandle
      );

      if (!bloom) {
        return {
          ...item,
          category: 'Unknown',
          image: null,
          selectedVariant: '',
          price: 0,
        };
      }

      // Check if user has a saved selection for this product
      const savedIndex = savedSelections[item.productHandle];
      let variant;

      if (savedIndex !== undefined && bloom.options?.[savedIndex]) {
        // Use the user's saved selection
        variant = bloom.options[savedIndex];
      } else {
        // Fall back to calculating the best variant
        const result = findSuggestedVariant(bloom, item.stemsNeeded);
        variant = result.variant;
      }

      return {
        ...item,
        name: bloom.name || item.name,
        category: bloom.category || 'Uncategorized',
        image: bloom.image || null,
        selectedVariant: variant?.label || '',
        variantId: variant?.variantId || null,
        price: variant?.price || 0,
      };
    });
  }, [recipes, featuredBlooms, isBasicConsultation, savedSelections]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {
      'Focal Flowers': [],
      'Filler Flowers': [],
      'Line Flowers': [],
      'Greenery': [],
    };

    shoppingItems.forEach((item) => {
      const category = item.category || 'Uncategorized';
      if (groups[category]) {
        groups[category].push(item);
      } else {
        if (!groups['Other']) groups['Other'] = [];
        groups['Other'].push(item);
      }
    });

    return groups;
  }, [shoppingItems]);

  // Calculate totals
  const subtotal = shoppingItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  // Build Shopify cart URL from selected variants
  const cartUrl = useMemo(() => {
    const cartItems = shoppingItems
      .map(item => item.variantId ? `${item.variantId}:1` : null)
      .filter(Boolean);

    if (cartItems.length === 0) return 'https://www.fiftyflowers.com';
    return `https://www.fiftyflowers.com/cart/${cartItems.join(',')}`;
  }, [shoppingItems]);

  // Format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds !== undefined) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Calculate order by date (11 days before delivery)
  const getOrderByDate = () => {
    if (!deliveryDate) return '';
    try {
      let date;
      if (deliveryDate.toDate) {
        date = deliveryDate.toDate();
      } else if (deliveryDate.seconds !== undefined) {
        date = new Date(deliveryDate.seconds * 1000);
      } else {
        date = new Date(deliveryDate);
      }
      date.setDate(date.getDate() - 11);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  if (shoppingItems.length === 0) {
    return null;
  }

  return (
    <SlideWrapper noPadding className="bg-[#f8f9fa]">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        {/* Header */}
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[30px]">
          Your Wedding Shopping List
        </h2>

        {/* Info tags */}
        <div className="flex justify-center flex-wrap gap-x-[60px] gap-y-[15px] mb-[60px] text-[14px] font-['Nunito_Sans',sans-serif]">
          {eventDate && (
            <div className="text-center">
              <span className="font-bold text-[#055e5a] uppercase">Event Date:</span>
              <span className="ml-2 text-[#333]">{formatDate(eventDate)}</span>
            </div>
          )}
          {deliveryDate && (
            <div className="text-center">
              <span className="font-bold text-[#055e5a] uppercase">Delivery Date:</span>
              <span className="ml-2 text-[#333]">{formatDate(deliveryDate)}</span>
            </div>
          )}
          {couponCode && discountPercent > 0 && (
            <div className="text-center">
              <span className="font-bold text-[#055e5a] uppercase">Coupon Code:</span>
              <span className="ml-2 text-[#333] font-mono bg-[#e8f4f1] px-2 py-1 rounded">{couponCode}</span>
              <span className="ml-2 text-[#4a9380]">({discountPercent}% off)</span>
            </div>
          )}
        </div>

        {/* Product grid by category */}
        <div className="flex flex-col gap-[40px] w-full max-w-[1200px]">
          {Object.entries(groupedItems).map(([category, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[20px] uppercase mb-[20px] border-b-2 border-[#055e5a] pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-3 gap-[20px]">
                  {items.map((item, idx) => (
                    <ProductCard key={idx} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="mt-[60px] bg-white border-2 border-[#055e5a] rounded-[8px] p-[40px] w-full max-w-[600px]">
          {/* Pricing Section */}
          <div className="mb-[20px]">
            <div className="flex justify-between mb-[8px] font-['Nunito_Sans',sans-serif]">
              <span className="text-[#333] text-[16px] uppercase font-bold">Subtotal</span>
              <span className="text-[#333] text-[16px]">{formatPrice(subtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between mb-[8px] font-['Nunito_Sans',sans-serif]">
                <span className="text-[#4a9380] text-[14px]">
                  Consultation Discount ({discountPercent}%) Code: {couponCode}
                </span>
                <span className="text-[#4a9380] text-[14px]">-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between pt-[12px] border-t border-[#ddd] font-['Nunito_Sans',sans-serif]">
              <span className="text-[#4a9380] text-[18px] font-bold">Total</span>
              <span className="text-[#333] text-[18px] font-bold">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Dates Section */}
          <div className="mb-[30px] font-['Nunito_Sans',sans-serif] text-[14px]">
            {getOrderByDate() && (
              <div className="flex mb-[6px]">
                <span className="text-[#333] font-bold w-[120px]">Order By:</span>
                <span className="text-[#333]">{getOrderByDate()}</span>
              </div>
            )}
            {deliveryDate && (
              <div className="flex mb-[6px]">
                <span className="text-[#333] font-bold w-[120px]">Delivery Date:</span>
                <span className="text-[#333]">{formatDate(deliveryDate)}</span>
              </div>
            )}
            {eventDate && (
              <div className="flex">
                <span className="text-[#333] font-bold w-[120px]">Event Date:</span>
                <span className="text-[#333]">{formatDate(eventDate)}</span>
              </div>
            )}
          </div>

          {/* Purchase Button - links to pre-filled Shopify cart */}
          <a
            href={cartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit bg-[#4a9380] hover:bg-[#3d7a6a] text-white font-['Nunito_Sans',sans-serif] font-bold text-[14px] uppercase px-[30px] py-[15px] rounded-[25px] transition-colors"
          >
            Purchase All Proposal Items
          </a>
        </div>
      </div>
    </SlideWrapper>
  );
}

function ProductCard({ item }) {
  const formatPrice = (price) => `$${price.toFixed(2)}`;

  return (
    <div className="bg-white border border-[#ddd] rounded-[8px] overflow-hidden shadow-sm">
      {/* Product image */}
      <div className="w-full h-[120px] overflow-hidden bg-[#f5f5f5]">
        {item.image ? (
          <img
            alt={item.name}
            src={item.image}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#999]">
            No image
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-[15px]">
        <p className="font-['Avenir',sans-serif] font-bold text-[#333] text-[14px] uppercase truncate mb-[5px]">
          {item.name}
        </p>
        <p className="font-['Avenir',sans-serif] text-[#666] text-[12px] mb-[10px]">
          {item.selectedVariant || 'Not selected'}
        </p>
        {item.stemsNeeded > 0 && (
          <p className="font-['Avenir',sans-serif] text-[#4a9380] text-[12px] mb-[10px]">
            Needs: {item.stemsNeeded} stems
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="font-['Avenir',sans-serif] font-bold text-[#333] text-[16px]">
            {formatPrice(item.price)}
          </span>
          <a
            href={`https://www.fiftyflowers.com/products/${item.productHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#055e5a] text-[12px] underline font-['Avenir',sans-serif]"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}
