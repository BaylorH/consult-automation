// Shopping List Component - Dynamic calculation from recipes OR direct from featured blooms
// For Professional: calculates stems from recipes
// For Basic: uses featured blooms directly with their selected variant

import { useMemo, useState, useEffect } from 'react';

export default function ShoppingList({ recipes = [], featuredBlooms = [], isBasicConsultation = false, deliveryDate = '' }) {
  // Track selected variant for each item (by product handle)
  const [selections, setSelections] = useState({});
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
          allVariants: [],
          suggestedVariantIndex: 0,
          selectedVariantIndex: 0,
          price: 0,
        };
      }

      // Parse all variants with stem counts
      const allVariants = (bloom.options || []).map((opt) => ({
        ...opt,
        stemCount: parseStemCount(opt.label),
      })).sort((a, b) => a.stemCount - b.stemCount);

      // Find the suggested variant index (smallest that covers need)
      let suggestedVariantIndex = 0;

      if (allVariants.length > 0) {
        const coveringIndex = allVariants.findIndex(
          (v) => v.stemCount >= item.stemsNeeded
        );
        suggestedVariantIndex = coveringIndex >= 0 ? coveringIndex : allVariants.length - 1;
      }

      const selectedVariant = allVariants[suggestedVariantIndex];
      const price = selectedVariant?.price || 0;

      return {
        ...item,
        name: bloom.name || item.name,
        category: bloom.category || 'Uncategorized',
        image: bloom.image || null,
        allVariants,
        suggestedVariantIndex,
        selectedVariantIndex: suggestedVariantIndex,
        price,
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

  // Get selected variant index for an item (defaults to suggested)
  const getSelectedIndex = (item) => {
    if (selections[item.productHandle] !== undefined) {
      return selections[item.productHandle];
    }
    return item.suggestedVariantIndex || 0;
  };

  // Handle variant selection
  const handleVariantSelect = (productHandle, variantIndex) => {
    setSelections(prev => ({
      ...prev,
      [productHandle]: variantIndex
    }));
  };

  // Calculate totals using selected variants
  const subtotal = shoppingItems.reduce((sum, item) => {
    const selectedIdx = getSelectedIndex(item);
    const selectedVariant = item.allVariants?.[selectedIdx];
    return sum + (selectedVariant?.price || item.price || 0);
  }, 0);
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

              {items.map((item, idx) => {
                const selectedIdx = getSelectedIndex(item);
                const selectedVariant = item.allVariants?.[selectedIdx];
                const itemPrice = selectedVariant?.price || item.price || 0;

                return (
                <div
                  key={idx}
                  className="bg-white border border-[#ccc] border-solid flex items-start gap-[20px] p-[15px] rounded-[5px] w-full mb-[10px]"
                >
                  {/* Product Image - larger */}
                  {item.image && (
                    <div className="border border-[#999] border-solid w-[120px] h-[120px] shrink-0 overflow-hidden rounded-[4px]">
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
                        // Basic: Show all variant options
                        <>
                          {item.allVariants && item.allVariants.length > 0 && (
                            <div className="flex flex-col gap-[6px] mt-2">
                              {item.allVariants.map((variant, optIdx) => (
                                <div
                                  key={optIdx}
                                  onClick={() => handleVariantSelect(item.productHandle, optIdx)}
                                  className="flex items-center gap-[8px] cursor-pointer"
                                >
                                  <div
                                    className={`border border-[#999] border-solid size-[15px] rounded-full ${
                                      selectedIdx === optIdx ? 'bg-[#4a9380] border-[#4a9380]' : 'bg-white'
                                    }`}
                                  />
                                  <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                                    {variant.label} - {formatPrice(variant.price)}
                                  </p>
                                  {optIdx === item.suggestedVariantIndex && (
                                    <span className="text-[10px] text-white bg-[#4a9380] px-[6px] py-[1px] rounded-[3px] uppercase">
                                      Suggested
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="mt-4 font-['Avenir:Heavy',sans-serif] text-[18px]">
                            {formatPrice(itemPrice)}
                          </p>
                        </>
                      ) : (
                        // Professional: Show breakdown, needed total, variant options, price
                        <>
                          {/* Breakdown showing how stems add up */}
                          {item.usedIn && item.usedIn.length > 0 && (
                            <div className="mb-4 text-[13px] text-[#555]">
                              {item.usedIn.map((u, uIdx) => {
                                const lineTotal = u.stemsPerRecipe * u.recipeQty;
                                return (
                                  <div key={uIdx} className="flex gap-[8px] mb-1">
                                    <span className="w-[220px]">
                                      {u.stemsPerRecipe} stem{u.stemsPerRecipe !== 1 ? 's' : ''} × {u.recipeName}{u.recipeQty > 1 ? ` (×${u.recipeQty})` : ''}
                                    </span>
                                    <span>=</span>
                                    <span className="w-[70px] text-right">{lineTotal} stems</span>
                                  </div>
                                );
                              })}
                              {item.usedIn.length > 1 && (
                                <div className="flex gap-[8px] border-t-2 border-[#4a9380] mt-2 pt-2">
                                  <span className="w-[220px] font-['Avenir:Heavy',sans-serif] text-[15px] text-[#333]">Total Needed</span>
                                  <span className="text-[15px] text-[#333]">=</span>
                                  <span className="w-[70px] text-right font-['Avenir:Heavy',sans-serif] text-[15px] text-[#333]">{item.stemsNeeded} stems</span>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Simple needed display if only one recipe or no breakdown */}
                          {(!item.usedIn || item.usedIn.length <= 1) && (
                            <p className="mb-4 text-[15px]">
                              <span className="font-['Avenir:Heavy',sans-serif]">Needed</span>
                              <span>: {item.stemsNeeded} stems</span>
                            </p>
                          )}
                          {/* All variant options */}
                          {item.allVariants && item.allVariants.length > 0 && (
                            <div className="flex flex-col gap-[8px] mt-3">
                              {item.allVariants.map((variant, optIdx) => {
                                const extraStems = variant.stemCount > item.stemsNeeded
                                  ? variant.stemCount - item.stemsNeeded
                                  : 0;
                                return (
                                  <div
                                    key={optIdx}
                                    onClick={() => handleVariantSelect(item.productHandle, optIdx)}
                                    className="flex items-center gap-[8px] cursor-pointer"
                                  >
                                    <div
                                      className={`border border-[#999] border-solid size-[15px] rounded-full ${
                                        selectedIdx === optIdx ? 'bg-[#4a9380] border-[#4a9380]' : 'bg-white'
                                      }`}
                                    />
                                    <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                                      {variant.label} - {formatPrice(variant.price)}
                                      {extraStems > 0 && (
                                        <span className="text-[#666] text-[12px] ml-1">(+{extraStems} extra stems)</span>
                                      )}
                                    </p>
                                    {optIdx === item.suggestedVariantIndex && (
                                      <span className="text-[10px] text-white bg-[#4a9380] px-[6px] py-[1px] rounded-[3px] uppercase">
                                        Suggested
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <p className="mt-4 font-['Avenir:Heavy',sans-serif] text-[18px]">
                            {formatPrice(itemPrice)}
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
                    className="btn-action-outline shrink-0 self-start mt-[40px]"
                  >
                    View Product
                  </a>
                </div>
              );
              })}
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
              </div>
              <div className="font-['Avenir:Roman',sans-serif] text-[14px] text-black text-right">
                <p className="mb-1">{formatPrice(subtotal)}</p>
                <p className="mb-1">-{formatPrice(discount)}</p>
                <p className="mb-0 mt-3 font-['Avenir:Heavy',sans-serif] text-[16px]">{formatPrice(total)}</p>
              </div>
            </div>
            {deliveryDate && (
              <p className="font-['Avenir:Heavy',sans-serif] text-[14px] text-black mt-4">
                Delivery Date: <span className="font-['Avenir:Roman',sans-serif]">{formatDeliveryDate(deliveryDate)}</span>
              </p>
            )}
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
