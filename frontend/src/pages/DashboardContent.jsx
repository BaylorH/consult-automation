// DashboardContent - Main content only (Layout provides sidebar)
import { useNavigate } from 'react-router-dom';

const imgImage7 = "https://www.figma.com/api/mcp/asset/f55a3330-8e8f-4469-a0ad-1953d62f9973";
const imgImage3 = "https://www.figma.com/api/mcp/asset/75c7788f-baec-4845-b1ca-d562f48e9e1d";
const imgImage8 = "https://www.figma.com/api/mcp/asset/cd315ad4-2c3a-42b2-9275-48274563c445";
const imgImage9 = "https://www.figma.com/api/mcp/asset/1ca91548-dda3-4d97-982b-952d863e69a6";
const imgImage10 = "https://www.figma.com/api/mcp/asset/6c4108f1-39a0-4e9c-9323-23b67aaae990";
const imgImage11 = "https://www.figma.com/api/mcp/asset/e2c6e9ed-17d1-42de-848c-e9c03958fbae";
const imgScreenshot20260121At111738Am1 = "https://www.figma.com/api/mcp/asset/c73da2b9-f214-4456-8e7b-657c00b9d0f1";
const imgImage12 = "https://www.figma.com/api/mcp/asset/2a79e4d7-51da-40d0-968f-73e270b863cf";
const imgImage13 = "https://www.figma.com/api/mcp/asset/bc7a18cb-3e8e-4504-a923-752bade2a7ae";
const imgImage14 = "https://www.figma.com/api/mcp/asset/5d50eef7-8bb8-4a4c-a0bf-28d30230f486";

export default function DashboardContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
      {/* Header */}
      <div className="flex gap-[10px] items-center justify-between px-[15px] py-[15px]">
        <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
          Proposals
        </p>
        <div className="flex gap-[10px]">
          <div className="bg-[rgba(238,238,238,0.93)] border border-[#ccc] border-solid flex gap-[5px] items-center justify-center p-[5px]">
            <div className="relative size-[20px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
            </div>
            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] whitespace-nowrap">
              Share Proposal
            </p>
          </div>
          <div className="bg-[rgba(238,238,238,0.93)] border border-[#ccc] border-solid flex gap-[5px] items-center justify-center p-[5px]">
            <div className="relative size-[15px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
            </div>
            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] whitespace-nowrap">
              Save Proposal
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#fcfdfd] border border-[#ccc] border-solid flex flex-col p-[30px]">
        <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">
            Recent Proposals
          </p>

          <ProposalCard
            type="Wedding"
            typeColor="#055e5a"
            title="Jonathan & Amandas Wedding Flowers"
            image={imgImage8}
            date="March 19, 2026"
            author="Becky Memmo"
            onEdit={() => navigate('/proposal/1')}
          />
          <ProposalCard
            type="Bachelorette"
            typeColor="#3ba59a"
            title="Brittany's Bachelorette Weekend"
            image={imgImage9}
            date="March 19, 2026"
            author="Becky Memmo"
            onEdit={() => navigate('/proposal/2')}
          />
          <ProposalCard
            type="Wedding"
            typeColor="#055e5a"
            title="Callum & Jackie's Wedding Flowers"
            image={imgImage10}
            date="March 19, 2026"
            author="Cynthia Paz"
            onEdit={() => navigate('/proposal/3')}
          />
          <ProposalCard
            type="Quinceeanera"
            typeColor="#e5c236"
            title="Tiffany García's 15 Birthday"
            image={imgImage11}
            date="March 19, 2026"
            author="Becky Memmo"
            onEdit={() => navigate('/proposal/4')}
          />
          <ProposalCard
            type="Wedding"
            typeColor="#055e5a"
            title="Kowalski Wedding Ceremony"
            image={imgScreenshot20260121At111738Am1}
            date="March 19, 2026"
            author="Adelena Whittaker"
            onEdit={() => navigate('/proposal/5')}
          />
          <ProposalCard
            type="Wedding"
            typeColor="#055e5a"
            title="Beth Goldstein Tropical Wedding"
            image={imgImage12}
            date="March 19, 2026"
            author="Mari Ramos"
            onEdit={() => navigate('/proposal/6')}
          />
          <ProposalCard
            type="Wedding"
            typeColor="#055e5a"
            title="Patels Traditional Wedding"
            image={imgImage13}
            date="March 19, 2026"
            author="Adelena Whittaker"
            onEdit={() => navigate('/proposal/7')}
          />
          <ProposalCard
            type="Baby Shower"
            typeColor="#e28dd6"
            title="Singer Modern Baby Shower"
            image={imgImage14}
            date="March 19, 2026"
            author="Camille Lemons"
            onEdit={() => navigate('/proposal/8')}
          />
        </div>
      </div>
    </div>
  );
}

function ProposalCard({ type, typeColor, title, image, date, author, onEdit }) {
  return (
    <div className="bg-white border border-[#999] border-solid flex flex-col gap-[10px] p-[10px] rounded-[5px] w-[211px]">
      <div className="flex items-center justify-center overflow-clip px-[12px] py-[4px] rounded-[50px]" style={{ backgroundColor: typeColor }}>
        <p className="font-['Avenir:Roman',sans-serif] text-[10px] text-white whitespace-nowrap">
          {type}
        </p>
      </div>
      <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[14px] uppercase">
        {title}
      </p>
      <div className="flex items-center justify-center overflow-clip w-full h-[200px]">
        <img alt="" className="max-w-none object-cover h-[200px]" src={image} />
      </div>
      <div className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
        <p className="mb-0">Updated: {date}</p>
        <p>by: {author}</p>
      </div>
      <div className="flex gap-[5px]">
        <button className="border border-[#999] border-solid px-[10px] py-[5px] font-['Avenir:Medium',sans-serif] text-[12px] text-black">
          View
        </button>
        <button onClick={onEdit} className="border border-[#999] border-solid px-[10px] py-[5px] font-['Avenir:Medium',sans-serif] text-[12px] text-black cursor-pointer hover:bg-[#f3f5f6]">
          Edit
        </button>
        <button className="border border-[#999] border-solid px-[10px] py-[5px] font-['Avenir:Medium',sans-serif] text-[12px] text-black">
          Duplicate
        </button>
      </div>
    </div>
  );
}
