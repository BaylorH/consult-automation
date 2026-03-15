// Layout Component - Persistent sidebar with dynamic main content
// Uses React properly - sidebar stays, content swaps

import { useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProposals } from '../hooks/useProposals';
import { useSplashCursor } from '../App';

// Local assets (bundled, instant load)
import logoMain from '../assets/images/logo-main.png';
import logoFlower from '../assets/images/logo-flower.png';
import chevronIcon from '../assets/images/chevron.png';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { proposals, loading } = useProposals();
  const { splashCursorEnabled, toggleSplashCursor } = useSplashCursor();

  // Get current proposal ID from URL
  const pathParts = location.pathname.split('/');
  const currentProposalId = pathParts[1] === 'proposal' && pathParts[2] !== 'new' ? pathParts[2] : null;
  const isNewProposal = location.pathname === '/proposal/new';
  const isOnDashboard = location.pathname === '/';

  // Group proposals by consultant (author), then by consultation level
  const groupedProposals = useMemo(() => {
    const groups = {};

    (proposals || []).forEach((proposal) => {
      const author = proposal.author || 'Unknown';
      const level = proposal.consultationLevel || 'Basic Consultation';

      if (!groups[author]) {
        groups[author] = {
          total: 0,
          levels: {}
        };
      }

      if (!groups[author].levels[level]) {
        groups[author].levels[level] = [];
      }

      groups[author].levels[level].push(proposal);
      groups[author].total++;
    });

    // Sort authors alphabetically
    const sortedGroups = {};
    Object.keys(groups).sort().forEach(key => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }, [proposals]);

  // Find which consultant the current proposal belongs to
  const currentConsultant = useMemo(() => {
    if (!currentProposalId) return null;
    for (const [author, data] of Object.entries(groupedProposals)) {
      for (const props of Object.values(data.levels)) {
        if (props.some(p => p.id === currentProposalId)) {
          return author;
        }
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
      <div className="sticky top-0 h-screen flex flex-col gap-[30px] items-center py-[15px] shrink-0 bg-white">
        <div className="h-[93px] relative shrink-0 w-[68px]" data-name="Screenshot 2026-01-18 at 4.19.38 PM 1">
          <img alt="FiftyFlowers Logo" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={logoMain} />
        </div>
        <button
          onClick={toggleSplashCursor}
          className={`h-[32px] relative shrink-0 w-[29px] cursor-pointer transition-all duration-300 hover:scale-110 ${
            splashCursorEnabled ? 'drop-shadow-[0_0_8px_rgba(74,147,128,0.8)]' : ''
          }`}
          title={splashCursorEnabled ? 'Disable cursor effect' : 'Enable cursor effect'}
        >
          <img alt="Flower Icon" className="absolute inset-0 max-w-none object-cover size-full" src={logoFlower} />
        </button>
      </div>

      {/* Sidebar */}
      <div className="sticky top-0 h-screen overflow-y-auto bg-[#f3f5f6] border-r border-[#e6e6e6] flex flex-col gap-[15px] py-[15px] shrink-0 w-[220px]">
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

        {/* Proposals by Consultant */}
        <div className="flex flex-col gap-[5px] w-full">
          <p className="px-[15px] font-['Avenir:Heavy',sans-serif] text-[#999] text-[10px] uppercase tracking-wide mb-[5px]">
            By Consultant
          </p>

          {loading ? (
            <p className="px-[15px] font-['Avenir:Roman',sans-serif] text-[#999] text-[12px]">
              Loading...
            </p>
          ) : Object.keys(groupedProposals).length === 0 ? (
            <p className="px-[15px] font-['Avenir:Roman',sans-serif] text-[#999] text-[12px]">
              No proposals yet
            </p>
          ) : (
            Object.entries(groupedProposals).map(([author, data]) => (
              <ConsultantSection
                key={author}
                consultant={author}
                total={data.total}
                levels={data.levels}
                currentProposalId={currentProposalId}
                isActiveConsultant={currentConsultant === author}
                onSelectProposal={(id) => navigate(`/proposal/${id}`)}
              />
            ))
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

// Short labels for consultation levels
const LEVEL_LABELS = {
  'Basic Consultation': 'Basic',
  'Professional Consultation': 'Professional',
  'Deluxe Consultation': 'Deluxe',
};

// Order for consultation levels
const LEVEL_ORDER = ['Basic Consultation', 'Professional Consultation', 'Deluxe Consultation'];

function ConsultantSection({ consultant, total, levels, currentProposalId, isActiveConsultant, onSelectProposal }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand if the current proposal is under this consultant
  const shouldShow = isExpanded || isActiveConsultant;

  // Sort levels in defined order
  const sortedLevels = LEVEL_ORDER.filter(level => levels[level] && levels[level].length > 0);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Consultant Header */}
      <div
        className={`flex gap-[10px] items-center px-[15px] py-[8px] w-full cursor-pointer transition-colors ${
          isActiveConsultant ? 'bg-[#e8f5f1]' : 'hover:bg-[#e6e6e6]'
        }`}
      >
        <p className={`flex-1 font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] text-[12px] ${
          isActiveConsultant ? 'text-[#4a9380]' : 'text-[#666]'
        }`}>
          {consultant} ({total})
        </p>
        <div className={`flex items-center justify-center size-[8px] transition-transform ${shouldShow ? 'rotate-180' : ''}`}>
          <img alt="" className="block max-w-none size-full" src={chevronIcon} />
        </div>
      </div>

      {/* Expanded: Consultation Levels */}
      {shouldShow && sortedLevels.length > 0 && (
        <div className="flex flex-col bg-[#eaecec]">
          {sortedLevels.map((level) => (
            <LevelSection
              key={level}
              level={level}
              label={LEVEL_LABELS[level] || level}
              proposals={levels[level]}
              currentProposalId={currentProposalId}
              onSelectProposal={onSelectProposal}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LevelSection({ level, label, proposals, currentProposalId, onSelectProposal }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if current proposal is in this level
  const hasActiveProposal = proposals.some(p => p.id === currentProposalId);
  const shouldShow = isExpanded || hasActiveProposal;

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Level Header */}
      <div
        className={`flex gap-[10px] items-center px-[20px] py-[5px] w-full cursor-pointer transition-colors ${
          hasActiveProposal ? 'bg-[#d4e8e3]' : 'hover:bg-[#dfe1e1]'
        }`}
      >
        <p className={`flex-1 font-['Avenir:Roman',sans-serif] text-[11px] uppercase tracking-wide ${
          hasActiveProposal ? 'text-[#4a9380] font-medium' : 'text-[#888]'
        }`}>
          {label} ({proposals.length})
        </p>
        <div className={`flex items-center justify-center size-[6px] transition-transform ${shouldShow ? 'rotate-180' : ''}`}>
          <img alt="" className="block max-w-none size-full opacity-50" src={chevronIcon} />
        </div>
      </div>

      {/* Proposals List */}
      {shouldShow && (
        <div className="flex flex-col bg-[#e2e4e4]">
          {proposals.map((proposal) => {
            const isActive = proposal.id === currentProposalId;
            const displayName = proposal.proposalName || proposal.customerName || proposal.eventName || 'Untitled Proposal';

            return (
              <div
                key={proposal.id}
                onClick={() => onSelectProposal(proposal.id)}
                className={`flex items-center px-[28px] py-[5px] cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#4a9380] text-white border-r-4 border-[#2d6b5a]'
                    : 'hover:bg-[#d8dada] text-[#333]'
                }`}
              >
                <p className={`font-['Avenir:Roman',sans-serif] text-[11px] truncate ${
                  isActive ? 'text-white font-medium' : 'text-[#333]'
                }`}>
                  {displayName}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
