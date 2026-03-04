// BasicFloralRecipes Component - Exact MCP Code from Call 4 (Node 134:915)
// Shows pre-made recipe template cards for Basic Consultation tier

// Local assets (bundled, instant load)
import imgBrideBouquet from '../assets/images/recipe-bride-bouquet.png';
import imgBouquet from '../assets/images/recipe-bouquet.png';
import imgBoutonniere1 from '../assets/images/recipe-boutonniere.png';
import imgCorsage from '../assets/images/recipe-corsage.png';
import imgCenterpiece from '../assets/images/recipe-centerpiece.png';
import imgFrame1 from '../assets/images/recipe-frame.png';

function RecipeCard({ image, name, ingredients }) {
  return (
    <div className="border border-[#ccc] border-solid content-stretch flex flex-col gap-[11px] items-start p-[15px] relative rounded-[5px] shrink-0 w-[200px]">
      <div className="content-stretch flex gap-[11px] items-center relative shrink-0">
        <div className="border border-[#ccc] border-solid shrink-0 size-[12px] cursor-pointer hover:bg-[#eee]" />
        <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#333] text-[12px] whitespace-nowrap">
          Include In Proposal
        </p>
      </div>
      <div className="bg-[#f1f1f1] border border-[#ccc] border-solid content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[170px]">
        <div className="relative shrink-0 size-[120px]">
          <img alt={name} className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={image} />
        </div>
      </div>
      <p className="font-['Avenir:Roman',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#333] text-[16px] w-[min-content]">
        {name}
      </p>
      <ul className="block font-['Avenir:Roman',sans-serif] h-[75px] leading-[0] list-disc not-italic relative shrink-0 text-[#333] text-[12px] w-[200px] whitespace-pre-wrap">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{ingredient}</span>
          </li>
        ))}
      </ul>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[110px]">
        <div className="border border-[#ccc] border-solid content-stretch flex h-[30px] items-center px-[15px] py-[10px] relative rounded-[5px] shrink-0 w-[110px]">
          <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[70px]">
            <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[14px] w-full">
              1
            </p>
          </div>
          <div className="h-[10px] relative shrink-0 w-[15px]">
            <img alt="" className="absolute block max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BasicFloralRecipes() {
  const recipeTemplates = [
    {
      image: imgBrideBouquet,
      name: "Bridesmaid Bouquet",
      ingredients: ["18 Focal Flowers", "5 Filler Flowers", "8 Line Flowers", "5 Greenery"]
    },
    {
      image: imgBouquet,
      name: "Bridal Bouquet",
      ingredients: ["24 Focal Flowers", "8 Filler Flowers", "12 Line Flowers", "8 Greenery"]
    },
    {
      image: imgBoutonniere1,
      name: "Groom's Boutonniere",
      ingredients: ["2 Focal Flowers", "1 Filler Flower", "2 Greenery"]
    },
    {
      image: imgCorsage,
      name: "Mother's Corsage",
      ingredients: ["3 Focal Flowers", "2 Filler Flowers", "3 Greenery"]
    },
    {
      image: imgCenterpiece,
      name: "Centerpiece",
      ingredients: ["12 Focal Flowers", "6 Filler Flowers", "8 Line Flowers", "6 Greenery"]
    }
  ];

  return (
    <div className="bg-white border border-[#eef0ef] border-solid content-stretch flex flex-col gap-[30px] items-start p-[30px] relative rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Basic Floral Recipes">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#161616] text-[18px] w-[960px]">
        Basic Floral Recipes
      </p>
      <p className="font-['Avenir:Roman',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#666] text-[18px] w-[905px]">
        Select from our pre-designed floral arrangements
      </p>
      <div className="content-start flex flex-wrap gap-[15px] items-start relative shrink-0 w-full">
        {recipeTemplates.map((recipe, index) => (
          <RecipeCard
            key={index}
            image={recipe.image}
            name={recipe.name}
            ingredients={recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
}
