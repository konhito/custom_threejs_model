// Game data for countries and their flowers
// All folder names match the actual structure in /public/Digital cards - Vol 1/
export const countriesData = [
  {
    id: "PAKISTAN",
    name: "Jasmine",
    country: "Pakistan",
    countryCode: "PK",
    flowerName: "Jasmine",
    flowerScientificName: "Jasminum officinale",
    flowerDescription: "The jasmine is Pakistan's national flower, symbolizing purity, grace, and beauty. It represents the country's rich cultural heritage and natural fragrance.",
    folder: "Pakistan",
    petalCount: 6, // Petal_01.svg through Petal_06.svg
  },
  {
    id: "PERU",
    name: "Cantuta",
    country: "Peru",
    countryCode: "PE",
    flowerName: "Cantuta",
    flowerScientificName: "Cantua buxifolia",
    flowerDescription: "The cantuta is Peru's national flower, symbolizing the beauty and resilience of the Andean people. It represents the connection between nature and culture in the highlands.",
    folder: "Peru",
    petalCount: 6,
  },
  {
    id: "TANZANIA",
    name: "Clove",
    country: "Tanzania",
    countryCode: "TZ",
    flowerName: "Clove",
    flowerScientificName: "Syzygium aromaticum",
    flowerDescription: "The clove is Tanzania's national flower, symbolizing the country's rich spice heritage and natural abundance. It represents the connection between people and the land.",
    folder: "Tanzania",
    petalCount: 6,
  },
  {
    id: "NICARAGUA",
    name: "Sacuanjoche",
    country: "Nicaragua",
    countryCode: "NI",
    flowerName: "Sacuanjoche",
    flowerScientificName: "Plumeria rubra",
    flowerDescription: "The sacuanjoche is Nicaragua's national flower, symbolizing beauty, grace, and spiritual enlightenment. It represents the country's tropical beauty and cultural richness.",
    folder: "Nicaragua",
    petalCount: 6,
  },
  {
    id: "JAMAICA",
    name: "Lignum Vitae",
    country: "Jamaica",
    countryCode: "JM",
    flowerName: "Lignum Vitae",
    flowerScientificName: "Guaiacum officinale",
    flowerDescription: "The Lignum Vitae is Jamaica's national flower, symbolizing strength, resilience, and natural beauty. It represents the island's unique flora and cultural heritage.",
    folder: "Jamaica",
    petalCount: 6,
  },
  {
    id: "SPAIN",
    name: "Carnation",
    country: "Spain",
    countryCode: "ES",
    flowerName: "Carnation",
    flowerScientificName: "Dianthus caryophyllus",
    flowerDescription: "The carnation is Spain's national flower, symbolizing love, passion, and beauty. It represents the country's vibrant culture and natural elegance.",
    folder: "Espana",
    petalCount: 6,
  },
  {
    id: "SCOTLAND",
    name: "Thistle",
    country: "Scotland",
    countryCode: "GB-SCT",
    flowerName: "Thistle",
    flowerScientificName: "Onopordum acanthium",
    flowerDescription: "The thistle is Scotland's national flower, symbolizing resilience, protection, and national pride. It represents the country's rugged beauty and independent spirit.",
    folder: "Escocia",
    petalCount: 6,
  },
  {
    id: "GERMANY",
    name: "Cornflower",
    country: "Germany",
    countryCode: "DE",
    flowerName: "Cornflower",
    flowerScientificName: "Centaurea cyanus",
    flowerDescription: "The cornflower is Germany's national flower, symbolizing hope, freedom, and natural beauty. It represents the country's connection to nature and cultural heritage.",
    folder: "Alemania",
    petalCount: 6,
  },
];

// Helper function to get petal image path
export const getPetalPath = (countryFolder, petalNumber) => {
  return `/Digital cards - Vol 1/${countryFolder}/Petal_0${petalNumber}.svg`;
};

// Helper function to get card back path
export const getCardBackPath = () => {
  return `/Digital cards - Vol 1/Back card.svg`;
};

// Helper function to get complete flower image path
// Maps country folder names to complete flower image files
// All countries have complete flower images in /complete-flowers/ folder (hyphenated, no spaces):
// - Alemania (Germany)
// - Escocia (Scotland) 
// - Espana (Spain)
// - Jamaica
// - Nicaragua
// - Pakistan
// - Peru
// - Tanzania
export const getCompleteFlowerPath = (countryFolder, format = 'svg') => {
  // Format should be 'svg' or 'png'
  const validFormat = format.toLowerCase() === 'png' ? 'png' : 'svg';
  const fileName = `${countryFolder}.${validFormat}`;
  
  // Use hyphenated folder name (no spaces) for better URL compatibility
  // Folder name: "complete-flowers" (lowercase, hyphenated)
  const folderPath = 'complete-flowers';
  return `/${folderPath}/${fileName}`;
};

