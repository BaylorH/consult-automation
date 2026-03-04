// DashboardContent - Main content only (Layout provides sidebar)
import { useNavigate } from 'react-router-dom';
import { useProposals } from '../hooks/useProposals';

// Inline SVG icon (no network request, instant load)
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full text-[#666]">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export default function DashboardContent() {
  const navigate = useNavigate();
  const { proposals, loading, error } = useProposals();

  // Format Firestore timestamp to display string
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // Handle Firestore Timestamp object
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
      {/* Header */}
      <div className="flex gap-[10px] items-center px-[15px] py-[15px]">
        <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
          Proposals
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#fcfdfd] border border-[#ccc] border-solid flex flex-col p-[30px]">
        <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">
            Recent Proposals
          </p>

          {loading && (
            <div className="w-full flex flex-col items-center justify-center py-16">
              {/* Spinner */}
              <div className="relative mb-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#e6e6e6]" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-[#4a9380] animate-spin" />
              </div>
              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px]">
                Loading proposals...
              </p>
            </div>
          )}

          {error && (
            <p className="font-['Avenir:Roman',sans-serif] text-red-500 text-[16px]">
              Error loading proposals: {error}
            </p>
          )}

          {!loading && !error && proposals.length === 0 && (
            <div className="border border-[#999] border-solid flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
              <div className="size-[20px]">
                <InfoIcon />
              </div>
              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
                No proposals yet. Click "Create New Proposal" to get started.
              </p>
            </div>
          )}

          {!loading && !error && proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              type={proposal.type}
              typeColor={proposal.typeColor}
              title={proposal.eventName}
              image={proposal.cardImage}
              date={formatDate(proposal.updatedAt)}
              author={proposal.author}
              onEdit={() => navigate(`/proposal/${proposal.id}`)}
            />
          ))}
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
