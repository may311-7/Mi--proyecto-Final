import React, { useEffect, useState } from "react";
import { loadJSON, saveJSON } from "../utils/persist";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000";

type Juego = { _id?: string; titulo: string; plataforma?: string; descripcion?: string };
type Resena = { _id?: string; juego?: string; usuario?: string; rating: number; texto?: string; draft?: boolean };

export default function GamesAndReviews() {
  const [juegos, setJuegos] = useState<Juego[]>(() => loadJSON<Juego[]>("juegos", []));
  const [resenas, setResenas] = useState<Resena[]>(() => loadJSON<Resena[]>("resenas", []));

  useEffect(() => {
    // intentar sincronizar con backend y luego guardar local
    fetch(`${API}/api/juegos`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJuegos(data);
          saveJSON("juegos", data);
        }
      })
      .catch(() => {}); // keep local if offline

    fetch(`${API}/api/resenas`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResenas(data);
          saveJSON("resenas", data);
        }
      })
      .catch(() => {});
  }, []);

  // crear juego local+server
  async function addJuego(payload: Juego) {
    // local immediate
    const tmp: Juego = { ...payload, _id: `local-${Date.now()}` };
    const newList = [tmp, ...juegos];
    setJuegos(newList);
    saveJSON("juegos", newList);

    // sync server
    try {
      const res = await fetch(`${API}/api/juegos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const body = await res.json();
        // replace local temp id with server id
        const server = body.data || body;
        setJuegos((prev) => {
          const replaced = prev.map((p) => (p._id === tmp._id ? server : p));
          saveJSON("juegos", replaced);
          return replaced;
        });
      }
    } catch {
      // offline: remain local
    }
  }

  // crear reseña local+server
  async function addResena(payload: Resena) {
    const tmp: Resena = { ...payload, _id: `local-${Date.now()}` };
    const newList = [tmp, ...resenas];
    setResenas(newList);
    saveJSON("resenas", newList);

    try {
      const res = await fetch(`${API}/api/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const body = await res.json();
        const server = body.data || body;
        setResenas((prev) => {
          const replaced = prev.map((p) => (p._id === tmp._id ? server : p));
          saveJSON("resenas", replaced);
          return replaced;
        });
      }
    } catch {
      // offline
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Juegos</h3>
        <button onClick={() => addJuego({ titulo: "Nuevo juego " + Date.now() })} className="px-3 py-1 bg-green-600 text-white rounded">Agregar</button>
        <ul>
          {juegos.map((j) => (
            <li key={j._id}>{j.titulo} {j._id?.toString().startsWith("local-") && <em>(offline)</em>}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold">Reseñas</h3>
        <button onClick={() => addResena({ usuario: "Anon", rating: 5, texto: "Buen juego" })} className="px-3 py-1 bg-blue-600 text-white rounded">Agregar reseña</button>
        <ul>
          {resenas.map((r) => (
            <li key={r._id}>{r.usuario} — {r.rating} {r._id?.toString().startsWith("local-") && <em>(offline)</em>} <div>{r.texto}</div></li>
          ))}
        </ul>
      </div>
    </div>
  );
}