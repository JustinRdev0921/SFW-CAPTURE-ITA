// src/hooks/useProcesamientoNoAttributes.js
import { useState } from 'react'
import { fileUploadRequest } from '../api/usuarios'
import { createProcesingNoAttsRequest } from '../api/procesing'
import { v4 as uuidv4 } from 'uuid'

export function useProcesamientoNoAttributes() {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccess] = useState('')
  const [errorMessage, setError] = useState('')
  const [pdfFile, setPDFFile] = useState(null)
  const [archivoSeleccionado, setArchivo] = useState(null)
  const [empleado, setEmpleado] = useState(null)
  const [numeroExpediente, setNumeroExpediente] = useState('')

  const clearFeedback = () => {
    setSuccess('')
    setError('')
  }

  const onEmpleadoLoad = (expediente, emp) => {
    setNumeroExpediente(expediente)
    setEmpleado(emp)
  }

  const onFileChange = e => {
    const file = e.target.files[0]
    setArchivo(file)
    if (file?.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = () => setPDFFile(reader.result)
      reader.readAsDataURL(file)
    } else {
      setPDFFile(null)
    }
  }

  const onEnviar = async (numeroExpediente, empleado, username) => {
    setLoading(true)
    try {
      const idProcesamiento = uuidv4()
      const nombreArchivo = `${idProcesamiento}-_-${numeroExpediente}`

      // 1️⃣ Subo el archivo
      const formData = new FormData()
      formData.append('numeroExpediente', numeroExpediente)
      formData.append('idProcesamiento', idProcesamiento)
      formData.append('archivo', archivoSeleccionado)
      formData.append('username', username)

      const uploadRes = await fileUploadRequest(formData)
      if (uploadRes.status !== 200) {
        setError('Error al cargar el archivo.')
        return
      }

      // 2️⃣ Registro el procesamiento en el nuevo endpoint
      await createProcesingNoAttsRequest({
        numeroExpediente,
        idProcesamiento,
        nombreArchivo,
        nombreArchivoOriginal: archivoSeleccionado.name,
        username,
        cedula: empleado.CEDULA,
        apellidos: empleado.APELLIDOS,
        nombres: empleado.NOMBRES,
        cargo: empleado.CARGO,
        division: empleado.DIVISION,
        seccion: empleado.SELECCION,
        ciudad: empleado.CIUDAD,
        estadoEmpleado: empleado.ESTADO
      })

      setSuccess('¡Proceso completado con éxito!')
    } catch (err) {
      console.error(err)
      setError('Error en el envío.')
    } finally {
      setLoading(false)
    }
  }

  return {
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
    scannedFile: archivoSeleccionado
  }
}
