import React, { useState, useEffect, useRef } from 'react';
import './App.css';
// @ts-ignore
import logo from './valipokkann.svg';

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
  { name: 'Black', value: '#222', label: 'Black' },
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
function PaletteDropdown({palette, setPalette, groups, getColors}: {
  palette: string | string[],
  setPalette: (p: string) => void,
  groups: { label: string, palettes: string[] }[],
  getColors: (name: string) => string[]
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
  const selectedColors = paletteName === 'Random Madras' ? randomPalette() : (getColors(paletteName) || ['#ccc','#eee','#aaa','#fff']);
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
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:8}}>
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
            width: 32,
            height: 32,
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
  const [randomPaletteColors, setRandomPaletteColors] = useState<string[]>([]);
  const [lint, setLint] = useState(true);
  const [threadSpacing, setThreadSpacing] = useState(5);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [gallery, setGallery] = useState<any[]>([]);
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
    // Default to Render backend
    return 'https://checks-of-time-beta.onrender.com';
  };
  const [backendUrl, setBackendUrl] = useState(getDefaultBackendUrl());

  // Only generate a random palette when Random Madras is selected and none exists
  useEffect(() => {
    if (palette === 'Random Madras' && randomPaletteColors.length === 0) {
      setRandomPaletteColors(randomPalette());
    }
    if (palette !== 'Random Madras' && randomPaletteColors.length > 0) {
      setRandomPaletteColors([]);
    }
    // eslint-disable-next-line
  }, [palette]);

  // Generate initial artwork when component mounts
  useEffect(() => {
    if (artQueue.length === 0 && !isGenerating) {
      generateNewArt();
    }
  }, []);

  // Function to generate new art and add to queue
  const generateNewArt = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const config = getCurrentConfig();
    
    // Handle Random Madras palette
    let paletteToSend: string | string[] = config.palette;
    if (config.palette === 'Random Madras') {
      paletteToSend = randomPaletteColors;
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
        id: Date.now().toString(),
        html,
        config: { ...finalConfig },
        timestamp: Date.now()
      };

      setArtQueue(prev => [...prev, newArt]);
      setCurrentArtIndex(prev => prev + 1);
    } catch (e) {
      console.error('Failed to generate art:', e);
    } finally {
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

  // Get current artwork
  const currentArt = artQueue[currentArtIndex];

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
    setCurrentArtIndex(artQueue.length - 1);
  };

  const goToArt = (index: number) => {
    setCurrentArtIndex(index);
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

  // Function to get current config with random values applied
  const getCurrentConfig = () => {
    let currentSeed = seed;
    let currentPalette = palette;
    let currentThreadSpacing = threadSpacing;
    let currentBgColor = bgColor;
    let currentLint = lint;
    let currentWeaveStyle = weaveStyle;

    if (randomAll || randomSeed) {
      currentSeed = generateRandomSeed();
      setSeed(currentSeed); // Update state with new seed
    }
    if (randomAll || randomPaletteToggle) {
      currentPalette = randomPalette();
      setPalette(currentPalette); // Update state with new palette
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

    return {
      seed: currentSeed,
      palette: currentPalette,
      threadSpacing: currentThreadSpacing,
      bgColor: currentBgColor,
      lint: currentLint,
      weaveStyle: currentWeaveStyle,
      opaque,
      threadVariance: currentWeaveStyle === 'classic' ? 0.3 : 0
    };
  };

  // Function to get config for bulk generation (respects current settings with some randomization)
  const getBulkConfig = () => {
    // Use current settings as base, but randomize seed for variety
    let currentSeed = generateRandomSeed();
    let currentPalette = palette;
    let currentThreadSpacing = threadSpacing;
    let currentBgColor = bgColor;
    let currentLint = lint;
    let currentWeaveStyle = weaveStyle;

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

    return {
      seed: currentSeed,
      palette: currentPalette,
      threadSpacing: currentThreadSpacing,
      bgColor: currentBgColor,
      lint: currentLint,
      weaveStyle: currentWeaveStyle,
      opaque,
      threadVariance: currentWeaveStyle === 'classic' ? 0.3 : 0
    };
  };

  // Only regenerate random palette on Generate Art
  const regenerate = () => {
    const newSeed = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    setSeed(newSeed);
    if (palette === 'Random Madras') {
      setRandomPaletteColors(randomPalette());
    }
    generateNewArt();
  };

  const saveToGallery = () => {
    if (currentArt) {
      setGallery([...gallery, { 
        seed, 
        palette, 
        lint, 
        threadSpacing, 
        bgColor, 
        opaque,
        artId: currentArt.id 
      }]);
    }
  };

  const getBackgroundLabel = (bgColor: string) => {
    const color = SKIN_COLORS.find(c => c.value === bgColor);
    return color ? color.label : 'Unknown';
  };

  return (
    <div className="EOL-dark-root">
      {/* Backend Toggle UI */}
      <div style={{margin: '16px 0', textAlign: 'center'}}>
        <label style={{fontWeight: 500, fontSize: 15, color: '#fff', background: '#222', padding: '8px 16px', borderRadius: 8}}>
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
      {/* Top Bar */}
      <header className="EOL-dark-topbar">
        <div className="EOL-dark-topbar-left">
          <img src={logo} alt="Echoes of the Loom" className="EOL-dark-logo" />
          <span className="EOL-dark-title">Echoes of the Loom</span>
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
          <button 
            className="EOL-dark-generate" 
            onClick={regenerate}
            disabled={isGenerating}
            style={{
              opacity: isGenerating ? 0.6 : 1,
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Art'}
          </button>
          
          {/* Bulk Generation Buttons */}
          <div style={{display: 'flex', gap: 8, marginTop: 12}}>
            <button 
              onClick={() => generateMultipleArt(11)}
              disabled={isGenerating}
              style={{
                padding: '8px 16px',
                background: isGenerating ? '#333' : '#ff5c2a',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                flex: 1
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate 11'}
            </button>
            <button 
              onClick={() => generateMultipleArt(111)}
              disabled={isGenerating}
              style={{
                padding: '8px 16px',
                background: isGenerating ? '#333' : '#ff5c2a',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                flex: 1
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate 111'}
            </button>
          </div>
          
          {/* Stop Bulk Generation Button */}
          {isBulkGenerating && (
            <div style={{marginTop: 8}}>
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
            </div>
          )}
          
          {/* Queue Navigation */}
          {artQueue.length > 1 && (
            <div className="EOL-dark-card">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <span style={{fontSize: '1rem', fontWeight: 500}}>Queue Navigation</span>
                <span style={{fontSize: '0.9rem', color: '#888'}}>
                  {currentArtIndex + 1} / {artQueue.length}
                </span>
              </div>
              <div style={{display: 'flex', gap: 8}}>
                <button 
                  onClick={goToPrevious}
                  disabled={currentArtIndex <= 0}
                  style={{
                    padding: '6px 12px',
                    background: currentArtIndex <= 0 ? '#333' : '#ff5c2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: currentArtIndex <= 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Prev
                </button>
                <button 
                  onClick={goToNext}
                  disabled={currentArtIndex >= artQueue.length - 1}
                  style={{
                    padding: '6px 12px',
                    background: currentArtIndex >= artQueue.length - 1 ? '#333' : '#ff5c2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: currentArtIndex >= artQueue.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Next →
                </button>
                <button 
                  onClick={goToLatest}
                  disabled={currentArtIndex >= artQueue.length - 1}
                  style={{
                    padding: '6px 12px',
                    background: currentArtIndex >= artQueue.length - 1 ? '#333' : '#ff5c2a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: currentArtIndex >= artQueue.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Latest
                </button>
              </div>
            </div>
          )}

          {/* Random Controls */}
          <div className="EOL-dark-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <span style={{fontSize: '1rem', fontWeight: 500}}>Random Controls</span>
              <button 
                onClick={() => setRandomAll(!randomAll)}
                style={{
                  padding: '6px 12px',
                  background: randomAll ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {randomAll ? '🎲 All On' : '🎲 All Off'}
              </button>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8}}>
              <button 
                onClick={() => setRandomSeed(!randomSeed)}
                style={{
                  padding: '6px 8px',
                  background: randomSeed ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>🎲</span> Seed
              </button>
              <button 
                onClick={() => setRandomPaletteToggle(!randomPaletteToggle)}
                style={{
                  padding: '6px 8px',
                  background: randomPaletteToggle ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>🎨</span> Palette
              </button>
              <button 
                onClick={() => setRandomThreadSpacing(!randomThreadSpacing)}
                style={{
                  padding: '6px 8px',
                  background: randomThreadSpacing ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>📏</span> Tightness
              </button>
              <button 
                onClick={() => setRandomBgColor(!randomBgColor)}
                style={{
                  padding: '6px 8px',
                  background: randomBgColor ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>🎨</span> Background
              </button>
              <button 
                onClick={() => setRandomLint(!randomLint)}
                style={{
                  padding: '6px 8px',
                  background: randomLint ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>🧶</span> Lint
              </button>
              <button 
                onClick={() => setRandomWeaveStyle(!randomWeaveStyle)}
                style={{
                  padding: '6px 8px',
                  background: randomWeaveStyle ? '#ff5c2a' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>🧵</span> Style
              </button>
            </div>
          </div>

          <div className="EOL-dark-card">
            <label>Palette
              <PaletteDropdown palette={palette} setPalette={setPalette} groups={PALETTE_GROUPS} getColors={name => name==='Random Madras'?randomPalette():PALETTE_COLORS[name]} />
            </label>
          </div>

          <div className="EOL-dark-card">
            <label>Weave Tightness
              <input type="range" min={1} max={5} step={0.1} value={threadSpacing} onChange={e => setThreadSpacing(Number(e.target.value))} />
              <span>{threadSpacing === 1 ? 'Very Tight' : threadSpacing === 5 ? 'Loose' : threadSpacing.toFixed(1) + 'px'}</span>
            </label>
          </div>
          <div className="EOL-dark-card">
            <label>Weave Style</label>
            <div style={{display:'flex',gap:16,marginTop:4}}>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                <input type="radio" name="weaveStyle" value="classic" checked={weaveStyle==='classic'} onChange={()=>setWeaveStyle('classic')} />
                Classic
              </label>
              <label style={{display:'flex',alignItems:'center',gap:6}}>
                <input type="radio" name="weaveStyle" value="woven" checked={weaveStyle==='woven'} onChange={()=>setWeaveStyle('woven')} />
                Woven
              </label>
            </div>
          </div>
          <div className="EOL-dark-card">
            <label>Background Color
              <BackgroundColorPicker bgColor={bgColor} setBgColor={setBgColor} opaque={opaque} setOpaque={setOpaque} />
            </label>
          </div>
          <div className="EOL-dark-card">
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
              <span style={{fontSize: '1.15rem', fontWeight: 500}}>Fresh from Loom</span>
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
                  border: '1px solid #555',
                  marginLeft: 16
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
          <div className="EOL-dark-card EOL-dark-actions">
            <button onClick={saveToGallery}>Save to Gallery</button>
            <button onClick={() => alert('Download .HTML coming soon!')}>Download .HTML</button>
            <button onClick={() => alert('Mint to Ordinals coming soon!')}>Mint to Ordinals</button>
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
                  padding: 0
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
              {isFullscreen ? '⤓' : '⤢'}
            </button>
          </div>
        </main>
      </div>

      {/* Bottom Preview Gallery */}
      {artQueue.length > 0 && (
        <div style={{
          background: '#0f0f0f',
          borderTop: '2px solid #333',
          padding: '20px',
          marginTop: '40px',
          width: '100%'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 275px)',
            gap: '30px',
            alignItems: 'center',
            justifyItems: 'center',
            minWidth: 'max-content',
            padding: '0 20px',
            overflowX: 'auto',
            overflowY: 'hidden',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {artQueue.map((art, index) => (
              <div
                key={index}
                onClick={() => setCurrentArtIndex(index)}
                style={{
                  width: '275px',
                  height: '275px',
                  border: index === currentArtIndex ? '3px solid #ff6b35' : '2px solid #333',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  background: '#1a1a1a',
                  transition: 'all 0.2s ease',
                  transform: index === currentArtIndex ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: index === currentArtIndex ? '0 8px 25px rgba(255, 107, 53, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = index === currentArtIndex ? 'scale(1.05)' : 'scale(1)';
                  e.currentTarget.style.boxShadow = index === currentArtIndex ? '0 8px 25px rgba(255, 107, 53, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <iframe
                    srcDoc={art.html}
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
                    title={`Artwork ${index + 1}`}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '8px',
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
            ))}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className="EOL-dark-gallery-modal">
          <button onClick={() => setGalleryOpen(false)}>Close Gallery</button>
          <div className="EOL-dark-gallery-list">
            {gallery.length === 0 ? (
              <div>No saved variants yet.</div>
            ) : (
              gallery.map((item, idx) => (
                <div key={idx} className="EOL-dark-gallery-item">
                  <div>Seed: {item.seed}</div>
                  <div>Palette: {item.palette}</div>
                  <div>Fresh from Loom: {item.lint ? 'Yes' : 'No'}</div>
                  <div>Background: {getBackgroundLabel(item.bgColor)}</div>
                  <button onClick={() => {
                    setSeed(item.seed);
                    setPalette(item.palette);
                    setLint(item.lint);
                    setBgColor(item.bgColor);
                    setOpaque(item.opaque);
                    setGalleryOpen(false);
                  }}>Load</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <button className="EOL-dark-gallery-open" onClick={() => setGalleryOpen(true)} style={{position:'fixed',bottom:24,right:24}}>Gallery</button>
    </div>
  );
}
