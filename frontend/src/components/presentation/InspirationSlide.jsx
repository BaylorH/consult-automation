// InspirationSlide - Inspirational photos + color palette
// Matches Figma "Inspirational Photos / Pallet" section

import SlideWrapper from './SlideWrapper';

export default function InspirationSlide({ inspirationImages = [], colorPalette = [] }) {
  // Ensure we have arrays to work with
  const images = inspirationImages.slice(0, 9); // Max 9 images
  const colors = colorPalette.slice(0, 8); // Max 8 colors

  return (
    <SlideWrapper noPadding>
      <div className="flex flex-col items-center pb-[90px] pt-[120px] relative w-full">
        <div className="relative w-full min-h-[1000px]">
          {/* Green background strip */}
          <div className="absolute bg-[#e6f0e4] h-[870px] left-0 top-[115px] w-full" />

          {/* "INSPIRATIONAL PHOTOS" title */}
          <div className="absolute left-[130px] top-0 py-[30px]">
            <p className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[24px] uppercase tracking-wide">
              Inspirational Photos
            </p>
          </div>

          {/* Photo collage - positioned images */}
          <div className="absolute left-[130px] top-[93px] w-[330px] h-[360px] overflow-hidden rounded-sm">
            {images[0] && (
              <img alt="" src={images[0]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[160px] top-[483px] w-[300px] h-[240px] overflow-hidden rounded-sm">
            {images[1] && (
              <img alt="" src={images[1]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[490px] top-[657px] w-[343px] h-[259px] overflow-hidden rounded-sm">
            {images[2] && (
              <img alt="" src={images[2]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[490px] top-[8px] w-[360px] h-[229px] overflow-hidden rounded-sm">
            {images[3] && (
              <img alt="" src={images[3]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[760px] top-[357px] w-[240px] h-[240px] overflow-hidden rounded-sm">
            {images[4] && (
              <img alt="" src={images[4]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[1031px] top-[387px] w-[240px] h-[240px] overflow-hidden rounded-sm">
            {images[5] && (
              <img alt="" src={images[5]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[862px] top-[677px] w-[432px] h-[323px] overflow-hidden rounded-sm">
            {images[6] && (
              <img alt="" src={images[6]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[137px] top-[753px] w-[323px] h-[300px] overflow-hidden rounded-sm">
            {images[7] && (
              <img alt="" src={images[7]} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="absolute left-[490px] top-[267px] w-[240px] h-[360px] overflow-hidden rounded-sm">
            {images[8] && (
              <img alt="" src={images[8]} className="w-full h-full object-cover" />
            )}
          </div>

          {/* Color Palette Card */}
          <div className="absolute right-[130px] top-[30px] bg-white rounded-[15px] p-[30px] w-[420px] shadow-lg">
            <p className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[24px] uppercase tracking-wide text-center mb-[30px]">
              Color Palette
            </p>
            <div className="flex flex-wrap gap-[15px] justify-center">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-[75px] h-[75px] rounded-full shadow-md border border-[#eee]"
                  style={{ backgroundColor: color }}
                />
              ))}
              {/* Show placeholder circles if fewer than 8 colors */}
              {colors.length === 0 && (
                <p className="text-[#999] text-[14px] font-['Avenir',sans-serif]">
                  No colors selected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}
