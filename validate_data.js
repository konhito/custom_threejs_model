
const { naturalPollinators, roboticPollinators, getAllPollinators } = require('./app/pollinators/gallery/pollinatorData.js');

const allPollinators = getAllPollinators();

const expectedStringFields = [
    'name', 'slug', 'category', 'categoryIcon', 'region', 'country',
    'image', 'imageAttribution', 'imageUrl', 'scientificName', 'glbPath',
    'manufacturer', 'year', 'status'
];

allPollinators.forEach(p => {
    expectedStringFields.forEach(field => {
        if (p[field] && typeof p[field] === 'object') {
            console.error(`ERROR: Field ${field} for pollinator ${p.name} is an object!`);
            console.log(JSON.stringify(p[field], null, 2));
        }
    });

    // Check localized fields - they should be objects with string/array values
    const localizedFields = ['description', 'detailedDescription', 'habitat', 'conservation', 'role', 'funFacts', 'capabilities', 'applications', 'advantages', 'limitations'];
    localizedFields.forEach(field => {
        if (p[field]) {
            if (typeof p[field] !== 'object') {
                // It's allowed to be undefined or string (if not localized yet)
            } else {
                Object.values(p[field]).forEach(val => {
                    if (typeof val === 'object' && !Array.isArray(val)) {
                        console.error(`ERROR: Localized field ${field} for pollinator ${p.name} has nested object value!`);
                    }
                });
            }
        }
    });
});
console.log("Validation complete.");
