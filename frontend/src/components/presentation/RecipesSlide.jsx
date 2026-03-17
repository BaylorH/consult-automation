// RecipesSlide - Custom floral recipes cards
// Matches Figma "Custom Floral Recipes" section

import SlideWrapper from './SlideWrapper';

export default function RecipesSlide({ recipes = [] }) {
  if (recipes.length === 0) {
    return null; // Don't render if no recipes (Basic consultation)
  }

  return (
    <SlideWrapper noPadding className="bg-[#fef6f0]">
      <div className="flex flex-col gap-[60px] items-center px-[30px] py-[90px] w-full">
        <h2 className="font-['EB_Garamond',serif] font-bold text-[#055e5a] text-[36px] text-center uppercase">
          Custom Floral Recipes
        </h2>

        <div className="flex flex-wrap gap-[15px] items-start justify-center w-full">
          {recipes.map((recipe, idx) => (
            <RecipeCard key={recipe.id || idx} recipe={recipe} />
          ))}
        </div>
      </div>
    </SlideWrapper>
  );
}

function RecipeCard({ recipe }) {
  const { name, quantity = 1, image, description, ingredients = [] } = recipe;

  return (
    <div className="bg-white border border-[#ccc] flex flex-col gap-[11px] h-[480px] items-center p-[15px] rounded-[5px] w-[271px] overflow-hidden">
      {/* Recipe image */}
      <div className="w-full h-[227px] overflow-hidden rounded-sm relative">
        {/* Decorative background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, #fef6f0 0%, #f0e8e0 100%)'
          }}
        />
        {image && (
          <img
            alt={name}
            src={image}
            className="w-full h-full object-cover relative z-10"
          />
        )}
      </div>

      {/* Recipe name with quantity */}
      <p className="font-['Avenir',sans-serif] font-bold text-[#333] text-[18px] text-center w-full">
        {name} x {quantity}
      </p>

      {/* Description */}
      {description && (
        <p className="font-['Avenir',sans-serif] text-[#333] text-[14px] leading-[20px] w-full line-clamp-2">
          {description}
        </p>
      )}

      {/* Ingredients list */}
      <ul className="list-disc text-[#333] text-[14px] w-full pl-[21px] font-['Avenir',sans-serif] flex-1 overflow-hidden">
        {ingredients.slice(0, 5).map((ing, idx) => (
          <li key={idx} className="mb-0 leading-[24px]">
            {ing.count} {ing.name}
          </li>
        ))}
        {ingredients.length > 5 && (
          <li className="text-[#999] italic">+{ingredients.length - 5} more...</li>
        )}
      </ul>
    </div>
  );
}
