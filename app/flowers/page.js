"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { computeSANCode } from "../../lib/sanCode";
import {
  Flower2,
  Globe2,
  Heart,
  Search,
  Sparkles,
  BookOpen,
  Shield,
  Archive,
  Layers,
  Sprout,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useTranslation } from "../../lib/useTranslation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Helper function to create GLB path
const createGLBPath = (countryName, flowerName) => {
  const fileName = `${countryName}_${flowerName}.glb`;
  return `/api/glb-proxy?url=${encodeURIComponent(`https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/${fileName}`)}`;
};

// Comprehensive flowers data array with all GLB links
const FLOWERS_DATA = [
  {
    id: "US_ROSE",
    commonName: "Rose",
    scientificName: "Rosa (hybrid cultivars)",
    country: "United States",
    countryCode: "US",
    translationKey: "usRose",
    glbPath: "/api/glb-proxy?url=" + encodeURIComponent("https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/Flower_America_Web.glb"),
    sanCode: "SAN-F-083,003",
    botanicalFamily: "Rosaceae",
    morphology: "Wide chromatic range (red, pink, white, yellow, lavender), highly fragrant flowers with 5–60+ petals; woody perennial shrub 0.3–3 m tall with thorny stems and pinnately compound leaves.",
    habitat: "Adaptable to temperate zones worldwide — gardens, parks, roadsides; native species in meadows, forest edges, and rocky hillsides across the Northern Hemisphere.",
    distribution: "Native to Asia, Europe, North America, and North Africa. The US grows approximately 1.2 billion cut roses annually; major cultivation in California, Oregon, and Texas.",
    historicalOrigin: "Roses have been cultivated for over 5,000 years. Ancient Romans used them in festivals and perfumery. In 1986, President Ronald Reagan signed legislation designating Rosa as the official national floral emblem of the United States. The rose's symbolic power spans Greek mythology (sacred to Aphrodite), Christianity (the Virgin Mary's flower), and heraldry (the Wars of the Roses in England).",
    nationalStatus: "Official national floral emblem of the United States since 1986 (Public Law 99-449)",
    traditionalUses: "Perfumery and essential oils (rose otto, rosa damascena); culinary uses (rosewater, rose hip tea, jams); Ayurvedic and Western herbal medicine (rose hips rich in Vitamin C); ornamental horticulture and floristry; religious and ceremonial decoration.",
    conservationStatus: "Cultivated varieties: Not Evaluated (NE). Wild species: several native Rosa species listed as state or federal Species of Concern in the USA.",
    mainThreats: "Rose Rosette Disease (RRD) — a devastating mite-transmitted virus; climate-driven drought stress; pesticide dependency in commercial cultivation; habitat loss for native wild rose species.",
    pfnoClassification: "Official National Floral Emblem",
    relevantPollinator: "Apis mellifera (Western honeybee) and native Bombus species (bumblebees) — roses are key bee pasture plants. Also pollinated by beetles, hoverflies, and solitary bees (Osmia spp.)",
    nahiaraMeasure: {
      total: 23,
      max: 25,
      rank: 5,
      status: "Living EcoRoot",
      latidoFloral: 5,
      memoriaCultural: 5,
      vozPublica: 5,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 23,
    scorfidon: {
      climateChange: { code: "SCF-001", threat: "Climate Change", impact: -1, description: "Shifting temperature patterns disrupt rose bloom cycles and increase drought stress in cultivation zones across the American Southwest.", guardian: "Natural Balance", guardianPower: 1 },
      deforestation: { code: "SCF-002", threat: "Deforestation", impact: -2, description: "Loss of native meadow and woodland habitats reduces populations of wild rose species (Rosa carolina, Rosa blanda, Rosa woodsii).", guardian: "Reforestation", guardianPower: 2 },
      exploitation: { code: "SCF-003", threat: "Exploitation", impact: -3, description: "Intensive commercial cut-flower production relies on heavy pesticide use, harming pollinators and degrading soil health.", guardian: "Floral Justice", guardianPower: 3 },
      ignorance: { code: "SCF-004", threat: "Ignorance", impact: -4, description: "Widespread ignorance of Rose Rosette Disease (RRD) — a fatal mite-vectored virus — has led to catastrophic losses of landscape roses across North America.", guardian: "Education", guardianPower: 4 },
      intentionalFire: { code: "SCF-005", threat: "Intentional Fire", impact: -5, description: "Wildfire, exacerbated by drought and heat waves, destroys native rose scrubland habitats across the western United States.", guardian: "Water", guardianPower: 5 },
    },
    nahiaraSynthesis: "Rosa integrates into the Nahiara universe with code SAN-F-083,003, evaluated at level 23/25 (Living EcoRoot) in the Nahiara Measure — ranking 5th globally. As the official national floral emblem of the United States since 1986, the rose carries 5,000 years of cultural resonance across civilizations. The principal threat — Rose Rosette Disease — underscores the fragility hidden within iconic status. The rose stands as Master Reference Model for the Western hemisphere within the AquaMundi flower system.",
    cultural: "The rose is the official national floral emblem of the United States (1986). It has been a global symbol of love, beauty, passion, and remembrance for over 5,000 years — from ancient Rome and Greek mythology, to the heraldic Wars of the Roses, to the rose gardens of the White House.",
    conservation: "While cultivated roses thrive globally, native wild rosa species in the US face threats from Rose Rosette Disease, habitat loss, and climate change. Nahiara Measure: 23 / 25 (Living EcoRoot).",
    nahiaraMeasureLabel: "23 / 25 (Living EcoRoot)",
  },
  {
    id: "ES_CARNATION",
    commonName: "Carnation",
    scientificName: "Dianthus caryophyllus L.",
    country: "España (Spain)",
    countryCode: "ES",
    translationKey: "spainCarnation",
    glbPath: createGLBPath("Espana", "Carnation"),
    sanCode: computeSANCode("Dianthus caryophyllus L.", "F"),
    botanicalFamily: "Caryophyllaceae",
    morphology: "Wide chromatic range (white, pink, red, yellow), highly fragrant flowers with toothed petals and a height of 40‑80 cm.",
    habitat: "Ornamental crops and Mediterranean gardens; native to the Mediterranean basin and widely cultivated in Spain.",
    distribution: "Widely cultivated across the Mediterranean, with significant commercial production in Spain, Italy, and Colombia.",
    historicalOrigin: "Cultivated for over 2,000 years, carnations were revered by ancient Greeks and Romans, who used them in garlands and ceremonies. Its scientific name 'Dianthus' means 'flower of the gods'. It became a symbol of Spanish royalty in the 16th century and is deeply intertwined with Spanish culture, especially flamenco.",
    nationalStatus: "Unofficial national flower of Spain, deeply embedded in cultural identity.",
    traditionalUses: "Ornamental horticulture, floristry, traditional medicine (mild anti-inflammatory properties), perfumery, and culinary decoration.",
    conservationStatus: "Cultivated varieties: Not Evaluated (NE). Wild species: Some wild populations in the Mediterranean are vulnerable due to habitat loss.",
    mainThreats: "Habitat degradation for wild species, susceptibility to fungal diseases (e.g., Fusarium wilt) in intensive cultivation, and climate change impacting water availability in Mediterranean regions.",
    pfnoClassification: "Cultural Emblem",
    relevantPollinator: "Bees (Apis mellifera, Bombus spp.) and butterflies are attracted to its nectar-rich flowers.",
    nahiaraMeasure: {
      total: 19,
      max: 25,
      rank: 10,
      status: "Stable",
      latidoFloral: 4,
      memoriaCultural: 5,
      vozPublica: 4,
      escudoProteccion: 3,
      petaloEsperanza: 3,
    },
    araihanScore: 19,
    scorfidon: {
      climateChange: { code: "SCF-006", threat: "Climate Change", impact: -2, description: "Increased drought and heatwaves in the Mediterranean threaten wild carnation populations and impact cultivation.", guardian: "Water Conservation", guardianPower: 2 },
      habitatLoss: { code: "SCF-007", threat: "Habitat Loss", impact: -2, description: "Urbanization and agricultural expansion reduce natural habitats for wild Dianthus caryophyllus.", guardian: "Protected Areas", guardianPower: 2 },
      disease: { code: "SCF-008", threat: "Disease Outbreaks", impact: -1, description: "Fungal diseases like Fusarium wilt can devastate commercial crops and spread to wild populations.", guardian: "Biosecurity", guardianPower: 1 },
      exploitation: { code: "SCF-009", threat: "Commercial Exploitation", impact: -1, description: "Intensive cultivation practices can lead to soil degradation and reliance on chemical inputs.", guardian: "Sustainable Farming", guardianPower: 1 },
      ignorance: { code: "SCF-010", threat: "Ignorance", impact: -1, description: "Lack of awareness regarding the ecological role of wild carnations and their genetic diversity.", guardian: "Education", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Carnation, SAN-F-083,004, holds a Nahiara Measure of 19/25 (Stable), reflecting its deep cultural roots in Spain. While not officially designated, its presence in Spanish art, music, and festivals makes it an undeniable national symbol. Threats include climate change and habitat loss for wild varieties, balanced by strong cultural recognition.",
    cultural: "The Carnation symbolizes true love, passion and resilience. Since the 16th century it has been linked to Spanish royalty and today is inseparable from flamenco, popular festivities and Mediterranean identity.",
    conservation: "Although not an official national flower, its cultural weight and extensive cultivation give it a stable Nahiara Measure (19/25), with strong cultural protection but exposure to climate and habitat-loss threats.",
    nahiaraMeasureLabel: "19 / 25 (Stable)",
  },
  {
    id: "IN_LOTUS",
    commonName: "Lotus",
    scientificName: "Nelumbo nucifera",
    country: "India",
    countryCode: "IN",
    translationKey: "indiaLotus",
    glbPath: createGLBPath("India", "Lotus"),
    sanCode: computeSANCode("Nelumbo nucifera", "F"),
    botanicalFamily: "Nelumbonaceae",
    morphology: "Large, fragrant pink or white flowers with broad, floating leaves. Aquatic perennial plant that can live for over 1,000 years.",
    habitat: "Ponds, lakes, and slow-moving rivers throughout India and Southeast Asia.",
    distribution: "Native to tropical Asia and Queensland, Australia. Widely cultivated in India, China, Japan, and Southeast Asian countries.",
    historicalOrigin: "The lotus has been revered for millennia in Eastern cultures, particularly in Hinduism and Buddhism, symbolizing purity, beauty, and spiritual enlightenment. Ancient texts and art depict its significance in creation myths and religious rituals.",
    nationalStatus: "National flower of India since 1950.",
    traditionalUses: "Culinary (seeds, rhizomes, leaves), traditional medicine (Ayurveda, Chinese medicine), religious offerings, ornamental ponds, and textile fibers.",
    conservationStatus: "Least Concern (LC) globally due to widespread cultivation, but wild populations face localized threats.",
    mainThreats: "Habitat degradation from pollution (eutrophication), invasive species, and loss of wetlands due to urbanization and agriculture.",
    pfnoClassification: "National Floral Emblem & Sacred Plant",
    relevantPollinator: "Bees (Apis spp.), beetles, and other insects are attracted to its large, showy flowers.",
    nahiaraMeasure: {
      total: 22,
      max: 25,
      rank: 7,
      status: "Stable EcoRoot",
      latidoFloral: 4,
      memoriaCultural: 5,
      vozPublica: 5,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 22,
    scorfidon: {
      pollution: { code: "SCF-011", threat: "Water Pollution", impact: -3, description: "Eutrophication and chemical runoff severely degrade aquatic habitats essential for lotus growth.", guardian: "Clean Water Initiatives", guardianPower: 3 },
      habitatLoss: { code: "SCF-012", threat: "Wetland Loss", impact: -2, description: "Conversion of wetlands for agriculture and urban development reduces natural lotus habitats.", guardian: "Wetland Restoration", guardianPower: 2 },
      invasiveSpecies: { code: "SCF-013", threat: "Invasive Species", impact: -1, description: "Competition from invasive aquatic plants can outcompete native lotus populations.", guardian: "Ecosystem Management", guardianPower: 1 },
      climateChange: { code: "SCF-014", threat: "Climate Change", impact: -1, description: "Changes in rainfall patterns and water levels can disrupt lotus growth cycles.", guardian: "Climate Adaptation", guardianPower: 1 },
      overharvesting: { code: "SCF-015", threat: "Overharvesting", impact: -1, description: "Unsustainable harvesting of rhizomes and seeds can impact wild populations.", guardian: "Sustainable Practices", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Lotus, SAN-F-083,005, with a Nahiara Measure of 22/25 (Stable EcoRoot), is India's national flower and a profound cultural icon. Its resilience in muddy waters symbolizes purity and spiritual awakening. While widely cultivated, wild populations face threats from water pollution and wetland loss, necessitating conservation efforts.",
    cultural: "Sacred in Hinduism and Buddhism, the lotus represents divine beauty, purity, and spiritual awakening. It rises from muddy waters to bloom magnificently, symbolizing the journey from darkness to light.",
    conservation: "The lotus is India's national flower with strong cultural and religious significance. Nahiara Measure: 22 / 25 (Stable EcoRoot).",
    nahiaraMeasureLabel: "22 / 25 (Stable EcoRoot)",
  },
  {
    id: "PK_JASMINE",
    commonName: "Jasmine",
    scientificName: "Jasminum officinale",
    country: "Pakistan",
    countryCode: "PK",
    translationKey: "pakistanJasmine",
    glbPath: createGLBPath("Pakistan", "Jasmine"),
    sanCode: computeSANCode("Jasminum officinale", "F"),
    botanicalFamily: "Oleaceae",
    morphology: "Small, white, star-shaped flowers with a sweet, intoxicating fragrance. Climbing or trailing shrub.",
    habitat: "Gardens, parks, and cultivated areas throughout Pakistan and South Asia.",
    distribution: "Native to the Caucasus, northern Iran, Afghanistan, Pakistan, the Himalayas, Tajikistan, and China. Widely cultivated globally.",
    historicalOrigin: "Jasmine has a long history in South Asia, revered for its fragrance and beauty. It's mentioned in ancient Persian and Indian texts and has been used in perfumes, religious ceremonies, and traditional medicine for centuries. It became Pakistan's national flower in 1961.",
    nationalStatus: "National flower of Pakistan since 1961.",
    traditionalUses: "Perfumery (essential oil), traditional medicine (anti-inflammatory, antiseptic), religious offerings, tea flavoring, and ornamental gardening.",
    conservationStatus: "Least Concern (LC) due to widespread cultivation, but some wild populations may face localized threats.",
    mainThreats: "Habitat loss for wild species, unsustainable harvesting for essential oil production, and susceptibility to pests and diseases in cultivation.",
    pfnoClassification: "National Floral Emblem & Cultural Symbol",
    relevantPollinator: "Moths (especially hawk-moths) and bees are attracted to its strong night-time fragrance.",
    nahiaraMeasure: {
      total: 20,
      max: 25,
      rank: 9,
      status: "Stable",
      latidoFloral: 4,
      memoriaCultural: 5,
      vozPublica: 4,
      escudoProteccion: 3,
      petaloEsperanza: 4,
    },
    araihanScore: 20,
    scorfidon: {
      habitatLoss: { code: "SCF-016", threat: "Habitat Loss", impact: -1, description: "Urbanization and agricultural expansion reduce natural habitats for wild jasmine species.", guardian: "Habitat Protection", guardianPower: 1 },
      overharvesting: { code: "SCF-017", threat: "Overharvesting", impact: -2, description: "Intensive harvesting for essential oil production can deplete wild populations.", guardian: "Sustainable Sourcing", guardianPower: 2 },
      pestsDiseases: { code: "SCF-018", threat: "Pests & Diseases", impact: -1, description: "Cultivated jasmine is susceptible to various pests and fungal diseases.", guardian: "Integrated Pest Management", guardianPower: 1 },
      climateChange: { code: "SCF-019", threat: "Climate Change", impact: -1, description: "Changes in temperature and rainfall patterns can affect jasmine growth and flowering.", guardian: "Climate Resilience", guardianPower: 1 },
      ignorance: { code: "SCF-020", threat: "Ignorance", impact: -1, description: "Lack of public awareness about the ecological importance of native jasmine varieties.", guardian: "Botanical Education", guardianPower: 1 },
    },
    nahiaraSynthesis: "Jasmine, SAN-F-083,006, Pakistan's national flower, scores 20/25 (Stable) on the Nahiara Measure. Its intoxicating fragrance and cultural significance make it a cherished symbol of purity and grace. While widely cultivated, threats like habitat loss for wild species and unsustainable harvesting require attention to maintain its ecological and cultural vitality.",
    cultural: "Jasmine holds a special place in Pakistani culture, often used in religious ceremonies and traditional celebrations. It symbolizes purity, grace, beauty, and spiritual purity.",
    conservation: "The jasmine is Pakistan's national flower with strong cultural protection. Nahiara Measure: 20 / 25 (Stable).",
    nahiaraMeasureLabel: "20 / 25 (Stable)",
  },
  {
    id: "PE_CANTUTA",
    commonName: "Cantuta",
    scientificName: "Cantua buxifolia",
    country: "Peru",
    countryCode: "PE",
    translationKey: "peruCantuta",
    glbPath: createGLBPath("Peru", "Cantuta"),
    sanCode: computeSANCode("Cantua buxifolia", "F"),
    botanicalFamily: "Polemoniaceae",
    morphology: "Tubular flowers in shades of red, pink, and yellow. Shrub or small tree native to the Andes.",
    habitat: "High-altitude Andean regions, between 2,000 and 3,500 meters above sea level.",
    distribution: "Native to the Andes mountains of Peru and Bolivia. Found in dry, rocky slopes and inter-Andean valleys.",
    historicalOrigin: "The Cantuta was a sacred flower to the Incas, symbolizing the sun god Inti and the Inca empire. It was used in religious ceremonies and adorned temples and palaces. Its vibrant colors are often associated with the Inca flag.",
    nationalStatus: "National flower of Peru (and Bolivia).",
    traditionalUses: "Ornamental plant, traditional medicine (anti-inflammatory, diuretic), natural dye, and ceremonial decoration.",
    conservationStatus: "Near Threatened (NT) in some regions due to habitat degradation and overcollection.",
    mainThreats: "Habitat loss from agricultural expansion and urbanization, overcollection for ornamental purposes, and climate change impacting high-altitude ecosystems.",
    pfnoClassification: "National Floral Emblem & Sacred Inca Flower",
    relevantPollinator: "Hummingbirds are primary pollinators, attracted to its tubular, nectar-rich flowers.",
    nahiaraMeasure: {
      total: 21,
      max: 25,
      rank: 8,
      status: "Stable",
      latidoFloral: 4,
      memoriaCultural: 5,
      vozPublica: 4,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 21,
    scorfidon: {
      habitatLoss: { code: "SCF-021", threat: "Habitat Loss", impact: -2, description: "Agricultural expansion and urban development in the Andes reduce cantuta's natural habitat.", guardian: "Andean Conservation", guardianPower: 2 },
      overcollection: { code: "SCF-022", threat: "Overcollection", impact: -1, description: "Unsustainable harvesting for ornamental trade and traditional uses impacts wild populations.", guardian: "Sustainable Harvesting", guardianPower: 1 },
      climateChange: { code: "SCF-023", threat: "Climate Change", impact: -2, description: "Changes in temperature and precipitation patterns in high-altitude ecosystems threaten cantuta's survival.", guardian: "Highland Adaptation", guardianPower: 2 },
      ignorance: { code: "SCF-024", threat: "Ignorance", impact: -1, description: "Lack of awareness about the conservation status and ecological importance of wild cantuta.", guardian: "Community Education", guardianPower: 1 },
      deforestation: { code: "SCF-025", threat: "Deforestation", impact: -1, description: "Loss of native Andean forests impacts the microclimates and soil stability needed for cantuta.", guardian: "Reforestation", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Cantuta, SAN-F-083,007, Peru's national flower, achieves a Nahiara Measure of 21/25 (Stable). As a sacred Inca flower, it embodies the resilience and beauty of the Andean people. Despite its cultural significance, it faces threats from habitat loss and climate change in its high-altitude environment, requiring focused conservation efforts.",
    cultural: "The cantuta is Peru's national flower, symbolizing the beauty and resilience of the Andean people. It represents the connection between nature and culture in the highlands.",
    conservation: "The cantuta is Peru's national flower with strong cultural significance. Nahiara Measure: 21 / 25 (Stable).",
    nahiaraMeasureLabel: "21 / 25 (Stable)",
  },
  {
    id: "TZ_CLOVE",
    commonName: "Clove",
    scientificName: "Syzygium aromaticum",
    country: "Tanzania",
    countryCode: "TZ",
    translationKey: "tanzaniaClove",
    glbPath: createGLBPath("Tanzania", "Clove"),
    sanCode: computeSANCode("Syzygium aromaticum", "F"),
    botanicalFamily: "Myrtaceae",
    morphology: "Small, aromatic flower buds that are dried and used as a spice. Evergreen tree with glossy leaves.",
    habitat: "Tropical regions, particularly Zanzibar and Pemba islands in Tanzania.",
    distribution: "Native to the Maluku Islands (Indonesia). Widely cultivated in tropical regions, especially Tanzania (Zanzibar), Madagascar, and Indonesia.",
    historicalOrigin: "Cloves have been traded for over 2,000 years, originating from the Spice Islands. They were highly valued by ancient Romans, Chinese, and Arabs. Zanzibar became a global center for clove production in the 19th century, shaping its economy and culture.",
    nationalStatus: "Unofficial national flower of Tanzania, deeply tied to the history and economy of Zanzibar.",
    traditionalUses: "Spice (culinary), traditional medicine (analgesic, antiseptic), perfumery, and essential oil production.",
    conservationStatus: "Least Concern (LC) due to widespread cultivation, but wild populations are rare and potentially vulnerable.",
    mainThreats: "Price fluctuations in the global spice market, climate change impacting rainfall patterns, and pests/diseases in monoculture plantations.",
    pfnoClassification: "Economic & Cultural Keystone Species",
    relevantPollinator: "Bees and other insects are attracted to its small, white flowers.",
    nahiaraMeasure: {
      total: 19,
      max: 25,
      rank: 11,
      status: "Stable",
      latidoFloral: 4,
      memoriaCultural: 4,
      vozPublica: 4,
      escudoProteccion: 3,
      petaloEsperanza: 4,
    },
    araihanScore: 19,
    scorfidon: {
      marketVolatility: { code: "SCF-026", threat: "Market Volatility", impact: -2, description: "Fluctuating global prices for cloves can destabilize local economies and farmer livelihoods.", guardian: "Economic Diversification", guardianPower: 2 },
      climateChange: { code: "SCF-027", threat: "Climate Change", impact: -2, description: "Changes in rainfall and temperature patterns threaten clove tree health and yield.", guardian: "Climate-Smart Agriculture", guardianPower: 2 },
      pestsDiseases: { code: "SCF-028", threat: "Pests & Diseases", impact: -1, description: "Clove trees are susceptible to various pests and diseases, especially in monoculture.", guardian: "Integrated Pest Management", guardianPower: 1 },
      habitatLoss: { code: "SCF-029", threat: "Habitat Loss", impact: -1, description: "Expansion of other crops or infrastructure can reduce suitable land for clove cultivation.", guardian: "Sustainable Land Use", guardianPower: 1 },
      ignorance: { code: "SCF-030", threat: "Ignorance", impact: -1, description: "Lack of awareness about sustainable farming practices and the long-term health of clove ecosystems.", guardian: "Farmer Education", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Clove, SAN-F-083,008, with a Nahiara Measure of 19/25 (Stable), is a vital part of Tanzania's heritage, particularly Zanzibar. Its economic and cultural importance as a spice is immense. However, it faces challenges from market volatility and climate change, highlighting the need for sustainable agricultural practices and economic diversification.",
    cultural: "The clove is Tanzania's national flower, symbolizing the country's rich spice heritage and natural abundance. It represents the connection between people and the land.",
    conservation: "The clove is Tanzania's national flower with economic and cultural importance. Nahiara Measure: 19 / 25 (Stable).",
    nahiaraMeasureLabel: "19 / 25 (Stable)",
  },
  {
    id: "NI_SACUANJOCHE",
    commonName: "Sacuanjoche",
    scientificName: "Plumeria rubra",
    country: "Nicaragua",
    countryCode: "NI",
    translationKey: "nicaraguaSacuanjoche",
    glbPath: createGLBPath("Nicaragua", "Sacuanjoche"),
    sanCode: computeSANCode("Plumeria rubra", "F"),
    botanicalFamily: "Apocynaceae",
    morphology: "Fragrant, waxy flowers in white, pink, yellow, or red. Deciduous tree with thick, succulent branches.",
    habitat: "Tropical and subtropical regions, gardens, and coastal areas throughout Central America.",
    distribution: "Native to Mexico, Central America, and Venezuela. Widely cultivated in tropical and subtropical regions worldwide.",
    historicalOrigin: "The Sacuanjoche has been cherished in Central America for centuries, often associated with indigenous cultures and their spiritual beliefs. Its beauty and fragrance made it a popular ornamental plant, and it was officially declared Nicaragua's national flower in 1971.",
    nationalStatus: "National flower of Nicaragua since 1971.",
    traditionalUses: "Ornamental plant, traditional medicine (latex used for skin conditions), perfumery, and ceremonial decoration.",
    conservationStatus: "Least Concern (LC) due to widespread cultivation, but wild populations may face localized threats.",
    mainThreats: "Habitat loss from deforestation and agricultural expansion, susceptibility to rust fungus (Coleosporium plumeriae), and climate change impacting tropical ecosystems.",
    pfnoClassification: "National Floral Emblem & Tropical Icon",
    relevantPollinator: "Moths (especially hawk-moths) are attracted to its strong night-time fragrance, though it offers no nectar.",
    nahiaraMeasure: {
      total: 20,
      max: 25,
      rank: 12,
      status: "Stable",
      latidoFloral: 4,
      memoriaCultural: 4,
      vozPublica: 4,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 20,
    scorfidon: {
      habitatLoss: { code: "SCF-031", threat: "Habitat Loss", impact: -2, description: "Deforestation and agricultural expansion in Central America reduce natural habitats for wild Plumeria rubra.", guardian: "Forest Protection", guardianPower: 2 },
      disease: { code: "SCF-032", threat: "Rust Fungus", impact: -1, description: "Plumeria rust fungus can severely defoliate trees, impacting their health and aesthetic value.", guardian: "Disease Management", guardianPower: 1 },
      climateChange: { code: "SCF-033", threat: "Climate Change", impact: -1, description: "Changes in temperature and rainfall patterns can affect sacuanjoche growth and flowering.", guardian: "Climate Adaptation", guardianPower: 1 },
      ignorance: { code: "SCF-034", threat: "Ignorance", impact: -1, description: "Lack of public awareness about the ecological role of native Plumeria species and their conservation needs.", guardian: "Environmental Education", guardianPower: 1 },
      exploitation: { code: "SCF-035", threat: "Unsustainable Harvesting", impact: -1, description: "Over-collection of wild specimens for ornamental trade can deplete local populations.", guardian: "Ethical Sourcing", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Sacuanjoche, SAN-F-083,009, Nicaragua's national flower, holds a Nahiara Measure of 20/25 (Stable). It symbolizes the country's tropical beauty and cultural richness. While widely cultivated, wild populations face threats from habitat loss and diseases like rust fungus, emphasizing the need for conservation and sustainable practices.",
    cultural: "The sacuanjoche is Nicaragua's national flower, symbolizing beauty, grace, and spiritual enlightenment. It represents the country's tropical beauty and cultural richness.",
    conservation: "The sacuanjoche is Nicaragua's national flower with strong cultural significance. Nahiara Measure: 20 / 25 (Stable).",
    nahiaraMeasureLabel: "20 / 25 (Stable)",
  }, ,
  {
    id: "JM_LIGNUM_VITAE",
    commonName: "Lignum Vitae",
    scientificName: "Guaiacum officinale",
    country: "Jamaica",
    countryCode: "JM",
    translationKey: "jamaicaLignum",
    glbPath: createGLBPath("Jamaica", "LignumVitae"),
    sanCode: computeSANCode("Guaiacum officinale", "F"),
    botanicalFamily: "Zygophyllaceae",
    morphology: "Small, blue to purple flowers with five petals. Slow-growing evergreen tree with very hard wood.",
    habitat: "Dry coastal forests and limestone areas in the Caribbean, particularly Jamaica.",
    distribution: "Native to the Caribbean, including Jamaica, Cuba, Hispaniola, and Puerto Rico, and parts of northern South America.",
    historicalOrigin: "Known as the 'wood of life,' Lignum Vitae has been valued for centuries for its extremely dense and durable wood, used in shipbuilding and machinery. It was declared Jamaica's national flower in 1962, symbolizing the strength and resilience of the nation.",
    nationalStatus: "National flower of Jamaica since 1962.",
    traditionalUses: "Wood (shipbuilding, bearings, mallets), traditional medicine (anti-inflammatory, anti-rheumatic), and ornamental tree.",
    conservationStatus: "Critically Endangered (CR) due to overexploitation for its valuable timber.",
    mainThreats: "Illegal logging and overexploitation for its timber, habitat loss from coastal development, and slow growth rate making it vulnerable to harvesting pressure.",
    pfnoClassification: "National Floral Emblem & Critically Endangered Species",
    relevantPollinator: "Bees and other insects are attracted to its small, vibrant flowers.",
    nahiaraMeasure: {
      total: 18,
      max: 25,
      rank: 13,
      status: "Vulnerable",
      latidoFloral: 2,
      memoriaCultural: 4,
      vozPublica: 4,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 18,
    scorfidon: {
      overexploitation: { code: "SCF-036", threat: "Overexploitation (Logging)", impact: -5, description: "Illegal logging and unsustainable harvesting for its valuable timber have severely depleted populations.", guardian: "Anti-Poaching & Sustainable Forestry", guardianPower: 5 },
      habitatLoss: { code: "SCF-037", threat: "Habitat Loss", impact: -2, description: "Coastal development and land conversion reduce its dry forest habitats.", guardian: "Protected Areas & Reforestation", guardianPower: 2 },
      slowGrowth: { code: "SCF-038", threat: "Slow Growth Rate", impact: -1, description: "Its extremely slow growth makes it highly vulnerable to harvesting pressure and difficult to recover.", guardian: "Long-Term Conservation Planning", guardianPower: 1 },
      climateChange: { code: "SCF-039", threat: "Climate Change", impact: -1, description: "Changes in rainfall patterns and increased storm intensity can impact its coastal habitats.", guardian: "Coastal Resilience", guardianPower: 1 },
      ignorance: { code: "SCF-040", threat: "Ignorance", impact: -1, description: "Lack of public awareness about its critically endangered status and the importance of its protection.", guardian: "Public Awareness Campaigns", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Lignum Vitae, SAN-F-083,010, Jamaica's national flower, has a Nahiara Measure of 18/25 (Vulnerable). Symbolizing strength, it is critically endangered due to severe overexploitation for its timber and habitat loss. Urgent and robust conservation efforts, including anti-logging measures and reforestation, are essential for its survival.",
    cultural: "The lignum vitae is Jamaica's national flower, symbolizing strength, endurance, and the island's natural heritage.",
    conservation: "The lignum vitae is Jamaica's national flower. Nahiara Measure: 18 / 25 (Vulnerable).",
    nahiaraMeasureLabel: "18 / 25 (Vulnerable)",
  }, ,
  {
    id: "SC_THISTLE",
    commonName: "Thistle",
    scientificName: "Cirsium vulgare",
    country: "Escocia (Scotland)",
    countryCode: "GB-SCT",
    translationKey: "scotlandThistle",
    glbPath: createGLBPath("Escocia", "Thistle"),
    sanCode: computeSANCode("Cirsium vulgare", "F"),
    botanicalFamily: "Asteraceae",
    morphology: "Purple or pink flower heads with spiny leaves and stems. Biennial or perennial herb.",
    habitat: "Meadows, grasslands, and disturbed areas throughout Scotland and the British Isles.",
    distribution: "Native to Europe, Western Asia, and North Africa. Widely naturalized in other temperate regions, including North America and Australia.",
    historicalOrigin: "The thistle has been Scotland's national emblem for centuries, with a legend dating back to the 13th century where its prickles saved sleeping Scottish warriors from a Norse invasion. It symbolizes resilience, defiance, and protection.",
    nationalStatus: "National emblem of Scotland since the 15th century.",
    traditionalUses: "Traditional medicine (diuretic, liver support), culinary (young stems, roots), and a valuable nectar source for pollinators.",
    conservationStatus: "Least Concern (LC) due to its widespread and often weedy nature.",
    mainThreats: "While not endangered, intensive agriculture and herbicide use can reduce its presence in traditional habitats, impacting pollinator food sources.",
    pfnoClassification: "National Emblem & Resilient Pioneer",
    relevantPollinator: "Bees (Apis mellifera, Bombus spp.), butterflies, and other insects are highly attracted to its nectar-rich flowers.",
    nahiaraMeasure: {
      total: 20,
      max: 25,
      rank: 14,
      status: "Stable",
      latidoFloral: 4,
      memoriaCultural: 5,
      vozPublica: 4,
      escudoProteccion: 4,
      petaloEsperanza: 3,
    },
    araihanScore: 20,
    scorfidon: {
      habitatDegradation: { code: "SCF-041", threat: "Habitat Degradation", impact: -1, description: "Intensive agriculture and land management practices reduce suitable habitats for wild thistles.", guardian: "Biodiversity-Friendly Farming", guardianPower: 1 },
      herbicideUse: { code: "SCF-042", threat: "Herbicide Use", impact: -1, description: "Widespread use of herbicides in agricultural and urban areas negatively impacts thistle populations.", guardian: "Ecological Weed Management", guardianPower: 1 },
      climateChange: { code: "SCF-043", threat: "Climate Change", impact: -1, description: "Shifts in climate patterns could alter its distribution and competitive ability.", guardian: "Ecosystem Monitoring", guardianPower: 1 },
      ignorance: { code: "SCF-044", threat: "Ignorance", impact: -1, description: "Often viewed as a weed, its ecological value as a pollinator plant is underestimated.", guardian: "Pollinator Awareness", guardianPower: 1 },
      fragmentation: { code: "SCF-045", threat: "Habitat Fragmentation", impact: -1, description: "Disconnection of natural areas can limit gene flow and resilience of thistle populations.", guardian: "Ecological Corridors", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Thistle, SAN-F-083,011, Scotland's national emblem, scores 20/25 (Stable) on the Nahiara Measure. Its legendary role in Scottish history makes it a powerful symbol of resilience and protection. While generally robust, modern agricultural practices and herbicide use pose threats to its natural habitats and its role as a vital pollinator plant.",
    cultural: "The thistle is Scotland's national flower, symbolizing resilience, protection, and the Scottish spirit. According to legend, it helped defend Scotland from Norse invaders.",
    conservation: "The thistle is Scotland's national flower with strong cultural identity. Nahiara Measure: 20 / 25 (Stable).",
    nahiaraMeasureLabel: "20 / 25 (Stable)",
  }, ,
  {
    id: "DE_CORNFLOWER",
    commonName: "Cornflower",
    scientificName: "Centaurea cyanus",
    country: "Alemania (Germany)",
    countryCode: "DE",
    translationKey: "germanyCornflower",
    glbPath: createGLBPath("Alemania", "Cornflower"),
    sanCode: computeSANCode("Centaurea cyanus", "F"),
    botanicalFamily: "Asteraceae",
    morphology: "Bright blue flower heads with delicate, fringed petals. Annual herbaceous plant.",
    habitat: "Fields, meadows, and roadsides throughout Europe, particularly Germany.",
    distribution: "Native to Europe. Historically common in cornfields (hence 'cornflower'), now naturalized in many temperate regions.",
    historicalOrigin: "The cornflower gained prominence in Prussian culture, becoming a favorite of Queen Louise and later associated with Emperor Wilhelm I. It symbolized hope and resilience, especially during times of adversity. It is considered an unofficial national flower of Germany.",
    nationalStatus: "Unofficial national flower of Germany, with strong historical and cultural ties.",
    traditionalUses: "Ornamental plant, traditional medicine (anti-inflammatory, eye washes), natural dye, and culinary decoration.",
    conservationStatus: "Near Threatened (NT) in some parts of Europe due to agricultural intensification.",
    mainThreats: "Intensive agriculture, widespread use of herbicides, and habitat loss from modern farming practices.",
    pfnoClassification: "Cultural Symbol & Agricultural Indicator",
    relevantPollinator: "Bees (Apis mellifera, Bombus spp.) and butterflies are attracted to its nectar and pollen.",
    nahiaraMeasure: {
      total: 19,
      max: 25,
      rank: 15,
      status: "Vulnerable",
      latidoFloral: 3,
      memoriaCultural: 4,
      vozPublica: 4,
      escudoProteccion: 4,
      petaloEsperanza: 4,
    },
    araihanScore: 19,
    scorfidon: {
      agriculturalIntensification: { code: "SCF-046", threat: "Agricultural Intensification", impact: -4, description: "Modern farming practices, including monoculture and deep plowing, destroy its traditional habitat.", guardian: "Agroecology", guardianPower: 4 },
      herbicideUse: { code: "SCF-047", threat: "Herbicide Use", impact: -3, description: "Widespread use of broad-spectrum herbicides eliminates cornflowers from fields.", guardian: "Sustainable Agriculture", guardianPower: 3 },
      habitatLoss: { code: "SCF-048", threat: "Habitat Loss", impact: -2, description: "Loss of traditional field margins and meadows due to land consolidation.", guardian: "Biodiversity Corridors", guardianPower: 2 },
      climateChange: { code: "SCF-049", threat: "Climate Change", impact: -1, description: "Changes in temperature and rainfall patterns can affect its germination and growth cycles.", guardian: "Climate Adaptation", guardianPower: 1 },
      ignorance: { code: "SCF-050", threat: "Ignorance", impact: -1, description: "Often seen as a weed, its ecological importance as a pollinator plant and cultural symbol is overlooked.", guardian: "Public Awareness", guardianPower: 1 },
    },
    nahiaraSynthesis: "The Cornflower, SAN-F-083,012, an unofficial national flower of Germany, holds a Nahiara Measure of 19/25 (Vulnerable). Its delicate blue petals symbolize simplicity and resilience. However, intensive agriculture and herbicide use have severely impacted its populations, highlighting the urgent need for biodiversity-friendly farming practices to protect this cultural and ecological gem.",
    cultural: "The cornflower is Germany's national flower, symbolizing simplicity, modesty, and the German countryside. It was historically associated with Prussian culture.",
    conservation: "The cornflower is Germany's national flower. Nahiara Measure: 19 / 25 (Vulnerable).",
    nahiaraMeasureLabel: "19 / 25 (Vulnerable)",
  },
];

const BACKGROUND_HEX = "#E8E6DF";
const VIEW_OPTION = {
  id: "side",
  label: "Side View",
  camera: { position: [0, 1.5, 3], lookAt: [0, 0, 0] },
  controls: {
    minPolar: Math.PI / 3.2,
    maxPolar: Math.PI / 1.8,
    autoRotate: true,
    autoRotateSpeed: 0.8,
  },
};

// Criteria cards data with translation keys
const getCriteriaCards = (t) => [
  {
    icon: Heart,
    title: t('flowers.criteriaTitle1'),
    description: t('flowers.criteriaText1'),
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    delay: 0,
  },
  {
    icon: Flower2,
    title: t('flowers.criteriaTitle2'),
    description: t('flowers.criteriaText2'),
    gradient: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    delay: 0.1,
  },
  {
    icon: Shield,
    title: t('flowers.criteriaTitle3'),
    description: t('flowers.criteriaText3'),
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    delay: 0.2,
  },
];

// Selection points data with translation keys
const getSelectionPoints = (t) => [
  {
    icon: Search,
    text: t('flowers.selectionPoint1'),
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    text: t('flowers.selectionPoint2'),
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Layers,
    text: t('flowers.selectionPoint3'),
    gradient: "from-violet-500 to-pink-500",
  },
  {
    icon: Sprout,
    text: t('flowers.selectionPoint4'),
    gradient: "from-green-500 to-emerald-500",
  },
];

// Floating floral decoration component
const FloralDecoration = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1, ease: "easeOut" }}
  >
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(147, 197, 253, 0.3)" />
          <stop offset="50%" stopColor="rgba(196, 181, 253, 0.2)" />
          <stop offset="100%" stopColor="rgba(249, 168, 212, 0.3)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#glow)" className="animate-float">
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(0 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(72 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(144 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(216 60 60)" />
        <ellipse cx="60" cy="30" rx="12" ry="25" fill="url(#petalGradient)" transform="rotate(288 60 60)" />
        <circle cx="60" cy="60" r="8" fill="rgba(251, 191, 36, 0.4)" />
      </g>
    </svg>
  </motion.div>
);

// Glowing orb decoration
const GlowingOrb = ({ className, color = "blue", delay = 0, size = "md" }) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-96 h-96",
  };

  const colorClasses = {
    blue: "from-blue-400/20 via-indigo-300/10 to-transparent",
    purple: "from-purple-400/20 via-violet-300/10 to-transparent",
    pink: "from-pink-400/20 via-rose-300/10 to-transparent",
    teal: "from-teal-400/20 via-cyan-300/10 to-transparent",
    emerald: "from-emerald-400/20 via-green-300/10 to-transparent",
    rainbow: "from-blue-400/15 via-purple-400/15 to-pink-400/15",
  };

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial ${colorClasses[color]} ${sizeClasses[size]} blur-3xl pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.5, ease: "easeOut" }}
    />
  );
};

// Flower 3D Model Viewer Component
function Flower3DViewer({ flower, t, isActive = false }) {
  const flowerCanvasRef = useRef(null);
  const [isFlowerLoaded, setIsFlowerLoaded] = useState(false);
  const [flowerError, setFlowerError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Translation helper — uses the same pattern as Globe.js:
  // countries.<translationKey>.<fieldName>, fallback to raw flower data
  const tField = (fieldName, fallback) => {
    if (!flower.translationKey) return fallback;
    const key = `countries.${flower.translationKey}.${fieldName}`;
    const translated = t(key);
    // If next-intl returns the key itself (untranslated), fall back to English data
    if (!translated || translated === key) return fallback;
    // Some locale files store rich objects (e.g., morphology breakdown).
    // This view expects plain text, so keep fallback string to avoid React child errors.
    if (typeof translated === "object") return fallback;
    return translated;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Three.js loader for flower GLB model - lazy load when slide becomes active
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted || !isActive || !flower.glbPath) return;

    let renderer;
    let camera;
    let animationId;
    const cleanupFns = [];

    setIsFlowerLoaded(false);
    setFlowerError(null);

    const loadModel = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { DRACOLoader } = await import(
          "three/examples/jsm/loaders/DRACOLoader.js"
        );
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );

        const container = flowerCanvasRef.current;
        if (!container) {
          console.warn("Canvas container not found");
          return;
        }

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(BACKGROUND_HEX);

        const viewSettings = VIEW_OPTION;

        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );
        camera.position.set(...viewSettings.camera.position);
        camera.lookAt(
          viewSettings.camera.lookAt[0],
          viewSettings.camera.lookAt[1],
          viewSettings.camera.lookAt[2]
        );

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);
        cleanupFns.push(() => {
          renderer?.domElement?.parentNode?.removeChild(renderer.domElement);
          renderer?.dispose();
        });

        const neutralKey = new THREE.DirectionalLight(0xffffff, 2.5);
        neutralKey.position.set(5, 8, 5);
        neutralKey.castShadow = true;
        neutralKey.shadow.bias = -0.0001;
        neutralKey.shadow.mapSize.width = 1024;
        neutralKey.shadow.mapSize.height = 1024;
        scene.add(neutralKey);

        const warmFill = new THREE.DirectionalLight(0xfff1d6, 1.5);
        warmFill.position.set(-5, 3, -5);
        scene.add(warmFill);

        const coolRim = new THREE.DirectionalLight(0xd8ecff, 1.5);
        coolRim.position.set(0, 5, -8);
        scene.add(coolRim);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const groundGeo = new THREE.PlaneGeometry(20, 20);
        const groundMat = new THREE.ShadowMaterial({
          opacity: 0.18,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
        );
        dracoLoader.setDecoderConfig({ type: "js" });

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.setCrossOrigin("anonymous");
        loader.load(
          flower.glbPath,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                if (node.material) {
                  node.material.needsUpdate = true;
                }
              }
            });

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetHeight = 1.8;
            const scale = targetHeight / maxDim;
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));

            scene.add(model);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.autoRotate = viewSettings.controls.autoRotate ?? true;
            controls.autoRotateSpeed =
              viewSettings.controls.autoRotateSpeed ?? 0.8;
            controls.minPolarAngle = viewSettings.controls.minPolar;
            controls.maxPolarAngle = viewSettings.controls.maxPolar;
            controls.enablePan = false;
            cleanupFns.push(() => controls.dispose());

            const animate = () => {
              animationId = requestAnimationFrame(animate);
              controls.update();
              renderer.render(scene, camera);
            };
            animate();
            cleanupFns.push(() => cancelAnimationFrame(animationId));

            const handleResize = () => {
              if (!container) return;
              camera.aspect = container.clientWidth / container.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(container.clientWidth, container.clientHeight);
            };

            window.addEventListener("resize", handleResize);
            setIsFlowerLoaded(true);
            cleanupFns.push(() =>
              window.removeEventListener("resize", handleResize)
            );
          },
          undefined,
          (error) => {
            console.error("GLB load error", error);
            setFlowerError("Failed to load 3D model.");
            setIsFlowerLoaded(false);
          }
        );
      } catch (err) {
        console.error("Three.js setup error", err);
        setFlowerError("Three.js could not initialize.");
        setIsFlowerLoaded(false);
      }
    };

    loadModel();

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isMounted, isActive, flower.glbPath]);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-white/70 backdrop-blur-xl rounded-3xl">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/20 via-rose-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2
              className="text-3xl lg:text-4xl font-bold text-gray-900"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {flower.commonName}
            </h2>
            <p className="text-sm text-gray-600 italic">
              <em>{flower.scientificName}</em>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {flower.country}
            </p>
          </div>
        </div>

        {/* 3D Viewer */}
        {flower.glbPath && (
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden isolate mb-6">
            <div ref={flowerCanvasRef} className="w-full h-full gpu-accelerated" />
            {!isFlowerLoaded && !flowerError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="w-10 h-10 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-sm text-gray-500">
                  {t('common.loading') || "Loading 3D model..."}
                </span>
              </div>
            )}
            {flowerError && (
              <div className="absolute inset-0 grid place-content-center bg-red-50 text-red-500 text-sm font-medium text-center px-4">
                {flowerError}
              </div>
            )}
          </div>
        )}

        {/* Flower Information */}
        <div className="space-y-6">
          {/* 1. Botanical Data */}
          <div className="bg-rose-50/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
              {t('flowers.botanicalData') || "1. BOTANICAL DATA"}
            </h3>
            <div className="grid gap-3 text-sm">
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                <div className="text-[11px] font-semibold text-rose-700 uppercase mb-1">
                  {t('flowers.scientificName') || "Scientific name"}
                </div>
                <div className="text-gray-800">
                  <em>{flower.scientificName}</em>
                </div>
              </div>
              <div className="bg-white/80 rounded-lg px-3 py-2 border-l-4 border-rose-500">
                <div className="text-[11px] font-semibold text-rose-700 uppercase mb-1">
                  {t('flowers.botanicalFamily') || "Botanical family"}
                </div>
                <div className="text-gray-800">{flower.botanicalFamily}</div>
              </div>
              <div className="text-xs text-gray-700 space-y-1 mt-3">
                <p>
                  <span className="font-semibold">
                    {t('flowers.basicMorphology') || "Basic morphology:"}
                  </span>{" "}
                  {tField('morphology', flower.morphology)}
                </p>
                <p>
                  <span className="font-semibold">
                    {t('flowers.habitatDistribution') || "Habitat & distribution:"}
                  </span>{" "}
                  {tField('habitat', flower.habitat)}
                </p>
                {flower.distribution && (
                  <p className="text-gray-600 italic">{tField('distribution', flower.distribution)}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Cultural & Historical Data */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
              2. CULTURAL &amp; HISTORICAL DATA
            </h3>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">
              {tField('cultural', flower.cultural)}
            </p>
            {flower.historicalOrigin && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-3">
                <span className="text-xs font-bold text-purple-700 uppercase block mb-1">📖 Historical Origin</span>
                <p className="text-sm text-gray-700 leading-relaxed">{tField('historicalOrigin', flower.historicalOrigin)}</p>
              </div>
            )}
            {(flower.nationalStatus || flower.traditionalUses) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {flower.nationalStatus && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-1">National Status</span>
                    <span className="text-sm text-gray-800">{tField('nationalStatus', flower.nationalStatus)}</span>
                  </div>
                )}
                {flower.traditionalUses && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Traditional Uses</span>
                    <span className="text-sm text-gray-800">{tField('traditionalUses', flower.traditionalUses)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Conservation Data */}
          {(flower.conservationStatus || flower.mainThreats) && (
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-blue-700 mb-4">3. CONSERVATION DATA</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flower.conservationStatus && (
                  <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
                    <span className="text-xs font-bold text-blue-700 uppercase block mb-1">🌍 IUCN Status</span>
                    <span className="text-sm text-gray-800 font-medium">{tField('conservationStatus', flower.conservationStatus)}</span>
                  </div>
                )}
                {flower.mainThreats && (
                  <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
                    <span className="text-xs font-bold text-blue-700 uppercase block mb-1">⚠️ Main Threats</span>
                    <span className="text-sm text-gray-700">{tField('mainThreats', flower.mainThreats)}</span>
                  </div>
                )}
                <p className="text-gray-800 text-sm leading-relaxed col-span-2">{tField('conservation', flower.conservation)}</p>
              </div>
            </div>
          )}

          {/* 4. Nahiara Metadata */}
          {(flower.pfnoClassification || flower.nahiaraMeasure) && (
            <div className="bg-violet-50/80 backdrop-blur-sm rounded-2xl p-6 border border-violet-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-violet-700 mb-4">4. NAHIARA METADATA</h3>
              {/* SAN Code */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 text-center mb-4">
                <div className="text-2xl font-bold text-violet-800 font-mono tracking-wider mb-1">{flower.sanCode}</div>
                <div className="text-xs text-violet-500">Assigned S.A.N. Code</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flower.pfnoClassification && (
                  <div className="bg-white/80 rounded-lg p-3 border border-violet-100">
                    <span className="text-xs font-bold text-violet-700 uppercase block mb-1">PFNO Classification</span>
                    <span className="text-sm text-gray-800 font-medium">{tField('pfnoClassification', flower.pfnoClassification)}</span>
                  </div>
                )}
                {flower.relevantPollinator && (
                  <div className="bg-white/80 rounded-lg p-3 border border-violet-100">
                    <span className="text-xs font-bold text-violet-700 uppercase block mb-1">🐝 Relevant Pollinator</span>
                    <span className="text-sm text-gray-700">{tField('relevantPollinator', flower.relevantPollinator)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Nahiara Measure */}
          {flower.nahiaraMeasure && typeof flower.nahiaraMeasure === 'object' && (
            <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-4">5. NAHIARA MEASURE</h3>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100 text-center mb-4">
                <div className="text-4xl font-bold text-amber-700 mb-1">
                  {flower.nahiaraMeasure.total}/{flower.nahiaraMeasure.max}
                </div>
                <div className="text-sm text-amber-600 font-medium">
                  {flower.nahiaraMeasure.status}
                  {flower.nahiaraMeasure.rank && ` · Rank #${flower.nahiaraMeasure.rank} globally`}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Floral Heartbeat (Population)", value: flower.nahiaraMeasure.latidoFloral, color: "bg-green-500" },
                  { label: "Cultural Memory", value: flower.nahiaraMeasure.memoriaCultural, color: "bg-purple-500" },
                  { label: "Public Voice", value: flower.nahiaraMeasure.vozPublica, color: "bg-blue-500" },
                  { label: "Protection Shield", value: flower.nahiaraMeasure.escudoProteccion, color: "bg-amber-500" },
                  { label: "Petal of Hope", value: flower.nahiaraMeasure.petaloEsperanza, color: "bg-rose-500" },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600 font-medium">{dim.label}</span>
                      <span className="text-xs font-bold text-gray-800">{dim.value}/5</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className={`${dim.color} h-2.5 rounded-full`} style={{ width: `${(dim.value / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Scorfidon Protocol */}
          {flower.scorfidon && (
            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-red-700 mb-2">6. SCORFIDON PROTOCOL</h3>
              <p className="text-xs text-gray-500 italic mb-4">Threats and their guardians — the balance between destruction and restoration.</p>
              <div className="space-y-3">
                {Object.values(flower.scorfidon).map((entry) => (
                  <div key={entry.code} className="bg-white/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">{entry.code}</span>
                        <span className="text-sm font-bold text-gray-800">{entry.threat}</span>
                      </div>
                      <span className="text-xs font-bold text-red-600">{entry.impact} petals</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{entry.description}</p>
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                      <span className="text-xs text-emerald-700">🛡️ {entry.guardian}</span>
                      <span className="text-xs font-bold text-emerald-600 ml-auto">+{entry.guardianPower} petals</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Araihan Measurement */}
          {flower.araihanScore && (
            <div className="bg-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-indigo-700 mb-4">7. ARAIHAN MEASUREMENT</h3>
              <div className="bg-white/80 rounded-xl p-5 border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-indigo-700 mb-1">{flower.araihanScore}</div>
                <div className="text-xs text-indigo-500">Araihan Score</div>
              </div>
            </div>
          )}

          {/* Nahiara Synthesis */}
          {flower.nahiaraSynthesis && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-green-700 mb-3">✅ NAHIARA SYNTHESIS</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{tField('nahiaraSynthesis', flower.nahiaraSynthesis)}</p>
            </div>
          )}

          {/* Fallback: basic cultural/SAN for simple flowers */}
          {!flower.nahiaraSynthesis && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
              <h3 className="text-sm uppercase tracking-[0.3em] text-rose-700 mb-4">
                {t('flowers.culturalSignificance') || "2-5. CULTURE, CONSERVATION & NAHIARA MEASURE"}
              </h3>
              <p className="text-gray-800 text-sm leading-relaxed mb-3">{tField('cultural', flower.cultural)}</p>
              <p className="text-gray-800 text-sm leading-relaxed">{tField('conservation', flower.conservation)}</p>
              <div className="mt-4 text-xs text-gray-600">
                <p><span className="font-mono font-semibold">S.A.N.:</span> {flower.sanCode}</p>
                <p>{t('flowers.nahiaraMeasure') || "Nahiara Measure:"} {flower.nahiaraMeasureLabel || flower.nahiaraMeasure}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlowersPage() {
  const { t, isLoading } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Get translated data
  const criteriaCards = getCriteriaCards(t);
  const selectionPoints = getSelectionPoints(t);

  // Filter flowers by SAN code, scientific name, or common name
  const filteredFlowers = useMemo(() => {
    if (!searchQuery.trim()) return null; // null = show swiper (no filtering)
    const q = searchQuery.toLowerCase().replace(/[,\s-]/g, "");
    return FLOWERS_DATA.filter((flower) => {
      const san = (flower.sanCode || "").toLowerCase().replace(/[,\s-]/g, "");
      const sci = (flower.scientificName || "").toLowerCase();
      const common = (flower.commonName || "").toLowerCase();
      const country = (flower.country || "").toLowerCase();
      return san.includes(q) || sci.includes(q) || common.includes(q) || country.includes(q);
    });
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <style jsx>{`
        .flowers-swiper .swiper-slide {
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .flowers-swiper .swiper-slide-active {
          opacity: 1;
        }
      `}</style>
      {/* Aurora-inspired background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main aurora gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(196, 181, 253, 0.35) 0%, transparent 50%),
              radial-gradient(ellipse 70% 50% at 50% 80%, rgba(249, 168, 212, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 10% 60%, rgba(167, 243, 208, 0.25) 0%, transparent 50%)
            `,
          }}
        />

        {/* Animated aurora streaks */}
        <div
          className="absolute inset-0 animate-aurora opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                100deg,
                rgba(59, 130, 246, 0.1) 10%,
                rgba(165, 180, 252, 0.1) 15%,
                rgba(147, 197, 253, 0.1) 20%,
                rgba(221, 214, 254, 0.1) 25%,
                rgba(96, 165, 250, 0.1) 30%
              )
            `,
            backgroundSize: '300% 200%',
          }}
        />
      </div>

      {/* Decorative elements */}
      <GlowingOrb className="top-20 -right-20" color="purple" delay={0.2} size="xl" />
      <GlowingOrb className="top-1/3 -left-32" color="blue" delay={0.4} size="lg" />
      <GlowingOrb className="bottom-1/4 right-10" color="pink" delay={0.6} size="md" />
      <GlowingOrb className="bottom-40 left-1/4" color="emerald" delay={0.8} size="lg" />

      <FloralDecoration className="top-32 right-20 opacity-60" delay={1} />
      <FloralDecoration className="top-1/2 left-10 opacity-40" delay={1.2} />
      <FloralDecoration className="bottom-60 right-1/3 opacity-50" delay={1.4} />

      <Navigation />

      <main className="relative pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <Flower2 className="w-5 h-5 text-purple-400" />
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('flowers.heroTitle')}
              </h1>

              {/* Separator */}
              <div className="w-24 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mb-8" />

              <p
                className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {t('flowers.heroSubtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {t('flowers.introTitle')}
                  </h2>

                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {t('flowers.introParagraph1')}
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                      {t('flowers.introParagraph2')}
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                      {t('flowers.introParagraph3')}
                    </p>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Flowers 3D Viewer Section - In the middle */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-5xl mx-auto">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="flowers-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('flowers.searchPlaceholder') || "Search by SAN code, name, or country..."}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              {filteredFlowers !== null && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  {filteredFlowers.length} {filteredFlowers.length === 1 ? 'flower' : 'flowers'} found
                </p>
              )}
            </motion.div>

            {/* Filtered Results or Swiper */}
            {filteredFlowers !== null ? (
              // Filtered results as vertical stack
              <div className="space-y-8">
                {filteredFlowers.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No flowers match your search.</p>
                  </div>
                ) : (
                  filteredFlowers.map((flower) => (
                    <Flower3DViewer
                      key={flower.id}
                      flower={flower}
                      t={t}
                      isActive={true}
                    />
                  ))
                )}
              </div>
            ) : (
              // Default swiper view
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <Swiper
                    modules={[SwiperNavigation]}
                    navigation={{
                      nextEl: '.swiper-button-next-flowers',
                      prevEl: '.swiper-button-prev-flowers',
                    }}
                    spaceBetween={30}
                    slidesPerView={1}
                    className="flowers-swiper"
                  >
                    {FLOWERS_DATA.map((flower, index) => (
                      <SwiperSlide key={flower.id}>
                        <Flower3DViewer
                          flower={flower}
                          t={t}
                          isActive={true}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  <button className="swiper-button-prev-flowers absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 lg:-translate-x-12 w-12 h-12 lg:w-16 lg:h-16 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                    <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-rose-600 transition-colors" />
                  </button>
                  <button className="swiper-button-next-flowers absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 lg:translate-x-12 w-12 h-12 lg:w-16 lg:h-16 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                    <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 text-gray-700 group-hover:text-rose-600 transition-colors" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Criteria Cards Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('flowers.selectionCriteriaTitle') || "Our Selection Criteria"}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('flowers.selectionCriteriaSubtitle') || "Each flower is carefully chosen based on these fundamental principles"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
              {criteriaCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: card.delay }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className={`relative h-full ${card.bgColor} backdrop-blur-lg rounded-2xl p-6 lg:p-8 border ${card.borderColor} shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300`}>
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>

                      <h3
                        className="text-xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {card.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Living Archive Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="group relative">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-teal-400/20 to-emerald-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                      <Archive className="w-6 h-6 text-white" />
                    </div>
                    <h2
                      className="text-3xl lg:text-4xl font-bold text-gray-900"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {t('flowers.narrativeTitle')}
                    </h2>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('flowers.narrativeText')}
                  </p>

                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Selection Process Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {t('flowers.selectionTitle')}
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto mb-6" />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('flowers.selectionMethodology') || "Our rigorous methodology ensures accuracy and cultural authenticity"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group relative h-full">
                    {/* Frosted glass card */}
                    <div className="relative h-full bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${point.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <point.icon className="w-6 h-6 text-white" />
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {point.text}
                      </p>

                      {/* Subtle gradient line */}
                      <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${point.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote / Call to Action Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/50 shadow-2xl text-center overflow-hidden">
                  {/* Decorative background */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.5) 0%, transparent 40%),
                        radial-gradient(circle at 80% 70%, rgba(249, 168, 212, 0.5) 0%, transparent 40%)
                      `,
                    }}
                  />

                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-6" />

                    <blockquote
                      className="text-xl sm:text-2xl lg:text-3xl text-gray-800 leading-relaxed mb-8 italic"
                      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                    >
                      &ldquo;{t('flowers.closingBefore')}
                      <span className="font-bold text-indigo-600">
                        {t('flowers.closingScience')}
                      </span>
                      {t('flowers.closingMiddle')}
                      <span className="font-bold text-blue-600">
                        {t('flowers.closingGarden')}
                      </span>
                      {t('flowers.closingAfter')}&rdquo;
                    </blockquote>

                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <Flower2 className="w-5 h-5 text-pink-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>

                    <a
                      href="/globe"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>{t('flowers.exploreGlobe') || "Explore the Globe"}</span>
                      <Globe2 className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
