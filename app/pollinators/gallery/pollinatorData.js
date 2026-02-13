// Shared pollinator data for the gallery and detail pages
// All natural + robotic pollinators with slugs for routing

// Helper function to create GLB path from S3
export const createGLBPath = (fileName) => {
    return `/api/glb-proxy?url=${encodeURIComponent(`https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/${fileName}`)}`;
};

// Helper to create a URL-friendly slug
const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─────────────────────────────────────────────
// Natural Pollinators
// ─────────────────────────────────────────────
export const naturalPollinators = {
    bees: [
        {
            name: "Ant",
            slug: "ant",
            scientificName: "Formicidae sp.",
            category: "Bees & Ants",
            categoryIcon: "🐝",
            region: "Global",
            country: "Global",
            image: "/pollinators/ant.jpg",
            imageAttribution: "Shutterstock",
            imageUrl: "https://www.shutterstock.com/image-photo/close-flower-petals-ant-doing-260nw-417376993.jpg",
            description: {
                en: "Ground pollinator associated with flowers. Ants visit flowers attracted by nectar and sugary exudates on the petals.",
                es: "Polinizador terrestre asociado con flores. Las hormigas visitan flores atraídas por el néctar y exudados azucarados en los pétalos.",
                fr: "Pollinisateur terrestre associé aux fleurs. Les fourmis visitent les fleurs attirées par le nectar et les exsudats sucrés des pétales.",
                de: "Bodenbestäuber in Verbindung mit Blumen. Ameisen besuchen Blumen, angelockt von Nektar und zuckerhaltigen Ausscheidungen auf den Blütenblättern.",
                zh: "与花卉相关的地面传粉者。蚂蚁被花瓣上的花蜜和含糖分泌物吸引而造访花朵。"
            },
            detailedDescription: {
                en: "Ants are often overlooked as pollinators, but certain species play a surprisingly important role in plant reproduction, especially in arid and semi-arid environments. While ants lack the fuzzy bodies of bees that make them efficient pollen carriers, they frequently visit flowers for nectar and in doing so can transfer pollen between blooms. Some plants have even evolved to specifically attract ant pollinators with low-growing flowers and accessible nectar rewards. Ant pollination (myrmecophily) is particularly significant for ground-level and prostrate plants where flying pollinators may be less frequent visitors.",
                es: "Las hormigas a menudo se pasan por alto como polinizadores, pero ciertas especies juegan un papel sorprendentemente importante en la reproducción de plantas, especialmente en ambientes áridos y semiáridos. Aunque las hormigas carecen de los cuerpos peludos de las abejas que las hacen portadoras eficientes de polen, visitan frecuentemente las flores por néctar y al hacerlo pueden transferir polen entre flores. Algunas plantas incluso han evolucionado para atraer específicamente a polinizadores hormigas con flores de bajo crecimiento y recompensas de néctar accesibles.",
                fr: "Les fourmis sont souvent négligées en tant que pollinisateurs, mais certaines espèces jouent un rôle étonnamment important dans la reproduction des plantes, en particulier dans les environnements arides et semi-arides. Bien qu'elles manquent des corps velus des abeilles qui en font des transporteurs de pollen efficaces, elles visitent fréquemment les fleurs pour le nectar et peuvent ainsi transférer du pollen entre les fleurs.",
                de: "Ameisen werden oft als Bestäuber übersehen, aber bestimmte Arten spielen eine überraschend wichtige Rolle bei der Pflanzenvermehrung, insbesondere in trockenen und halbtrockenen Umgebungen. Obwohl Ameisen nicht die pelzigen Körper von Bienen haben, die sie zu effizienten Pollenträgern machen, besuchen sie häufig Blumen für Nektar und können dabei Pollen zwischen Blüten übertragen.",
                zh: "蚂蚁作为传粉者常被忽视，但在植物繁殖中，特别是在干旱和半干旱环境中，某些物种发挥着惊人的重要作用。虽然蚂蚁没有蜜蜂那样能有效携带花粉的毛茸茸的身体，但它们经常为了花蜜而造访花朵，在此过程中可以在花朵之间传播花粉。"
            },
            habitat: {
                en: "Present in almost all terrestrial ecosystems, especially soils, path edges and gardens.",
                es: "Presente en casi todos los ecosistemas terrestres, especialmente suelos, bordes de caminos y jardines.",
                fr: "Présent dans presque tous les écosystèmes terrestres, en particulier les sols, les bords de chemins et les jardins.",
                de: "In fast allen terrestrischen Ökosystemen vorhanden, insbesondere in Böden, an Wegränern und in Gärten.",
                zh: "存在于几乎所有的陆地生态系统中，特别是土壤、路边和花园。"
            },
            conservation: {
                en: "Ant pollinator guilds receive an estimated Araihan Measure of 18/25: high local efficiency and strong ecological interdependence.",
                es: "Los gremios de polinizadores hormigas reciben una Medida Araihan estimada de 18/25: alta eficiencia local y fuerte interdependencia ecológica.",
                fr: "Les guildes de pollinisateurs fourmis reçoivent une mesure Araihan estimée de 18/25 : haute efficacité locale et forte interdépendance écologique.",
                de: "Ameisenbestäubergilden erhalten ein geschätztes Araihan-Maß von 18/25: hohe lokale Effizienz und starke ökologische Interdependenz.",
                zh: "蚂蚁传粉群体的Araihan测量评估为18/25：具有较高的局部效率和很强的生态相互依赖性。"
            },
            araihanMeasure: 18,
            conservationStatus: "High local efficiency",
            glbPath: "/ant.glb",
            role: {
                en: "Ground pollinator associated with flowers",
                es: "Polinizador terrestre asociado con flores",
                fr: "Pollinisateur terrestre associé aux fleurs",
                de: "Bodenbestäuber in Verbindung mit Blumen",
                zh: "与花卉相关的地面传粉者"
            },
            funFacts: {
                en: [
                    "Some desert plants rely almost exclusively on ants for pollination",
                    "Ants secrete antimicrobial substances that can actually reduce pollen viability in some cases",
                    "There are over 22,000 known species of ants worldwide",
                    "Ant colonies can contain millions of individuals all working together"
                ],
                es: [
                    "Algunas plantas del desierto dependen casi exclusivamente de las hormigas para la polinización",
                    "Las hormigas secretan sustancias antimicrobianas que pueden reducir la viabilidad del polen en algunos casos",
                    "Hay más de 22,000 especies conocidas de hormigas en todo el mundo",
                    "Las colonias de hormigas pueden contener millones de individuos trabajando juntos"
                ],
                fr: [
                    "Certaines plantes du désert dépendent presque exclusivement des fourmis pour la pollinisation",
                    "Les fourmis sécrètent des substances antimicrobiennes qui peuvent réduire la viabilité du pollen dans certains cas",
                    "Il existe plus de 22 000 espèces connues de fourmis dans le monde",
                    "Les colonies de fourmis peuvent contenir des millions d'individus travaillant ensemble"
                ],
                de: [
                    "Einige Wüstenpflanzen verlassen sich fast ausschließlich auf Ameisen zur Bestäubung",
                    "Ameisen scheiden antimikrobielle Substanzen aus, die in einigen Fällen die Pollenlebensfähigkeit verringern können",
                    "Es gibt weltweit über 22.000 bekannte Ameisenarten",
                    "Ameisenkolonien können Millionen von Individuen enthalten, die alle zusammenarbeiten"
                ],
                zh: [
                    "一些沙漠植物几乎完全依赖蚂蚁进行授粉",
                    "蚂蚁分泌的抗菌物质在某些情况下实际上会降低花粉的活力",
                    "全世界已知的蚂蚁种类超过22,000种",
                    "蚂蚁群体可能包含数百万只齐心协力的个体"
                ]
            },
            type: "natural"
        },
        {
            name: "Honeybee",
            slug: "honeybee",
            scientificName: "Apis mellifera",
            category: "Bees & Ants",
            categoryIcon: "🐝",
            region: "Global",
            country: "Global",
            image: "/pollinators/honeybee.jpg",
            imageAttribution: "Google",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-L0Ot1SZLhFhJ1QnYeEJ5HdVG5lIHA5ZsyQ&s",
            description: {
                en: "Essential pollinator responsible for pollinating many of the world's food crops.",
                es: "Polinizador esencial responsable de polinizar muchos de los cultivos alimentarios del mundo.",
                fr: "Pollinisateur essentiel responsable de la pollinisation de nombreuses cultures vivrières mondiales.",
                de: "Unverzichtbarer Bestäuber, verantwortlich für die Bestäubung vieler Nahrungspflanzen der Welt.",
                zh: "负责为世界上许多粮食作物授粉的重要传粉者。"
            },
            detailedDescription: {
                en: "The Western honeybee (Apis mellifera) is arguably the single most important pollinator species for global agriculture. A single colony can contain 20,000 to 80,000 bees, and foragers may visit up to 5,000 flowers in a single day. Honeybees demonstrate remarkable communication through their famous 'waggle dance,' which conveys the direction and distance of food sources to nestmates. They practice floral constancy — tending to visit the same type of flower on each foraging trip — which makes them exceptionally efficient pollinators.",
                es: "La abeja melífera occidental (Apis mellifera) es posiblemente la especie de polinizador más importante para la agricultura mundial. Una sola colonia puede contener de 20,000 a 80,000 abejas. Las abejas demuestran una comunicación notable a través de su famosa 'danza del meneo', que transmite la dirección y la distancia de las fuentes de alimento a sus compañeras de nido.",
                fr: "L'abeille occidentale (Apis mellifera) est sans doute l'espèce pollinisatrice la plus importante pour l'agriculture mondiale. Une seule colonie peut contenir de 20 000 à 80 000 abeilles. Les abeilles font preuve d'une communication remarquable grâce à leur célèbre « danse frétillante », qui transmet la direction et la distance des sources de nourriture.",
                de: "Die Westliche Honigbiene (Apis mellifera) ist wohl die wichtigste Bestäuberart für die globale Landwirtschaft. Ein einziges Volk kann 20.000 bis 80.000 Bienen enthalten. Honigbienen zeigen eine bemerkenswerte Kommunikation durch ihren berühmten 'Schwänzeltanz', der Richtung und Entfernung von Nahrungsquellen vermittelt.",
                zh: "西方蜜蜂（Apis mellifera）可以说是全球农业中最重要的单一授粉物种。一个蜂群可能包含20,000到80,000只蜜蜂。蜜蜂通过著名的“摇摆舞”展示了非凡的沟通能力，这种舞蹈向同伴传达食物来源的方向和距离。"
            },
            habitat: {
                en: "Found worldwide in diverse habitats, from forests to urban gardens, wherever flowering plants grow.",
                es: "Se encuentra en todo el mundo en diversos hábitats, desde bosques hasta jardines urbanos, dondequiera que crezcan plantas con flores.",
                fr: "Trouvé dans le monde entier dans divers habitats, des forêts aux jardins urbains, partout où poussent des plantes à fleurs.",
                de: "Weltweit in verschiedenen Lebensräumen zu finden, von Wäldern bis zu städtischen Gärten, überall dort, wo Blütenpflanzen wachsen.",
                zh: "在世界各地的各种栖息地中都有发现，从森林到城市花园，只要有开花植物生长的地方。"
            },
            conservation: {
                en: "Honeybee populations face significant threats from pesticides, habitat loss, climate change, and diseases. Araihan Measure: 20 / 25 (Declining).",
                es: "Las poblaciones de abejas melíferas enfrentan amenazas significativas por pesticidas, pérdida de hábitat, cambio climático y enfermedades. Medida Araihan: 20 / 25 (En declive).",
                fr: "Les populations d'abeilles mellifères sont confrontées à des menaces importantes dues aux pesticides, à la perte d'habitat, au changement climatique et aux maladies. Mesure Araihan : 20 / 25 (En déclin).",
                de: "Honigbienenpopulationen sind erheblichen Bedrohungen durch Pestizide, Lebensraumverlust, Klimawandel und Krankheiten ausgesetzt. Araihan-Maß: 20 / 25 (Rückläufig).",
                zh: "蜜蜂种群面临农药、栖息地丧失、气候变化和疾病的重大威胁。Araihan测量：20 / 25（下降中）。"
            },
            araihanMeasure: 20,
            conservationStatus: "Declining",
            glbPath: null,
            role: {
                en: "Essential pollinator responsible for pollinating many of the world's food crops",
                es: "Polinizador esencial responsable de polinizar muchos de los cultivos alimentarios del mundo",
                fr: "Pollinisateur essentiel responsable de la pollinisation de nombreuses cultures vivrières mondiales",
                de: "Unverzichtbarer Bestäuber, verantwortlich für die Bestäubung vieler Nahrungspflanzen der Welt",
                zh: "负责为世界上许多粮食作物授粉的重要传粉者"
            },
            funFacts: {
                en: [
                    "A single bee colony can pollinate 300 million flowers each day",
                    "Honeybees fly at speeds of up to 25 km/h and can travel up to 8 km from the hive",
                    "They communicate through the 'waggle dance' to share location of food sources",
                    "A honeybee visits 50 to 1,000 flowers in one trip and makes 10 trips per day"
                ],
                es: [
                    "Una sola colonia de abejas puede polinizar 300 millones de flores cada día",
                    "Las abejas vuelan a velocidades de hasta 25 km/h y pueden viajar hasta 8 km desde la colmena",
                    "Se comunican a través de la 'danza del meneo' para compartir la ubicación de las fuentes de alimento",
                    "Una abeja visita de 50 a 1,000 flores en un viaje y realiza 10 viajes por día"
                ],
                fr: [
                    "Une seule colonie d'abeilles peut polliniser 300 millions de fleurs chaque jour",
                    "Les abeilles volent à des vitesses allant jusqu'à 25 km/h et peuvent parcourir jusqu'à 8 km de la ruche",
                    "Elles communiquent par la « danse frétillante » pour partager l'emplacement des sources de nourriture",
                    "Une abeille visite 50 à 1 000 fleurs en un seul voyage et effectue 10 voyages par jour"
                ],
                de: [
                    "Ein einziges Bienenvolk kann täglich 300 Millionen Blüten bestäuben",
                    "Honigbienen fliegen mit Geschwindigkeiten von bis zu 25 km/h und können bis zu 8 km vom Bienenstock zurücklegen",
                    "Sie kommunizieren durch den 'Schwänzeltanz', um den Standort von Nahrungsquellen zu teilen",
                    "Eine Honigbiene besucht auf einem Ausflug 50 bis 1.000 Blüten und macht 10 Ausflüge pro Tag"
                ],
                zh: [
                    "一个蜂群每天可以为3亿朵花授粉",
                    "蜜蜂的飞行速度可达每小时25公里，飞行距离可达离蜂巢8公里",
                    "它们通过“摇摆舞”交流，分享食物来源的位置",
                    "一只蜜蜂一次出游访问50到1000朵花，每天进行10次出游"
                ]
            },
            type: "natural"
        },
        {
            name: "Bumblebee",
            slug: "bumblebee",
            scientificName: "Bombus terrestris",
            category: "Bees & Ants",
            categoryIcon: "🐝",
            region: "Europe, Asia, North America",
            country: "Europe, Asia, North America",
            image: "/pollinators/bumblebee.jpg",
            imageAttribution: "New Scientist",
            imageUrl: "https://images.newscientist.com/wp-content/uploads/2012/08/07110016/akxy4h.jpg",
            description: {
                en: "Large, fuzzy bees that are excellent pollinators for many wildflowers and crops.",
                es: "Abejas grandes y peludas que son excelentes polinizadores para muchas flores silvestres y cultivos.",
                fr: "Grandes abeilles duveteuses qui sont d'excellents pollinisateurs pour de nombreuses fleurs sauvages et cultures.",
                de: "Große, pelzige Bienen, die ausgezeichnete Bestäuber für viele Wildblumen und Nutzpflanzen sind.",
                zh: "大而毛茸茸的蜜蜂，是许多野花和作物的优秀传粉者。"
            },
            detailedDescription: {
                en: "Bumblebees are powerhouse pollinators distinguished by their large, fuzzy bodies and their unique ability to perform 'buzz pollination' (sonication). By rapidly vibrating their flight muscles while clinging to a flower, they can shake loose pollen from flowers that other pollinators cannot access — this technique is essential for tomatoes, peppers, blueberries, and cranberries.",
                es: "Los abejorros son polinizadores potentes que se distinguen por sus cuerpos grandes y peludos y su capacidad única para realizar la 'polinización por zumbido' (sonicación). Al vibrar rápidamente sus músculos de vuelo mientras se aferran a una flor, pueden sacudir el polen suelto de flores a las que otros polinizadores no pueden acceder.",
                fr: "Les bourdons sont des pollinisateurs puissants qui se distinguent par leur grand corps duveteux et leur capacité unique à effectuer une « pollinisation vibratile » (sonication). En faisant vibrer rapidement leurs muscles de vol tout en s'accrochant à une fleur, ils peuvent faire tomber le pollen des fleurs auxquelles les autres pollinisateurs ne peuvent pas accéder.",
                de: "Hummeln sind kraftvolle Bestäuber, die sich durch ihre großen, pelzigen Körper und ihre einzigartige Fähigkeit zur 'Vibrationsbestäubung' (Sonikation) auszeichnen. Indem sie ihre Flugmuskeln schnell vibrieren lassen, während sie sich an einer Blüte festhalten, können sie Pollen von Blüten lösen, die für andere Bestäuber unzugänglich sind.",
                zh: "大黄蜂是强有力的传粉者，以其巨大、毛茸茸的身体和独特的“嗡嗡授粉”（声波授粉）能力而著称。通过在抓住花朵时快速振动飞行肌肉，它们可以将其他传粉者无法接触到的花朵中的花粉震落。"
            },
            habitat: {
                en: "Temperate regions, grasslands, meadows, and gardens with abundant flowering plants.",
                es: "Regiones templadas, praderas, prados y jardines con abundantes plantas con flores.",
                fr: "Régions tempérées, prairies, prés et jardins avec d'abondantes plantes à fleurs.",
                de: "Gemäßigte Regionen, Grasländer, Wiesen und Gärten mit reichlich Blütenpflanzen.",
                zh: "温带地区、草原、草甸和拥有丰富开花植物的花园。"
            },
            conservation: {
                en: "Many bumblebee species are declining due to habitat loss and pesticide use. Araihan Measure: 19 / 25 (Stable to Declining).",
                es: "Muchas especies de abejorros están disminuyendo debido a la pérdida de hábitat y el uso de pesticidas. Medida Araihan: 19 / 25 (Estable a En declive).",
                fr: "De nombreuses espèces de bourdons sont en déclin en raison de la perte d'habitat et de l'utilisation de pesticides. Mesure Araihan : 19 / 25 (Stable à En déclin).",
                de: "Viele Hummelarten gehen aufgrund von Lebensraumverlust und Pestizideinsatz zurück. Araihan-Maß: 19 / 25 (Stabil bis Rückläufig).",
                zh: "由于栖息地丧失和农药使用，许多大黄蜂物种正在减少。Araihan测量：19 / 25（稳定至下降）。"
            },
            araihanMeasure: 19,
            conservationStatus: "Stable to Declining",
            glbPath: null,
            role: {
                en: "Large, fuzzy bees that are excellent pollinators for many wildflowers and crops",
                es: "Abejas grandes y peludas que son excelentes polinizadores para muchas flores silvestres y cultivos",
                fr: "Grandes abeilles duveteuses qui sont d'excellents pollinisateurs pour de nombreuses fleurs sauvages et cultures",
                de: "Große, pelzige Bienen, die ausgezeichnete Bestäuber für viele Wildblumen und Nutzpflanzen sind",
                zh: "大而毛茸茸的蜜蜂，是许多野花和作物的优秀传粉者"
            },
            funFacts: {
                en: [
                    "Bumblebees can fly in temperatures as low as 10°C, when most other bees cannot",
                    "They use 'buzz pollination' to shake pollen loose from stubborn flowers",
                    "A bumblebee's wings beat 200 times per second",
                    "Only the mated queen survives winter — she starts the entire colony anew each spring",
                    "They have smelly feet! They leave a chemical scent on flowers they've visited."
                ],
                es: [
                    "Los abejorros pueden volar en temperaturas tan bajas como 10°C, cuando la mayoría de las otras abejas no pueden",
                    "Usan la 'polinización por zumbido' para sacudir el polen de flores difíciles",
                    "Las alas de un abejorro baten 200 veces por segundo",
                    "Solo la reina apareada sobrevive el invierno; ella comienza toda la colonia de nuevo cada primavera",
                    "¡Tienen pies apestosos! Dejan un rastro químico en las flores que han visitado."
                ],
                fr: [
                    "Les bourdons peuvent voler à des températures aussi basses que 10°C, alors que la plupart des autres abeilles ne le peuvent pas",
                    "Ils utilisent la 'pollinisation vibratile' pour faire tomber le pollen des fleurs récalcitrantes",
                    "Les ailes d'un bourdon battent 200 fois par seconde",
                    "Seule la reine fécondée survit à l'hiver — elle recommence toute la colonie à chaque printemps",
                    "Ils ont les pieds qui puent ! Ils laissent une odeur chimique sur les fleurs qu'ils ont visitées."
                ],
                de: [
                    "Hummeln können bei Temperaturen von bis zu 10°C fliegen, wenn die meisten anderen Bienen dies nicht können",
                    "Sie nutzen die 'Vibrationsbestäubung', um Pollen von hartnäckigen Blüten zu lösen",
                    "Die Flügel einer Hummel schlagen 200 Mal pro Sekunde",
                    "Nur die begattete Königin überlebt den Winter — sie gründet im Frühjahr das gesamte Volk neu",
                    "Sie haben Stinkefüße! Sie hinterlassen einen chemischen Duft auf Blumen, die sie besucht haben."
                ],
                zh: [
                    "大黄蜂可以在低至10°C的温度下飞行，而大多数其他蜜蜂则不能",
                    "它们使用'嗡嗡传粉'来从顽固的花朵中震落花粉",
                    "大黄蜂的翅膀每秒振动200次",
                    "只有交配过的蜂后才能熬过冬天——她在每年春天重新开始整个群体",
                    "它们的脚很臭！它们会在访问过的花朵上留下化学气味。"
                ]
            },
            type: "natural"
        }
    ],
    birds: [
        {
            name: "Ruby-throated Hummingbird",
            slug: "ruby-throated-hummingbird",
            scientificName: "Archilochus colubris",
            category: "Birds",
            categoryIcon: "🐦",
            region: "North America",
            country: "North America",
            image: "/pollinators/hummingbird.jpg",
            imageAttribution: "Perky Pet",
            imageUrl: "https://www.perkypet.com/media/Articles/Perky-Pet/Ruby-throated-Hummingbird-Migration.jpg",
            description: {
                en: "Tiny, fast-flying birds that pollinate tubular flowers with their long beaks. Hummingbirds are important pollinators for many tubular flowers, transferring pollen as they feed on nectar with their long, specialized beaks.",
                es: "Pequeñas aves de vuelo rápido que polinizan flores tubulares con sus largos picos. Los colibríes son polinizadores importantes para muchas flores tubulares, transfiriendo polen mientras se alimentan de néctar con sus largos y especializados picos.",
                fr: "Petits oiseaux au vol rapide qui pollinisent les fleurs tubulaires avec leur long bec. Les colibris sont des pollinisateurs importants pour de nombreuses fleurs tubulaires, transférant le pollen lorsqu'ils se nourrissent de nectar avec leur long bec spécialisé.",
                de: "Winzige, schnell fliegende Vögel, die mit ihren langen Schnäbeln röhrenförmige Blüten bestäuben. Kolibris sind wichtige Bestäuber für viele röhrenförmige Blüten und übertragen Pollen, während sie sich mit ihren langen, spezialisierten Schnäbeln von Nektar ernähren.",
                zh: "用长喙为管状花授粉的小型快速飞行的鸟类。蜂鸟是许多管状花的重要授粉者，它们用长而特化的喙吸食花蜜时传播花粉。"
            },
            detailedDescription: {
                en: "The Ruby-throated Hummingbird is the only breeding hummingbird species in eastern North America and one of nature's most remarkable aviators. Weighing just 3-4 grams, these tiny birds beat their wings 53 times per second, allowing them to hover in place, fly backwards, and even upside down — feats no other bird can match. Their long, specialized bill and extensible tongue (which can lick nectar at 13 times per second) make them perfectly adapted for tubular flowers like trumpet vine, cardinal flower, and bee balm. During migration, they make an incredible nonstop 800 km flight across the Gulf of Mexico. As pollinators, hummingbirds are especially important for red and orange tubular flowers that have co-evolved specifically to attract them, as these flowers often have no landing platform and produce copious nectar accessible only to long-billed visitors.",
                es: "El colibrí de garganta roja es la única especie de colibrí que se reproduce en el este de América del Norte y uno de los aviadores más notables de la naturaleza. Con un peso de solo 3-4 gramos, estas pequeñas aves baten sus alas 53 veces por segundo, lo que les permite flotar en su lugar, volar hacia atrás e incluso boca abajo, hazañas que ninguna otra ave puede igualar. Durante la migración, realizan un increíble vuelo sin escalas de 800 km a través del Golfo de México.",
                fr: "Le colibri à gorge rubis est la seule espèce de colibri nicheur dans l'est de l'Amérique du Nord et l'un des aviateurs les plus remarquables de la nature. Pesant seulement 3 à 4 grammes, ces petits oiseaux battent des ailes 53 fois par seconde, ce qui leur permet de faire du surplace, de voler en arrière et même à l'envers. Lors de la migration, ils effectuent un incroyable vol sans escale de 800 km à travers le golfe du Mexique.",
                de: "Der Rubinkehlkolibri ist die einzige brütende Kolibriart im Osten Nordamerikas und einer der bemerkenswertesten Flieger der Natur. Mit einem Gewicht von nur 3-4 Gramm schlagen diese winzigen Vögel 53 Mal pro Sekunde mit ihren Flügeln, was es ihnen ermöglicht, auf der Stelle zu schweben, rückwärts und sogar kopfüber zu fliegen. Während des Zugs legen sie einen unglaublichen Nonstop-Flug von 800 km über den Golf von Mexiko zurück.",
                zh: "红喉蜂鸟是北美东部唯一的繁殖蜂鸟物种，也是自然界最杰出的飞行家之一。这些小鸟仅重3-4克，每秒拍打翅膀53次，使它们能够悬停、倒飞甚至倒挂——这是其他鸟类无法比拟的绝技。在迁徙过程中，它们在墨西哥湾进行了令人难以置信的800公里不间断飞行。"
            },
            habitat: {
                en: "Forests, gardens, and meadows throughout North America, especially areas with abundant nectar-producing flowers.",
                es: "Bosques, jardines y prados en toda América del Norte, especialmente áreas con abundantes flores productoras de néctar.",
                fr: "Forêts, jardins et prairies dans toute l'Amérique du Nord, en particulier dans les zones où les fleurs nectarifères sont abondantes.",
                de: "Wälder, Gärten und Wiesen in ganz Nordamerika, insbesondere Gebiete mit reichlich nektarproduzierenden Blumen.",
                zh: "整个北美的森林、花园和草地，特别是盛产花蜜花卉的地区。"
            },
            conservation: {
                en: "While not currently endangered, habitat loss and climate change pose threats. Araihan Measure: 22 / 25 (Stable).",
                es: "Aunque actualmente no está en peligro, la pérdida de hábitat y el cambio climático representan amenazas. Medida Araihan: 22 / 25 (Estable).",
                fr: "Bien qu'il ne soit pas actuellement en danger, la perte d'habitat et le changement climatique constituent des menaces. Mesure Araihan : 22 / 25 (Stable).",
                de: "Obwohl derzeit nicht gefährdet, stellen Lebensraumverlust und Klimawandel Bedrohungen dar. Araihan-Maß: 22 / 25 (Stabil).",
                zh: "虽然目前并未濒危，但栖息地丧失和气候变化构成了威胁。Araihan测量：22 / 25（稳定）。"
            },
            araihanMeasure: 22,
            conservationStatus: "Stable",
            glbPath: createGLBPath("Humming_bird.glb"),
            role: {
                en: "Tiny, fast-flying birds that pollinate tubular flowers with their long beaks",
                es: "Pequeñas aves de vuelo rápido que polinizan flores tubulares con sus largos picos",
                fr: "Petits oiseaux au vol rapide qui pollinisent les fleurs tubulaires avec leur long bec",
                de: "Winzige, schnell fliegende Vögel, die mit ihren langen Schnäbeln röhrenförmige Blüten bestäuben",
                zh: "用长喙为管状花授粉的小型快速飞行的鸟类"
            },
            funFacts: {
                en: [
                    "They beat their wings 53 times per second",
                    "They can fly backwards and upside down — unique among birds",
                    "Their heart beats up to 1,260 times per minute during flight",
                    "They migrate 800 km nonstop across the Gulf of Mexico",
                    "They consume half their body weight in sugar daily!"
                ],
                es: [
                    "Baten sus alas 53 veces por segundo",
                    "Pueden volar hacia atrás y boca abajo, algo único entre las aves",
                    "Su corazón late hasta 1,260 veces por minuto durante el vuelo",
                    "Migran 800 km sin escalas a través del Golfo de México",
                    "¡Consumen la mitad de su peso corporal en azúcar diariamente!"
                ],
                fr: [
                    "Ils battent des ailes 53 fois par seconde",
                    "Ils peuvent voler en arrière et à l'envers — unique chez les oiseaux",
                    "Leur cœur bat jusqu'à 1 260 fois par minute pendant le vol",
                    "Ils migrent sur 800 km sans escale à travers le golfe du Mexique",
                    "Ils consomment chaque jour la moitié de leur poids corporel en sucre !"
                ],
                de: [
                    "Sie schlagen 53 Mal pro Sekunde mit ihren Flügeln",
                    "Sie können rückwärts und kopfüber fliegen — einzigartig unter Vögeln",
                    "Ihr Herz schlägt während des Fluges bis zu 1.260 Mal pro Minute",
                    "Sie ziehen 800 km nonstop über den Golf von Mexiko",
                    "Sie verbrauchen täglich die Hälfte ihres Körpergewichts an Zucker!"
                ],
                zh: [
                    "它们每秒拍打翅膀53次",
                    "它们可以倒飞和倒挂——在鸟类中独一无二",
                    "飞行时它们的心跳每分钟高达1,260次",
                    "它们在墨西哥湾进行800公里的不间断迁徙",
                    "它们每天消耗体中一半的糖分！"
                ]
            },
            type: "natural"
        },
        {
            name: "Sunbird",
            slug: "sunbird",
            scientificName: "Nectariniidae",
            category: "Birds",
            categoryIcon: "🐦",
            region: "Africa, Asia, Australia",
            country: "Africa, Asia, Australia",
            image: "/pollinators/sunbird.jpg",
            imageAttribution: "Google",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpFy_aROGam4sOFp_agXDJyXb8Fp7LFvfbqcer03THNoJ0RmwABX6VOY4h3LJB1ogShshNhzj_-tsPmybaMAPiim-yDlpw08_5EAwEDzmRvg&s=10",
            description: {
                en: "Colorful nectar-feeding birds that pollinate many tropical flowers. Sunbirds are important pollinators in tropical and subtropical regions, visiting a wide variety of flowering plants.",
                es: "Coloridas aves que se alimentan de néctar y polinizan muchas flores tropicales. Los pájaros sol son polinizadores importantes en las regiones tropicales y subtropicales, visitando una amplia variedad de plantas con flores.",
                fr: "Oiseaux colorés se nourrissant de nectar qui pollinisent de nombreuses fleurs tropicales. Les souimangas sont des pollinisateurs importants dans les régions tropicales et subtropicales.",
                de: "Bunte nektarfressende Vögel, die viele tropische Blumen bestäuben. Nektarvögel sind wichtige Bestäuber in tropischen und subtropischen Regionen.",
                zh: "色彩斑斓的吸蜜鸟类，为许多热带花卉授粉。太阳鸟是热带和亚热带地区的重要授粉者。"
            },
            detailedDescription: {
                en: "Sunbirds are the Old World ecological counterparts of hummingbirds, filling the niche of nectar-feeding avian pollinators across Africa, Asia, and Australasia. With over 140 species in the family Nectariniidae, they display stunning iridescent plumage in males, with colors ranging from emerald green to deep purple and fiery orange. Unlike hummingbirds, most sunbirds cannot hover for extended periods and instead perch on flowers while feeding, though some species can hover briefly. Their curved bills and tubular tongues are perfectly adapted for extracting nectar from tubular flowers. Sunbirds play a crucial ecological role in pollinating native plants such as aloes, proteas, and many tropical flowering species. They are also important indicators of ecosystem health, as their populations respond quickly to habitat changes.",
                es: "Los pájaros sol son las contrapartes ecológicas del Viejo Mundo de los colibríes. Con más de 140 especies en la familia Nectariniidae, muestran un impresionante plumaje iridiscente en los machos. A diferencia de los colibríes, la mayoría de los pájaros sol no pueden flotar durante períodos prolongados y, en cambio, se posan en las flores mientras se alimentan.",
                fr: "Les souimangas sont les équivalents écologiques des colibris dans l'Ancien Monde. Avec plus de 140 espèces dans la famille Nectariniidae, ils arborent un magnifique plumage irisé chez les mâles. Contrairement aux colibris, la plupart des souimangas ne peuvent pas faire du surplace pendant de longues périodes et se perchent plutôt sur les fleurs pour s'alimenter.",
                de: "Nektarvögel sind das ökologische Gegenstück der alten Welt zu Kolibris. Mit über 140 Arten in der Familie Nectariniidae zeigen sie bei den Männchen ein atemberaubendes schillerndes Gefieder. Im Gegensatz zu Kolibris können die meisten Nektarvögel nicht längere Zeit schweben und sitzen stattdessen beim Fressen auf Blumen.",
                zh: "太阳鸟是蜂鸟在旧大陆的生态对应物。太阳鸟科有超过140种，雄性展示出令人惊叹的彩虹色羽毛。与蜂鸟不同，大多数太阳鸟不能长时间悬停，而是停在花朵上进食。"
            },
            habitat: {
                en: "Tropical and subtropical regions of Africa, Asia, and Australia, in forests, gardens, and open areas with flowering plants.",
                es: "Regiones tropicales y subtropicales de África, Asia y Australia, en bosques, jardines y áreas abiertas con plantas con flores.",
                fr: "Régions tropicales et subtropicales d'Afrique, d'Asie et d'Australie, dans les forêts, les jardins et les zones ouvertes avec des plantes à fleurs.",
                de: "Tropische und subtropische Regionen Afrikas, Asiens und Australiens, in Wäldern, Gärten und offenen Gebieten mit Blütenpflanzen.",
                zh: "非洲、亚洲和澳大利亚的热带和亚热带地区，森林、花园和开花植物丰富的开阔地区。"
            },
            conservation: {
                en: "Sunbird populations are generally stable but face threats from habitat destruction. Araihan Measure: 21 / 25 (Stable).",
                es: "Las poblaciones de pájaros sol son generalmente estables pero enfrentan amenazas por la destrucción del hábitat. Medida Araihan: 21 / 25 (Estable).",
                fr: "Les populations de souimangas sont généralement stables mais sont menacées par la destruction de leur habitat. Mesure Araihan : 21 / 25 (Stable).",
                de: "Nektarvogelpopulationen sind im Allgemeinen stabil, sind jedoch durch Lebensraumzerstörung bedroht. Araihan-Maß: 21 / 25 (Stabil).",
                zh: "太阳鸟种群通常稳定，但面临栖息地破坏的威胁。Araihan测量：21 / 25（稳定）。"
            },
            araihanMeasure: 21,
            conservationStatus: "Stable",
            glbPath: null,
            role: {
                en: "Colorful nectar-feeding birds that pollinate many tropical flowers",
                es: "Coloridas aves que se alimentan de néctar y polinizan muchas flores tropicales",
                fr: "Oiseaux colorés se nourrissant de nectar qui pollinisent de nombreuses fleurs tropicales",
                de: "Bunte nektarfressende Vögel, die viele tropische Blumen bestäuben",
                zh: "色彩斑斓的吸蜜鸟类，为许多热带花卉授粉"
            },
            funFacts: {
                en: [
                    "There are over 140 species of sunbirds worldwide",
                    "Male sunbirds have iridescent plumage that appears to change color in different light",
                    "They are the Old World equivalent of hummingbirds",
                    "Some species can hover briefly, though most perch while feeding",
                    "Their tubular tongues can extend far beyond their bill tip!"
                ],
                es: [
                    "Hay más de 140 especies de pájaros sol en todo el mundo",
                    "Los machos tienen un plumaje iridiscente que parece cambiar de color con diferente luz",
                    "Son el equivalente del Viejo Mundo de los colibríes",
                    "Algunas especies pueden flotar brevemente, aunque la mayoría se posa mientras se alimenta",
                    "¡Sus lenguas tubulares pueden extenderse mucho más allá de la punta de su pico!"
                ],
                fr: [
                    "Il existe plus de 140 espèces de souimangas dans le monde",
                    "Les mâles ont un plumage irisé qui semble changer de couleur sous différentes lumières",
                    "Ils sont l'équivalent des colibris dans l'Ancien Monde",
                    "Certaines espèces peuvent faire du surplace brièvement, bien que la plupart se perchent pour s'alimenter",
                    "Leur langue tubulaire peut s'étendre bien au-delà de la pointe de leur bec !"
                ],
                de: [
                    "Es gibt weltweit über 140 Arten von Nektarvögeln",
                    "Männliche Nektarvögel haben ein schillerndes Gefieder, das bei unterschiedlichem Licht die Farbe zu wechseln scheint",
                    "Sie sind das Gegenstück der Alten Welt zu Kolibris",
                    "Einige Arten können kurz schweben, obwohl die meisten beim Fressen sitzen",
                    "Ihre röhrenförmigen Zungen können weit über ihre Schnabelspitze hinausragen!"
                ],
                zh: [
                    "全世界有超过140种太阳鸟",
                    "雄性太阳鸟有彩虹色的羽毛，在不同的光线下似乎会改变颜色",
                    "它们是旧大陆的蜂鸟",
                    "有些物种可以短暂悬停，尽管大多数在进食时停歇",
                    "它们的管状舌头可以伸出喙尖很远！"
                ]
            },
            type: "natural"
        }
    ],
    butterflies: [
        {
            name: "Monarch Butterfly",
            slug: "monarch-butterfly",
            scientificName: "Danaus plexippus",
            category: "Butterflies & Moths",
            categoryIcon: "🦋",
            region: "North America",
            country: "North America",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwvyV1FnqOmMnxDbRl2qVTq1h8zjOQZt38v_MtiHiXO8WnFbU3vH4l6QEM69Y8U91Qjg-EXGZD4rqNRJSlPFbg9n03mIoKq832GwIcnWTtXQ&s=10",
            imageAttribution: "Google",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwvyV1FnqOmMnxDbRl2qVTq1h8zjOQZt38v_MtiHiXO8WnFbU3vH4l6QEM69Y8U91Qjg-EXGZD4rqNRJSlPFbg9n03mIoKq832GwIcnWTtXQ&s=10",
            description: {
                en: "Famous migratory butterflies that pollinate milkweed and other wildflowers. Monarchs are important pollinators during their long migrations, visiting numerous flowering plants along their route.",
                es: "Famosas mariposas migratorias que polinizan el algodoncillo y otras flores silvestres. Las monarcas son polinizadores importantes durante sus largas migraciones.",
                fr: "Papillons migrateurs célèbres qui pollinisent l'asclépiade et d'autres fleurs sauvages. Les monarques sont des pollinisateurs importants lors de leurs longues migrations.",
                de: "Berühmte wandernde Schmetterlinge, die Wolfsmilch und andere Wildblumen bestäuben. Monarchen sind während ihrer langen Wanderungen wichtige Bestäuber.",
                zh: "著名的迁徙蝴蝶，为乳草和其他野花授粉。君主斑蝶在长途迁徙过程中是重要的授粉者。"
            },
            detailedDescription: {
                en: "The Monarch butterfly is one of the most iconic insects in the world, renowned for its spectacular multi-generational migration spanning up to 4,800 km from southern Canada to central Mexico. Their striking orange-and-black wings serve as a warning to predators — monarchs are toxic due to cardenolide compounds absorbed from milkweed plants during their caterpillar stage. As pollinators, monarchs visit a wide variety of wildflowers during migration, including goldenrod, asters, and blazing star, transferring pollen across vast geographical distances. The monarch's four-generation annual cycle is remarkable: three summer generations live 2-6 weeks each, while the 'super generation' born in late summer extends its life to 8-9 months to complete the entire migration and overwinter. Monarch populations have declined by approximately 80% over the past two decades.",
                es: "La mariposa monarca es uno de los insectos más emblemáticos del mundo, conocida por su espectacular migración multigeneracional que abarca hasta 4.800 km desde el sur de Canadá hasta el centro de México. Sus llamativas alas naranjas y negras sirven de advertencia a los depredadores: las monarcas son tóxicas debido a los compuestos cardenólidos absorbidos de las plantas de algodoncillo. Como polinizadores, las monarcas visitan una amplia variedad de flores silvestres durante la migración.",
                fr: "Le papillon monarque est l'un des insectes les plus emblématiques au monde, réputé pour sa spectaculaire migration multigénérationnelle s'étendant sur 4 800 km, du sud du Canada au centre du Mexique. Ses ailes orange et noires frappantes servent d'avertissement aux prédateurs : les monarques sont toxiques en raison des composés cardénolides absorbés par les plantes d'asclépiade.",
                de: "Der Monarchfalter ist eines der ikonischsten Insekten der Welt, bekannt für seine spektakuläre Migration über mehrere Generationen, die bis zu 4.800 km vom südlichen Kanada bis nach Zentralmexiko reicht. Ihre auffälligen orange-schwarzen Flügel dienen als Warnung an Raubtiere – Monarchen sind giftig aufgrund von Cardenolidverbindungen, die sie während ihres Raupenstadiums aus Wolfsmilchpflanzen aufnehmen.",
                zh: "君主斑蝶是世界上最具标志性的昆虫之一，以其壮观的多代迁徙而闻名，跨越从加拿大南部到墨西哥中部的4800公里。它们醒目的橙黑相间的翅膀是对捕食者的警告——由于在毛虫阶段从乳草植物中吸收了强心苷化合物，君主斑蝶是有毒的。作为授粉者，君主斑蝶在迁徙过程中访问各种野花。"
            },
            habitat: {
                en: "Meadows, fields, and gardens across North America, with specific overwintering sites in Mexico and California.",
                es: "Prados, campos y jardines en toda América del Norte, con sitios específicos de hibernación en México y California.",
                fr: "Prairies, champs et jardins à travers l'Amérique du Nord, avec des sites d'hivernage spécifiques au Mexique et en Californie.",
                de: "Wiesen, Felder und Gärten in ganz Nordamerika, mit speziellen Überwinterungsorten in Mexiko und Kalifornien.",
                zh: "整个北美的草地、田野和花园，在墨西哥和加利福尼亚有特定的越冬地点。"
            },
            conservation: {
                en: "Monarch populations have declined significantly due to habitat loss and pesticide use. Araihan Measure: 17 / 25 (Declining).",
                es: "Las poblaciones de monarca han disminuido significativamente debido a la pérdida de hábitat y el uso de pesticidas. Medida Araihan: 17 / 25 (En declive).",
                fr: "Les populations de monarques ont considérablement diminué en raison de la perte d'habitat et de l'utilisation de pesticides. Mesure Araihan : 17 / 25 (En déclin).",
                de: "Monarchpopulationen sind aufgrund von Lebensraumverlust und Pestizideinsatz erheblich zurückgegangen. Araihan-Maß: 17 / 25 (Rückläufig).",
                zh: "由于栖息地丧失和农药使用，君主斑蝶种群数量显著下降。Araihan测量：17 / 25（下降）。"
            },
            araihanMeasure: 17,
            conservationStatus: "Declining",
            glbPath: createGLBPath("Final_Textured_Butterfly.glb"),
            role: {
                en: "Famous migratory butterflies that pollinate milkweed and other wildflowers",
                es: "Famosas mariposas migratorias que polinizan el algodoncillo y otras flores silvestres",
                fr: "Papillons migrateurs célèbres qui pollinisent l'asclépiade et d'autres fleurs sauvages",
                de: "Berühmte wandernde Schmetterlinge, die Wolfsmilch und andere Wildblumen bestäuben",
                zh: "著名的迁徙蝴蝶，为乳草和其他野花授粉"
            },
            funFacts: {
                en: [
                    "They migrate up to 4,800 km from Canada to Mexico",
                    "The 'super generation' lives 8-9 months — 10x longer than summer butterflies",
                    "They are toxic to predators thanks to milkweed chemicals",
                    "Their populations have declined ~80% in the past 20 years",
                    "Millions cluster together on single trees in Mexico to stay warm."
                ],
                es: [
                    "Migran hasta 4.800 km desde Canadá hasta México",
                    "La 'supergeneración' vive 8-9 meses, 10 veces más que las mariposas de verano",
                    "Son tóxicas para los depredadores gracias a los químicos del algodoncillo",
                    "Sus poblaciones han disminuido ~80% en los últimos 20 años",
                    "Millones se agrupan en árboles individuales en México para mantenerse calientes."
                ],
                fr: [
                    "Ils migrent jusqu'à 4 800 km du Canada au Mexique",
                    "La 'super génération' vit 8 à 9 mois — 10 fois plus longtemps que les papillons d'été",
                    "Ils sont toxiques pour les prédateurs grâce aux produits chimiques de l'asclépiade",
                    "Leurs populations ont diminué d'environ 80 % au cours des 20 dernières années",
                    "Des millions se rassemblent sur des arbres uniques au Mexique pour se réchauffer."
                ],
                de: [
                    "Sie ziehen bis zu 4.800 km von Kanada nach Mexiko",
                    "Die 'Supergeneration' lebt 8-9 Monate — 10x länger als Sommerfalter",
                    "Dank Wolfsmilchchemikalien sind sie für Raubtiere giftig",
                    "Ihre Populationen sind in den letzten 20 Jahren um ~80% zurückgegangen",
                    "Millionen drängen sich auf einzelnen Bäumen in Mexiko zusammen, um warm zu bleiben."
                ],
                zh: [
                    "它们从加拿大迁徙到墨西哥长达4,800公里",
                    "‘超级一代’寿命长达8-9个月——是夏季蝴蝶的10倍",
                    "由于乳草中的化学物质，它们对捕食者有毒",
                    "在过去20年中，它们的种群数量下降了约80%",
                    "数百万只聚集在墨西哥的一棵树上保暖。"
                ]
            },
            type: "natural"
        },
        {
            name: "Hummingbird Moth",
            slug: "hummingbird-moth",
            scientificName: "Hemaris spp.",
            category: "Butterflies & Moths",
            categoryIcon: "🦋",
            region: "North America, Europe, Asia",
            country: "North America, Europe, Asia",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ZJqfsTlFdvqrYEXtvpJdgRQDA1vI117-Moqq6LsEibEHzO_eIqArmaWHCw0l2Da2FRzHjBadHT68iwUGNqOTxZqg1vkVtYlokoBNi02y&s=10",
            imageAttribution: "Google",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ZJqfsTlFdvqrYEXtvpJdgRQDA1vI117-Moqq6LsEibEHzO_eIqArmaWHCw0l2Da2FRzHjBadHT68iwUGNqOTxZqg1vkVtYlokoBNi02y&s=10",
            description: {
                en: "Moth species that mimic hummingbirds in appearance and behavior. Hummingbird moths are important pollinators, especially for tubular flowers. They hover like hummingbirds while feeding on nectar.",
                es: "Especies de polillas que imitan a los colibríes en apariencia y comportamiento. Las polillas colibrí son polinizadores importantes, especialmente para las flores tubulares. Flotan como colibríes mientras se alimentan de néctar.",
                fr: "Espèces de papillons de nuit qui imitent les colibris en apparence et comportement. Les sphinx colibris sont des pollinisateurs importants, en particulier pour les fleurs tubulaires.",
                de: "Mottenarten, die Kolibris in Aussehen und Verhalten nachahmen. Taubenschwänzchen sind wichtige Bestäuber, insbesondere für röhrenförmige Blüten.",
                zh: "在外观和行为上模仿蜂鸟的飞蛾物种。蜂鸟蛾是重要的授粉者，特别是对于管状花卉。它们像蜂鸟一样悬停吸食花蜜。"
            },
            detailedDescription: {
                en: "Hummingbird moths (genus Hemaris) are among nature's most convincing mimics, so closely resembling hummingbirds in flight that they routinely fool experienced birdwatchers. These hawk moths hover in front of flowers with audible wingbeats, probing deep tubular blooms with their long proboscis. Unlike most moths, hummingbird moths are diurnal (day-active) and have partially transparent wings that give them a distinctive appearance. They are extremely efficient pollinators for deep-throated flowers like honeysuckle, bee balm, phlox, and verbena. Their hovering flight allows them to visit flowers that lack landing platforms, and their long proboscis enables access to nectar reserves beyond the reach of many other pollinators. The Hummingbird Hawk-moth (Macroglossum stellatarum) can reach speeds of 18 km/h and has excellent color vision.",
                es: "Las polillas colibrí (género Hemaris) se encuentran entre los imitadores más convincentes de la naturaleza, pareciéndose tanto a los colibríes en vuelo que habitualmente engañan a los observadores de aves experimentados. Estas polillas halcón flotan frente a las flores con aleteos audibles, sondeando flores tubulares profundas con su larga probóscide.",
                fr: "Les sphinx colibris (genre Hemaris) sont parmi les imitateurs les plus convaincants de la nature, ressemblant tellement aux colibris en vol qu'ils trompent régulièrement les ornithologues expérimentés. Ces sphinx font du surplace devant les fleurs avec des battements d'ailes audibles.",
                de: "Taubenschwänzchen (Gattung Hemaris) gehören zu den überzeugendsten Nachahmern der Natur und ähneln Kolibris im Flug so sehr, dass sie regelmäßig erfahrene Vogelbeobachter täuschen. Diese Schwärmer schweben mit hörbaren Flügelschlägen vor Blumen und sondieren tiefe röhrenförmige Blüten mit ihrem langen Rüssel.",
                zh: "蜂鸟蛾（Hemaris属）是自然界最令人信服的模仿者之一，在飞行中非常像蜂鸟，经常欺骗经验丰富的观鸟者。这些天蛾在花前悬停，发出可听见的翅膀拍打声，用长长的喙探测深管状花朵。"
            },
            habitat: {
                en: "Gardens, meadows, and open areas with abundant flowering plants. Found in temperate regions worldwide.",
                es: "Jardines, prados y áreas abiertas con abundantes plantas con flores. Se encuentra en regiones templadas de todo el mundo.",
                fr: "Jardins, prairies et zones ouvertes avec des plantes à fleurs abondantes. Trouvé dans les régions tempérées du monde entier.",
                de: "Gärten, Wiesen und offene Flächen mit reichlich Blütenpflanzen. In gemäßigten Regionen weltweit zu finden.",
                zh: "花园、草地和开花植物丰富的开阔地区。遍布世界各地的温带地区。"
            },
            conservation: {
                en: "Hummingbird moth populations are generally stable but face threats from habitat loss and pesticide use. Araihan Measure: 19 / 25 (Stable).",
                es: "Las poblaciones de polilla colibrí son generalmente estables pero enfrentan amenazas por pérdida de hábitat y uso de pesticidas. Medida Araihan: 19 / 25 (Estable).",
                fr: "Les populations de sphinx colibris sont généralement stables mais sont menacées par la perte d'habitat et l'utilisation de pesticides. Mesure Araihan : 19 / 25 (Stable).",
                de: "Taubenschwänzchenpopulationen sind im Allgemeinen stabil, sind jedoch durch Lebensraumverlust und Pestizideinsatz bedroht. Araihan-Maß: 19 / 25 (Stabil).",
                zh: "蜂鸟蛾种群通常稳定，但面临栖息地丧失和农药使用的威胁。Araihan测量：19 / 25（稳定）。"
            },
            araihanMeasure: 19,
            conservationStatus: "Stable",
            glbPath: createGLBPath("Normal__Humming_Bird_Moth_Glb.glb"),
            role: {
                en: "Moth species that mimic hummingbirds in appearance and behavior",
                es: "Especies de polillas que imitan a los colibríes en apariencia y comportamiento",
                fr: "Espèces de papillons de nuit qui imitent les colibris en apparence et comportement",
                de: "Mottenarten, die Kolibris in Aussehen und Verhalten nachahmen",
                zh: "在外观和行为上模仿蜂鸟的飞蛾物种"
            },
            funFacts: {
                en: [
                    "They are so convincing that they regularly fool experienced birdwatchers",
                    "Unlike most moths, they are active during the day",
                    "They can reach flight speeds of 18 km/h",
                    "Their wings are partially transparent, giving them a unique appearance"
                ],
                es: [
                    "Son tan convincentes que regularmente engañan a los observadores de aves experimentados",
                    "A diferencia de la mayoría de las polillas, son activas durante el día",
                    "Pueden alcanzar velocidades de vuelo de 18 km/h",
                    "Sus alas son parcialmente transparentes, dándoles una apariencia única"
                ],
                fr: [
                    "Ils sont si convaincants qu'ils trompent régulièrement les ornithologues expérimentés",
                    "Contrairement à la plupart des papillons de nuit, ils sont actifs le jour",
                    "Ils peuvent atteindre des vitesses de vol de 18 km/h",
                    "Leurs ailes sont partiellement transparentes, ce qui leur donne une apparence unique"
                ],
                de: [
                    "Sie sind so überzeugend, dass sie regelmäßig erfahrene Vogelbeobachter täuschen",
                    "Im Gegensatz zu den meisten Motten sind sie tagaktiv",
                    "Sie können Fluggeschwindigkeiten von 18 km/h erreichen",
                    "Ihre Flügel sind teilweise transparent, was ihnen ein einzigartiges Aussehen verleiht"
                ],
                zh: [
                    "它们非常令人信服，经常欺骗经验丰富的观鸟者",
                    "与大多数飞蛾不同，它们在白天活动",
                    "它们的飞行速度可达18公里/小时",
                    "它们的翅膀部分透明，赋予它们独特的外观"
                ]
            },
            type: "natural"
        },
        {
            name: "Swallowtail Butterfly",
            slug: "swallowtail-butterfly",
            scientificName: "Papilionidae",
            category: "Butterflies & Moths",
            categoryIcon: "🦋",
            region: "Global",
            country: "Global",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTebdAtM0-9vq1GyL7aQIj0DfmlL50P2PNJIsncFdkBlCvBbPNq_7wY8NDw7cfYdt4D1akFw1EtjKih55BI5Pm77nAOwK5JIrNIRneGtpCI&s=10",
            imageAttribution: "Google",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTebdAtM0-9vq1GyL7aQIj0DfmlL50P2PNJIsncFdkBlCvBbPNq_7wY8NDw7cfYdt4D1akFw1EtjKih55BI5Pm77nAOwK5JIrNIRneGtpCI&s=10",
            description: {
                en: "Large, colorful butterflies with distinctive tail-like extensions on their wings. Swallowtails are important pollinators for many flowering plants, especially those with deep corollas.",
                es: "Grandes mariposas coloridas con extensiones distintivas en forma de cola en sus alas. Las colas de golondrina son polinizadores importantes para muchas plantas con flores.",
                fr: "Grands papillons colorés avec des extensions distinctives en forme de queue sur leurs ailes. Les porte-queues sont des pollinisateurs importants pour de nombreuses plantes à fleurs.",
                de: "Große, bunte Schmetterlinge mit markanten schwanzartigen Verlängerungen an ihren Flügeln. Schwalbenschwänze sind wichtige Bestäuber für viele Blütenpflanzen.",
                zh: "大而多彩的蝴蝶，翅膀上有独特的尾状延伸。凤蝶是许多开花植物的重要授粉者，特别是那些花冠深的植物。"
            },
            detailedDescription: {
                en: "The Swallowtail family (Papilionidae) comprises over 550 species of some of the world's largest and most spectacular butterflies. Named for the tail-like extensions on their hindwings that resemble the forked tail of a swallow, these butterflies are found on every continent except Antarctica. Swallowtails are important pollinators for deep-throated flowers, as their long proboscis can reach nectar that shorter-tongued insects cannot access. Many swallowtail species exhibit remarkable defense mechanisms, including toxic body chemicals, mimicry of unpalatable species, and eyespot patterns that confuse predators. The caterpillars of many swallowtail species possess osmeterium — a forked, orange gland behind the head that emits foul-smelling chemicals when the larva is threatened. Swallowtails serve as important bioindicators, and their diversity in an area often correlates with overall ecosystem health.",
                es: "La familia de las colas de golondrina (Papilionidae) comprende más de 550 especies de algunas de las mariposas más grandes y espectaculares del mundo. Llamadas así por las extensiones en forma de cola en sus alas traseras que se asemejan a la cola bifurcada de una golondrina.",
                fr: "La famille des porte-queues (Papilionidae) comprend plus de 550 espèces parmi les plus grands et les plus spectaculaires papillons du monde. Nommés d'après les extensions en forme de queue sur leurs ailes postérieures qui ressemblent à la queue fourchue d'une hirondelle.",
                de: "Die Familie der Ritterfalter (Papilionidae) umfasst über 550 Arten einiger der größten und spektakulärsten Schmetterlinge der Welt. Benannt nach den schwanzartigen Verlängerungen an ihren Hinterflügeln, die dem gegabelten Schwanz einer Schwalbe ähneln.",
                zh: "凤蝶科（Papilionidae）包括超过550种世界上最大和最壮观的蝴蝶。因其后翅上的尾状延伸类似于燕子的分叉尾巴而得名，这些蝴蝶遍布除南极洲以外的每个大陆。凤蝶是深喉花朵的重要授粉者，因为它们的长喙可以触及短舌昆虫无法触及的花蜜。"
            },
            habitat: {
                en: "Found in diverse habitats worldwide, from forests to gardens, wherever flowering plants grow.",
                es: "Se encuentra en diversos hábitats en todo el mundo, desde bosques hasta jardines, dondequiera que crezcan plantas con flores.",
                fr: "Trouvé dans divers habitats à travers le monde, des forêts aux jardins, partout où poussent des plantes à fleurs.",
                de: "In verschiedenen Lebensräumen weltweit zu finden, von Wäldern bis zu Gärten, überall dort, wo Blütenpflanzen wachsen.",
                zh: "遍布世界各地的各种栖息地，从森林到花园，只要有开花植物生长的地方。"
            },
            conservation: {
                en: "Many swallowtail species are stable, but some face threats from habitat loss. Araihan Measure: 20 / 25 (Stable).",
                es: "Muchas especies de cola de golondrina son estables, pero algunas enfrentan amenazas por la pérdida de hábitat. Medida Araihan: 20 / 25 (Estable).",
                fr: "De nombreuses espèces de porte-queues sont stables, mais certaines sont menacées par la perte d'habitat. Mesure Araihan : 20 / 25 (Stable).",
                de: "Viele Schwalbenschwanzarten sind stabil, aber einige sind durch Lebensraumverlust bedroht. Araihan-Maß: 20 / 25 (Stabil).",
                zh: "许多凤蝶物种是稳定的，但有些面临栖息地丧失的威胁。Araihan测量：20 / 25（稳定）。"
            },
            araihanMeasure: 20,
            conservationStatus: "Stable",
            glbPath: null,
            role: {
                en: "Large, colorful butterflies with distinctive tail-like extensions on their wings",
                es: "Grandes mariposas coloridas con extensiones distintivas en forma de cola en sus alas",
                fr: "Grands papillons colorés avec des extensions distinctives en forme de queue sur leurs ailes",
                de: "Große, bunte Schmetterlinge mit markanten schwanzartigen Verlängerungen an ihren Flügeln",
                zh: "大而多彩的蝴蝶，翅膀上有独特的尾状延伸"
            },
            funFacts: {
                en: [
                    "There are over 550 species worldwide — found on every continent except Antarctica",
                    "Their caterpillars have a special stinky gland (osmeterium) for defense",
                    "Some species mimic toxic butterflies to avoid predators",
                    "The largest swallowtail, Queen Alexandra's Birdwing, has a 31 cm wingspan",
                    "They often flutter their wings while feeding to maintain balance."
                ],
                es: [
                    "Hay más de 550 especies en todo el mundo: se encuentran en todos los continentes excepto la Antártida",
                    "Sus orugas tienen una glándula apestosa especial (osmeterium) para defensa",
                    "Algunas especies imitan a mariposas tóxicas para evitar depredadores",
                    "La cola de golondrina más grande, el ala de pájaro de la reina Alejandra, tiene una envergadura de 31 cm",
                    "A menudo aletean mientras se alimentan para mantener el equilibrio."
                ],
                fr: [
                    "Il existe plus de 550 espèces dans le monde — on les trouve sur tous les continents sauf l'Antarctique",
                    "Leurs chenilles ont une glande malodorante spéciale (osmeterium) pour la défense",
                    "Certaines espèces imitent les papillons toxiques pour éviter les prédateurs",
                    "Le plus grand porte-queue, l'aile d'oiseau de la reine Alexandra, a une envergure de 31 cm",
                    "Ils battent souvent des ailes en se nourrissant pour garder l'équilibre."
                ],
                de: [
                    "Es gibt weltweit über 550 Arten – auf jedem Kontinent außer der Antarktis zu finden",
                    "Ihre Raupen haben eine spezielle stinkende Drüse (Osmeterium) zur Verteidigung",
                    "Einige Arten ahmen giftige Schmetterlinge nach, um Raubtiere zu vermeiden",
                    "Der größte Schwalbenschwanz, Königin Alexandras Vogelflügler, hat eine Flügelspannweite von 31 cm",
                    "Sie flattern oft mit den Flügeln beim Fressen, um das Gleichgewicht zu halten."
                ],
                zh: [
                    "全世界有超过550种——除南极洲外各大洲均有发现",
                    "它们的毛虫有一个特殊的臭腺（osmeterium）用于防御",
                    "有些物种模仿有毒蝴蝶以避开捕食者",
                    "最大的凤蝶，亚历山大女皇鸟翼凤蝶，翼展达31厘米",
                    "它们在进食时经常拍打翅膀以保持平衡。"
                ]
            },
            type: "natural"
        }
    ],
    bats: [
        {
            name: "Lesser Long-nosed Bat",
            slug: "lesser-long-nosed-bat",
            scientificName: "Leptonycteris yerbabuenae",
            category: "Bats",
            categoryIcon: "🦇",
            region: "Mexico, Southwestern US",
            country: "Mexico, Southwestern US",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRvDuRMzdpIBfnZ6neoKcgwYXsiajhW-lApxKGgg8YTMLIVgl2YCwHkgF58bd0Cxn5eOdzTwAAyhmq_JJoum-NO23YTzq2xCYESPFF5cfV&s=10",
            imageAttribution: "Google",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRvDuRMzdpIBfnZ6neoKcgwYXsiajhW-lApxKGgg8YTMLIVgl2YCwHkgF58bd0Cxn5eOdzTwAAyhmq_JJoum-NO23YTzq2xCYESPFF5cfV&s=10",
            description: {
                en: "Nocturnal pollinators that feed on nectar and pollinate night-blooming flowers. These bats are crucial pollinators for agave, cacti, and other night-blooming plants in desert ecosystems.",
                es: "Polinizadores nocturnos que se alimentan de néctar y polinizan flores que florecen de noche. Estos murciélagos son polinizadores cruciales para el agave, los cactus y otras plantas del desierto.",
                fr: "Polinisateurs nocturnes qui se nourrissent de nectar et pollinisent les fleurs à floraison nocturne. Ces chauves-souris sont des pollinisateurs cruciaux pour l'agave, les cactus et d'autres plantes du désert.",
                de: "Nachtaktive Bestäuber, die sich von Nektar ernähren und nachtblühende Blumen bestäuben. Diese Fledermäuse sind entscheidende Bestäuber für Agaven, Kakteen und andere Wüstenpflanzen.",
                zh: "以花蜜为食并为夜间开花的植物授粉的夜行性授粉者。这些蝙蝠是沙漠生态系统中龙舌兰、仙人掌和其他夜间开花植物的关键授粉者。"
            },
            detailedDescription: {
                en: "The Lesser Long-nosed Bat is one of the most important nocturnal pollinators in the Americas, playing an irreplaceable role in desert ecosystems of Mexico and the southwestern United States. These bats have elongated snouts and tongues up to a third of their body length, perfectly adapted for reaching deep into the flowers of columnar cacti and agave plants. Without these bats, the $2.3 billion tequila industry would collapse — they are the primary pollinators of the blue agave plant. Lesser Long-nosed Bats are migratory, following the 'nectar trail' of blooming cacti and agave northward from Mexico into Arizona and New Mexico each spring. A single bat can visit 30+ cactus flowers per night, and their faces become coated with pollen that they transfer between plants. Once listed as endangered in the 1980s, concerted conservation efforts have led to a remarkable recovery, making it one of the few species to be delisted from the Endangered Species Act.",
                es: "El murciélago magueyero menor es uno de los polinizadores nocturnos más importantes de las Américas, desempeñando un papel insustituible en los ecosistemas desérticos de México y el suroeste de los Estados Unidos. Estos murciélagos tienen hocicos alargados y lenguas de hasta un tercio de la longitud de su cuerpo, perfectamente adaptados para llegar a lo profundo de las flores.",
                fr: "La chauve-souris à long nez est l'un des pollinisateurs nocturnes les plus importants des Amériques, jouant un rôle irremplaçable dans les écosystèmes désertiques du Mexique et du sud-ouest des États-Unis. Ces chauves-souris ont un museau allongé et une langue mesurant jusqu'un tiers de la longueur de leur corps.",
                de: "Die Kleine Langnasenfledermaus ist einer der wichtigsten nachtaktiven Bestäuber in Amerika und spielt eine unersetzliche Rolle in den Wüstenökosystemen Mexikos und des südwestlichen USA. Diese Fledermäuse haben verlängerte Schnauzen und Zungen, die bis zu einem Drittel ihrer Körperlänge betragen.",
                zh: "小长鼻蝠是美洲最重要的夜行性授粉者之一，在墨西哥和美国西南部的沙漠生态系统中发挥着不可替代的作用。这些蝙蝠有细长的鼻子和长达体长三分之一的舌头，非常适应深入柱状仙人掌和龙舌兰植物的花朵中。"
            },
            habitat: {
                en: "Desert and semi-desert regions of Mexico and the southwestern United States, especially areas with agave and cacti.",
                es: "Regiones desérticas y semidesérticas de México y el suroeste de los Estados Unidos, especialmente áreas con agave y cactus.",
                fr: "Régions désertiques et semi-désertiques du Mexique et du sud-ouest des États-Unis, en particulier les zones avec des agaves et des cactus.",
                de: "Wüsten- und Halbwüstenregionen Mexikos und des südwestlichen der Vereinigten Staaten, insbesondere Gebiete mit Agaven und Kakteen.",
                zh: "墨西哥和美国西南部的沙漠和半沙漠地区，特别是这有龙舌兰和仙人掌的地区。"
            },
            conservation: {
                en: "Once endangered, populations have recovered but still face threats from habitat loss. Araihan Measure: 18 / 25 (Recovering).",
                es: "Una vez en peligro, las poblaciones se han recuperado pero aún enfrentan amenazas por la pérdida de hábitat. Medida Araihan: 18 / 25 (En recuperación).",
                fr: "Autrefois en voie de disparition, les populations se sont rétablies mais sont toujours menacées par la perte d'habitat. Mesure Araihan : 18 / 25 (En rétablissement).",
                de: "Einst gefährdet, haben sich die Populationen erholt, sind aber immer noch durch Lebensraumverlust bedroht. Araihan-Maß: 18 / 25 (Sich erholend).",
                zh: "曾经濒临灭绝，种群现已恢复，但仍面临栖息地丧失的威胁。Araihan测量：18 / 25（恢复中）。"
            },
            araihanMeasure: 18,
            conservationStatus: "Recovering",
            glbPath: null,
            role: {
                en: "Nocturnal pollinators that feed on nectar and pollinate night-blooming flowers",
                es: "Polinizadores nocturnos que se alimentan de néctar y polinizan flores que florecen de noche",
                fr: "Polinisateurs nocturnes qui se nourrissent de nectar et pollinisent les fleurs à floraison nocturne",
                de: "Nachtaktive Bestäuber, die sich von Nektar ernähren und nachtblühende Blumen bestäuben",
                zh: "以花蜜为食并为夜间开花的植物授粉的夜行性授粉者"
            },
            funFacts: {
                en: [
                    "Without these bats, the $2.3 billion tequila industry would not exist",
                    "Their tongue can be a third of their body length",
                    "They visit 30+ cactus flowers per night",
                    "They were delisted from the Endangered Species Act — a rare conservation success",
                    "They can travel up to 100 miles in a single night foraging for nectar."
                ],
                es: [
                    "Sin estos murciélagos, la industria del tequila de $2.3 mil millones no existiría",
                    "Su lengua puede ser un tercio de la longitud de su cuerpo",
                    "Visitan más de 30 flores de cactus por noche",
                    "Fueron eliminados de la Ley de Especies en Peligro de Extinción: un raro éxito de conservación",
                    "Pueden viajar hasta 100 millas en una sola noche buscando néctar."
                ],
                fr: [
                    "Sans ces chauves-souris, l'industrie de la tequila de 2,3 milliards de dollars n'existerait pas",
                    "Leur langue peut faire un tiers de la longueur de leur corps",
                    "Ils visitent plus de 30 fleurs de cactus par nuit",
                    "Ils ont été retirés de la liste des espèces en voie de disparition — un rare succès de conservation",
                    "Ils peuvent parcourir jusqu'à 160 km en une seule nuit pour chercher du nectar."
                ],
                de: [
                    "Ohne diese Fledermäuse würde die 2,3-Milliarden-Dollar-Tequila-Industrie nicht existieren",
                    "Ihre Zunge kann ein Drittel ihrer Körperlänge betragen",
                    "Sie besuchen pro Nacht mehr als 30 Kaktusblüten",
                    "Sie wurden von der Liste der gefährdeten Arten gestrichen – ein seltener Erfolg im Naturschutz",
                    "Sie können in einer einzigen Nacht bis zu 160 km auf der Suche nach Nektar zurücklegen."
                ],
                zh: [
                    "如果没有这些蝙蝠，价值23亿美元的龙舌兰酒产业将不复存在",
                    "它们的舌头可以是体长的三分之一",
                    "它们每晚访问30多朵仙人掌花",
                    "它们被移出了《濒危物种法》名单——这是罕见的保护成功案例",
                    "它们可以在一夜之间飞行多达100英里寻找花蜜。"
                ]
            },
            type: "natural"
        }
    ],
    beetles: [
        {
            name: "Flower Beetle",
            slug: "flower-beetle",
            scientificName: "Coleoptera sp.",
            category: "Beetles",
            categoryIcon: "🪲",
            region: "Global",
            country: "Global",
            image: "data:image/jpeg;base64,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",
            imageAttribution: "User Provided",
            imageUrl: "#",
            description: {
                en: "Diverse group of insects that pollinate flowers while feeding on pollen and nectar. Beetles are among the oldest pollinators, visiting flowers to feed on pollen and nectar. They are particularly important for primitive flowering plants.",
                es: "Grupo diverso de insectos que polinizan flores mientras se alimentan de polen y néctar. Los escarabajos se encuentran entre los polinizadores más antiguos, visitando flores para alimentarse.",
                fr: "Groupe diversifié d'insectes qui pollinisent les fleurs tout en se nourrissant de pollen et de nectar. Les coléoptères sont parmi les plus anciens pollinisateurs.",
                de: "Diverse Gruppe von Insekten, die Blumen bestäuben, während sie sich von Pollen und Nektar ernähren. Käfer gehören zu den ältesten Bestäubern.",
                zh: "多样化的昆虫群体，在以花粉和花蜜为食的同时为花朵授粉。甲虫是最古老的授粉者之一，访问花朵以获取食物。"
            },
            detailedDescription: {
                en: "Beetles are the original pollinators — they began pollinating plants over 150 million years ago, long before bees evolved. This ancient relationship is called 'cantharophily' (beetle pollination), and many of the world's most primitive flowering plants, including magnolias, water lilies, and spicebush, still rely primarily on beetle pollination today. Beetle-pollinated flowers tend to be large, strongly scented (often fruity or spicy), white or dull-colored, and bowl-shaped with easily accessible pollen. Beetles are sometimes called 'mess and soil' pollinators because they chew through flower petals and defecate within blooms. However, their pollination services are invaluable — with over 400,000 described species, beetles (order Coleoptera) represent the most species-rich group of organisms on Earth, and flower-visiting beetles pollinate an enormous diversity of tropical and temperate plants.",
                es: "Los escarabajos son los polinizadores originales: comenzaron a polinizar plantas hace más de 150 millones de años, mucho antes de que evolucionaran las abejas. Esta antigua relación se llama 'cantarofilia'. Muchas flores polinizadas por escarabajos son grandes, fuertemente perfumadas (a menudo con olor a fruta o especias), blancas o de colores apagados, y con forma de cuenco. A veces se les llama polinizadores de 'desorden y suciedad' porque mastican los pétalos de las flores. Sin embargo, con más de 400,000 especies descritas, los escarabajos representan el grupo de organismos más rico en especies de la Tierra.",
                fr: "Les coléoptères sont les pollinisateurs originaux — ils ont commencé à polliniser les plantes il y a plus de 150 millions d'années, bien avant l'évolution des abeilles. Cette relation ancienne est appelée 'cantharophilie'. Les fleurs pollinisées par les coléoptères ont tendance à être grandes, très parfumées, blanches ou ternes, et en forme de bol. Ils sont parfois appelés pollinisateurs 'brouillons' car ils mâchent les pétales. Cependant, avec plus de 400 000 espèces décrites, les coléoptères représentent le groupe d'organismes le plus riche en espèces sur Terre.",
                de: "Käfer sind die ursprünglichen Bestäuber – sie begannen vor über 150 Millionen Jahren Pflanzen zu bestäuben, lange bevor sich Bienen entwickelten. Diese uralte Beziehung wird 'Cantharophilie' genannt. Käferbestäubte Blüten sind oft groß, stark duftend, weiß oder matt gefärbt und schüsselförmig. Sie werden manchmal als 'unordentliche' Bestäuber bezeichnet, weil sie Blütenblätter kauen. Mit über 400.000 beschriebenen Arten stellen Käfer jedoch die artenreichste Gruppe von Organismen auf der Erde dar.",
                zh: "甲虫是最初的授粉者——它们在1.5亿多年前就开始为植物授粉，早在蜜蜂进化之前。这种古老的关系被称为'甲虫媒'（cantharophily）。甲虫授粉的花朵往往很大，气味浓烈，白色或暗淡色，呈碗状。甲虫有时被称为'混乱'的授粉者，因为它们会咀嚼花瓣。然而，它们拥有超过40万种描述物种，是地球上物种最丰富的生物群体。"
            },
            habitat: {
                en: "Found in almost all terrestrial ecosystems worldwide, from forests to deserts, gardens to grasslands.",
                es: "Se encuentran en casi todos los ecosistemas terrestres del mundo, desde bosques hasta desiertos, jardines y pastizales.",
                fr: "Présents dans presque tous les écosystèmes terrestres du monde, des forêts aux déserts, des jardins aux prairies.",
                de: "In fast allen terrestrischen Ökosystemen weltweit zu finden, von Wäldern bis zu Wüsten, Gärten bis zu Grasland.",
                zh: "几乎在世界各地的所有陆地生态系统中都有发现，从森林到沙漠，从花园到草原。"
            },
            conservation: {
                en: "Beetle pollinator populations are generally stable but face threats from habitat loss and pesticide use. Araihan Measure: 20 / 25 (Stable).",
                es: "Las poblaciones de escarabajos polinizadores son generalmente estables pero enfrentan amenazas por la pérdida de hábitat y el uso de pesticidas. Medida Araihan: 20 / 25 (Estable).",
                fr: "Les populations de coléoptères pollinisateurs sont généralement stables mais sont menacées par la perte d'habitat et les pesticides. Mesure Araihan : 20 / 25 (Stable).",
                de: "Käferbestäuberpopulationen sind im Allgemeinen stabil, sind jedoch durch Lebensraumverlust und Pestizideinsatz bedroht. Araihan-Maß: 20 / 25 (Stabil).",
                zh: "甲虫授粉者种群通常稳定，但面临栖息地丧失和农药使用的威胁。Araihan测量：20 / 25（稳定）。"
            },
            araihanMeasure: 20,
            conservationStatus: "Stable",
            glbPath: createGLBPath("Beetle_Final_With_Texture.glb"),
            role: {
                en: "Diverse group of insects that pollinate flowers while feeding on pollen and nectar",
                es: "Grupo diverso de insectos que polinizan flores mientras se alimentan de polen y néctar",
                fr: "Groupe diversifié d'insectes qui pollinisent les fleurs tout en se nourrissant de pollen et de nectar",
                de: "Diverse Gruppe von Insekten, die Blumen bestäuben, während sie sich von Pollen und Nektar ernähren",
                zh: "以花粉和花蜜为食并为花朵授粉的多样化昆虫群体"
            },
            funFacts: {
                en: [
                    "Beetles have been pollinating plants for over 150 million years — before bees existed",
                    "With 400,000+ species, beetles are the most diverse order of organisms on Earth",
                    "Beetle pollination is called 'cantharophily'",
                    "They are called 'mess and soil' pollinators because they chew through petals",
                    "Their hard wing cases (elytra) protect their delicate flight wings."
                ],
                es: [
                    "Los escarabajos han estado polinizando plantas durante más de 150 millones de años, antes de que existieran las abejas",
                    "Con más de 400,000 especies, los escarabajos son el orden de organismos más diverso de la Tierra",
                    "La polinización por escarabajos se llama 'cantarofilia'",
                    "Se les llama polinizadores de 'desorden y suciedad' porque mastican los pétalos",
                    "Sus duros estuches alares (élitros) protegen sus delicadas alas de vuelo."
                ],
                fr: [
                    "Les coléoptères pollinisent les plantes depuis plus de 150 millions d'années — avant l'existence des abeilles",
                    "Avec plus de 400 000 espèces, les coléoptères sont l'ordre d'organismes le plus diversifié sur Terre",
                    "La pollinisation par les coléoptères est appelée 'cantharophilie'",
                    "Ils sont parfois appelés pollinisateurs 'brouillons' car ils mâchent les pétales",
                    "Leurs étuis d'ailes durs (élytres) protègent leurs ailes de vol délicates."
                ],
                de: [
                    "Käfer bestäuben Pflanzen seit über 150 Millionen Jahren – bevor es Bienen gab",
                    "Mit über 400.000 Arten sind Käfer die vielfältigste Ordnung von Organismen auf der Erde",
                    "Käferbestäubung wird 'Cantharophilie' genannt",
                    "Sie werden manchmal als 'unordentliche' Bestäuber bezeichnet, weil sie Blütenblätter kauen",
                    "Ihre harten Flügeldecken (Elytren) schützen ihre empfindlichen Flugflügel."
                ],
                zh: [
                    "甲虫为植物授粉已有超过1.5亿年的历史——在蜜蜂存在之前",
                    "甲虫拥有40万多种，是地球上最多样化的生物目",
                    "甲虫授粉被称为'甲虫媒'（cantharophily）",
                    "它们被称为'混乱'授粉者，因为它们会咀嚼花瓣",
                    "它们坚硬的翅鞘（鞘翅）保护着脆弱的飞行翅膀。"
                ]
            },
            type: "natural"
        }
    ]
};

