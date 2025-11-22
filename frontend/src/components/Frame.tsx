import React from "react";

type Props = { children: React.ReactNode; greeting?: string };

export default function Frame({ children, greeting = "¡Bienvenido, jugador!" }: Props) {
  return (
    <div className="min-h-screen retro-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-black bg-opacity-80 border-4 border-yellow-400 retro-frame p-6 rounded-lg shadow-2xl text-white">
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest retro-text">
            {greeting}
          </h1>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}