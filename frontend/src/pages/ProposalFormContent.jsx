// ProposalFormContent - Main content only (Layout provides sidebar)
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ShoppingList from '../components/ShoppingList';
import BasicFloralRecipes from '../components/BasicFloralRecipes';
import { useProposal } from '../hooks/useProposals';
import { useProductSearch, formatPrice } from '../hooks/useProductSearch';

const imgImage7 = "https://www.figma.com/api/mcp/asset/3d26f03c-a823-49a8-9b70-b5c4f99cef81";
const imgImage3 = "https://www.figma.com/api/mcp/asset/306f85a0-2700-4e8f-9d25-280ee09ad142";
const imgRectangle9 = "https://www.figma.com/api/mcp/asset/bc565399-8be4-4097-8073-dd8867d8524e";
const imgImage6 = "https://www.figma.com/api/mcp/asset/36dac031-44a8-4379-988c-de85b8230c3a";
const imgImage4 = "https://www.figma.com/api/mcp/asset/ce0fd175-39ad-4c31-b6e8-79abaf5373b2";
const imgScreenshot20260118At111910Pm1 = "https://www.figma.com/api/mcp/asset/d2a7295e-4cb5-4fee-a8bf-bd654c722bf3";
const imgPolygon3 = "https://www.figma.com/api/mcp/asset/2b7c5d70-e223-4e04-ac8c-c4a616e6426d";

// Default empty form state
const defaultFormData = {
  customerName: '',
  customerEmail: '',
  proposalName: '',
  consultationLevel: 'Basic Consultation',
  eventName: '',
  proposalTemplate: 'Modern Wedding Consultation',
  eventDate: '',
  deliveryDate: '',
  styleNotes: '',
};

