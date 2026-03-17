// DashboardContent - Main content only (Layout provides sidebar)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProposals } from '../hooks/useProposals';
import { HandWrittenTitle } from '../components/ui/HandWrittenTitle';
import { GlowingEffect } from '../components/ui/GlowingEffect';

// Inline SVG icon (no network request, instant load)
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full text-[#666]">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

// Consultation level colors
const LEVEL_COLORS = {
  'Basic Consultation': '#6b7280',      // Gray
  'Professional Consultation': '#4a9380', // Teal (brand color)
  'Deluxe Consultation': '#8b5cf6',     // Purple
};

// Short labels for display
const LEVEL_LABELS = {
  'Basic Consultation': 'Basic',
  'Professional Consultation': 'Professional',
  'Deluxe Consultation': 'Deluxe',
};

export default function DashboardContent() {
  const navigate = useNavigate();
  const { proposals, loading, error } = useProposals();

  // Format Firestore timestamp to display string
  // Handles: Firestore Timestamp, serialized {seconds, nanoseconds}, Date, ISO string
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      let date;
      if (timestamp.toDate) {
        // Real Firestore Timestamp object
        date = timestamp.toDate();
      } else if (timestamp.seconds !== undefined) {
        // Serialized Timestamp from cache (lost toDate method)
        date = new Date(timestamp.seconds * 1000);
      } else {
        // String or Date
        date = new Date(timestamp);
      }
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
      {/* Animated Header */}
      <div className="flex gap-[10px] items-center">
        <HandWrittenTitle title="Proposals" />
      </div>

      {/* Main Content Card */}
      <div className="bg-[#fcfdfd] border border-[#ccc] border-solid flex flex-col p-[30px]">
        <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">
            Recent Proposals
          </p>

          {/* Loading skeleton cards with shimmer effect */}
          {loading && (
            <>
              {[...Array(16)].map((_, i) => (
                <SkeletonCard key={i} delay={i * 0.1} />
              ))}
            </>
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

          {!loading && !error && proposals.map((proposal, index) => (
            <ProposalCard
              key={proposal.id}
              type={LEVEL_LABELS[proposal.consultationLevel] || proposal.consultationLevel || 'Basic'}
              typeColor={LEVEL_COLORS[proposal.consultationLevel] || LEVEL_COLORS['Basic Consultation']}
              title={proposal.eventName}
              image={proposal.cardImage}
              date={formatDate(proposal.eventDate)}
              author={proposal.author}
              onEdit={() => navigate(`/proposal/${proposal.id}`)}
              onView={() => navigate(`/proposal/${proposal.id}/presentation`)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Shimmer animation styles */}
      <style>{`
        @keyframes tealShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes cardFadeIn {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #e5e7eb 0%,
            #e5e7eb 40%,
            rgba(74, 147, 128, 0.3) 50%,
            #e5e7eb 60%,
            #e5e7eb 100%
          );
          background-size: 200% 100%;
          animation: tealShimmer 1.8s ease-in-out infinite;
        }

        .card-enter {
          animation: cardFadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// Skeleton loading card with shimmer effect
function SkeletonCard({ delay = 0 }) {
  return (
    <div
      className="bg-white border border-[#e5e7eb] border-solid flex flex-col gap-[10px] p-[10px] rounded-[5px] w-[211px]"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Type badge skeleton */}
      <div className="shimmer h-[22px] w-[80px] rounded-[50px] mx-auto" />

      {/* Title skeleton */}
      <div className="shimmer h-[16px] w-[90%] rounded" />
      <div className="shimmer h-[16px] w-[60%] rounded" />

      {/* Image skeleton */}
      <div className="shimmer w-full h-[200px] rounded" />

      {/* Date/Author skeleton */}
      <div className="flex flex-col gap-[4px]">
        <div className="shimmer h-[12px] w-[70%] rounded" />
        <div className="shimmer h-[12px] w-[50%] rounded" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-[5px]">
        <div className="shimmer h-[28px] w-[45px] rounded" />
        <div className="shimmer h-[28px] w-[45px] rounded" />
        <div className="shimmer h-[28px] w-[65px] rounded" />
      </div>
    </div>
  );
}

function ProposalCard({ type, typeColor, title, image, date, author, onEdit, onView, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="relative rounded-[8px] p-[3px] card-enter"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="bg-white border border-[#999] border-solid flex flex-col gap-[10px] p-[10px] rounded-[5px] w-[211px] relative">
        <div className="flex items-center justify-center overflow-clip px-[12px] py-[4px] rounded-[50px]" style={{ backgroundColor: typeColor }}>
          <p className="font-['Avenir:Roman',sans-serif] text-[10px] text-white whitespace-nowrap">
            {type}
          </p>
        </div>
        <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[14px] uppercase">
          {title}
        </p>
        <div className="flex items-center justify-center overflow-clip w-full h-[200px] relative">
          {/* Shimmer placeholder while image loads */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 shimmer rounded" />
          )}
          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-[#f3f4f6] flex items-center justify-center">
              <span className="text-[#999] text-[12px]">Image unavailable</span>
            </div>
          )}
          {/* Actual image */}
          <img
            alt=""
            className={`max-w-none object-cover h-[200px] transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            src={image}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
        <div className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
          <p className="mb-0">Event: {date}</p>
          <p>by: {author}</p>
        </div>
        <div className="flex gap-[5px]">
          <button onClick={onView} className="border border-[#999] border-solid px-[10px] py-[5px] font-['Avenir:Medium',sans-serif] text-[12px] text-black cursor-pointer hover:bg-[#f3f5f6]">
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
    </div>
  );
}
