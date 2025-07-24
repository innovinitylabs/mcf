import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
// @ts-ignore
import logo from './valipokkann.svg';
import { 
  Heart, 
  Trash2, 
  Tag, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  Settings,
  Copy,
  Key,
  Dice6,
  Palette,
  Sparkles,
  Save,
  Shuffle
} from 'lucide-react';

// TypeScript: declare window._env_ for custom env injection
declare global {
  interface Window {
    _env_?: { BACKEND_URL?: string };
  }
}

const MADRAS_PALETTES = [
  'Classic Red-Green',
  'Vintage Tamil 04',
  'Sunset Pondicherry',
  'Chennai Monsoon',
  'Kanchipuram Gold',
  'Ivy League',
  'Yale Blue',
  'Harvard Crimson',
  'Oxford Tartan',
  'Black Watch',
  'Royal Stewart',
  'Cornell Red',
  'Princeton Orange',
  'Dartmouth Green',
  'Calcutta Classic',
  'Scottish Highland',
  'French Riviera',
  'Tokyo Metro',
  'Cape Town Pastel',
];

const PALETTE_GROUPS = [
  {
    label: 'Classic',
    palettes: [
      'Classic Red-Green', 'Vintage Tamil 04', 'Sunset Pondicherry', 'Chennai Monsoon', 'Kanchipuram Gold',
      'Madras Summer', 'Pondy Pastel', 'Tamil Sunrise', 'Chettinad Spice', 'Kerala Onam', 'Bengal Indigo', 'Goa Beach', 'Sri Lankan Tea', 'African Madras', 'Mumbai Monsoon',
    ]
  },
  {
    label: 'Ivy League',
    palettes: ['Ivy League', 'Yale Blue', 'Harvard Crimson', 'Cornell Red', 'Princeton Orange', 'Dartmouth Green']
  },
  {
    label: 'Tartan/Global',
    palettes: ['Oxford Tartan', 'Black Watch', 'Royal Stewart', 'Scottish Highland']
  },
  {
    label: 'Modern',
    palettes: ['French Riviera', 'Tokyo Metro', 'Cape Town Pastel']
  },
  {
    label: 'Random',
    palettes: ['Random Madras']
  }
];

// Skin color palette for background options
const SKIN_COLORS = [
  { name: 'Black', value: '#000000', label: 'Black' },
  { name: 'White', value: '#fff', label: 'White' },
  { name: 'Very Light', value: '#f9e4d2', label: 'Very Light' },
  { name: 'Light', value: '#f5cfa0', label: 'Light' },
  { name: 'Medium Light', value: '#eac086', label: 'Medium Light' },
  { name: 'Medium', value: '#d1a074', label: 'Medium' },
  { name: 'Medium Dark', value: '#a8755c', label: 'Medium Dark' },
  { name: 'Dark', value: '#7c4f35', label: 'Dark' },
  { name: 'Very Dark', value: '#4b2e1f', label: 'Very Dark' },
  { name: 'Transparent', value: 'transparent', label: 'Transparent' },
];

// Helper to get palette colors by name
const PALETTE_COLORS: Record<string, string[]> = {
  'Classic Red-Green': ['#cc0033', '#ffee88', '#004477', '#ffffff'],
  'Vintage Tamil 04': ['#e63946', '#f1faee', '#a8dadc', '#457b9d'],
  'Sunset Pondicherry': ['#ffb347', '#ff6961', '#6a0572', '#fff8e7'],
  'Chennai Monsoon': ['#1d3557', '#457b9d', '#a8dadc', '#f1faee'],
  'Kanchipuram Gold': ['#ffd700', '#b8860b', '#8b0000', '#fff8e7'],
  'Madras Summer': ['#f7c873', '#e94f37', '#393e41', '#3f88c5', '#fff8e7'],
  'Pondy Pastel': ['#f7cac9', '#92a8d1', '#034f84', '#f7786b', '#fff8e7'],
  'Tamil Sunrise': ['#ffb347', '#ff6961', '#fff8e7', '#1d3557', '#e63946'],
  'Chettinad Spice': ['#d72631', '#a2d5c6', '#077b8a', '#5c3c92', '#f4f4f4'],
  'Kerala Onam': ['#fff8e7', '#ffd700', '#e94f37', '#393e41', '#3f88c5'],
  'Bengal Indigo': ['#1a2634', '#3f88c5', '#f7c873', '#e94f37', '#fff8e7'],
  'Goa Beach': ['#f7cac9', '#f7786b', '#034f84', '#fff8e7', '#393e41'],
  'Sri Lankan Tea': ['#a8dadc', '#457b9d', '#e63946', '#f1faee', '#fff8e7'],
  'African Madras': ['#ffb347', '#e94f37', '#393e41', '#3f88c5', '#ffd700'],
  'Mumbai Monsoon': ['#1d3557', '#457b9d', '#a8dadc', '#f1faee', '#ffd700'],
  'Ivy League': ['#002147', '#a6192e', '#f4f4f4', '#ffd700', '#005a9c'],
  'Yale Blue': ['#00356b', '#ffffff', '#c4d8e2', '#8c1515'],
  'Harvard Crimson': ['#a51c30', '#ffffff', '#000000', '#b7a57a'],
  'Cornell Red': ['#b31b1b', '#ffffff', '#222222', '#e5e5e5'],
  'Princeton Orange': ['#ff8f1c', '#000000', '#ffffff', '#e5e5e5'],
  'Dartmouth Green': ['#00693e', '#ffffff', '#000000', '#a3c1ad'],
  'Oxford Tartan': ['#002147', '#c8102e', '#ffd700', '#ffffff', '#008272'],
  'Black Watch': ['#1c2a3a', '#2e4a62', '#1e2d24', '#3a5f0b'],
  'Royal Stewart': ['#e10600', '#ffffff', '#000000', '#ffd700', '#007a3d'],
  'Scottish Highland': ['#005eb8', '#ffd700', '#e10600', '#ffffff', '#000000'],
  'French Riviera': ['#0055a4', '#ffffff', '#ef4135', '#f7c873'],
  'Tokyo Metro': ['#e60012', '#0089a7', '#f6aa00', '#ffffff'],
  'Cape Town Pastel': ['#f7cac9', '#92a8d1', '#034f84', '#f7786b'],
};

// --- Curated authentic Madras/South Indian color swatches ---
const MADRAS_SWATCH = [
  '#cc0033', // Madras red
  '#ffee88', // pale yellow
  '#004477', // indigo blue
  '#ffffff', // white
  '#e63946', // deep pink-red
  '#f1faee', // off-white
  '#a8dadc', // pale blue
  '#457b9d', // blue
  '#ffd700', // gold
  '#b8860b', // dark gold
  '#8b0000', // maroon
  '#f7c873', // pastel yellow
  '#e94f37', // orange-red
  '#393e41', // charcoal
  '#3f88c5', // sky blue
  '#f7cac9', // pastel pink
  '#92a8d1', // pastel blue
  '#034f84', // navy
  '#f7786b', // coral
  '#1d3557', // deep blue
  '#d72631', // chili red
  '#a2d5c6', // mint
  '#077b8a', // teal
  '#5c3c92', // purple
  '#f4f4f4', // light gray
  '#1a2634', // dark indigo
  '#ffb347', // mango
  '#ff6961', // watermelon
  '#6a0572', // plum
  '#fff8e7', // cream
  '#b7a57a', // tan
  '#e5e5e5', // light gray
  '#ff8f1c', // orange
  '#000000', // black (for accent)
  '#a6192e', // Harvard crimson
  '#005a9c', // blue
  '#c8102e', // tartan red
  '#008272', // tartan green
  '#007a3d', // Stewart green
  '#ef4135', // fashion red
  '#0055a4', // French blue
  '#f6aa00', // Tokyo yellow
  '#7c4f35', // brown
  '#eac086', // skin tone
  '#d1a074', // skin tone
  '#a8755c', // skin tone
  '#4b2e1f', // skin tone
];

// --- Random Madras palette from curated swatch ---
function randomPalette() {
  // Always include a white or near-white
  const baseColors = MADRAS_SWATCH.filter(c => c !== '#ffffff' && c !== '#fff8e7' && c !== '#f1faee' && c !== '#f4f4f4');
  const n = 3 + Math.floor(Math.random() * 3); // 3-5 from swatch
  const picked: string[] = [];
  while (picked.length < n) {
    const c = baseColors[Math.floor(Math.random() * baseColors.length)];
    if (!picked.includes(c)) picked.push(c);
  }
  // Add a white or near-white
  const whites = ['#ffffff', '#fff8e7', '#f1faee', '#f4f4f4'];
  picked.push(whites[Math.floor(Math.random() * whites.length)]);
  return picked;
}
function PaletteSwatch({colors}:{colors:string[]}) {
  return <span style={{display:'inline-flex',verticalAlign:'middle',marginRight:8}}>{colors.map((c,i)=>(<span key={i} style={{width:14,height:14,background:c,display:'inline-block',borderRadius:3,marginRight:2,border:'1px solid #222'}}/>))}</span>;
}

