// Layout Component - Persistent sidebar with dynamic main content
// Uses React properly - sidebar stays, content swaps

import { useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProposals } from '../hooks/useProposals';

// Local assets (bundled, instant load)
import logoMain from '../assets/images/logo-main.png';
import logoFlower from '../assets/images/logo-flower.png';
import chevronIcon from '../assets/images/chevron.png';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { proposals, loading } = useProposals();

  // Get current proposal ID from URL
  const pathParts = location.pathname.split('/');
  const currentProposalId = pathParts[1] === 'proposal' && pathParts[2] !== 'new' ? pathParts[2] : null;
  const isNewProposal = location.pathname === '/proposal/new';
  const isOnDashboard = location.pathname === '/';

  // Group proposals by consultation level
  const groupedProposals = useMemo(() => {
    const groups = {
      'Basic Consultation': [],
      'Professional Consultation': [],
      'Deluxe Consultation': [],
    };

    (proposals || []).forEach((proposal) => {
      const level = proposal.consultationLevel || 'Basic Consultation';
      if (groups[level]) {
        groups[level].push(proposal);
      } else {
        groups['Basic Consultation'].push(proposal);
      }
    });

    return groups;
  }, [proposals]);

  // Find which category the current proposal belongs to
  const currentProposalCategory = useMemo(() => {
    if (!currentProposalId) return null;
    for (const [level, props] of Object.entries(groupedProposals)) {
      if (props.some(p => p.id === currentProposalId)) {
        return level;
      }
    }
    return null;
  }, [currentProposalId, groupedProposals]);

  return (
    <div className="bg-white flex items-stretch min-h-screen w-full">
      {/* User Profile Pill - Top Right */}
      {user && (
        <div className="user-pill">
          <span className="user-name">{user.displayName}</span>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="user-avatar"
              referrerPolicy="no-referrer"
            />
          )}
          <button onClick={logout} className="signout-btn">
            Sign Out
          </button>
        </div>
      )}
      {/* Left Icons Column */}
      <div className="content-stretch flex flex-col gap-[30px] items-center py-[15px] shrink-0 bg-white">
        <div className="h-[93px] relative shrink-0 w-[68px]" data-name="Screenshot 2026-01-18 at 4.19.38 PM 1">
          <img alt="FiftyFlowers Logo" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={logoMain} />
        </div>
        <div className="h-[32px] relative shrink-0 w-[29px]" data-name="Screenshot 2026-01-18 at 4.27.23 PM 1">
          <img alt="Flower Icon" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={logoFlower} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-[#f3f5f6] border-r border-[#e6e6e6] flex flex-col gap-[15px] py-[15px] shrink-0 w-[220px]">
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
              ? 'border-[#4a9380] border-r-4 border-solid bg-[#e8f5f1]'
              : 'hover:bg-[#e6e6e6]'
          }`}
        >
          <p className={`flex-1 font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[16px] ${
            isNewProposal ? 'text-[#4a9380]' : 'text-[#161616]'
          }`}>
            + Create New Proposal
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e6e6e6] mx-[15px]" />

        {/* Dashboard Link */}
        <div
          onClick={() => navigate('/')}
          className={`flex items-center justify-center px-[15px] py-[10px] w-full cursor-pointer transition-colors ${
            isOnDashboard
              ? 'border-[#4a9380] border-r-4 border-solid bg-[#e8f5f1]'
              : 'hover:bg-[#e6e6e6]'
          }`}
        >
          <p className={`flex-1 font-['Inter:Bold',sans-serif] font-bold leading-[normal] text-[16px] ${
            isOnDashboard ? 'text-[#4a9380]' : 'text-[#161616]'
          }`}>
            All Proposals
          </p>
        </div>

        {/* Proposals by Category */}
        <div className="flex flex-col gap-[5px] w-full">
          <p className="px-[15px] font-['Avenir:Heavy',sans-serif] text-[#999] text-[10px] uppercase tracking-wide mb-[5px]">
            By Consultation Level
          </p>

          {loading ? (
            <p className="px-[15px] font-['Avenir:Roman',sans-serif] text-[#999] text-[12px]">
              Loading...
            </p>
          ) : (
            <>
              <CategorySection
                label="Basic"
                count={groupedProposals['Basic Consultation'].length}
                proposals={groupedProposals['Basic Consultation']}
                currentProposalId={currentProposalId}
                isActiveCategory={currentProposalCategory === 'Basic Consultation'}
                onSelectProposal={(id) => navigate(`/proposal/${id}`)}
              />
              <CategorySection
                label="Professional"
                count={groupedProposals['Professional Consultation'].length}
                proposals={groupedProposals['Professional Consultation']}
                currentProposalId={currentProposalId}
                isActiveCategory={currentProposalCategory === 'Professional Consultation'}
                onSelectProposal={(id) => navigate(`/proposal/${id}`)}
              />
              <CategorySection
                label="Deluxe"
                count={groupedProposals['Deluxe Consultation'].length}
                proposals={groupedProposals['Deluxe Consultation']}
                currentProposalId={currentProposalId}
                isActiveCategory={currentProposalCategory === 'Deluxe Consultation'}
                onSelectProposal={(id) => navigate(`/proposal/${id}`)}
              />
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#fcfefe] flex flex-col flex-1 min-h-screen">
        {children}
      </div>
    </div>
  );
}

function CategorySection({ label, count, proposals, currentProposalId, isActiveCategory, onSelectProposal }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand if the current proposal is in this category
  const shouldShow = isExpanded || isActiveCategory;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Category Header */}
      <div
        className={`flex gap-[10px] items-center px-[15px] py-[8px] w-full cursor-pointer transition-colors ${
          isActiveCategory ? 'bg-[#e8f5f1]' : 'hover:bg-[#e6e6e6]'
        }`}
      >
        <p className={`flex-1 font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] text-[12px] uppercase ${
          isActiveCategory ? 'text-[#4a9380]' : 'text-[#666]'
        }`}>
          {label} ({count})
        </p>
        <div className={`flex items-center justify-center size-[8px] transition-transform ${shouldShow ? 'rotate-180' : ''}`}>
          <img alt="" className="block max-w-none size-full" src={chevronIcon} />
        </div>
      </div>

      {/* Expanded Proposal List */}
      {shouldShow && proposals.length > 0 && (
        <div className="flex flex-col bg-[#eaecec]">
          {proposals.map((proposal) => {
            const isActive = proposal.id === currentProposalId;
            const displayName = proposal.proposalName || proposal.customerName || proposal.eventName || 'Untitled Proposal';

            return (
              <div
                key={proposal.id}
                onClick={() => onSelectProposal(proposal.id)}
                className={`flex items-center px-[20px] py-[6px] cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#4a9380] text-white border-r-4 border-[#2d6b5a]'
                    : 'hover:bg-[#dfe1e1] text-[#333]'
                }`}
              >
                <p className={`font-['Avenir:Roman',sans-serif] text-[12px] truncate ${
                  isActive ? 'text-white font-medium' : 'text-[#333]'
                }`}>
                  {displayName}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {shouldShow && proposals.length === 0 && (
        <div className="px-[20px] py-[6px] bg-[#eaecec]">
          <p className="font-['Avenir:Roman',sans-serif] text-[#999] text-[11px] italic">
            No proposals yet
          </p>
        </div>
      )}
    </div>
  );
}
