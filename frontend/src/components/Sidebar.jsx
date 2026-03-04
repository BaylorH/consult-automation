// Sidebar Component - Exact MCP Code
// Contains both Dashboard state (Call 1) and Form state (Call 2)
// Switches based on activeItem prop

import { useNavigate } from 'react-router-dom';

const imgPolygon1Dashboard = "https://www.figma.com/api/mcp/asset/210a5b9c-9bb6-4ad0-9fe6-d79be40d2262";
const imgPolygon1Form = "https://www.figma.com/api/mcp/asset/5dd76d52-b0fa-40ff-8595-bcd89a27aa36";

// Dashboard Sidebar - "Recent Proposals" is ACTIVE (from MCP-Call-1-Dashboard Node 1:7)
function SidebarDashboard() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f3f5f6] border-b border-black border-solid content-stretch flex flex-col gap-[15px] h-[1367px] items-start py-[15px] relative shrink-0 w-[184px]" data-node-id="1:8">
      <div className="border-[#e6e6e6] border-b border-solid content-stretch flex items-center justify-center p-[15px] relative shrink-0" data-node-id="1:17">
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] whitespace-nowrap" data-node-id="1:12">
          Proposal Manager
        </p>
      </div>
      <div onClick={() => navigate('/proposal/new')} className="content-stretch flex items-center justify-center px-[15px] py-[10px] relative shrink-0 w-full cursor-pointer hover:bg-[#e6e6e6]" data-node-id="1:36">
        <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#161616] text-[14px]" data-node-id="1:19">
          Create New Proposal
        </p>
      </div>
      <div className="border-[#e6e6e6] border-solid border-t content-stretch flex flex-col gap-[10px] items-start py-[15px] relative shrink-0 w-full" data-node-id="1:21">
        <div className="border-[#4a9380] border-r-4 border-solid content-stretch flex gap-[10px] items-center justify-center px-[15px] relative shrink-0 w-full" data-node-id="1:40">
          <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#4a9380] text-[16px]" data-node-id="1:41">
            Recent Proposals
          </p>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-name="Dec '25" data-node-id="1:59">
          <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="1:60" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
            Weddings (26)
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-[8px]">
            <div className="flex-none rotate-90">
              <div className="relative size-[8px]" data-node-id="1:61">
                <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon1Dashboard} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Jan '26" data-node-id="1:53">
          <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-node-id="1:45">
            <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="1:46" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
              Baby Showers (15)
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-[8px]">
              <div className="flex-none rotate-90">
                <div className="relative size-[8px]" data-node-id="1:47">
                  <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                    <img alt="" className="block max-w-none size-full" src={imgPolygon1Dashboard} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-name="Feb '26" data-node-id="1:49">
          <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="1:50" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
            Quinceeanera (11)
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-[8px]">
            <div className="flex-none rotate-90">
              <div className="relative size-[8px]" data-node-id="1:51">
                <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon1Dashboard} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-name="Mar '26" data-node-id="1:63">
          <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="1:64" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
            Fund Raiser (3)
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-[8px]">
            <div className="flex-none rotate-90">
              <div className="relative size-[8px]" data-node-id="1:65">
                <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon1Dashboard} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form Sidebar - "Create New Proposal" is ACTIVE (from MCP-Call-2-EmptyForm Node 28:471)
function SidebarForm() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f3f5f6] border-b border-black border-solid content-stretch flex flex-col gap-[15px] h-[1899px] items-start py-[15px] relative shrink-0" data-node-id="28:475">
      <div className="border-[#e6e6e6] border-b border-solid content-stretch flex items-center justify-center p-[15px] relative shrink-0" data-node-id="28:476">
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] whitespace-nowrap" data-node-id="28:477">
          Proposal Manager
        </p>
      </div>
      <div className="border-[#4a9380] border-r-4 border-solid content-stretch flex items-center justify-center px-[15px] py-[10px] relative shrink-0 w-full" data-node-id="28:478">
        <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#4a9380] text-[16px]" data-node-id="28:479">
          Create New Proposal
        </p>
      </div>
      <div className="border-[#e6e6e6] border-solid border-t content-stretch flex flex-col gap-[10px] items-start py-[15px] relative shrink-0 w-full" data-node-id="31:2">
        <div onClick={() => navigate('/')} className="content-stretch flex gap-[10px] items-center justify-center px-[15px] relative shrink-0 w-full cursor-pointer hover:bg-[#e6e6e6]" data-node-id="31:3">
          <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px not-italic relative text-[#161616] text-[16px]" data-node-id="31:4">
            Recent Proposals
          </p>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-name="Dec '25" data-node-id="31:6">
          <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="31:7" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
            Weddings (26)
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-[8px]">
            <div className="flex-none rotate-90">
              <div className="relative size-[8px]" data-node-id="31:8">
                <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon1Form} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Jan '26" data-node-id="31:9">
          <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-node-id="31:10">
            <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="31:11" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
              Baby Showers (15)
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-[8px]">
              <div className="flex-none rotate-90">
                <div className="relative size-[8px]" data-node-id="31:12">
                  <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                    <img alt="" className="block max-w-none size-full" src={imgPolygon1Form} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-name="Feb '26" data-node-id="31:16">
          <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="31:17" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
            Quinceeanera (11)
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-[8px]">
            <div className="flex-none rotate-90">
              <div className="relative size-[8px]" data-node-id="31:18">
                <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon1Form} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center px-[15px] py-[5px] relative shrink-0 w-full" data-name="Mar '26" data-node-id="31:19">
          <p className="flex-[1_0_0] font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] min-h-px min-w-px relative text-[#666] text-[12px] uppercase" data-node-id="31:20" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
            Fund Raiser (3)
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-[8px]">
            <div className="flex-none rotate-90">
              <div className="relative size-[8px]" data-node-id="31:21">
                <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon1Form} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Sidebar component - switches between states based on activeItem prop
export default function Sidebar({ activeItem = 'dashboard' }) {
  if (activeItem === 'newProposal') {
    return <SidebarForm />;
  }
  return <SidebarDashboard />;
}