// ─────────────────────────────────────────────
// Robotic Pollinators
// ─────────────────────────────────────────────
export const roboticPollinators = [
    {
        name: "Robotic Hummingbird",
        slug: "robotic-hummingbird",
        category: "Robotic",
        categoryIcon: "🤖",
        manufacturer: "Custom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/selective-focus-photography-of-hummingbird-hovering-over-flower-1c8408f9f108",
        description: {
            en: "Bio-inspired robotic hummingbird designed for precision pollination. Mimics the hovering flight and nectar-feeding behavior of natural hummingbirds.",
            es: "Colibrí robótico bio-inspirado diseñado para la polinización de precisión. Imita el vuelo estacionario y el comportamiento de alimentación de néctar.",
            fr: "Colibri robotique bio-inspiré conçu pour la pollinisation de précision. Imite le vol stationnaire et le comportement d'alimentation des colibris naturels.",
            de: "Bio-inspirierter Roboter-Kolibri für Präzisionsbestäubung. Ahmt Schwebeflug und Nektaraufnahme natürlicher Kolibris nach.",
            zh: "仿生机器蜂鸟，专为精准授粉而设计。模仿天然蜂鸟的悬停飞行和吸食花蜜行为。"
        },
        detailedDescription: {
            en: "The Robotic Hummingbird represents a breakthrough in bio-inspired micro aerial vehicle (MAV) design. Drawing directly from the flight mechanics of the Ruby-throated Hummingbird, this prototype uses dual-wing flapping mechanisms that generate lift on both the upstroke and downstroke. The result is true hovering flight with six degrees of freedom — the robot can move in any direction, pause mid-air, and make precise adjustments to approach individual flowers. A soft silicone proboscis-like attachment mimics the nectar extraction process while simultaneously transferring synthetic pollen analogues between flowers. Onboard sensors include a micro-camera array for flower detection, inertial measurement units (IMUs) for stable flight, and chemical sensors to identify flower ripeness and nectar availability.",
            es: "El Colibrí Robótico es un avance en el diseño de micro vehículos aéreos (MAV) bio-inspirados. Utiliza mecanismos de aleteo de doble ala para generar sustentación en ambos movimientos, logrando un vuelo estacionario con seis grados de libertad. Una probóscide de silicona suave imita la extracción de néctar y transfiere polen sintético. Los sensores incluyen microcámaras y sensores químicos.",
            fr: "Le Colibri Robotique est une percée dans la conception de MAV bio-inspirés. Il utilise des mécanismes de battement à double aile pour un véritable vol stationnaire à six degrés de liberté. Une proboscis en silicone imite l'extraction de nectar tout en transférant du pollen synthétique. Les capteurs embarqués incluent des micro-caméras et des capteurs chimiques.",
            de: "Der Roboter-Kolibri ist ein Durchbruch im Design bio-inspirierter MAVs. Er nutzt Zwei-Flügel-Schlagmechanismen für echten Schwebeflug mit sechs Freiheitsgraden. Ein weicher Silikonrüssel ahmt die Nektarextraktion nach und überträgt synthetischen Pollen. Bordsensoren umfassen Mikrokameras und chemische Sensoren.",
            zh: "机器蜂鸟代表了仿生微型飞行器（MAV）设计的突破。该原型利用双翼扑动机制，在上下行程中产生升力，实现具有六个自由度的真正悬停飞行。柔软的硅胶喙状附件模仿花蜜提取过程，同时在花朵之间传递合成花粉。机载传感器包括用于检测花朵的微型摄像头阵列和化学传感器。"
        },
        capabilities: {
            en: "Hovering flight, nectar extraction simulation, precision maneuvering",
            es: "Vuelo estacionario, simulación de extracción de néctar, maniobras de precisión",
            fr: "Vol stationnaire, simulation d'extraction de nectar, manœuvres de précision",
            de: "Schwebeflug, Nektarextraktionssimulation, Präzisionsmanöver",
            zh: "悬停飞行，花蜜提取模拟，精准机动"
        },
        applications: {
            en: "Greenhouse pollination, research",
            es: "Polinización en invernaderos, investigación",
            fr: "Pollinisation en serre, recherche",
            de: "Gewächshausbestäubung, Forschung",
            zh: "温室授粉，研究"
        },
        status: "Prototype",
        advantages: {
            en: "Can access tubular flowers, high maneuverability",
            es: "Puede acceder a flores tubulares, alta maniobrabilidad",
            fr: "Peut accéder aux fleurs tubulaires, grande maniabilité",
            de: "Kann röhrenförmige Blüten erreichen, hohe Manövrierfähigkeit",
            zh: "可以进入管状花朵，高机动性"
        },
        limitations: {
            en: "Complex flight mechanics, limited battery",
            es: "Mecánica de vuelo compleja, batería limitada",
            fr: "Mécanique de vol complexe, batterie limitée",
            de: "Komplexe Flugmechanik, begrenzte Batterie",
            zh: "复杂的飞行力学，电池有限"
        },
        glbPath: createGLBPath("hummingbird+glb.glb"),
        funFacts: {
            en: [
                "Wings beat at similar frequencies to real hummingbirds",
                "Uses soft silicone tips to avoid damaging flowers",
                "Can hover in place with 6 degrees of freedom"
            ],
            es: [
                "Las alas baten a frecuencias similares a las de los colibríes reales",
                "Usa puntas de silicona suave para no dañar las flores",
                "Puede flotar en su lugar con 6 grados de libertad"
            ],
            fr: [
                "Les ailes battent à des fréquences similaires à celles des vrais colibris",
                "Utilise des embouts en silicone souple pour éviter d'endommager les fleurs",
                "Peut planer sur place avec 6 degrés de liberté"
            ],
            de: [
                "Flügel schlagen mit ähnlichen Frequenzen wie echte Kolibris",
                "Verwendet weiche Silikonspitzen, um Blumen nicht zu beschädigen",
                "Kann mit 6 Freiheitsgraden auf der Stelle schweben"
            ],
            zh: [
                "翅膀拍打频率与真正的蜂鸟相似",
                "使用柔软的硅胶尖端以避免损坏花朵",
                "可以在原地悬停，具有6个自由度"
            ]
        },
        type: "robotic"
    },
    {
        name: "Robotic Bee",
        slug: "robotic-bee",
        category: "Robotic",
        categoryIcon: "🤖",
        manufacturer: "Custom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/technology-circuit-board-40aa08e78837",
        description: {
            en: "Autonomous robotic bee designed for swarm-based pollination operations. Mimics the size and behavior of natural honeybees.",
            es: "Abeja robótica autónoma diseñada para operaciones de polinización en enjambre. Imita el tamaño y comportamiento de las abejas naturales.",
            fr: "Abeille robotique autonome conçue pour la pollinisation en essaim. Imite la taille et le comportement des abeilles naturelles.",
            de: "Autonome Roboter-Biene für schwarmbasierte Bestäubung. Ahmt Größe und Verhalten natürlicher Honigbienen nach.",
            zh: "自主机器蜜蜂，专为群体授粉操作而设计。模仿天然蜜蜂的大小和行为。"
        },
        detailedDescription: {
            en: "The Robotic Bee (RoboBee) is designed around swarm intelligence principles, enabling dozens or hundreds of units to operate cooperatively. Each unit is approximately 3 cm long and weighs under 5 grams, making it comparable in size to a large honeybee. The bee uses piezoelectric actuators to drive its wings at frequencies up to 120 Hz, achieving stable flight and basic maneuverability. A key innovation is the swarm coordination algorithm — each robotic bee communicates via low-power radio signals, sharing flower location data and distributing pollination tasks to maximize efficiency. Electrostatic pads on the robot's body attract and hold pollen grains, mimicking the natural electrostatic charge that real bees develop during flight. The system is designed for greenhouse environments where the controlled conditions simplify navigation and energy management.",
            es: "La Abeja Robótica (RoboBee) está diseñada en torno a principios de inteligencia de enjambre. Cada unidad mide aproximadamente 3 cm y pesa menos de 5 gramos. Utiliza actuadores piezoeléctricos para mover sus alas a hasta 120 Hz. Una innovación clave es el algoritmo de coordinación de enjambre: cada abeja se comunica mediante señales de radio de baja potencia. Almohadillas electrostáticas atraen y retienen granos de polen.",
            fr: "L'Abeille Robotique (RoboBee) est conçue autour de principes d'intelligence en essaim. Chaque unité mesure environ 3 cm et pèse moins de 5 grammes. Elle utilise des actionneurs piézoélectriques pour battre des ailes jusqu'à 120 Hz. Chaque abeille communique via des signaux radio basse puissance pour partager des données de localisation. Des tampons électrostatiques attirent et retiennent le pollen.",
            de: "Die Roboter-Biene (RoboBee) basiert auf Schwarmintelligenz. Jede Einheit ist ca. 3 cm lang und wiegt unter 5 g. Piezoelektrische Aktuatoren treiben die Flügel mit bis zu 120 Hz an. Ein Schwarmkoordinationsalgorithmus ermöglicht die Kommunikation über Funksignale geringer Leistung. Elektrostatische Pads ziehen Pollenkörner an.",
            zh: "机器蜜蜂（RoboBee）是围绕群体智能原则设计的。每个单元长约3厘米，重量不到5克。蜜蜂使用压电致动器以高达120赫兹的频率驱动翅膀。关键创新是群体协调算法——每只机器蜜蜂通过低功率无线电信号进行通信。机器人身体上的静电垫吸引并保持花粉粒。"
        },
        capabilities: {
            en: "Swarm coordination, flower detection, pollen collection",
            es: "Coordinación de enjambre, detección de flores, recolección de polen",
            fr: "Coordination d'essaim, détection de fleurs, collecte de pollen",
            de: "Schwarmkoordination, Blumenerkennung, Pollensammlung",
            zh: "群体协调，花朵检测，花粉收集"
        },
        applications: {
            en: "Crop pollination, environmental monitoring",
            es: "Polinización de cultivos, monitoreo ambiental",
            fr: "Pollinisation des cultures, surveillance environnementale",
            de: "Nutzpflanzenbestäubung, Umweltüberwachung",
            zh: "作物授粉，环境监测"
        },
        status: "Development",
        advantages: {
            en: "Scalable swarm operations, redundant systems",
            es: "Operaciones de enjambre escalables, sistemas redundantes",
            fr: "Opérations en essaim évolutives, systèmes redondants",
            de: "Skalierbare Schwarmoperationen, redundante Systeme",
            zh: "可扩展的群体操作，冗余系统"
        },
        limitations: {
            en: "Requires base station, limited individual range",
            es: "Requiere estación base, rango individual limitado",
            fr: "Nécessite une station de base, portée individuelle limitée",
            de: "Erfordert Basisstation, begrenzte individuelle Reichweite",
            zh: "需要基站，个体范围有限"
        },
        glbPath: createGLBPath("robottic+bee+file+with+lights.glb"),
        funFacts: {
            en: [
                "Weighs less than 5 grams",
                "Operates using swarm intelligence like a real hive",
                "Uses static electricity to pick up pollen"
            ],
            es: [
                "Pesa menos de 5 gramos",
                "Opera usando inteligencia de enjambre como una colmena real",
                "Usa electricidad estática para recoger polen"
            ],
            fr: [
                "Pèse moins de 5 grammes",
                "Fonctionne en utilisant l'intelligence en essaim comme une vraie ruche",
                "Utilise l'électricité statique pour ramasser le pollen"
            ],
            de: [
                "Wiegt weniger als 5 Gramm",
                "Arbeitet mit Schwarmintelligenz wie ein echter Bienenstock",
                "Verwendet statische Elektrizität zum Aufnehmen von Pollen"
            ],
            zh: [
                "重量不到5克",
                "像真正的蜂巢一样使用群体智能运作",
                "使用静电收集花粉"
            ]
        },
        type: "robotic"
    },
    {
        name: "Robotic Butterfly",
        slug: "robotic-butterfly",
        category: "Robotic",
        categoryIcon: "🤖",
        manufacturer: "Custom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/blue-and-pink-light-digital-wallpaper-4bd374c3f58b",
        description: {
            en: "Large-scale robotic pollinator with gliding capabilities for energy-efficient movement across larger areas.",
            es: "Polinizador robótico de gran escala con capacidades de planeo para un movimiento energéticamente eficiente en áreas más grandes.",
            fr: "Pollinisateur robotique à grande échelle avec des capacités de planage pour un mouvement économe en énergie sur de plus grandes surfaces.",
            de: "Großflächiger Roboter-Bestäuber mit Gleitflugfähigkeiten für energieeffiziente Bewegung über größere Gebiete.",
            zh: "大型机器授粉者，具有滑翔能力，可在更大区域内进行节能运动。"
        },
        detailedDescription: {
            en: "The Robotic Butterfly is the largest platform in the robotic pollinator fleet, designed for broad-area coverage with minimal energy expenditure. With a wingspan of approximately 30 cm, it uses flexible wing membranes embedded with thin-film solar cells that charge during flight, significantly extending operational range. The gliding flight profile allows it to cover large open fields while using less than a third of the energy required by hovering designs. Integrated multispectral cameras identify flowering zones from altitude, and the robot descends to individual flowers using GPS-guided waypoints. While less precise than smaller robotic pollinators, its ability to survey and pollinate across hectares of farmland makes it ideal for supplementing natural pollination in large-scale agriculture. The silent flight profile also means it does not disturb wildlife or farmworkers.",
            es: "La Mariposa Robótica es la plataforma más grande de la flota, diseñada para cobertura de área amplia con gasto energético mínimo. Con una envergadura de 30 cm, usa membranas de ala flexibles con células solares que cargan durante el vuelo. Su perfil de vuelo de planeo le permite cubrir grandes campos abiertos usando menos de un tercio de la energía de diseños de vuelo estacionario. Cámaras multiespectrales integradas identifican zonas de floración.",
            fr: "Le Papillon Robotique est la plus grande plate-forme de la flotte, conçue pour une couverture à grande échelle avec une dépense énergétique minimale. Avec une envergure d'environ 30 cm, il utilise des membranes d'ailes flexibles avec des cellules solaires à couche mince. Le profil de vol plané lui permet de couvrir de grands champs ouverts en utilisant moins d'un tiers de l'énergie requise par les conceptions de vol stationnaire.",
            de: "Der Roboter-Schmetterling ist die größte Plattform der Flotte, ausgelegt für großflächige Abdeckung bei minimalem Energieverbrauch. Mit einer Spannweite von ca. 30 cm nutzt er flexible Flügelmembranen mit Dünnschicht-Solarzellen. Das Gleitflugprofil ermöglicht es, große offene Felder abzudecken und verbraucht dabei weniger als ein Drittel der Energie von Schwebeflugdesigns.",
            zh: "机器蝴蝶是机器人授粉舰队中最大的平台，专为以最小的能量消耗覆盖广阔区域而设计。它的翼展约为30厘米，使用嵌入薄膜太阳能电池的柔性翼膜，可在飞行期间充电。滑翔飞行剖面使其能够覆盖大型开阔田地，而使用的能量不到悬停设计所需能量的三分之一。"
        },
        capabilities: {
            en: "Energy-efficient flight, solar charging wings, broad area coverage",
            es: "Vuelo energéticamente eficiente, alas de carga solar, cobertura de área amplia",
            fr: "Vol économe en énergie, ailes à charge solaire, couverture à grande échelle",
            de: "Energieeffizienter Flug, solare Ladeflügel, großflächige Abdeckung",
            zh: "节能飞行，太阳能充电翅膀，广域覆盖"
        },
        applications: {
            en: "Open field monitoring, supplemental pollination",
            es: "Monitoreo de campo abierto, polinización suplementaria",
            fr: "Surveillance en plein champ, pollinisation supplémentaire",
            de: "Freifeldüberwachung, ergänzende Bestäubung",
            zh: "露地监测，补充授粉"
        },
        status: "Concept",
        advantages: {
            en: "Longer operation times, silent flight",
            es: "Tiempos de operación más largos, vuelo silencioso",
            fr: "Temps de fonctionnement plus longs, vol silencieux",
            de: "Längere Betriebszeiten, lautloser Flug",
            zh: "更长的运行时间，静音飞行"
        },
        limitations: {
            en: "Less precise than smaller robots, wind susceptibility",
            es: "Menos preciso que robots más pequeños, susceptibilidad al viento",
            fr: "Moins précis que les petits robots, sensibilité au vent",
            de: "Weniger präzise als kleinere Roboter, Windanfälligkeit",
            zh: "不如小型机器人精确，易受风影响"
        },
        glbPath: createGLBPath("with+lights.glb"),
        funFacts: {
            en: [
                "Solar wings recharge during flight",
                "Gliding mode uses 70% less energy than hovering",
                "Silent flight avoids disturbing wildlife"
            ],
            es: [
                "Las alas solares se recargan durante el vuelo",
                "El modo de planeo usa un 70% menos de energía que el vuelo estacionario",
                "El vuelo silencioso evita perturbar la vida silvestre"
            ],
            fr: [
                "Les ailes solaires se rechargent pendant le vol",
                "Le mode plané utilise 70% d'énergie en moins que le vol stationnaire",
                "Le vol silencieux évite de déranger la faune"
            ],
            de: [
                "Solarflügel laden sich während des Fluges auf",
                "Der Gleitmodus verbraucht 70% weniger Energie als der Schwebeflug",
                "Lautloser Flug vermeidet Störungen der Tierwelt"
            ],
            zh: [
                "太阳能机翼在飞行期间充电",
                "滑翔模式比悬停模式节省70%的能量",
                "静音飞行避免打扰野生动物"
            ]
        },
        type: "robotic"
    },
    {
        name: "Robotic Moth",
        slug: "robotic-moth",
        category: "Robotic",
        categoryIcon: "🤖",
        manufacturer: "Custom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/microchip-technology-4636190af475",
        description: {
            en: "Nocturnal robotic pollinator designed to operate in low-light conditions, targeting night-blooming plants.",
            es: "Polinizador robótico nocturno diseñado para operar en condiciones de poca luz, dirigido a plantas que florecen de noche.",
            fr: "Pollinisateur robotique nocturne conçu pour fonctionner dans des conditions de faible luminosité, ciblant les plantes à floraison nocturne.",
            de: "Nächtlicher Roboter-Bestäuber für den Betrieb bei schlechten Lichtverhältnissen, ausgerichtet auf nachtblühende Pflanzen.",
            zh: "夜间机器授粉者，专为在低光照条件下操作而设计，针对夜间开花的植物。"
        },
        detailedDescription: {
            en: "The Robotic Moth fills a critical gap in agricultural technology — pollination of night-blooming crops. Many valuable crops including dragon fruit, certain jasmine species, and evening primrose bloom primarily at night when natural pollinators may be scarce. This prototype uses forward-looking infrared (FLIR) sensors and UV-fluorescence detection to locate flowers in complete darkness. Its wings incorporate noise-dampening microstructures inspired by the silent flight of real owls, reducing its acoustic signature to less than 20 dB at 1 meter — nearly inaudible. The moth's navigation system combines LIDAR-based obstacle avoidance with pheromone-inspired chemical trail markers that allow it to build and optimize patrol routes over successive nights. Battery life in low-light conditions is extended by the reduced energy demands of its slow, gliding flight pattern.",
            es: "La Polilla Robótica llena un vacío crítico en la tecnología agrícola: la polinización de cultivos que florecen de noche. Este prototipo utiliza sensores infrarrojos (FLIR) y detección de fluorescencia UV para localizar flores en la oscuridad total. Sus alas incorporan microestructuras de amortiguación de ruido, reduciendo su firma acústica a menos de 20 dB. El sistema de navegación combina evasión de obstáculos LIDAR con marcadores químicos.",
            fr: "Le Papillon de nuit Robotique comble une lacune critique dans la technologie agricole : la pollinisation des cultures à floraison nocturne. Ce prototype utilise des capteurs infrarouges (FLIR) et une détection de fluorescence UV. Ses ailes intègrent des microstructures d'amortissement du bruit, réduisant sa signature acoustique à moins de 20 dB. Le système de navigation combine l'évitement d'obstacles LIDAR avec des marqueurs chimiques.",
            de: "Die Roboter-Motte füllt eine kritische Lücke in der Agrartechnologie: Bestäuben nachtblühender Pflanzen. Dieser Prototyp verwendet Infrarotsensoren (FLIR) und UV-Fluoreszenzerkennung, um Blumen in völliger Dunkelheit zu finden. Ihre Flügel enthalten geräuschdämpfende Mikrostrukturen, die die akustische Signatur auf unter 20 dB reduzieren.",
            zh: "机器蛾填补了农业技术的一个关键空白——夜间开花作物的授粉。该原型使用前视红外（FLIR）传感器和紫外荧光检测在完全黑暗中定位花朵。它的翅膀采用了受猫头鹰静音飞行启发的降噪微结构，将其声学特征降低到1米处小于20分贝。导航系统结合了基于激光雷达的避障和受费洛蒙启发的化学轨迹标记。"
        },
        capabilities: {
            en: "Night vision, thermal sensing, low-noise operation",
            es: "Visión nocturna, detección térmica, operación silenciosa",
            fr: "Vision nocturne, détection thermique, fonctionnement silencieux",
            de: "Nachtsicht, thermische Erfassung, geräuscharmer Betrieb",
            zh: "夜视，热传感，低噪音运行"
        },
        applications: {
            en: "Night-blooming crop pollination, nocturnal study",
            es: "Polinización de cultivos nocturnos, estudio nocturno",
            fr: "Pollinisation des cultures nocturnes, étude nocturne",
            de: "Bestäubung nachtblühender Pflanzen, nächtliche Studien",
            zh: "夜间开花作物授粉，夜间研究"
        },
        status: "Prototype",
        advantages: {
            en: "Extends pollination hours, specialized for nocturnal plants",
            es: "Extiende las horas de polinización, especializado para plantas nocturnas",
            fr: "Prolonge les heures de pollinisation, spécialisé pour les plantes nocturnes",
            de: "Verlängert Bestäubungszeiten, spezialisiert auf nachtblühende Pflanzen",
            zh: "延长授粉时间，专门针对夜间植物"
        },
        limitations: {
            en: "Sensor complexity, navigation in darkness",
            es: "Complejidad de sensores, navegación en oscuridad",
            fr: "Complexité des capteurs, navigation dans l'obscurité",
            de: "Sensorkomplexität, Navigation in Dunkelheit",
            zh: "传感器复杂性，黑暗中导航"
        },
        glbPath: createGLBPath("Robotic_Moth.glb"),
        funFacts: {
            en: [
                "Operates in complete darkness using IR sensors",
                "Flight noise is less than 20 decibels",
                "Can detect flower ripeness via chemical sensors"
            ],
            es: [
                "Opera en completa oscuridad usando sensores IR",
                "El ruido de vuelo es inferior a 20 decibelios",
                "Puede detectar la madurez de la flor mediante sensores químicos"
            ],
            fr: [
                "Fonctionne dans l'obscurité totale grâce à des capteurs IR",
                "Le bruit de vol est inférieur à 20 décibels",
                "Peut détecter la maturité des fleurs via des capteurs chimiques"
            ],
            de: [
                "Arbeitet in völliger Dunkelheit mit IR-Sensoren",
                "Fluggeräusch beträgt weniger als 20 Dezibel",
                "Kann Blütenreife über chemische Sensoren erkennen"
            ],
            zh: [
                "使用红外传感器在完全黑暗中操作",
                "飞行噪音小于20分贝",
                "可以通过化学传感器检测花朵成熟度"
            ]
        },
        type: "robotic"
    },
    {
        name: "Robotic Bat",
        slug: "robotic-bat",
        category: "Robotic",
        categoryIcon: "🤖",
        manufacturer: "Custom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1506947411487-a5673826e6e0?auto=format&fit=crop&w=800&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/black-drone-flying-during-night-time-a5673826e6e0",
        description: {
            en: "Agile robotic flyer mimicking bat flight dynamics for pollination of specific plants like agave and cactus.",
            es: "Volador robótico ágil que imita la dinámica de vuelo de los murciélagos para la polinización de plantas específicas como el agave y el cactus.",
            fr: "Volant robotique agile imitant la dynamique de vol des chauves-souris pour la pollinisation de plantes spécifiques comme l'agave et le cactus.",
            de: "Agiler Roboterflieger, der die Flugdynamik von Fledermäusen nachahmt, um bestimmte Pflanzen wie Agaven und Kakteen zu bestäuben.",
            zh: "敏捷的机器飞行器，模仿蝙蝠的飞行动力学，用于为龙舌兰和仙人掌等特定植物授粉。"
        },
        detailedDescription: {
            en: "The Robotic Bat is inspired by the extraordinary aerobatic capabilities of chiropterans (real bats), which can execute tighter turns and more complex maneuvers than any bird or insect. This research platform uses articulated wing joints with 5 degrees of freedom per wing, allowing it to change wing shape mid-flight — a capability that enables unprecedented agility among robotic flyers. The bat is specifically designed for desert and arid environment pollination, targeting columnar cacti and agave plants that are naturally pollinated by the Lesser Long-nosed Bat. An echolocation-inspired ultrasonic sensor array provides 360-degree obstacle detection, enabling safe nighttime navigation between densely packed cactus spines. The larger payload capacity (compared to smaller robotic pollinators) allows it to carry sensor packages for environmental monitoring alongside its pollination equipment.",
            es: "El Murciélago Robótico se inspira en las capacidades acrobáticas extraordinarias de los murciélagos. Utiliza articulaciones de alas con 5 grados de libertad por ala, permitiendo cambiar la forma del ala en pleno vuelo. Diseñado para la polinización en entornos desérticos y áridos, apuntando a cactus columnares y plantas de agave. Un conjunto de sensores ultrasónicos inspirado en la ecolocalización proporciona detección de obstáculos de 360 grados.",
            fr: "La Chauve-souris Robotique s'inspire des capacités acrobatiques extraordinaires des chauves-souris. Elle utilise des articulations d'ailes avec 5 degrés de liberté par aile, permettant de changer la forme de l'aile en plein vol. Conçue pour la pollinisation en milieu désertique et aride, ciblant les cactus colonnaires et les agaves. Un réseau de capteurs à ultrasons inspiré de l'écholocation assure une détection d'obstacles à 360 degrés.",
            de: "Die Roboter-Fledermaus ist von den außergewöhnlichen akrobatischen Fähigkeiten der Fledermäuse inspiriert. Sie verwendet Flügelgelenke mit 5 Freiheitsgraden pro Flügel, wodurch die Flügelform im Flug geändert werden kann. Speziell für die Bestäubung in Wüsten und trockenen Umgebungen entwickelt. Ein von der Echoortung inspiriertes Ultraschallsensor-Array bietet eine 360-Grad-Hinderniserkennung.",
            zh: "机器蝙蝠的灵感来自于蝙蝠非凡的特技飞行能力。该研究平台使用每只翅膀具有5个自由度的铰接式机翼关节，允许其在飞行中改变机翼形状。专为沙漠和干旱环境授粉而设计，针对柱状仙人掌和龙舌兰植物。受回声定位启发的超声波传感器阵列提供360度障碍物检测。"
        },
        capabilities: {
            en: "Complex flight maneuvers, echolocation-inspired navigation",
            es: "Maniobras de vuelo complejas, navegación inspirada en ecolocalización",
            fr: "Manœuvres de vol complexes, navigation inspirée de l'écholocation",
            de: "Komplexe Flugmanöver, von Echoortung inspirierte Navigation",
            zh: "复杂的飞行机动，受回声定位启发的导航"
        },
        applications: {
            en: "Arid environment pollination, complex terrain",
            es: "Polinización en ambientes áridos, terreno complejo",
            fr: "Pollinisation en milieu aride, terrain complexe",
            de: "Bestäubung in trockenen Umgebungen, komplexes Gelände",
            zh: "干旱环境授粉，复杂地形"
        },
        status: "Research",
        advantages: {
            en: "Highly maneuverable, can carry larger payloads",
            es: "Altamente maniobrable, puede transportar cargas más grandes",
            fr: "Très maniable, peut transporter des charges utiles plus importantes",
            de: "Sehr wendig, kann größere Nutzlasten tragen",
            zh: "高机动性，可携带更大载荷"
        },
        limitations: {
            en: "Mechanical complexity, energy consumption",
            es: "Complejidad mecánica, consumo de energía",
            fr: "Complexité mécanique, consommation d'énergie",
            de: "Mechanische Komplexität, Energieverbrauch",
            zh: "机械复杂性，能源消耗"
        },
        glbPath: null,
        funFacts: {
            en: [
                "Wings can change shape mid-flight for agility",
                "Uses ultrasonic sonar for obstacle avoidance",
                "Designed to navigate between cactus spines"
            ],
            es: [
                "Las alas pueden cambiar de forma en pleno vuelo para agilidad",
                "Usa sonar ultrasónico para evitar obstáculos",
                "Diseñado para navegar entre espinas de cactus"
            ],
            fr: [
                "Les ailes peuvent changer de forme en plein vol pour plus d'agilité",
                "Utilise un sonar à ultrasons pour l'évitement d'obstacles",
                "Conçu pour naviguer entre les épines de cactus"
            ],
            de: [
                "Flügel können im Flug ihre Form ändern für mehr Agilität",
                "Verwendet Ultraschallsonar zur Hindernisvermeidung",
                "Entwickelt, um zwischen Kaktusstacheln zu navigieren"
            ],
            zh: [
                "机翼可以在飞行中改变形状以提高灵活性",
                "使用超声波声纳避障",
                "专为在仙人掌刺之间导航而设计"
            ]
        },
        type: "robotic"
    },
    {
        name: "Robotic Hummingbird Moth",
        slug: "robotic-hummingbird-moth",
        category: "Robotic",
        categoryIcon: "🤖",
        manufacturer: "Custom",
        year: "2025",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80",
        imageAttribution: "Unsplash",
        imageUrl: "https://unsplash.com/photos/gray-industrial-machine-42c9da997008",
        description: {
            en: "Hybrid design combining the hovering capability of hummingbirds with nocturnal operation of moths.",
            es: "Diseño híbrido que combina la capacidad de vuelo estacionario de los colibríes con la operación nocturna de las polillas.",
            fr: "Conception hybride combinant la capacité de vol stationnaire des colibris avec le fonctionnement nocturne des papillons de nuit.",
            de: "Hybrides Design, das die Schwebeflugfähigkeit von Kolibris mit der nächtlichen Aktivität von Motten kombiniert.",
            zh: "混合设计，结合了蜂鸟的悬停能力和飞蛾的夜间操作。"
        },
        detailedDescription: {
            en: "The Robotic Hummingbird Moth is a hybrid concept that combines the best capabilities of two bio-inspired platforms: the precision hovering of the Robotic Hummingbird with the nocturnal sensor suite of the Robotic Moth. This dual-mode pollinator can operate effectively in both daylight and nighttime conditions, enabling true 24-hour pollination cycles. During daylight hours, it uses visual cameras and UV sensors to identify and pollinate diurnal flowers with precision hovering. As light fades, it automatically switches to its infrared and UV-fluorescence sensor array for nighttime operations. The propulsion system uses a variable-frequency wing driving mechanism that can transition between high-frequency hovering (for precision flower access) and low-frequency gliding (for energy-efficient transit between flower patches). This versatility makes it the most capable — but also the most technically complex — platform in the robotic pollinator program.",
            es: "La Polilla Colibrí Robótica es un concepto híbrido que combina lo mejor de dos plataformas bio-inspiradas: el vuelo estacionario preciso del Colibrí Robótico con el conjunto de sensores nocturnos de la Polilla Robótica. Este polinizador de modo dual puede operar eficazmente tanto de día como de noche, permitiendo ciclos de polinización de 24 horas. Durante el día, usa cámaras visuales; al anochecer, cambia a infrarrojos.",
            fr: "Le Sphinx Colibri Robotique est un concept hybride qui combine le meilleur de deux plates-formes bio-inspirées : le vol stationnaire précis du Colibri Robotique avec la suite de capteurs nocturnes du Papillon de nuit Robotique. Ce pollinisateur bimode peut fonctionner efficacement de jour comme de nuit. Il utilise des caméras visuelles le jour et des capteurs infrarouges la nuit.",
            de: "Der Roboter-Taubenschwänzchen ist ein hybrides Konzept, das die besten Fähigkeiten zweier bio-inspirierter Plattformen vereint: den präzisen Schwebeflug des Roboter-Kolibris mit der nächtlichen Sensorik der Roboter-Motte. Dieser Dual-Mode-Bestäuber kann sowohl bei Tag als auch bei Nacht effektiv arbeiten. Er nutzt tagsüber visuelle Kameras und nachts Infrarotsensoren.",
            zh: "机器蜂鸟蛾是一个混合概念，结合了两个仿生平台的最佳功能：机器蜂鸟的精确悬停和机器蛾的夜间传感器套件。这种双模式授粉者可以在白天和夜间条件下有效运行，实现真正的24小时授粉周期。白天使用视觉摄像头，夜间切换到红外传感器。"
        },
        capabilities: {
            en: "Hovering, low-light operation, precision nectar access",
            es: "Vuelo estacionario, operación con poca luz, acceso preciso al néctar",
            fr: "Vol stationnaire, fonctionnement à faible luminosité, accès précis au nectar",
            de: "Schwebeflug, Betrieb bei schwachem Licht, präziser Nektarzugang",
            zh: "悬停，低光照操作，精准获取花蜜"
        },
        applications: {
            en: "Specialized floral pollination, 24-hour operation",
            es: "Polinización floral especializada, operación de 24 horas",
            fr: "Pollinisation florale spécialisée, fonctionnement 24h/24",
            de: "Spezialisierte Blütenbestäubung, 24-Stunden-Betrieb",
            zh: "专业花卉授粉，24小时作业"
        },
        status: "Concept",
        advantages: {
            en: "Versatile operation times, precise floral access",
            es: "Tiempos de operación versátiles, acceso floral preciso",
            fr: "Temps de fonctionnement polyvalents, accès floral précis",
            de: "Vielseitige Betriebszeiten, präziser Blütenzugang",
            zh: "多样化的操作时间，精准的花卉接触"
        },
        limitations: {
            en: "High design complexity, specialized use cases",
            es: "Alta complejidad de diseño, casos de uso especializados",
            fr: "Grande complexité de conception, cas d'utilisation spécialisés",
            de: "Hohe Designkomplexität, spezielle Anwendungsfälle",
            zh: "设计复杂性高，特殊用例"
        },
        glbPath: createGLBPath("Robotic_Humming_Bird_Moth.glb"),
        funFacts: {
            en: [
                "Switches sensor modes automatically at dusk",
                "Can hover and glide for maximum efficiency",
                "The most complex bio-inspired flying robot"
            ],
            es: [
                "Cambia los modos de sensor automáticamente al anochecer",
                "Puede flotar y planear para máxima eficiencia",
                "El robot volador bio-inspirado más complejo"
            ],
            fr: [
                "Commute automatiquement les modes de capteur au crépuscule",
                "Peut planer et voler en stationnaire pour une efficacité maximale",
                "Le robot volant bio-inspiré le plus complexe"
            ],
            de: [
                "Schaltet Sensormodi automatisch in der Dämmerung um",
                "Kann für maximale Effizienz schweben und gleiten",
                "Der komplexeste bio-inspirierte Flugroboter"
            ],
            zh: [
                "黄昏时自动切换传感器模式",
                "可以悬停和滑翔以实现最大效率",
                "最复杂的仿生飞行机器人"
            ]
        },
        type: "robotic"
    }
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Return a flat list of every pollinator (natural + robotic) */
export function getAllPollinators() {
    const natural = [
        ...naturalPollinators.bees,
        ...naturalPollinators.birds,
        ...naturalPollinators.butterflies,
        ...naturalPollinators.bats,
        ...naturalPollinators.beetles,
    ];
    return [...natural, ...roboticPollinators];
}

/** Look up a single pollinator by its slug */
export function getPollinatorBySlug(slug) {
    return getAllPollinators().find((p) => p.slug === slug) || null;
}

// ─────────────────────────────────────────────
// UI Translations
// ─────────────────────────────────────────────
export const uiTranslations = {
    en: {
        header: {
            back: "Back to pollinators",
            language: "Language:",
            title: "Pollinators Gallery",
            subtitle: "Discover the invisible guardians of life on Earth. This gallery showcases the diverse natural pollinators that keep our planet's biodiversity in balance, from tiny bees to magnificent hummingbirds, and explores emerging robotic pollination technologies."
        },
        crisis: {
            title: "Pollinator Decline (2016–2025)",
            subtitle: "The urgent reality we must address",
            report: {
                title: "2016 IPBES Report",
                stat1: "90%",
                desc1: "Wild flowering plants depend on pollinators",
                stat2: "75%",
                desc2: "Global food crops require pollination"
            },
            crisis2025: {
                title: "2025 Crisis",
                stat1: "40%",
                desc1: "Invertebrate pollinator species face extinction",
                stat2: "9%",
                desc2: "Annual insect population decline"
            },
            usBees: {
                title: "US Bee Colonies",
                stat1: "60-70%",
                desc1: "Annual colony losses",
                stat2: "22%",
                desc2: "Native pollinators at risk"
            },
            urgentAction: {
                title: "Urgent Action",
                stat1: "Next Decade",
                desc1: "Decides restoration or collapse",
                stat2: "Global",
                desc2: "Coordination required"
            },
            action: {
                title: "Global Action",
                stat: "17",
                desc: "UN Sustainable Development Goals rely on nature"
            },
            mission: {
                title: "Our Mission",
                desc: "Documenting, preserving, and innovating for the future of pollination."
            }
        },
        sections: {
            natural: "Natural Pollinators",
            naturalSubtitle: "The biological engines of our ecosystem",
            robotic: "Robotic Pollinators",
            roboticSubtitle: "Bio-inspired engineering for a changing world",
            beesAnts: "Bees & Ants",
            birds: "Birds",
            butterfliesMoths: "Butterflies & Moths",
            bats: "Bats",
            beetlesOther: "Beetles & Other Pollinators"
        },
        comparison: {
            title: "Natural vs. Robotic",
            subtitle: "Why we need both",
            natural: {
                title: "Natural Pollinators",
                advantages: {
                    title: "Advantages",
                    item1: "• Self-sustaining populations that reproduce naturally",
                    item2: "• Provide ecosystem services beyond pollination (soil health, food web support)",
                    item3: "• Adapt to environmental changes and flower diversity",
                    item4: "• No energy infrastructure required",
                    item5: "• Contribute to biodiversity and ecosystem resilience",
                    item6: "• Co-evolved with plants over millions of years",
                    item7: "• Support entire ecosystems, not just crops"
                },
                challenges: {
                    title: "Challenges",
                    item1: "• Vulnerable to pesticides, habitat loss, and climate change",
                    item2: "• Populations declining globally",
                    item3: "• Cannot be controlled or directed like machines",
                    item4: "• Seasonal availability in some regions"
                }
            },
            robotic: {
                title: "Robotic Pollinators",
                benefits: {
                    title: "Potential Benefits",
                    item1: "• Can work 24/7 without rest",
                    item2: "• Not affected by pesticides or environmental toxins",
                    item3: "• Precise control over pollination process",
                    item4: "• Useful for controlled environments (greenhouses)",
                    item5: "• Can collect data while pollinating",
                    item6: "• No risk of stings or allergic reactions"
                },
                limitations: {
                    title: "Limitations",
                    item1: "• Cannot replace ecosystem services provided by natural pollinators",
                    item2: "• High initial cost and maintenance requirements",
                    item3: "• Limited battery life requires charging infrastructure",
                    item4: "• Cannot fully replicate natural pollination behaviors",
                    item5: "• Not suitable for wild ecosystems or diverse plant communities",
                    item6: "• Require technical expertise and ongoing support",
                    item7: "• Cannot contribute to biodiversity or ecosystem health"
                }
            },
            conclusion: {
                title: "The Path Forward",
                text: "Robotic pollinators may serve as valuable tools for specific applications, particularly in controlled agricultural environments. However, they should be viewed as supplements, not replacements for natural pollinators. The ultimate goal must be to protect and restore natural pollinator populations, as they provide irreplaceable ecosystem services that support life on Earth. Conservation efforts, habitat restoration, and sustainable agricultural practices remain the most critical priorities for ensuring food security and ecosystem health."
            }
        },
        futureVision: {
            title: "Future Vision",
            paragraph1: "This gallery is part of our comprehensive living archive of Earth's pollinators. Explore these magnificent creatures in three dimensions, discover their connections with national flowers, and understand their vital role in our ecosystem. As we continue to build this archive, we'll add more species, detailed information, and interactive 3D models.",
            paragraph2: "All images are sourced from free-to-use platforms and are properly attributed. This collection will continue to grow as we build our living archive of Earth's pollinators."
        },
        card: {
            description: "Description",
            region: "Region",
            habitat: "Habitat",
            conservation: "Conservation",
            status: "Status",
            view3d: "View 3D",
            capabilities: "Capabilities",
            applications: "Applications",
            advantages: "Advantages",
            limitations: "Limitations",
            readDetails: "Read Details",
            manufacturer: "Manufacturer",
            year: "Year",
            model3d: "3D Model",
            typeRobotic: "Robotic",
            loadingModel: "Loading 3D model...",
            statusLabel: "Status"
        }
    },
    es: {
        header: {
            back: "Volver a polinizadores",
            language: "Idioma:",
            title: "Galería de Polinizadores",
            subtitle: "Descubre a los guardianes invisibles de la vida en la Tierra. Esta galería muestra los diversos polinizadores naturales que mantienen el equilibrio de la biodiversidad de nuestro planeta, y explora las tecnologías emergentes de polinización robótica."
        },
        crisis: {
            title: "Disminución de Polinizadores (2016–2025)",
            subtitle: "La realidad urgente que debemos abordar",
            report: {
                title: "Informe IPBES 2016",
                stat1: "90%",
                desc1: "Las plantas silvestres dependen de polinizadores",
                stat2: "75%",
                desc2: "Cultivos alimentarios requieren polinización"
            },
            crisis2025: {
                title: "Crisis de 2025",
                stat1: "40%",
                desc1: "Especies invertebradas enfrentan extinción",
                stat2: "9%",
                desc2: "Disminución anual de población de insectos"
            },
            usBees: {
                title: "Colonias de Abejas EEUU",
                stat1: "60-70%",
                desc1: "Pérdidas anuales de colonias",
                stat2: "22%",
                desc2: "Polinizadores nativos en riesgo"
            },
            urgentAction: {
                title: "Acción Urgente",
                stat1: "Próxima Década",
                desc1: "Decide restauración o colapso",
                stat2: "Global",
                desc2: "Coordinación requerida"
            },
            action: {
                title: "Acción Global",
                stat: "17",
                desc: "Objetivos de Desarrollo Sostenible dependen de la naturaleza"
            },
            mission: {
                title: "Nuestra Misión",
                desc: "Documentar, preservar e innovar para el futuro de la polinización."
            }
        },
        sections: {
            natural: "Polinizadores Naturales",
            naturalSubtitle: "Los motores biológicos de nuestro ecosistema",
            robotic: "Polinizadores Robóticos",
            roboticSubtitle: "Ingeniería bio-inspirada para un mundo cambiante",
            beesAnts: "Abejas y Hormigas",
            birds: "Aves",
            butterfliesMoths: "Mariposas y Polillas",
            bats: "Murciélagos",
            beetlesOther: "Escarabajos y Otros"
        },
        comparison: {
            title: "Natural vs. Robótico",
            subtitle: "Por qué necesitamos ambos",
            natural: {
                title: "Polinizadores Naturales",
                advantages: {
                    title: "Ventajas",
                    item1: "• Auto-reproductores y sostenibles",
                    item2: "• Proporcionan servicios ecosistémicos más allá de la polinización",
                    item3: "• Se adaptan a cambios ambientales y diversidad floral",
                    item4: "• No requieren infraestructura energética",
                    item5: "• Contribuyen a la biodiversidad y resiliencia",
                    item6: "• Co-evolucionados con plantas durante millones de años",
                    item7: "• Apoyan ecosistemas completos, no solo cultivos"
                },
                challenges: {
                    title: "Desafíos",
                    item1: "• Vulnerables a pesticidas, pérdida de hábitat y cambio climático",
                    item2: "• Poblaciones disminuyendo globalmente",
                    item3: "• No pueden ser controlados como máquinas",
                    item4: "• Disponibilidad estacional en algunas regiones"
                }
            },
            robotic: {
                title: "Polinizadores Robóticos",
                benefits: {
                    title: "Beneficios Potenciales",
                    item1: "• Pueden trabajar 24/7 sin descanso",
                    item2: "• No afectados por pesticidas o toxinas",
                    item3: "• Control preciso sobre el proceso de polinización",
                    item4: "• Útiles para ambientes controlados (invernaderos)",
                    item5: "• Pueden recolectar datos mientras polinizan",
                    item6: "• Sin riesgo de picaduras o reacciones alérgicas"
                },
                limitations: {
                    title: "Limitaciones",
                    item1: "• No pueden reemplazar servicios ecosistémicos naturales",
                    item2: "• Alto costo inicial y mantenimiento",
                    item3: "• Batería limitada requiere infraestructura de carga",
                    item4: "• No pueden replicar completamente comportamientos naturales",
                    item5: "• No aptos para ecosistemas silvestres",
                    item6: "• Requieren experiencia técnica y soporte",
                    item7: "• No contribuyen a la biodiversidad"
                }
            },
            conclusion: {
                title: "El Camino a Seguir",
                text: "Los robots son suplementos, no reemplazos. Proteger a los polinizadores naturales sigue siendo nuestra directiva principal."
            }
        },
        futureVision: {
            title: "Visión Futura",
            paragraph1: "Esta galería es parte de nuestro archivo vivo integral de los polinizadores de la Tierra. Explore estas magníficas criaturas en tres dimensiones, descubra sus conexiones con flores nacionales y comprenda su papel vital en nuestro ecosistema. A medida que continuamos construyendo este archivo, agregaremos más especies, información detallada y modelos 3D interactivos.",
            paragraph2: "Todas las imágenes provienen de plataformas de libre uso y están debidamente atribuidas. Esta colección continuará creciendo a medida que construimos nuestro archivo vivo."
        },
        card: {
            description: "Descripción",
            region: "Región",
            habitat: "Hábitat",
            conservation: "Conservación",
            status: "Estado",
            view3d: "Ver 3D",
            capabilities: "Capacidades",
            applications: "Aplicaciones",
            advantages: "Ventajas",
            limitations: "Limitaciones",
            readDetails: "Leer Detalles",
            manufacturer: "Fabricante",
            year: "Año",
            model3d: "Modelo 3D",
            typeRobotic: "Robótico",
            loadingModel: "Cargando modelo 3D...",
            statusLabel: "Estado"
        }
    },
    fr: {
        header: {
            back: "Retour aux pollinisateurs",
            language: "Langue :",
            title: "Galerie des Pollinisateurs",
            subtitle: "Découvrez les gardiens invisibles de la vie sur Terre. Cette galerie présente les divers pollinisateurs naturels qui maintiennent l'équilibre de la biodiversité de notre planète, et explore les technologies émergentes de pollinisation robotique."
        },
        crisis: {
            title: "Déclin des Pollinisateurs (2016–2025)",
            subtitle: "La réalité urgente que nous devons affronter",
            report: {
                title: "Rapport IPBES 2016",
                stat1: "90%",
                desc1: "Les plantes sauvages dépendent des pollinisateurs",
                stat2: "75%",
                desc2: "Les cultures vivrières mondiales nécessitent la pollinisation"
            },
            crisis2025: {
                title: "Crise de 2025",
                stat1: "40%",
                desc1: "Les espèces d'invertébrés menacées d'extinction",
                stat2: "9%",
                desc2: "Déclin annuel de la population d'insectes"
            },
            usBees: {
                title: "Colonies d'Abeilles US",
                stat1: "60-70%",
                desc1: "Pertes annuelles de colonies",
                stat2: "22%",
                desc2: "Pollinisateurs indigènes en danger"
            },
            urgentAction: {
                title: "Action Urgente",
                stat1: "Prochaine Décennie",
                desc1: "Décide de la restauration ou de l'effondrement",
                stat2: "Global",
                desc2: "Coordination requise"
            },
            action: {
                title: "Action Mondiale",
                stat: "17",
                desc: "Objectifs de Développement Durable dépendent de la nature"
            },
            mission: {
                title: "Notre Mission",
                desc: "Documenter, préserver et innover pour l'avenir de la pollinisation."
            }
        },
        sections: {
            natural: "Pollinisateurs Naturels",
            naturalSubtitle: "Les moteurs biologiques de notre écosystème",
            robotic: "Pollinisateurs Robotiques",
            roboticSubtitle: "Ingénierie bio-inspirée pour un monde en mutation",
            beesAnts: "Abeilles et Fourmis",
            birds: "Oiseaux",
            butterfliesMoths: "Papillons et Mites",
            bats: "Chauves-souris",
            beetlesOther: "Coléoptères et Autres"
        },
        comparison: {
            title: "Naturel vs. Robotique",
            subtitle: "Pourquoi nous avons besoin des deux",
            natural: {
                title: "Pollinisateurs Naturels",
                advantages: {
                    title: "Avantages",
                    item1: "• Auto-reproducteurs et durables",
                    item2: "• Services écosystémiques au-delà de la pollinisation",
                    item3: "• S'adaptent aux changements environnementaux",
                    item4: "• Aucune infrastructure énergétique requise",
                    item5: "• Contribuent à la biodiversité",
                    item6: "• Co-évolué avec les plantes",
                    item7: "• Soutiennent des écosystèmes entiers"
                },
                challenges: {
                    title: "Défis",
                    item1: "• Vulnérables aux pesticides et perte d'habitat",
                    item2: "• Populations en déclin mondial",
                    item3: "• Ne peuvent pas être contrôlés comme des machines",
                    item4: "• Disponibilité saisonnière"
                }
            },
            robotic: {
                title: "Pollinisateurs Robotiques",
                benefits: {
                    title: "Avantages Potentiels",
                    item1: "• Peuvent travailler 24/7",
                    item2: "• Non affectés par les pesticides",
                    item3: "• Contrôle précis du processus",
                    item4: "• Utiles pour les environnements contrôlés",
                    item5: "• Collecte de données",
                    item6: "• Pas de risque de piqûres"
                },
                limitations: {
                    title: "Limites",
                    item1: "• Ne remplacent pas les services naturels",
                    item2: "• Coût élevé et maintenance",
                    item3: "• Batterie limitée",
                    item4: "• Comportements naturels non reproduits",
                    item5: "• Non adaptés aux écosystèmes sauvages",
                    item6: "• Expertise technique requise",
                    item7: "• Ne contribuent pas à la biodiversité"
                }
            },
            conclusion: {
                title: "La Voie à Suivre",
                text: "Les robots sont des suppléments, pas des remplaçants. La protection des pollinisateurs naturels reste notre priorité."
            }
        },
        futureVision: {
            title: "Vision Future",
            paragraph1: "Cette galerie fait partie de notre archive vivante des pollinisateurs de la Terre. Explorez ces créatures magnifiques en 3D, découvrez leurs liens avec les fleurs nationales et comprenez leur rôle vital dans notre écosystème. Alors que nous continuons à construire cette archive, nous ajouterons plus d'espèces, des informations détaillées et des modèles 3D interactifs.",
            paragraph2: "Toutes les images proviennent de plateformes libres de droits et sont correctement attribuées. Cette collection continuera de croître à mesure que nous construisons notre archive vivante des pollinisateurs de la Terre."
        },
        card: {
            description: "Description",
            region: "Région",
            habitat: "Habitat",
            conservation: "Conservation",
            status: "Statut",
            view3d: "Voir 3D",
            capabilities: "Capacités",
            applications: "Applications",
            advantages: "Avantages",
            limitations: "Limites",
            readDetails: "Lire les Détails",
            manufacturer: "Fabricant",
            year: "Année",
            model3d: "Modèle 3D",
            typeRobotic: "Robotique",
            loadingModel: "Chargement du modèle 3D...",
            statusLabel: "Statut"
        }
    },
    de: {
        header: {
            back: "Zurück zu Bestäubern",
            language: "Sprache:",
            title: "Bestäuber-Galerie",
            subtitle: "Entdecken Sie die unsichtbaren Wächter des Lebens auf der Erde. Diese Galerie zeigt die vielfältigen natürlichen Bestäuber, die die Artenvielfalt unseres Planeten im Gleichgewicht halten, und erkundet aufkommende Technologien der Roboterbestäubung."
        },
        crisis: {
            title: "Bestäuber-Rückgang (2016–2025)",
            subtitle: "Die dringende Realität, der wir uns stellen müssen",
            report: {
                title: "2016 IPBES Bericht",
                stat1: "90%",
                desc1: "Wildblumen sind auf Bestäuber angewiesen",
                stat2: "75%",
                desc2: "Globale Nahrungspflanzen benötigen Bestäubung"
            },
            crisis2025: {
                title: "Krise 2025",
                stat1: "40%",
                desc1: "Wirbellose Bestäuberarten vom Aussterben bedroht",
                stat2: "9%",
                desc2: "Jährlicher Rückgang der Insektenpopulation"
            },
            usBees: {
                title: "US Bienenkolonien",
                stat1: "60-70%",
                desc1: "Jährliche Völkerverluste",
                stat2: "22%",
                desc2: "Einheimische Bestäuber gefährdet"
            },
            urgentAction: {
                title: "Dringende Maßnahmen",
                stat1: "Nächstes Jahrzehnt",
                desc1: "Entscheidet über Wiederherstellung oder Kollaps",
                stat2: "Global",
                desc2: "Koordination erforderlich"
            },
            action: {
                title: "Globale Aktion",
                stat: "17",
                desc: "UN-Ziele für nachhaltige Entwicklung hängen von der Natur ab"
            },
            mission: {
                title: "Unsere Mission",
                desc: "Dokumentieren, bewahren und innovieren für die Zukunft der Bestäubung."
            }
        },
        sections: {
            natural: "Natürliche Bestäuber",
            naturalSubtitle: "Die biologischen Motoren unseres Ökosystems",
            robotic: "Roboter-Bestäuber",
            roboticSubtitle: "Bio-inspirierte Technik für eine sich wandelnde Welt",
            beesAnts: "Bienen & Ameisen",
            birds: "Vögel",
            butterfliesMoths: "Schmetterlinge & Motten",
            bats: "Fledermäuse",
            beetlesOther: "Käfer & Andere"
        },
        comparison: {
            title: "Natürlich vs. Roboter",
            subtitle: "Warum wir beides brauchen",
            natural: {
                title: "Natürliche Bestäuber",
                advantages: {
                    title: "Vorteile",
                    item1: "• Selbstreproduzierend & nachhaltig",
                    item2: "• Ökosystemleistungen über Bestäubung hinaus",
                    item3: "• Anpassungsfähig",
                    item4: "• Keine Energieinfrastruktur nötig",
                    item5: "• Fördert Biodiversität",
                    item6: "• Ko-evolution mit Pflanzen",
                    item7: "• Unterstützt ganze Ökosysteme"
                },
                challenges: {
                    title: "Herausforderungen",
                    item1: "• Anfällig für Pestizide & Habitatverlust",
                    item2: "• Populationen sinken weltweit",
                    item3: "• Nicht steuerbar wie Maschinen",
                    item4: "• Saisonale Verfügbarkeit"
                }
            },
            robotic: {
                title: "Roboter-Bestäuber",
                benefits: {
                    title: "Mögliche Vorteile",
                    item1: "• 24/7 Betrieb",
                    item2: "• Resistent gegen Pestizide",
                    item3: "• Präzise Steuerung",
                    item4: "• Für kontrollierte Umgebungen",
                    item5: "• Datenerfassung",
                    item6: "• Kein Stichrisiko"
                },
                limitations: {
                    title: "Grenzen",
                    item1: "• Kein Ersatz für natürliche Dienste",
                    item2: "• Hohe Kosten & Wartung",
                    item3: "• Begrenzte Batterie",
                    item4: "• Unvollständige Nachahmung",
                    item5: "• Nicht für Wildnis",
                    item6: "• Fachwissen erforderlich",
                    item7: "• Kein Beitrag zur Biodiversität"
                }
            },
            conclusion: {
                title: "Der Weg nach vorn",
                text: "Roboter sind Ergänzungen, kein Ersatz. Schutz der Natur hat Vorrang. Erhaltungsbemühungen, Wiederherstellung von Lebensräumen und nachhaltige landwirtschaftliche Praktiken bleiben die wichtigsten Prioritäten."
            }
        },
        futureVision: {
            title: "Zukunftsvision",
            paragraph1: "Diese Galerie ist Teil unseres lebenden Archivs der Bestäuber. Entdecken Sie diese großartigen Kreaturen in 3D, entdecken Sie ihre Verbindungen zu Nationalblumen und verstehen Sie ihre lebenswichtige Rolle in unserem Ökosystem. Während wir dieses Archiv weiter aufbauen, werden wir weitere Arten, detaillierte Informationen und interaktive 3D-Modelle hinzufügen.",
            paragraph2: "Alle Bilder sind frei verfügbar und ordnungsgemäß zugeordnet. Diese Sammlung wird weiter wachsen, während wir unser lebendes Archiv der Bestäuber der Erde aufbauen."
        },
        card: {
            description: "Beschreibung",
            region: "Region",
            habitat: "Lebensraum",
            conservation: "Erhaltung",
            status: "Status",
            view3d: "3D-Ansicht",
            capabilities: "Fähigkeiten",
            applications: "Anwendungen",
            advantages: "Vorteile",
            limitations: "Grenzen",
            readDetails: "Details lesen",
            manufacturer: "Hersteller",
            year: "Jahr",
            model3d: "3D-Modell",
            typeRobotic: "Roboter",
            loadingModel: "3D-Modell wird geladen...",
            statusLabel: "Status"
        }
    },
    zh: {
        header: {
            back: "返回授粉者",
            language: "语言：",
            title: "授粉者画廊",
            subtitle: "探索地球生命的隐形守护者。本画廊展示了保持地球生物多样性平衡的各种自然授粉者，从微小的蜜蜂到宏伟的蜂鸟，并探索新兴的机器人授粉技术。"
        },
        crisis: {
            title: "授粉者减少 (2016–2025)",
            subtitle: "我们必须面对的紧迫现实",
            report: {
                title: "2016 IPBES 报告",
                stat1: "90%",
                desc1: "野生开花植物依赖授粉者",
                stat2: "75%",
                desc2: "全球粮食作物需要授粉"
            },
            crisis2025: {
                title: "2025 危机",
                stat1: "40%",
                desc1: "无脊椎动物授粉物种面临灭绝",
                stat2: "9%",
                desc2: "昆虫种群年度下降"
            },
            usBees: {
                title: "美国蜂群",
                stat1: "60-70%",
                desc1: "年度蜂群损失",
                stat2: "22%",
                desc2: "本地授粉者面临风险"
            },
            urgentAction: {
                title: "紧急行动",
                stat1: "下一个十年",
                desc1: "决定恢复或崩溃",
                stat2: "全球",
                desc2: "需要协调"
            },
            action: {
                title: "全球行动",
                stat: "17",
                desc: "联合国可持续发展目标依赖自然"
            },
            mission: {
                title: "我们的使命",
                desc: "记录、保存和创新授粉的未来。"
            }
        },
        sections: {
            natural: "自然授粉者",
            naturalSubtitle: "我们生态系统的生物引擎",
            robotic: "机器人授粉者",
            roboticSubtitle: "为不断变化的世界提供的仿生工程",
            beesAnts: "蜜蜂和蚂蚁",
            birds: "鸟类",
            butterfliesMoths: "蝴蝶和飞蛾",
            bats: "蝙蝠",
            beetlesOther: "甲虫及其他"
        },
        comparison: {
            title: "自然 vs. 机器人",
            subtitle: "为什么我们需要两者",
            natural: {
                title: "自然授粉者",
                advantages: {
                    title: "优势",
                    item1: "• 自我繁殖和可持续",
                    item2: "• 提供生态服务",
                    item3: "• 适应环境",
                    item4: "• 无需能源",
                    item5: "• 促进生物多样性",
                    item6: "• 共同进化",
                    item7: "• 支持整个生态系统"
                },
                challenges: {
                    title: "挑战",
                    item1: "• 易受害",
                    item2: "• 种群下降",
                    item3: "• 不可控",
                    item4: "• 季节性"
                }
            },
            robotic: {
                title: "机器人授粉者",
                benefits: {
                    title: "潜在利益",
                    item1: "• 24/7 工作",
                    item2: "• 抗农药",
                    item3: "• 精确控制",
                    item4: "• 适用于温室",
                    item5: "• 数据收集",
                    item6: "• 无刺痛风险"
                },
                limitations: {
                    title: "局限",
                    item1: "• 不能替代自然服务",
                    item2: "• 高成本和维护",
                    item3: "• 电池限制",
                    item4: "• 无法完全复制",
                    item5: "• 不适合野外",
                    item6: "• 需要技术支持",
                    item7: "• 不增加生物多样性"
                }
            },
            conclusion: {
                title: "前进之路",
                text: "机器人是补充，不是替代。保护自然授粉者仍然是我们的首要指令。保护工作、栖息地恢复和可持续农业实践仍然是确保粮食安全和生态系统健康的最紧迫优先事项。"
            }
        },
        futureVision: {
            title: "未来愿景",
            paragraph1: "这个画廊是地球授粉者活档案的一部分。探索这些宏伟的生物，发现它们与国花的联系，并了解它们在我们生态系统中的重要作用。随着我们继续建设这个档案，我们将添加更多物种、详细信息和交互式3D模型。",
            paragraph2: "所有图片均来自免费平台并已正确归属。随着我们建立地球授粉者活档案，该收藏将继续增长。"
        },
        card: {
            description: "描述",
            region: "地区",
            habitat: "栖息地",
            conservation: "保护",
            status: "状态",
            view3d: "3D视图",
            capabilities: "能力",
            applications: "应用",
            advantages: "优势",
            limitations: "局限",
            readDetails: "阅读详情",
            manufacturer: "制造商",
            year: "年份",
            model3d: "3D模型",
            typeRobotic: "机器人",
            loadingModel: "加载3D模型...",
            statusLabel: "状态"
        }
    }
};
