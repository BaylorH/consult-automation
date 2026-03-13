// ProposalFormContent - Main content only (Layout provides sidebar)
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShoppingList from '../components/ShoppingList';
import BasicFloralRecipes from '../components/BasicFloralRecipes';
import { useProposal, useProposals, proposalService } from '../hooks/useProposals';
import { Timestamp } from 'firebase/firestore';
import { useProductSearch, formatPrice } from '../hooks/useProductSearch';

// Local image assets (downloaded from Figma)
import addPhotoIcon from '../assets/images/add-photo-icon.png';
import colorPaletteIcon from '../assets/images/color-palette-icon.png';

// Inline SVG icons for elements that don't have Figma assets
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-full text-[#666]">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-full text-[#999]">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full text-[#666]">
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);

// Default empty form state
const defaultFormData = {
  customerName: '',
  customerEmail: '',
  proposalName: '',
  consultationLevel: 'Basic Consultation',
  eventName: '',
  eventDate: '',
  deliveryDate: '',
  styleNotes: '',
};

export default function ProposalFormContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProposal = !id || id === 'new';
  const { proposal, loading: proposalLoading, error: proposalError } = useProposal(id);

  const [formData, setFormData] = useState(defaultFormData);
  const [inspirationImages, setInspirationImages] = useState([]);
  const [colorPalette, setColorPalette] = useState([]);
  const [featuredBlooms, setFeaturedBlooms] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // Auto-save state
  const [proposalId, setProposalId] = useState(id === 'new' ? null : id);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saved', 'saving', 'unsaved', 'error'
  const [hasInitialized, setHasInitialized] = useState(false);
  const justLoadedRef = useRef(false); // Flag to skip auto-save after loading
  const saveTimeoutRef = useRef(null);
  const AUTOSAVE_DELAY = 1500; // 1.5 seconds after last change

  // Create Recipe form state
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null); // null = creating new, otherwise editing
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    quantity: 1,
    description: '',
    ingredients: [
      { item: '', productHandle: '', stems: '' }
    ],
    photoUrl: '',
  });

  // Recipe choice modal state
  const [showRecipeChoiceModal, setShowRecipeChoiceModal] = useState(false);
  const [showExistingRecipes, setShowExistingRecipes] = useState(false);
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');

  // Fetch all proposals to extract all recipes
  const { proposals: allProposals } = useProposals();

  // Extract all unique recipes from all proposals
  const allExistingRecipes = useMemo(() => {
    const recipesMap = new Map();
    (allProposals || []).forEach((prop) => {
      (prop.recipes || []).forEach((recipe) => {
        // Use recipe name as key to deduplicate
        const key = recipe.name?.toLowerCase().trim();
        if (key && !recipesMap.has(key)) {
          recipesMap.set(key, {
            ...recipe,
            fromProposal: prop.proposalName || prop.eventName || 'Unknown',
          });
        }
      });
    });
    return Array.from(recipesMap.values());
  }, [allProposals]);

  // Combine current proposal recipes + all existing recipes from other proposals
  const filteredExistingRecipes = useMemo(() => {
    // Start with recipes from current proposal (marked as such)
    const currentProposalRecipes = recipes.map(r => ({
      ...r,
      fromProposal: 'This Proposal',
    }));

    // Combine with recipes from other proposals (avoiding exact duplicates by name)
    const currentNames = new Set(recipes.map(r => r.name?.toLowerCase().trim()).filter(Boolean));
    const otherRecipes = allExistingRecipes.filter(
      r => !currentNames.has(r.name?.toLowerCase().trim())
    );

    let combined = [...currentProposalRecipes, ...otherRecipes];

    // Apply search filter
    if (recipeSearchQuery.trim()) {
      const query = recipeSearchQuery.toLowerCase();
      combined = combined.filter((r) =>
        r.name?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      );
    }

    return combined;
  }, [allExistingRecipes, recipeSearchQuery, recipes]);

  // Group filtered recipes by proposal name
  const groupedExistingRecipes = useMemo(() => {
    const groups = {};

    // Put "This Proposal" first if it exists
    filteredExistingRecipes.forEach((recipe) => {
      const proposalName = recipe.fromProposal || 'Unknown';
      if (!groups[proposalName]) {
        groups[proposalName] = [];
      }
      groups[proposalName].push(recipe);
    });

    // Sort so "This Proposal" comes first, then alphabetically
    const sortedGroups = {};
    if (groups['This Proposal']) {
      sortedGroups['This Proposal'] = groups['This Proposal'];
    }
    Object.keys(groups)
      .filter(k => k !== 'This Proposal')
      .sort()
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });

    return sortedGroups;
  }, [filteredExistingRecipes]);

  // Product search state (for Featured Blooms)
  const [bloomSearchQuery, setBloomSearchQuery] = useState('');
  const [showBloomResults, setShowBloomResults] = useState(false);
  const bloomSearchRef = useRef(null);
  const { searchProducts, browseProducts, getProduct, results: searchResults, loading: searchLoading, clearResults } = useProductSearch();

  // Search filter states
  const [showColorFilter, setShowColorFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showCombinedFilter, setShowCombinedFilter] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const colorFilterRef = useRef(null);
  const categoryFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const combinedFilterRef = useRef(null);

  // Available filter options
  const PRESET_COLORS = [
    'Red', 'Pink', 'Blush', 'White', 'Ivory', 'Peach', 'Coral', 'Orange',
    'Yellow', 'Purple', 'Lavender', 'Blue', 'Green', 'Burgundy', 'Mauve'
  ];
  const CATEGORIES = ['Focal Flowers', 'Filler Flowers', 'Line Flowers', 'Greenery'];
  const FLOWER_TYPES = [
    'Roses Standard', 'Roses Garden', 'Roses Spray', 'Ranunculus', 'Anemone',
    'Dahlia', 'Peony', 'Hydrangea', 'Lisianthus', 'Carnations', 'Tulips',
    'Delphinium', 'Stock', 'Eucalyptus', 'Greens', 'Ferns'
  ];

  // Inspiration & Style state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('url'); // 'url' or 'upload'
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const imageModalRef = useRef(null);
  const colorPickerRef = useRef(null);
  const recipeFormRef = useRef(null);
  const recipesSectionRef = useRef(null);
  const recipeNameInputRef = useRef(null);

  // Preset color swatches for quick selection
  const presetColors = [
    '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6',
    '#E91E63', '#F8BBD9', '#FFFFFF', '#F5F5F5', '#9E9E9E', '#212121',
    '#8B4513', '#D2691E', '#DEB887', '#F5DEB3', '#FAEBD7', '#FFF8DC',
  ];

  // Populate form when proposal data loads
  useEffect(() => {
    if (proposal) {
      // Convert Firestore timestamps to date strings for input fields
      // Handles: Firestore Timestamp, serialized {seconds, nanoseconds}, Date, ISO string
      const formatDateForInput = (timestamp) => {
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
          if (isNaN(date.getTime())) return ''; // Invalid date
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch {
          return '';
        }
      };

      setFormData({
        customerName: proposal.customerName || '',
        customerEmail: proposal.customerEmail || '',
        proposalName: proposal.proposalName || '',
        consultationLevel: proposal.consultationLevel || 'Basic Consultation',
        eventName: proposal.eventName || '',
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
      // Mark as initialized after loading existing data
      // Set status to 'saved' since we're loading existing data, not making changes
      justLoadedRef.current = true;
      setHasInitialized(true);
      setSaveStatus('saved');
    }
  }, [proposal]);

  // Mark as initialized for new proposals after first render
  useEffect(() => {
    if (isNewProposal && !proposalLoading) {
      setHasInitialized(true);
    }
  }, [isNewProposal, proposalLoading]);

  // Auto-save function
  const saveProposal = useCallback(async () => {
    // Don't save if form is essentially empty (new proposal with no data)
    const hasContent = formData.customerName || formData.proposalName ||
                       formData.eventName || inspirationImages.length > 0 ||
                       colorPalette.length > 0 || featuredBlooms.length > 0 ||
                       recipes.length > 0;

    if (!hasContent) return;

    setSaveStatus('saving');

    // Convert date strings back to Firestore Timestamps for consistency
    const convertDateToTimestamp = (dateStr) => {
      if (!dateStr) return null;
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return Timestamp.fromDate(date);
      } catch {
        return null;
      }
    };

    const dataToSave = {
      ...formData,
      eventDate: convertDateToTimestamp(formData.eventDate),
      deliveryDate: convertDateToTimestamp(formData.deliveryDate),
      inspirationImages,
      colorPalette,
      featuredBlooms,
      recipes,
    };

    try {
      if (proposalId) {
        // Update existing
        await proposalService.update(proposalId, dataToSave);
      } else {
        // Create new
        const newId = await proposalService.create(dataToSave);
        setProposalId(newId);
        // Update URL without full page reload
        navigate(`/proposal/${newId}`, { replace: true });
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('Auto-save failed:', err);
      setSaveStatus('error');
    }
  }, [formData, inspirationImages, colorPalette, featuredBlooms, recipes, proposalId, navigate]);

  // Check if form has any actual content
  const hasContent = formData.customerName || formData.customerEmail ||
                     formData.proposalName || formData.eventName ||
                     formData.styleNotes || inspirationImages.length > 0 ||
                     colorPalette.length > 0 || featuredBlooms.length > 0 ||
                     recipes.length > 0;

  // Auto-save effect - triggers on data changes
  useEffect(() => {
    // Don't auto-save until we've initialized (loaded existing data or confirmed new)
    if (!hasInitialized) return;

    // Skip auto-save if we just loaded data (this is not a real change)
    if (justLoadedRef.current) {
      justLoadedRef.current = false;
      return;
    }

    // Only mark as unsaved if there's actual content
    if (hasContent) {
      setSaveStatus('unsaved');
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveProposal();
    }, AUTOSAVE_DELAY);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, inspirationImages, colorPalette, featuredBlooms, recipes, hasInitialized, saveProposal, hasContent]);

  const updateField = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-fill delivery date to 3 days before event date (if delivery date is empty)
      if (field === 'eventDate' && value && !prev.deliveryDate) {
        const eventDate = new Date(value);
        eventDate.setDate(eventDate.getDate() - 3);
        updated.deliveryDate = eventDate.toISOString().split('T')[0];
      }

      return updated;
    });
  };

  const isProfessional = formData.consultationLevel === 'Professional Consultation' || formData.consultationLevel === 'Deluxe Consultation';

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

  // Recipe name error state
  const [recipeNameError, setRecipeNameError] = useState('');

  const handleSaveRecipe = () => {
    // Check for unique name within this proposal
    const newNameLower = newRecipe.name?.toLowerCase().trim();
    const isDuplicate = recipes.some(r => {
      // Skip the recipe being edited
      if (editingRecipeId && r.id === editingRecipeId) return false;
      return r.name?.toLowerCase().trim() === newNameLower;
    });

    if (isDuplicate) {
      setRecipeNameError('A recipe with this name already exists in this proposal. Please use a unique name.');
      // Scroll to the recipe name input
      setTimeout(() => {
        recipeNameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        recipeNameInputRef.current?.focus();
      }, 100);
      return;
    }

    setRecipeNameError('');

    // Create recipe object
    const recipe = {
      id: editingRecipeId || Date.now().toString(),
      name: newRecipe.name,
      quantity: newRecipe.quantity,
      description: newRecipe.description,
      image: newRecipe.photoUrl || '',
      ingredients: newRecipe.ingredients
        .filter(ing => ing.item && ing.stems)
        .map(ing => ({
          name: ing.item,
          productHandle: ing.productHandle || '',
          count: ing.stems
        }))
    };

    if (editingRecipeId) {
      // Update existing recipe
      setRecipes(prev => prev.map(r => r.id === editingRecipeId ? recipe : r));
    } else {
      // Add new recipe
      setRecipes(prev => [...prev, recipe]);
    }

    // Reset form
    setNewRecipe({
      name: '',
      quantity: 1,
      description: '',
      ingredients: [{ item: '', productHandle: '', stems: '' }],
      photoUrl: '',
    });
    setEditingRecipeId(null);
    setShowCreateRecipe(false);
    setRecipeNameError('');

    // Scroll back to recipes section
    setTimeout(() => {
      recipesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEditRecipe = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // Populate form with existing recipe data
    setNewRecipe({
      name: recipe.name || '',
      quantity: recipe.quantity || 1,
      description: recipe.description || '',
      ingredients: recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.map(ing => ({
            item: ing.name || '',
            productHandle: ing.productHandle || '',
            stems: String(ing.count || '')
          }))
        : [{ item: '', productHandle: '', stems: '' }],
      photoUrl: recipe.image || '',
    });
    setEditingRecipeId(recipeId);
    setShowCreateRecipe(true);

    // Scroll to recipe form after state updates
    setTimeout(() => {
      recipeFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRemoveRecipe = (recipeId) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  // Handle selecting an existing recipe to use as template
  const handleSelectExistingRecipe = (recipe) => {
    setNewRecipe({
      name: recipe.name || '',
      quantity: recipe.quantity || 1,
      description: recipe.description || '',
      ingredients: recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.map(ing => ({
            item: ing.name || '',
            productHandle: ing.productHandle || '',
            stems: String(ing.count || '')
          }))
        : [{ item: '', productHandle: '', stems: '' }],
      photoUrl: recipe.image || '',
    });
    setShowExistingRecipes(false);
    setShowRecipeChoiceModal(false);
    setRecipeSearchQuery('');
    setShowCreateRecipe(true);

    // Scroll to recipe form
    setTimeout(() => {
      recipeFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Product search handlers (Featured Blooms)
  // Dual search approach:
  // - Mode 1: Text-only search uses Shopify Predictive Search (searchProducts)
  // - Mode 2: Filter search uses flowers_view database (browseProducts)

  // Check if any filters are active
  const hasActiveFilters = selectedColor || selectedCategory || selectedType;

  // Execute search based on current mode
  const executeSearch = (textQuery = bloomSearchQuery, color = selectedColor, category = selectedCategory, type = selectedType) => {
    const hasFilters = color || category || type;
    const hasText = textQuery.trim().length >= 2;

    if (hasFilters) {
      // Mode 2: Use browseProducts for filter-based search
      // Build filters object, including color from hex conversion if from palette
      const filters = {
        colors: color ? [normalizeColorName(color)] : [],
        category: category || undefined,
        flowerType: type || undefined,
      };
      browseProducts(filters, 12);
      setShowBloomResults(true);
    } else if (hasText) {
      // Mode 1: Use searchProducts for text-only search
      searchProducts(textQuery.trim());
      setShowBloomResults(true);
    } else {
      clearResults();
      setShowBloomResults(false);
    }
  };

  // Normalize color name for API (handles hex colors from palette)
  const normalizeColorName = (color) => {
    // If it's a hex color, try to map it to a color name
    if (color.startsWith('#')) {
      // Simple heuristic - find closest preset color
      // For now, just return a generic "custom" that won't match
      // Users should use preset colors for best results
      return findClosestColorName(color);
    }
    return color;
  };

  // Find closest color name from a hex value
  const findClosestColorName = (hex) => {
    // Simple color mapping based on hue
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate rough hue
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // White/gray detection
    if (max - min < 30 && max > 200) return 'White';
    if (max - min < 30) return 'White'; // Gray maps to white

    // Dominant color detection
    if (r > g && r > b) {
      if (r > 200 && g > 150) return 'Orange';
      if (r > 150 && g < 100 && b < 100) return 'Red';
      if (g > 100) return 'Pink';
      return 'Red';
    }
    if (g > r && g > b) return 'Green';
    if (b > r && b > g) {
      if (r > 150) return 'Purple';
      return 'Blue';
    }
    if (r > 200 && g > 200) return 'Yellow';

    return 'Pink'; // Default fallback
  };

  const handleBloomSearch = (e) => {
    const query = e.target.value;
    setBloomSearchQuery(query);
    executeSearch(query, selectedColor, selectedCategory, selectedType);
  };

  // Filter selection handlers
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowColorFilter(false);
    executeSearch(bloomSearchQuery, color, selectedCategory, selectedType);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryFilter(false);
    executeSearch(bloomSearchQuery, selectedColor, category, selectedType);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowTypeFilter(false);
    executeSearch(bloomSearchQuery, selectedColor, selectedCategory, type);
  };

  const clearAllFilters = () => {
    setSelectedColor('');
    setSelectedCategory('');
    setSelectedType('');
    setBloomSearchQuery('');
    clearResults();
    setShowBloomResults(false);
    setShowCombinedFilter(false);
  };

  const handleSelectProduct = async (product) => {
    try {
      // Fetch full product details with variants
      const fullProduct = await getProduct(product.handle);

      // Create featured bloom with variant options
      const newBloom = {
        name: fullProduct.title,
        productHandle: fullProduct.handle, // Use productHandle for consistency with seed data
        handle: fullProduct.handle, // Keep handle as fallback
        productType: fullProduct.type || null, // Product type (e.g., "Ranunculus", "Roses Garden")
        category: fullProduct.category || null,
        image: fullProduct.featuredImage || fullProduct.images?.[0] || '',
        selectedOption: 0,
        stemsPerBunch: fullProduct.stemsPerBunch || null, // From product page scraping
        options: fullProduct.variants.map(variant => ({
          label: variant.title !== 'Default Title' ? variant.title : fullProduct.title,
          price: variant.price / 100, // Convert from cents
          variantId: variant.id,
          available: variant.available ?? true, // Default to true if undefined
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

  // Delete proposal handler
  const handleDeleteProposal = async () => {
    if (!proposalId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this proposal? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await proposalService.delete(proposalId);
        navigate('/');
      } catch (err) {
        console.error('Error deleting proposal:', err);
        alert('Failed to delete proposal. Please try again.');
      }
    }
  };

  // Inspiration Images handlers
  const handleAddImage = () => {
    if (inspirationImages.length >= 8) return;
    // Close color picker if open (no confirmation needed since we're switching)
    if (showColorPicker) {
      setShowColorPicker(false);
      setNewColor('#ffffff');
    }
    setShowImageModal(true);
    setImageInputMode('url');
    setNewImageUrl('');
    setTimeout(() => imageInputRef.current?.focus(), 100);
  };

  const handleSaveImageUrl = () => {
    if (newImageUrl.trim() && inspirationImages.length < 8) {
      setInspirationImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      setShowImageModal(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Shared function to process an image file (used by both file input and drag/drop)
  const processImageFile = (file) => {
    if (file && inspirationImages.length < 8) {
      // Validate it's an image
      if (!file.type.startsWith('image/')) {
        return;
      }
      // Convert to base64 data URL for now
      // In production, you'd upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setInspirationImages(prev => [...prev, event.target.result]);
        setShowImageModal(false);
        setIsDragging(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleCancelImage = () => {
    setNewImageUrl('');
    setShowImageModal(false);
  };

  const handleRemoveImage = (index) => {
    setInspirationImages(prev => prev.filter((_, i) => i !== index));
  };

  // Color Palette handlers
  const handleAddColor = () => {
    if (colorPalette.length >= 8) return;
    // Close image modal if open (no confirmation needed since we're switching)
    if (showImageModal) {
      setShowImageModal(false);
      setNewImageUrl('');
    }
    setShowColorPicker(true);
    setNewColor('#4D96FF');
  };

  const handleSelectPresetColor = (color) => {
    if (colorPalette.length < 8) {
      setColorPalette(prev => [...prev, color]);
      setShowColorPicker(false);
    }
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

  // Close search results and modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close bloom search results
      if (bloomSearchRef.current && !bloomSearchRef.current.contains(e.target)) {
        setShowBloomResults(false);
      }

      // Close image modal when clicking outside
      if (showImageModal && imageModalRef.current && !imageModalRef.current.contains(e.target)) {
        // Check if there's unsaved content (URL input has text)
        if (imageInputMode === 'url' && newImageUrl.trim()) {
          const confirmed = window.confirm('You have an unsaved image URL. Are you sure you want to close without adding it?');
          if (confirmed) {
            setNewImageUrl('');
            setShowImageModal(false);
          }
        } else {
          // No unsaved content, just close
          setNewImageUrl('');
          setShowImageModal(false);
        }
      }

      // Close color picker when clicking outside
      if (showColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        const confirmed = window.confirm('You haven\'t added a color yet. Are you sure you want to close the color picker?');
        if (confirmed) {
          setNewColor('#ffffff');
          setShowColorPicker(false);
        }
      }

      // Close search filter dropdowns when clicking outside
      if (colorFilterRef.current && !colorFilterRef.current.contains(e.target)) {
        setShowColorFilter(false);
      }
      if (categoryFilterRef.current && !categoryFilterRef.current.contains(e.target)) {
        setShowCategoryFilter(false);
      }
      if (typeFilterRef.current && !typeFilterRef.current.contains(e.target)) {
        setShowTypeFilter(false);
      }
      if (combinedFilterRef.current && !combinedFilterRef.current.contains(e.target)) {
        setShowCombinedFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showImageModal, showColorPicker, imageInputMode, newImageUrl]);

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
      <div className="flex items-center gap-[20px] px-[15px] py-[15px]">
        <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
          {isNewProposal && !proposalId ? 'Proposal Builder > New Proposal' : 'Proposal Builder > Edit Proposal'}
        </p>
        {/* Save Status - inline after title (only show if there's content) */}
        {hasContent && (
          <div className="flex items-center gap-[8px]">
            {saveStatus === 'saving' && (
              <span className="font-['Avenir:Roman',sans-serif] text-[#999] text-[12px]">Saving...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="font-['Avenir:Roman',sans-serif] text-[#4a9380] text-[12px]">✓ Saved</span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="font-['Avenir:Roman',sans-serif] text-[#f5a623] text-[12px]">Unsaved changes</span>
            )}
            {saveStatus === 'error' && (
              <span className="font-['Avenir:Roman',sans-serif] text-[#e74c3c] text-[12px]">Save failed</span>
            )}
          </div>
        )}
        {/* Delete Button - only show for saved proposals */}
        {proposalId && (
          <button
            onClick={handleDeleteProposal}
            className="btn-danger"
          >
            Delete Proposal
          </button>
        )}
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
              <option value="Deluxe Consultation">Deluxe Consultation</option>
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
                <div key={`empty-${i}`} className="relative">
                  <div
                    onClick={handleAddImage}
                    className="border border-[#ccc] border-dashed flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] cursor-pointer hover:bg-[#fafafa]"
                  >
                    <div className="opacity-50 size-[40px]">
                      <img alt="" className="size-full object-cover" src={addPhotoIcon} />
                    </div>
                    <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                      Add a Photo
                    </p>
                  </div>
                  {/* Image Add Modal - positioned over last empty slot */}
                  {showImageModal && i === emptyImageSlots - 1 && (
                    <div ref={imageModalRef} className="absolute top-0 left-0 border border-[#ccc] border-solid flex flex-col gap-[15px] p-[20px] rounded-[5px] w-[320px] bg-white shadow-lg z-50">
                      <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">Add an Image</p>

                      {/* Tab buttons */}
                      <div className="flex border-b border-[#eee]">
                        <button
                          onClick={() => setImageInputMode('url')}
                          className={`px-[15px] py-[8px] text-[12px] font-['Avenir:Roman',sans-serif] ${
                            imageInputMode === 'url'
                              ? 'text-[#4a9380] border-b-2 border-[#4a9380]'
                              : 'text-[#666]'
                          }`}
                        >
                          From URL
                        </button>
                        <button
                          onClick={() => setImageInputMode('upload')}
                          className={`px-[15px] py-[8px] text-[12px] font-['Avenir:Roman',sans-serif] ${
                            imageInputMode === 'upload'
                              ? 'text-[#4a9380] border-b-2 border-[#4a9380]'
                              : 'text-[#666]'
                          }`}
                        >
                          From Computer
                        </button>
                      </div>

                      {/* URL Input */}
                      {imageInputMode === 'url' && (
                        <div className="flex flex-col gap-[10px]">
                          <input
                            ref={imageInputRef}
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveImageUrl()}
                            placeholder="Paste image URL here..."
                            className="border border-[#ccc] border-solid px-[10px] py-[10px] text-[14px] outline-none rounded"
                          />
                          <div className="flex gap-[10px]">
                            <button
                              onClick={handleSaveImageUrl}
                              disabled={!newImageUrl.trim()}
                              className="bg-[#4a9380] text-white px-[20px] py-[8px] text-[12px] rounded disabled:opacity-50"
                            >
                              Add Image
                            </button>
                            <button
                              onClick={handleCancelImage}
                              className="border border-[#ccc] px-[20px] py-[8px] text-[12px] rounded hover:bg-[#f5f5f5]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* File Upload */}
                      {imageInputMode === 'upload' && (
                        <div className="flex flex-col gap-[10px]">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-[5px] py-[30px] px-[20px] text-center transition-colors cursor-pointer ${
                              isDragging
                                ? 'border-[#4a9380] bg-[#e8f5f1]'
                                : 'border-[#ccc] hover:border-[#4a9380] hover:bg-[#f9fdfb]'
                            }`}
                          >
                            <p className={`font-['Avenir:Roman',sans-serif] text-[14px] ${
                              isDragging ? 'text-[#4a9380]' : 'text-[#666]'
                            }`}>
                              {isDragging ? 'Drop image here' : 'Click or drag image here'}
                            </p>
                            <p className="font-['Avenir:Roman',sans-serif] text-[#999] text-[11px] mt-[5px]">
                              JPG, PNG, GIF up to 10MB
                            </p>
                          </div>
                          <button
                            onClick={handleCancelImage}
                            className="border border-[#ccc] px-[20px] py-[8px] text-[12px] rounded hover:bg-[#f5f5f5]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {/* Show Add button if we have 4+ images but less than 8 */}
              {inspirationImages.length >= 4 && showAddImageButton && (
                <div className="relative">
                  <div
                    onClick={handleAddImage}
                    className="border border-[#ccc] border-dashed flex flex-col gap-[10px] items-center px-[28px] py-[40px] size-[142px] cursor-pointer hover:bg-[#fafafa]"
                  >
                    <div className="opacity-50 size-[40px]">
                      <img alt="" className="size-full object-cover" src={addPhotoIcon} />
                    </div>
                    <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                      Add a Photo
                    </p>
                  </div>
                  {/* Image Add Modal - positioned over add button */}
                  {showImageModal && emptyImageSlots === 0 && (
                    <div ref={imageModalRef} className="absolute top-0 left-0 border border-[#ccc] border-solid flex flex-col gap-[15px] p-[20px] rounded-[5px] w-[320px] bg-white shadow-lg z-50">
                      <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">Add an Image</p>

                      {/* Tab buttons */}
                      <div className="flex border-b border-[#eee]">
                        <button
                          onClick={() => setImageInputMode('url')}
                          className={`px-[15px] py-[8px] text-[12px] font-['Avenir:Roman',sans-serif] ${
                            imageInputMode === 'url'
                              ? 'text-[#4a9380] border-b-2 border-[#4a9380]'
                              : 'text-[#666]'
                          }`}
                        >
                          From URL
                        </button>
                        <button
                          onClick={() => setImageInputMode('upload')}
                          className={`px-[15px] py-[8px] text-[12px] font-['Avenir:Roman',sans-serif] ${
                            imageInputMode === 'upload'
                              ? 'text-[#4a9380] border-b-2 border-[#4a9380]'
                              : 'text-[#666]'
                          }`}
                        >
                          From Computer
                        </button>
                      </div>

                      {/* URL Input */}
                      {imageInputMode === 'url' && (
                        <div className="flex flex-col gap-[10px]">
                          <input
                            ref={imageInputRef}
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveImageUrl()}
                            placeholder="Paste image URL here..."
                            className="border border-[#ccc] border-solid px-[10px] py-[10px] text-[14px] outline-none rounded"
                          />
                          <div className="flex gap-[10px]">
                            <button
                              onClick={handleSaveImageUrl}
                              disabled={!newImageUrl.trim()}
                              className="bg-[#4a9380] text-white px-[20px] py-[8px] text-[12px] rounded disabled:opacity-50"
                            >
                              Add Image
                            </button>
                            <button
                              onClick={handleCancelImage}
                              className="border border-[#ccc] px-[20px] py-[8px] text-[12px] rounded hover:bg-[#f5f5f5]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* File Upload */}
                      {imageInputMode === 'upload' && (
                        <div className="flex flex-col gap-[10px]">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-[5px] py-[30px] px-[20px] text-center transition-colors cursor-pointer ${
                              isDragging
                                ? 'border-[#4a9380] bg-[#e8f5f1]'
                                : 'border-[#ccc] hover:border-[#4a9380] hover:bg-[#f9fdfb]'
                            }`}
                          >
                            <p className={`font-['Avenir:Roman',sans-serif] text-[14px] ${
                              isDragging ? 'text-[#4a9380]' : 'text-[#666]'
                            }`}>
                              {isDragging ? 'Drop image here' : 'Click or drag image here'}
                            </p>
                            <p className="font-['Avenir:Roman',sans-serif] text-[#999] text-[11px] mt-[5px]">
                              JPG, PNG, GIF up to 10MB
                            </p>
                          </div>
                          <button
                            onClick={handleCancelImage}
                            className="border border-[#ccc] px-[20px] py-[8px] text-[12px] rounded hover:bg-[#f5f5f5]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                  <div key={`empty-color-${i}`} className="relative">
                    <div
                      onClick={handleAddColor}
                      className="border border-[#ccc] border-dashed flex items-center p-[10px] rounded-[100px] cursor-pointer hover:bg-[#fafafa]"
                    >
                      <div className="size-[40px]">
                        <img alt="" className="size-full object-cover opacity-50" src={colorPaletteIcon} />
                      </div>
                    </div>
                    {/* Color Picker - positioned over last empty slot */}
                    {showColorPicker && i === emptyColorSlots - 1 && (
                      <div ref={colorPickerRef} className="absolute top-0 left-0 border border-[#ccc] border-solid flex flex-col gap-[15px] p-[20px] rounded-[5px] bg-white shadow-lg w-[280px] z-50">
                        <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">Choose a Color</p>

                        {/* Quick Pick - Preset Swatches */}
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[11px] uppercase">Quick Pick</p>
                          <div className="grid grid-cols-6 gap-[8px]">
                            {presetColors.map((color, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSelectPresetColor(color)}
                                className="w-[32px] h-[32px] rounded-full border border-[#ddd] hover:scale-110 transition-transform hover:border-[#999]"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#eee]" />

                        {/* Custom Color */}
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[11px] uppercase">Custom Color</p>
                          <div className="flex gap-[10px] items-center">
                            <input
                              ref={colorInputRef}
                              type="color"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              className="w-[50px] h-[40px] cursor-pointer border border-[#ccc] rounded"
                            />
                            <input
                              type="text"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              placeholder="#ffffff"
                              className="border border-[#ccc] border-solid px-[10px] py-[6px] text-[12px] outline-none rounded flex-1"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-[10px] pt-[5px]">
                          <button
                            onClick={handleSaveColor}
                            className="bg-[#4a9380] text-white px-[20px] py-[8px] text-[12px] rounded flex-1"
                          >
                            Add Color
                          </button>
                          <button
                            onClick={handleCancelColor}
                            className="border border-[#ccc] px-[20px] py-[8px] text-[12px] rounded hover:bg-[#f5f5f5]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Show Add button if we have 4+ colors but less than 8 */}
                {colorPalette.length >= 4 && showAddColorButton && (
                  <div className="relative">
                    <div
                      onClick={handleAddColor}
                      className="border border-[#ccc] border-dashed flex items-center p-[10px] rounded-[100px] cursor-pointer hover:bg-[#fafafa]"
                    >
                      <div className="size-[40px]">
                        <img alt="" className="size-full object-cover opacity-50" src={colorPaletteIcon} />
                      </div>
                    </div>
                    {/* Color Picker - positioned over add button */}
                    {showColorPicker && emptyColorSlots === 0 && (
                      <div ref={colorPickerRef} className="absolute top-0 left-0 border border-[#ccc] border-solid flex flex-col gap-[15px] p-[20px] rounded-[5px] bg-white shadow-lg w-[280px] z-50">
                        <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">Choose a Color</p>

                        {/* Quick Pick - Preset Swatches */}
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[11px] uppercase">Quick Pick</p>
                          <div className="grid grid-cols-6 gap-[8px]">
                            {presetColors.map((color, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSelectPresetColor(color)}
                                className="w-[32px] h-[32px] rounded-full border border-[#ddd] hover:scale-110 transition-transform hover:border-[#999]"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#eee]" />

                        {/* Custom Color */}
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[11px] uppercase">Custom Color</p>
                          <div className="flex gap-[10px] items-center">
                            <input
                              ref={colorInputRef}
                              type="color"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              className="w-[50px] h-[40px] cursor-pointer border border-[#ccc] rounded"
                            />
                            <input
                              type="text"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                              placeholder="#ffffff"
                              className="border border-[#ccc] border-solid px-[10px] py-[6px] text-[12px] outline-none rounded flex-1"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-[10px] pt-[5px]">
                          <button
                            onClick={handleSaveColor}
                            className="bg-[#4a9380] text-white px-[20px] py-[8px] text-[12px] rounded flex-1"
                          >
                            Add Color
                          </button>
                          <button
                            onClick={handleCancelColor}
                            className="border border-[#ccc] px-[20px] py-[8px] text-[12px] rounded hover:bg-[#f5f5f5]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
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
                  <div className="h-[18px] w-[18px] shrink-0">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={bloomSearchQuery}
                    onChange={handleBloomSearch}
                    onFocus={() => (bloomSearchQuery.length >= 2 || selectedColor || selectedCategory || selectedType) && setShowBloomResults(true)}
                    placeholder={
                      (selectedColor || selectedCategory || selectedType)
                        ? `Search within ${[selectedColor, selectedCategory, selectedType].filter(Boolean).join(' + ')}...`
                        : "Search flowers by name, color, type..."
                    }
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
                {showBloomResults && (bloomSearchQuery.length >= 2 || selectedColor || selectedCategory || selectedType) && searchLoading && (
                  <div className="absolute top-full left-0 w-[520px] bg-white border border-[#ccc] border-t-0 rounded-b-[5px] p-[15px] z-50 shadow-lg">
                    <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px]">
                      Searching...
                    </p>
                  </div>
                )}
                {showBloomResults && (bloomSearchQuery.length >= 2 || selectedColor || selectedCategory || selectedType) && searchResults.length === 0 && !searchLoading && (
                  <div className="absolute top-full left-0 w-[520px] bg-white border border-[#ccc] border-t-0 rounded-b-[5px] p-[15px] z-50 shadow-lg">
                    <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px]">
                      No products found {(selectedColor || selectedCategory || selectedType) && 'with current filters'}
                    </p>
                  </div>
                )}
              </div>
              {/* Search By Color dropdown */}
              <div className="relative" ref={colorFilterRef}>
                <div
                  onClick={() => setShowColorFilter(!showColorFilter)}
                  className={`border border-solid flex gap-[10px] h-[48px] items-center px-[12px] rounded-[5px] cursor-pointer hover:bg-[#fafafa] ${selectedColor ? 'border-[#4a9380] bg-[#f0f9f7]' : 'border-[#ccc]'}`}
                >
                  <p className={`font-['Avenir:Roman',sans-serif] text-[12px] ${selectedColor ? 'text-[#333]' : 'text-[#999]'}`}>
                    {selectedColor || 'Color'}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className={`size-[10px] ${showColorFilter ? '' : 'rotate-180'}`}>
                      <ChevronIcon />
                    </div>
                  </div>
                </div>
                {showColorFilter && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#ccc] rounded-[5px] shadow-lg z-50 w-[200px] max-h-[300px] overflow-y-auto">
                    {selectedColor && (
                      <div
                        onClick={() => handleColorSelect('')}
                        className="p-[10px] cursor-pointer hover:bg-[#f5f5f5] border-b border-[#eee] text-[#999] text-[12px]"
                      >
                        Clear color filter
                      </div>
                    )}
                    <p className="px-[10px] py-[6px] text-[10px] text-[#999] uppercase tracking-wide bg-[#f9f9f9]">From Palette</p>
                    <div className="flex flex-wrap gap-[4px] p-[8px] border-b border-[#eee]">
                      {colorPalette.map((color, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleColorSelect(color)}
                          className="w-[24px] h-[24px] rounded-full cursor-pointer border border-[#ccc] hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <p className="px-[10px] py-[6px] text-[10px] text-[#999] uppercase tracking-wide bg-[#f9f9f9]">Preset Colors</p>
                    {PRESET_COLORS.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`p-[10px] cursor-pointer hover:bg-[#f5f5f5] text-[13px] ${selectedColor === color ? 'bg-[#e8f5f2] text-[#4a9380]' : 'text-[#333]'}`}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search By Category dropdown */}
              <div className="relative" ref={categoryFilterRef}>
                <div
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className={`border border-solid flex gap-[10px] h-[48px] items-center px-[12px] rounded-[5px] cursor-pointer hover:bg-[#fafafa] ${selectedCategory ? 'border-[#4a9380] bg-[#f0f9f7]' : 'border-[#ccc]'}`}
                >
                  <p className={`font-['Avenir:Roman',sans-serif] text-[12px] ${selectedCategory ? 'text-[#333]' : 'text-[#999]'}`}>
                    {selectedCategory || 'Category'}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className={`size-[10px] ${showCategoryFilter ? '' : 'rotate-180'}`}>
                      <ChevronIcon />
                    </div>
                  </div>
                </div>
                {showCategoryFilter && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#ccc] rounded-[5px] shadow-lg z-50 w-[160px]">
                    {selectedCategory && (
                      <div
                        onClick={() => handleCategorySelect('')}
                        className="p-[10px] cursor-pointer hover:bg-[#f5f5f5] border-b border-[#eee] text-[#999] text-[12px]"
                      >
                        Clear
                      </div>
                    )}
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`p-[10px] cursor-pointer hover:bg-[#f5f5f5] text-[13px] ${selectedCategory === cat ? 'bg-[#e8f5f2] text-[#4a9380]' : 'text-[#333]'}`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search By Type dropdown */}
              <div className="relative" ref={typeFilterRef}>
                <div
                  onClick={() => setShowTypeFilter(!showTypeFilter)}
                  className={`border border-solid flex gap-[10px] h-[48px] items-center px-[12px] rounded-[5px] cursor-pointer hover:bg-[#fafafa] ${selectedType ? 'border-[#4a9380] bg-[#f0f9f7]' : 'border-[#ccc]'}`}
                >
                  <p className={`font-['Avenir:Roman',sans-serif] text-[12px] ${selectedType ? 'text-[#333]' : 'text-[#999]'}`}>
                    {selectedType || 'Flower Type'}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className={`size-[10px] ${showTypeFilter ? '' : 'rotate-180'}`}>
                      <ChevronIcon />
                    </div>
                  </div>
                </div>
                {showTypeFilter && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#ccc] rounded-[5px] shadow-lg z-50 w-[160px] max-h-[300px] overflow-y-auto">
                    {selectedType && (
                      <div
                        onClick={() => handleTypeSelect('')}
                        className="p-[10px] cursor-pointer hover:bg-[#f5f5f5] border-b border-[#eee] text-[#999] text-[12px]"
                      >
                        Clear
                      </div>
                    )}
                    {FLOWER_TYPES.map((type) => (
                      <div
                        key={type}
                        onClick={() => handleTypeSelect(type)}
                        className={`p-[10px] cursor-pointer hover:bg-[#f5f5f5] text-[13px] ${selectedType === type ? 'bg-[#e8f5f2] text-[#4a9380]' : 'text-[#333]'}`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Combined Filters / Clear All */}
              <div className="relative" ref={combinedFilterRef}>
                <div
                  onClick={() => setShowCombinedFilter(!showCombinedFilter)}
                  className={`border border-solid flex gap-[10px] h-[48px] items-center px-[12px] rounded-[5px] cursor-pointer hover:bg-[#fafafa] ${(selectedColor || selectedCategory || selectedType) ? 'border-[#4a9380] bg-[#f0f9f7]' : 'border-[#ccc]'}`}
                >
                  <p className={`font-['Avenir:Roman',sans-serif] text-[12px] ${(selectedColor || selectedCategory || selectedType) ? 'text-[#333]' : 'text-[#999]'}`}>
                    All Filters {(selectedColor || selectedCategory || selectedType) && `(${[selectedColor, selectedCategory, selectedType].filter(Boolean).length})`}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className={`size-[10px] ${showCombinedFilter ? '' : 'rotate-180'}`}>
                      <ChevronIcon />
                    </div>
                  </div>
                </div>
                {showCombinedFilter && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-[#ccc] rounded-[5px] shadow-lg z-50 w-[280px] p-[15px]">
                    <p className="font-['Avenir:Heavy',sans-serif] text-[14px] text-[#333] mb-[10px]">Active Filters</p>
                    {!selectedColor && !selectedCategory && !selectedType && !bloomSearchQuery && (
                      <p className="text-[#999] text-[13px]">No filters active</p>
                    )}
                    <div className="flex flex-col gap-[8px]">
                      {bloomSearchQuery && (
                        <div className="flex items-center justify-between bg-[#f5f5f5] rounded-[4px] px-[10px] py-[6px]">
                          <span className="text-[12px] text-[#333]">Text: "{bloomSearchQuery}"</span>
                          <button onClick={() => { setBloomSearchQuery(''); executeFilteredSearch('', selectedColor, selectedCategory, selectedType); }} className="text-[#999] hover:text-[#333] text-[14px]">×</button>
                        </div>
                      )}
                      {selectedColor && (
                        <div className="flex items-center justify-between bg-[#f5f5f5] rounded-[4px] px-[10px] py-[6px]">
                          <span className="text-[12px] text-[#333]">Color: {selectedColor}</span>
                          <button onClick={() => handleColorSelect('')} className="text-[#999] hover:text-[#333] text-[14px]">×</button>
                        </div>
                      )}
                      {selectedCategory && (
                        <div className="flex items-center justify-between bg-[#f5f5f5] rounded-[4px] px-[10px] py-[6px]">
                          <span className="text-[12px] text-[#333]">Category: {selectedCategory}</span>
                          <button onClick={() => handleCategorySelect('')} className="text-[#999] hover:text-[#333] text-[14px]">×</button>
                        </div>
                      )}
                      {selectedType && (
                        <div className="flex items-center justify-between bg-[#f5f5f5] rounded-[4px] px-[10px] py-[6px]">
                          <span className="text-[12px] text-[#333]">Type: {selectedType}</span>
                          <button onClick={() => handleTypeSelect('')} className="text-[#999] hover:text-[#333] text-[14px]">×</button>
                        </div>
                      )}
                    </div>
                    {(selectedColor || selectedCategory || selectedType || bloomSearchQuery) && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-[12px] w-full py-[8px] bg-[#f0f0f0] hover:bg-[#e0e0e0] rounded-[4px] text-[12px] text-[#666]"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Proposal Inventory - Grouped by Category */}
          {featuredBlooms.length === 0 ? (
            <div className="border border-[#999] border-solid flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
              <div className="size-[20px]">
                <InfoIcon />
              </div>
              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
                No flowers selected yet. Start by searching for a flower or DIY kit above.
              </p>
            </div>
          ) : (
            <div className="border border-[#f1f1f1] border-solid flex flex-col gap-[15px] p-[30px] rounded-[5px] w-full">
              <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px] h-[30px]">
                {isProfessional ? 'Featured Blooms Palette:' : 'Shopping List:'}
              </p>

              {/* Group blooms by category */}
              {['Focal Flowers', 'Filler Flowers', 'Line Flowers', 'Greenery'].map((category) => {
                const categoryBlooms = featuredBlooms
                  .map((bloom, index) => ({ ...bloom, originalIndex: index }))
                  .filter((bloom) => bloom.category === category);

                if (categoryBlooms.length === 0) return null;

                return (
                  <div key={category} className="flex flex-col gap-[10px]">
                    {/* Category Header */}
                    <div className="flex items-center gap-[10px] mt-[10px]">
                      <p className="font-['Avenir:Heavy',sans-serif] text-[#4a9380] text-[14px] uppercase tracking-wide">
                        {category}
                      </p>
                      <div className="flex-1 h-[1px] bg-[#e0e0e0]" />
                    </div>

                    {/* Blooms in this category */}
                    {categoryBlooms.map((bloom) => (
                      <div key={bloom.originalIndex} className="bg-white border border-[#ccc] border-solid flex gap-[30px] items-start p-[15px] rounded-[5px]">
                        <div className="flex gap-[30px] items-start flex-1">
                          {bloom.image && (
                            <div className="size-[92px] shrink-0">
                              <img alt={bloom.name} className="object-cover size-full rounded-[5px]" src={bloom.image} />
                            </div>
                          )}
                          <div className="flex flex-col gap-[10px] flex-1">
                            <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[16px] uppercase">
                              {bloom.name}
                            </p>

                            {/* Only show quantity selector for Basic consultation */}
                            {!isProfessional && bloom.options && (
                              <div className="flex flex-col">
                                {bloom.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    onClick={() => handleBloomOptionChange(bloom.originalIndex, optIndex)}
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
                                ))}
                              </div>
                            )}

                            {/* For Professional, just show product type */}
                            {isProfessional && bloom.productType && (
                              <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px]">
                                {bloom.productType}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-end px-[15px] py-[10px]">
                          <button
                            onClick={() => handleRemoveBloom(bloom.originalIndex)}
                            className="btn-danger-outline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Basic Floral Recipes (Basic) OR Custom Floral Recipes (Professional) */}
        {!isProfessional ? (
          <BasicFloralRecipes />
        ) : (
          <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
            <p ref={recipesSectionRef} className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
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
                    {recipe.description && (
                      <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] line-clamp-2">
                        {recipe.description}
                      </p>
                    )}
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <ul className="list-disc pl-[18px] font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] h-[75px]">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            {ing.count} {ing.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-[10px] items-center justify-center px-[15px] py-[10px]">
                      <button
                        onClick={() => handleEditRecipe(recipe.id)}
                        className="btn-action-outline"
                      >
                        Edit Recipe
                      </button>
                      <button
                        onClick={() => handleRemoveRecipe(recipe.id)}
                        className="btn-danger-outline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Another Recipe Button - hide when form is open */}
            {!showCreateRecipe && !showRecipeChoiceModal && (
              <button
                onClick={() => setShowRecipeChoiceModal(true)}
                className="btn-action"
              >
                {recipes.length > 0 ? '+ Add Another Recipe' : '+ Add Floral Recipe'}
              </button>
            )}

            {/* Recipe Choice Modal */}
            {showRecipeChoiceModal && !showCreateRecipe && (
              <div className="border border-[#ccc] border-solid flex flex-col gap-[15px] p-[20px] rounded-[5px] bg-white shadow-md w-full max-w-[500px]">
                {!showExistingRecipes ? (
                  <>
                    <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[16px]">
                      How would you like to add a recipe?
                    </p>
                    <div className="flex flex-col gap-[10px]">
                      <button
                        onClick={() => {
                          setShowRecipeChoiceModal(false);
                          setShowCreateRecipe(true);
                        }}
                        className="border border-[#4a9380] border-solid flex items-center gap-[10px] px-[15px] py-[12px] rounded-[5px] cursor-pointer hover:bg-[#e8f5f1] bg-white text-left"
                      >
                        <span className="text-[20px]">✨</span>
                        <div>
                          <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">Create from Scratch</p>
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px]">Build a new recipe with custom ingredients</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setShowExistingRecipes(true)}
                        className="border border-[#ccc] border-solid flex items-center gap-[10px] px-[15px] py-[12px] rounded-[5px] cursor-pointer hover:bg-[#fafafa] bg-white text-left"
                      >
                        <span className="text-[20px]">📋</span>
                        <div>
                          <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">Choose from Existing</p>
                          <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px]">
                            Use a recipe from another proposal ({filteredExistingRecipes.length} available)
                          </p>
                        </div>
                      </button>
                    </div>
                    <button
                      onClick={() => setShowRecipeChoiceModal(false)}
                      className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] hover:text-[#333] mt-[5px]"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[16px]">
                        Choose an Existing Recipe
                      </p>
                      <button
                        onClick={() => setShowExistingRecipes(false)}
                        className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] hover:text-[#333]"
                      >
                        ← Back
                      </button>
                    </div>
                    <input
                      type="text"
                      value={recipeSearchQuery}
                      onChange={(e) => setRecipeSearchQuery(e.target.value)}
                      placeholder="Search recipes..."
                      className="border border-[#ccc] border-solid rounded-[5px] px-[10px] py-[8px] w-full font-['Avenir:Roman',sans-serif] text-[14px] outline-none"
                    />
                    <div className="flex flex-col gap-[12px] max-h-[350px] overflow-y-auto">
                      {filteredExistingRecipes.length === 0 ? (
                        <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] py-[20px] text-center">
                          {recipeSearchQuery ? 'No recipes match your search' : 'No existing recipes found'}
                        </p>
                      ) : (
                        Object.entries(groupedExistingRecipes).map(([proposalName, proposalRecipes]) => {
                          if (proposalRecipes.length === 0) return null;
                          return (
                            <div key={proposalName}>
                              <p className="font-['Avenir:Heavy',sans-serif] text-[#4a9380] text-[12px] mb-[6px] pb-[4px] border-b border-[#eee]">
                                {proposalName} ({proposalRecipes.length})
                              </p>
                              <div className="flex flex-col gap-[6px]">
                                {proposalRecipes.map((recipe, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => handleSelectExistingRecipe(recipe)}
                                    className="border border-[#eee] border-solid flex items-center gap-[10px] p-[10px] rounded-[5px] cursor-pointer hover:bg-[#f5f5f5] hover:border-[#4a9380]"
                                  >
                                    {recipe.image && (
                                      <img
                                        src={recipe.image}
                                        alt={recipe.name}
                                        className="w-[50px] h-[50px] object-cover rounded-[3px]"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <p className="font-['Avenir:Heavy',sans-serif] text-[#333] text-[14px]">
                                        {recipe.name}
                                      </p>
                                      {recipe.description && (
                                        <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[11px] line-clamp-1">
                                          {recipe.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowExistingRecipes(false);
                        setShowRecipeChoiceModal(false);
                        setRecipeSearchQuery('');
                      }}
                      className="font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] hover:text-[#333]"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Create/Edit Recipe Form - matching Figma MCP */}
            {showCreateRecipe && (
              <div ref={recipeFormRef} className="border border-[#ccc] border-solid flex flex-col gap-[30px] p-[15px] rounded-[5px] w-full">
                <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
                  {editingRecipeId ? 'Edit Recipe' : 'Create Recipe'}
                </p>

                {/* Recipe Name and Count */}
                <div className="flex gap-[30px] items-start w-full">
                  <div className="flex flex-col gap-[5px] w-[660px]">
                    <p className="font-['Avenir:Heavy',sans-serif] text-[#666] text-[12px] uppercase">
                      Recipe Name:
                    </p>
                    <input
                      ref={recipeNameInputRef}
                      type="text"
                      value={newRecipe.name}
                      onChange={(e) => {
                        updateNewRecipe('name', e.target.value);
                        if (recipeNameError) setRecipeNameError(''); // Clear error on edit
                      }}
                      placeholder="Bridal Bouquet"
                      className={`border border-solid rounded-[5px] px-[15px] py-[11px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[16px] outline-none ${
                        recipeNameError ? 'border-[#e74c3c]' : 'border-[#ccc]'
                      }`}
                    />
                    {recipeNameError && (
                      <p className="font-['Avenir:Roman',sans-serif] text-[#e74c3c] text-[12px]">
                        {recipeNameError}
                      </p>
                    )}
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
                            value={ingredient.productHandle || ingredient.item}
                            onChange={(e) => {
                              const selectedHandle = e.target.value;
                              const selectedBloom = featuredBlooms.find(b => b.productHandle === selectedHandle || b.handle === selectedHandle);
                              updateIngredient(index, 'item', selectedBloom?.name || selectedHandle);
                              updateIngredient(index, 'productHandle', selectedHandle);
                            }}
                            className="border border-[#ccc] border-solid rounded-[5px] h-[30px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none cursor-pointer bg-white"
                          >
                            <option value="">Select a flower from Featured Blooms...</option>
                            {featuredBlooms.map((bloom, bloomIdx) => (
                              <option key={bloomIdx} value={bloom.productHandle || bloom.handle}>
                                {bloom.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-[110px]">
                          <input
                            type="number"
                            min="1"
                            value={ingredient.stems}
                            onChange={(e) => updateIngredient(index, 'stems', e.target.value)}
                            placeholder="Qty"
                            className="border border-[#ccc] border-solid rounded-[5px] h-[30px] px-[15px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[14px] outline-none bg-white"
                          />
                        </div>
                        <div className="flex h-[30px] items-center justify-center py-[5px]">
                          <button
                            onClick={() => removeIngredient(index)}
                            className="btn-danger-outline text-[13px] py-[4px] px-[12px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Ingredient Button */}
                    <div className="flex items-end w-full">
                      <button
                        onClick={addIngredient}
                        className="btn-action-outline text-[13px] py-[4px] px-[12px]"
                      >
                        + Add Ingredient
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
                          <img alt="" className="size-full object-cover" src={addPhotoIcon} />
                        </div>
                        <p className="font-['Avenir:Roman',sans-serif] text-[#333] text-[12px] uppercase">
                          Add a Photo
                        </p>
                      </div>
                    )}

                    {/* Photo Buttons */}
                    <div className="flex flex-col gap-[10px] items-start justify-center w-[150px]">
                      <button className="btn-action-outline w-full text-[13px] py-[6px]">
                        Upload Photo
                      </button>
                      <input
                        type="text"
                        value={newRecipe.photoUrl}
                        onChange={(e) => updateNewRecipe('photoUrl', e.target.value)}
                        placeholder="Paste image URL..."
                        className="border border-[#ccc] border-solid rounded-[4px] px-[10px] py-[6px] w-full font-['Avenir:Roman',sans-serif] text-[#666] text-[12px] outline-none"
                      />
                      <button className="btn-action-outline w-full text-[13px] py-[6px]">
                        Create via AI
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save/Cancel Recipe Buttons */}
                <div className="flex items-end gap-[10px] w-full">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={!newRecipe.name}
                    className="btn-action disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Recipe
                  </button>
                  <button
                    onClick={() => {
                      setNewRecipe({
                        name: '',
                        quantity: 1,
                        description: '',
                        ingredients: [{ item: '', productHandle: '', stems: '' }],
                        photoUrl: '',
                      });
                      setEditingRecipeId(null);
                      setShowCreateRecipe(false);
                      setRecipeNameError('');
                      // Scroll back to recipes section
                      setTimeout(() => {
                        recipesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="btn-action-outline"
                    style={{ color: '#666', borderColor: '#ccc' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shopping List */}
        {(() => {
          const isBasic = formData.consultationLevel === 'Basic Consultation';
          const showShoppingList = recipes.length > 0 || (isBasic && featuredBlooms.length > 0);

          if (showShoppingList) {
            return (
              <ShoppingList
                recipes={recipes}
                featuredBlooms={featuredBlooms}
                isBasicConsultation={isBasic}
                deliveryDate={formData.deliveryDate}
              />
            );
          }

          return (
            <div className="bg-white border border-[#eef0ef] border-solid flex flex-col gap-[30px] p-[30px] rounded-[15px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
              <p className="font-['Avenir:Heavy',sans-serif] text-[#161616] text-[18px]">
                Shopping List
              </p>
              <div className="border border-[#999] border-solid flex gap-[10px] items-center px-[15px] py-[10px] rounded-[26px]">
                <div className="size-[20px]">
                  <InfoIcon />
                </div>
                <p className="font-['Avenir:Roman',sans-serif] text-[#666] text-[16px]">
                  {isBasic
                    ? 'Your shopping list will appear once you add featured blooms.'
                    : 'Your shopping list will appear once you add recipes.'
                  }
                </p>
              </div>
            </div>
          );
        })()}
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
