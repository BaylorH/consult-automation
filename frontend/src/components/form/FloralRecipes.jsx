// Styled from Figma MCP output - exact spacing and colors
import { useState } from 'react';

// Basic recipe templates from Figma
const recipeTemplates = [
  {
    id: 'bride-bouquet',
    name: 'Bridesmaid Bouquet',
    ingredients: ['18 Focal Flowers', '5 Filler Flowers', '8 Line Flowers', '5 Greenery']
  },
  {
    id: 'bridesmaid-bouquet',
    name: 'Bridesmaid Bouquet',
    ingredients: ['12 Focal Flowers', '3 Filler Flowers', '5 Line Flowers', '3 Greenery']
  },
  {
    id: 'groom-bout',
    name: "Groom's Boutonniere",
    ingredients: ['1 Focal Flower', '1 Line or Filler Flower', 'Greenery']
  },
  {
    id: 'groomsmen-bout',
    name: 'Groomsmen / Father / Officiant Boutonnieres',
    ingredients: ['1 Focal Flower', '1 Line or Filler Flower', 'Greenery']
  },
  {
    id: 'corsage',
    name: "Mother's Corsage",
    ingredients: ['1-2 Focal Flowers', 'Filler Flower', 'Greenery']
  },
  {
    id: 'centerpiece',
    name: 'Centerpiece',
    ingredients: ['9 Focal Flowers', '3 Filler Flowers', '5 Line Flowers', '3 Greenery']
  },
];

export default function FloralRecipes({ data, onChange }) {
  const isBasic = data.consultationLevel === 'Basic Consultation';
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [quantities, setQuantities] = useState({});
  const [customRecipes, setCustomRecipes] = useState(data.recipes || []);

  const toggleTemplate = (templateId) => {
    const newSelected = { ...selectedTemplates, [templateId]: !selectedTemplates[templateId] };
    setSelectedTemplates(newSelected);

    // Update recipes based on selection
    const recipes = recipeTemplates
      .filter(t => newSelected[t.id])
      .map(t => ({ ...t, quantity: quantities[t.id] || 1 }));
    onChange('recipes', recipes);
  };

  const updateQuantity = (templateId, qty) => {
    const newQuantities = { ...quantities, [templateId]: parseInt(qty) || 1 };
    setQuantities(newQuantities);

    // Update recipes
    const recipes = recipeTemplates
      .filter(t => selectedTemplates[t.id])
      .map(t => ({ ...t, quantity: newQuantities[t.id] || 1 }));
    onChange('recipes', recipes);
  };

  if (isBasic) {
    return (
      <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] items-start p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-[964px]">
        <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
          Basic Floral Recipes
        </p>

        <div className="flex flex-wrap gap-[15px] items-start w-full">
          {recipeTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-[#ccc] flex flex-col gap-[11px] items-start p-[15px] rounded-[5px] w-[200px]"
            >
              {/* Checkbox */}
              <div className="flex gap-[11px] items-center">
                <input
                  type="checkbox"
                  checked={!!selectedTemplates[template.id]}
                  onChange={() => toggleTemplate(template.id)}
                  className="border border-[#ccc] size-[12px]"
                />
                <p className="leading-normal text-[#333] text-[12px] whitespace-nowrap" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  Include In Propsal
                </p>
              </div>

              {/* Image Placeholder */}
              <div className="bg-[#f1f1f1] border border-[#ccc] flex items-center justify-center overflow-hidden size-[170px]">
                <span className="text-[#999] text-[12px]">Image</span>
              </div>

              {/* Name */}
              <p className="leading-normal text-[#333] text-[16px] min-w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
                {template.name}
              </p>

              {/* Ingredients */}
              <ul className="list-disc text-[#333] text-[12px] w-[200px] pl-[18px] space-y-0" style={{ fontFamily: 'Avenir, sans-serif' }}>
                {template.ingredients.map((ing, idx) => (
                  <li key={idx} className="leading-normal">
                    {ing}
                  </li>
                ))}
              </ul>

              {/* Quantity Input */}
              <div className="flex flex-col items-start w-[110px]">
                <div className="border border-[#ccc] flex h-[30px] items-center px-[15px] py-[10px] rounded-[5px] w-[110px]">
                  <input
                    type="number"
                    min="1"
                    value={quantities[template.id] || 1}
                    onChange={(e) => updateQuantity(template.id, e.target.value)}
                    disabled={!selectedTemplates[template.id]}
                    className="leading-normal text-[#666] text-[14px] w-[70px] outline-none bg-transparent"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  />
                  <svg width="15" height="10" viewBox="0 0 15 10">
                    <polygon points="7.5,10 0,0 15,0" fill="#666"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Professional - Custom Floral Recipes
  return (
    <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] items-start p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] w-[964px]">
      <p className="font-bold leading-normal text-[#161616] text-[18px] w-full" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Custom Floral Recipes
      </p>

      <p className="leading-normal text-[#666] text-[14px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
        Describe Recipes with shape, size, substitution notes etc.
      </p>

      {customRecipes.length > 0 && (
        <div className="flex flex-col gap-[15px] w-full">
          {customRecipes.map((recipe, idx) => (
            <div key={idx} className="border border-[#ccc] rounded-[5px] p-[15px] flex justify-between items-start">
              <div>
                <p className="font-bold text-[#333] text-[16px]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  {recipe.name}
                </p>
                <p className="text-[#666] text-[14px] mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  {recipe.description || 'No description'}
                </p>
              </div>
              <span className="text-[#666] text-[14px]">x{recipe.quantity}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          const newRecipe = {
            id: Date.now(),
            name: 'New Recipe',
            description: '',
            quantity: 1,
            ingredients: [],
          };
          const updated = [...customRecipes, newRecipe];
          setCustomRecipes(updated);
          onChange('recipes', updated);
        }}
        className="text-[#4a9380] font-bold text-[14px] hover:underline"
        style={{ fontFamily: 'Avenir, sans-serif' }}
      >
        + Create Recipe
      </button>
    </div>
  );
}
