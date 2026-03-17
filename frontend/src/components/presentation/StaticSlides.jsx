// StaticSlides - Static content slides (Resources, Tips, Checklists)
// Same for all proposals

import SlideWrapper from './SlideWrapper';

// Resources & Tutorials slide
export function ResourcesSlide() {
  return (
    <SlideWrapper noPadding className="bg-white">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[60px]">
          Resources & Tutorials
        </h2>

        <div className="grid grid-cols-3 gap-[40px] w-full max-w-[1200px]">
          {/* Supplies Column */}
          <div className="flex flex-col">
            <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[20px] uppercase mb-[20px] border-b-2 border-[#055e5a] pb-2">
              Supplies You'll Need
            </h3>
            <ul className="list-disc pl-[20px] text-[#333] text-[14px] font-['Avenir',sans-serif] space-y-2">
              <li>Floral shears or sharp scissors</li>
              <li>Clean buckets or vases</li>
              <li>Flower food packets</li>
              <li>Floral tape (green)</li>
              <li>Floral wire (22-24 gauge)</li>
              <li>Ribbon for bouquet wrapping</li>
              <li>Boutonniere pins</li>
              <li>Spray bottle for misting</li>
              <li>Cool, dark storage space</li>
            </ul>
          </div>

          {/* Purchase Links Column */}
          <div className="flex flex-col">
            <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[20px] uppercase mb-[20px] border-b-2 border-[#055e5a] pb-2">
              Purchase Supplies
            </h3>
            <ul className="text-[14px] font-['Avenir',sans-serif] space-y-3">
              <li>
                <a href="https://www.fiftyflowers.com/collections/floral-supplies" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  FiftyFlowers Floral Supplies
                </a>
              </li>
              <li>
                <a href="https://www.fiftyflowers.com/collections/floral-tape" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  Floral Tape Collection
                </a>
              </li>
              <li>
                <a href="https://www.fiftyflowers.com/collections/ribbons" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  Ribbons & Wrapping
                </a>
              </li>
              <li>
                <a href="https://www.fiftyflowers.com/collections/vases" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  Vases & Containers
                </a>
              </li>
            </ul>
          </div>

          {/* Tutorials Column */}
          <div className="flex flex-col">
            <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[20px] uppercase mb-[20px] border-b-2 border-[#055e5a] pb-2">
              Helpful Tutorials
            </h3>
            <ul className="text-[14px] font-['Avenir',sans-serif] space-y-3">
              <li>
                <a href="https://www.fiftyflowers.com/blog/how-to-make-a-bridal-bouquet" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  How to Make a Bridal Bouquet
                </a>
              </li>
              <li>
                <a href="https://www.fiftyflowers.com/blog/diy-boutonniere" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  DIY Boutonniere Tutorial
                </a>
              </li>
              <li>
                <a href="https://www.fiftyflowers.com/blog/centerpiece-ideas" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  Centerpiece Ideas & How-To
                </a>
              </li>
              <li>
                <a href="https://www.fiftyflowers.com/blog/flower-care" target="_blank" rel="noopener noreferrer" className="text-[#055e5a] underline hover:text-[#044a48]">
                  Flower Care Guide
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Tips & Tricks slide
export function TipsSlide() {
  return (
    <SlideWrapper noPadding className="bg-[#e6f0e4]">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[60px]">
          Tips & Tricks
        </h2>

        <div className="grid grid-cols-3 gap-[40px] w-full max-w-[1200px]">
          {/* Floral Prep */}
          <div className="bg-white rounded-[15px] p-[30px] shadow-md">
            <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[18px] uppercase mb-[20px]">
              Floral Prep
            </h3>
            <ul className="list-disc pl-[20px] text-[#333] text-[14px] font-['Avenir',sans-serif] space-y-2">
              <li>Cut stems at a 45-degree angle</li>
              <li>Remove leaves below water line</li>
              <li>Use room temperature water</li>
              <li>Add flower food to water</li>
              <li>Re-cut stems every 2-3 days</li>
              <li>Keep flowers in cool area (65-72°F)</li>
            </ul>
          </div>

          {/* Design Prep & Storage */}
          <div className="bg-white rounded-[15px] p-[30px] shadow-md">
            <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[18px] uppercase mb-[20px]">
              Design Prep & Storage
            </h3>
            <ul className="list-disc pl-[20px] text-[#333] text-[14px] font-['Avenir',sans-serif] space-y-2">
              <li>Design bouquets 1-2 days before</li>
              <li>Store completed designs in fridge</li>
              <li>Mist arrangements lightly</li>
              <li>Keep away from fruits (ethylene gas)</li>
              <li>Avoid direct sunlight</li>
              <li>Check water levels daily</li>
            </ul>
          </div>

          {/* Transportation */}
          <div className="bg-white rounded-[15px] p-[30px] shadow-md">
            <h3 className="font-['Nunito_Sans',sans-serif] font-bold text-[#055e5a] text-[18px] uppercase mb-[20px]">
              Transportation
            </h3>
            <ul className="list-disc pl-[20px] text-[#333] text-[14px] font-['Avenir',sans-serif] space-y-2">
              <li>Keep car cool (AC on)</li>
              <li>Lay bouquets flat or upright</li>
              <li>Use boxes with tissue paper</li>
              <li>Secure arrangements so they don't tip</li>
              <li>Transport last, just before event</li>
              <li>Have spray bottle and scissors handy</li>
            </ul>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Flower Day 1 Checklist
export function FlowerDay1Slide() {
  return (
    <SlideWrapper noPadding className="bg-white">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[10px]">
          Flower Day 1
        </h2>
        <p className="font-['Nunito_Sans',sans-serif] text-[#666] text-[18px] mb-[40px]">
          Delivery & Processing Day
        </p>

        <div className="bg-[#fef6f0] rounded-[15px] p-[40px] w-full max-w-[800px] shadow-md">
          <ul className="space-y-4 text-[16px] font-['Avenir',sans-serif]">
            <ChecklistItem>Receive flower delivery and inspect for damage</ChecklistItem>
            <ChecklistItem>Unpack boxes immediately</ChecklistItem>
            <ChecklistItem>Cut stems at 45-degree angle (1-2 inches off)</ChecklistItem>
            <ChecklistItem>Remove any damaged petals or leaves</ChecklistItem>
            <ChecklistItem>Remove leaves that will be below water line</ChecklistItem>
            <ChecklistItem>Fill clean buckets with room temperature water</ChecklistItem>
            <ChecklistItem>Add flower food to water</ChecklistItem>
            <ChecklistItem>Place stems in water - group by variety</ChecklistItem>
            <ChecklistItem>Store in cool location (65-72°F)</ChecklistItem>
            <ChecklistItem>Allow flowers to hydrate for 4-6 hours before arranging</ChecklistItem>
          </ul>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Flower Day 2 Checklist
export function FlowerDay2Slide() {
  return (
    <SlideWrapper noPadding className="bg-[#e6f0e4]">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[10px]">
          Flower Day 2
        </h2>
        <p className="font-['Nunito_Sans',sans-serif] text-[#666] text-[18px] mb-[40px]">
          Design Day - Personal Flowers
        </p>

        <div className="bg-white rounded-[15px] p-[40px] w-full max-w-[800px] shadow-md">
          <ul className="space-y-4 text-[16px] font-['Avenir',sans-serif]">
            <ChecklistItem>Check flower hydration - re-cut stems if needed</ChecklistItem>
            <ChecklistItem>Gather all supplies and tools</ChecklistItem>
            <ChecklistItem>Set up clean workspace</ChecklistItem>
            <ChecklistItem>Create bride's bouquet first</ChecklistItem>
            <ChecklistItem>Create bridesmaid bouquets</ChecklistItem>
            <ChecklistItem>Make boutonnieres</ChecklistItem>
            <ChecklistItem>Make corsages</ChecklistItem>
            <ChecklistItem>Create flower girl basket/crown</ChecklistItem>
            <ChecklistItem>Mist completed designs lightly</ChecklistItem>
            <ChecklistItem>Store personal flowers in refrigerator</ChecklistItem>
          </ul>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Flower Day 3 Checklist
export function FlowerDay3Slide() {
  return (
    <SlideWrapper noPadding className="bg-white">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[10px]">
          Flower Day 3
        </h2>
        <p className="font-['Nunito_Sans',sans-serif] text-[#666] text-[18px] mb-[40px]">
          Design Day - Ceremony & Reception
        </p>

        <div className="bg-[#fef6f0] rounded-[15px] p-[40px] w-full max-w-[800px] shadow-md">
          <ul className="space-y-4 text-[16px] font-['Avenir',sans-serif]">
            <ChecklistItem>Check all flowers - re-cut and hydrate as needed</ChecklistItem>
            <ChecklistItem>Create ceremony arrangements (altar, aisle, etc.)</ChecklistItem>
            <ChecklistItem>Create reception centerpieces</ChecklistItem>
            <ChecklistItem>Create any remaining decorative pieces</ChecklistItem>
            <ChecklistItem>Final misting of all arrangements</ChecklistItem>
            <ChecklistItem>Touch up any wilting blooms</ChecklistItem>
            <ChecklistItem>Prepare transport containers/boxes</ChecklistItem>
            <ChecklistItem>Create backup/extra arrangements if time allows</ChecklistItem>
            <ChecklistItem>Organize all pieces by location/delivery</ChecklistItem>
            <ChecklistItem>Get rest - big day tomorrow!</ChecklistItem>
          </ul>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Event Day Checklist
export function EventDaySlide() {
  return (
    <SlideWrapper noPadding className="bg-[#fef6f0]">
      <div className="flex flex-col items-center px-[60px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase mb-[10px]">
          Event Day
        </h2>
        <p className="font-['Nunito_Sans',sans-serif] text-[#666] text-[18px] mb-[40px]">
          The Big Day!
        </p>

        <div className="bg-white rounded-[15px] p-[40px] w-full max-w-[800px] shadow-md">
          <ul className="space-y-4 text-[16px] font-['Avenir',sans-serif]">
            <ChecklistItem>Final mist of all flowers</ChecklistItem>
            <ChecklistItem>Pack flowers carefully for transport</ChecklistItem>
            <ChecklistItem>Bring emergency kit: scissors, tape, pins, wire, ribbon</ChecklistItem>
            <ChecklistItem>Transport flowers with AC on</ChecklistItem>
            <ChecklistItem>Deliver personal flowers to bridal suite</ChecklistItem>
            <ChecklistItem>Set up ceremony arrangements</ChecklistItem>
            <ChecklistItem>Set up reception centerpieces</ChecklistItem>
            <ChecklistItem>Touch up any arrangements as needed</ChecklistItem>
            <ChecklistItem>Take photos of your beautiful work!</ChecklistItem>
            <ChecklistItem>Enjoy the celebration!</ChecklistItem>
          </ul>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Share Your Flair slide
export function ShareYourFlairSlide() {
  return (
    <SlideWrapper noPadding className="bg-[#055e5a]">
      <div className="flex flex-col items-center justify-center px-[60px] py-[120px] w-full text-center">
        <img
          src="/presentation/logo-flower.png"
          alt="FiftyFlowers"
          className="w-[120px] h-auto mb-[40px] opacity-80"
        />
        <h2 className="font-['EB_Garamond',serif] font-bold text-white text-[48px] uppercase mb-[20px]">
          Share Your Flair
        </h2>
        <p className="font-['Nunito_Sans',sans-serif] text-white text-[20px] max-w-[600px] mb-[40px] leading-relaxed">
          We'd love to see your beautiful creations! Share your photos on social media and tag us for a chance to be featured.
        </p>
        <div className="flex gap-[30px] text-white text-[16px] font-['Nunito_Sans',sans-serif]">
          <span>@fiftyflowers</span>
          <span>#ShareYourFlair</span>
          <span>#FiftyFlowers</span>
        </div>
      </div>
    </SlideWrapper>
  );
}

// Helper component for checklist items
function ChecklistItem({ children }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-[20px] h-[20px] border-2 border-[#055e5a] rounded flex-shrink-0 mt-0.5" />
      <span className="text-[#333]">{children}</span>
    </li>
  );
}

// Export all static slides as a single component
export default function StaticSlides() {
  return (
    <>
      <ResourcesSlide />
      <TipsSlide />
      <FlowerDay1Slide />
      <FlowerDay2Slide />
      <FlowerDay3Slide />
      <EventDaySlide />
      <ShareYourFlairSlide />
    </>
  );
}
