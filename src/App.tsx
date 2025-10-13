import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const frases = [
    "Crea sin miedo, aprende sin prisa.",
    "Cada línea de código también escribe tu historia.",
    "La sencillez es la máxima sofisticación.",
    "Lo bello también puede ser lógico.",
  ];

  const [frase, setFrase] = useState(frases[0]);
  const [section, setSection] = useState("inicio");
  const [isDark, setIsDark] = useState(false);

  // 🪟 Estado del modal
  const [modal, setModal] = useState<{
    title?: string;
    description?: string;
    image?: string;
    iframe?: string;
    repo?: string;
  } | null>(null);

  // Inicializar modo oscuro
  useEffect(() => {
    const htmlEl = document.documentElement;
    const initial = htmlEl.classList.contains("dark");
    setIsDark(initial);
  }, []);

  // Cambiar frases cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const random = frases[Math.floor(Math.random() * frases.length)];
      setFrase(random);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔊 Sonido
  const playSound = () => {
    const audio = new Audio("/src/assets/click.mp3");
    audio.play();
  };

  // 🌗 Modo claro / oscuro
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-all duration-700 ${
        isDark
          ? "text-gray-200 dark:bg-[rgba(20,20,20,0.7)]"
          : "text-slate-800 bg-[rgba(255,255,255,0.8)]"
      }`}
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora-bg"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl shadow-md rounded-2xl mx-6 mt-4 border border-white/30 dark:border-gray-700/30">
        <h1 className="text-2xl font-bold text-[#264653] dark:text-[#e9c46a]">
          Mi Proyecto Final
        </h1>

        <nav className="flex items-center gap-3">
          {["inicio", "proyectos", "habilidades", "contacto"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setSection(item);
                playSound();
              }}
              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                section === item
                  ? isDark
                    ? "bg-[#e9c46a] text-gray-900"
                    : "bg-[#2a9d8f] text-white"
                  : isDark
                  ? "hover:bg-[#e9c46a]/40 dark:hover:bg-[#e9c46a]/30"
                  : "hover:bg-[#2a9d8f]/20"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            onClick={toggleDark}
            className="ml-4 text-lg hover:scale-110 transition-transform"
          >
            🌞 / 🌙
          </button>
        </nav>
      </header>

      <p className="text-center italic mt-4">{frase}</p>

      <motion.main
        key={section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-8 text-center relative z-10 ${
          modal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* 🏠 Inicio */}
        {section === "inicio" && (
          <section>
            <h2 className="text-4xl font-bold mb-4">¡Hola, soy May! 👋</h2>
            <p className="max-w-2xl mx-auto">
              Soy una mente curiosa y creativa, apasionada por el arte de construir,
              comunicar y aprender. Bienvenida a mi universo digital.
            </p>
          </section>
        )}

        {/* 💼 Proyectos */}
        {section === "proyectos" && (
          <section>
            <h2 className="text-3xl font-semibold text-[#2a9d8f] mb-6 dark:text-[#e9c46a]">
              Mis Proyectos 💼
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Gestor Web",
                  description:
                    "Aplicación diseñada para organizar información digital. Desarrollada con React y Firebase.",
                  image: "/src/assets/proyecto1.png",
                  iframe: "https://may311-7.github.io/gestor-web-demo/",
                  repo: "https://github.com/may311-7/gestor-web",
                },
                {
                  title: "Aplicación React",
                  description:
                    "SPA construida con React + Vite, usando TailwindCSS y Framer Motion para animaciones suaves.",
                  image: "/src/assets/proyecto2.png",
                  iframe: "https://may311-7.github.io/app-react-demo/",
                  repo: "https://github.com/may311-7/app-react",
                },
                {
                  title: "Diseño UI",
                  description:
                    "Proyecto enfocado en diseño minimalista y experiencia de usuario, creado en Figma.",
                  image: "/src/assets/proyecto3.png",
                  iframe: "https://www.figma.com/proto/may-ui-demo",
                  repo: "https://dribbble.com/may311",
                },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/70 dark:bg-[#2b2b2b]/70 backdrop-blur-lg shadow-md rounded-xl p-6 border border-white/40 dark:border-gray-700/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-2 text-[#264653] dark:text-[#e9c46a]">
                    {p.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 text-justify">
                    {p.description}
                  </p>

                  <div className="flex justify-center gap-3 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setModal(p)}
                      className="bg-[#2a9d8f] text-white px-4 py-2 rounded-lg hover:bg-[#21867a] transition"
                    >
                      Ver Demo
                    </motion.button>
                    <motion.a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.9 }}
                      className="border border-[#2a9d8f] text-[#2a9d8f] dark:text-[#e9c46a] px-4 py-2 rounded-lg hover:bg-[#2a9d8f]/10"
                    >
                      Repositorio
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 🧠 Habilidades */}
        {section === "habilidades" && (
          <section>
            <h2 className="text-3xl font-semibold mb-6">Habilidades 🎓</h2>
            <div className="max-w-lg mx-auto mt-6 space-y-4">
              {[
                { skill: "React", level: 90 },
                { skill: "Tailwind", level: 85 },
                { skill: "Comunicación", level: 95 },
              ].map(({ skill, level }) => (
                <div key={skill}>
                  <p className="font-semibold">{skill}</p>
                  <div className="w-full bg-slate-300/50 dark:bg-slate-600/60 rounded-full h-3">
                    <div
                      className="bg-[#e76f51] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 💌 Contacto */}
        {section === "contacto" && (
          <section>
            <h2 className="text-3xl font-semibold mb-4">Contáctame</h2>
            <p className="mb-6">
              ¿Quieres colaborar o charlar sobre ideas? ¡Estoy disponible!
            </p>

            <form
              action="https://formspree.io/f/mblzpand"
              method="POST"
              className="flex flex-col gap-3 max-w-md mx-auto bg-white/70 dark:bg-gray-800/70 p-6 rounded-xl shadow-md backdrop-blur-xl border border-white/30 dark:border-gray-700/30"
            >
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                className="border border-slate-300/60 p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                required
              />
              <input
                type="email"
                name="_replyto"
                placeholder="Tu correo"
                className="border border-slate-300/60 p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                required
              />
              <textarea
                name="message"
                placeholder="Tu mensaje"
                className="border border-slate-300/60 p-2 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]"
                rows={4}
                required
              />
              <button
                type="submit"
                className="bg-[#2a9d8f] text-white px-4 py-2 rounded-lg hover:bg-[#21867a] transition"
              >
                Enviar
              </button>
            </form>

            <div className="flex justify-center gap-4 mt-6">
              <a
                href="mailto:tucorreo@ejemplo.com"
                className="bg-[#e9c46a] text-[#264653] px-4 py-2 rounded-lg hover:bg-[#dcbf61]"
              >
                Enviar Correo
              </a>
              <a
                href="https://www.linkedin.com/in/maycoll-hidalgo-259969369"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2a9d8f] text-white px-4 py-2 rounded-lg hover:bg-[#21867a]"
              >
                LinkedIn
              </a>
              <a
                href="/Maycoll-hidalgo-CV.pdf"
                download
                className="bg-[#e76f51] text-white px-4 py-2 rounded-lg hover:bg-[#cf5d43]"
              >
                Descargar CV 📄
              </a>
            </div>
          </section>
        )}
      </motion.main>

      {/* ✨ Modal de previsualización */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg p-6 max-w-3xl w-full relative border border-white/20 dark:border-gray-700/40"
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-[#e76f51]"
              >
                ✖
              </button>

              <h3 className="text-2xl font-bold mb-3 text-[#264653] dark:text-[#e9c46a]">
                {modal.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-justify">
                {modal.description}
              </p>

              {modal.image && (
                <img
                  src={modal.image}
                  alt={modal.title}
                  className="rounded-xl shadow-md w-full object-cover"
                />
              )}

              {modal.iframe && (
                <iframe
                  src={modal.iframe}
                  title={modal.title}
                  className="w-full h-[400px] rounded-xl border-none shadow-inner"
                ></iframe>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-12 py-4 text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} — Mi Proyecto Final | Desarrollado con React
      </footer>
    </div>
  );
}

export default App;

