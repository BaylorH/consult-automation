// Styled from Figma MCP output - exact spacing and colors
import { useState } from 'react';

// Mock flower data
const mockFlowers = [
  { id: '1', name: 'Blue Tinted Roses', category: 'Focal', image: null, variants: [
    { label: '5 Bunches', price: 164.99 },
    { label: '50 Stems', price: 279.99 },
    { label: '100 Stems', price: 354.99 },
  ]},
  { id: '2', name: 'Creamy White Bulk Spray Roses', category: 'Filler', image: null, variants: [
    { label: '20 Stems', price: 119.99 },
    { label: '50 Stems', price: 279.99 },
    { label: '100 Stems', price: 354.99 },
  ]},
  { id: '3', name: 'Silver Dollar Eucalyptus Greens', category: 'Greenery', image: null, variants: [
    { label: '20 Bunches', price: 119.99 },
    { label: '50 Bunches', price: 159.99 },
    { label: '100 Bunches', price: 259.99 },
    { label: '200 Bunches', price: 464.99 },
  ]},
];

export default function FeaturedBlooms({ data, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlooms, setSelectedBlooms] = useState(data.featuredBlooms || []);
  const [selectedVariants, setSelectedVariants] = useState({});

  const addBloom = (flower) => {
    const variantIndex = selectedVariants[flower.id] || 0;
    const newBloom = {
      ...flower,
      selectedVariant: flower.variants[variantIndex],
      uniqueId: `${flower.id}-${Date.now()}`,
    };
    const updated = [...selectedBlooms, newBloom];
    setSelectedBlooms(updated);
    onChange('featuredBlooms', updated);
  };

  const removeBloom = (uniqueId) => {
    const updated = selectedBlooms.filter((b) => b.uniqueId !== uniqueId);
    setSelectedBlooms(updated);
    onChange('featuredBlooms', updated);
  };

  return (
    <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] items-start p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-[964px]">
      <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Featured Blooms
      </p>

      {/* Search Bar */}
      <div className="flex flex-col items-center w-[904px]">
        <div className="flex gap-[5px] items-start w-full">
          {/* Search Input */}
          <div className="border border-[#ccc] flex items-center px-[10px] py-[15px] rounded-[5px] w-[520px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flowers..."
              className="w-full outline-none text-[14px]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            />
          </div>

          {/* Search By Color */}
          <div className="border border-[#ccc] flex gap-[60px] h-[48px] items-start p-[15px] rounded-[5px]">
            <p className="text-[#999] text-[12px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
              Search By Color
            </p>
            <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-180">
              <polygon points="5,0 10,7.5 0,7.5" fill="#666"/>
            </svg>
          </div>

          {/* Search by All */}
          <div className="border border-[#ccc] flex gap-[60px] h-[48px] items-start p-[15px] rounded-[5px]">
            <p className="text-[#999] text-[12px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
              Search by All
            </p>
            <svg width="10" height="10" viewBox="0 0 10 10" className="rotate-180">
              <polygon points="5,0 10,7.5 0,7.5" fill="#666"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Current Proposal Inventory */}
      <div className="border border-[#f1f1f1] flex flex-1 flex-col gap-[15px] items-start p-[30px] rounded-[5px] min-h-px min-w-px">
        <p className="font-bold h-[30px] leading-normal text-[#161616] text-[18px] w-[854px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Current Proposal Inventory:
        </p>

        {selectedBlooms.length === 0 ? (
          <p className="text-[#666] text-[14px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            No blooms selected yet. Search above to add flowers.
          </p>
        ) : (
          selectedBlooms.map((bloom) => (
            <div
              key={bloom.uniqueId}
              className="bg-white border border-[#ccc] flex gap-[30px] items-start p-[15px] rounded-[5px] w-[854px]"
            >
              <div className="flex gap-[30px] items-start w-[715px]">
                {/* Image */}
                <div className="size-[92px] bg-[#f3f5f6] flex items-center justify-center">
                  <span className="text-[#999] text-[12px]">Image</span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-[10px] items-start w-[635px]">
                  <p className="leading-normal text-[#333] text-[16px] uppercase w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    {bloom.name}
                  </p>
                  <div className="flex flex-col items-start">
                    <div className="flex gap-[10px] items-center justify-center py-[5px] rounded-[37px] w-[424px]">
                      <div className="bg-[#333] border border-[#999] size-[15px]" />
                      <p className="flex-1 leading-normal text-[#333] text-[14px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        {bloom.selectedVariant?.label} - ${bloom.selectedVariant?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <div className="flex items-start justify-end px-[15px] py-[5px]">
                <button
                  onClick={() => removeBloom(bloom.uniqueId)}
                  className="border border-[#ccc] flex items-center justify-center p-[5px]"
                >
                  <p className="leading-normal text-[#333] text-[14px] whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                    Remove
                  </p>
                </button>
              </div>
            </div>
          ))
        )}

        {/* Search Results */}
        {searchTerm && (
          <div className="mt-4 pt-4 border-t border-[#f1f1f1] w-full">
            <p className="font-bold text-[#666] text-[14px] mb-4" style={{ fontFamily: 'Avenir, sans-serif' }}>
              Search Results:
            </p>
            {mockFlowers
              .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((flower) => (
                <div
                  key={flower.id}
                  className="bg-white border border-[#ccc] flex gap-[30px] items-start p-[15px] rounded-[5px] w-[854px] mb-4"
                >
                  <div className="flex gap-[30px] items-start flex-1">
                    <div className="size-[92px] bg-[#f3f5f6] flex items-center justify-center">
                      <span className="text-[#999] text-[12px]">Image</span>
                    </div>

                    <div className="flex flex-col gap-[10px] items-start flex-1">
                      <p className="leading-normal text-[#333] text-[16px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
                        {flower.name}
                      </p>
                      <div className="flex flex-col items-start">
                        {flower.variants.map((variant, idx) => (
                          <div key={idx} className="flex gap-[10px] items-center py-[5px] w-[424px]">
                            <input
                              type="radio"
                              name={`variant-${flower.id}`}
                              checked={(selectedVariants[flower.id] || 0) === idx}
                              onChange={() => setSelectedVariants({ ...selectedVariants, [flower.id]: idx })}
                              className="size-[15px] border border-[#999]"
                            />
                            <p className="flex-1 leading-normal text-[#333] text-[14px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                              {variant.label} - ${variant.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addBloom(flower)}
                    className="bg-[#4a9380] text-white px-4 py-2 text-[14px] hover:bg-[#3d7a6a] transition-colors"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    + Add
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
