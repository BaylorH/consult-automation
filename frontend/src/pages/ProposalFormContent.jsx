// ProposalFormContent - Main content only (Layout provides sidebar)
import { useState } from 'react';
import ShoppingList from '../components/ShoppingList';
import BasicFloralRecipes from '../components/BasicFloralRecipes';

const imgImage7 = "https://www.figma.com/api/mcp/asset/3d26f03c-a823-49a8-9b70-b5c4f99cef81";
const imgImage3 = "https://www.figma.com/api/mcp/asset/306f85a0-2700-4e8f-9d25-280ee09ad142";
const imgRectangle9 = "https://www.figma.com/api/mcp/asset/bc565399-8be4-4097-8073-dd8867d8524e";
const imgImage6 = "https://www.figma.com/api/mcp/asset/36dac031-44a8-4379-988c-de85b8230c3a";
const imgImage4 = "https://www.figma.com/api/mcp/asset/ce0fd175-39ad-4c31-b6e8-79abaf5373b2";
const imgScreenshot20260118At111910Pm1 = "https://www.figma.com/api/mcp/asset/d2a7295e-4cb5-4fee-a8bf-bd654c722bf3";
const imgPolygon3 = "https://www.figma.com/api/mcp/asset/2b7c5d70-e223-4e04-ac8c-c4a616e6426d";

