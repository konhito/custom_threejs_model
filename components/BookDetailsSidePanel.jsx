"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { safeGetItem, safeSetItem } from "../lib/storage";

const tomeData = {
  1: {
    title: {
      en: "The First Bloom Vision",
      es: "La Primera Visión del Florecer"
    },
    prologue: {
      en: "Before the world learned how to forget, flowers kept the memory of the Earth. When silence began to spread and names started to fade, Nahiara was born. Not as a heroine, but as someone able to listen. Where others perceived nothing, she recognized signals, echoes, and warnings. This is the beginning of a journey that weaves memory, nature, and destiny. The first step of a saga where every flower matters and every memory can change the course of the world.",
      es: "Antes de que el mundo aprendiera a olvidar, las flores guardaban la memoria de la Tierra. Cuando el silencio comenzó a extenderse y los nombres empezaron a borrarse, nació Nahiara. No como una heroína, sino como alguien capaz de escuchar. Allí donde otros no percibían nada, ella reconocía señales, ecos y advertencias. Este es el inicio de un viaje que une memoria, naturaleza y destino. El primer paso de una saga donde cada flor importa y cada recuerdo puede cambiar el rumbo del mundo."
    }
  },
  2: {
    title: {
      en: "The Green Legion Awakens",
      es: "La Legión Verde Despierta"
    },
    prologue: {
      en: "When the earth remains silent, the smallest take flight. A buzz becomes a chorus, a flutter becomes a storm. From every corner, the forgotten guardians are summoned by an emerald light. They are not an army of steel, but of wings and antennae. The Green Legion awakens, and the natural world prepares to fight back.",
      es: "Cuando la tierra permanece en silencio, los más pequeños alzan el vuelo. Un zumbido se convierte en un coro, un aleteo en una tormenta. Desde todos los rincones, los guardianes olvidados son convocados por una luz esmeralda. No son un ejército de acero, sino de alas y antenas. La Legión Verde despierta, y el mundo natural se prepara para luchar."
    }
  },
  3: {
    title: {
      en: "The Storms of a Withering World",
      es: "Las Tormentas de un Mundo que se Marchita"
    },
    prologue: {
      en: "The sky tears itself apart in golden lightning, and rain falls like ash upon a withering world. Amidst the fury of a dying nature, a single flower refuses to bow. This is not just a battle against darkness, but a war against despair. Can a single spark of life defy the storm at the end of the world?",
      es: "El cielo se desgarra en relámpagos dorados y la lluvia cae como ceniza sobre un mundo que se marchita. En medio de la furia de una naturaleza moribunda, una sola flor se niega a inclinarse. No es solo una batalla contra la oscuridad, sino una guerra contra la desesperación. ¿Puede una sola chispa de vida desafiar a la tormenta del fin del mundo?"
    }
  },
  4: {
    title: {
      en: "The Rise of NAHIARA",
      es: "El Ascenso de NAHIARA"
    },
    prologue: {
      en: "The enemy has changed. It no longer hides in the shadows, but in the code. Reality pixelates, nature becomes a system error, and circuits replace roots. In a digital world where everything is a simulation, an impossible rose blooms amidst the rain of ones and zeros. The war has entered the machine.",
      es: "El enemigo ha cambiado. Ya no se esconde en las sombras, sino en el código. La realidad se pixela, la naturaleza se convierte en un error del sistema y los circuitos reemplazan a las raíces. En un mundo digital donde todo es una simulación, una rosa imposible florece entre la lluvia de unos y ceros. La guerra ha entrado en la máquina."
    }
  },
  5: {
    title: {
      en: "The Cost of Desire",
      es: "El Precio del Deseo"
    },
    prologue: {
      en: "In a world of runways and camera flashes, beauty has a price. Every petal, a price tag; every stem, a golden chain. To be desired is to be consumed, to be admired is to be hounded by a thousand blind eyes. Here, the battle is not fought in the fields, but on the red carpets, where the greatest danger is not oblivion, but the cost of being unforgettable.",
      es: "En un mundo de pasarelas y flashes, la belleza tiene un precio. Cada pétalo, una etiqueta; cada tallo, una cadena de oro. Ser deseado es ser consumido, ser admirado es ser acosado por mil ojos ciegos. Aquí, la batalla no se libra en los campos, sino en las alfombras rojas, donde el mayor peligro no es el olvido, sino el costo de ser inolvidable."
    }
  },
  6: {
    title: {
      en: "The Altered Nature Protocol",
      es: "El Protocolo de la Naturaleza Alterada"
    },
    prologue: {
      en: "The corruption has reached its peak. Nature is no longer the victim, but the weapon. A protocol has been activated, and from the earth sprouts a monstrosity of acid and fury. What was once life is now a plague, what was beautiful is now terror. This is not the death of nature, it is its perversion. And it is alive.",
      es: "La corrupción ha llegado a su fin. La naturaleza ya no es la víctima, sino el arma. Un protocolo ha sido activado, y de la tierra brota una monstruosidad de ácido y furia. Lo que antes era vida ahora es una plaga, lo que era bello ahora es terror. Esto no es la muerte de la naturaleza, es su perversión. Y está viva."
    }
  },
  7: {
    title: {
      en: "The Bloom of the Last Dawn",
      es: "El Florecer del Último Amanecer"
    },
    prologue: {
      en: "After the noise, silence. After the darkness, dawn. In the cosmic void, one last flower blooms, not with the fury of battle, but with the serenity of creation. In its petals are inscribed the sacred geometry of the universe, the formula for water, the secret of a new beginning. This is not the end of the war; it is the birth of a new universe.",
      es: "Después del ruido, el silencio. Después de la oscuridad, un amanecer. En el vacío cósmico, una última flor florece, no con la furia de la batalla, sino con la serenidad de la creación. En sus pétalos se inscribe la geometría sagrada del universo, la fórmula del agua, el secreto de un nuevo comienzo. No es el fin de la guerra, es el nacimiento de un nuevo universo."
    }
  }
};

