// Figma Reference Code - Shopping List Component (20:332)
// This is reference code from Figma MCP - adapt to your project's stack

const imgScreenshot20260118At112847Pm1 = "https://www.figma.com/api/mcp/asset/f4c541fe-86bf-47e3-95c5-e80517653d04";

// KEY DESIGN ELEMENTS:
// - Shopping list shows items grouped by flower category (Focal, Filler, Line, Greenery)
// - Each item shows: product image, name, quantity needed, price, "View Product" button
// - Summary section at bottom: Subtotal, Consultation Discount (15%), Total, Delivery Date
// - "View Product" links to Shopify product page

// COLORS:
// - Section title: #161616
// - Body text: #333
// - Secondary text: #666
// - Borders: #ccc, #f1f1f1
// - Product image border: #999

export default function ShoppingList() {
  return (
    <div className="bg-white border border-[#eef0ef] border-solid content-stretch flex flex-col gap-[30px] items-start p-[30px] relative rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] size-full" data-name="Shopping List">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] w-[960px]">
        Shopping List (2)
      </p>
      <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[18px] w-[905px]">{`Based on your floral recipes, here's what we recommend purchasing for your client's event. `}</p>

      <div className="border border-[#f1f1f1] border-solid content-stretch flex flex-col gap-[15px] items-start p-[30px] relative rounded-[5px] shrink-0 w-full">
        {/* Focal Flowers Section */}
        <p className="font-['Avenir:Heavy',sans-serif] h-[30px] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] w-[854px]">
          Focal Flowers
        </p>

        {/* Product Item */}
        <div className="bg-white border border-[#ccc] border-solid content-stretch flex items-start p-[15px] relative rounded-[5px] shrink-0 w-[854px]">
          <div className="content-stretch flex flex-[1_0_0] gap-[30px] items-start min-h-px min-w-px relative">
            <div className="border border-[#999] border-solid relative shrink-0 size-[60px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260118At112847Pm1} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
              <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#333] text-[16px] uppercase w-full">{`Quicksand Roses `}</p>
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-center justify-center py-[5px] relative rounded-[37px] shrink-0 w-[624px]">
                  <div className="flex-[1_0_0] font-['Avenir:Roman',sans-serif] leading-[0] min-h-px min-w-px not-italic relative text-[#333] text-[14px] whitespace-pre-wrap">
                    <p className="mb-0">
                      <span className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic">Quantity</span>
                      <span className="leading-[normal]">: 4 bunch (25 Stems ea)</span>
                    </p>
                    <p className="mb-0">
                      <span className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic">Needed</span>
                      <span className="leading-[normal]">: 15 Stems</span>
                    </p>
                    <p className="leading-[normal] mb-0">Extra stems included for flexibility</p>
                    <p className="leading-[normal] mb-0">Used in: 5 stems in Bridal Bouquet, 25 stems in Brides Bouquet ea</p>
                    <p className="leading-[normal] mb-0">&nbsp;</p>
                    <p className="leading-[normal]">$99.99</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0">
                  <div className="border border-[#ccc] border-solid content-stretch flex items-center justify-center p-[5px] relative shrink-0">
                    <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#333] text-[14px] whitespace-nowrap">
                      View Product
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filler Flowers Section */}
        <p className="font-['Avenir:Heavy',sans-serif] h-[30px] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] w-[854px]">
          Filler Flowers
        </p>
        {/* Additional product items... */}

        {/* Summary Section */}
        <div className="content-stretch flex flex-col items-center pt-[30px] relative shrink-0 w-full">
          <div className="border border-[#ccc] border-solid content-stretch flex gap-[30px] h-[231px] items-start justify-center leading-[normal] not-italic pt-[30px] relative shrink-0 text-[14px] text-black w-[634px] whitespace-pre-wrap">
            <div className="font-['Avenir:Heavy',sans-serif] relative shrink-0 w-[394px]">
              <p className="mb-0">Subtotal:</p>
              <p className="mb-0">Consultation Discount (15%)</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">Total</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">Delivery Date: March 26, 2026</p>
              <p className="mb-0">&nbsp;</p>
              <p className="font-['Avenir:Roman',sans-serif]">{`Click product names to add items to your cart. Your discount will be applied at checkout. `}</p>
            </div>
            <div className="font-['Avenir:Roman',sans-serif] relative shrink-0 text-right w-[109px]">
              <p className="mb-0">$214.98</p>
              <p className="mb-0">-$32.25</p>
              <p className="mb-0">&nbsp;</p>
              <p>$182.73</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
