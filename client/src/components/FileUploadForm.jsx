// src/components/FileUploadForm.jsx
import React, { useState, useRef, useEffect } from 'react'
import ScannerSettings from './ScannerSettings'

export default function FileUploadForm({
  scannedFile,
  onFileChange,
  onEnviar,
  loading,
  success,
  error,
  clearFeedback
}) {
  const [activePanel, setActivePanel] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!scannedFile || !inputRef.current) return
    const dt = new DataTransfer()
    dt.items.add(scannedFile)
    inputRef.current.files = dt.files
  }, [scannedFile])

  const switchPanel = panel => {
    clearFeedback()
    setActivePanel(panel)
  }

  return (
    <div className="col-span-1">
      {/* ── Botones de toggle centrados ── */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          type="button"
          onClick={() => switchPanel('upload')}
          className={`px-4 py-2 rounded ${
            activePanel === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-200 text-white'
          }`}
        >
          Cargar Archivo
        </button>
        <button
          type="button"
          onClick={() => switchPanel('scan')}
          className={`px-4 py-2 rounded ${
            activePanel === 'scan'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-200 text-white'
          }`}
        >
          Escanear Documento
        </button>
      </div>

      {/* ── Panel: Cargar Archivo ── */}
      {activePanel === 'upload' && (
        <div className="mb-4">
          <label className="block mb-2">Archivo PDF</label>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="w-full bg-gray-200 rounded-md px-4 py-2"
          />

          <button
            onClick={onEnviar}
            disabled={loading}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Enviar
          </button>

          {loading && <div className="loader mt-2">Cargando...</div>}
          {success && (
            <p className="mt-2 bg-green-500 text-white rounded p-2">
              {success}
            </p>
          )}
          {error && (
            <p className="mt-2 bg-red-500 text-white rounded p-2">
              {error}
            </p>
          )}
        </div>
      )}

      {/* ── Panel: Escáner ── */}
      {activePanel === 'scan' && (
        <div className="mb-4">
          <ScannerSettings onFileChange={onFileChange} />

          {/* ── Envío tras escaneo ── */}
           {scannedFile && (
           <>
             <button
               onClick={onEnviar}
               disabled={loading}
               className="mt-3 bg-green-500 text-white px-4 py-2 rounded w-full"
             >
               Enviar
             </button>

             {/* ── Feedback identical al panel de Cargar Archivo ── */}
             {loading && (
               <div className="loader mt-2">Cargando...</div>
             )}
             {success && (
               <p className="mt-2 bg-green-500 text-white rounded p-2">
                 {success}
               </p>
             )}
             {error && (
               <p className="mt-2 bg-red-500 text-white rounded p-2">
                 {error}
               </p>
             )}
           </>
         )}
        </div>
      )}
    </div>
  )
}
