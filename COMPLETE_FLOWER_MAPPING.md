# Complete Flower Image Mapping

## Overview
All card game countries have complete flower images mapped in the `/complete-flowers/` folder (hyphenated, URL-friendly).

## Country Mappings

| Country | Folder Name | Complete Flower Files | Status |
|---------|-------------|----------------------|--------|
| Pakistan | `Pakistan` | `Pakistan.svg`, `Pakistan.png` | ✅ |
| Peru | `Peru` | `Peru.svg`, `Peru.png` | ✅ |
| Tanzania | `Tanzania` | `Tanzania.svg`, `Tanzania.png` | ✅ |
| Nicaragua | `Nicaragua` | `Nicaragua.svg`, `Nicaragua.png` | ✅ |
| Jamaica | `Jamaica` | `Jamaica.svg`, `Jamaica.png` | ✅ |
| Spain | `Espana` | `Espana.svg`, `Espana.png` | ✅ |
| Scotland | `Escocia` | `Escocia.svg`, `Escocia.png` | ✅ |
| Germany | `Alemania` | `Alemania.svg`, `Alemania.png` | ✅ |

## Path Function
- Function: `getCompleteFlowerPath(countryFolder, format)`
- Location: `/lib/gameData.js`
- Path: `/complete-flowers/{countryFolder}.{format}` (hyphenated, no spaces)
- Formats: `svg` (default) or `png` (fallback)
- Fallbacks: Automatically tries old paths with spaces for backward compatibility

## Usage
- **FlowerFormation component**: Shows complete flower after collecting all 6 petals
- **WorldMapGarden component**: Displays completed flowers on world map
- **CompleteFlower component**: Reusable component for displaying complete flowers

## Error Handling
- Tries SVG first, falls back to PNG if SVG fails
- Logs warnings if images fail to load
- Shows UI even if image fails (graceful degradation)

## Verification
Run `verifyCompleteFlowerImages()` on game load to verify all mappings are correct.
