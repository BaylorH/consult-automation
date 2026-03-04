// Styled from Figma MCP output - exact spacing and colors

export default function ShoppingList({ data }) {
  const hasRecipes = data.recipes && data.recipes.length > 0;

  if (!hasRecipes) {
    return (
      <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] items-start p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-full">
        <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Shopping List
        </p>

        <div className="border border-[#999] flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
          <svg className="size-[20px]" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <p className="leading-normal text-[#666] text-[16px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Your shopping list will appear once you add recipes.
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = data.featuredBlooms?.reduce((sum, bloom) => {
    return sum + (bloom.selectedVariant?.price || 0);
  }, 0) || 0;

  const discount = subtotal * 0.15;
  const total = subtotal - discount;

  // Group blooms by category
  const focalBlooms = data.featuredBlooms?.filter((b) => b.category === 'Focal') || [];
  const fillerBlooms = data.featuredBlooms?.filter((b) => b.category === 'Filler') || [];
  const greeneryBlooms = data.featuredBlooms?.filter((b) => b.category === 'Greenery') || [];

  const renderBloomSection = (title, blooms) => {
    if (blooms.length === 0) return null;

    return (
      <>
        <p className="font-bold h-[30px] leading-normal text-[#161616] text-[18px] w-[854px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
          {title}
        </p>
        {blooms.map((bloom) => (
          <div
            key={bloom.uniqueId}
            className="bg-white border border-[#ccc] flex items-start p-[15px] rounded-[5px] w-[854px]"
          >
            <div className="flex flex-1 gap-[30px] items-start min-h-px min-w-px">
              {/* Image */}
              <div className="border border-[#999] size-[60px] bg-[#f3f5f6] flex items-center justify-center">
                <span className="text-[#999] text-[10px]">Img</span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-[10px] items-start min-h-px min-w-px">
                <p className="leading-normal text-[#333] text-[16px] uppercase w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  {bloom.name}
                </p>
                <div className="flex items-start w-full">
                  <div className="flex items-center justify-center py-[5px] w-[624px]">
                    <div className="flex-1 text-[#333] text-[14px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                      <p className="mb-0">
                        <span className="font-bold">Quantity</span>
                        <span>: {bloom.selectedVariant?.label}</span>
                      </p>
                      <p className="mb-0">
                        <span className="font-bold">Needed</span>
                        <span>: Calculated based on recipes</span>
                      </p>
                      <p className="leading-normal mb-0">Extra stems included for flexibility</p>
                      <p className="leading-normal mb-0">&nbsp;</p>
                      <p className="leading-normal">${bloom.selectedVariant?.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <button className="border border-[#ccc] flex items-center justify-center p-[5px]">
                      <p className="leading-normal text-[#333] text-[14px] whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        View Product
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  // Format delivery date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] items-start p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-full">
      <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Shopping List ({data.featuredBlooms?.length || 0})
      </p>
      <p className="leading-normal text-[#666] text-[18px] w-[905px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Based on your floral recipes, here's what we recommend purchasing for your client's event.
      </p>

      <div className="border border-[#f1f1f1] flex flex-col gap-[15px] items-start p-[30px] rounded-[5px] w-full">
        {renderBloomSection('Focal Flowers', focalBlooms)}
        {renderBloomSection('Filler Flowers', fillerBlooms)}
        {renderBloomSection('Greenery', greeneryBlooms)}

        {/* Summary */}
        <div className="flex flex-col items-center pt-[30px] w-full">
          <div className="border border-[#ccc] flex gap-[30px] items-start justify-center pt-[30px] px-[30px] pb-[30px] text-[14px] text-black w-[634px]">
            <div className="font-bold w-[394px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
              <p className="mb-0">Subtotal:</p>
              <p className="mb-0">Consultation Discount (15%)</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">Total</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">Delivery Date: {formatDate(data.deliveryDate)}</p>
              <p className="mb-0">&nbsp;</p>
              <p className="font-normal" style={{ fontFamily: 'Avenir, sans-serif' }}>
                Click product names to add items to your cart. Your discount will be applied at checkout.
              </p>
            </div>
            <div className="text-right w-[109px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
              <p className="mb-0">${subtotal.toFixed(2)}</p>
              <p className="mb-0">-${discount.toFixed(2)}</p>
              <p className="mb-0">&nbsp;</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
