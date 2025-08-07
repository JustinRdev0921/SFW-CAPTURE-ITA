// src/pages/CargaDocsPage-Refact-NoAttributes.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import EmployeeSearchForm from '../components/EmployeeSearchForm'
import FileUploadForm from '../components/FileUploadForm'
import PdfViewer from '../components/PdfViewer'
import { useProcesamientoNoAttributes as useProcesamiento } from '../hooks/useProcesamientoNoAttributes'

export default function CargaDocsPageRefactNoAttributes() {
  const { user } = useAuth()

  const {
    empleado,
    numeroExpediente,
    onEmpleadoLoad,
    onFileChange,
    onEnviar,
    loading,
    successMessage,
    errorMessage,
    clearFeedback,
    pdfFile,
    scannedFile
  } = useProcesamiento()

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Formulario de Captura de Documentos RRHH
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-4 w-full max-w-7xl">
        {/* 1️⃣ BUSCADOR y tarjeta */}
        <div className="col-span-1">
          <EmployeeSearchForm onLoad={onEmpleadoLoad} />
          {empleado
            ? <Card empleado={empleado} />
            : <p className="text-gray-700">No existe información del empleado</p>
          }
        </div>

        {/* 2️⃣ CARGA DE ARCHIVO */}
        <div className="col-span-1">
          <FileUploadForm
            scannedFile={scannedFile}
            onFileChange={onFileChange}
            onEnviar={() => onEnviar(numeroExpediente, empleado, user.username)}
            loading={loading}
            success={successMessage}
            error={errorMessage}
            clearFeedback={clearFeedback}
          />
        </div>

        {/* 3️⃣ VISOR PDF */}
        <div className="col-span-1 flex items-center justify-center border h-96">
          <PdfViewer fileUrl={pdfFile} />
        </div>
      </div>
    </div>
  )
}
