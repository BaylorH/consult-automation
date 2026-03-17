// PresentationPage - Full presentation view for a proposal
// Renders all slides vertically for viewing/printing

import { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProposal } from '../hooks/useProposals';

// Slide components
import TitleSlide from '../components/presentation/TitleSlide';
import InspirationSlide from '../components/presentation/InspirationSlide';
import FeaturedBloomsSlide from '../components/presentation/FeaturedBloomsSlide';
import RecipesSlide from '../components/presentation/RecipesSlide';
import ShoppingListSlide from '../components/presentation/ShoppingListSlide';
import StaticSlides from '../components/presentation/StaticSlides';

export default function PresentationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Always fetch fresh from Firestore (skip cache) to ensure latest form data
  const { proposal, loading, error } = useProposal(id, { skipCache: true });
  const printRef = useRef();

  // Handle print/PDF
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4a9380] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#666] font-['Avenir',sans-serif]">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading proposal: {error}</p>
          <Link to="/" className="text-[#055e5a] underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666] mb-4">Proposal not found</p>
          <Link to="/" className="text-[#055e5a] underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isBasicConsultation = proposal.consultationLevel === 'Basic Consultation';

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Sticky header with navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-md print:hidden">
        <div className="max-w-[1440px] mx-auto px-[30px] py-[15px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/proposal/${id}`)}
              className="flex items-center gap-2 text-[#055e5a] hover:text-[#044a48] font-['Avenir',sans-serif] text-[14px] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Form
            </button>
            <span className="text-[#ccc]">|</span>
            <Link
              to="/"
              className="text-[#666] hover:text-[#333] font-['Avenir',sans-serif] text-[14px] cursor-pointer"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#666] font-['Avenir',sans-serif] text-[14px] mr-4">
              {proposal.eventName || 'Untitled Proposal'}
            </span>
            <button
              onClick={handlePrint}
              className="bg-[#055e5a] text-white px-[20px] py-[10px] rounded-[5px] font-['Avenir',sans-serif] text-[14px] hover:bg-[#044a48] flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Presentation content */}
      <main ref={printRef} className="flex flex-col items-center">
        {/* SLIDE 1: Title */}
        <TitleSlide
          eventName={proposal.eventName}
          eventDate={proposal.eventDate}
        />

        {/* SLIDE 2: Inspiration + Color Palette */}
        <InspirationSlide
          inspirationImages={proposal.inspirationImages || []}
          colorPalette={proposal.colorPalette || []}
        />

        {/* SLIDE 3: Featured Blooms */}
        <FeaturedBloomsSlide
          featuredBlooms={proposal.featuredBlooms || []}
        />

        {/* SLIDE 4: Custom Floral Recipes (Professional only) */}
        {!isBasicConsultation && (
          <RecipesSlide
            recipes={proposal.recipes || []}
          />
        )}

        {/* SLIDE 5: Shopping List */}
        <ShoppingListSlide
          recipes={proposal.recipes || []}
          featuredBlooms={proposal.featuredBlooms || []}
          isBasicConsultation={isBasicConsultation}
          eventDate={proposal.eventDate}
          deliveryDate={proposal.deliveryDate}
          couponCode={proposal.couponCode || 'Consult2026'}
          savedSelections={proposal.shoppingListSelections || {}}
        />

        {/* SLIDES 6-15: Static content */}
        <StaticSlides />
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          header {
            display: none !important;
          }

          main {
            padding: 0;
          }

          /* Each slide wrapper should be a page break */
          main > div {
            page-break-after: always;
            page-break-inside: avoid;
          }

          main > div:last-child {
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
