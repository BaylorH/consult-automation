// FeaturedBloomsSlide - Circular bloom images grid with product names
// Matches Figma "Featured Blooms" section

import SlideWrapper from './SlideWrapper';

export default function FeaturedBloomsSlide({ featuredBlooms = [] }) {
  return (
    <SlideWrapper>
      <div className="flex flex-col gap-[60px] items-center p-[30px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase">
          Featured Blooms
        </h2>

        <div className="flex flex-wrap gap-x-[40px] gap-y-[30px] items-start justify-center max-w-[1100px]">
          {featuredBlooms.map((bloom, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center w-[160px]"
            >
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-md border-2 border-[#eee] mb-[10px]">
                <img
                  alt={bloom.name || `Bloom ${idx + 1}`}
                  src={bloom.image}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-['Avenir',sans-serif] text-[#333] text-[11px] text-center uppercase leading-tight">
                {bloom.name || `Bloom ${idx + 1}`}
              </p>
            </div>
          ))}

          {featuredBlooms.length === 0 && (
            <p className="text-[#999] text-[16px] font-['Avenir',sans-serif]">
              No featured blooms selected
            </p>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}
