// src/components/softexpert/CategoryCascade.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { getCategoriesByOwner } from '../../api/categories';

// normaliza (quita acentos/minúsculas)
const norm = (s = '') =>
  s.toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function LevelCombobox({ label, value, options, query, onQuery, onChange }) {
  const [forceOpen, setForceOpen] = useState(false);
  const boxRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function onDocMouseDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setForceOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const handleQueryChange = (e) => {
    const v = e.target.value;
    onQuery(/^\s*$/.test(v) ? '' : v); // ignora solo-espacios
  };

  // Filtrado optimizado
  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return options;
    return options.filter(
      (o) => norm(o.NMCATEGORY).includes(q) || norm(o.IDCATEGORY).includes(q)
    );
  }, [options, query]);

  return (
    <div className="w-full" ref={boxRef}>
      <label className="font-semibold block mb-1">{label}</label>

      <Combobox
        value={value}
        onChange={(item) => {
          // ← FIX: cerrar y limpiar filtro al seleccionar
          onChange(item);
          setForceOpen(false);
          onQuery('');
        }}
        nullable
      >
        <div className="relative">
          <Combobox.Input
            className="w-full border rounded px-3 py-2"
            displayValue={(item) => (item ? `${item.NMCATEGORY} (${item.IDCATEGORY})` : '')}
            placeholder="Buscar por ID o Nombre…"
            onChange={handleQueryChange}
            onFocus={() => setForceOpen(true)}
            onClick={() => setForceOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setForceOpen(false);
            }}
            // cierra si pierdes foco sin seleccionar (con pequeño delay para permitir click en opción)
            onBlur={() => setTimeout(() => setForceOpen(false), 80)}
          />
          <Combobox.Button
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            onClick={() => setForceOpen((o) => !o)}
          >
            <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
          </Combobox.Button>

          <Transition
            show={forceOpen || !!query}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow ring-1 ring-black/5 focus:outline-none"
              onMouseDown={(e) => e.preventDefault()} // evita blur antes de seleccionar
            >
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
              ) : (
                filtered.map((opt) => (
                  <Combobox.Option
                    key={opt.CDCATEGORY}
                    value={opt}
                    className={({ active }) =>
                      `cursor-pointer select-none px-3 py-2 text-sm ${
                        active ? 'bg-slate-100' : ''
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center gap-2">
                        <span className="flex-1">
                          {opt.NMCATEGORY}{' '}
                          <span className="text-gray-500">({opt.IDCATEGORY})</span>
                        </span>
                        {selected && <CheckIcon className="h-4 w-4" />}
                      </div>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      <div className="text-xs text-gray-500 mt-1">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default function CategoryCascade({ onPathChange }) {
  const [levels, setLevels] = useState([
    { owner: 0, options: [], selected: null, loading: true, error: null, query: '' },
  ]);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    loadOptionsForLevel(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOptions = async (owner) => {
    if (cacheRef.current.has(owner)) return cacheRef.current.get(owner);
    const items = await getCategoriesByOwner(owner);
    cacheRef.current.set(owner, items);
    return items;
  };

  const loadOptionsForLevel = async (levelIndex, owner) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy[levelIndex] = {
        owner,
        options: [],
        selected: null,
        loading: true,
        error: null,
        query: '',
      };
      return copy;
    });

    try {
      const items = await fetchOptions(owner);
      setLevels((prev) => {
        const copy = [...prev];
        copy[levelIndex].options = items;
        copy[levelIndex].loading = false;
        return copy;
      });
    } catch (err) {
      setLevels((prev) => {
        const copy = [...prev];
        copy[levelIndex].loading = false;
        copy[levelIndex].error = err?.message || 'Error al cargar categorías';
        return copy;
      });
    }
  };

  const handleSelect = async (levelIndex, item) => {
    // cortar niveles posteriores y setear seleccionado
    setLevels((prev) => {
      const copy = prev.slice(0, levelIndex + 1);
      copy[levelIndex] = { ...copy[levelIndex], selected: item };
      return copy;
    });

    // notificar camino actual
    setTimeout(() => onPathChange?.(getSelectedPath()), 0);

    if (!item) return; // si borran selección

    // cargar hijos
    const children = await fetchOptions(item.CDCATEGORY);
    if (children.length > 0) {
      setLevels((prev) => [
        ...prev,
        {
          owner: item.CDCATEGORY,
          options: children,
          selected: null,
          loading: false,
          error: null,
          query: '',
        },
      ]);
    }
  };

  const updateQuery = (levelIndex, q) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy[levelIndex] = { ...copy[levelIndex], query: q };
      return copy;
    });
  };

  const getSelectedPath = () => levels.map((l) => l.selected).filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {levels.map((level, i) => (
        <div key={`level-${i}`} className="flex flex-col gap-2">
          {level.loading ? (
            <>
              <label className="font-semibold">
                {i === 0 ? 'Categoría padre' : `Nivel ${i + 1}`}
              </label>
              <span className="text-sm text-gray-500">Cargando…</span>
            </>
          ) : (
            <>
              <LevelCombobox
                label={i === 0 ? 'Categoría padre' : `Nivel ${i + 1}`}
                value={level.selected}
                options={level.options}
                query={level.query}
                onQuery={(q) => updateQuery(i, q)}
                onChange={(item) => handleSelect(i, item)}
              />
              {level.error && (
                <span className="text-sm text-red-600">{level.error}</span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