// Animated Title Component with TiltedCard-like hover interaction
const AnimatedTitle = ({ title }) => {
  const ref = useRef(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30, mass: 2 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30, mass: 2 });
  const scale = useSpring(1, { stiffness: 100, damping: 30, mass: 2 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    
    const rotationX = (offsetY / (rect.height / 2)) * -8; // Similar to TiltedCard
    const rotationY = (offsetX / (rect.width / 2)) * 8;
    
    rotateX.set(rotationX);
    rotateY.set(rotationY);
  };

  const handleMouseEnter = () => {
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className="mb-6 flex-shrink-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight cursor-default"
        style={{
          fontFamily: 'Exo 2, sans-serif',
          letterSpacing: '0.01em',
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
};

export const BookDetailsSidePanel = ({ tomeNumber }) => {
  const [language, setLanguage] = useState('en');
  const tomeInfo = tomeData[tomeNumber];

  // Auto-detect language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.languages?.[0] || 'en';
      const primaryLang = browserLang.split('-')[0].toLowerCase();
      const storedLang = safeGetItem('nahiara_language');
      setLanguage(storedLang === 'es' ? 'es' : (primaryLang === 'es' ? 'es' : 'en'));
    }
  }, []);

  if (!tomeInfo) return null;

  return (
    <div className="flex flex-col min-h-0">
      {/* Tome Number */}
      <div className="mb-4 flex-shrink-0">
        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {language === 'en' ? `Tome ${tomeNumber}` : `Tomo ${tomeNumber}`}
        </span>
      </div>

      {/* Title with Animated Hover Effect */}
      <AnimatedTitle title={tomeInfo.title[language]} />

      {/* Language Toggle */}
      <div className="mb-6 flex-shrink-0">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => {
              setLanguage('en');
              safeSetItem('nahiara_language', 'en');
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
              safeSetItem('nahiara_language', 'es');
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

      {/* Prologue - Scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#10b981 #f0fdf4'
      }}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {language === 'en' ? 'Prologue' : 'Prólogo'}
        </h3>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic pb-4" style={{ fontFamily: 'Crimson Text, serif', lineHeight: '1.8' }}>
          "{tomeInfo.prologue[language]}"
        </p>
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex-shrink-0">
        <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {language === 'en'
            ? 'Stay tuned for release dates and pre-order information.'
            : 'Mantente atento para fechas de lanzamiento e información de preventa.'
          }
        </p>
      </div>
    </div>
  );
};

