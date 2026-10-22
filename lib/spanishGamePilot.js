// Spanish pilot content for the complete Spain playthrough.
export const spanishSpain = {
  flowerName: "Clavel",
  country: "España",
  commonNames: "Clavel, clavel común",
  parameters: [
    { key: "morphology", label: "Morfología", value: "Flores de 3 a 5 cm, con pétalos dentados o festoneados, a menudo rojos o rosados. Sus tallos miden de 40 a 80 cm. Es una planta herbácea perenne." },
    { key: "habitat", label: "Hábitat", value: "Crece en jardines mediterráneos, campos ornamentales y laderas rocosas calizas. Es originario de la cuenca mediterránea y prospera en climas cálidos y soleados." },
    { key: "historicalOrigin", label: "Origen histórico", value: "Dianthus significa «flor de los dioses» en griego. Griegos y romanos cultivaban claveles para hacer guirnaldas. En España, el clavel rojo se asocia al folclore, el flamenco y las fiestas." },
    { key: "nationalStatus", label: "Condición nacional", value: "El clavel es ampliamente considerado la flor nacional de España por su presencia en la cultura popular. No existe un decreto único que lo establezca oficialmente." },
    { key: "conservationStatus", label: "Conservación", value: "Los claveles cultivados son comunes. Algunas especies silvestres de Dianthus sufren presión local por la agricultura intensiva y las sequías mediterráneas." },
    { key: "relevantPollinator", label: "Polinizadores principales", value: "Mariposas y polillas, especialmente las de lengua larga, pueden alcanzar el néctar de sus flores tubulares." },
    { key: "culturalSignificance", label: "Importancia cultural", value: "En España, el clavel aparece en fiestas, actuaciones de flamenco y procesiones de Semana Santa. Suele representar el amor y la pasión." },
    { key: "traditionalUses", label: "Usos tradicionales", value: "Se usa como flor ornamental y de corte. Los pétalos también se han empleado en infusiones y como decoración comestible." },
  ],
  quiz: [
    { q: "¿Qué significa el nombre «Dianthus»?", options: ["Flor de Venus", "Flor de los dioses", "Joya roja", "Rey del jardín"], answer: 1, explanation: "Proviene de las palabras griegas para «dios» y «flor»." },
    { q: "¿Con qué expresiones culturales españolas se asocia el clavel?", options: ["Carreras de caballos", "Flamenco y fiestas", "Partidos de fútbol", "Esquí"], answer: 1, explanation: "El clavel es un símbolo frecuente en el flamenco y las fiestas populares." },
    { q: "¿Qué animales pueden polinizar las flores tubulares del clavel?", options: ["Aves marinas", "Mariposas y polillas", "Mamíferos", "Peces"], answer: 1, explanation: "Las mariposas y las polillas de lengua larga pueden llegar al néctar." },
    { q: "¿En qué celebraciones aparecen claveles en las procesiones?", options: ["La Tomatina", "Semana Santa", "Año Nuevo chino", "Oktoberfest"], answer: 1, explanation: "Los claveles se utilizan en procesiones de Semana Santa." },
    { q: "¿Qué presión ambiental afecta a algunas especies silvestres de Dianthus?", options: ["Hielo polar", "Sequías mediterráneas", "Actividad volcánica", "Mareas"], answer: 1, explanation: "Las sequías y la pérdida de hábitat pueden afectar a sus poblaciones silvestres." },
  ],
};

export const spanishCardNames = {
  climatechange: "Cambio climático",
  deforestation: "Deforestación",
  exploitation: "Explotación",
  ignorance: "Ignorancia",
  intentionalfire: "Incendio intencionado",
  education: "Educación",
  floraljustice: "Justicia floral",
  naturalbalance: "Equilibrio natural",
  reforestation: "Reforestación",
  water: "Agua",
  wildcard: "Comodín",
};

export function localizeSpanishSpain(detail) {
  return { ...detail, ...spanishSpain, parameters: detail.parameters.map((item, index) => ({ ...item, ...spanishSpain.parameters[index] })) };
}
