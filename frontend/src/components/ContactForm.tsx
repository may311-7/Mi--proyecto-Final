import React, { useEffect, useState, useRef } from "react";

type FormData = {
  nombre: string;
  email: string;
  texto: string;
  telefono?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({ nombre: "", email: "", texto: "", telefono: "" });
  const [status, setStatus] = useState<string>("idle"); // idle | saving | saved | error
  const draftKey = "contactDraftId";
  const timeoutRef = useRef<number | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    // intentar cargar draftId anterior y rellenar (opcional: GET del servidor)
    const draftId = localStorage.getItem(draftKey);
    if (draftId) {
      // opcional: fetch para cargar datos reales si existe en backend
      fetch(`${API_BASE}/api/contacto/${draftId}`)
        .then((r) => {
          if (!r.ok) throw new Error("no encontrado");
          return r.json();
        })
        .then((data) => {
          // mapear solo campos conocidos
          setForm({
            nombre: data.nombre || "",
            email: data.email || "",
            texto: data.texto || "",
            telefono: data.telefono || "",
          });
        })
        .catch(() => {
          // si no existe, simplemente ignorar
        });
    }
    // limpiar timers al desmontar
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // cada cambio programa un autosave
  useEffect(() => {
    // no autosave si componente está recién montado y vacío
    // debounce 1200ms
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      void autosave();
    }, 1200);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function autosave() {
    if (savingRef.current) return;
    savingRef.current = true;
    setStatus("saving");
    try {
      const draftId = localStorage.getItem(draftKey);
      const payload = { ...form, draft: true };
      let res;
      if (draftId) {
        // actualizar
        res = await fetch(`${API_BASE}/api/contacto/${draftId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // crear nuevo draft
        res = await fetch(`${API_BASE}/api/contacto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Error guardando autosave");
      const data = await res.json();
      const id = (data.data && data.data._id) || (data._id) || (data.id);
      if (id) localStorage.setItem(draftKey, id);
      setStatus("saved");
      // marcar saved por un momento
      setTimeout(() => setStatus("idle"), 900);
    } catch (err) {
      setStatus("error");
    } finally {
      savingRef.current = false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const draftId = localStorage.getItem(draftKey);
      const payload = { ...form, draft: false };
      let res;
      if (draftId) {
        res = await fetch(`${API_BASE}/api/contacto/${draftId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/contacto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Error enviando");
      // eliminado el draft guardado localmente tras envío exitoso
      localStorage.removeItem(draftKey);
      setForm({ nombre: "", email: "", texto: "", telefono: "" });
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 900);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} className="mt-1 block w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} className="mt-1 block w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Mensaje</label>
        <textarea name="texto" value={form.texto} onChange={handleChange} rows={6} className="mt-1 block w-full" />
      </div>

      <div className="flex items-center justify-between">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Enviar</button>
        <div className="text-sm">
          {status === "saving" && <span>Guardando...</span>}
          {status === "saved" && <span>Guardado</span>}
          {status === "error" && <span className="text-red-600">Error al guardar</span>}
        </div>
      </div>
    </form>
  );
}