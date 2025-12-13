"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

const ComingSoonBooks = () => {
  const [language, setLanguage] = useState('en');

  // Auto-detect language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.languages?.[0] || 'en';
      const primaryLang = browserLang.split('-')[0].toLowerCase();
      const storedLang = localStorage.getItem('nahiara_language');
      setLanguage(storedLang === 'es' ? 'es' : (primaryLang === 'es' ? 'es' : 'en'));
    }
  }, []);

  const tomes = [
    {
      id: 1,
      title: {
        en: "The First Bloom Vision",
        es: "La Primera Visión del Florecer"
      },
      cover: "/books/1.png",
      spine: "/books/Book-Cover---Vol1-Spanish-Spine.png",
      prologue: {
        en: "Before the world learned how to forget, flowers kept the memory of the Earth. When silence began to spread and names started to fade, Nahiara was born. Not as a heroine, but as someone able to listen. Where others perceived nothing, she recognized signals, echoes, and warnings. This is the beginning of a journey that weaves memory, nature, and destiny. The first step of a saga where every flower matters and every memory can change the course of the world.",
        es: "Antes de que el mundo aprendiera a olvidar, las flores guardaban la memoria de la Tierra. Cuando el silencio comenzó a extenderse y los nombres empezaron a borrarse, nació Nahiara. No como una heroína, sino como alguien capaz de escuchar. Allí donde otros no percibían nada, ella reconocía señales, ecos y advertencias. Este es el inicio de un viaje que une memoria, naturaleza y destino. El primer paso de una saga donde cada flor importa y cada recuerdo puede cambiar el rumbo del mundo."
      }
    },
    {
      id: 2,
      title: {
        en: "The Green Legion Awakens",
        es: "La Legión Verde Despierta"
      },
      cover: "/books/2.png",
      spine: "/books/Book-Cover---Vol2-Spine.png",
      prologue: {
        en: "When the earth remains silent, the smallest take flight. A buzz becomes a chorus, a flutter becomes a storm. From every corner, the forgotten guardians are summoned by an emerald light. They are not an army of steel, but of wings and antennae. The Green Legion awakens, and the natural world prepares to fight back.",
        es: "Cuando la tierra permanece en silencio, los más pequeños alzan el vuelo. Un zumbido se convierte en un coro, un aleteo en una tormenta. Desde todos los rincones, los guardianes olvidados son convocados por una luz esmeralda. No son un ejército de acero, sino de alas y antenas. La Legión Verde despierta, y el mundo natural se prepara para luchar."
      }
    },
    {
      id: 3,
      title: {
        en: "The Storms of a Withering World",
        es: "Las Tormentas de un Mundo que se Marchita"
      },
      cover: "/books/3.png",
      spine: "/books/Book-Cover---Vol3-spine.png",
      prologue: {
        en: "The sky tears itself apart in golden lightning, and rain falls like ash upon a withering world. Amidst the fury of a dying nature, a single flower refuses to bow. This is not just a battle against darkness, but a war against despair. Can a single spark of life defy the storm at the end of the world?",
        es: "El cielo se desgarra en relámpagos dorados y la lluvia cae como ceniza sobre un mundo que se marchita. En medio de la furia de una naturaleza moribunda, una sola flor se niega a inclinarse. No es solo una batalla contra la oscuridad, sino una guerra contra la desesperación. ¿Puede una sola chispa de vida desafiar a la tormenta del fin del mundo?"
      }
    },
    {
      id: 4,
      title: {
        en: "The Rise of NAHIARA",
        es: "El Ascenso de NAHIARA"
      },
      cover: "/books/4.png",
      spine: "/books/Book-Cover---Vol4-Spine.png",
      prologue: {
        en: "The enemy has changed. It no longer hides in the shadows, but in the code. Reality pixelates, nature becomes a system error, and circuits replace roots. In a digital world where everything is a simulation, an impossible rose blooms amidst the rain of ones and zeros. The war has entered the machine.",
        es: "El enemigo ha cambiado. Ya no se esconde en las sombras, sino en el código. La realidad se pixela, la naturaleza se convierte en un error del sistema y los circuitos reemplazan a las raíces. En un mundo digital donde todo es una simulación, una rosa imposible florece entre la lluvia de unos y ceros. La guerra ha entrado en la máquina."
      }
    },
    {
      id: 5,
      title: {
        en: "The Cost of Desire",
        es: "El Precio del Deseo"
      },
      cover: "/books/5.png",
      spine: "/books/Book-Cover---Vol5-Spine.png",
      prologue: {
        en: "In a world of runways and camera flashes, beauty has a price. Every petal, a price tag; every stem, a golden chain. To be desired is to be consumed, to be admired is to be hounded by a thousand blind eyes. Here, the battle is not fought in the fields, but on the red carpets, where the greatest danger is not oblivion, but the cost of being unforgettable.",
        es: "En un mundo de pasarelas y flashes, la belleza tiene un precio. Cada pétalo, una etiqueta; cada tallo, una cadena de oro. Ser deseado es ser consumido, ser admirado es ser acosado por mil ojos ciegos. Aquí, la batalla no se libra en los campos, sino en las alfombras rojas, donde el mayor peligro no es el olvido, sino el costo de ser inolvidable."
      }
    },
    {
      id: 6,
      title: {
        en: "The Altered Nature Protocol",
        es: "El Protocolo de la Naturaleza Alterada"
      },
      cover: "/books/6.png",
      spine: "/books/Book-Cover---Vol6-Spine.png",
      prologue: {
        en: "The corruption has reached its peak. Nature is no longer the victim, but the weapon. A protocol has been activated, and from the earth sprouts a monstrosity of acid and fury. What was once life is now a plague, what was beautiful is now terror. This is not the death of nature, it is its perversion. And it is alive.",
        es: "La corrupción ha llegado a su fin. La naturaleza ya no es la víctima, sino el arma. Un protocolo ha sido activado, y de la tierra brota una monstruosidad de ácido y furia. Lo que antes era vida ahora es una plaga, lo que era bello ahora es terror. Esto no es la muerte de la naturaleza, es su perversión. Y está viva."
      }
    },
    {
      id: 7,
      title: {
        en: "The Bloom of the Last Dawn",
        es: "El Florecer del Último Amanecer"
      },
      cover: "/books/7.png",
      spine: "/books/Book-Cover---Vol7-Spanish-spine.png",
      prologue: {
        en: "After the noise, silence. After the darkness, dawn. In the cosmic void, one last flower blooms, not with the fury of battle, but with the serenity of creation. In its petals are inscribed the sacred geometry of the universe, the formula for water, the secret of a new beginning. This is not the end of the war; it is the birth of a new universe.",
        es: "Después del ruido, el silencio. Después de la oscuridad, un amanecer. En el vacío cósmico, una última flor florece, no con la furia de la batalla, sino con la serenidad de la creación. En sus pétalos se inscribe la geometría sagrada del universo, la fórmula del agua, el secreto de un nuevo comienzo. No es el fin de la guerra, es el nacimiento de un nuevo universo."
      }
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.02em' }}
          >
            {language === 'en' ? 'Coming Soon' : 'Próximamente'}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'Exo 2, sans-serif' }}
          >
            {language === 'en' 
              ? 'The saga continues. Discover the next chapters of Nahiara\'s journey.'
              : 'La saga continúa. Descubre los próximos capítulos del viaje de Nahiara.'
            }
          </motion.p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => {
                setLanguage('en');
                if (typeof window !== 'undefined') {
                  localStorage.setItem('nahiara_language', 'en');
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('es');
                if (typeof window !== 'undefined') {
                  localStorage.setItem('nahiara_language', 'es');
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                language === 'es'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Español
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {tomes.map((tome, index) => (
            <motion.div
              key={tome.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                {/* Coming Soon Banner */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-2 px-4 text-center">
                  <span className="text-sm md:text-base font-bold tracking-wider" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.1em' }}>
                    {language === 'en' ? 'COMING SOON' : 'PRÓXIMAMENTE'}
                  </span>
                </div>

                {/* Book Cover */}
                <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden mt-10">
                  <Image
                    src={tome.cover}
                    alt={tome.title[language]}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Tome Number */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {language === 'en' ? `Tome ${tome.id}` : `Tomo ${tome.id}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Exo 2, sans-serif', letterSpacing: '0.01em' }}>
                    {tome.title[language]}
                  </h3>

                  {/* Prologue */}
                  <div className="flex-1">
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed italic" style={{ fontFamily: 'Crimson Text, serif', lineHeight: '1.7' }}>
                      "{tome.prologue[language]}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-500 text-sm md:text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {language === 'en'
              ? 'Stay tuned for release dates and pre-order information.'
              : 'Mantente atento para fechas de lanzamiento e información de preventa.'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonBooks;