export default function ProposalFormContent() {
  const { id } = useParams();
  const isNewProposal = !id || id === 'new';
  const { proposal, loading: proposalLoading, error: proposalError } = useProposal(id);

  const [formData, setFormData] = useState(defaultFormData);
  const [inspirationImages, setInspirationImages] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [featuredBlooms, setFeaturedBlooms] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // Create Recipe form state
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    quantity: 1,
    description: '',
    ingredients: [
      { item: '', stems: '' }
    ],
    photoUrl: '',
  });

  // Product search state (for Featured Blooms)
  const [bloomSearchQuery, setBloomSearchQuery] = useState('');
  const [showBloomResults, setShowBloomResults] = useState(false);
  const bloomSearchRef = useRef(null);
  const { searchProducts, getProduct, results: searchResults, loading: searchLoading, clearResults } = useProductSearch();

  // Inspiration & Style state
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const imageInputRef = useRef(null);
  const colorInputRef = useRef(null);

  // Populate form when proposal data loads
  useEffect(() => {
    if (proposal) {
      // Convert Firestore timestamps to date strings for input fields
      const formatDateForInput = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      };

      setFormData({
        customerName: proposal.customerName || '',
        customerEmail: proposal.customerEmail || '',
        proposalName: proposal.proposalName || '',
        consultationLevel: proposal.consultationLevel || 'Basic Consultation',
        eventName: proposal.eventName || '',
        proposalTemplate: proposal.proposalTemplate || 'Modern Wedding Consultation',
        eventDate: formatDateForInput(proposal.eventDate),
        deliveryDate: formatDateForInput(proposal.deliveryDate),
        styleNotes: proposal.styleNotes || '',
      });

      // Load arrays from proposal
      if (proposal.inspirationImages) {
        setInspirationImages(proposal.inspirationImages);
      }
      if (proposal.colorPalette) {
        setColorPalette(proposal.colorPalette);
      }
      if (proposal.featuredBlooms) {
        setFeaturedBlooms(proposal.featuredBlooms);
      }
      if (proposal.recipes) {
        setRecipes(proposal.recipes);
      }
    }
  }, [proposal]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isProfessional = formData.consultationLevel === 'Professional Consultation';

  // Create Recipe form handlers
  const updateNewRecipe = (field, value) => {
    setNewRecipe(prev => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', stems: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, field, value) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleSaveRecipe = () => {
    // Create new recipe object
    const recipe = {
      id: Date.now().toString(),
      name: newRecipe.name,
      quantity: newRecipe.quantity,
      description: newRecipe.description,
      image: newRecipe.photoUrl || '',
      ingredients: newRecipe.ingredients
        .filter(ing => ing.item && ing.stems)
        .map(ing => ({ name: ing.item, count: ing.stems }))
    };

    setRecipes(prev => [...prev, recipe]);

    // Reset form
    setNewRecipe({
      name: '',
      quantity: 1,
      description: '',
      ingredients: [{ item: '', stems: '' }],
      photoUrl: '',
    });
    setShowCreateRecipe(false);
  };

  // Product search handlers (Featured Blooms)
  const handleBloomSearch = (e) => {
    const query = e.target.value;
    setBloomSearchQuery(query);
    searchProducts(query);
    setShowBloomResults(query.length >= 2);
  };

  const handleSelectProduct = async (product) => {
    try {
      // Fetch full product details with variants
      const fullProduct = await getProduct(product.handle);

      // Create featured bloom with variant options
      const newBloom = {
        name: fullProduct.title,
        handle: fullProduct.handle,
        image: fullProduct.featuredImage || fullProduct.images?.[0] || '',
        selectedOption: 0,
        options: fullProduct.variants.map(variant => ({
          label: variant.title !== 'Default Title' ? variant.title : fullProduct.title,
          price: variant.price / 100, // Convert from cents
          variantId: variant.id,
          available: variant.available,
        })),
      };

      setFeaturedBlooms(prev => [...prev, newBloom]);

      // Clear search
      setBloomSearchQuery('');
      clearResults();
      setShowBloomResults(false);
    } catch (error) {
      console.error('Error selecting product:', error);
    }
  };

  const handleRemoveBloom = (index) => {
    setFeaturedBlooms(prev => prev.filter((_, i) => i !== index));
  };

  const handleBloomOptionChange = (bloomIndex, optionIndex) => {
    setFeaturedBlooms(prev => prev.map((bloom, i) =>
      i === bloomIndex ? { ...bloom, selectedOption: optionIndex } : bloom
    ));
  };

  // Inspiration Images handlers
  const handleAddImage = () => {
    if (inspirationImages.length >= 8) return;
    setShowImageUrlInput(true);
    setNewImageUrl('');
    // Focus the input after it renders
    setTimeout(() => imageInputRef.current?.focus(), 100);
  };

  const handleSaveImage = () => {
    if (newImageUrl.trim() && inspirationImages.length < 8) {
      setInspirationImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      setShowImageUrlInput(false);
    }
  };

  const handleCancelImage = () => {
    setNewImageUrl('');
    setShowImageUrlInput(false);
  };

  const handleRemoveImage = (index) => {
    setInspirationImages(prev => prev.filter((_, i) => i !== index));
  };

  // Color Palette handlers
  const handleAddColor = () => {
    if (colorPalette.length >= 8) return;
    setShowColorPicker(true);
    setNewColor('#ffffff');
  };

  const handleSaveColor = () => {
    if (newColor && colorPalette.length < 8) {
      setColorPalette(prev => [...prev, newColor]);
      setNewColor('#ffffff');
      setShowColorPicker(false);
    }
  };

  const handleCancelColor = () => {
    setNewColor('#ffffff');
    setShowColorPicker(false);
  };

  const handleRemoveColor = (index) => {
    setColorPalette(prev => prev.filter((_, i) => i !== index));
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bloomSearchRef.current && !bloomSearchRef.current.contains(e.target)) {
        setShowBloomResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show loading state while fetching existing proposal
  if (!isNewProposal && proposalLoading) {
    return (
      <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
        <div className="flex items-center justify-center py-[60px]">
          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
            Loading proposal...
          </p>
        </div>
      </div>
    );
  }

  // Show error if proposal not found
  if (!isNewProposal && proposalError) {
    return (
      <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
        <div className="flex items-center justify-center py-[60px]">
          <p className="font-['Avenir:Roman',sans-serif] text-red-500 text-[16px]">
            {proposalError}
          </p>
        </div>
      </div>
    );
  }

  // Min 4, max 8 for images and colors
  // Show empty placeholders only if we have fewer than 4 items
  // Show "Add" button if we have fewer than 8 items
  const emptyImageSlots = Math.max(0, 4 - inspirationImages.length);
  const showAddImageButton = inspirationImages.length < 8;
  const emptyColorSlots = Math.max(0, 4 - colorPalette.length);
  const showAddColorButton = colorPalette.length < 8;

  return (
    <div className="flex flex-col gap-[15px] p-[15px] pb-[30px]">
      {/* Header */}
      <div className="flex gap-[10px] items-center justify-between px-[15px] py-[15px]">
        <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
          {isNewProposal ? 'Proposal Builder > New Proposal' : 'Proposal Builder > Edit Proposal'}
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
              Inspirational Images (Min 4, 8 max)
            </p>
            <div className="flex flex-wrap gap-[30px] pb-[15px]">
              {/* Show existing images */}
              {inspirationImages.map((imgUrl, index) => (
                <div key={index} className="relative group overflow-hidden size-[142px]">
                  <img
                    alt={`Inspiration ${index + 1}`}
                    className="object-cover size-full"
                    src={imgUrl}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Show empty placeholder slots only if we have fewer than 4 images */}
              {Array.from({ length: emptyImageSlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  onClick={handleAddImage}
                  className="border border-[#ccc] border-dashed flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] cursor-pointer hover:bg-[#fafafa]"
                >
                  <div className="opacity-50 size-[40px]">
                    <img alt="" className="max-w-none object-cover size-full" src={imgRectangle9} />
                  </div>
                  <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                    Add a Photo
                  </p>
                </div>
              ))}
              {/* Show Add button if we have 4+ images but less than 8 */}
              {inspirationImages.length >= 4 && showAddImageButton && (
                <div
                  onClick={handleAddImage}
                  className="border border-[#ccc] border-dashed flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] cursor-pointer hover:bg-[#fafafa]"
                >
                  <div className="opacity-50 size-[40px]">
                    <img alt="" className="max-w-none object-cover size-full" src={imgRectangle9} />
                  </div>
                  <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                    Add a Photo
                  </p>
                </div>
              )}
              {/* Image URL Input Modal */}
              {showImageUrlInput && (
                <div className="border border-[#ccc] border-solid flex flex-col gap-[10px] p-[15px] rounded-[5px] w-[300px]">
                  <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[12px]">Enter Image URL</p>
                  <input
                    ref={imageInputRef}
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveImage()}
                    placeholder="https://..."
                    className="border border-[#ccc] border-solid px-[10px] py-[8px] text-[14px] outline-none"
                  />
                  <div className="flex gap-[10px]">
                    <button
                      onClick={handleSaveImage}
                      className="bg-[#4a9380] text-white px-[15px] py-[5px] text-[12px] rounded"
                    >
                      Add
                    </button>
                    <button
                      onClick={handleCancelImage}
                      className="border border-[#ccc] px-[15px] py-[5px] text-[12px] rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-[30px] w-full">
            <div className="flex flex-col gap-[10px] flex-1">
              <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase whitespace-pre-wrap">{`Color Pallette  (Min 4, 8 max)`}</p>
              <div className="flex flex-wrap gap-[30px] items-center">
                {/* Show existing colors */}
                {colorPalette.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="border border-[#ccc] border-solid rounded-full size-[60px]"
                      style={{ backgroundColor: color }}
                    />
                    <button
                      onClick={() => handleRemoveColor(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* Show empty placeholder slots only if we have fewer than 4 colors */}
                {Array.from({ length: emptyColorSlots }).map((_, i) => (
                  <div
                    key={`empty-color-${i}`}
                    onClick={handleAddColor}
                    className="border border-[#ccc] border-dashed flex items-center p-[10px] rounded-full cursor-pointer hover:bg-[#fafafa]"
                  >
                    <div className="size-[40px]">
                      <img alt="" className="max-w-none object-cover opacity-50 size-full" src={imgImage6} />
                    </div>
                  </div>
                ))}
                {/* Show Add button if we have 4+ colors but less than 8 */}
                {colorPalette.length >= 4 && showAddColorButton && (
                  <div
                    onClick={handleAddColor}
                    className="border border-[#ccc] border-dashed flex items-center p-[10px] rounded-full cursor-pointer hover:bg-[#fafafa]"
                  >
                    <div className="size-[40px]">
                      <img alt="" className="max-w-none object-cover opacity-50 size-full" src={imgImage6} />
                    </div>
                  </div>
                )}
                {/* Color Picker */}
                {showColorPicker && (
                  <div className="border border-[#ccc] border-solid flex flex-col gap-[10px] p-[15px] rounded-[5px]">
                    <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[12px]">Pick a Color</p>
                    <div className="flex gap-[10px] items-center">
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-[50px] h-[40px] cursor-pointer border-none"
                      />
                      <input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        placeholder="#ffffff"
                        className="border border-[#ccc] border-solid px-[10px] py-[5px] text-[12px] w-[80px] outline-none"
                      />
                    </div>
                    <div className="flex gap-[10px]">
                      <button
                        onClick={handleSaveColor}
                        className="bg-[#4a9380] text-white px-[15px] py-[5px] text-[12px] rounded"
                      >
                        Add
                      </button>
                      <button
                        onClick={handleCancelColor}
                        className="border border-[#ccc] px-[15px] py-[5px] text-[12px] rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
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
            Featured Blooms {featuredBlooms.length > 0 && `(${featuredBlooms.length})`}
          </p>

          {/* Search Row - matching Figma layout */}
          <div className="flex flex-col items-center w-full">
            <div className="flex gap-[5px] items-start w-full">
              {/* Wide search input with results dropdown */}
              <div className="relative" ref={bloomSearchRef}>
                <div className="border border-[#ccc] border-solid flex items-center gap-[10px] px-[10px] py-[15px] rounded-[5px] w-[520px]">
                  <div className="h-[18px] w-[20px] shrink-0">
                    <img alt="" className="max-w-none object-cover size-full" src={imgScreenshot20260118At111910Pm1} />
                  </div>
                  <input
                    type="text"
                    value={bloomSearchQuery}
                    onChange={handleBloomSearch}
                    onFocus={() => bloomSearchQuery.length >= 2 && setShowBloomResults(true)}
                    placeholder="Search flowers by name..."
                    className="flex-1 outline-none border-none font-['Avenir:Roman',sans-serif] text-[14px] text-[#333] placeholder:text-[#999]"
                  />
                  {searchLoading && (
                    <div className="text-[#999] text-[12px]">...</div>
                  )}
                </div>
                {/* Search Results Dropdown */}
                {showBloomResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-[520px] bg-white border border-[#ccc] border-t-0 rounded-b-[5px] max-h-[300px] overflow-y-auto z-50 shadow-lg">
                    {searchResults.map((product) => (
                      <div
                        key={product.handle}
                        onClick={() => handleSelectProduct(product)}
                        className="flex items-center gap-[10px] p-[10px] cursor-pointer hover:bg-[#f5f5f5] border-b border-[#eee] last:border-b-0"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-[40px] h-[40px] object-cover rounded"
                          />
                        )}
                        <div className="flex flex-col flex-1">
                          <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                            {product.title}
                          </p>
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px]">
                            {product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showBloomResults && bloomSearchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                  <div className="absolute top-full left-0 w-[520px] bg-white border border-[#ccc] border-t-0 rounded-b-[5px] p-[15px] z-50 shadow-lg">
                    <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px]">
                      No products found
                    </p>
                  </div>
                )}
              </div>
              {/* Search By Color dropdown */}
              <div className="border border-[#ccc] border-solid flex gap-[60px] h-[48px] items-center p-[15px] rounded-[5px] cursor-pointer hover:bg-[#fafafa]">
                <p className="font-['Avenir:Roman',sans-serif] text-[#999] text-[12px] w-[87px]">
                  Search By Color
                </p>
                <div className="flex items-center justify-center">
                  <div className="rotate-180 size-[10px]">
                    <img alt="" className="block max-w-none size-full" src={imgPolygon3} />
                  </div>
                </div>
              </div>
              {/* Search by All dropdown */}
              <div className="border border-[#ccc] border-solid flex gap-[60px] h-[48px] items-center p-[15px] rounded-[5px] cursor-pointer hover:bg-[#fafafa]">
                <p className="font-['Avenir:Roman',sans-serif] text-[#999] text-[12px] w-[87px]">
                  Search by All
                </p>
                <div className="flex items-center justify-center">
                  <div className="rotate-180 size-[10px]">
                    <img alt="" className="block max-w-none size-full" src={imgPolygon3} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Proposal Inventory */}
          {featuredBlooms.length === 0 ? (
            <div className="border border-[#999] border-solid flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
              <div className="size-[20px]">
                <img alt="" className="max-w-none object-cover size-full" src={imgImage4} />
              </div>
              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
                No flowers selected yet. Start by searching for a flower or DIY kit above.
              </p>
            </div>
          ) : (
            <div className="border border-[#f1f1f1] border-solid flex flex-col gap-[15px] p-[30px] rounded-[5px] w-full">
              <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] h-[30px]">
                Current Proposal Inventory:
              </p>
              {featuredBlooms.map((bloom, bloomIndex) => (
                <div key={bloomIndex} className="bg-white border border-[#ccc] border-solid flex gap-[30px] items-start p-[15px] rounded-[5px] w-[854px]">
                  <div className="flex gap-[30px] items-start w-[715px]">
                    {bloom.image && (
                      <div className="size-[92px] shrink-0">
                        <img alt={bloom.name} className="object-cover size-full" src={bloom.image} />
                      </div>
                    )}
                    <div className="flex flex-col gap-[10px] w-[635px]">
                      <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[16px] uppercase">
                        {bloom.name}
                      </p>
                      <div className="flex flex-col">
                        {bloom.options ? (
                          bloom.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              onClick={() => handleBloomOptionChange(bloomIndex, optIndex)}
                              className="flex gap-[10px] items-center py-[5px] rounded-[37px] w-[424px] cursor-pointer hover:bg-[#f9f9f9]"
                            >
                              <div
                                className={`border border-[#999] border-solid size-[15px] ${
                                  (bloom.selectedOption ?? 0) === optIndex ? 'bg-[#333]' : 'bg-white'
                                }`}
                              />
                              <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] flex-1">
                                {option.label} - ${option.price.toFixed(2)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="flex gap-[10px] items-center py-[5px]">
                            <div className="bg-[#333] border border-[#999] border-solid size-[15px]" />
                            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                              {bloom.stemCount} Stems - ${(bloom.stemCount * bloom.pricePerStem).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-end px-[15px] py-[5px]">
                    <button
                      onClick={() => handleRemoveBloom(bloomIndex)}
                      className="border border-[#ccc] border-solid flex items-center justify-center p-[5px] cursor-pointer hover:bg-[#fafafa] bg-white"
                    >
                      <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">Remove</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Floral Recipes (Basic) OR Custom Floral Recipes (Professional) */}
        {!isProfessional ? (
          <BasicFloralRecipes />
        ) : (
          <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
            <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
              Custom Floral Recipes {recipes.length > 0 && `(${recipes.length})`}
            </p>

            {/* Recipe Cards Grid - matching Figma layout */}
            {recipes.length > 0 && (
              <div className="flex flex-wrap gap-[15px]">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border border-[#ccc] border-solid flex flex-col gap-[11px] p-[15px] rounded-[5px] w-[257px]">
                    {recipe.image && (
                      <div className="h-[227px] overflow-hidden flex items-center justify-center">
                        <img
                          alt={recipe.name}
                          className="object-cover w-full h-full"
                          src={recipe.image}
                        />
                      </div>
                    )}
                    <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[16px]">
                      {recipe.name} x {recipe.quantity}
                    </p>
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <ul className="list-disc pl-[18px] font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] h-[75px]">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            {ing.count} {ing.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-[5px] items-center justify-center px-[15px] py-[5px]">
                      <button className="border border-[#ccc] border-solid px-[10px] py-[5px] font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] cursor-pointer hover:bg-[#fafafa]">
                        Edit Recipe
                      </button>
                      <button className="border border-[#ccc] border-solid px-[10px] py-[5px] font-['Avenir:Roman',sans-serif] text-[#333] text-[14px] cursor-pointer hover:bg-[#fafafa]">
                        Remove Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Another Recipe Button */}
            <button
              onClick={() => setShowCreateRecipe(!showCreateRecipe)}
              className="border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] cursor-pointer hover:bg-[#fafafa] w-fit bg-white"
            >
              <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[14px]">
                {showCreateRecipe ? 'Cancel' : (recipes.length > 0 ? 'Add Another Recipe' : 'Add Floral Recipe')}
              </p>
            </button>

            {/* Create Recipe Form - matching Figma MCP */}
            {showCreateRecipe && (
              <div className="border border-[#ccc] border-solid flex flex-col gap-[30px] p-[15px] rounded-[5px] w-full">
                <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
                  Create Recipe
                </p>

                {/* Recipe Name and Count */}
                <div className="flex gap-[30px] items-start w-full">
                  <div className="flex flex-col gap-[5px] w-[660px]">
                    <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                      Recipe Name:
                    </p>
                    <input
                      type="text"
                      value={newRecipe.name}
                      onChange={(e) => updateNewRecipe('name', e.target.value)}
                      placeholder="Bridal Bouquet"
                      className="border border-[#ccc] border-solid rounded-[5px] px-[15px] py-[11px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[16px] outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-[5px] w-[200px]">
                    <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                      Arrangement Count
                    </p>
                    <div className="border border-[#ccc] border-solid rounded-[5px] flex items-center h-[45px] px-[15px]">
                      <input
                        type="number"
                        min="1"
                        value={newRecipe.quantity}
                        onChange={(e) => updateNewRecipe('quantity', parseInt(e.target.value) || 1)}
                        className="w-[60px] font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none border-none"
                      />
                      <div className="flex flex-col ml-auto">
                        <button
                          onClick={() => updateNewRecipe('quantity', newRecipe.quantity + 1)}
                          className="text-[10px] text-[#666] hover:text-[#333]"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => updateNewRecipe('quantity', Math.max(1, newRecipe.quantity - 1))}
                          className="text-[10px] text-[#666] hover:text-[#333]"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Description */}
                <div className="flex flex-col gap-[5px] w-full">
                  <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                    Recipe Description:
                  </p>
                  <textarea
                    value={newRecipe.description}
                    onChange={(e) => updateNewRecipe('description', e.target.value)}
                    placeholder="Describe Recipes with shape, size, substitution notes etc."
                    className="border border-[#ccc] border-solid rounded-[5px] px-[15px] py-[11px] w-full h-[75px] font-['Avenir:Roman',sans-serif] text-[#666] text-[16px] outline-none resize-none"
                  />
                </div>

                {/* Ingredients Section */}
                <div className="border border-[#f1f1f1] border-solid flex flex-col gap-[30px] p-[15px] rounded-[5px] w-full">
                  <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
                    Ingredients
                  </p>

                  <div className="flex flex-col gap-[15px] w-full">
                    {/* Header Row */}
                    <div className="flex gap-[15px] items-end w-full">
                      <div className="w-[630px]">
                        <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                          Items:
                        </p>
                      </div>
                      <div className="w-[105px]">
                        <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                          Stems:
                        </p>
                      </div>
                      <div className="w-[58px]" />
                    </div>

                    {/* Ingredient Rows */}
                    {newRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-[15px] items-end w-full">
                        <div className="w-[625px]">
                          <select
                            value={ingredient.item}
                            onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                            className="border border-[#ccc] border-solid rounded-[5px] h-[30px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none cursor-pointer bg-white"
                          >
                            <option value="">Select a flower...</option>
                            <option value="Quicksand Cream Roses">Quicksand Cream Roses</option>
                            <option value="Antique Mauve Fresh Cut Roses">Antique Mauve Fresh Cut Roses</option>
                            <option value="Creamy White Bulk Spray Roses">Creamy White Bulk Spray Roses</option>
                            <option value="Gunnii Eucalyptus Greens">Gunnii Eucalyptus Greens</option>
                            <option value="Blue Tinted Roses">Blue Tinted Roses</option>
                            <option value="Silver Dollar Eucalyptus Greens">Silver Dollar Eucalyptus Greens</option>
                          </select>
                        </div>
                        <div className="w-[110px]">
                          <select
                            value={ingredient.stems}
                            onChange={(e) => updateIngredient(index, 'stems', e.target.value)}
                            className="border border-[#ccc] border-solid rounded-[5px] h-[30px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none cursor-pointer bg-white"
                          >
                            <option value="">Stems</option>
                            <option value="1">1 Stem</option>
                            <option value="2">2 Stems</option>
                            <option value="3">3 Stems</option>
                            <option value="4">4 Stems</option>
                            <option value="5">5 Stems</option>
                            <option value="1/4">1/4 Bunch</option>
                            <option value="1/2">1/2 Bunch</option>
                            <option value="1 Bunch">1 Bunch</option>
                          </select>
                        </div>
                        <div className="flex h-[30px] items-center justify-center py-[5px]">
                          <button
                            onClick={() => removeIngredient(index)}
                            className="bg-[rgba(238,238,238,0.8)] border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] cursor-pointer hover:bg-[#e6e6e6]"
                          >
                            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[13px]">
                              Remove
                            </p>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Ingredient Button */}
                    <div className="flex items-end w-full">
                      <button
                        onClick={addIngredient}
                        className="bg-[rgba(238,238,238,0.8)] border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] cursor-pointer hover:bg-[#e6e6e6]"
                      >
                        <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[13px]">
                          + Add Ingredient
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recipe Photo Section */}
                <div className="border border-[#f1f1f1] border-solid flex flex-col gap-[30px] p-[15px] rounded-[5px] w-full">
                  <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
                    Recipe Photo
                  </p>

                  <div className="flex gap-[30px] items-start">
                    {/* Photo Preview */}
                    {newRecipe.photoUrl ? (
                      <div className="border border-[#ccc] border-solid size-[142px] overflow-hidden">
                        <img
                          src={newRecipe.photoUrl}
                          alt="Recipe"
                          className="object-cover size-full"
                        />
                      </div>
                    ) : (
                      <div className="border border-[#ccc] border-dashed flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] cursor-pointer hover:bg-[#fafafa]">
                        <div className="opacity-50 size-[40px]">
                          <img alt="" className="max-w-none object-cover size-full" src={imgRectangle9} />
                        </div>
                        <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                          Add a Photo
                        </p>
                      </div>
                    )}

                    {/* Photo Buttons */}
                    <div className="flex flex-col gap-[15px] items-start justify-center w-[139px]">
                      <button className="bg-[rgba(238,238,238,0.8)] border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] w-full cursor-pointer hover:bg-[#e6e6e6]">
                        <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[13px]">
                          Upload Photo
                        </p>
                      </button>
                      <div className="flex flex-col gap-[5px] w-full">
                        <input
                          type="text"
                          value={newRecipe.photoUrl}
                          onChange={(e) => updateNewRecipe('photoUrl', e.target.value)}
                          placeholder="Paste image URL..."
                          className="border border-[#ccc] border-solid rounded-[3px] px-[10px] py-[5px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] outline-none"
                        />
                      </div>
                      <button className="bg-[rgba(238,238,238,0.8)] border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] w-full cursor-pointer hover:bg-[#e6e6e6]">
                        <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[13px]">
                          Create via AI
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Recipe Button */}
                <div className="flex items-end w-full">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={!newRecipe.name}
                    className="bg-[rgba(238,238,238,0.8)] border border-[#ccc] border-solid flex items-center justify-center px-[15px] py-[5px] cursor-pointer hover:bg-[#e6e6e6] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[13px]">
                      Save Recipe
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shopping List */}
        {recipes.length > 0 ? (
          <ShoppingList recipes={recipes} featuredBlooms={featuredBlooms} />
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