// QQL-style custom palette picker
function PaletteDropdown({palette, setPalette, groups, getColors, paletteColors}: {
  palette: string | string[],
  setPalette: (p: string) => void,
  groups: { label: string, palettes: string[] }[],
  getColors: (name: string) => string[],
  paletteColors?: string[] | null
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  const paletteName = typeof palette === 'string' ? palette : 'Random Madras';
  const selectedColors = paletteName === 'Random Madras' && paletteColors ? paletteColors : (getColors(paletteName) || ['#ccc','#eee','#aaa','#fff']);
  return (
    <div ref={ref} style={{position:'relative',marginBottom:8}}>
      <div
        className="EOL-palette-picker-closed"
        style={{display:'flex',alignItems:'center',cursor:'pointer',padding:'6px 12px',borderRadius:8,background:'#18191c',border:'1px solid #333',minWidth:220}}
        onClick={()=>setOpen(v=>!v)}
      >
        <PaletteSwatch colors={selectedColors} />
        <span style={{fontWeight:500,fontSize:16}}>{paletteName}</span>
        <span style={{marginLeft:'auto',fontSize:18,opacity:0.5}}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="EOL-palette-picker-dropdown" style={{position:'absolute',zIndex:10,top:'110%',left:0,background:'#18191c',border:'1px solid #333',borderRadius:10,boxShadow:'0 4px 24px #0008',padding:'8px 0',minWidth:260,maxHeight:340,overflowY:'auto'}}>
          {groups.map(group => (
            <div key={group.label} style={{padding:'4px 16px 2px',fontWeight:600,fontSize:15,color:'#fff',letterSpacing:0.5}}>{group.label}
              {group.palettes.map(p => (
                <div
                  key={p}
                  onClick={()=>{setPalette(p);setOpen(false);}}
                  style={{display:'flex',alignItems:'center',padding:'6px 0',cursor:'pointer',borderRadius:6,background:p===paletteName?'#222':'none',margin:'2px 0'}}
                >
                  <PaletteSwatch colors={p==='Random Madras'?randomPalette():getColors(p) || ['#ccc','#eee','#aaa','#fff']} />
                  <span style={{fontSize:15,color:p===paletteName?'#fff':'#eee',fontWeight:p===paletteName?600:400}}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Background color button picker
function BackgroundColorPicker({bgColor, setBgColor, opaque, setOpaque}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 8,
      marginBottom: 8,
      maxWidth: '200px',
      margin: '0 auto 8px auto'
    }}>
      {SKIN_COLORS.map(color => (
        <button
          key={color.value}
          onClick={() => {
            setBgColor(color.value);
            if (color.value === 'transparent') {
              setOpaque(false);
            } else {
              setOpaque(true);
            }
          }}
          style={{
            width: '100%',
            aspectRatio: '1',
            background: color.value === 'transparent' 
              ? 'repeating-conic-gradient(from 0deg, #333 0deg 10deg, #666 10deg 20deg)' 
              : color.value,
            border: color.value === bgColor 
              ? '2px solid #ff5c2a' 
              : color.value === 'transparent' 
                ? '1px solid #333' 
                : '1px solid #222',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: color.value === bgColor ? '0 0 8px rgba(255, 92, 42, 0.4)' : 'none'
          }}
          title={color.label}
        />
      ))}
    </div>
  );
}

export default function App() {
  // State for config
  const [seed, setSeed] = useState(() => Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join(''));
  const [palette, setPalette] = useState<string | string[]>(MADRAS_PALETTES[0]);
  const [paletteColors, setPaletteColors] = useState<string[] | null>(null); // NEW: store actual colors if Random Madras
  const [lint, setLint] = useState(true);
  const [threadSpacing, setThreadSpacing] = useState(5);

  const [gallery, setGallery] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('gallery');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  // Gallery selection and management state
  const [selectedGalleryItems, setSelectedGalleryItems] = useState<Set<string>>(new Set());
  const [galleryView, setGalleryView] = useState<'queue' | 'favorites' | 'listed'>('queue');
  const [listedItems, setListedItems] = useState<Set<string>>(new Set());
  const [bgColor, setBgColor] = useState('#fff');
  const [opaque, setOpaque] = useState(true);
  const [weaveStyle, setWeaveStyle] = useState<'classic' | 'woven'>('classic');

  // Random toggle states for each variation
  const [randomSeed, setRandomSeed] = useState(false);
  const [randomPaletteToggle, setRandomPaletteToggle] = useState(false);
  const [randomThreadSpacing, setRandomThreadSpacing] = useState(false);
  const [randomBgColor, setRandomBgColor] = useState(false);
  const [randomLint, setRandomLint] = useState(false);
  const [randomWeaveStyle, setRandomWeaveStyle] = useState(false);
  const [randomAll, setRandomAll] = useState(false);

  // Queue system for generated artworks
  const [artQueue, setArtQueue] = useState<Array<{
    id: string;
    html: string;
    config: any;
    timestamp: number;
  }>>([]);
  const [currentArtIndex, setCurrentArtIndex] = useState(-1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stopBulkRef = useRef(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Backend URL toggle state
  const getDefaultBackendUrl = () => {
    // Always default to Render backend
    return 'https://checks-of-time-beta.onrender.com';
  };
  const [backendUrl, setBackendUrl] = useState(getDefaultBackendUrl());

  // Bitcoin integration state
  const [bitcoinMode, setBitcoinMode] = useState(false);
  const [bitcoinSeedMode, setBitcoinSeedMode] = useState<'hash' | 'address' | 'none'>('none');
  const [bitcoinHash, setBitcoinHash] = useState('');
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [bitcoinDataMode, setBitcoinDataMode] = useState(false);
  const [bitcoinDataParams, setBitcoinDataParams] = useState<string[]>(['blockHeight']);
  const [dynamicFadeMode, setDynamicFadeMode] = useState(false);
  const [priceBasedArt, setPriceBasedArt] = useState(false);
  const [fadeLevel, setFadeLevel] = useState(1); // 1 = no fade, 0 = maximum fade
  const [bitcoinData, setBitcoinData] = useState<any>(null);
  
  // Flag to prevent randomization when loading from URL
  const [preserveCurrentConfig, setPreserveCurrentConfig] = useState(false);

  // Add a flag to track if we loaded from URL
  const [loadedFromURL, setLoadedFromURL] = useState(false);

  const [pendingGeneration, setPendingGeneration] = useState(false);

  const [modalArt, setModalArt] = useState<{ id: string; html: string; config: any; timestamp: number } | null>(null);
  const [modalIndex, setModalIndex] = useState<number>(0); // Add state for modal navigation
  const [hasGeneratedFirstArt, setHasGeneratedFirstArt] = useState(false);
  const [generationCounter, setGenerationCounter] = useState(0);
  const generationInProgress = useRef(false);

  // Only generate a random palette when Random Madras is selected and none exists
  useEffect(() => {
    if (palette === 'Random Madras' && !paletteColors) {
      setPaletteColors(randomPalette());
    }
    if (palette !== 'Random Madras' && paletteColors) {
      setPaletteColors(null);
    }
    // eslint-disable-next-line
  }, [palette]);

  // Load configuration from URL on component mount
  useEffect(() => {
    if (!hasGeneratedFirstArt && artQueue.length === 0 && !isGenerating) {
      const configLoaded = loadConfigFromURL();
      if (!configLoaded) {
      generateNewArt();
    }
      setHasGeneratedFirstArt(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Reset the flag if the queue is cleared
  useEffect(() => {
    if (artQueue.length === 0 && hasGeneratedFirstArt) {
      // Only reset if we're not in the middle of initial load
      setTimeout(() => {
        setHasGeneratedFirstArt(false);
      }, 100);
    }
  }, [artQueue.length, hasGeneratedFirstArt]);

  // Fetch Bitcoin data and calculate fade when Bitcoin mode is enabled
  useEffect(() => {
    let intervalId: number;

    const updateBitcoinData = async () => {
      if (bitcoinMode && (bitcoinDataMode || dynamicFadeMode || priceBasedArt)) {
        const data = await fetchBitcoinData();
        if (data) {
          // Store Bitcoin data for art generation
          setBitcoinData(data);
          
          // Update fade level if dynamic fade is enabled
          if (dynamicFadeMode && data.price) {
            const newFadeLevel = calculatePriceFade(data.price);
            setFadeLevel(newFadeLevel);
          }
        }
      }
    };

    if (bitcoinMode && (bitcoinDataMode || dynamicFadeMode || priceBasedArt)) {
      // Initial fetch
      updateBitcoinData();
      
      // Set up interval to refresh data every 5 minutes for dynamic fade
      if (dynamicFadeMode) {
        intervalId = setInterval(updateBitcoinData, 5 * 60 * 1000);
      }
    } else {
      // Reset fade level when Bitcoin mode is disabled
      setFadeLevel(1);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitcoinMode, bitcoinDataMode, dynamicFadeMode, priceBasedArt]);

  // Update URL whenever configuration changes (manual adjustments only)
  useEffect(() => {
    if (loadedFromURL) {
      // Skip updates when loading from URL
      setLoadedFromURL(false);
      return;
    }
    
    // Only update URL for manual config changes, not during art generation
    // (Art generation updates URL immediately in generateNewArt)
    if (!isGenerating) {
      const timeoutId = setTimeout(() => {
        const config = {
          seed,
          palette,
          threadSpacing,
          bgColor,
          lint,
          weaveStyle,
          opaque,
          threadVariance: weaveStyle === 'classic' ? 0.3 : 0, // CRITICAL: include threadVariance
          bitcoinMode,
          bitcoinSeedMode,
          bitcoinHash,
          bitcoinAddress,
          bitcoinDataMode,
          bitcoinDataParams,
          priceBasedArt,
          dynamicFadeMode
        };
        updateURLWithConfig(config);
      }, 100); // Small delay to batch updates
      
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, palette, threadSpacing, bgColor, lint, weaveStyle, opaque, 
      bitcoinMode, bitcoinSeedMode, bitcoinHash, bitcoinAddress, 
      bitcoinDataMode, bitcoinDataParams, priceBasedArt, dynamicFadeMode, isGenerating]);

  // useEffect to trigger art generation after all config state is updated
  useEffect(() => {
    if (pendingGeneration && !generationInProgress.current) {
      console.log('Pending generation triggered');
      // Use the latest config
    const config = getCurrentConfig();
      generateNewArt(config);
      setPendingGeneration(false);
    }
    // eslint-disable-next-line
  }, [pendingGeneration]);

  // Function to generate new art and add to queue
  const generateNewArt = async (overrideConfig?: any) => {
    if (isGenerating || generationInProgress.current) {
      console.log('Already generating, skipping...');
      return;
    }
    console.log('Starting art generation...');
    generationInProgress.current = true;
    setIsGenerating(true);
    const currentGeneration = generationCounter;
    setGenerationCounter(prev => prev + 1);
    let config;
    if (overrideConfig) {
      config = { ...overrideConfig };
    } else {
      config = getCurrentConfig();
      // Always update URL immediately with the config used
      updateURLWithConfig(config);
    }
    // Handle Random Madras palette
    let paletteToSend: string | string[] = config.palette;
    if (Array.isArray(config.palette)) {
      paletteToSend = config.palette;
    } else if (config.palette === 'Random Madras' && config.paletteColors) {
      paletteToSend = config.paletteColors;
    }
    const finalConfig = {
      ...config,
      palette: paletteToSend
    };
    try {
      const res = await fetch(`${backendUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalConfig),
      });
      const html = await res.text();
      const newArt = {
        id: `${Date.now()}_${currentGeneration}`,
        html,
        config: { ...finalConfig },
        timestamp: Date.now()
      };
      setArtQueue(prev => [...prev, newArt]);
      setCurrentArtIndex(prev => prev + 1);
      console.log(`Art generation complete: ${newArt.id}`);
    } catch (e) {
      console.error('Failed to generate art:', e);
    } finally {
      generationInProgress.current = false;
      setIsGenerating(false);
    }
  };

  // Function to generate multiple artworks in sequence with progressive display
  const generateMultipleArt = async (count: number) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setIsBulkGenerating(true);
    stopBulkRef.current = false;
    let lastConfig: any = null;
    for (let i = 0; i < count; i++) {
      if (stopBulkRef.current) {
        break;
      }
      // Always get a fresh config for every generation
      const config = getBulkConfig();
      lastConfig = config;
      const finalConfig = {
        ...config,
        palette: config.palette
      };
      try {
        const res = await fetch(`${backendUrl}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalConfig),
        });
        const html = await res.text();
        const newArt = {
          id: Date.now().toString() + '_' + i,
          html,
          config: { ...finalConfig },
          timestamp: Date.now()
        };
        setArtQueue(prev => [...prev, newArt]);
        setCurrentArtIndex(prev => prev + 1);
        if (i < count - 1 && !stopBulkRef.current) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (e) {
        console.error(`Failed to generate art ${i + 1}:`, e);
      }
    }
    // After bulk, update main UI state to last config
    if (lastConfig) {
      setSeed(lastConfig.seed);
      setPalette(lastConfig.palette);
      setThreadSpacing(lastConfig.threadSpacing);
      setBgColor(lastConfig.bgColor);
      setLint(lastConfig.lint);
      setWeaveStyle(lastConfig.weaveStyle);
    }
    setIsGenerating(false);
    setIsBulkGenerating(false);
    stopBulkRef.current = false;
  };

  // Function to stop bulk generation
  const stopBulkGeneration = () => {
    stopBulkRef.current = true;
    setIsBulkGenerating(false);
  };

  // True fullscreen API logic
  useEffect(() => {
    function handleFullscreenChange() {
      const isNowFullscreen = document.fullscreenElement === canvasContainerRef.current;
      setIsFullscreen(isNowFullscreen);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen && canvasContainerRef.current) {
      canvasContainerRef.current.requestFullscreen();
    } else if (isFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Ensure currentArtIndex is always valid for the current artQueue
  useEffect(() => {
    if (artQueue.length > 0 && currentArtIndex >= artQueue.length) {
      setCurrentArtIndex(artQueue.length - 1);
    } else if (artQueue.length === 0 && currentArtIndex !== 0) {
      // If queue becomes empty, reset index to 0 to correctly show "No artwork available"
      setCurrentArtIndex(0);
    }
  }, [artQueue, currentArtIndex]);

  // Get current artwork - use useMemo to recalculate when artQueue or currentArtIndex changes
  const currentArt = useMemo(() => {
    return artQueue[currentArtIndex];
  }, [artQueue, currentArtIndex]);

  // Navigation functions
  const goToPrevious = () => {
    if (currentArtIndex > 0) {
      setCurrentArtIndex(currentArtIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentArtIndex < artQueue.length - 1) {
      setCurrentArtIndex(currentArtIndex + 1);
    }
  };

  const goToLatest = () => {
    if (artQueue.length > 0) {
    setCurrentArtIndex(artQueue.length - 1);
    }
  };

  // Modal navigation functions
  const goToPreviousModal = () => {
    if (modalIndex > 0) {
      const newIndex = modalIndex - 1;
      setModalIndex(newIndex);
      setModalArt(artQueue[newIndex]);
    }
  };

  const goToNextModal = () => {
    if (modalIndex < artQueue.length - 1) {
      const newIndex = modalIndex + 1;
      setModalIndex(newIndex);
      setModalArt(artQueue[newIndex]);
    }
  };

  // Random generation functions
  const generateRandomSeed = () => {
    return Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
  };

  const generateRandomThreadSpacing = () => {
    return Math.random() * 4 + 1; // 1 to 5
  };

  const generateRandomBgColor = () => {
    const colors = ['#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateRandomLint = () => {
    return Math.random() > 0.5;
  };

  const generateRandomWeaveStyle = () => {
    return Math.random() > 0.5 ? 'classic' : 'woven';
  };

  // Bitcoin utility functions
  const hashToPRNGSeed = (hashString: string): string => {
    // Simple hash to hex seed conversion
    if (!hashString) return generateRandomSeed();
    
    // Remove any non-hex characters and take first 16 characters
    const cleanHash = hashString.replace(/[^a-fA-F0-9]/g, '').toLowerCase();
    if (cleanHash.length >= 16) {
      return cleanHash.substring(0, 16);
    } else if (cleanHash.length > 0) {
      // Pad with repeated hash if too short
      const repeated = cleanHash.repeat(Math.ceil(16 / cleanHash.length));
      return repeated.substring(0, 16);
    } else {
      return generateRandomSeed();
    }
  };

  const addressToPRNGSeed = (address: string): string => {
    // Convert Bitcoin address to deterministic seed
    if (!address) return generateRandomSeed();
    
    // Simple deterministic conversion using charCodes
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and pad/repeat to 16 characters
    const hexHash = Math.abs(hash).toString(16);
    const repeated = hexHash.repeat(Math.ceil(16 / hexHash.length));
    return repeated.substring(0, 16);
  };

  // Bitcoin API integration
  const fetchBitcoinData = async () => {
    try {
      const [blockstreamData, mempoolData, priceData] = await Promise.all([
        // Blockstream API for basic blockchain info
        fetch('https://blockstream.info/api/blocks/tip/height').then(res => res.json()),
        // Mempool.space for mempool and fees
        fetch('https://mempool.space/api/v1/fees/recommended').then(res => res.json()),
        // CoinGecko for price (only if price-based art is enabled)
        priceBasedArt ? fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true').then(res => res.json()) : Promise.resolve(null)
      ]);

      return {
        blockHeight: blockstreamData,
        fees: mempoolData,
        price: priceData?.bitcoin
      };
    } catch (error) {
      console.error('Failed to fetch Bitcoin data:', error);
      return null;
    }
  };

  const calculatePriceFade = (priceData: any): number => {
    if (!priceData || !priceData.usd_24h_change) return 1;
    
    const change24h = priceData.usd_24h_change;
    
    // Calculate fade based on price movement
    // Positive change = brighter (fade level closer to 1)
    // Negative change = more faded (fade level closer to 0)
    
    if (change24h > 0) {
      // Green day - bright, fade level between 0.8 and 1.0
      const brightness = Math.min(change24h / 10, 1); // Cap at 10% change
      return 0.8 + (brightness * 0.2);
    } else {
      // Red day - faded, fade level between 0.3 and 1.0
      const fadeAmount = Math.min(Math.abs(change24h) / 15, 1); // Cap at 15% change
      return 1 - (fadeAmount * 0.7);
    }
  };

  // Permalink utility functions (reversible config encoding)
  const encodeConfigToString = (config: any): string => {
    // Always include paletteColors if present
    const minimalConfig = {
      seed: config.seed,
      palette: config.palette,
      paletteColors: config.paletteColors || null,
      threadSpacing: config.threadSpacing,
      bgColor: config.bgColor,
      lint: config.lint,
      weaveStyle: config.weaveStyle,
      opaque: config.opaque,
      threadVariance: config.threadVariance || (config.weaveStyle === 'classic' ? 0.3 : 0),
      bitcoinMode: config.bitcoinMode || false,
      bitcoinSeedMode: config.bitcoinSeedMode || 'none',
      bitcoinHash: config.bitcoinHash || '',
      bitcoinAddress: config.bitcoinAddress || '',
      bitcoinDataMode: config.bitcoinDataMode || false,
      bitcoinDataParams: config.bitcoinDataParams || ['blockHeight'],
      priceBasedArt: config.priceBasedArt || false,
      dynamicFadeMode: config.dynamicFadeMode || false
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(minimalConfig))));
  };

  const decodeConfigFromString = (str: string): any => {
    try {
      const decoded = decodeURIComponent(escape(atob(str)));
      const obj = JSON.parse(decoded);
      // If paletteColors exists, use it as palette
      if (obj.paletteColors && Array.isArray(obj.paletteColors)) {
        obj.palette = obj.paletteColors;
      }
      return obj;
    } catch (e) {
      return null;
    }
  };

  const updateURLWithConfig = (config: any) => {
    const encoded = encodeConfigToString(config);
    const newURL = `?c=${encoded}`;
    const fullURL = `${window.location.origin}${window.location.pathname}${newURL}`;
    window.history.replaceState({}, '', fullURL);
  };

  const loadConfigFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('c');
    if (encoded) {
      const loadedConfig = decodeConfigFromString(encoded);
      if (loadedConfig) {
        setLoadedFromURL(true);
        setPreserveCurrentConfig(true);
        setSeed(loadedConfig.seed);
        setPalette(loadedConfig.palette);
        setPaletteColors(loadedConfig.paletteColors || null);
        setThreadSpacing(loadedConfig.threadSpacing);
        setBgColor(loadedConfig.bgColor);
        setLint(loadedConfig.lint);
        setWeaveStyle(loadedConfig.weaveStyle);
        setOpaque(loadedConfig.opaque);
        setBitcoinMode(loadedConfig.bitcoinMode || false);
        setBitcoinSeedMode(loadedConfig.bitcoinSeedMode || 'none');
        setBitcoinHash(loadedConfig.bitcoinHash || '');
        setBitcoinAddress(loadedConfig.bitcoinAddress || '');
        setBitcoinDataMode(loadedConfig.bitcoinDataMode || false);
        setBitcoinDataParams(loadedConfig.bitcoinDataParams || ['blockHeight']);
        setPriceBasedArt(loadedConfig.priceBasedArt || false);
        setDynamicFadeMode(loadedConfig.dynamicFadeMode || false);
        const fullConfig = {
          ...loadedConfig,
          threadVariance: loadedConfig.threadVariance || (loadedConfig.weaveStyle === 'classic' ? 0.3 : 0)
        };
        // Use setTimeout to ensure all state updates are processed first
        setTimeout(() => {
          generateNewArt(fullConfig);
        }, 0);
        return true;
      }
    }
    return false;
  };

  const mapBitcoinDataToArtParams = (bitcoinData: any, currentConfig: any) => {
    if (!bitcoinData || !bitcoinDataMode) return currentConfig;
    
    const config = { ...currentConfig };
    
    // Map different Bitcoin data points to art parameters
    bitcoinDataParams.forEach(param => {
      switch (param) {
        case 'blockHeight':
          if (bitcoinData.blockHeight) {
            // Use block height to influence thread spacing (modulo to keep in range)
            const blockMod = bitcoinData.blockHeight % 100;
            config.threadSpacing = 1 + ((blockMod / 100) * 4); // 1-5 range
          }
          break;
          
        case 'difficulty':
          // Note: We'd need to fetch difficulty separately, for now use a placeholder
          // This could influence weave style or pattern complexity
          break;
          
        case 'mempoolSize':
          // Could influence the 'lint' parameter or color intensity
          // For now, we'll use a placeholder since mempool size isn't in our current API call
          break;
          
        case 'fees':
          if (bitcoinData.fees && bitcoinData.fees.fastestFee) {
            // Use fee levels to influence background color or pattern density
            const feeLevel = Math.min(bitcoinData.fees.fastestFee / 100, 1); // Normalize to 0-1
            // Adjust background darkness based on fee level
            const grayLevel = Math.floor(34 + (feeLevel * 100)); // 34-134 range
            config.bgColor = `#${grayLevel.toString(16).padStart(2, '0').repeat(3)}`;
          }
          break;
      }
    });
    
    return config;
  };

  // Function to get current config with random values applied
  const getCurrentConfig = () => {
    let currentSeed = seed;
    let currentPalette = palette;
    let currentPaletteColors = paletteColors;
    let currentThreadSpacing = threadSpacing;
    let currentBgColor = bgColor;
    let currentLint = lint;
    let currentWeaveStyle = weaveStyle;

    if (!preserveCurrentConfig) {
      // Handle Bitcoin seed modes
      if (bitcoinMode && bitcoinSeedMode === 'hash' && bitcoinHash) {
        currentSeed = hashToPRNGSeed(bitcoinHash);
        setSeed(currentSeed);
      } else if (bitcoinMode && bitcoinSeedMode === 'address' && bitcoinAddress) {
        currentSeed = addressToPRNGSeed(bitcoinAddress);
        setSeed(currentSeed);
      } else if (randomAll || randomSeed) {
      currentSeed = generateRandomSeed();
      setSeed(currentSeed); // Update state with new seed
    }
    if (randomAll || randomPaletteToggle) {
        currentPalette = 'Random Madras';
        currentPaletteColors = randomPalette();
        setPaletteColors(currentPaletteColors);
    }
    if (randomAll || randomThreadSpacing) {
      currentThreadSpacing = generateRandomThreadSpacing();
      setThreadSpacing(currentThreadSpacing); // Update state with new thread spacing
    }
    if (randomAll || randomBgColor) {
      currentBgColor = generateRandomBgColor();
      setBgColor(currentBgColor); // Update state with new background color
    }
    if (randomAll || randomLint) {
      currentLint = generateRandomLint();
      setLint(currentLint); // Update state with new lint setting
    }
    if (randomAll || randomWeaveStyle) {
      currentWeaveStyle = generateRandomWeaveStyle();
      setWeaveStyle(currentWeaveStyle); // Update state with new weave style
      }
    }

    const baseConfig = {
      seed: currentSeed,
      palette: currentPalette,
      paletteColors: currentPalette === 'Random Madras' ? currentPaletteColors : null,
      threadSpacing: currentThreadSpacing,
      bgColor: currentBgColor,
      lint: currentLint,
      weaveStyle: currentWeaveStyle,
      opaque,
      threadVariance: currentWeaveStyle === 'classic' ? 0.3 : 0,
      bitcoinMode,
      bitcoinSeedMode,
      bitcoinHash,
      bitcoinAddress,
      bitcoinDataMode,
      bitcoinDataParams,
      priceBasedArt,
      dynamicFadeMode
    };

    // Apply Bitcoin data modifications if enabled
    return mapBitcoinDataToArtParams(bitcoinData, baseConfig);
  };

  // Function to get config for bulk generation (respects current settings with some randomization)
  const getBulkConfig = () => {
    // Use current settings as base, but randomize seed for variety unless Bitcoin mode is active
    let currentSeed = generateRandomSeed();
    let currentPalette = palette;
    let currentThreadSpacing = threadSpacing;
    let currentBgColor = bgColor;
    let currentLint = lint;
    let currentWeaveStyle = weaveStyle;

    // Handle Bitcoin seed modes for bulk generation
    if (bitcoinMode && bitcoinSeedMode === 'hash' && bitcoinHash) {
      currentSeed = hashToPRNGSeed(bitcoinHash);
    } else if (bitcoinMode && bitcoinSeedMode === 'address' && bitcoinAddress) {
      currentSeed = addressToPRNGSeed(bitcoinAddress);
    }

    // Helper: get all curated palette names except 'Random Madras'
    const curatedPaletteNames = Object.keys(PALETTE_COLORS);

    // Handle Random Madras palette
    if (currentPalette === 'Random Madras') {
      currentPalette = randomPalette();
    } else if (typeof currentPalette === 'string') {
      // Use the selected palette
      currentPalette = PALETTE_COLORS[currentPalette] || currentPalette;
    }

    // Only randomize if random toggles are enabled
    if (randomAll || randomSeed) {
      currentSeed = generateRandomSeed();
    }
    if (randomAll || randomPaletteToggle) {
      // Pick a random curated palette name (excluding 'Random Madras')
      const curatedNames = curatedPaletteNames;
      const randomName = curatedNames[Math.floor(Math.random() * curatedNames.length)];
      if (randomName === 'Random Madras') {
        currentPalette = randomPalette();
      } else {
        currentPalette = PALETTE_COLORS[randomName];
      }
    }
    if (randomAll || randomThreadSpacing) {
      currentThreadSpacing = generateRandomThreadSpacing();
    }
    if (randomAll || randomBgColor) {
      currentBgColor = generateRandomBgColor();
    }
    if (randomAll || randomLint) {
      currentLint = generateRandomLint();
    }
    if (randomAll || randomWeaveStyle) {
      currentWeaveStyle = generateRandomWeaveStyle();
    }

    const baseConfig = {
      seed: currentSeed,
      palette: currentPalette,
      threadSpacing: currentThreadSpacing,
      bgColor: currentBgColor,
      lint: currentLint,
      weaveStyle: currentWeaveStyle,
      opaque,
      threadVariance: currentWeaveStyle === 'classic' ? 0.3 : 0
    };

    // Apply Bitcoin data modifications if enabled
    return mapBitcoinDataToArtParams(bitcoinData, baseConfig);
  };

  // Only regenerate random palette on Generate Art
  const regenerate = () => {
    setPreserveCurrentConfig(false);
    const newSeed = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setSeed(newSeed);
    if (palette === 'Random Madras') {
      setPaletteColors(randomPalette());
    }
    // Do NOT call generateNewArt here!
    setPendingGeneration(true);
  };

  const saveToGallery = () => {
    if (currentArt) {
      const newGalleryItem = { 
        id: currentArt.id,
        html: currentArt.html,
        config: currentArt.config,
        timestamp: currentArt.timestamp,
        seed, 
        palette, 
        lint, 
        threadSpacing, 
        bgColor, 
        opaque,
        weaveStyle,
        artId: currentArt.id 
      };
      
      const updatedGallery = [...gallery, newGalleryItem];
      setGallery(updatedGallery);
      localStorage.setItem('gallery', JSON.stringify(updatedGallery));
      alert('Saved to gallery!');
    }
  };

  // Gallery management functions
  const toggleGalleryItemSelection = (itemId: string) => {
    setSelectedGalleryItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllGalleryItems = () => {
    const currentItems = getCurrentGalleryItems();
    setSelectedGalleryItems(new Set(currentItems.map(item => item.id)));
  };

  const deselectAllGalleryItems = () => {
    setSelectedGalleryItems(new Set());
  };



  const toggleListed = (itemId: string) => {
    setListedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const deleteGalleryItems = (itemIds: string[]) => {
    // Handle queue items deletion
    if (galleryView === 'queue') {
      setArtQueue(prev => {
        const updated = prev.filter(item => !itemIds.includes(item.id));
        
        // Always ensure currentArtIndex is valid after deletion
        let newIndex = currentArtIndex;
        
        // If current index is beyond the new array length, set to last item
        if (currentArtIndex >= updated.length) {
          newIndex = Math.max(0, updated.length - 1);
        } else {
          // Check if the current art was deleted
          const currentArtId = prev[currentArtIndex]?.id;
          if (currentArtId && itemIds.includes(currentArtId)) {
            // Current art was deleted, adjust index to stay in valid range
            newIndex = Math.max(0, Math.min(currentArtIndex, updated.length - 1));
          }
        }
        
        // Update the index immediately to prevent race conditions
        setTimeout(() => setCurrentArtIndex(newIndex), 0);
        
        return updated;
      });
    } else {
      // Handle gallery items deletion
      setGallery(prev => {
        const updated = prev.filter(item => !itemIds.includes(item.id));
        localStorage.setItem('gallery', JSON.stringify(updated));
        return updated;
      });
    }
    
    setSelectedGalleryItems(prev => {
      const newSet = new Set(prev);
      itemIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  };

  const getCurrentGalleryItems = () => {
    switch (galleryView) {
      case 'queue':
        return artQueue;
      case 'listed':
        return gallery.filter(item => listedItems.has(item.id));
      default:
        return gallery; // favorites = all saved gallery items
    }
  };

  const getBackgroundLabel = (bgColor: string) => {
    const color = SKIN_COLORS.find(c => c.value === bgColor);
    return color ? color.label : 'Unknown';
  };

  // Move Escape key handler to top-level useEffect
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') setModalArt(null);
      if (modalArt) {
        if (e.key === 'ArrowLeft' && modalIndex > 0) {
          goToPreviousModal();
        }
        if (e.key === 'ArrowRight' && modalIndex < artQueue.length - 1) {
          goToNextModal();
        }
      }
    };
    if (modalArt) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalArt, modalIndex, artQueue.length]);

  return (
    <div className="EOL-dark-root">
      {/* Development Controls */}
      <div style={{margin: '16px 0', padding: '16px', background: '#1a1a1a', borderRadius: 8, border: '1px solid #333'}}>
        <h3 style={{margin: '0 0 12px 0', fontSize: '1rem', color: '#ff5c2a', fontWeight: 600}}>
          <Settings size={16} style={{display: 'inline', marginRight: 8}} />
          Development
        </h3>
        
        {/* Backend URL Toggle */}
        <div style={{marginBottom: 12}}>
          <label style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#ccc'}}>
          <input
            type="checkbox"
            checked={backendUrl === 'https://checks-of-time-beta.onrender.com'}
            onChange={e =>
              setBackendUrl(
                e.target.checked
                  ? 'https://checks-of-time-beta.onrender.com'
                  : 'http://localhost:3000'
              )
            }
            style={{marginRight: 8}}
          />
          Use Render Backend ({backendUrl})
        </label>
      </div>

        {/* Seed Input for Development */}
        <div style={{marginBottom: 12}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
            <label style={{fontSize: '0.9rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: 8}}>
              <Key size={14} />
              Seed (Dev)
            </label>
            <button 
              onClick={generateRandomSeed}
              style={{
                padding: '4px 8px',
                background: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Dice6 size={14} />
            </button>
          </div>
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#181818',
              border: '1px solid #333',
              borderRadius: 6,
              color: '#fff',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
            placeholder="Enter seed for development..."
          />
        </div>

        {/* Permalink for Development */}
        <div style={{marginBottom: 12}}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: '#1a1a1a',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #333',
            width: '100%',
            boxSizing: 'border-box'
          }}>
                      <span style={{fontSize: 14, color: '#ccc', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6}}>
            <Copy size={14} />
            Short Permalink
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Permalink copied to clipboard!');
            }}
            style={{
              padding: '6px 12px',
              background: '#ff5c2a',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Copy size={12} />
            Copy Link
          </button>
            <div style={{fontSize: 11, color: '#888', maxWidth: 300, textAlign: 'left'}}>
              Compact seed encodes all settings. Share this short link to recreate the exact artwork.
            </div>
          </div>
        </div>
      </div>


      {/* Top Bar */}
      <header className="EOL-dark-topbar">
        <div className="EOL-dark-topbar-left">
                        <img src={logo} alt="Madras Checks" className="EOL-dark-logo" />
              <span className="EOL-dark-title">Madras Checks</span>
        </div>
        <nav className="EOL-dark-nav">
          <a href="#create">Create</a>
          <a href="#mints">Mints</a>
          <a href="#about">About</a>
          <button className="EOL-dark-action">Connect Wallet</button>
        </nav>
      </header>
      <div className="EOL-dark-main-layout">
        {/* Sidebar Controls */}
        <aside className="EOL-dark-sidebar">
          {/* Main Generation Controls */}
          <div className="EOL-dark-card" style={{marginBottom: 16}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <button 
            className="EOL-dark-generate" 
            onClick={regenerate}
            disabled={isGenerating}
            style={{
              opacity: isGenerating ? 0.6 : 1,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  padding: '12px 16px',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {isGenerating ? '🔄 Generating...' : (
                  <>
                    <Sparkles size={16} style={{marginRight: 8}} />
                    Generate Artwork
                  </>
                )}
          </button>
          
              {/* Quick Actions */}
              <div style={{display: 'flex', gap: 8}}>
            <button 
              onClick={() => generateMultipleArt(11)}
              disabled={isGenerating}
              style={{
                    padding: '8px 12px',
                background: isGenerating ? '#333' : '#ff5c2a',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                flex: 1
              }}
            >
                  {isGenerating ? '...' : 'x11'}
            </button>
            <button 
              onClick={() => generateMultipleArt(111)}
              disabled={isGenerating}
              style={{
                    padding: '8px 12px',
                background: isGenerating ? '#333' : '#ff5c2a',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                flex: 1
              }}
            >
                  {isGenerating ? '...' : 'x111'}
            </button>
          </div>
          
          {isBulkGenerating && (
              <button 
                onClick={stopBulkGeneration}
                style={{
                  padding: '8px 16px',
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              >
                ⏹ Stop Generation
              </button>
              )}
              </div>
              </div>

          {/* Core Art Settings */}
          <div className="EOL-dark-card" style={{marginBottom: 16}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: '#fff'}}>🎨 Art Settings</h3>
            


            {/* Palette Setting */}
            <div style={{marginBottom: 16}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                <label style={{fontSize: '0.9rem', color: '#ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <Palette size={14} />
                  Palette
                </label>
              <button 
                  onClick={() => setRandomPaletteToggle(!randomPaletteToggle)}
                style={{
                    padding: '4px 8px',
                    background: randomPaletteToggle ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                    borderRadius: 4,
                  cursor: 'pointer',
                    fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                  <Shuffle size={12} />
              </button>
            </div>
              <PaletteDropdown 
                palette={palette} 
                setPalette={setPalette} 
                groups={PALETTE_GROUPS} 
                getColors={name => name==='Random Madras'?randomPalette():PALETTE_COLORS[name]} 
                paletteColors={paletteColors} 
              />
            </div>

            {/* Weave Style Setting */}
            <div style={{marginBottom: 16}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                <label style={{fontSize: '0.9rem', color: '#ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <Sparkles size={14} />
                  Weave Style
                </label>
              <button 
                  onClick={() => setRandomWeaveStyle(!randomWeaveStyle)}
                style={{
                    padding: '4px 8px',
                    background: randomWeaveStyle ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}
              >
                  <Shuffle size={12} />
              </button>
              </div>
              <div style={{display: 'flex', gap: 12}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem'}}>
                  <input 
                    type="radio" 
                    name="weaveStyle" 
                    value="classic" 
                    checked={weaveStyle==='classic'} 
                    onChange={()=>setWeaveStyle('classic')} 
                  />
                  Classic
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem'}}>
                  <input 
                    type="radio" 
                    name="weaveStyle" 
                    value="woven" 
                    checked={weaveStyle==='woven'} 
                    onChange={()=>setWeaveStyle('woven')} 
                  />
                  Woven
                </label>
              </div>
            </div>

            {/* Weave Tightness Setting */}
            <div style={{marginBottom: 16}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                <label style={{fontSize: '0.9rem', color: '#ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <Settings size={14} />
                  Weave Tightness: {threadSpacing === 1 ? 'Very Tight' : threadSpacing === 5 ? 'Loose' : threadSpacing.toFixed(1)}
                </label>
              <button 
                onClick={() => setRandomThreadSpacing(!randomThreadSpacing)}
                style={{
                    padding: '4px 8px',
                  background: randomThreadSpacing ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}
              >
                  <Shuffle size={12} />
              </button>
              </div>
              <input 
                type="range" 
                min={1} 
                max={5} 
                step={0.1} 
                value={threadSpacing} 
                onChange={e => setThreadSpacing(Number(e.target.value))}
                style={{width: '100%'}}
              />
            </div>

            {/* Background Color Setting */}
            <div style={{marginBottom: 16}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                <label style={{fontSize: '0.9rem', color: '#ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <Palette size={14} />
                  Background Color
                </label>
              <button 
                onClick={() => setRandomBgColor(!randomBgColor)}
                style={{
                    padding: '4px 8px',
                  background: randomBgColor ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}
              >
                  <Shuffle size={12} />
              </button>
              </div>
              <BackgroundColorPicker bgColor={bgColor} setBgColor={setBgColor} opaque={opaque} setOpaque={setOpaque} />
            </div>

            {/* Lint Setting */}
            <div style={{marginBottom: 16}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                <label style={{fontSize: '0.9rem', color: '#ccc', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <Sparkles size={14} />
                  Fresh from Loom
                </label>
              <button 
                onClick={() => setRandomLint(!randomLint)}
                style={{
                    padding: '4px 8px',
                  background: randomLint ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  <Shuffle size={12} />
                </button>
              </div>
              <div 
                onClick={() => setLint(!lint)}
                style={{
                  width: 44,
                  height: 24,
                  background: lint ? '#ff5c2a' : '#333',
                  borderRadius: 12,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  border: '1px solid #555'
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 2,
                  left: lint ? 22 : 2,
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>
          </div>

          {/* Bitcoin Integration - Collapsible */}
          <div className="EOL-dark-card" style={{marginBottom: 16}}>
            <div 
              style={{
                  display: 'flex',
                  alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '8px 0'
              }}
              onClick={() => setBitcoinMode(!bitcoinMode)}
            >
              <h3 style={{margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff'}}>₿ Bitcoin Integration</h3>
              <div 
                style={{
                  width: 44,
                  height: 24,
                  background: bitcoinMode ? '#ff5c2a' : '#333',
                  borderRadius: 12,
                  position: 'relative',
                  transition: 'background 0.2s ease',
                  border: '1px solid #555'
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 2,
                  left: bitcoinMode ? 22 : 2,
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>
            
            {bitcoinMode && (
              <div style={{marginTop: 12, paddingTop: 12, borderTop: '1px solid #333'}}>
                {/* Seed Source */}
                <div style={{marginBottom: 12}}>
                  <label style={{fontSize: '0.9rem', color: '#ccc', marginBottom: 6, display: 'block'}}>Seed Source</label>
                  <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
                    {[
                      { value: 'none', label: 'Random' },
                      { value: 'hash', label: 'Block/Tx Hash' },
                      { value: 'address', label: 'Address' }
                    ].map(({ value, label }) => (
              <button 
                        key={value}
                        onClick={() => setBitcoinSeedMode(value as any)}
                style={{
                          padding: '4px 8px',
                          background: bitcoinSeedMode === value ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                          fontSize: '0.8rem'
                }}
              >
                        {label}
              </button>
                    ))}
            </div>
          </div>

                {/* Hash/Address Input */}
                {(bitcoinSeedMode === 'hash' || bitcoinSeedMode === 'address') && (
                  <div style={{marginBottom: 12}}>
                    <label style={{fontSize: '0.9rem', color: '#ccc', marginBottom: 4, display: 'block'}}>
                      {bitcoinSeedMode === 'hash' ? 'Block/Transaction Hash' : 'Bitcoin Address'}
            </label>
                    <input
                      type="text"
                      value={bitcoinSeedMode === 'hash' ? bitcoinHash : bitcoinAddress}
                      onChange={(e) => bitcoinSeedMode === 'hash' ? setBitcoinHash(e.target.value) : setBitcoinAddress(e.target.value)}
                      placeholder={bitcoinSeedMode === 'hash' ? 'Enter block or transaction hash...' : 'Enter Bitcoin address...'}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: '#333',
                        border: '1px solid #555',
                        borderRadius: 4,
                        color: '#fff',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box'
                      }}
                    />
          </div>
                )}

                {/* Advanced Bitcoin Features */}
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {/* Bitcoin Data Mode */}
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <label style={{fontSize: '0.8rem', color: '#ccc'}}>Data Driven</label>
                    <div 
                      onClick={() => setBitcoinDataMode(!bitcoinDataMode)}
                      style={{
                        width: 32,
                        height: 18,
                        background: bitcoinDataMode ? '#ff5c2a' : '#333',
                        borderRadius: 9,
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        border: '1px solid #555'
                      }}
                    >
                      <div style={{
                        width: 12,
                        height: 12,
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: 2,
                        left: bitcoinDataMode ? 16 : 2,
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }} />
          </div>
            </div>

                  {/* Price-Based Art */}
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <label style={{fontSize: '0.8rem', color: '#ccc'}}>Price-Based Art</label>
                    <div 
                      onClick={() => setPriceBasedArt(!priceBasedArt)}
                      style={{
                        width: 32,
                        height: 18,
                        background: priceBasedArt ? '#ff5c2a' : '#333',
                        borderRadius: 9,
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        border: '1px solid #555'
                      }}
                    >
                      <div style={{
                        width: 12,
                        height: 12,
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: 2,
                        left: priceBasedArt ? 16 : 2,
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }} />
          </div>
          </div>

                  {/* Dynamic Fade */}
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <label style={{fontSize: '0.8rem', color: '#ccc'}}>Dynamic Fade</label>
                    <div 
                      onClick={() => setDynamicFadeMode(!dynamicFadeMode)}
                style={{
                        width: 32,
                        height: 18,
                        background: dynamicFadeMode ? '#ff5c2a' : '#333',
                        borderRadius: 9,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                        border: '1px solid #555'
                }}
              >
                <div style={{
                        width: 12,
                        height: 12,
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: 2,
                        left: dynamicFadeMode ? 16 : 2,
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>
          </div>

                {/* Fade Level Indicator */}
                {dynamicFadeMode && (
                  <div style={{marginTop: 12, paddingTop: 8, borderTop: '1px solid #333'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                      <span style={{fontSize: '0.8rem', color: '#999'}}>Current Fade</span>
                      <span style={{fontSize: '0.8rem', color: fadeLevel > 0.7 ? '#4ade80' : fadeLevel > 0.5 ? '#fbbf24' : '#ef4444'}}>
                        {Math.round(fadeLevel * 100)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 4,
                      background: '#333',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${fadeLevel * 100}%`,
                        height: '100%',
                        background: fadeLevel > 0.7 ? '#4ade80' : fadeLevel > 0.5 ? '#fbbf24' : '#ef4444',
                        borderRadius: 2,
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>



          {/* Actions */}
          <div className="EOL-dark-card">
            <h3 style={{margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600, color: '#fff'}}>⚡ Actions</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <button 
                onClick={saveToGallery}
                style={{
                  padding: '8px 12px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
                              >
                  <Save size={16} style={{marginRight: 8}} />
                  Save to Gallery
                </button>
              <button 
                onClick={() => alert('Download .HTML coming soon!')}
                style={{
                  padding: '8px 12px',
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                📥 Download .HTML
              </button>
              <button 
                onClick={() => alert('Mint to Ordinals coming soon!')}
                style={{
                  padding: '8px 12px',
                  background: '#7c3aed',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                🪙 Mint to Ordinals
              </button>
            </div>
          </div>
        </aside>
        {/* Canvas Area */}
        <main className="EOL-dark-canvas-area">
          <div
            ref={canvasContainerRef}
            className="EOL-dark-canvas-border"
            style={{
              position: 'relative',
              background: isFullscreen ? '#000' : undefined,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isFullscreen ? '100vh' : undefined,
              borderRadius: isFullscreen ? 0 : 12,
              boxShadow: isFullscreen ? 'none' : undefined,
              padding: isFullscreen ? 0 : undefined,
              margin: isFullscreen ? 0 : undefined,
              width: isFullscreen ? '100vw' : undefined,
              height: isFullscreen ? '100vh' : undefined,
              overflow: isFullscreen ? 'hidden' : undefined
            }}
          >
            {currentArt ? (
              <iframe
                title="Madras Checks Preview"
                srcDoc={currentArt.html}
                style={{
                  width: isFullscreen ? '100vw' : 1024,
                  height: isFullscreen ? '100vh' : 1024,
                  border: 'none',
                  borderRadius: isFullscreen ? 0 : 12,
                  background: 'transparent',
                  maxWidth: isFullscreen ? '100vw' : '100%',
                  maxHeight: isFullscreen ? '100vh' : '100%',
                  boxShadow: isFullscreen ? 'none' : undefined,
                  display: 'block',
                  margin: 0,
                  padding: 0,
                  // Apply dynamic fade when Bitcoin mode is enabled
                  filter: bitcoinMode && dynamicFadeMode ? `brightness(${fadeLevel}) contrast(${0.8 + (fadeLevel * 0.2)})` : undefined,
                  transition: 'filter 0.3s ease'
                }}
              />
            ) : (
              <div
                style={{
                  width: isFullscreen ? '100vw' : 1024,
                  height: isFullscreen ? '100vh' : 1024,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isFullscreen ? 'transparent' : '#18191c',
                  borderRadius: isFullscreen ? 0 : 12,
                  color: '#888',
                  fontSize: '1.2rem',
                  maxWidth: isFullscreen ? '100vw' : '100%',
                  maxHeight: isFullscreen ? '100vh' : '100%',
                  boxShadow: isFullscreen ? 'none' : undefined,
                  margin: 0,
                  padding: 0
                }}
              >
                {isGenerating ? 'Generating artwork...' : 'No artwork available'}
              </div>
            )}


            {/* Left Navigation Button */}
            {artQueue.length > 1 && !isFullscreen && (
              <button
                onClick={goToPrevious}
                disabled={currentArtIndex <= 0}
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  background: currentArtIndex <= 0 ? 'rgba(51, 51, 51, 0.3)' : 'rgba(255, 107, 53, 0.9)',
                  border: '2px solid rgba(255, 107, 53, 0.5)',
                  borderRadius: '50%',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: currentArtIndex <= 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (currentArtIndex > 0) {
                    e.currentTarget.style.background = 'rgba(255, 107, 53, 1)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentArtIndex > 0) {
                    e.currentTarget.style.background = 'rgba(255, 107, 53, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                  }
                }}
                title="Previous artwork"
                              >
                  <ChevronLeft size={20} />
                </button>
            )}

            {/* Right Navigation Button */}
            {artQueue.length > 1 && !isFullscreen && (
              <button
                onClick={goToNext}
                disabled={currentArtIndex >= artQueue.length - 1}
                style={{
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  background: currentArtIndex >= artQueue.length - 1 ? 'rgba(51, 51, 51, 0.3)' : 'rgba(255, 107, 53, 0.9)',
                  border: '2px solid rgba(255, 107, 53, 0.5)',
                  borderRadius: '50%',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: currentArtIndex >= artQueue.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (currentArtIndex < artQueue.length - 1) {
                    e.currentTarget.style.background = 'rgba(255, 107, 53, 1)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentArtIndex < artQueue.length - 1) {
                    e.currentTarget.style.background = 'rgba(255, 107, 53, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                  }
                }}
                title="Next artwork"
                              >
                  <ChevronRight size={20} />
                </button>
            )}

            {/* Queue Info & Latest Button */}
            {artQueue.length > 1 && !isFullscreen && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(35, 35, 35, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                borderRadius: '20px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                zIndex: 10
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <BookOpen size={12} style={{color: '#ff6b35'}} />
                  <span style={{fontSize: '0.8rem', color: '#fff', fontWeight: 500}}>
                    {currentArtIndex + 1} of {artQueue.length}
                  </span>
                </div>
                <div style={{
                  width: '1px',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.2)'
                }} />
                <button 
                  onClick={goToLatest}
                  disabled={currentArtIndex >= artQueue.length - 1}
                  style={{
                    padding: '4px 8px',
                    background: currentArtIndex >= artQueue.length - 1 ? 'rgba(51, 51, 51, 0.5)' : 'rgba(37, 99, 235, 0.9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: currentArtIndex >= artQueue.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onMouseEnter={(e) => {
                    if (currentArtIndex < artQueue.length - 1) {
                      e.currentTarget.style.background = 'rgba(37, 99, 235, 1)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentArtIndex < artQueue.length - 1) {
                      e.currentTarget.style.background = 'rgba(37, 99, 235, 0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  title="Go to latest artwork"
                >
                  Latest
                </button>
              </div>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '48px',
                height: '48px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid #ff5c2a',
                borderRadius: '50%',
                color: '#ff5c2a',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 92, 42, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </main>
      </div>





      {/* Unified Gallery Section */}
      {(artQueue.length > 0 || gallery.length > 0) && (
        <div style={{
          background: '#0f0f0f',
          borderTop: '2px solid #333',
          padding: '20px',
          marginTop: '40px',
          width: '100%'
        }}>
          {/* Gallery Navigation Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '0 20px'
          }}>
            {/* Left side - View tabs */}
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <button
                onClick={() => setGalleryView('queue')}
                style={{
                  padding: '8px 16px',
                  background: galleryView === 'queue' ? '#ff6b35' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Queue ({artQueue.length})
              </button>
              <button
                onClick={() => setGalleryView('favorites')}
                style={{
                  padding: '8px 16px',
                  background: galleryView === 'favorites' ? '#ff6b35' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Favorites ({gallery.length})
              </button>
              <button
                onClick={() => setGalleryView('listed')}
                style={{
                  padding: '8px 16px',
                  background: galleryView === 'listed' ? '#ff6b35' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                Listed for Sale ({listedItems.size})
              </button>
            </div>

            {/* Center - Selection info */}
            <div style={{color: '#ccc', fontSize: '14px'}}>
              {selectedGalleryItems.size > 0 ? `Selected only ${selectedGalleryItems.size}` : ''}
            </div>

                        {/* Right side - Selection and Bulk actions */}
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              {selectedGalleryItems.size > 0 ? (
                <>
                  <span style={{color: '#fff', fontSize: '14px'}}>
                    Selected only {selectedGalleryItems.size}
                  </span>
                  <button
                    onClick={() => {
                      // Add selected items to favorites (save to gallery)
                      const selectedItems = getCurrentGalleryItems().filter(item => 
                        selectedGalleryItems.has(item.id)
                      );
                      selectedItems.forEach(item => {
                        if (!gallery.find(g => g.id === item.id)) {
                          const newGalleryItem = { 
                            id: item.id,
                            html: item.html,
                            config: item.config,
                            timestamp: item.timestamp,
                            seed, 
                            palette, 
                            lint, 
                            threadSpacing, 
                            bgColor, 
                            opaque,
                            weaveStyle,
                            artId: item.id 
                          };
                          setGallery(prev => {
                            const updated = [...prev, newGalleryItem];
                            localStorage.setItem('gallery', JSON.stringify(updated));
                            return updated;
                          });
                        }
                      });
                      deselectAllGalleryItems();
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Heart size={14} />
                    Favorite {selectedGalleryItems.size} items
                  </button>
                  <button
                    onClick={() => deleteGalleryItems(Array.from(selectedGalleryItems))}
                    style={{
                      padding: '8px 16px',
                      background: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                    Delete {selectedGalleryItems.size} items
                  </button>
                  <button
                    onClick={deselectAllGalleryItems}
                    style={{
                      padding: '8px 16px',
                      background: '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <X size={14} />
                    Deselect all
                  </button>
                </>
              ) : (
                <button
                  onClick={selectAllGalleryItems}
                  style={{
                    padding: '8px 16px',
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Settings size={14} />
                  Select all
                </button>
              )}
            </div>
          </div>

          {/* Gallery Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 275px)',
            gap: '30px',
            alignItems: 'center',
            justifyItems: 'center',
            minWidth: 'max-content',
            padding: '20px',
            overflowX: 'auto',
            overflowY: 'hidden',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {getCurrentGalleryItems().map((item, index) => {
              const isSelected = selectedGalleryItems.has(item.id);
              const isListed = listedItems.has(item.id);
              const isQueueItem = galleryView === 'queue';
              
              return (
                <div
                  key={item.id}
                style={{
                  width: '275px',
                  height: '275px',
                    border: isSelected ? '3px solid #fff' : '2px solid #333',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  background: '#1a1a1a',
                  transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? '0 8px 25px rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
                    // Show action buttons
                    const actionButtons = e.currentTarget.querySelector('[data-action-buttons]') as HTMLElement;
                    if (actionButtons) {
                      actionButtons.style.opacity = '1';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)';
                    e.currentTarget.style.boxShadow = isSelected ? '0 8px 25px rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)';
                    // Hide action buttons
                    const actionButtons = e.currentTarget.querySelector('[data-action-buttons]') as HTMLElement;
                    if (actionButtons) {
                      actionButtons.style.opacity = '0';
                    }
                  }}
                >
                  {/* Artwork Preview */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (e.ctrlKey || e.metaKey) {
                        // Ctrl/Cmd + click for selection
                        toggleGalleryItemSelection(item.id);
                      } else {
                        // Regular click for modal
                        setModalArt(item);
                        if (isQueueItem) {
                          setModalIndex(artQueue.findIndex(a => a.id === item.id));
                        } else {
                          setModalIndex(getCurrentGalleryItems().findIndex(a => a.id === item.id));
                        }
                      }
                    }}
                    style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                    }}
                  >
                  <iframe
                      srcDoc={item.html}
                    style={{
                      width: '1024px',
                      height: '1024px',
                      border: 'none',
                      transform: 'scale(0.269)',
                      transformOrigin: 'top left',
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                      title={`Gallery Artwork ${index + 1}`}
                  />
                </div>



                                    {/* Action Buttons - Top right side, vertical stack, hover-only */}
                  <div 
                    data-action-buttons
                    style={{
                  position: 'absolute',
                  top: '8px',
                      right: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      zIndex: 10
                    }}
                  >
                    {/* Select Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGalleryItemSelection(item.id);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: selectedGalleryItems.has(item.id) ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.3)',
                        color: selectedGalleryItems.has(item.id) ? '#000' : '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = selectedGalleryItems.has(item.id) ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedGalleryItems.has(item.id) ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      title={selectedGalleryItems.has(item.id) ? 'Deselect item' : 'Select item'}
                    >
                      <div style={{
                        width: '12px',
                        height: '12px',
                        border: '1px solid currentColor',
                        borderRadius: '50%',
                        position: 'relative'
                      }}>
                        {selectedGalleryItems.has(item.id) && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '6px',
                            height: '6px',
                            background: 'currentColor',
                            borderRadius: '50%'
                          }} />
                        )}
                      </div>
                    </button>

                    {/* Make Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites (save to gallery)
                        if (!gallery.find(g => g.id === item.id)) {
                          const newGalleryItem = { 
                            id: item.id,
                            html: item.html,
                            config: item.config,
                            timestamp: item.timestamp,
                            seed, 
                            palette, 
                            lint, 
                            threadSpacing, 
                            bgColor, 
                            opaque,
                            weaveStyle,
                            artId: item.id 
                          };
                          setGallery(prev => {
                            const updated = [...prev, newGalleryItem];
                            localStorage.setItem('gallery', JSON.stringify(updated));
                            return updated;
                          });
                        }
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: gallery.find(g => g.id === item.id) ? 'rgba(255, 107, 53, 0.8)' : 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = gallery.find(g => g.id === item.id) ? 'rgba(255, 107, 53, 1)' : 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = gallery.find(g => g.id === item.id) ? 'rgba(255, 107, 53, 0.8)' : 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      title={gallery.find(g => g.id === item.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isQueueItem) {
                          // Remove from queue
                          setArtQueue(prev => prev.filter(a => a.id !== item.id));
                        } else {
                          // Remove from gallery
                          deleteGalleryItems([item.id]);
                        }
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(220, 38, 38, 0.3)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.8)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      title="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Use Traits Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Apply the item's traits to current generation
                        if (item.config) {
                          setSeed(item.config.seed || '');
                          setPalette(item.config.palette || '');
                          setLint(item.config.lint || '');
                          setThreadSpacing(item.config.threadSpacing || '');
                          setBgColor(item.config.bgColor || '#fff');
                          setOpaque(item.config.opaque || false);
                          setWeaveStyle(item.config.weaveStyle || '');
                        }
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      }}
                      title="Use traits"
                    >
                      <Settings size={16} />
                    </button>
                  </div>

                  {/* Item Number */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                  right: '8px',
                  background: '#ff6b35',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  {index + 1}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {modalArt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '40px'
        }}
          onClick={e => { if (e.target === e.currentTarget) setModalArt(null); }}
        >
          <div style={{
            background: '#18191c',
            borderRadius: 16,
            boxShadow: '0 8px 40px #000a',
            display: 'flex',
            flexDirection: 'row',
            maxWidth: 1600,
            width: '95vw',
            maxHeight: '95vh',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Artwork */}
            <div style={{
              flex: '1 1 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
              minHeight: 0,
              background: '#111',
              padding: 0,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Navigation Arrows */}
              {modalIndex > 0 && (
                <button
                  onClick={goToPreviousModal}
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ←
                </button>
              )}
              
              {modalIndex < artQueue.length - 1 && (
                <button
                  onClick={goToNextModal}
                  style={{
                    position: 'absolute',
                    right: 20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  →
                </button>
              )}

              <div style={{
                width: 'min(80vw, 80vh)',
                height: 'min(80vw, 80vh)',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#18191c',
                borderRadius: 16,
                boxShadow: '0 4px 24px #0008',
                overflow: 'hidden',
              }}>
                <iframe
                  srcDoc={modalArt.html}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: 12,
                    background: 'transparent',
                    boxShadow: 'none',
                    display: 'block',
                  }}
                  title="Gallery Artwork Preview"
                />
                </div>
            </div>
            {/* Traits Sidebar */}
            <div style={{
              flex: 1,
              background: '#222',
              color: '#fff',
              padding: 40,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 380,
              maxWidth: 420,
              overflowY: 'auto',
              borderLeft: '1px solid #333',
            }}>
              <h2 style={{fontSize: 22, fontWeight: 700, marginBottom: 16}}>Traits</h2>
              <div style={{marginBottom: 12}}><b>Seed:</b> <span style={{fontFamily: 'monospace'}}>{modalArt.config.seed}</span></div>
              <div style={{marginBottom: 12}}><b>Palette:</b> {typeof modalArt.config.palette === 'string' ? modalArt.config.palette : 'Custom'}
                <div style={{marginTop: 4}}>
                  <PaletteSwatch colors={Array.isArray(modalArt.config.palette) ? modalArt.config.palette : (PALETTE_COLORS[modalArt.config.palette] || [])} />
                </div>
              </div>
              <div style={{marginBottom: 12}}><b>Thread Spacing:</b> {modalArt.config.threadSpacing}</div>
              <div style={{marginBottom: 12}}><b>Background:</b> <span style={{background: modalArt.config.bgColor, color: '#000', padding: '2px 8px', borderRadius: 4}}>{modalArt.config.bgColor}</span></div>
              <div style={{marginBottom: 12}}><b>Weave Style:</b> {modalArt.config.weaveStyle}</div>
              <div style={{marginBottom: 12}}><b>Lint:</b> {modalArt.config.lint ? 'Yes' : 'No'}</div>
              <div style={{marginBottom: 12}}><b>Opaque:</b> {modalArt.config.opaque ? 'Yes' : 'No'}</div>
              {/* Bitcoin traits */}
              {modalArt.config.bitcoinMode && (
                <>
                  <div style={{margin: '16px 0 8px', fontWeight: 600, color: '#ff5c2a'}}>Bitcoin Integration</div>
                  <div style={{marginBottom: 8}}><b>Seed Mode:</b> {modalArt.config.bitcoinSeedMode}</div>
                  {modalArt.config.bitcoinSeedMode === 'hash' && <div style={{marginBottom: 8}}><b>Hash:</b> {modalArt.config.bitcoinHash}</div>}
                  {modalArt.config.bitcoinSeedMode === 'address' && <div style={{marginBottom: 8}}><b>Address:</b> {modalArt.config.bitcoinAddress}</div>}
                  <div style={{marginBottom: 8}}><b>Data Mode:</b> {modalArt.config.bitcoinDataMode ? 'On' : 'Off'}</div>
                  {modalArt.config.bitcoinDataMode && <div style={{marginBottom: 8}}><b>Data Params:</b> {modalArt.config.bitcoinDataParams?.join(', ')}</div>}
                  <div style={{marginBottom: 8}}><b>Price Based Art:</b> {modalArt.config.priceBasedArt ? 'Yes' : 'No'}</div>
                  <div style={{marginBottom: 8}}><b>Dynamic Fade:</b> {modalArt.config.dynamicFadeMode ? 'Yes' : 'No'}</div>
                </>
              )}
              {/* Buttons */}
              <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
                <button
                  onClick={() => {
                    const config = modalArt.config;
                    const minimalConfig = {
                      seed: config.seed,
                      palette: config.palette,
                      paletteColors: config.paletteColors || null,
                      threadSpacing: config.threadSpacing,
                      bgColor: config.bgColor,
                      lint: config.lint,
                      weaveStyle: config.weaveStyle,
                      opaque: config.opaque,
                      threadVariance: config.threadVariance || (config.weaveStyle === 'classic' ? 0.3 : 0),
                      bitcoinMode: config.bitcoinMode || false,
                      bitcoinSeedMode: config.bitcoinSeedMode || 'none',
                      bitcoinHash: config.bitcoinHash || '',
                      bitcoinAddress: config.bitcoinAddress || '',
                      bitcoinDataMode: config.bitcoinDataMode || false,
                      bitcoinDataParams: config.bitcoinDataParams || ['blockHeight'],
                      priceBasedArt: config.priceBasedArt || false,
                      dynamicFadeMode: config.dynamicFadeMode || false
                    };
                    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(minimalConfig))));
                    const url = `${window.location.origin}${window.location.pathname}?c=${encoded}`;
                    navigator.clipboard.writeText(url);
                    alert('Permalink copied!');
                  }}
                  style={{padding: '8px 16px', background: '#ff5c2a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer'}}
                >Copy Permalink</button>
                <button
                  onClick={() => {
                    // Save current modal art to gallery
                    const savedArt = {
                      id: modalArt.id,
                      html: modalArt.html,
                      config: modalArt.config,
                      timestamp: modalArt.timestamp
                    };
                    const existingGallery = JSON.parse(localStorage.getItem('gallery') || '[]');
                    const isAlreadySaved = existingGallery.some((art: any) => art.id === savedArt.id);
                    
                    if (!isAlreadySaved) {
                      existingGallery.push(savedArt);
                      localStorage.setItem('gallery', JSON.stringify(existingGallery));
                      alert('Saved to gallery!');
                    } else {
                      alert('Already saved in gallery!');
                    }
                  }}
                  style={{padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer'}}
                >💾 Save to Gallery</button>
                <button
                  onClick={() => alert('Download coming soon!')}
                  style={{padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer'}}
                >Download</button>
                <button
                  onClick={() => alert('Mint coming soon!')}
                  style={{padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer'}}
                >Mint</button>
                <button
                  onClick={() => {
                    // Load config into generator and close modal
                    setSeed(modalArt.config.seed);
                    setPalette(modalArt.config.palette);
                    setPaletteColors(modalArt.config.paletteColors || null);
                    setThreadSpacing(modalArt.config.threadSpacing);
                    setBgColor(modalArt.config.bgColor);
                    setLint(modalArt.config.lint);
                    setWeaveStyle(modalArt.config.weaveStyle);
                    setOpaque(modalArt.config.opaque);
                    setBitcoinMode(modalArt.config.bitcoinMode || false);
                    setBitcoinSeedMode(modalArt.config.bitcoinSeedMode || 'none');
                    setBitcoinHash(modalArt.config.bitcoinHash || '');
                    setBitcoinAddress(modalArt.config.bitcoinAddress || '');
                    setBitcoinDataMode(modalArt.config.bitcoinDataMode || false);
                    setBitcoinDataParams(modalArt.config.bitcoinDataParams || ['blockHeight']);
                    setPriceBasedArt(modalArt.config.priceBasedArt || false);
                    setDynamicFadeMode(modalArt.config.dynamicFadeMode || false);
                    setModalArt(null);
                    setPendingGeneration(true);
                  }}
                  style={{padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer'}}
                >Create with these traits</button>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setModalArt(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 22,
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Close"
            >×</button>
          </div>
        </div>
      )}


    </div>
  );
}
