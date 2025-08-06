// src/pages/CargaDocsPage-Refact.jsx
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import Card from '../components/Card'
import EmployeeSearchForm from '../components/EmployeeSearchForm'
import MetadataForm from '../components/MetadataForm'
import FileUploadForm from '../components/FileUploadForm'
import PdfViewer from '../components/PdfViewer'
import { useCatalogos } from '../hooks/useCatalogos'
import { useProcesamiento } from '../hooks/useProcesamiento'

export default function CargaDocsPageRefact() {
  const { user, isAuthenticated } = useAuth()
  const methods = useForm()
  const { sitios, ciudades, areas, grupos, tipos } = useCatalogos(user, isAuthenticated)

  const {
    empleado,
    numeroExpediente,
    onEmpleadoLoad,
    onFileChange,
    onEnviar,
    loading,
    successMessage,
    errorMessage,
    clearFeedback,    // ← desestructurarlo aquí
    pdfFile,
    scannedFile
  } = useProcesamiento()

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Formulario de Captura de Documentos RRHH
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl">
        {/* 1️⃣ BUSCADOR y tarjeta */}
        <div className="col-span-1">
          <EmployeeSearchForm onLoad={onEmpleadoLoad} />
          {empleado
            ? <Card empleado={empleado} />
            : <p className="text-gray-700">No existe información del empleado</p>
          }
        </div>

        {/* 2️⃣ METADATOS */}
        <FormProvider {...methods}>
          <div className="col-span-1">
            <MetadataForm
              sitios={sitios}
              ciudades={ciudades}
              areas={areas}
              grupos={grupos}
              tipos={tipos}
            />
          </div>

          {/* 3️⃣ CARGA DE ARCHIVO */}
          <div className="col-span-1">
            <FileUploadForm
              scannedFile={scannedFile}
              onFileChange={onFileChange}
              onEnviar={() =>
                methods.handleSubmit(d =>
                  onEnviar(d, numeroExpediente, empleado, user.username)
                )()
              }
              loading={loading}
              success={successMessage}
              error={errorMessage}
              clearFeedback={clearFeedback}   // ← y pasarlo como prop
            />
          </div>
        </FormProvider>

        {/* 4️⃣ VISOR PDF */}
        <div className="col-span-1 flex items-center justify-center border h-96">
          <PdfViewer fileUrl={pdfFile} />
        </div>
      </div>
    </div>
  )
}
