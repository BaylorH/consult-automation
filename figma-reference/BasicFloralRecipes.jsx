// Figma Reference Code - Basic Floral Recipes Layout (134:915)
// This is reference code from Figma MCP - adapt to your project's stack

const imgScreenshot20260118At41938Pm1 = "https://www.figma.com/api/mcp/asset/7232e115-5781-4fe2-881f-f14441241ca7";
const imgScreenshot20260118At42723Pm1 = "https://www.figma.com/api/mcp/asset/2f85a00b-8961-42aa-a1b2-282f8c402591";
const imgImage7 = "https://www.figma.com/api/mcp/asset/0ffefc2a-8155-4b4a-87cc-3021295805a6";
const imgImage3 = "https://www.figma.com/api/mcp/asset/d7631d3d-12d9-47a2-96e4-e276667296e6";
const imgImage1 = "https://www.figma.com/api/mcp/asset/ffac5f07-8646-41e7-bb8c-23e1b941bc45";
const imgScreenshot20260121At121401Pm1 = "https://www.figma.com/api/mcp/asset/f71038a2-a01e-40a8-a537-c8039115f496";
const imgScreenshot20260121At121506Pm1 = "https://www.figma.com/api/mcp/asset/b3da3ed0-8bc2-4dc0-a207-835d85e0d516";
const imgScreenshot20260121At121550Pm1 = "https://www.figma.com/api/mcp/asset/6bdb2344-77d6-47fd-b597-c35b0ca7412b";
const imgRectangle9 = "https://www.figma.com/api/mcp/asset/8cd5abbf-d879-4bcc-beac-a7c27c075d64";
const imgImage6 = "https://www.figma.com/api/mcp/asset/0aebb3d6-b26d-4639-a446-b0e5ca859f09";
const imgScreenshot20260118At111910Pm1 = "https://www.figma.com/api/mcp/asset/e7d030b7-4fe1-4e04-b3fa-baf73a7dc70b";
const imgImage11 = "https://www.figma.com/api/mcp/asset/ae1ced2e-4aac-409d-a605-5dd7ad12f7de";
const imgImage12 = "https://www.figma.com/api/mcp/asset/f499b4cc-e235-4f55-bc5e-4d21488c4804";
const imgImage13 = "https://www.figma.com/api/mcp/asset/8597361d-61af-4534-b321-21ee7c2cb6d3";
const imgBrideBouquet = "https://www.figma.com/api/mcp/asset/7a2e0af0-36a5-4a89-af08-6ef79efbee87";
const imgBouquet = "https://www.figma.com/api/mcp/asset/7bdb5764-281f-462c-8019-d834544a7647";
const imgBoutonniere1 = "https://www.figma.com/api/mcp/asset/10401a95-96e6-4fac-a925-6c420a5809af";
const imgCorsage = "https://www.figma.com/api/mcp/asset/f73ed2ba-fc4a-462c-bad7-9e0678b01c81";
const imgCenterpiece = "https://www.figma.com/api/mcp/asset/19c72b7f-89d6-4281-8d2a-3ab7dc80d45c";
const imgImage4 = "https://www.figma.com/api/mcp/asset/80f93d83-9b41-4e75-a626-a9ea46c2fb8b";
const imgPolygon1 = "https://www.figma.com/api/mcp/asset/0e9c0cd3-556d-4312-ad43-944e43faf74a";
const imgPolygon2 = "https://www.figma.com/api/mcp/asset/3cb32785-4185-40a3-b708-6c29ca7c384a";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/f02be32e-df2f-4674-a315-75bcc08ed7ca";

// KEY DESIGN ELEMENTS:
// - Basic Floral Recipes section shows template recipe cards in a grid
// - Each card has: checkbox "Include in Proposal", image, name, ingredient list, quantity selector
// - Recipe templates: Bridesmaid Bouquet, Groom's Boutonniere, Mother's Corsage, Centerpiece, etc.
// - Ingredient list format: bullet points with "X Focal Flowers", "X Filler Flowers", "X Line Flowers", "X Greenery"
// - This is for BASIC consultation tier (templates vs custom recipes)

// COLORS:
// - Card border: #ccc
// - Card background: white
// - Image background: #f1f1f1
// - Text colors: #333 (primary), #666 (secondary)
// - Checkbox border: #ccc

export default function BasicFloralRecipesSection() {
  return (
    <div className="bg-white border border-[#eef0ef] border-solid content-stretch flex flex-col gap-[30px] items-start p-[30px] relative rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] shrink-0 w-[964px]" data-name="Basic Floral Recipes">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] w-[960px]">
        Basic Floral Recipes
      </p>
      <div className="content-start flex flex-wrap gap-[15px] items-start relative shrink-0 w-full">
        {/* Recipe Card Template */}
        <div className="border border-[#ccc] border-solid content-stretch flex flex-col gap-[11px] items-start p-[15px] relative rounded-[5px] shrink-0 w-[200px]">
          <div className="content-stretch flex gap-[11px] items-center relative shrink-0">
            <div className="border border-[#ccc] border-solid shrink-0 size-[12px]" />
            <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#333] text-[12px] whitespace-nowrap">
              Include In Propsal
            </p>
          </div>
          <div className="bg-[#f1f1f1] border border-[#ccc] border-solid content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[170px]">
            <div className="relative shrink-0 size-[120px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBrideBouquet} />
            </div>
          </div>
          <p className="font-['Avenir:Roman',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#333] text-[16px] w-[min-content]">
            Bridesmaid Bouquet
          </p>
          <ul className="block font-['Avenir:Roman',sans-serif] h-[75px] leading-[0] list-disc not-italic relative shrink-0 text-[#333] text-[12px] w-[200px] whitespace-pre-wrap">
            <li className="mb-0 ms-[18px]">
              <span className="leading-[normal]">18 Focal Flowers</span>
            </li>
            <li className="mb-0 ms-[18px]">
              <span className="leading-[normal]">5 Filler Flowers</span>
            </li>
            <li className="mb-0 ms-[18px]">
              <span className="leading-[normal]">8 Line Flowers</span>
            </li>
            <li className="ms-[18px]">
              <span className="leading-[normal]">5 Greenery</span>
            </li>
          </ul>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-[110px]">
            <div className="border border-[#ccc] border-solid content-stretch flex h-[30px] items-center px-[15px] py-[10px] relative rounded-[5px] shrink-0 w-[110px]">
              <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[70px]">
                <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
                  1
                </p>
              </div>
              <div className="h-[10px] relative shrink-0 w-[15px]">
                <img alt="" className="absolute block max-w-none size-full" src={imgFrame1} />
              </div>
            </div>
          </div>
        </div>
        {/* Additional recipe cards follow same pattern */}
      </div>
    </div>
  );
}
