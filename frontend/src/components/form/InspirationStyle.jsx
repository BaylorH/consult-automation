// Styled from Figma MCP output - exact spacing and colors
import { useState } from 'react';

export default function InspirationStyle({ data, onChange }) {
  const [images, setImages] = useState(data.inspirationImages || []);
  const [colors, setColors] = useState(data.colorPalette || []);

  const addImage = () => {
    const newImages = [...images, { id: Date.now(), url: null }];
    setImages(newImages);
    onChange('inspirationImages', newImages);
  };

  const addColor = () => {
    const input = document.createElement('input');
    input.type = 'color';
    input.onchange = (e) => {
      const newColors = [...colors, e.target.value];
      setColors(newColors);
      onChange('colorPalette', newColors);
    };
    input.click();
  };

  return (
    <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] items-start p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-full">
      <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Inspiration & Style
      </p>

      {/* Inspirational Images */}
      <div className="flex flex-col gap-[10px] items-start w-[930px]">
        <p className="font-bold leading-normal text-[#666] text-[12px] uppercase w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Inspirational Images (Min 4, 8 max)
        </p>
        <div className="flex flex-wrap gap-[30px] items-start pb-[15px] w-[900px]">
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className="flex flex-col items-center justify-center overflow-hidden px-[28px] py-[40px] size-[142px] bg-[#f3f5f6]"
            >
              {img.url ? (
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#999] text-[12px]">Image {index + 1}</span>
              )}
            </div>
          ))}

          {images.length < 8 && (
            <button
              onClick={addImage}
              className="border border-dashed border-[#ccc] flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] hover:bg-[#f9f9f9] transition-colors"
            >
              <div className="opacity-50 size-[40px] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[#333] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
                Add a Photo
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Color Palette & Style Notes Row */}
      <div className="flex flex-1 gap-[30px] items-start min-h-px min-w-px">
        {/* Color Palette */}
        <div className="flex flex-1 flex-col gap-[10px] items-start min-h-px min-w-px">
          <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Color Pallette (Min 4, 8 max)
          </p>
          <div className="flex flex-wrap gap-[30px] items-start w-full">
            {colors.map((color, index) => (
              <div
                key={index}
                className="border border-[#ccc] rounded-full size-[60px]"
                style={{ backgroundColor: color }}
              />
            ))}

            {colors.length < 8 && (
              <button
                onClick={addColor}
                className="border border-dashed border-[#ccc] flex items-center p-[10px] rounded-full hover:bg-[#f9f9f9] transition-colors"
              >
                <div className="size-[40px] opacity-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Style Notes */}
        <div className="flex flex-1 flex-col gap-[10px] h-[156px] items-start min-h-px min-w-px">
          <p className="font-bold leading-normal text-[#666] text-[12px] uppercase" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Style Notes
          </p>
          <div className="border border-[#ccc] flex flex-col h-[130px] items-start p-[15px] rounded-[5px] w-full">
            <textarea
              value={data.styleNotes}
              onChange={(e) => onChange('styleNotes', e.target.value)}
              placeholder="Warm wood textures, soft linens, and candlelight create a cozy, intimate atmosphere."
              className="font-normal leading-normal text-[#666] text-[16px] w-full h-full resize-none outline-none"
              style={{ fontFamily: 'Nunito Sans, sans-serif' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