export default function ProposalFormContent() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    proposalName: '',
    consultationLevel: 'Basic Consultation',
    eventName: '',
    proposalTemplate: 'Modern Wedding Consultation',
    eventDate: '',
    deliveryDate: '',
    styleNotes: '',
  });

  const [recipes, setRecipes] = useState([]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isProfessional = formData.consultationLevel === 'Professional Consultation';

  return (
    <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
      {/* Header */}
      <div className="flex gap-[10px] items-center justify-between px-[15px] py-[15px]">
        <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
          {`Proposal Builder > New Proposal`}
        </p>
        <div className="flex gap-[10px]">
          <div className="bg-[rgba(238,238,238,0.93)] border border-[#ccc] border-solid flex gap-[5px] items-center justify-center p-[5px] cursor-pointer hover:bg-[#e6e6e6]">
            <div className="relative size-[20px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
            </div>
            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] whitespace-nowrap">
              Share Proposal
            </p>
          </div>
          <div className="bg-[rgba(238,238,238,0.93)] border border-[#ccc] border-solid flex gap-[5px] items-center justify-center p-[5px] cursor-pointer hover:bg-[#e6e6e6]">
            <div className="relative size-[15px]">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
            </div>
            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] whitespace-nowrap">
              Save Proposal
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-[#fcfdfd] border border-[#ccc] border-solid flex flex-col gap-[30px] p-[30px]">
        {/* Consultation Proposal Set */}
        <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] px-[15px] py-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">
            Consultation Proposal Set
          </p>

          <FormField label="Customer Name:">
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              className="border border-[rgba(204,204,204,0.93)] border-solid h-[45px] rounded-[5px] w-full px-[15px] font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none"
            />
          </FormField>

          <FormField label="Customer Email:">
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => updateField('customerEmail', e.target.value)}
              className="border border-[rgba(204,204,204,0.93)] border-solid h-[45px] rounded-[5px] w-full px-[15px] font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none"
            />
          </FormField>

          <FormField label="Proposal Name:">
            <input
              type="text"
              value={formData.proposalName}
              onChange={(e) => updateField('proposalName', e.target.value)}
              className="border border-[rgba(204,204,204,0.93)] border-solid h-[45px] rounded-[5px] w-full px-[15px] font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none"
            />
          </FormField>

          <FormField label="Consultation Level:">
            <select
              value={formData.consultationLevel}
              onChange={(e) => updateField('consultationLevel', e.target.value)}
              className="border border-[#ccc] border-solid h-[45px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] bg-white outline-none cursor-pointer"
            >
              <option value="Basic Consultation">Basic Consultation</option>
              <option value="Professional Consultation">Professional Consultation</option>
            </select>
          </FormField>

          <FormField label="Event Name:">
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => updateField('eventName', e.target.value)}
              className="border border-[rgba(204,204,204,0.93)] border-solid h-[45px] rounded-[5px] w-full px-[15px] font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none"
            />
          </FormField>

          <FormField label="Proposal Template:">
            <select
              value={formData.proposalTemplate}
              onChange={(e) => updateField('proposalTemplate', e.target.value)}
              className="border border-[#ccc] border-solid h-[45px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] bg-white outline-none cursor-pointer"
            >
              <option value="Modern Wedding Consultation">Modern Wedding Consultation</option>
              <option value="Classic Wedding Consultation">Classic Wedding Consultation</option>
              <option value="Baby Shower Consultation">Baby Shower Consultation</option>
              <option value="Quinceañera Consultation">Quinceañera Consultation</option>
              <option value="Fund Raiser Consultation">Fund Raiser Consultation</option>
            </select>
          </FormField>

          <FormField label="Event Date:">
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => updateField('eventDate', e.target.value)}
              className="border border-[#ccc] border-solid h-[45px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none cursor-pointer"
            />
          </FormField>

          <FormField label="Delivery Date:">
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => updateField('deliveryDate', e.target.value)}
              className="border border-[#ccc] border-solid h-[45px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none cursor-pointer"
            />
          </FormField>
        </div>

        {/* Inspiration & Style - Shows for BOTH Basic and Professional */}
        <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">{`Inspiration & Style`}</p>

          <div className="flex flex-col gap-[10px] w-full">
            <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
              Inspirational Images (Min 4, Max 8)
            </p>
            <div className="flex flex-wrap gap-[30px] pb-[15px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-[#ccc] border-dashed flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] cursor-pointer hover:bg-[#fafafa]">
                  <div className="opacity-50 size-[40px]">
                    <img alt="" className="max-w-none object-cover size-full" src={imgRectangle9} />
                  </div>
                  <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                    Add a Photo
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-[30px] w-full">
            <div className="flex flex-col gap-[10px] flex-1">
              <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                Color Palette (Min 4, Max 8)
              </p>
              <div className="flex flex-wrap gap-[30px]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-[#ccc] border-dashed flex items-center p-[10px] rounded-full cursor-pointer hover:bg-[#fafafa]">
                    <div className="size-[40px]">
                      <img alt="" className="max-w-none object-cover opacity-50 size-full" src={imgImage6} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[10px] flex-1">
              <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                Style Notes
              </p>
              <textarea
                value={formData.styleNotes}
                onChange={(e) => updateField('styleNotes', e.target.value)}
                className="border border-[rgba(204,204,204,0.93)] border-solid h-[130px] rounded-[5px] w-full p-[15px] font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none resize-none"
                placeholder="Add notes about style preferences..."
              />
            </div>
          </div>
        </div>

        {/* Featured Blooms */}
        <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
          <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">
            Featured Blooms
          </p>
          <div className="border border-[#999] border-solid flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
            <div className="size-[20px]">
              <img alt="" className="max-w-none object-cover size-full" src={imgImage4} />
            </div>
            <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
              No flowers selected yet. Start by searching for a flower or DIY kit above.
            </p>
          </div>
          <div className="flex gap-[15px] w-full">
            <div className="border border-[#ccc] border-solid flex gap-[10px] items-center px-[10px] py-[15px] rounded-[5px] flex-1">
              <div className="h-[18px] w-[20px]">
                <img alt="" className="max-w-none object-cover size-full" src={imgScreenshot20260118At111910Pm1} />
              </div>
              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px]">
                Search Products
              </p>
            </div>
            <div className="border border-[#ccc] border-solid flex gap-[60px] items-center p-[15px] rounded-[5px] cursor-pointer hover:bg-[#fafafa]">
              <p className="font-['Avenir:Roman',sans-serif] text-[#999] text-[14px]">
                Search by All
              </p>
              <div className="flex items-center justify-center">
                <div className="rotate-180 size-[15px]">
                  <img alt="" className="block max-w-none size-full" src={imgPolygon3} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Floral Recipes (Basic) OR Custom Floral Recipes (Professional) */}
        {!isProfessional ? (
          <BasicFloralRecipes />
        ) : (
          <div className="bg-white border border-[#eef0ef] border-solid flex flex-wrap gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
            <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] w-full">
              Custom Floral Recipes
            </p>
            <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[18px] w-full">
              Define arrangements and stem counts
            </p>
            <div className="border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] cursor-pointer hover:bg-[#fafafa]">
              <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                Add Floral Recipe
              </p>
            </div>
          </div>
        )}

        {/* Shopping List */}
        {recipes.length > 0 ? (
          <ShoppingList />
        ) : (
          <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
            <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
              Shopping List
            </p>
            <div className="border border-[#999] border-solid flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
              <div className="size-[20px]">
                <img alt="" className="max-w-none object-cover size-full" src={imgImage4} />
              </div>
              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
                Your shopping list will appear once you add recipes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-[5px] w-[450px]">
      <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}
