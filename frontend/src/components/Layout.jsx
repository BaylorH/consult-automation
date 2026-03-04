// Layout Component - Persistent sidebar with dynamic main content
// Uses React properly - sidebar stays, content swaps

import { useLocation, useNavigate } from 'react-router-dom';

const imgScreenshot20260118At41938Pm1 = "https://www.figma.com/api/mcp/asset/9ebaa3c8-5e57-405a-bf7d-798f38ce3e26";
const imgScreenshot20260118At42723Pm1 = "https://www.figma.com/api/mcp/asset/671b6103-dfeb-4527-a6bc-fd16b8592eb5";
const imgPolygon1 = "https://www.figma.com/api/mcp/asset/5dd76d52-b0fa-40ff-8595-bcd89a27aa36";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isNewProposal = location.pathname.includes('/proposal');

  return (
    <div className="bg-white flex items-stretch min-h-screen w-full">
      {/* Left Icons Column */}
      <div className="content-stretch flex flex-col gap-[30px] items-center py-[15px] shrink-0 bg-white">
        <div className="h-[93px] relative shrink-0 w-[68px]" data-name="Screenshot 2026-01-18 at 4.19.38 PM 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260118At41938Pm1} />
        </div>
        <div className="h-[32px] relative shrink-0 w-[29px]" data-name="Screenshot 2026-01-18 at 4.27.23 PM 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260118At42723Pm1} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-[#f3f5f6] border-r border-[#e6e6e6] flex flex-col gap-[15px] py-[15px] shrink-0 w-[184px]">
        <div className="border-[#e6e6e6] border-b border-solid flex items-center justify-center p-[15px]">
          <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] text-[#161616] text-[18px] whitespace-nowrap">
            Proposal Manager
          </p>
        </div>

        {/* Create New Proposal */}
        <div
          onClick={() => navigate('/proposal/new')}
          className={`flex items-center justify-center px-[15px] py-[10px] w-full cursor-pointer transition-colors ${
            isNewProposal
              ? 'border-[#4a9380] border-r-4 border-solid'
              : 'hover:bg-[#e6e6e6]'
          }`}
        >
          <p className={`flex-1 font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[16px] ${
            isNewProposal ? 'text-[#4a9380]' : 'text-[#161616]'
          }`}>
            Create New Proposal
          </p>
        </div>

        {/* Recent Proposals Section */}
        <div className="border-[#e6e6e6] border-solid border-t flex flex-col gap-[10px] py-[15px] w-full">
          <div
            onClick={() => navigate('/')}
            className={`flex gap-[10px] items-center justify-center px-[15px] w-full cursor-pointer transition-colors ${
              !isNewProposal
                ? 'border-[#4a9380] border-r-4 border-solid'
                : 'hover:bg-[#e6e6e6]'
            }`}
          >
            <p className={`flex-1 font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[16px] ${
              !isNewProposal ? 'text-[#4a9380]' : 'text-[#161616]'
            }`}>
              Recent Proposals
            </p>
          </div>

          {/* Category Items */}
          <CategoryItem label="Weddings (26)" />
          <CategoryItem label="Baby Showers (15)" />
          <CategoryItem label="Quinceeanera (11)" />
          <CategoryItem label="Fund Raiser (3)" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#fcfefe] flex flex-col flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}

function CategoryItem({ label }) {
  const imgPolygon1 = "https://www.figma.com/api/mcp/asset/5dd76d52-b0fa-40ff-8595-bcd89a27aa36";

  return (
    <div className="flex gap-[10px] items-center justify-center px-[15px] py-[5px] w-full cursor-pointer hover:bg-[#e6e6e6]">
      <p className="flex-1 font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] text-[#666] text-[12px] uppercase" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        {label}
      </p>
      <div className="flex items-center justify-center size-[8px]">
        <div className="flex-none rotate-90">
          <div className="relative size-[8px]">
            <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
              <img alt="" className="block max-w-none size-full" src={imgPolygon1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