// Helper to get alternative paths for fallback (handles old paths with spaces)
// Note: Only use fallbacks if the primary path fails - avoid redirect loops
export const getCompleteFlowerPathFallbacks = (countryFolder, format = 'svg') => {
  const validFormat = format.toLowerCase() === 'png' ? 'png' : 'svg';
  const fileName = `${countryFolder}.${validFormat}`;
  return [
    `/complete-flowers/${fileName}`, // Hyphenated (primary - no spaces) - this should work
    // Only include old paths as fallbacks if primary fails
    `/complete flowers/${fileName}`, // With space (fallback for old paths)
    `/complete%20flowers/${fileName}`, // URL encoded space
    `/Complete-flowers/${fileName}`, // Capital C hyphenated
    `/Complete flowers/${fileName}`, // Capital C with space
  ];
};

// Verification function to check if all countries have complete flower images
export const verifyCompleteFlowerImages = () => {
  const missingFlowers = [];
  countriesData.forEach(country => {
    // Check if folder name exists in the expected format
    // This is a client-side check - actual file existence is verified at runtime
    if (!country.folder) {
      missingFlowers.push(`${country.country} (missing folder name)`);
    }
  });
  
  if (missingFlowers.length > 0) {
    console.warn('Countries with missing complete flower folder mappings:', missingFlowers);
  } else {
    console.log('All countries have complete flower folder mappings:', 
      countriesData.map(c => `${c.country} -> ${c.folder}`));
  }
  
  return missingFlowers.length === 0;
};

// Minion types - all located in /Digital cards - Vol 1/Minions/
export const minionTypes = [
  {
    id: "climatechange",
    name: "Climate Change",
    fileName: "minion_climatechange",
    image: "/Digital cards - Vol 1/Minions/minion_climatechange.svg",
    message: "You revealed the Climate Change minion. The ecosystem falls back. We must start again…",
  },
  {
    id: "deforestation",
    name: "Deforestation",
    fileName: "minion_deforestation",
    image: "/Digital cards - Vol 1/Minions/minion_deforestation.svg",
    message: "You revealed the Deforestation minion. The ecosystem falls back. We must start again…",
  },
  {
    id: "exploitation",
    name: "Exploitation",
    fileName: "minion_exploitation",
    image: "/Digital cards - Vol 1/Minions/minion_exploitation.svg",
    message: "You revealed the Exploitation minion. The ecosystem falls back. We must start again…",
  },
  {
    id: "ignorance",
    name: "Ignorance",
    fileName: "minion_ignorance",
    image: "/Digital cards - Vol 1/Minions/minion_ignorance.svg",
    message: "You revealed the Ignorance minion. The ecosystem falls back. We must start again…",
  },
  {
    id: "intentionalfire",
    name: "Intentional Fire",
    fileName: "minion_intentionalfire",
    image: "/Digital cards - Vol 1/Minions/minion_intentionalfire.svg",
    message: "You revealed the Intentional Fire minion. The ecosystem falls back. We must start again…",
  },
];

// Guardian types - all located in /Digital cards - Vol 1/Guardians/
export const guardianTypes = [
  {
    id: "education",
    name: "Education",
    fileName: "Guardian_education",
    image: "/Digital cards - Vol 1/Guardians/Guardian_education.svg",
    message: "You activated the Education Guardian. Hope is with you — continue!",
  },
  {
    id: "floraljustice",
    name: "Floral Justice",
    fileName: "Guardian_floraljustice",
    image: "/Digital cards - Vol 1/Guardians/Guardian_floraljustice.svg",
    message: "You activated the Floral Justice Guardian. Hope is with you — continue!",
  },
  {
    id: "naturalbalance",
    name: "Natural Balance",
    fileName: "Guardian_naturalbalance",
    image: "/Digital cards - Vol 1/Guardians/Guardian_naturalbalance.svg",
    message: "You activated the Natural Balance Guardian. Hope is with you — continue!",
  },
  {
    id: "reforestation",
    name: "Reforestation",
    fileName: "Guardian_reforestation",
    image: "/Digital cards - Vol 1/Guardians/Guardian_reforestation.svg",
    message: "You activated the Reforestation Guardian. Hope is with you — continue!",
  },
  {
    id: "water",
    name: "Water",
    fileName: "Guardian_water",
    image: "/Digital cards - Vol 1/Guardians/Guardian_water.svg",
    message: "You activated the Water Guardian. Hope is with you — continue!",
  },
  {
    id: "wildcard",
    name: "Wildcard",
    fileName: "wildcard",
    image: "/Digital cards - Vol 1/Guardians/Nahiara_wildcard.svg",
    message: "You activated a Wildcard Guardian. Hope is with you — continue!",
  },
];

