import { useState, useEffect } from "react";

// ===== TIPOS =====
interface Review {
  text: string;
  date: string;
}

interface Game {
  title: string;
  year: string;
  company: string;
  mode: string;
  duration: string;
  image: string;
  review: string;
  reviews: Review[];
}

// ===== TARJETA DE JUEGO =====
function GameCard({
  game,
  onDelete,
  onAddReview
}: {
  game: Game;
  onDelete: () => void;
  onAddReview: (text: string) => void;
}) {
  const [reviewText, setReviewText] = useState("");

  const submitReview = () => {
    if (reviewText.trim() === "") return;
    onAddReview(reviewText);
    setReviewText("");
  };

  return (
    <div className="bg-[#1e1a27] border border-[#3a3346] rounded-xl p-4 shadow-[0_0_15px_rgba(117,104,150,0.3)] hover:shadow-[0_0_25px_rgba(170,150,255,0.5)] transition-all duration-300 text-[#e3dff7]">
      
      <h3 className="text-xl font-bold mb-2">{game.title}</h3>

      <img
        src={game.image || "https://i.imgur.com/Z9Z4H0W.png"}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <div className="text-xs space-y-1 mb-4 opacity-70">
        <p><strong>Año:</strong> {game.year}</p>
        <p><strong>Compañía:</strong> {game.company}</p>
        <p><strong>Modo:</strong> {game.mode}</p>
        <p><strong>Duración:</strong> {game.duration} hrs</p>
      </div>

      {game.review && (
        <p className="text-sm italic mb-4 border-l-4 pl-3 border-[#7157a8]">
          {game.review}
        </p>
      )}

      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
        {game.reviews.map((r, index) => (
          <div key={index} className="bg-[#2a2235] border border-[#3a3346] p-2 rounded">
            <p className="text-xs">{r.text}</p>
            <span className="block text-[10px] opacity-60 mt-1">{r.date}</span>
          </div>
        ))}
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full bg-[#2a2235] border border-[#3a3346] rounded p-2 text-sm mb-2"
        placeholder="Añadir reseña..."
      />

      <button
        onClick={submitReview}
        className="bg-[#6c4fe0] hover:bg-[#8d6bff] text-white px-3 py-1 rounded mr-2"
      >
        Agregar reseña
      </button>

      <button
        onClick={onDelete}
        className="bg-[#e05a72] hover:bg-[#ff6f8c] text-white px-3 py-1 rounded"
      >
        Eliminar
      </button>
    </div>
  );
}

// ===== APP PRINCIPAL =====
export default function App() {
  const [games, setGames] = useState<Game[]>([]);

  const [game, setGame] = useState<Game>({
    title: "",
    year: "",
    company: "",
    mode: "Singleplayer",
    duration: "",
    image: "",
    review: "",
    reviews: []
  });

  // === Cargar localStorage ===
  useEffect(() => {
    const stored = localStorage.getItem("games");
    if (stored) setGames(JSON.parse(stored));
  }, []);

  // === Guardar en localStorage ===
  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setGame({ ...game, [e.target.name]: e.target.value });
  };

  const addGame = () => {
    if (!game.title.trim()) return alert("El juego necesita título.");

    setGames([...games, game]);

    setGame({
      title: "",
      year: "",
      company: "",
      mode: "Singleplayer",
      duration: "",
      image: "",
      review: "",
      reviews: []
    });
  };

  const removeGame = (index: number) => {
    setGames(games.filter((_, i) => i !== index));
  };

  const addReviewToGame = (index: number, text: string) => {
    const updated = [...games];
    updated[index].reviews.push({
      text,
      date: new Date().toLocaleString()
    });
    setGames(updated);
  };

  return (
    <div className="min-h-screen bg-[#18121F] text-[#f0e6d6] p-8">

      <div className="max-w-4xl mx-auto bg-[#1e1328] border border-[#e6d2a040] p-8 rounded-xl mb-10">
        <h2 className="text-3xl font-bold mb-6 text-[#f0d9a6]">
          ✨ Añadir un Juego
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input name="title" value={game.title} onChange={handleChange} placeholder="Título" className="retro-input" />
          <input name="year" value={game.year} onChange={handleChange} placeholder="Año" className="retro-input" />
          <input name="company" value={game.company} onChange={handleChange} placeholder="Empresa" className="retro-input" />

          <select name="mode" value={game.mode} onChange={handleChange} className="retro-input">
            <option>Singleplayer</option>
            <option>Multiplayer</option>
            <option>Co-op</option>
            <option>Online</option>
          </select>

          <input name="duration" value={game.duration} onChange={handleChange} placeholder="Duración (hrs)" className="retro-input" />
          <input name="image" value={game.image} onChange={handleChange} placeholder="URL imagen" className="retro-input" />
        </div>

        <textarea name="review" value={game.review} onChange={handleChange} placeholder="Reseña inicial..." className="retro-input h-28 resize-none" />

        <button onClick={addGame} className="retro-btn-gold px-5 py-2 rounded-lg mt-4">
          Añadir Juego
        </button>
      </div>

      {/* Lista de juegos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((g, i) => (
          <GameCard
            key={i}
            game={g}
            onDelete={() => removeGame(i)}
            onAddReview={(text) => addReviewToGame(i, text)}
          />
        ))}
      </div>
    </div>
  );
}
