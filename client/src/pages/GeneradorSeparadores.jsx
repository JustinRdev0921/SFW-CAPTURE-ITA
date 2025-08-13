// src/pages/SeparatorsGenerator.jsx
import React, { useState } from 'react';
import CategoryCascade from '../components/softexpert/CategoryCascade';
import { downloadSeparator } from '../utils/generadorSep/separadores';

export default function GeneradorSeparadores() {
  const [path, setPath] = useState([]);

  const generarUltimo = async () => {
    if (path.length === 0) return;
    const last = path[path.length - 1];
    try {
      await downloadSeparator({
        title: last.NMCATEGORY,
        code: last.IDCATEGORY,
        filename: `Separador_${last.IDCATEGORY}.pdf`,
      });
    } catch (e) {
      console.error('Generar separador falló:', e);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-center w-full">Generador de Separadores</h1>
        </header>

        <CategoryCascade onPathChange={setPath} />

        <div className="flex gap-3 flex-wrap">
          <button
            className="bg-slate-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={generarUltimo}
            disabled={path.length === 0}
          >
            Generar separador
          </button>

          <button
            className="border px-4 py-2 rounded"
            onClick={() => setPath([])}
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
