
// Detailed flower data for all 8 game countries
// 8 evaluated parameters per flower + quiz questions
// Keyed by country ID matching countriesData in gameData.js

export const flowerDetails = {
  PAKISTAN: {
    id: "PAKISTAN",
    flowerName: "Jasmine",
    country: "Pakistan",
    scientificName: "Jasminum officinale",
    botanicalFamily: "Oleaceae",
    commonNames: "Common Jasmine, Poet's Jasmine, Chambeli",
    emoji: "🌸",
    colorAccent: "#FDF0D5",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Pure white star-shaped blossoms, tubular base opening into 5 petals. Flowers 2–3 cm; sprawling climbing shrub grows up to 10m. Perennial deciduous climber blooming heavily in summer.",
      },
      {
        key: "habitat",
        icon: "🏔️",
        label: "Habitat",
        value: "Gardens, parks, and cultivated areas throughout Pakistan and South Asia. Native to the Himalayas, the Caucasus, and western China at altitudes of 1,500–4,000 m.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "Brought to South Asia along ancient Silk Road trade routes. In Mughal India, it adorned imperial gardens. In Pakistan, 'Chambeli' appears in classical Urdu poetry by Mirza Ghalib and Allama Iqbal, symbolizing spiritual longing.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Official national flower of Pakistan. Deeply embedded in the country's cultural and poetic identity.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Least Concern (LC) — IUCN Red List. Wild populations in Himalayan foothills are stable. Threats include habitat loss from agricultural expansion and over-collection for essential oil production.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Sphingidae (Sphinx/Hawk Moths) — primarily night-pollinated by long-tongued hawk-moths attracted by its powerful nocturnal fragrance. A master of moonlit pollination.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "Jasmine holds a special place in Pakistani culture, used in religious ceremonies, weddings (gajra garlands), and traditional celebrations. It symbolizes love, beauty, and spiritual purity in Urdu and Sufi traditions.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Garlands for weddings and religious ceremonies; essential oil (attar) production; hair decoration (gajra); jasmine tea brewing; Ayurvedic and Unani medicine.",
      },
    ],
    quiz: [
      {
        q: "What country claims Jasmine as its national flower?",
        options: ["India", "Pakistan", "Bangladesh", "Afghanistan"],
        answer: 1,
        explanation: "Pakistan declared Jasmine (Chambeli) its official national flower. It holds deep spiritual significance in Urdu poetry.",
      },
      {
        q: "Which fascinating creature is the primary pollinator of Jasmine?",
        options: ["Honeybee", "Butterfly", "Hawk Moth", "Hummingbird"],
        answer: 2,
        explanation: "Sphinx/Hawk Moths (Sphingidae) are drawn to Jasmine's powerful nocturnal fragrance, making them its primary pollinator!",
      },
      {
        q: "What is the Urdu name for Jasmine in Pakistani culture?",
        options: ["Gulshan", "Chambeli", "Champa", "Gulnaar"],
        answer: 1,
        explanation: "'Chambeli' is the beloved Urdu name for Jasmine, featured in classical poetry by Ghalib and Allama Iqbal.",
      },
      {
        q: "What is Jasmine's conservation status?",
        options: ["Endangered", "Vulnerable", "Least Concern", "Critically Endangered"],
        answer: 2,
        explanation: "Jasmine is classified as Least Concern (LC) by the IUCN — its wild populations in Himalayan foothills remain stable!",
      },
      {
        q: "At what altitude does wild Jasmine grow in its native Himalayan habitat?",
        options: ["100–500 m", "500–1,000 m", "1,500–4,000 m", "4,500–6,000 m"],
        answer: 2,
        explanation: "Wild Jasmine thrives at 1,500–4,000 m altitude in the Himalayas, the Caucasus, and western China.",
      },
    ],
  },

  PERU: {
    id: "PERU",
    flowerName: "Cantuta",
    country: "Peru",
    scientificName: "Cantua buxifolia",
    botanicalFamily: "Polemoniaceae",
    commonNames: "Cantuta, Qantu (Quechua), Magic Tree",
    emoji: "🌺",
    colorAccent: "#FFF0F0",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Pendulous tubular flowers in vivid combinations of red, pink, yellow, and white. Evergreen shrub or small tree 1–3 m tall with small, ovate, softly hairy leaves and arching branches.",
      },
      {
        key: "habitat",
        icon: "🏔️",
        label: "Habitat",
        value: "High-altitude Andean yungas and cloud forest margins between 2,000 and 3,500 m. Grows on rocky slopes, ravines, and forest edges in Peru, Bolivia, and northern Chile.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "Known as 'Qantu' in Quechua, it was the most sacred flower of the Inca Empire, used exclusively in ceremonies to Inti (the Sun God). Its tricolor flowers mirror the Andean Wiphala flag. Appears in Tiwanaku textiles dated 600–1000 CE.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Official national flower of Peru and co-national flower of Bolivia. Legally protected in both countries. Peruvian independence heroes adopted it as a symbol of freedom.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Least Concern (LC) — IUCN Red List. However, some highland populations face pressure from deforestation, overgrazing, and climate change pushing frost lines upward.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Oreotrochilus melanogaster (Black-breasted Hillstar Hummingbird) — a specialist high-altitude pollinator perfectly adapted to the Cantuta's tubular flowers. Also visited by the Sparkling Violetear hummingbird.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "The most sacred flower of the Inca Empire, worn exclusively by royalty. Used in ceremonies to the Sun God Inti. Its tricolor echoes in the Andean Wiphala flag and continues to represent Andean identity and freedom.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Incan ritual offerings to Inti; wedding and festival garlands in Andean communities; dyeing textiles with petal pigments; traditional Andean medicine for fever; ornamental cultivation in highland gardens.",
      },
    ],
    quiz: [
      {
        q: "To which ancient civilization was the Cantuta the most sacred flower?",
        options: ["Aztec Empire", "Maya Civilization", "Inca Empire", "Olmec Civilization"],
        answer: 2,
        explanation: "The Cantuta (Qantu) was the sacred flower of the Inca Empire, worn by royalty and used in Sun God ceremonies!",
      },
      {
        q: "Which remarkable creature pollinates the Cantuta in Peru's high-altitude Andes?",
        options: ["Giant bee", "Monarch butterfly", "Black-breasted Hillstar Hummingbird", "Hawks moth"],
        answer: 2,
        explanation: "The Black-breasted Hillstar Hummingbird (Oreotrochilus melanogaster) is a specialist pollinator perfectly adapted to Cantuta's tubular flowers at high altitude.",
      },
      {
        q: "At what altitude does the wild Cantuta grow?",
        options: ["200–800 m", "800–1,500 m", "2,000–3,500 m", "4,500–6,000 m"],
        answer: 2,
        explanation: "Cantuta grows at 2,000–3,500 m in the Andean cloud forests — one of the world's most dramatic floral habitats!",
      },
      {
        q: "What do Cantuta's tricolor flowers (red, yellow, white) symbolize?",
        options: ["The Peruvian flag", "The Andean Wiphala flag", "The Incan solar calendar", "The three Andean seasons"],
        answer: 1,
        explanation: "Cantuta's tricolor flowers mirror the Andean Wiphala flag, a symbol of indigenous Andean identity and freedom.",
      },
      {
        q: "Which country shares the Cantuta as a co-national flower with Peru?",
        options: ["Chile", "Colombia", "Ecuador", "Bolivia"],
        answer: 3,
        explanation: "Bolivia is the co-national flower host! Both Peru and Bolivia legally protect this magnificent high-altitude plant.",
      },
    ],
  },

  TANZANIA: {
    id: "TANZANIA",
    flowerName: "Clove",
    country: "Tanzania",
    scientificName: "Syzygium aromaticum",
    botanicalFamily: "Myrtaceae",
    commonNames: "Clove, Karafuu (Swahili), Spice Island Flower",
    emoji: "🌱",
    colorAccent: "#F5F0E8",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Small, aromatic flower buds with crimson petals enclosing a cream-colored center. Evergreen tree 8–15 m tall with glossy elliptical leaves and a characteristic warm clove fragrance.",
      },
      {
        key: "habitat",
        icon: "🌊",
        label: "Habitat",
        value: "Tropical humid coastal environments with rich volcanic soil, warm temperatures, and high rainfall. Native to the Maluku Islands (Indonesia); cultivated primarily on Zanzibar, Pemba, and the Tanzanian mainland.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "Cloves were among the world's most valuable ancient spices. Arab traders brought them to Europe from the 4th century CE. The Portuguese, Dutch, and British fought wars over Zanzibar's clove monopoly. Sultan Said of Oman introduced clove cultivation to Zanzibar in 1818.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "National floral emblem of Tanzania and the defining symbol of Zanzibar's Spice Island heritage.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Not Evaluated (NE) by IUCN as a cultivated species. Wild populations in Maluku Islands are of conservation concern. Tanzania produces approximately 75% of the world's cloves.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Apis mellifera (Honeybee) and Trigona spp. (Stingless Bees) — clove flowers produce abundant nectar before the buds are harvested. On Zanzibar, managed honeybee colonies are essential for clove pollination and local honey production.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "Cloves shaped global trade history and define Zanzibar's identity as the 'Spice Island.' The spice that once triggered wars and colonialism now symbolizes Tanzania's economic heritage and pride.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Culinary spice in Biryani and Pilau; essential oil eugenol used in dentistry as natural anesthetic; traditional Swahili medicine for toothache and digestion; key ingredient in East African perfumery and incense.",
      },
    ],
    quiz: [
      {
        q: "Approximately what percentage of the world's cloves does Tanzania produce?",
        options: ["15%", "35%", "75%", "95%"],
        answer: 2,
        explanation: "Tanzania (primarily Zanzibar and Pemba) produces approximately 75% of the world's cloves — making it the true Spice Island!",
      },
      {
        q: "Which insect is essential for pollinating clove flowers in Zanzibar?",
        options: ["Dragonfly", "Honeybee", "Hawk Moth", "Monarch Butterfly"],
        answer: 1,
        explanation: "Apis mellifera (Honeybee) is essential for clove pollination. Managed bee colonies on Zanzibar also produce famous clove honey!",
      },
      {
        q: "Who introduced clove cultivation to Zanzibar in 1818?",
        options: ["Portuguese explorer Vasco da Gama", "British Governor Seward", "Sultan Said of Oman", "Arab merchant Ibn Battuta"],
        answer: 2,
        explanation: "Sultan Said of Oman introduced clove cultivation to Zanzibar in 1818, transforming the island's economy forever.",
      },
      {
        q: "What remarkable use does clove's essential oil (eugenol) have in medicine?",
        options: ["Heart surgery anesthetic", "Natural dental anesthetic", "Cancer treatment", "Blood pressure control"],
        answer: 1,
        explanation: "Clove oil (eugenol) acts as a powerful natural dental anesthetic — dentists used it for centuries before modern anesthesia!",
      },
      {
        q: "Which ancient civilizations fought wars over Zanzibar's clove monopoly?",
        options: ["Greeks, Romans, Persians", "Portuguese, Dutch, British", "Spanish, French, Italians", "Ottomans, Mughals, Chinese"],
        answer: 1,
        explanation: "The Portuguese, Dutch, and British all fought to control Zanzibar's clove monopoly — cloves were that valuable!",
      },
    ],
  },

  NICARAGUA: {
    id: "NICARAGUA",
    flowerName: "Sacuanjoche",
    country: "Nicaragua",
    scientificName: "Plumeria rubra",
    botanicalFamily: "Apocynaceae",
    commonNames: "Sacuanjoche, Frangipani, Plumeria",
    emoji: "🌼",
    colorAccent: "#FFFAF0",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Fragrant, waxy, pinwheel-shaped flowers in white, pink, yellow, or red with contrasting warm yellow centers. Flowers 6–10 cm in diameter. Deciduous tree with thick, succulent branches 5–8 m tall.",
      },
      {
        key: "habitat",
        icon: "🌴",
        label: "Habitat",
        value: "Tropical and subtropical dry forests, garden margins, and coastal areas throughout Central America. Thrives in well-drained soils with full sun and seasonal drought. Widely naturalized in tropical Asia and the Pacific.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "The Nahuatl word 'sacuanjoche' predates Spanish colonization. Pre-Columbian Mesoamerican peoples used it in ritual offerings. Officially declared Nicaragua's national flower in 1971. Celebrated by poet Rubén Darío, founder of Modernismo.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Official national flower of Nicaragua since 1971. Deeply woven into Nicaraguan folk poetry, religious life, and cultural celebrations.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Least Concern (LC) — IUCN Red List. However, Plumeria rust (caused by Coleosporium plumeriae fungus) has devastated ornamental populations globally since 2001.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Sphinx Moths (Manduca sexta and Cocytius antaeus) — the most extraordinary pollination strategy: Sacuanjoche produces abundant scent but NO nectar, deceiving hawk-moths into pollinating it. A master of floral deception!",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "Featured in Nicaraguan folk poetry and religious ceremonies (Day of the Dead, Holy Week). Symbolizes the cycle of life — used in both funerary contexts and joyful celebrations. Bridges the sacred and the earthly in Nicaraguan culture.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Religious offerings and altar decoration; tropical perfumery; garlands for welcoming ceremonies and weddings; traditional medicine for skin conditions, wound healing, and fever reduction.",
      },
    ],
    quiz: [
      {
        q: "What makes Sacuanjoche's pollination strategy uniquely remarkable?",
        options: ["It produces toxic nectar", "It produces abundant scent but NO nectar, deceiving moths", "It only blooms at night", "It produces nectar only when visited by the right moth"],
        answer: 1,
        explanation: "Sacuanjoche is a master of floral deception! It produces irresistible fragrance but NO nectar, tricking hawk-moths into pollination.",
      },
      {
        q: "Which famous Nicaraguan poet celebrated the Sacuanjoche?",
        options: ["Pablo Neruda", "García Márquez", "Rubén Darío", "Octavio Paz"],
        answer: 2,
        explanation: "Rubén Darío, the founder of the Modernismo literary movement, celebrated the Sacuanjoche's fragrance in his poetry!",
      },
      {
        q: "Which moth is responsible for pollinating the Sacuanjoche?",
        options: ["Luna Moth", "Sphinx/Hawk Moth", "Atlas Moth", "Silk Moth"],
        answer: 1,
        explanation: "Sphinx Moths (Manduca sexta) are deceived by Sacuanjoche's incredible fragrance into pollinating it — even though there's no nectar reward!",
      },
      {
        q: "What devastating disease has affected Sacuanjoche populations since 2001?",
        options: ["Rose Rosette Disease", "Plumeria Rust (Coleosporium)", "Dutch Elm Disease", "Fire Blight"],
        answer: 1,
        explanation: "Plumeria rust caused by the fungus Coleosporium plumeriae has devastated ornamental Sacuanjoche populations globally since 2001.",
      },
      {
        q: "In what year was Sacuanjoche declared Nicaragua's national flower?",
        options: ["1948", "1963", "1971", "1984"],
        answer: 2,
        explanation: "The Sacuanjoche was officially declared Nicaragua's national flower in 1971, cementing its central role in the country's identity.",
      },
    ],
  },

  JAMAICA: {
    id: "JAMAICA",
    flowerName: "Lignum Vitae",
    country: "Jamaica",
    scientificName: "Guaiacum officinale",
    botanicalFamily: "Zygophyllaceae",
    commonNames: "Lignum Vitae, Tree of Life, Guaiacum",
    emoji: "💙",
    colorAccent: "#F0F0FF",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Vibrant blue to purple blossoms that fade to pale silvery-white. Five distinct, slightly twisted petals forming a star-like cluster. Flowers 2 cm across on a slow-growing small tree reaching up to 10 m. Flowers primarily in spring.",
      },
      {
        key: "habitat",
        icon: "🏝️",
        label: "Habitat",
        value: "Dry coastal forests, limestone karst scrubland, and tropical dry woodlands throughout the Caribbean. Tolerates salt spray and seasonal drought — a true survivor of harsh island conditions.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "Lignum Vitae ('Tree of Life' in Latin) was discovered by Columbus and highly prized in Renaissance Europe as a supposed cure for syphilis. It was adopted as Jamaica's national flower upon independence in 1962.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Official national flower of Jamaica. Adopted at independence in 1962. Now legally protected due to historical over-harvesting of its extraordinarily dense, self-lubricating wood.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Endangered (EN) — IUCN Red List. Decimated by centuries of over-harvesting for its valuable timber and medicinal resin. Its slow growth rate severely hinders population recovery.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Hymenoptera (Bees) and Lepidoptera (Butterflies) — specifically native Caribbean solitary bees. The blue-purple flowers are highly attractive to specialist native bee species found only in the Caribbean.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "Represents strength, resilience, and healing — qualities deeply valued in Jamaican culture. The tree yields the densest and hardest wood in the world, and its resin has been used medicinally for centuries. A symbol of endurance against history's exploitation.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "The densest trade wood known — used for ship propeller shafts, clocks, bowling balls, and police batons. Medicinal resin (guaiac) used for arthritis and respiratory conditions. Once considered a cure for syphilis in Renaissance Europe.",
      },
    ],
    quiz: [
      {
        q: "What is the English meaning of 'Lignum Vitae'?",
        options: ["Flower of Life", "Tree of Life", "Wood of God", "Caribbean Crown"],
        answer: 1,
        explanation: "'Lignum Vitae' is Latin for 'Tree of Life' — named for its legendary medicinal properties that Renaissance Europeans believed could cure any disease!",
      },
      {
        q: "What extraordinary property makes Lignum Vitae wood unique?",
        options: ["It floats on water", "It is the densest and hardest wood in the world", "It is naturally fireproof", "It never decays"],
        answer: 1,
        explanation: "Lignum Vitae produces the world's densest and hardest natural wood. Its self-lubricating properties made it ideal for ship propeller shafts before synthetic materials existed!",
      },
      {
        q: "What is Lignum Vitae's conservation status according to the IUCN?",
        options: ["Least Concern", "Vulnerable", "Endangered", "Critically Endangered"],
        answer: 2,
        explanation: "Lignum Vitae is classified as Endangered (EN) by the IUCN — centuries of over-harvesting for its valuable wood have pushed it toward the brink.",
      },
      {
        q: "Renaissance Europeans believed Lignum Vitae could cure which disease?",
        options: ["Malaria", "Plague", "Syphilis", "Tuberculosis"],
        answer: 2,
        explanation: "Renaissance Europeans, including Columbus's sailors, believed Lignum Vitae resin could cure syphilis — making it enormously valuable and heavily traded!",
      },
      {
        q: "In which year was Lignum Vitae adopted as Jamaica's national flower?",
        options: ["1944", "1962", "1971", "1985"],
        answer: 1,
        explanation: "Lignum Vitae was adopted as Jamaica's national flower at independence in 1962. It now holds protected status due to historical over-exploitation.",
      },
    ],
  },

  SPAIN: {
    id: "SPAIN",
    flowerName: "Carnation",
    country: "Spain",
    scientificName: "Dianthus caryophyllus",
    botanicalFamily: "Caryophyllaceae",
    commonNames: "Carnation, Clove Pink, Clavel",
    emoji: "❤️",
    colorAccent: "#FFF0F0",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Classic reds and pinks, often bi-colored or speckled in cultivated forms. Fringed or deeply toothed petals forming a dense, ruffled bloom 3–5 cm in diameter. Stems grow 40–80 cm tall. Herbaceous perennial.",
      },
      {
        key: "habitat",
        icon: "☀️",
        label: "Habitat",
        value: "Mediterranean gardens, ornamental fields, and rocky limestone slopes. Native to the Mediterranean basin from southern Europe to western Asia. Thrives in Spain's warm, sunny Mediterranean climate.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "Dianthus means 'flower of the gods' in Greek. Cultivated by ancient Greeks and Romans for garlands. In Spain, the red carnation (clavel) became deeply associated with folklore, flamenco dancing, and religious festivals.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Widely regarded as the national flower of Spain, deeply rooted in popular culture rather than absolute official decree. Appears in Flamenco tradition, festivals, and Spanish national identity.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Least Concern (LC) for cultivated varieties. Some wild Dianthus species face local habitat pressures from intensive agriculture and climate-change induced Mediterranean droughts.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Lepidoptera (Butterflies and Moths) — the deep tubular flowers are specialized for long-tongued pollinators. Swallowtail butterflies and hawk moths are particularly important carnation pollinators.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "Central to Spanish culture — worn during festivals, bullfights, and flamenco performances. Represents passion, love, and the vibrant artistic soul of Spain. Appears in Semana Santa (Holy Week) processions and in the hair of flamenco dancers.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Ornamental use in Spanish festivals; commercial cut-flower industry (Spain is a major European producer); traditional medicine — teas used to relieve stress and inflammation; edible flowers in Mediterranean cuisine.",
      },
    ],
    quiz: [
      {
        q: "What does the Latin name 'Dianthus' mean?",
        options: ["Venus's flower", "Flower of the Gods", "Red jewel", "Garden king"],
        answer: 1,
        explanation: "Dianthus comes from Greek 'dios' (god) + 'anthos' (flower) — literally 'Flower of the Gods'! The ancient Greeks considered it divinely beautiful.",
      },
      {
        q: "Which animal spectacle traditionally features carnations in Spanish culture?",
        options: ["Horse racing", "Flamenco dancing and bullfighting", "Football matches", "Running of the bulls"],
        answer: 1,
        explanation: "Carnations are deeply associated with flamenco dancing and bullfighting in Spain — a vibrant symbol of passion and the Spanish spirit!",
      },
      {
        q: "Which creature is the primary pollinator of Carnation flowers?",
        options: ["Bees", "Butterflies and Moths", "Beetles", "Hummingbirds"],
        answer: 1,
        explanation: "Lepidoptera (Butterflies and Moths) are carnation's primary pollinators — their deep tubular flowers require long tongues to access the nectar!",
      },
      {
        q: "During which famous Spanish festival are carnations prominently displayed?",
        options: ["La Tomatina", "Semana Santa (Holy Week)", "San Fermín", "Feria de Agosto"],
        answer: 1,
        explanation: "Carnations feature prominently in Semana Santa (Holy Week) processions — carried by participants as a symbol of devotion and beauty.",
      },
      {
        q: "What environmental threat most impacts carnation cultivation in Spain?",
        options: ["Flooding", "Mediterranean droughts from climate change", "Volcanic activity", "Frost damage"],
        answer: 1,
        explanation: "Intensifying Mediterranean droughts from climate change threaten traditional un-irrigated carnation cultivation in Spain.",
      },
    ],
  },

  SCOTLAND: {
    id: "SCOTLAND",
    flowerName: "Thistle",
    country: "Scotland",
    scientificName: "Onopordum acanthium",
    botanicalFamily: "Asteraceae",
    commonNames: "Cotton Thistle, Scotch Thistle, Heraldic Thistle",
    emoji: "💜",
    colorAccent: "#F8F0FF",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Vivid magenta to purple florets emerging from a silver-green, spiny base. Dense composite flower head protected by formidable sharp spiny bracts. Flower heads 3–5 cm; stems grow 1–2.5 m tall. Biennial herbaceous plant.",
      },
      {
        key: "habitat",
        icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        label: "Habitat",
        value: "Meadows, grasslands, disturbed ground, roadsides, and field margins throughout Scotland and the British Isles. Tolerates poor, rocky soils. Thrives in Scotland's challenging highland and lowland environments.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "According to legend, at the Battle of Largs (1263), a barefoot Norse invader stepped on a thistle in the dark and cried out, alerting the sleeping Scottish clans. The thistle was subsequently adopted as Scotland's emblem.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Official national emblem of Scotland since the reign of King Alexander III (13th century). Features prominently on the prestigious Order of the Thistle — Scotland's highest honour.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Least Concern (LC) — a highly successful and adaptable plant. However, vigorous agricultural herbicide campaigns actively target it as a 'noxious weed', creating a paradox for Scotland's most iconic native plant.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Bombus (Bumblebees) and Lepidoptera — especially the Painted Lady butterfly. The Thistle is one of Scotland's richest nectar sources, supporting dozens of pollinator species. The Painted Lady butterfly depends on it for fuelling its epic migration.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "Symbol of Scottish resilience and independence for over 700 years. Appears on Scottish coins, coats of arms, and the Order of the Thistle. Its motto 'Nemo me impune lacessit' ('No one provokes me with impunity') reflects the Scottish spirit.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Heraldic symbol on coins and coats of arms; herbal medicine for digestive issues; the down historically used to stuff pillows; nectar plant critical for bumblebees and migrating butterflies.",
      },
    ],
    quiz: [
      {
        q: "According to legend, how did the Thistle become Scotland's emblem?",
        options: ["A king chose it for its beauty", "A Norse invader stepped on one in the dark, alerting sleeping Scots", "It was gifted by a French queen", "Robert Burns wrote a famous poem about it"],
        answer: 1,
        explanation: "Legend: At the Battle of Largs (1263), a barefoot Norse invader stepped on a thistle and cried out in pain, alerting the Scottish clans — the accidental thistle hero!",
      },
      {
        q: "Which butterfly species especially relies on the Scottish Thistle during its migration?",
        options: ["Monarch Butterfly", "Painted Lady Butterfly", "Swallowtail Butterfly", "Red Admiral Butterfly"],
        answer: 1,
        explanation: "The Painted Lady butterfly depends on Thistle nectar to fuel its remarkable long-distance migrations across Europe and Africa!",
      },
      {
        q: "What is the famous Latin motto associated with the Thistle?",
        options: ["Veni Vidi Vici", "Nemo me impune lacessit", "Per ardua ad astra", "Semper fidelis"],
        answer: 1,
        explanation: "'Nemo me impune lacessit' means 'No one provokes me with impunity' — perfectly capturing the fiercely independent Scottish spirit!",
      },
      {
        q: "What is the Thistle's conservation status, despite agricultural campaigns against it?",
        options: ["Endangered", "Vulnerable", "Near Threatened", "Least Concern"],
        answer: 3,
        explanation: "The Thistle is Least Concern (LC) — remarkably resilient! Despite being targeted as a 'noxious weed' by farmers, it thrives across Scotland.",
      },
      {
        q: "Which insect is the Thistle's primary pollinator and benefits most from its nectar?",
        options: ["Honeybee", "Wasp", "Bumblebee", "Horsefly"],
        answer: 2,
        explanation: "Bumblebees (Bombus) are the primary pollinators — the Thistle is one of Scotland's richest nectar sources, vital for bumblebee colonies!",
      },
    ],
  },

  GERMANY: {
    id: "GERMANY",
    flowerName: "Cornflower",
    country: "Germany",
    scientificName: "Centaurea cyanus",
    botanicalFamily: "Asteraceae",
    commonNames: "Cornflower, Bluebottle, Blaue Kornblume",
    emoji: "💙",
    colorAccent: "#F0F4FF",
    parameters: [
      {
        key: "morphology",
        icon: "🌿",
        label: "Morphology",
        value: "Brilliant electric-blue with purple disc florets. Composite flower heads with fringed ray florets. Heads 2–4 cm across; herb 20–90 cm tall. Annual or biennial herb with lanceolate leaves and wiry stems.",
      },
      {
        key: "habitat",
        icon: "🌾",
        label: "Habitat",
        value: "Traditionally a weed of cereal grain fields (rye, wheat, barley) throughout Central Europe. Now primarily found in wildflower meadows and conservation grasslands. Thrives in disturbed, nutrient-poor agricultural soils.",
      },
      {
        key: "historicalOrigin",
        icon: "📜",
        label: "Historical Origin",
        value: "Queen Louise of Prussia (1776–1810) hid her children in a cornfield during Napoleon's advance, weaving wreaths from cornflowers to calm them. Her son Kaiser Wilhelm I adopted it as a lifelong symbol. Associated with German Romanticism and working-class movements.",
      },
      {
        key: "nationalStatus",
        icon: "🏛️",
        label: "National Status",
        value: "Unofficial but widely recognized national flower of Germany. Historical emblem of the Prussian monarchy, associated with German Romanticism. Appeared on Prussian military uniforms.",
      },
      {
        key: "conservationStatus",
        icon: "🔍",
        label: "Conservation Status",
        value: "Least Concern (LC) globally — but listed as Vulnerable or regionally extinct in many European countries! Herbicide-intensive farming has reduced cornflower populations by over 95% in German agricultural landscapes since 1950.",
      },
      {
        key: "relevantPollinator",
        icon: "🦋",
        label: "Key Pollinator",
        value: "Andrena (Mining Bees) and Bombus lapidarius (Red-tailed Bumblebee) — highly efficient cornflower pollinators. Also Pieris rapae (Small White Butterfly) and Apis mellifera (Honeybee). An exceptionally important plant for pollinators.",
      },
      {
        key: "culturalSignificance",
        icon: "💛",
        label: "Cultural Significance",
        value: "One of Germany's most paradoxical symbols — enormously abundant as an ornamental and cultural symbol, yet practically extinct in its original agricultural habitat. The Cornflower's story is a perfect encapsulation of the AquaMundi mission.",
      },
      {
        key: "traditionalUses",
        icon: "🌿",
        label: "Traditional Uses",
        value: "Flower tea (Blütentee) for eye health; edible flowers in salads and pastry decoration; natural blue food dye; traditional bridal and harvest wreaths; homeopathic medicine for eye conditions including conjunctivitis.",
      },
    ],
    quiz: [
      {
        q: "By approximately how much have Cornflower populations declined in German farmland since 1950?",
        options: ["25%", "50%", "75%", "Over 95%"],
        answer: 3,
        explanation: "Herbicide-intensive cereal farming has reduced Cornflower populations by over 95% in German agricultural landscapes — nearly extinct in its original home!",
      },
      {
        q: "Which Prussian queen is famous for weaving cornflower wreaths during Napoleon's advance?",
        options: ["Queen Victoria", "Queen Louise of Prussia", "Empress Maria Theresa", "Queen Sophie Charlotte"],
        answer: 1,
        explanation: "Queen Louise hid her children in a cornfield and wove cornflower wreaths to calm them. Her son Kaiser Wilhelm I made it his personal symbol for life!",
      },
      {
        q: "What remarkable traditional use does Cornflower have for eye health?",
        options: ["Eye drops from petals", "Cornflower tea treats conjunctivitis", "Pollen reduces cataracts", "Leaves soothe tired eyes"],
        answer: 1,
        explanation: "Cornflower tea (Blütentee) has been used in traditional German medicine for centuries to treat eye inflammation and conjunctivitis!",
      },
      {
        q: "Which bee type is the Cornflower's primary specialist pollinator?",
        options: ["Honeybee", "Carpenter Bee", "Mining Bee (Andrena)", "Leafcutter Bee"],
        answer: 2,
        explanation: "Andrena mining bees are highly specialized Cornflower pollinators, along with the Red-tailed Bumblebee (Bombus lapidarius).",
      },
      {
        q: "What makes the Cornflower's conservation story paradoxical?",
        options: [
          "It's protected by law but still eaten by livestock",
          "It's Germany's symbol but practically extinct in its original farmland habitat",
          "It grows abundantly in the wild but dies in gardens",
          "It's blue in nature but pink in cultivation",
        ],
        answer: 1,
        explanation: "The Cornflower is everywhere in German culture and gardens, yet practically extinct in the agricultural fields where it originally grew — a symbol without a home!",
      },
    ],
  },
};

// Get flower detail data by country ID
export function getFlowerDetail(countryId) {
  return flowerDetails[countryId] || null;
}

// Get quiz questions for a country
export function getFlowerQuiz(countryId) {
  const detail = flowerDetails[countryId];
  return detail ? detail.quiz : [];
}
