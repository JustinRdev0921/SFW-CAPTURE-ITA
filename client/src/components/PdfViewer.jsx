import React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function PdfViewer({ fileUrl }) {
  const plugin = defaultLayoutPlugin()
  return (
    <div className="col-span-1 border h-96 flex flex-col overflow-auto min-w-[300px]">
  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
    {fileUrl ? (
      <div className="flex-1">
        <Viewer fileUrl={fileUrl} plugins={[plugin]} />
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center">
        Sin archivo PDF para visualizar
      </div>
    )}
  </Worker>
</div>
  )
}