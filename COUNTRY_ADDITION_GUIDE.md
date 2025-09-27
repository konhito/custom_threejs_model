# 🌍 Adding Countries to Your Custom Globe

## Overview
Your custom globe now supports multiple countries with their national flowers! Each country appears as a clickable 3D ball that opens a detailed modal with flower information.

## Current Countries
- 🇮🇳 **India** - Lotus (Pink) - Special ring effect
- 🇺🇸 **United States** - Rose (Pink) 
- 🇯🇵 **Japan** - Cherry Blossom (Pink) - Special ring effect
- 🇫🇷 **France** - Iris (Purple)
- 🇦🇺 **Australia** - Golden Wattle (Yellow)
- 🇧🇷 **Brazil** - Golden Trumpet (Gold) - Special ring effect
- 🇨🇦 **Canada** - Maple Leaf (Red) - Special ring effect

## How to Add a New Country

### Method 1: Direct Addition to Array
Add a new country object to the `countriesData` array in `components/Globe.js`:

```javascript
{
  id: "COUNTRY_CODE_FLOWER",           // Unique identifier
  name: "Flower Name",                 // Display name
  country: "Country Name",             // Full country name
  countryCode: "XX",                   // ISO country code
  lat: 40.7128,                       // Latitude (adjust for your custom globe)
  lng: -74.0060,                      // Longitude (adjust for your custom globe)
  capital: "Capital City",
  population: "Population",
  continent: "Continent",
  language: "Language",
  currency: "Currency (CODE)",
  flowerName: "Flower Name",
  flowerScientificName: "Scientific Name",
  flowerDescription: "Detailed description...",
  culturalSignificance: "Cultural meaning...",
  botanicalInfo: "Botanical details...",
  color: "#hexcolor",                 // Ball color
  special: true,                      // Shows ring effect if true
  size: 0.06,                        // Ball size (0.06-0.08 recommended)
  gltfPath: "/model.glb",            // Optional 3D model path
}
```

### Method 2: Using Helper Function
Use the `createCountryData` helper function for cleaner code:

```javascript
const newCountry = createCountryData(
  "UK_ROSE",                          // id
  "Rose",                             // name
  "United Kingdom",                   // country
  "GB",                              // countryCode
  55.3781,                           // lat
  -3.4360,                           // lng
  "London",                          // capital
  "67 million",                      // population
  "Europe",                          // continent
  "English",                         // language
  "British Pound (GBP)",             // currency
  "Rose",                            // flowerName
  "Rosa",                            // flowerScientificName
  "The rose is the national flower...", // flowerDescription
  "Cultural significance...",        // culturalSignificance
  "Botanical information...",        // botanicalInfo
  "#ff69b4",                         // color
  true,                              // special
  0.07,                              // size
  null                               // gltfPath
);

// Then add to countriesData array
countriesData.push(newCountry);
```

## Coordinate System
Since you have a custom globe, you'll need to adjust coordinates to match your 3D model:

### Finding Coordinates
1. **Test coordinates** by adding a country with known lat/lng
2. **Adjust the coordinates** until the ball appears in the right location
3. **Use the helper function** `calculate3DCoordinates(lat, lng)` to see 3D positions

### Example Coordinate Adjustment
```javascript
// If you want to add Germany but the ball appears in the wrong place:
// Original coordinates: lat: 51.1657, lng: 10.4515
// Adjust for your custom globe:
lat: 51.1657,  // Keep latitude
lng: 10.4515,  // Adjust longitude as needed
```

## Visual Effects

### Ball Properties
- **Size**: `0.06` (small) to `0.08` (large)
- **Color**: Any hex color code
- **Special**: `true` adds a ring effect around the ball
- **Glow**: All balls have a subtle outer glow

### Animation
- Balls appear with a **staggered animation** (200ms delay between each)
- **Scale animation** from 0 to full size
- **Auto-rotation** stops when clicking a ball

## 3D Models
To add custom 3D models for flowers:

1. **Add GLB/GLTF file** to `/public/` folder
2. **Set gltfPath** in country data: `gltfPath: "/your-model.glb"`
3. **Fallback flower** will be created if model fails to load

## Testing New Countries
1. **Add country** to `countriesData` array
2. **Refresh the page** to see the new ball
3. **Click the ball** to test the modal
4. **Adjust coordinates** if needed
5. **Modify appearance** (color, size, special effects)

## Troubleshooting

### Ball Not Appearing
- Check if coordinates are correct for your custom globe
- Verify the country object is properly formatted
- Check browser console for errors

### Wrong Position
- Adjust `lat` and `lng` values
- Use `calculate3DCoordinates()` to verify 3D position
- Test with small coordinate changes

### Modal Not Opening
- Ensure `userData` is properly set on the sphere
- Check that click handler is working
- Verify country data structure

## Example: Adding Mexico
```javascript
{
  id: "MX_DAHLIA",
  name: "Dahlia",
  country: "Mexico",
  countryCode: "MX",
  lat: 23.6345,
  lng: -102.5528,  // Adjust for your globe
  capital: "Mexico City",
  population: "130 million",
  continent: "North America",
  language: "Spanish",
  currency: "Mexican Peso (MXN)",
  flowerName: "Dahlia",
  flowerScientificName: "Dahlia pinnata",
  flowerDescription: "The dahlia is Mexico's national flower...",
  culturalSignificance: "Represents Mexican heritage...",
  botanicalInfo: "A tuberous perennial plant...",
  color: "#ff4500",
  special: true,
  size: 0.07,
  gltfPath: null,
}
```

## Tips
- **Start with 2-3 countries** to test the system
- **Use different colors** to distinguish countries
- **Mark important countries** as `special: true` for ring effects
- **Keep descriptions concise** but informative
- **Test on different screen sizes** for responsiveness

Happy globe building! 🌍🌸
