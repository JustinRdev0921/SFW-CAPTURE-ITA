// src/components/ScannerSettings.jsx
import React, { useState } from 'react'

export default function ScannerSettings({ onFileChange }) {
  const [scanners, setScanners] = useState([])
  const [selectedScanner, setSelectedScanner] = useState('')
  const [isDuplex, setIsDuplex] = useState(false)
  const [pixelType, setPixelType] = useState('BW')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanError, setScanError] = useState(null)

  // Mapeo de nombres “raw” a friendly
  const friendlyNames = {
    'PaperStream IP fi-7160':       'Escáner Fujitsu',
    'TypeGeneric Network Scanner':  'Impresora Ricoh',
  }

  // 1️⃣ Consultar lista de escáners
  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await fetch('http://192.168.140.62:5000/api/scanners')
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      setScanners(data.scanners)
    } catch (err) {
      console.error(err)
      setError('No se pudo recuperar los escáners')
    } finally {
      setLoading(false)
    }
  }

  // 2️⃣ Iniciar escaneo
  const handleScan = async () => {
    if (!selectedScanner) {
      setScanError('Debe seleccionar un escáner primero')
      return
    }
    setLoading(true)
    setScanError(null)
    try {
      const selId = parseInt(selectedScanner, 10)
      const scanner = scanners.find(s => s.id === selId)
      if (!scanner) throw new Error('Scanner no encontrado')
      const scannerName = scanner.name

      const body = {
        scanner_name: scannerName,
        use_adf: true,
        use_duplex: isDuplex,
        pixel_type: pixelType.toLowerCase(),
      }
      const resp = await fetch('http://192.168.140.62:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

      // Leer blob y crear File
      const blob = await resp.blob()
      const file = new File([blob], 'scan_simulado.pdf', { type: 'application/pdf' })
      onFileChange({ target: { files: [file] } })
    } catch (err) {
      console.error(err)
      setScanError('Error al iniciar escaneo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center">
      {/* Botón para consultar escáneres */}
      <button
        type="button"
        onClick={handleFetch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Buscar Escáners
      </button>

      {/* Mensajes de carga o error */}
      {loading && <p className="mt-2 text-center">Cargando escáners...</p>}
      {error   && <p className="mt-2 text-red-500 text-center">{error}</p>}

      {scanners.length > 0 && (
        <div className="mt-4 space-y-4 w-full max-w-md">
          {/* Selección de escáner */}
          <div>
            <label htmlFor="scanner" className="block mb-1 font-medium">
              Escáner
            </label>
            <select
              id="scanner"
              value={selectedScanner}
              onChange={e => setSelectedScanner(e.target.value)}
              className="w-full bg-gray-200 rounded-md px-4 py-2"
            >
              <option value="">Selecciona un escáner</option>
              {scanners.map(scanner => (
                <option key={scanner.id} value={scanner.id}>
                  { friendlyNames[scanner.name] || scanner.name }
                </option>
              ))}
            </select>
          </div>

          {/* Duplex */}
          <div className="flex items-center">
            <input
              id="duplex"
              type="checkbox"
              checked={isDuplex}
              onChange={() => setIsDuplex(d => !d)}
              className="mr-2"
            />
            <label htmlFor="duplex" className="font-medium">
              Duplex
            </label>
          </div>

          {/* Tipo de píxel */}
          <div>
            <label htmlFor="pixelType" className="block mb-1 font-medium">
              Tipo de píxel
            </label>
            <select
              id="pixelType"
              value={pixelType}
              onChange={e => setPixelType(e.target.value)}
              className="w-full bg-gray-200 rounded-md px-4 py-2"
            >
              <option value="BW">Blanco/Negro</option>
              <option value="GRAY">Escala de Grises</option>
              <option value="COLOR">Color</option>
            </select>
          </div>

          {/* Botón de escaneo centrado */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {loading ? 'Escaneando…' : 'Iniciar escaneo'}
            </button>
          </div>

          {/* Mensaje de error de escaneo */}
          {scanError && (
            <p className="mt-2 text-red-500 text-center">{scanError}</p>
          )}
        </div>
      )}
    </div>
  )
}
