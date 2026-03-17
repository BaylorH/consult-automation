// Shopping List Component - Dynamic calculation from recipes OR direct from featured blooms
// For Professional: calculates stems from recipes
// For Basic: uses featured blooms directly with their selected variant

import { useMemo, useState, useEffect, useRef } from 'react';

export default function ShoppingList({
  recipes = [],
  featuredBlooms = [],
  isBasicConsultation = false,
  deliveryDate = '',
  couponCode = 'Consult2026',
  discountPercent = 15,
  savedSelections = {},  // Persisted selections from Firestore
  onSelectionsChange = null  // Callback to save selections
}) {
  // Track selected variant for each item (by product handle)
  // Initialize from saved selections
  const [selections, setSelections] = useState(savedSelections);
  const initializedRef = useRef(false);

  // Sync selections when savedSelections changes (e.g., on load)
  useEffect(() => {
    if (!initializedRef.current && Object.keys(savedSelections).length > 0) {
      setSelections(savedSelections);
      initializedRef.current = true;
    }
  }, [savedSelections]);
  // Helper to extract quantity and unit from variant label
  // Handles formats like:
  //   "25 Roses (1 Bunch)" → 25 stems (explicit stem count)
  //   "24 Garden Roses" → 24 stems (explicit stem count)
  //   "20 Stems (2 Bunches)" → 20 stems (explicit stem count)
  //   "5 bunches" → 5 bunches (needs multiplication by stemsPerBunch)
  const parseVariantLabel = (label) => {
    if (!label) return { quantity: 0, unit: 'stems', isBunches: false, explicitStems: false };

    // Check if label explicitly mentions stems/roses count (e.g., "25 Roses", "20 Stems", "24 Garden Roses")
    // In these cases, the number IS the stem count, not a bunch count
    const stemMatch = label.match(/^(\d+)\s*(Roses?|Stems?|Garden Roses?|Ranunculus|Anemone|Dahlia|Peony|Hydrangea|Lisianthus|Carnation|Tulip|Delphinium|Stock|Eucalyptus|Ruscus|Fern)/i);
    if (stemMatch) {
      return {
        quantity: parseInt(stemMatch[1], 10),
        unit: 'stems',
        isBunches: false,
        explicitStems: true
      };
    }

    // Check if it's purely bunches (e.g., "5 bunches" without an explicit stem count)
    const bunchMatch = label.match(/^(\d+)\s*bunch/i);
    if (bunchMatch) {
      return {
        quantity: parseInt(bunchMatch[1], 10),
        unit: 'bunches',
        isBunches: true,
        explicitStems: false
      };
    }

    // Fallback: extract first number, assume it's stems
    const match = label.match(/^(\d+)/);
    const quantity = match ? parseInt(match[1], 10) : 0;
    return { quantity, unit: 'stems', isBunches: false, explicitStems: false };
  };

  // Calculate total stems for a variant (accounting for bunches)
  const calculateTotalStems = (label, stemsPerBunch) => {
    const { quantity, isBunches, explicitStems } = parseVariantLabel(label);

    // If the label explicitly mentions stems/roses count, use that directly
    if (explicitStems) {
      return quantity;
    }

    // If it's purely bunches (e.g., "5 bunches"), multiply by stemsPerBunch
    if (isBunches && stemsPerBunch) {
      return quantity * stemsPerBunch;
    }

    return quantity;
  };

  // Calculate shopping items based on consultation type
  const shoppingItems = useMemo(() => {
    // BASIC CONSULTATION: Use featured blooms directly with their selected variant
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
          suggestedVariant: selectedVariant ? { ...selectedVariant, quantity } : null,
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

      // Get stems per bunch from bloom data (scraped from product page)
      const stemsPerBunch = bloom.stemsPerBunch || null;

      // Parse all variants with total stem counts (accounting for bunches)
      const allVariants = (bloom.options || []).map((opt) => {
        const { quantity, isBunches } = parseVariantLabel(opt.label);
        const totalStems = calculateTotalStems(opt.label, stemsPerBunch);
        return {
          ...opt,
          quantity, // Raw number from label (e.g., 10 bunches = 10)
          isBunches,
          totalStems, // Actual stems (e.g., 10 bunches × 5 stems = 50)
          stemsPerBunch,
        };
      }).sort((a, b) => a.totalStems - b.totalStems);

      // Find the suggested variant index (smallest that covers stem need)
      let suggestedVariantIndex = 0;

      if (allVariants.length > 0) {
        const coveringIndex = allVariants.findIndex(
          (v) => v.totalStems >= item.stemsNeeded
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
        stemsPerBunch,
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
    const newSelections = {
      ...selections,
      [productHandle]: variantIndex
    };
    setSelections(newSelections);
    // Notify parent to persist selections
    if (onSelectionsChange) {
      onSelectionsChange(newSelections);
    }
  };

  // Calculate totals using selected variants
  const subtotal = shoppingItems.reduce((sum, item) => {
    const selectedIdx = getSelectedIndex(item);
    const selectedVariant = item.allVariants?.[selectedIdx];
    return sum + (selectedVariant?.price || item.price || 0);
  }, 0);
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

      <div className="border border-[#e8e8e8] flex flex-col gap-[24px] p-[32px] rounded-[12px] w-full bg-white">
        {/* Grouped items by category */}
        {Object.entries(groupedItems).map(([category, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-[8px]">
              <div className="flex items-center gap-[12px] mb-[16px]">
                <div className="w-[4px] h-[24px] bg-[#4a9380] rounded-full"></div>
                <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[18px]">
                  {category}
                </p>
                <span className="font-['Avenir:Roman',sans-serif] text-[#888] text-[14px]">
                  ({items.length} item{items.length !== 1 ? 's' : ''})
                </span>
              </div>

              {items.map((item, idx) => {
                const selectedIdx = getSelectedIndex(item);
                const selectedVariant = item.allVariants?.[selectedIdx];
                const itemPrice = selectedVariant?.price || item.price || 0;

                return (
                <div
                  key={idx}
                  className="bg-white border border-[#ddd] flex flex-col rounded-[12px] w-full mb-[20px] overflow-hidden shadow-sm"
                >
                  {/* Header with image, product name, and View Product button */}
                  <div className="flex items-center gap-[20px] p-[20px] bg-gradient-to-r from-[#f8f9fa] to-[#f3f5f6] border-b border-[#e8e8e8]">
                    {item.image && (
                      <div className="border border-[#ddd] w-[90px] h-[90px] shrink-0 overflow-hidden rounded-[8px] shadow-sm">
                        <img
                          alt={item.name}
                          className="object-cover size-full"
                          src={item.image}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[18px] uppercase truncate">
                        {item.name}
                      </p>
                      <p className="font-['Avenir:Roman',sans-serif] text-[#888] text-[13px] mt-1">
                        {item.category}
                      </p>
                    </div>
                    <a
                      href={`https://www.fiftyflowers.com/products/${item.productHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action-outline shrink-0"
                    >
                      View Product
                    </a>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-[12px] p-[24px]">
                    <div className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                      {isBasicConsultation ? (
                        // Basic: Show all variant options
                        <>
                          <p className="font-['Avenir:Heavy',sans-serif] text-[14px] text-[#555] mb-3">Select Quantity:</p>
                          {item.allVariants && item.allVariants.length > 0 && (
                            <div className="flex flex-col gap-[12px]">
                              {item.allVariants.map((variant, optIdx) => (
                                <label
                                  key={optIdx}
                                  onClick={() => handleVariantSelect(item.productHandle, optIdx)}
                                  className="flex items-center gap-[12px] cursor-pointer p-[12px] rounded-[8px] border border-[#e0e0e0] hover:border-[#4a9380] transition-colors"
                                  style={{ backgroundColor: selectedIdx === optIdx ? '#f0f7f5' : 'white' }}
                                >
                                  <div
                                    className={`border-2 size-[18px] rounded-full shrink-0 ${
                                      selectedIdx === optIdx ? 'bg-[#4a9380] border-[#4a9380]' : 'bg-white border-[#999]'
                                    }`}
                                  />
                                  <span className="font-['Avenir:Roman',sans-serif] text-[#333] text-[15px] flex-1">
                                    {variant.label}
                                  </span>
                                  <span className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[15px]">
                                    {formatPrice(variant.price)}
                                  </span>
                                  {optIdx === item.suggestedVariantIndex && (
                                    <span className="text-[11px] text-white bg-[#4a9380] px-[8px] py-[2px] rounded-[4px] uppercase font-['Avenir:Heavy',sans-serif]">
                                      Suggested
                                    </span>
                                  )}
                                </label>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        // Professional: Show breakdown, needed total, variant options, price
                        <>
                          {/* Breakdown showing how stems add up */}
                          {item.usedIn && item.usedIn.length > 0 && (
                            <div className="mb-5">
                              <p className="font-['Avenir:Heavy',sans-serif] text-[14px] text-[#555] mb-3">Stem Calculation:</p>
                              <div className="flex justify-center">
                                <div className="bg-[#e8f4f1] rounded-[12px] p-[16px]">
                                <table className="border-collapse text-[14px]">
                                  <tbody>
                                    {item.usedIn.map((u, uIdx) => {
                                      const lineTotal = u.stemsPerRecipe * u.recipeQty;
                                      return (
                                        <tr key={uIdx}>
                                          <td className="pr-4 py-[6px] whitespace-nowrap text-[#555]">
                                            {u.stemsPerRecipe} stem{u.stemsPerRecipe !== 1 ? 's' : ''} × {u.recipeName}{u.recipeQty > 1 ? ` (×${u.recipeQty})` : ''}
                                          </td>
                                          <td className="px-3 py-[6px] text-[#888]">=</td>
                                          <td className="text-right py-[6px] whitespace-nowrap font-['Avenir:Heavy',sans-serif] text-[#333]">{lineTotal} stems</td>
                                        </tr>
                                      );
                                    })}
                                    {item.usedIn.length > 1 && (
                                      <tr className="border-t-2 border-[#4a9380]">
                                        <td className="pr-4 pt-[10px] font-['Avenir:Heavy',sans-serif] text-[15px] text-[#333] whitespace-nowrap">Total Needed</td>
                                        <td className="px-3 pt-[10px] text-[15px] text-[#888]">=</td>
                                        <td className="text-right pt-[10px] font-['Avenir:Heavy',sans-serif] text-[16px] text-[#4a9380] whitespace-nowrap">{item.stemsNeeded} stems</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Simple needed display if only one recipe or no breakdown */}
                          {(!item.usedIn || item.usedIn.length <= 1) && (
                            <div className="mb-5 flex justify-center">
                              <div className="bg-[#e8f4f1] rounded-[12px] p-[16px]">
                                <p className="text-[15px] text-[#333]">
                                  <span className="font-['Avenir:Heavy',sans-serif]">Stems Needed:</span>
                                  <span className="ml-2 font-['Avenir:Heavy',sans-serif] text-[16px] text-[#4a9380]">{item.stemsNeeded}</span>
                                </p>
                              </div>
                            </div>
                          )}
                          {/* All variant options */}
                          {item.allVariants && item.allVariants.length > 0 && (
                            <div className="mt-4">
                              <p className="font-['Avenir:Heavy',sans-serif] text-[14px] text-[#555] mb-3">Select Package:</p>
                              <div className="flex justify-center">
                                <div className="flex flex-col gap-[10px]">
                                  {item.allVariants.map((variant, optIdx) => {
                                    const extraStems = variant.totalStems > item.stemsNeeded
                                      ? variant.totalStems - item.stemsNeeded
                                      : 0;
                                    const isShort = variant.totalStems < item.stemsNeeded;
                                    return (
                                      <div key={optIdx} className="flex items-center gap-[10px]">
                                        {/* Left spacer to balance the Suggested tag on the right */}
                                        <span className="text-[11px] px-[8px] py-[3px] invisible">
                                          Suggested
                                        </span>
                                        <label
                                          onClick={() => handleVariantSelect(item.productHandle, optIdx)}
                                          className={`flex items-center gap-[12px] cursor-pointer p-[14px] rounded-[8px] border-2 transition-all flex-1 ${
                                            selectedIdx === optIdx
                                              ? 'border-[#4a9380] bg-[#f0f7f5]'
                                              : 'border-[#e0e0e0] bg-white hover:border-[#4a9380]'
                                          }`}
                                        >
                                          <div
                                            className={`border-2 size-[18px] rounded-full shrink-0 ${
                                              selectedIdx === optIdx ? 'bg-[#4a9380] border-[#4a9380]' : 'bg-white border-[#999]'
                                            }`}
                                          />
                                          <span className="font-['Avenir:Roman',sans-serif] text-[#333] text-[15px]">
                                            {variant.label}
                                            {extraStems > 0 && (
                                              <span className="text-[#4a9380] text-[13px] ml-2">(+{extraStems} extra stems)</span>
                                            )}
                                            {isShort && (
                                              <span className="text-[#e57373] text-[13px] ml-2">(short by {Math.ceil(item.stemsNeeded - variant.totalStems)} stems)</span>
                                            )}
                                          </span>
                                          <span className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[16px] ml-3">
                                            {formatPrice(variant.price)}
                                          </span>
                                        </label>
                                        <span className={`text-[11px] text-white bg-[#4a9380] px-[8px] py-[3px] rounded-[4px] uppercase font-['Avenir:Heavy',sans-serif] ${optIdx === item.suggestedVariantIndex ? 'visible' : 'invisible'}`}>
                                          Suggested
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer with Price */}
                  <div className="flex items-center justify-between px-[24px] py-[16px] bg-[#f5f5f5] border-t border-[#e0e0e0]">
                    <span className="font-['Avenir:Roman',sans-serif] text-[14px] text-[#666]">Selected Price</span>
                    <span className="font-['Avenir:Heavy',sans-serif] text-[22px] text-[#333]">
                      {formatPrice(itemPrice)}
                    </span>
                  </div>
                </div>
              );
              })}
            </div>
          );
        })}

        {/* Totals Section */}
        {shoppingItems.length > 0 && (
          <div className="relative border border-[#ccc] border-solid rounded-[10px] p-[24px] mt-[24px] max-w-[600px] mx-auto bg-[#fafafa]">
            {/* String - full ellipse */}
            <svg
              className="absolute top-[-43px] left-[-63px] z-30"
              width="100"
              height="90"
              viewBox="0 0 100 90"
              fill="none"
              style={{ transform: 'rotate(25deg)' }}
            >
              <ellipse
                cx="50"
                cy="45"
                rx="40"
                ry="22"
                stroke="#a8998a"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            {/* Cover strip - hides the string portion that goes "behind" the card */}
            <div className="absolute top-[0px] left-[16px] w-[20px] h-[16px] bg-[#fafafa] z-40" />

            {/* Price tag hole */}
            <div className="absolute top-[16px] left-[16px] w-[14px] h-[14px] rounded-full border-2 border-[#bbb] bg-white shadow-inner z-10" />


            <p className="font-['Avenir:Heavy',sans-serif] text-[16px] text-[#333] mb-4 ml-6">Order Summary</p>

            {/* Itemized Product List */}
            <div className="bg-white rounded-[8px] border border-[#e5e5e5] p-[16px] mb-4">
              <table className="w-full text-[14px]">
                <tbody>
                  {shoppingItems.map((item, idx) => {
                    const selectedIdx = getSelectedIndex(item);
                    const selectedVariant = item.allVariants?.[selectedIdx];
                    const itemPrice = selectedVariant?.price || item.price || 0;
                    const variantLabel = selectedVariant?.label || '';

                    return (
                      <tr key={idx} className={idx !== shoppingItems.length - 1 ? 'border-b border-[#eee]' : ''}>
                        <td className="py-[10px] pr-4">
                          <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">{item.name}</p>
                          <p className="font-['Avenir:Roman',sans-serif] text-[#888] text-[12px] mt-1">{variantLabel}</p>
                        </td>
                        <td className="py-[10px] text-right font-['Avenir:Roman',sans-serif] text-[#333] whitespace-nowrap">
                          {formatPrice(itemPrice)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Subtotal, Discount, Total */}
            <div className="bg-[#e8f4f1] rounded-[8px] p-[16px]">
              <table className="w-full text-[14px]">
                <tbody>
                  <tr>
                    <td className="py-[6px] font-['Avenir:Roman',sans-serif] text-[#555]">Subtotal</td>
                    <td className="py-[6px] text-right font-['Avenir:Roman',sans-serif] text-[#333]">{formatPrice(subtotal)}</td>
                  </tr>
                  {discountPercent > 0 && (
                    <tr>
                      <td className="py-[6px] font-['Avenir:Roman',sans-serif] text-[#555]">Consultation Discount ({discountPercent}%)</td>
                      <td className="py-[6px] text-right font-['Avenir:Roman',sans-serif] text-[#4a9380]">-{formatPrice(discount)}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-[#4a9380]">
                    <td className="pt-[12px] font-['Avenir:Heavy',sans-serif] text-[16px] text-[#333]">Total</td>
                    <td className="pt-[12px] text-right font-['Avenir:Heavy',sans-serif] text-[20px] text-[#333]">{formatPrice(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {deliveryDate && (
              <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[12px] mt-4 text-center">
                Delivery Date: <span className="font-['Avenir:Roman',sans-serif] text-[#555]">{formatDeliveryDate(deliveryDate)}</span>
              </p>
            )}
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
