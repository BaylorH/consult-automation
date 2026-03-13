// Shopping List Component - Dynamic calculation from recipes OR direct from featured blooms
// For Professional: calculates stems from recipes
// For Basic: uses featured blooms directly with their selected variant

import { useMemo } from 'react';

export default function ShoppingList({ recipes = [], featuredBlooms = [], isBasicConsultation = false, deliveryDate = '' }) {
  // Helper to extract stem count from variant label
  const parseStemCount = (label) => {
    if (!label) return 0;
    const match = label.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Calculate shopping items based on consultation type
  const shoppingItems = useMemo(() => {
    // BASIC CONSULTATION: Use featured blooms directly with their selected variant
    if (isBasicConsultation && recipes.length === 0 && featuredBlooms.length > 0) {
      return featuredBlooms.map((bloom) => {
        const selectedIdx = bloom.selectedOption || 0;
        const selectedVariant = bloom.options?.[selectedIdx] || null;
        const stemCount = selectedVariant ? parseStemCount(selectedVariant.label) : 0;

        return {
          productHandle: bloom.productHandle || bloom.handle,
          name: bloom.name,
          category: bloom.category || 'Uncategorized',
          image: bloom.image || null,
          stemsNeeded: stemCount,
          suggestedVariant: selectedVariant ? { ...selectedVariant, stemCount } : null,
          price: selectedVariant?.price || 0,
          usedIn: [], // No recipes for basic
        };
      });
    }

    // PROFESSIONAL CONSULTATION: Aggregate from recipes
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
            usedIn: [],
          };
        }

        totals[handle].stemsNeeded += count * recipeQty;
        totals[handle].usedIn.push({
          recipeName: recipe.name,
          recipeQty,
          stemsPerRecipe: count,
        });
      });
    });

    // Match each total to its featured bloom for variant info
    const items = Object.values(totals).map((item) => {
      // Find the bloom in featuredBlooms by productHandle or handle
      const bloom = featuredBlooms.find(
        (b) => b.productHandle === item.productHandle || b.handle === item.productHandle
      );

      if (!bloom) {
        return {
          ...item,
          category: 'Unknown',
          image: null,
          suggestedVariant: null,
          price: 0,
        };
      }

      // Find the smallest variant that covers the needed stems
      let suggestedVariant = null;
      let suggestedPrice = 0;
      let quantityNeeded = 1;

      if (bloom.options && bloom.options.length > 0) {
        // Parse stem counts and sort by stems ascending
        const variantsWithStems = bloom.options.map((opt) => ({
          ...opt,
          stemCount: parseStemCount(opt.label),
        })).sort((a, b) => a.stemCount - b.stemCount);

        // Find the smallest variant that covers the need with 1 unit
        const coveringVariant = variantsWithStems.find(
          (v) => v.stemCount >= item.stemsNeeded
        );

        if (coveringVariant) {
          // Single variant covers the need
          suggestedVariant = coveringVariant;
          suggestedPrice = coveringVariant.price;
          quantityNeeded = 1;
        } else {
          // No single variant covers it - use the largest and calculate how many needed
          const largest = variantsWithStems[variantsWithStems.length - 1];
          if (largest && largest.stemCount > 0) {
            quantityNeeded = Math.ceil(item.stemsNeeded / largest.stemCount);
            suggestedVariant = {
              ...largest,
              label: `${largest.label} × ${quantityNeeded}`,
            };
            suggestedPrice = largest.price * quantityNeeded;
          }
        }
      }

      return {
        ...item,
        name: bloom.name || item.name,
        category: bloom.category || 'Uncategorized',
        image: bloom.image || null,
        suggestedVariant,
        quantityNeeded,
        price: suggestedPrice,
      };
    });

    return items;
  }, [recipes, featuredBlooms, isBasicConsultation]);

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
        // Put uncategorized items in a separate group
        if (!groups['Other']) groups['Other'] = [];
        groups['Other'].push(item);
      }
    });

    return groups;
  }, [shoppingItems]);

  // Calculate totals
  const subtotal = shoppingItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const discountPercent = 15; // Consultation discount
  const discount = subtotal * (discountPercent / 100);
  const total = subtotal - discount;

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  // Format delivery date for display
  const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
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

  // Format "used in" description
  const formatUsedIn = (usedIn) => {
    return usedIn
      .map((u) => {
        if (u.recipeQty > 1) {
          return `${u.stemsPerRecipe} stems in ${u.recipeName} (x${u.recipeQty})`;
        }
        return `${u.stemsPerRecipe} stems in ${u.recipeName}`;
      })
      .join(', ');
  };

  return (
    <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-full">
      <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
        Shopping List ({shoppingItems.length})
      </p>
      <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[18px]">
        {isBasicConsultation
          ? "Based on your selected blooms, here's what to purchase for your client's event."
          : "Based on your floral recipes, here's what we recommend purchasing for your client's event."
        }
      </p>

      <div className="border border-[#f1f1f1] border-solid flex flex-col gap-[15px] p-[30px] rounded-[5px] w-full">
        {/* Grouped items by category */}
        {Object.entries(groupedItems).map(([category, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={category}>
              <p className="font-['Avenir:Heavy',sans-serif] h-[30px] text-[#161616] text-[18px] mb-[10px]">
                {category}
              </p>

              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#ccc] border-solid flex items-center gap-[20px] p-[15px] rounded-[5px] w-full mb-[10px]"
                >
                  {/* Product Image */}
                  {item.image && (
                    <div className="border border-[#999] border-solid size-[60px] shrink-0 overflow-hidden">
                      <img
                        alt={item.name}
                        className="object-cover size-full"
                        src={item.image}
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                    <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[16px] uppercase">
                      {item.name}
                    </p>
                    <div className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                      {isBasicConsultation ? (
                        // Basic: Just show selected quantity and price
                        <>
                          {item.suggestedVariant && (
                            <p className="mb-1">
                              <span className="font-['Avenir:Heavy',sans-serif]">Quantity</span>
                              <span>: {item.suggestedVariant.label}</span>
                            </p>
                          )}
                          <p className="mt-2 font-['Avenir:Heavy',sans-serif]">
                            {formatPrice(item.price)}
                          </p>
                        </>
                      ) : (
                        // Professional: Show needed, suggested, used in, price
                        <>
                          <p className="mb-1">
                            <span className="font-['Avenir:Heavy',sans-serif]">Needed</span>
                            <span>: {item.stemsNeeded} Stems</span>
                          </p>
                          {item.suggestedVariant && (
                            <p className="mb-1">
                              <span className="font-['Avenir:Heavy',sans-serif]">Suggested</span>
                              <span>: {item.suggestedVariant.label}</span>
                              {item.suggestedVariant.stemCount && item.suggestedVariant.stemCount > item.stemsNeeded && (
                                <span className="text-[#666] text-[12px] ml-1">
                                  (+{item.suggestedVariant.stemCount - item.stemsNeeded} extra)
                                </span>
                              )}
                            </p>
                          )}
                          {item.usedIn && item.usedIn.length > 0 && (
                            <p className="mb-1 text-[#666] text-[12px]">
                              Used in: {formatUsedIn(item.usedIn)}
                            </p>
                          )}
                          <p className="mt-2 font-['Avenir:Heavy',sans-serif]">
                            {formatPrice(item.price)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* View Product Button */}
                  <a
                    href={`https://www.fiftyflowers.com/products/${item.productHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-outline shrink-0"
                  >
                    View Product
                  </a>
                </div>
              ))}
            </div>
          );
        })}

        {/* Totals Section */}
        {shoppingItems.length > 0 && (
          <div className="border border-[#ccc] border-solid rounded-[5px] p-[20px] mt-[20px] w-[550px] mx-auto">
            <div className="flex justify-between">
              <div className="font-['Avenir:Heavy',sans-serif] text-[14px] text-black">
                <p className="mb-1">Subtotal:</p>
                <p className="mb-1">Consultation Discount ({discountPercent}%):</p>
                <p className="mb-0 mt-3 text-[16px]">Total:</p>
                {deliveryDate && (
                  <p className="mb-0 mt-4 text-[14px]">Delivery Date:</p>
                )}
              </div>
              <div className="font-['Avenir:Roman',sans-serif] text-[14px] text-black text-right">
                <p className="mb-1">{formatPrice(subtotal)}</p>
                <p className="mb-1">-{formatPrice(discount)}</p>
                <p className="mb-0 mt-3 font-['Avenir:Heavy',sans-serif] text-[16px]">{formatPrice(total)}</p>
                {deliveryDate && (
                  <p className="mb-0 mt-4 text-[14px]">{formatDeliveryDate(deliveryDate)}</p>
                )}
              </div>
            </div>
            <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] mt-4">
              Your discount will be applied at checkout.
            </p>
          </div>
        )}

        {shoppingItems.length === 0 && (
          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px]">
            {isBasicConsultation
              ? 'No items to display. Add featured blooms to see the shopping list.'
              : 'No items to display. Add ingredients to your recipes to see the shopping list.'
            }
          </p>
        )}
      </div>
    </div>
  );
}
